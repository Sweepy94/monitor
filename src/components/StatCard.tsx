import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: number; // 1 = up, -1 = down, 0 = flat
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, trend = 0 }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-200 hover:bg-gray-750 hover:shadow-xl">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon}
      </div>
      <div className="mt-3 flex items-baseline">
        <p className="text-2xl font-semibold">
          {value}
          {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
        </p>
        
        {trend !== undefined && (
          <span className="ml-2 flex items-center text-sm">
            {trend > 0 ? (
              <>
                <ArrowUpRight className="h-4 w-4 text-green-400" />
                <span className="text-green-400">+5.2%</span>
              </>
            ) : trend < 0 ? (
              <>
                <ArrowDownRight className="h-4 w-4 text-red-400" />
                <span className="text-red-400">-2.1%</span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">0%</span>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;