/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Colors based on the blueprint
                'starter': '#c7e6ff', // light blue
                'basic': '#86efac', // green
                'pro': '#3b82f6', // blue
                'enterprise': '#a855f7', // purple
            },
        },
    },
    plugins: [],
}