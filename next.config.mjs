/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "newpl1api.qhami.com",
        port: "",
        pathname: "/filemanager/**",
      },
    ],
  },
};

export default nextConfig;
