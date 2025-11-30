module.exports = {
  content: ['./src/**/*.{js,ts,tsx}', './src/components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primario: '#FAC03B',
        secundario: '#ffffff',
        transparence: 'background: rgba(121, 121, 121, 0.4);'
      },

      letterSpacing: {
        extra: '0.34em'
      },

      fontFamily: {
        montserrat: ['montserrat', 'sans-serif'],
        worksans: ['WorkSans', 'sans-serif']
      }
    }
  },
  plugins: []
};
