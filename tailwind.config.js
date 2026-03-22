// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/routes/**/*.{html,js,svelte,ts}',
    './src/lib/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e63e7a', // matches your .add-btn:hover
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
