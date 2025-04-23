import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {},
    screens: {
      xs : "375px",
      sm: "768",
      md: "900px",
      lg: "1280px",
    },
    backgroundImage: {
      'banner-m-bg1': "url('/images/home-page/banner-m-bg1.svg')",
      'banner-d-bg1': "url('/images/home-page/banner-d-bg1.svg')",
      'banner-bg2': "url('/images/home-page/banner-bg2.png')",
     },
  },
  plugins: [],
};
export default config;
