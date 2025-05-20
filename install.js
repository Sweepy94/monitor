// Node.js installation helper for L4 DDoS Monitor
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('╔═════════════════════════════════════════════╗');
console.log('║    L4 DDoS Monitor Development Setup        ║');
console.log('╚═════════════════════════════════════════════╝');

// Function to execute a command and print output
function runCommand(command) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${error.message}`);
    return false;
  }
}

// Check Node.js and npm versions
console.log('Checking Node.js and npm versions...');
const nodeVersion = execSync('node --version').toString().trim();
console.log(`Node.js version: ${nodeVersion}`);
const npmVersion = execSync('npm --version').toString().trim();
console.log(`npm version: ${npmVersion}`);

// Create required directories
console.log('Creating required directories...');
const dirs = ['./data', './backend/db'];
dirs.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Initialize SQLite database
console.log('Initializing SQLite database...');
if (!existsSync('./data/monitor.db')) {
  try {
    const initScript = `
    CREATE TABLE IF NOT EXISTS traffic_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      source_ip TEXT,
      destination_ip TEXT,
      protocol TEXT,
      source_port INTEGER,
      destination_port INTEGER,
      packet_size INTEGER,
      flags TEXT,
      interface TEXT
    );

    CREATE TABLE IF NOT EXISTS network_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      interface TEXT,
      packets_in INTEGER,
      packets_out INTEGER,
      bytes_in INTEGER,
      bytes_out INTEGER,
      packets_per_second REAL,
      mbps_in REAL,
      mbps_out REAL
    );

    CREATE TABLE IF NOT EXISTS protocol_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      protocol TEXT,
      count INTEGER,
      bytes_total INTEGER
    );

    CREATE TABLE IF NOT EXISTS system_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      cpu_usage REAL,
      memory_used INTEGER,
      memory_total INTEGER,
      memory_percent REAL,
      load_avg TEXT
    );

    CREATE TABLE IF NOT EXISTS active_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      source_ip TEXT,
      destination_ip TEXT,
      protocol TEXT,
      source_port INTEGER,
      destination_port INTEGER,
      state TEXT,
      process_name TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_traffic_events_timestamp ON traffic_events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_traffic_events_source_ip ON traffic_events(source_ip);
    CREATE INDEX IF NOT EXISTS idx_network_stats_timestamp ON network_stats(timestamp);
    CREATE INDEX IF NOT EXISTS idx_protocol_stats_timestamp ON protocol_stats(timestamp);
    `;
    writeFileSync('./backend/db/init.sql', initScript);
    runCommand('cat ./backend/db/init.sql | sqlite3 ./data/monitor.db');
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Install dependencies
console.log('Installing npm dependencies...');
if (runCommand('npm install')) {
  console.log('Dependencies installed successfully');
} else {
  console.error('Failed to install dependencies');
  process.exit(1);
}

console.log('\n╔═════════════════════════════════════════════╗');
console.log('║    Development setup completed successfully ║');
console.log('╚═════════════════════════════════════════════╝');
console.log('\nTo start the backend monitoring service:');
console.log('  npm run backend');
console.log('\nTo start the development server:');
console.log('  npm run dev');
console.log('\nProduction deployment:');
console.log('  Run install.sh as root on your server');