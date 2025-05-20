import React from 'react';
import { Cpu, HardDrive, Thermometer, Activity } from 'lucide-react';

interface SystemStatsProps {
  stats: {
    cpu_usage: number;
    memory: {
      used: number;
      total: number;
      percent: number;
    };
    load_avg: string;
  } | null;
}

const SystemStats: React.FC<SystemStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No system stats available</p>
      </div>
    );
  }

  const { cpu_usage, memory, load_avg } = stats;
  const loadAvgValues = load_avg.split(' ').map(parseFloat);

  // Helper function to determine color based on value
  const getColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'bg-green-500';
    if (value < thresholds[1]) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* CPU Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <Cpu size={16} className="mr-2" />
            <span>CPU Usage</span>
          </div>
          <span className="font-mono">{cpu_usage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getColor(cpu_usage, [50, 80])}`}
            style={{ width: `${cpu_usage}%` }}
          ></div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <HardDrive size={16} className="mr-2" />
            <span>Memory</span>
          </div>
          <span className="font-mono">
            {memory.used} MB / {memory.total} MB
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getColor(memory.percent, [60, 85])}`}
            style={{ width: `${memory.percent}%` }}
          ></div>
        </div>
        <div className="text-xs text-right text-gray-400">
          {memory.percent.toFixed(1)}% used
        </div>
      </div>

      {/* Load Average */}
      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <Activity size={16} className="mr-2" />
          <span>Load Average</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700 rounded-lg p-2">
            <div className="text-xs text-gray-400">1 min</div>
            <div className="font-mono text-sm mt-1">{loadAvgValues[0].toFixed(2)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-2">
            <div className="text-xs text-gray-400">5 min</div>
            <div className="font-mono text-sm mt-1">{loadAvgValues[1].toFixed(2)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-2">
            <div className="text-xs text-gray-400">15 min</div>
            <div className="font-mono text-sm mt-1">{loadAvgValues[2].toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* System Temperature (mock data) */}
      <div className="space-y-2">
        <div className="flex items-center text-gray-300">
          <Thermometer size={16} className="mr-2" />
          <span>System Temperature</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm">CPU</span>
          <span className="font-mono text-sm">{Math.round(35 + cpu_usage / 4)}°C</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;