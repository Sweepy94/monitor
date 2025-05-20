import { exec, spawn } from 'child_process';
import sqlite3 from 'sqlite3';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { promisify } from 'util';
import { formatDistance } from 'date-fns';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const geoip = require('geoip-lite');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  socketPort: 3001,
  db: {
    path: path.join(__dirname, '../data/monitor.db'),
  },
  dataRetention: {
    trafficEvents: '7 days',
    networkStats: '24 hours',
    protocolStats: '24 hours',
    systemStats: '24 hours',
    activeConnections: '1 hour',
  },
  updateInterval: 3000, // 3 seconds
  interfaces: [],      // Will be auto-detected
  anomalyThresholds: {
    packetsPerSecond: 500,
    mbps: 10,
    connectionCount: 100,
  }
};

// Initialize SQLite database
const db = new sqlite3.Database(CONFIG.db.path, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database');
});

// Create database schema if not exists
async function initializeDatabase() {
  try {
    const initSqlPath = path.join(__dirname, 'db/init.sql');
    if (fs.existsSync(initSqlPath)) {
      const initSql = fs.readFileSync(initSqlPath, 'utf8');
      return new Promise((resolve, reject) => {
        db.exec(initSql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Create HTTP server and Socket.IO instance
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Network interfaces detection
async function detectInterfaces() {
  try {
    const { stdout } = await execAsync('ip -o link show | grep -v "lo:" | awk -F\': \' \'{print $2}\'');
    CONFIG.interfaces = stdout.trim().split('\n');
    console.log('Detected network interfaces:', CONFIG.interfaces);
  } catch (error) {
    console.error('Error detecting network interfaces:', error);
    CONFIG.interfaces = ['eth0']; // Fallback to eth0
  }
}

// Initialize packet capture process
let tcpdumpProcess = null;

function startPacketCapture() {
  // Construct the networkInterface list for tcpdump
  const interfaceArgs = CONFIG.interfaces.map(iface => `-i ${iface}`).join(' ');
  
  const tcpdumpCmd = `tcpdump -n -tt ${interfaceArgs} -l`;
  
  console.log(`Starting packet capture with command: ${tcpdumpCmd}`);
  
  tcpdumpProcess = spawn('tcpdump', ['-n', '-tt', ...CONFIG.interfaces.flatMap(iface => ['-i', iface]), '-l']);
  
  tcpdumpProcess.stdout.on('data', (data) => {
    // Process tcpdump output
    const lines = data.toString().trim().split('\n');
    lines.forEach(processPacket);
  });
  
  tcpdumpProcess.stderr.on('data', (data) => {
    console.log(`tcpdump stderr: ${data}`);
  });
  
  tcpdumpProcess.on('close', (code) => {
    console.log(`tcpdump process exited with code ${code}`);
    // Restart tcpdump if it crashes
    if (code !== 0) {
      console.log('Restarting packet capture in 5 seconds...');
      setTimeout(startPacketCapture, 5000);
    }
  });
}

// Process a single packet from tcpdump output
function processPacket(line) {
  // Example tcpdump output: 1622109638.052577 IP 192.168.1.100.52642 > 93.184.216.34.443: Flags [S], seq 1950794214, win 64240, options [mss 1460,sackOK,TS val 1622678 ecr 0,nop,wscale 7], length 0
  try {
    // Extract timestamp, IPs, ports, protocol, flags
    const timestampMatch = line.match(/^(\d+\.\d+)/);
    const ipMatch = line.match(/IP (\d+\.\d+\.\d+\.\d+)\.(\d+) > (\d+\.\d+\.\d+\.\d+)\.(\d+)/);
    const protocolMatch = line.match(/: (\w+)/);
    const flagsMatch = line.match(/Flags \[([^\]]+)\]/);
    const lengthMatch = line.match(/length (\d+)/);
    const interfaceMatch = line.match(/^[^:]+: ([^\s:]+):/);

    if (ipMatch) {
      const packet = {
        timestamp: timestampMatch ? new Date(parseFloat(timestampMatch[1]) * 1000).toISOString() : new Date().toISOString(),
        source_ip: ipMatch[1],
        source_port: parseInt(ipMatch[2], 10),
        destination_ip: ipMatch[3],
        destination_port: parseInt(ipMatch[4], 10),
        protocol: protocolMatch ? protocolMatch[1] : 'UNKNOWN',
        flags: flagsMatch ? flagsMatch[1] : '',
        packet_size: lengthMatch ? parseInt(lengthMatch[1], 10) : 0,
        networkInterface: interfaceMatch ? interfaceMatch[1] : 'unknown'
      };

      // Store packet data
      storeTrafficEvent(packet);
      
      // Update statistics
      updateNetworkStats(packet);
      updateProtocolStats(packet);
    }
  } catch (error) {
    console.error('Error processing packet:', error, line);
  }
}

// Store traffic event in database
function storeTrafficEvent(packet) {
  const sql = `
    INSERT INTO traffic_events 
    (timestamp, source_ip, destination_ip, protocol, source_port, destination_port, packet_size, flags, interface)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    packet.timestamp,
    packet.source_ip,
    packet.destination_ip,
    packet.protocol,
    packet.source_port,
    packet.destination_port,
    packet.packet_size,
    packet.flags,
    packet.networkInterface
  ], function(err) {
    if (err) {
      console.error('Error storing traffic event:', err.message);
    }
  });
}

// Track network stats per networkInterface
const networkStatsCache = new Map();

function updateNetworkStats(packet) {
  const networkInterface = packet.networkInterface;
  const now = Date.now();
  
  if (!networkStatsCache.has(networkInterface)) {
    networkStatsCache.set(networkInterface, {
      lastUpdate: now,
      packets_in: 0,
      packets_out: 0,
      bytes_in: 0,
      bytes_out: 0,
      lastPacketsIn: 0,
      lastPacketsOut: 0,
      lastBytesIn: 0,
      lastBytesOut: 0
    });
  }
  
  const stats = networkStatsCache.get(networkInterface);
  
  // Update packet and byte counts
  if (packet.destination_ip.startsWith('192.168.') || 
      packet.destination_ip.startsWith('10.') || 
      packet.destination_ip.startsWith('172.16.')) {
    // Incoming traffic (to local network)
    stats.packets_in++;
    stats.bytes_in += packet.packet_size;
  } else {
    // Outgoing traffic
    stats.packets_out++;
    stats.bytes_out += packet.packet_size;
  }
  
  // Calculate rates every second
  const timeDiff = (now - stats.lastUpdate) / 1000;
  if (timeDiff >= 1) {
    const packetsInDiff = stats.packets_in - stats.lastPacketsIn;
    const packetsOutDiff = stats.packets_out - stats.lastPacketsOut;
    const bytesInDiff = stats.bytes_in - stats.lastBytesIn;
    const bytesOutDiff = stats.bytes_out - stats.lastBytesOut;
    
    const packetsPerSecond = (packetsInDiff + packetsOutDiff) / timeDiff;
    const mbpsIn = (bytesInDiff * 8) / (timeDiff * 1000000); // Convert to Mbps
    const mbpsOut = (bytesOutDiff * 8) / (timeDiff * 1000000);
    
    // Store network stats in database
    const sql = `
      INSERT INTO network_stats 
      (timestamp, interface, packets_in, packets_out, bytes_in, bytes_out, packets_per_second, mbps_in, mbps_out)
      VALUES (datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      networkInterface,
      stats.packets_in,
      stats.packets_out,
      stats.bytes_in,
      stats.bytes_out,
      packetsPerSecond,
      mbpsIn,
      mbpsOut
    ]);
    
    // Check for anomalies
    checkForAnomalies(networkInterface, packetsPerSecond, mbpsIn + mbpsOut);
    
    // Update last values for next calculation
    stats.lastUpdate = now;
    stats.lastPacketsIn = stats.packets_in;
    stats.lastPacketsOut = stats.packets_out;
    stats.lastBytesIn = stats.bytes_in;
    stats.lastBytesOut = stats.bytes_out;
  }
}

// Track protocol statistics
const protocolStatsCache = new Map();

function updateProtocolStats(packet) {
  const protocol = packet.protocol;
  const now = Date.now();
  
  if (!protocolStatsCache.has(protocol)) {
    protocolStatsCache.set(protocol, {
      lastUpdate: now,
      count: 0,
      bytes_total: 0
    });
  }
  
  const stats = protocolStatsCache.get(protocol);
  
  // Update counts
  stats.count++;
  stats.bytes_total += packet.packet_size;
  
  // Update database every 5 seconds
  if (now - stats.lastUpdate >= 5000) {
    const sql = `
      INSERT INTO protocol_stats 
      (timestamp, protocol, count, bytes_total)
      VALUES (datetime('now'), ?, ?, ?)
    `;
    
    db.run(sql, [protocol, stats.count, stats.bytes_total]);
    
    stats.lastUpdate = now;
  }
}

// Check for traffic anomalies
function checkForAnomalies(networkInterface, packetsPerSecond, mbps) {
  const anomalies = [];
  
  if (packetsPerSecond > CONFIG.anomalyThresholds.packetsPerSecond) {
    anomalies.push({
      type: 'HIGH_PACKETS_RATE',
      networkInterface,
      value: packetsPerSecond,
      threshold: CONFIG.anomalyThresholds.packetsPerSecond,
      timestamp: new Date().toISOString()
    });
  }
  
  if (mbps > CONFIG.anomalyThresholds.mbps) {
    anomalies.push({
      type: 'HIGH_BANDWIDTH_USAGE',
      networkInterface,
      value: mbps,
      threshold: CONFIG.anomalyThresholds.mbps,
      timestamp: new Date().toISOString()
    });
  }
  
  // Emit anomalies to clients
  if (anomalies.length > 0) {
    io.emit('anomalies', anomalies);
    console.log('Anomalies detected:', anomalies);
  }
}

// Get system statistics (CPU, memory)
async function getSystemStats() {
  try {
    // Get CPU usage
    const { stdout: cpuInfo } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'");
    const cpuUsage = parseFloat(cpuInfo.trim());
    
    // Get memory usage
    const { stdout: memInfo } = await execAsync("free -m | grep Mem | awk '{print $2, $3, $4}'");
    const [memTotal, memUsed] = memInfo.trim().split(' ').map(num => parseInt(num, 10));
    const memPercent = (memUsed / memTotal) * 100;
    
    // Get load average
    const { stdout: loadAvg } = await execAsync("cat /proc/loadavg | awk '{print $1, $2, $3}'");
    
    // Store in database
    const sql = `
      INSERT INTO system_stats 
      (timestamp, cpu_usage, memory_used, memory_total, memory_percent, load_avg)
      VALUES (datetime('now'), ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [cpuUsage, memUsed, memTotal, memPercent, loadAvg.trim()]);
    
    return {
      cpu_usage: cpuUsage,
      memory: {
        used: memUsed,
        total: memTotal,
        percent: memPercent
      },
      load_avg: loadAvg.trim()
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    return null;
  }
}

// Get active network connections
async function getActiveConnections() {
  try {
    // Use ss command to get active connections
    const { stdout } = await execAsync("ss -tnp | grep -v 'Local Address:Port' | awk '{print $4, $5, $6}'");
    const lines = stdout.trim().split('\n');
    
    const connections = [];
    const uniqueConnections = new Set();
    
    for (const line of lines) {
      const parts = line.split(' ');
      if (parts.length >= 2) {
        const [localAddr, remoteAddr] = parts;
        const [sourceIp, sourcePort] = localAddr.split(':');
        const [destIp, destPort] = remoteAddr.split(':');
        
        // Skip localhost connections
        if (sourceIp === '127.0.0.1' || destIp === '127.0.0.1') {
          continue;
        }
        
        const connectionKey = `${sourceIp}:${sourcePort}-${destIp}:${destPort}`;
        if (!uniqueConnections.has(connectionKey)) {
          uniqueConnections.add(connectionKey);
          
          connections.push({
            source_ip: sourceIp,
            source_port: parseInt(sourcePort, 10),
            destination_ip: destIp,
            destination_port: parseInt(destPort, 10),
            protocol: 'TCP',
            state: parts[2] || 'UNKNOWN',
            geo: geoip.lookup(destIp)
          });
        }
      }
    }
    
    // Store in database (limited to 100 most recent)
    if (connections.length > 0) {
      const sql = `
        INSERT INTO active_connections 
        (timestamp, source_ip, destination_ip, protocol, source_port, destination_port, state)
        VALUES (datetime('now'), ?, ?, ?, ?, ?, ?)
      `;
      
      for (let i = 0; i < Math.min(connections.length, 100); i++) {
        const conn = connections[i];
        db.run(sql, [
          conn.source_ip,
          conn.destination_ip,
          conn.protocol,
          conn.source_port,
          conn.destination_port,
          conn.state
        ]);
      }
    }
    
    return connections;
  } catch (error) {
    console.error('Error getting active connections:', error);
    return [];
  }
}

// Clean up old data
async function cleanupOldData() {
  const cleanup = [
    { table: 'traffic_events', period: CONFIG.dataRetention.trafficEvents },
    { table: 'network_stats', period: CONFIG.dataRetention.networkStats },
    { table: 'protocol_stats', period: CONFIG.dataRetention.protocolStats },
    { table: 'system_stats', period: CONFIG.dataRetention.systemStats },
    { table: 'active_connections', period: CONFIG.dataRetention.activeConnections }
  ];
  
  for (const { table, period } of cleanup) {
    const sql = `DELETE FROM ${table} WHERE timestamp < datetime('now', '-${period}')`;
    db.run(sql, function(err) {
      if (err) {
        console.error(`Error cleaning up old data from ${table}:`, err.message);
      } else if (this.changes > 0) {
        console.log(`Cleaned up ${this.changes} old records from ${table}`);
      }
    });
  }
}

// Get traffic statistics for the dashboard
async function getTrafficStats() {
  return new Promise((resolve, reject) => {
    const stats = {
      totalPackets: 0,
      avgPacketsPerSecond: 0,
      avgMbps: 0,
      topSourceIps: [],
      topDestinationIps: [],
      protocolDistribution: [],
      recentTraffic: []
    };
    
    // Get total packets
    db.get('SELECT COUNT(*) as count FROM traffic_events', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      stats.totalPackets = row.count;
      
      // Get average packets per second and Mbps
      const avgSql = `
        SELECT AVG(packets_per_second) as avg_pps, AVG(mbps_in + mbps_out) as avg_mbps
        FROM network_stats 
        WHERE timestamp > datetime('now', '-1 hour')
      `;
      
      db.get(avgSql, (err, row) => {
        if (!err && row) {
          stats.avgPacketsPerSecond = row.avg_pps || 0;
          stats.avgMbps = row.avg_mbps || 0;
        }
        
        // Get top source IPs
        const topSourceSql = `
          SELECT source_ip, COUNT(*) as count 
          FROM traffic_events 
          WHERE timestamp > datetime('now', '-1 hour')
          GROUP BY source_ip 
          ORDER BY count DESC 
          LIMIT 5
        `;
        
        db.all(topSourceSql, (err, rows) => {
          if (!err && rows) {
            stats.topSourceIps = rows.map(row => ({
              ip: row.source_ip,
              count: row.count,
              geo: geoip.lookup(row.source_ip)
            }));
          }
          
          // Get top destination IPs
          const topDestSql = `
            SELECT destination_ip, COUNT(*) as count 
            FROM traffic_events 
            WHERE timestamp > datetime('now', '-1 hour')
            GROUP BY destination_ip 
            ORDER BY count DESC 
            LIMIT 5
          `;
          
          db.all(topDestSql, (err, rows) => {
            if (!err && rows) {
              stats.topDestinationIps = rows.map(row => ({
                ip: row.destination_ip,
                count: row.count,
                geo: geoip.lookup(row.destination_ip)
              }));
            }
            
            // Get protocol distribution
            const protocolSql = `
              SELECT protocol, COUNT(*) as count 
              FROM traffic_events 
              WHERE timestamp > datetime('now', '-1 hour')
              GROUP BY protocol
            `;
            
            db.all(protocolSql, (err, rows) => {
              if (!err && rows) {
                stats.protocolDistribution = rows;
              }
              
              // Get recent traffic data (last 5 minutes)
              const recentSql = `
                SELECT interface, 
                       packets_per_second, 
                       mbps_in + mbps_out as mbps,
                       timestamp
                FROM network_stats 
                WHERE timestamp > datetime('now', '-5 minutes')
                ORDER BY timestamp
              `;
              
              db.all(recentSql, (err, rows) => {
                if (!err && rows) {
                  stats.recentTraffic = rows;
                }
                
                resolve(stats);
              });
            });
          });
        });
      });
    });
  });
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  sendDashboardData(socket);
  
  // Handle client requests
  socket.on('getTrafficStats', async () => {
    try {
      const stats = await getTrafficStats();
      socket.emit('trafficStats', stats);
    } catch (error) {
      console.error('Error getting traffic stats:', error);
    }
  });
  
  socket.on('getSystemStats', async () => {
    try {
      const stats = await getSystemStats();
      socket.emit('systemStats', stats);
    } catch (error) {
      console.error('Error getting system stats:', error);
    }
  });
  
  socket.on('getActiveConnections', async () => {
    try {
      const connections = await getActiveConnections();
      socket.emit('activeConnections', connections);
    } catch (error) {
      console.error('Error getting active connections:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Send dashboard data to clients
async function sendDashboardData(socket) {
  try {
    const [trafficStats, systemStats, activeConnections] = await Promise.all([
      getTrafficStats(),
      getSystemStats(),
      getActiveConnections()
    ]);
    
    const dashboardData = {
      trafficStats,
      systemStats,
      activeConnections,
      timestamp: new Date().toISOString()
    };
    
    if (socket) {
      socket.emit('dashboardData', dashboardData);
    } else {
      io.emit('dashboardData', dashboardData);
    }
  } catch (error) {
    console.error('Error sending dashboard data:', error);
  }
}

// Start the application
async function start() {
  try {
    await initializeDatabase();
    await detectInterfaces();
    
    // Start HTTP server for Socket.IO
    httpServer.listen(CONFIG.socketPort, () => {
      console.log(`Socket.IO server running on port ${CONFIG.socketPort}`);
    });
    
    // Start packet capture
    startPacketCapture();
    
    // Set up periodic tasks
    setInterval(() => sendDashboardData(), CONFIG.updateInterval);
    setInterval(() => getSystemStats(), 10000);
    setInterval(() => getActiveConnections(), 15000);
    setInterval(() => cleanupOldData(), 3600000); // Every hour
    
    console.log('L4 DDoS Monitor backend started successfully');
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

// Handle shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  if (tcpdumpProcess) {
    tcpdumpProcess.kill();
  }
  db.close();
  process.exit(0);
});

// Start the application
start();