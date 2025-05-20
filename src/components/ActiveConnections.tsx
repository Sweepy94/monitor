import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Connection {
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  state: string;
  geo?: {
    country?: string;
    city?: string;
    ll?: [number, number];
  } | null;
}

interface ActiveConnectionsProps {
  connections: Connection[];
}

const ActiveConnections: React.FC<ActiveConnectionsProps> = ({ connections }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterProtocol, setFilterProtocol] = useState<string | null>(null);
  const connectionsPerPage = 7;

  // Apply filters
  const filteredConnections = connections.filter(conn => 
    !filterProtocol || conn.protocol === filterProtocol
  );

  // Calculate pagination
  const indexOfLastConnection = currentPage * connectionsPerPage;
  const indexOfFirstConnection = indexOfLastConnection - connectionsPerPage;
  const currentConnections = filteredConnections.slice(
    indexOfFirstConnection,
    indexOfLastConnection
  );
  const totalPages = Math.ceil(filteredConnections.length / connectionsPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          Showing {filteredConnections.length} connections
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            className="bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5"
            value={filterProtocol || ''}
            onChange={(e) => setFilterProtocol(e.target.value || null)}
          >
            <option value="">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="ICMP">ICMP</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Protocol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentConnections.length > 0 ? (
              currentConnections.map((conn, index) => (
                <tr key={index} className="hover:bg-gray-750">
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-mono">
                    {conn.source_ip}:{conn.source_port}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-mono">
                    {conn.destination_ip}:{conn.destination_port}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${conn.protocol === 'TCP' ? 'bg-blue-900 text-blue-200' : 
                        conn.protocol === 'UDP' ? 'bg-green-900 text-green-200' : 
                        'bg-yellow-900 text-yellow-200'}`}>
                      {conn.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm">
                    {conn.state}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm">
                    {conn.geo ? (
                      <span className="text-gray-300">
                        {conn.geo.country}{conn.geo.city ? `, ${conn.geo.city}` : ''}
                      </span>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                  No active connections
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-700 pt-3 mt-3">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveConnections;