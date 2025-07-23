import type {Config} from "tailwindcss";

const config: Config = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/templates/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{ts,tsx,js,jsx,mdx}",],
    theme: {
        extend: {
            fontFamily: {
                'iran-sans': ['IranSans'], 'd2': ['IranSans', {
                    fontVariationSettings: '"DOTS" 2',
                },], 'd3': ['IranSans', {
                    fontVariationSettings: '"DOTS" 3',
                },], 'd4': ['IranSans', {
                    fontVariationSettings: '"DOTS" 4',
                },], 'd5': ['IranSans', {
                    fontVariationSettings: '"DOTS" 5',
                },], 'd6': ['IranSans', {
                    fontVariationSettings: '"DOTS" 6',
                },], 'd7': ['IranSans', {
                    fontVariationSettings: '"DOTS" 7',
                },], 'd8': ['IranSans', {
                    fontVariationSettings: '"DOTS" 8',
                },],
            },
        }, screens: {
            xs: "375px", sm: "768", md: "900px", lg: "1280px",
        }, backgroundImage: {
            'banner-m-bg1': "url('/images/home-page/banner-m-bg1.svg')",
            'banner-d-bg1': "url('/images/home-page/banner-d-bg1.svg')",
            'banner-bg2': "url('/images/home-page/banner-bg2.png')",
        },
    },
    plugins: [],
};
export default config;
