import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import TrafficChart from './TrafficChart';
import ProtocolDistribution from './ProtocolDistribution';
import SystemStats from './SystemStats';
import ActiveConnections from './ActiveConnections';
import StatCard from './StatCard';
import { Network, Activity, Zap, Server, Clock, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { socket, dashboardData } = useSocket();
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!socket) return;

    socket.on('anomalies', (newAnomalies) => {
      setAnomalies((prev) => [...newAnomalies, ...prev].slice(0, 10));
    });

    socket.on('dashboardData', () => {
      setLastUpdate(new Date());
    });

    // Cleanup
    return () => {
      socket.off('anomalies');
      socket.off('dashboardData');
    };
  }, [socket]);

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-60 bg-gray-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-700 rounded col-span-1"></div>
                <div className="h-20 bg-gray-700 rounded col-span-1"></div>
                <div className="h-20 bg-gray-700 rounded col-span-1"></div>
              </div>
              <div className="h-60 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { trafficStats, systemStats, activeConnections } = dashboardData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Traffic Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock size={16} />
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>

      {anomalies.length > 0 && (
        <div className="mb-6">
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
            <h2 className="flex items-center text-lg font-semibold text-red-400 mb-2">
              <AlertTriangle size={20} className="mr-2" />
              Anomalies Detected
            </h2>
            <div className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="w-32 text-gray-400">
                    {new Date(anomaly.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="w-32 text-red-400">{anomaly.type}</span>
                  <span>
                    Interface <span className="text-blue-400">{anomaly.interface}</span>:{' '}
                    <span className="text-yellow-400">{anomaly.value.toFixed(2)}</span> (Threshold:{' '}
                    <span className="text-green-400">{anomaly.threshold}</span>)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Packets Per Second" 
          value={trafficStats.avgPacketsPerSecond.toFixed(2)} 
          unit="pps"
          icon={<Activity size={24} className="text-blue-500" />}
          trend={1}
        />
        <StatCard 
          title="Network Throughput" 
          value={trafficStats.avgMbps.toFixed(2)} 
          unit="Mbps"
          icon={<Zap size={24} className="text-yellow-500" />}
          trend={0}
        />
        <StatCard 
          title="Active Connections" 
          value={activeConnections?.length || 0} 
          icon={<Network size={24} className="text-green-500" />}
          trend={-1}
        />
        <StatCard 
          title="CPU Usage" 
          value={systemStats?.cpu_usage?.toFixed(1) || 0} 
          unit="%"
          icon={<Server size={24} className="text-purple-500" />}
          trend={1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Network Traffic</h2>
          <TrafficChart trafficData={trafficStats.recentTraffic || []} />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Protocol Distribution</h2>
          <ProtocolDistribution data={trafficStats.protocolDistribution || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Active Connections</h2>
          <ActiveConnections connections={activeConnections || []} />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">System Stats</h2>
          <SystemStats stats={systemStats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;