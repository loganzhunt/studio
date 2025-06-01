import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Performance optimizations
  corePlugins: {
    preflight: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  safelist: [
    // Ensure all facet color utilities are included for dynamic generation
    {
      pattern: /^(bg|text|border|ring|decoration)-facet-(ontology|epistemology|praxeology|axiology|mythology|cosmology|teleology)-(50|100|200|300|400|500|600|700|800|900|DEFAULT)$/,
      variants: ['hover', 'focus', 'active', 'group-hover', 'dark'],
    },
    {
      pattern: /^bg-gradient-(facet-spectrum|facet-spectrum-radial|ontology-epistemology|epistemology-praxeology|praxeology-axiology|axiology-mythology|mythology-cosmology|cosmology-teleology|teleology-ontology)$/,
    },
    // Explicitly include all gradient classes used in components
    'bg-gradient-facet-spectrum',
    'bg-gradient-facet-spectrum-radial', 
    'bg-gradient-ontology-epistemology',
    'bg-gradient-epistemology-praxeology',
    'bg-gradient-praxeology-axiology',
    'bg-gradient-axiology-mythology',
    'bg-gradient-mythology-cosmology',
    'bg-gradient-cosmology-teleology',
    'bg-gradient-teleology-ontology',
    // Include commonly used facet color combinations
    'text-facet-ontology-700',
    'text-facet-epistemology-700', 
    'text-facet-praxeology-700',
    'text-facet-axiology-700',
    'text-facet-mythology-700',
    'text-facet-cosmology-700',
    'text-facet-teleology-700',
    'bg-facet-ontology-50',
    'bg-facet-ontology-100',
    'bg-facet-ontology-500',
    'bg-facet-epistemology-50',
    'bg-facet-epistemology-100', 
    'bg-facet-epistemology-500',
    'bg-facet-praxeology-50',
    'bg-facet-praxeology-100',
    'bg-facet-praxeology-500',
    'bg-facet-axiology-50',
    'bg-facet-axiology-100',
    'bg-facet-axiology-500',
    'bg-facet-mythology-50',
    'bg-facet-mythology-100',
    'bg-facet-mythology-500',
    'bg-facet-cosmology-50',
    'bg-facet-cosmology-100',
    'bg-facet-cosmology-500',
    'bg-facet-teleology-50',
    'bg-facet-teleology-100',
    'bg-facet-teleology-500',
    'border-facet-ontology-200',
    'border-facet-ontology-300',
    'border-facet-ontology-400',
    'border-facet-epistemology-200',
    'border-facet-epistemology-300',
    'border-facet-epistemology-400',
    'border-facet-praxeology-200',
    'border-facet-praxeology-300', 
    'border-facet-praxeology-400',
    'border-facet-axiology-200',
    'border-facet-axiology-300',
    'border-facet-axiology-400',
    'border-facet-mythology-200',
    'border-facet-mythology-300',
    'border-facet-mythology-400',
    'border-facet-cosmology-200',
    'border-facet-cosmology-300',
    'border-facet-cosmology-400',
    'border-facet-teleology-200',
    'border-facet-teleology-300',
    'border-facet-teleology-400',
  ],
  theme: {
    // Container widths - Mobile-first responsive system
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    // Typography scale using Geist font family
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
      'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.035em' }],
      '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.04em' }],
      '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.045em' }],
      '7xl': ['4.5rem', { lineHeight: '4.75rem', letterSpacing: '-0.05em' }],
      '8xl': ['6rem', { lineHeight: '6.25rem', letterSpacing: '-0.055em' }],
      '9xl': ['8rem', { lineHeight: '8.25rem', letterSpacing: '-0.06em' }],
    },
    // Font family configuration
    fontFamily: {
      sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['var(--font-geist-mono)', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'monospace'],
    },
    // Font weights for Geist
    fontWeight: {
      thin: '100',
      extralight: '200', 
      light: '300',
      normal: '400',    // Geist Regular
      medium: '500',    // Geist Medium  
      semibold: '600',  // Geist Semibold
      bold: '700',      // Geist Bold
      extrabold: '800', // Geist Extra Bold
      black: '900',
    },
    // Spacing scale - Mobile-first modular scale
    spacing: {
      '0': '0',
      'px': '1px',
      '0.5': '0.125rem',  // 2px
      '1': '0.25rem',     // 4px
      '1.5': '0.375rem',  // 6px
      '2': '0.5rem',      // 8px
      '2.5': '0.625rem',  // 10px
      '3': '0.75rem',     // 12px
      '3.5': '0.875rem',  // 14px
      '4': '1rem',        // 16px
      '5': '1.25rem',     // 20px
      '6': '1.5rem',      // 24px
      '7': '1.75rem',     // 28px
      '8': '2rem',        // 32px
      '9': '2.25rem',     // 36px
      '10': '2.5rem',     // 40px
      '11': '2.75rem',    // 44px
      '12': '3rem',       // 48px
      '14': '3.5rem',     // 56px
      '16': '4rem',       // 64px
      '18': '4.5rem',     // 72px
      '20': '5rem',       // 80px
      '24': '6rem',       // 96px
      '28': '7rem',       // 112px
      '32': '8rem',       // 128px
      '36': '9rem',       // 144px
      '40': '10rem',      // 160px
      '44': '11rem',      // 176px
      '48': '12rem',      // 192px
      '52': '13rem',      // 208px
      '56': '14rem',      // 224px
      '60': '15rem',      // 240px
      '64': '16rem',      // 256px
      '72': '18rem',      // 288px
      '80': '20rem',      // 320px
      '96': '24rem',      // 384px
    },
  	extend: {
      // Glass morphism and depth system
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      // Enhanced shadows for glassmorphic design
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 20px 40px 0 rgba(31, 38, 135, 0.4)',
        'glass-xl': '0 25px 50px 0 rgba(31, 38, 135, 0.5)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'facet-glow': '0 0 20px var(--facet-glow-color, rgba(139, 92, 246, 0.3))',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },
      // Z-index scale for layering
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      // Animation and transitions
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      // Additional border radius for glassmorphic design
      // Line height adjustments for better readability
      lineHeight: {
        'relaxed': '1.625',
        'loose': '2',
      },
      // Letter spacing for different font weights
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Meta-Prism Facet Colors - Perceptually uniform LCH-based palette
  			facet: {
  				// Ontology (Violet) - What is real?
  				ontology: {
  					'50': '#f5f3ff',
  					'100': '#ede9fe',
  					'200': '#ddd6fe',
  					'300': '#c4b5fd',
  					'400': '#a78bfa',
  					'500': '#8b5cf6',
  					'600': '#7c3aed',
  					'700': '#6d28d9',
  					'800': '#5b21b6',
  					'900': '#4c1d95',
  					DEFAULT: '#8b5cf6',
  				},
  				// Epistemology (Indigo) - What can be known?
  				epistemology: {
  					'50': '#eef2ff',
  					'100': '#e0e7ff',
  					'200': '#c7d2fe',
  					'300': '#a5b4fc',
  					'400': '#818cf8',
  					'500': '#6366f1',
  					'600': '#4f46e5',
  					'700': '#4338ca',
  					'800': '#3730a3',
  					'900': '#312e81',
  					DEFAULT: '#6366f1',
  				},
  				// Praxeology (Blue) - How should we act?
  				praxeology: {
  					'50': '#eff6ff',
  					'100': '#dbeafe',
  					'200': '#bfdbfe',
  					'300': '#93c5fd',
  					'400': '#60a5fa',
  					'500': '#3b82f6',
  					'600': '#2563eb',
  					'700': '#1d4ed8',
  					'800': '#1e40af',
  					'900': '#1e3a8a',
  					DEFAULT: '#3b82f6',
  				},
  				// Axiology (Green) - What has value?
  				axiology: {
  					'50': '#ecfdf5',
  					'100': '#d1fae5',
  					'200': '#a7f3d0',
  					'300': '#6ee7b7',
  					'400': '#34d399',
  					'500': '#10b981',
  					'600': '#059669',
  					'700': '#047857',
  					'800': '#065f46',
  					'900': '#064e3b',
  					DEFAULT: '#10b981',
  				},
  				// Mythology (Yellow) - What is the story?
  				mythology: {
  					'50': '#fefce8',
  					'100': '#fef9c3',
  					'200': '#fef08a',
  					'300': '#fde047',
  					'400': '#facc15',
  					'500': '#eab308',
  					'600': '#ca8a04',
  					'700': '#a16207',
  					'800': '#854d0e',
  					'900': '#713f12',
  					DEFAULT: '#eab308',
  				},
  				// Cosmology (Orange) - What is the universe?
  				cosmology: {
  					'50': '#fff7ed',
  					'100': '#ffedd5',
  					'200': '#fed7aa',
  					'300': '#fdba74',
  					'400': '#fb923c',
  					'500': '#f97316',
  					'600': '#ea580c',
  					'700': '#c2410c',
  					'800': '#9a3412',
  					'900': '#7c2d12',
  					DEFAULT: '#f97316',
  				},
  				// Teleology (Red) - What is the purpose?
  				teleology: {
  					'50': '#fef2f2',
  					'100': '#fee2e2',
  					'200': '#fecaca',
  					'300': '#fca5a5',
  					'400': '#f87171',
  					'500': '#ef4444',
  					'600': '#dc2626',
  					'700': '#b91c1c',
  					'800': '#991b1b',
  					'900': '#7f1d1d',
  					DEFAULT: '#ef4444',
  				},
  			}
  		},
		backgroundImage: {
			// Meta-Prism Facet Gradients
			'gradient-facet-spectrum': 'linear-gradient(to right, #8b5cf6, #6366f1, #3b82f6, #10b981, #eab308, #f97316, #ef4444)',
			'gradient-facet-spectrum-radial': 'radial-gradient(circle, #8b5cf6, #6366f1, #3b82f6, #10b981, #eab308, #f97316, #ef4444)',
			'gradient-facet-spectrum-conic': 'conic-gradient(from 0deg, #8b5cf6, #6366f1, #3b82f6, #10b981, #eab308, #f97316, #ef4444, #8b5cf6)',
			// Adjacent facet pairs for smooth transitions
			'gradient-ontology-epistemology': 'linear-gradient(to right, #8b5cf6, #6366f1)',
			'gradient-epistemology-praxeology': 'linear-gradient(to right, #6366f1, #3b82f6)',
			'gradient-praxeology-axiology': 'linear-gradient(to right, #3b82f6, #10b981)',
			'gradient-axiology-mythology': 'linear-gradient(to right, #10b981, #eab308)',
			'gradient-mythology-cosmology': 'linear-gradient(to right, #eab308, #f97316)',
			'gradient-cosmology-teleology': 'linear-gradient(to right, #f97316, #ef4444)',
			'gradient-teleology-ontology': 'linear-gradient(to right, #ef4444, #8b5cf6)',
			// Glass morphism backgrounds
			'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
			'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
			// Subtle prismatic overlays
			'prism-overlay': 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
			'prism-overlay-radial': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        'glass': '16px',
        'glass-lg': '24px',
        'glass-xl': '32px',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        // Prismatic animations
        'spectrum-shift': {
          '0%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(180deg)'
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(360deg)'
          }
        },
        'glass-shimmer': {
          '0%': { 
            backgroundPosition: '-100% 0'
          },
          '100%': { 
            backgroundPosition: '100% 0'
          }
        },
        'facet-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px var(--facet-glow-color, rgba(139, 92, 246, 0.3))'
          },
          '50%': { 
            boxShadow: '0 0 40px var(--facet-glow-color, rgba(139, 92, 246, 0.5))'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'spectrum-shift': 'spectrum-shift 8s ease-in-out infinite',
        'glass-shimmer': 'glass-shimmer 2s ease-in-out infinite',
        'facet-glow': 'facet-glow 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
