/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs principales du design system
        primary: '#005faa',
        'primary-container': '#0078d4',
        'primary-fixed': '#d3e3ff',
        'primary-fixed-dim': '#a3c9ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#ffffff',
        'on-primary-fixed': '#001c39',
        'on-primary-fixed-variant': '#004883',
        
        secondary: '#00658d',
        'secondary-container': '#4bc1fe',
        'secondary-fixed': '#c6e7ff',
        'secondary-fixed-dim': '#81cfff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#004d6c',
        'on-secondary-fixed': '#001e2d',
        'on-secondary-fixed-variant': '#004c6b',
        
        tertiary: '#974700',
        'tertiary-container': '#bc5b00',
        'tertiary-fixed': '#ffdbc8',
        'tertiary-fixed-dim': '#ffb689',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffffff',
        'on-tertiary-fixed': '#311300',
        'on-tertiary-fixed-variant': '#743500',
        
        // Couleurs de surface
        background: '#f9f9f9',
        'on-background': '#1a1c1c',
        surface: '#f9f9f9',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1E1E1E',
        'surface-dim': '#dadada',
        'surface-bright': '#f9f9f9',
        'surface-container': '#eeeeee',
        'surface-container-low': '#f3f3f3',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'surface-container-lowest': '#ffffff',
        'surface-variant': '#e2e2e2',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#404752',
        'inverse-surface': '#2f3131',
        'inverse-on-surface': '#f1f1f1',
        
        // Mode sombre
        'bg-dark': '#121212',
        'text-primary-dark': '#E0E0E0',
        'text-primary-light': '#1A1A1A',
        
        // Erreur
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        
        // Outline
        outline: '#717783',
        'outline-variant': '#c0c7d4',
        
        // Inverse
        'inverse-primary': '#a3c9ff',
        
        // Tint
        'surface-tint': '#0060ab',
        
        // Terminal
        'terminal-green': '#4E9A06',
        
        // Accent blue gradient
        'accent-blue-gradient': 'linear-gradient(135deg, #0078D4 0%, #50B0E8 100%)',
        
        // Windows specific
        windows: {
          blue: '#0078D4',
          light: '#f3f3f3',
          dark: '#202020',
          glass: 'rgba(255, 255, 255, 0.7)',
          glassDark: 'rgba(32, 32, 32, 0.7)',
        }
      },
      fontFamily: {
        'window-title': ['Manrope', 'sans-serif'],
        'icon-label': ['Inter', 'sans-serif'],
        'clock': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'metadata': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      fontSize: {
        'window-title': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'icon-label': ['12px', { lineHeight: '14px', fontWeight: '400' }],
        'clock': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'metadata': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '400' }],
      },
      spacing: {
        'gutter': '16px',
        'window-padding': '24px',
        'taskbar-height': '50px',
        'icon-grid': '80px',
        'desktop-margin': '24px',
      },
      backdropBlur: {
        'mica': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
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
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
