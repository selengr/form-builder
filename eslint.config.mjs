import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const prettierOptions = JSON.parse(
    fs.readFileSync(`${__dirname}/.prettierrc`, "utf8")
);

export default [
    ...compat.extends(
        "next/core-web-vitals",
        "next",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "react-hooks": require("eslint-plugin-react-hooks"),
            "unused-imports": require("eslint-plugin-unused-imports"),
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            prettier: require("eslint-plugin-prettier"),
        },
        rules: {
            "prettier/prettier": ["off", prettierOptions],
            "no-console": "warn",
            "no-unused-vars": "off",
            "no-shadow": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "unused-imports/no-unused-imports": "off",
            "unused-imports/no-unused-vars": "off",
            "react-hooks/exhaustive-deps": "off",
            "react/react-in-jsx-scope": "off",
            "react/display-name": "off",
            "react/prop-types": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
