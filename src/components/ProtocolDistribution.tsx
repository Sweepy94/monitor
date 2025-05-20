import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProtocolData {
  protocol: string;
  count: number;
}

interface ProtocolDistributionProps {
  data: ProtocolData[];
}

const ProtocolDistribution: React.FC<ProtocolDistributionProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.protocol),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Blue - TCP
          'rgba(75, 192, 192, 0.8)',  // Teal - UDP
          'rgba(255, 206, 86, 0.8)',  // Yellow - ICMP
          'rgba(153, 102, 255, 0.8)', // Purple - other
          'rgba(255, 99, 132, 0.8)',  // Red
          'rgba(255, 159, 64, 0.8)',  // Orange
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const calculateTotal = () => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  return (
    <div>
      <div className="h-64">
        {data && data.length > 0 ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No protocol data available</p>
          </div>
        )}
      </div>
      
      {data && data.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Protocol Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            {data.map((item) => (
              <div key={item.protocol} className="flex justify-between">
                <span className="text-gray-400">{item.protocol}</span>
                <span className="font-mono">
                  {item.count} 
                  <span className="text-gray-500 text-xs ml-1">
                    ({Math.round((item.count / calculateTotal()) * 100)}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="font-mono font-semibold">{calculateTotal()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolDistribution;