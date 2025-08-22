/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    
    console.log('Next.js rewrites設定:', {
      apiBaseUrl,
      envVar: process.env.NEXT_PUBLIC_API_BASE_URL
    });
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
