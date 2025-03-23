/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "main-green": {
                    50: "#eefbf2",
                    100: "#d7f4df",
                    200: "#b2e8c3",
                    300: "#7fd6a0",
                    400: "#48bb78",
                    500: "#28a15f",
                    600: "#1a814b",
                    700: "#15673e",
                    800: "#135232",
                    900: "#10442b",
                    950: "#082618",
                },
            },
        },
    },
    plugins: [],
};
