module.exports = {
  content: ['./src/**/*.{js,ts,tsx}', './src/components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        Transpetro: '#0066CC',
        Petrobras: '#00A859',
        AmareloPetrobras: '#FFC107',
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
