/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure Socket.IO for both development and production
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? '/socket.io/:path*'
          : 'http://localhost:3001/socket.io/:path*',
        basePath: false
      }
    ];
  }
};

export default nextConfig;