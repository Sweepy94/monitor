import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface TrafficDataPoint {
  interface: string;
  packets_per_second: number;
  mbps: number;
  timestamp: string;
}

interface TrafficChartProps {
  trafficData: TrafficDataPoint[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ trafficData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [chartType, setChartType] = useState<'packets' | 'mbps'>('packets');

  useEffect(() => {
    if (!trafficData || trafficData.length === 0) return;

    // Group by interface
    const interfaces = [...new Set(trafficData.map(item => item.interface))];
    
    // Create a dataset for each interface
    const datasets = interfaces.map((iface, index) => {
      const color = getColor(index);
      const ifaceData = trafficData.filter(item => item.interface === iface);
      
      return {
        label: `${iface} ${chartType === 'packets' ? '(pps)' : '(Mbps)'}`,
        data: ifaceData.map(item => ({
          x: new Date(item.timestamp),
          y: chartType === 'packets' ? item.packets_per_second : item.mbps
        })),
        borderColor: color,
        backgroundColor: `${color}33`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false
      };
    });

    setChartData({
      labels: trafficData.map(item => new Date(item.timestamp)),
      datasets
    });
  }, [trafficData, chartType]);

  const getColor = (index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#ec4899', // pink
    ];
    return colors[index % colors.length];
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'minute' as const,
          tooltipFormat: 'HH:mm:ss',
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              chartType === 'packets'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setChartType('packets')}
          >
            Packets/s
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              chartType === 'mbps'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setChartType('mbps')}
          >
            Mbps
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {trafficData && trafficData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No traffic data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficChart;