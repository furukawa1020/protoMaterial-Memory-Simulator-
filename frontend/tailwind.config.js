/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: '#8B4513',
        metal: '#C0C0C0',
        cloth: '#DEB887',
        soil: '#8B7355',
        water: '#4682B4',
      },
    },
  },
  plugins: [],
}
