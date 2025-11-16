/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#9DBF9E',
        olive: '#7A8F69',
        lightMoss: '#DAE5D0',
        sand: '#F8F3E6',
        warmBrown: '#A67C52',
        offWhite: '#FAFAF7',
        darkForest: '#2F3E2C',

        eucalyptus: '#DDEEE5',
        darkForestNew: '#1F3A2C',
        oliveMist: '#7A9475',
        fernGlow: '#A3C79D',
        warmSand: '#F5F2EA',
        cloudWhite: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31,58,44,0.08)',
        'glass-lg': '0 12px 48px rgba(31,58,44,0.12)',
        glow: '0 0 20px rgba(163,199,157,0.3)',
        'glow-strong': '0 0 30px rgba(163,199,157,0.5)',
      },
    },
  },
  plugins: [],
}

