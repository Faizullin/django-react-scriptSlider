/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
          //sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      // colors: {
      //     'regal-blue': '#243c5a',
      // },
      backgroundColor:{
          'green-basic':'#008374',
          'secondary-basic':'#f85a40',
      },
    },
  },
  plugins: [],
}

