import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import typescriptParser from "@typescript-eslint/parser";

export default {
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        parser: typescriptParser,
        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: process.cwd(),
        },
        globals: {
            require: "readonly",
            module: "readonly",
            __dirname: "readonly",
            process: "readonly",
        },
    },
    plugins: [eslintPluginPrettier, eslintPluginImport, eslintPluginTypescript, eslintPluginUnicorn],
    extends: [
        "plugin:prettier/recommended",
        "plugin:import/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:unicorn/recommended"
    ],
    rules: {
        "no-debugger": "off",
        "no-console": 0,
        "import/no-default-export": "off",
        "@typescript-eslint/no-explicit-any": 2,
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {assertionStyle: "never"},
        ],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {accessibility: "explicit", overrides: {constructors: "off"}},
        ],
        "@typescript-eslint/member-ordering": "error",
        "class-methods-use-this": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-null": "off",
        "unicorn/number-literal-case": "off",
        "unicorn/numeric-separators-style": "off",
        "unicorn/prevent-abbreviations": [
            "error",
            {
                allowList: {
                    acc: true,
                    env: true,
                    i: true,
                    j: true,
                    props: true,
                    Props: true,
                },
            },
        ],
    },
    ignores: ["eslint.config.js", "webpack.config.js", "dist/*", "commitlint.config.сjs"],
};