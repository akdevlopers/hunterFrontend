/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meetay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zd537dmbubpdipul2vm6g5feti0xfjpt.lambda-url.ap-south-1.on.aws",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://zd537dmbubpdipul2vm6g5feti0xfjpt.lambda-url.ap-south-1.on.aws/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
