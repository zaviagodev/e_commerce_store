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
      height: {
        15: '3.75rem'
      },
      padding: {
        15: '3.75rem'
      },
      margin: {
        15: '3.75rem'
      },
      zIndex: {
        60: 60,
        99: 99
      },
      gridTemplateColumns: {
        auto: 'auto auto auto'
      },
      colors: {
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
