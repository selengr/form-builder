import type { NextConfig } from "next";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const nextConfig: NextConfig = {
    allowedDevOrigins: ['mbz2.ir'],
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    reactStrictMode: true,
    output: "standalone",
    productionBrowserSourceMaps: false,
    compress: true,
    poweredByHeader: false,
    reactCompiler: true,
    typedRoutes: false,
    devIndicators: {
        position: "top-right",
    },
    logging: {
        browserToTerminal: "warn",
        fetches: {
            fullUrl: true,
            hmrRefreshes: false,
        },
        serverFunctions: true,
    },
    typescript: {
        ignoreBuildErrors: true,
        tsconfigPath: 'tsconfig.json',
    },
    experimental: {
        webpackMemoryOptimizations: true,
        scrollRestoration: true,
        inlineCss: true,
    },
    images: {
        contentDispositionType: "attachment",
        dangerouslyAllowSVG: true,
        formats: [
            "image/avif",
            "image/webp",
        ],
        localPatterns: [
            {
                pathname: "/src/**",
            },
            {
                pathname: "/_/fl/i",
            },
            {
                pathname: '/api/images/**',
            }
        ],
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
    compiler: {
      removeConsole: false,
        styledComponents: true,
        reactRemoveProperties: true,
    },

    async headers() {
        return [
            {
                headers: [
                    {
                        key: "Cache-Control",
                        value: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
                    },
                ],
                source: "/(.*).(jpg|jpeg|png|gif|webp|avif|svg|ico)",
            },
            {

                headers: [
                    {
                        key: "Cache-Control",
                        value: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
                    },
                ],
                source: "/_next/static/:path*",
            },
            {
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains",
                    },
                ],
                source: "/:path*",
            },
        ];
    },

};

export default nextConfig;