module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      'xxl': { 'max': '10000px' },
      '2xl': { 'max': '1800px' },
      'xl': { 'max': '1500px' },
      'lg': { 'max': '1280px' },
      'md': { 'max': '960px' },
      'sm': { 'max': '640px' },
      'xs': { 'max': '500px' },
      'minxs': '390px',
      // => @media (min-width: 400px) { ... }
      'minxs2': '585px',
      // => @media (min-width: 585px) { ... }
      'minsm': '640px',
      // => @media (min-width: 640px) { ... }
      'minmd': '768px',
      // => @media (min-width: 768px) { ... }
      'minmd2': { 'min': '860px', 'max': '1156px' },
      // => @media (min-width: 860px, max-width: 1156px) { ... }
      'minlg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'minxl': '1280px',
      // => @media (min-width: 1280px) { ... }
      'min2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'min3xl': '1727px',
      // => @media (min-width: 1900px) { ... }
      'min4xl': '1900px',
      // => @media (min-width: 2200px) { ... }
      'min5xl': '2301px',
      // => @media (min-width: 2200px) { ... }
    },
    extend: {
      colors: {
        'primary-txt':'#171B27',
        'primary-txt-dk':'#FFFFFF',
        'secondary-txt':'#777E93',
        'secondary-txt-dk':'#FFFFFF',
        'primary-pink':'#F2358E',
        'secondary-pink':'#E369A4',
        'primary-green':'#15C666',
        'accent':'#F0F5FF',
        'accent-dk':'#2C3448',
        'accent-border':'transparent',
        'accent-border-dk':'#384260',
        'primary-button-txt':'#FFFFFF',
        'primary-button-bckg':'#00A4FF',
        'always-white':'#FFFFFF',
        'always-black':'#000000',
        'primary-1':'#0164d0',
        'blue-name':'#0093E4',
        'green-summary':'#4FC853',
        'headerbg':'#FFFFFF',
        'headerbg-dk':'#0C0F17',
        'pagebg':'#f4f6fb',
        'pagebg-dk':'#0C0F17',
        'header-txt':'#6B7082',
        'header-pink':'#FF0078',
        'modal-bg':'#FFFFFF',
        'modal-bg-dk':'#22293B',
        'modal-overlay': '#f0f5ff', // use with opacity 50, i.e. modal-overlay/50
        'modal-overlay-dk': '#171b27', // use with opacity 50, i.e. modal-overlay-dk/50
        'row-border':'#E6ECFF',
        'green1':'#27AE60',
        'gkWalletOptionBgHover':'#2C3448',
        'button-hv-1':'#a8abb3',
        'red-1':'#FF6871',
        'text-4':'#C3C5CB',
        'footer-txt':'#787E91',
        'primary-btn-txt-disabled':'777E91',
        'transparent-border':'#7A8092',
        'toggle-bg':'#00A4FF',
        'grey-txt':'#d4d4d4',
        'row-bg-active':'#2c334a',
        'select-brdr':'#CAD2EA',
        'hero-pink':'#FF62EF',
        'hero-blue': '#03C1FD',
        'hero-gray':'#909090',
        'action-primary': '#00A4FF',
        'pill-border': '#7D8795',
        'link': '#00A4FF',
        'gray-opacity':'#c4c4c49e',
        'vault-pink':'#C264B9'
      },
      fontSize: {
        'copy-size': '0.825rem',
        '2xll': '1.6rem',
        'xxs1': '0.4rem',
        'xxs2': '0.6rem',
      },
      fontFamily: {
        'rubik': ['Rubik'],
        'hero-heading1': ['Stretch Pro'],
        'hero-heading2': ['Bebas Neue'],
        'dm-mono': ['DM Mono'],
    },
    keyFrames: {
      pulseBorder: {
        '0%, 100%': { borderColor: 'rgba(0, 164, 255, 1)' },
        '50%': { borderColor: 'rgba(0, 164, 255, 0)' },
      }
    },
    animation: {
      'spin-slow': 'spin 2s linear infinite',
      'pulse-border': 'pulseBorder 2s linear infinite',
    },
    padding: {
      '30px': '30px',
      '20px': '20px',
    },
    margin: {
      'n3':'-3px',
    },
    width: {
      'pic1': '15.125rem',
      'slider-button': '1.5625rem',
      '61':'14.5rem',
      'slider-card': '93.5%',
    },
    height: {
      'slider-button': '2.1875rem',
      'sumBanner':'2.875rem',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'hero-radial-gradient':
      'radial-gradient(59.6% 80.37% at 50.68% 83.52%, #272F46 0%, #202F56 46.87%, #030406 100%)',
      'hero-gradient':
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 63.02%, #000000 100%)',
    }
  },
},
  variants: {
    fill: ['hover', 'focus'],
    extend: {},
  },
  plugins: [],
};
