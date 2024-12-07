/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.16.11.24",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
