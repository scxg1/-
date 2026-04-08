/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gold: '#C9A84C',
                'gold-dark': '#A8872E',
                'gold-light': '#E8C96A',
            },
            fontFamily: {
                tajawal: ['Tajawal', 'sans-serif'],
            },
        },
    },
    plugins: [],
}