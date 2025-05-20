import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';
import { useSocket } from '../context/SocketContext';

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      setIsLoading(false);
    }
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>L4 DDoS Monitor</title>
        <meta name="description" content="Real-time Layer 4 DDoS traffic monitoring" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Connecting to monitoring service...</p>
              </div>
            </div>
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </>
  );
}