/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    productionBrowserSourceMaps: false,
    compress: true,
    swcMinify: true,
    poweredByHeader: false,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "newpl1api.qhami.com",
                port: "",
                pathname: "/filemanager/**",
            },
            {
                protocol: "https",
                hostname: "api.mresalat.ir",
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
    compiler:{
//         removeConsole:true,
        styledComponents:true,
    }
};

export default nextConfig;
