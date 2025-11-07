/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'rain': 'rain 1s linear infinite',
        'snow': 'snow 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100px)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        snow: {
          '0%': { transform: 'translateY(-100px) translateX(0px)' },
          '100%': { transform: 'translateY(100vh) translateX(20px)' },
        },
      },
      backgroundImage: {
        'weather-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'sunny-gradient': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'cloudy-gradient': 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
        'rainy-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'night-gradient': 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      },
    },
  },
  plugins: [],
}