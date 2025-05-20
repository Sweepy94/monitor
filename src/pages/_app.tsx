import React from 'react';
import type { AppProps } from 'next/app';
import { SocketProvider } from '../context/SocketContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}