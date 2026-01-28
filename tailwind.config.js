module.exports = {
  content: ["./**/*.{html,js}"],
  important: "#k-admin-wrapper, #k-frontend-scope",
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"]
      }
    }
  },
  plugins: []
};
