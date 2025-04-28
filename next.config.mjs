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
            {
                protocol: "http",
                hostname: "172.16.11.24",
                port: "8080",
                pathname: "/filemanager/**",
            },
        ],
    },
};

export default nextConfig;
