/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tertiary-dim': '#00cdeb',
        'surface-dim': '#0e0e0e',
        'inverse-surface': '#fcf9f8',
        'on-surface-variant': '#adaaaa',
        background: '#0e0e0e',
        'inverse-primary': '#006d4a',
        'on-error-container': '#ffa8a3',
        'on-secondary': '#005e40',
        'surface-container-low': '#131313',
        'tertiary-container': '#00dcfd',
        'primary-fixed': '#69f6b8',
        'on-primary-fixed-variant': '#006544',
        'on-tertiary-fixed-variant': '#005360',
        'surface-bright': '#2c2c2c',
        'on-background': '#ffffff',
        'secondary-dim': '#57edb1',
        error: '#ff716c',
        'on-tertiary': '#005360',
        'on-secondary-fixed-variant': '#006948',
        primary: '#69f6b8',
        'tertiary-fixed': '#00dcfd',
        'on-tertiary-fixed': '#00343c',
        'secondary-container': '#006c4b',
        'primary-dim': '#58e7ab',
        'surface-container-highest': '#262626',
        'on-surface': '#ffffff',
        'outline-variant': '#484847',
        'on-tertiary-container': '#004955',
        'on-secondary-fixed': '#004931',
        'surface-container-lowest': '#000000',
        'error-dim': '#d7383b',
        outline: '#767575',
        'primary-fixed-dim': '#58e7ab',
        'secondary-fixed-dim': '#57edb1',
        secondary: '#68fcbf',
        tertiary: '#77e6ff',
        'tertiary-fixed-dim': '#00cdeb',
        'inverse-on-surface': '#565555',
        'on-primary-fixed': '#00452d',
        surface: '#0e0e0e',
        'surface-container': '#1a1a1a',
        'error-container': '#9f0519',
        'on-primary': '#005a3c',
        'surface-variant': '#262626',
        'primary-container': '#06b77f',
        'secondary-fixed': '#68fcbf',
        'surface-container-high': '#20201f',
        'on-primary-container': '#002919',
        'on-error': '#490006',
        'surface-tint': '#69f6b8',
        'on-secondary-container': '#e0ffec'
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans'],
        body: ['Inter'],
        label: ['Inter']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      }
    }
  },
  plugins: []
};
