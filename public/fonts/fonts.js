// app/fonts.js
import { loadFont } from '@next/font/google';

export const myFont = loadFont({
    google: {
        families: ['Roboto Variable', 'Poppins Variable'],
        subsets: ['latin'],
    },
});
