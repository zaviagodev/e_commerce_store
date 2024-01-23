// tailwind.config.js
import { tailwindConfig } from '@storefront-ui/react/tailwind-config';

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}


/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@storefront-ui/react/**/*.{js,mjs}'],
  theme: {
    extend: {
      fontFamily: {
        dbx: ['DB Helvethaica X', 'sans-serif']
      },
      height: {
        15: '3.75rem'
      },
      padding: {
        15: '3.75rem'
      },
      margin: {
        15: '3.75rem'
      },
      top: {
        15: '3.75rem'
      },
      zIndex: {
        60: 60,
        99: 99
      },
      fontSize: {
        DEFAULT: ['23px', '20px'],
        sm: ['19px', '20px'],
        basesm: ['21px', '20px'],
        base: ['23px', '20px'],
        lg: ['34px', '20px'],
        xl: ['50px', '27px']
      },
      gridTemplateColumns: {
        auto: 'auto auto auto'
      },
      boxShadow: {
        custom: '0px 3px 5px 0px rgba(0, 0, 0, 0.03)'
      },
      colors: {
        maingray: '#858585',
        secgray: '#979797',
        darkgray: '#595959',
        lightgray: '#F3F3F3',
        linkblack: '#111111',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        texttag: 'var(--text-tag)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
        btn: {
          primary: {
            DEFAULT: 'var(--button-primary)',
            foreground: 'var(--button-primary-foreground)',
            hover: {
              DEFAULT: 'var(--button-primary-hover)',
              foreground: 'var(--button-primary-hover-foreground)'
            }
          },
          secondary: {
            DEFAULT: 'var(--button-secondary)',
            foreground: 'var(--button-secondary-foreground)',
            hover: {
              DEFAULT: 'var(--button-secondary-hover)',
              foreground: 'var(--button-secondary-hover-foreground)'
            }
          }
        }
      },
      textColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          a11y: withOpacity("--color-a11y"),
        },
      },
      backgroundColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          a11y: withOpacity("--color-a11y"),
        },
      },
      ringColor: {
        skin: {
          primary: withOpacity("--color-primary"),
        },
      },
      borderColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          a11y: withOpacity("--color-a11y"),
        },
      },
    },
  },
  plugins: [],
};
