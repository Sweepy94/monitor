import React from 'react';
import { Shield, Activity, BarChart2, Settings, Server, User, AlertTriangle, HelpCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-white">L4 DDoS Monitor</h1>
            <p className="text-xs text-gray-400">Real-time traffic analysis</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <a href="#" className="bg-gray-900 text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
          <Activity className="text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
          Dashboard
        </a>
        
        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
          <BarChart2 className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
          Traffic Analysis
        </a>
        
        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
          <Server className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
          Network Interfaces
        </a>
        
        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
          <AlertTriangle className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-5 w-5" />
          Alerts
        </a>
      </nav>
      
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <User className="text-gray-400 mr-3 h-5 w-5" />
          <span className="text-sm text-gray-300">System Admin</span>
        </div>
        <div className="flex mt-3 space-x-3">
          <button className="flex-1 text-xs text-gray-400 hover:text-white flex items-center justify-center py-1">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </button>
          <button className="flex-1 text-xs text-gray-400 hover:text-white flex items-center justify-center py-1">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;