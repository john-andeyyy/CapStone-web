module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#42B68C",        // Custom green base color
          "secondary": "#91dfc3",      // Custom secondary color
          "accent": "#C6E4DA",         // Accent color
          "base-100": "#ffffff",       // Base background color (light mode)
          "neutral": "#F3F4F6",  

          "info": "#3ABFF8",           // Info color
          "success": "#22c55e",        // Success color (green)
          "warning": "#FBBF24",        // Warning color
          "error": "#F87272",          // Error color

          
          ".Title-Color": {
            "color": "#1EA1F1",
            "border-color": "#1EA1F1",
          },

        },
      },
      {
        dark: {
          "primary": "#191E24",        // Custom primary color for dark mode
          "secondary": "#6B7280",      // Custom secondary color for dark mode
          "accent": "#6B7280",         // Accent color for dark mode
          "neutral": "#3d4451",        // Neutral color
          "base-100": "#1D232A",       // Base background color (dark mode)

          "info": "#3ABFF8",           // Info color for dark mode
          "success": "#22c55e",        // Success color (same as light mode)
          "warning": "#FBBF24",        // Warning color for dark mode
          "error": "#F87272",          // Error color for dark mode

          ".Title-Color": {
            "color": "#22c55e",
            "border-color": "#1EA1F1",
          }
        },
      },
      // add here another themes
    ],
  },
};
