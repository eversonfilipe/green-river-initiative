
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
        // IDEA theme colors
        forest: {
          50: 'hsl(150, 80%, 95%)',
          100: 'hsl(150, 80%, 90%)',
          200: 'hsl(150, 75%, 80%)',
          300: 'hsl(150, 70%, 70%)',
          400: 'hsl(145, 65%, 50%)',
          500: 'hsl(142.1, 76.2%, 36.3%)', // Primary green
          600: 'hsl(142, 70%, 30%)',
          700: 'hsl(142, 65%, 25%)',
          800: 'hsl(142, 60%, 20%)',
          900: 'hsl(142, 55%, 15%)'
        },
        earth: {
          50: 'hsl(36, 60%, 95%)',
          100: 'hsl(36, 55%, 90%)',
          200: 'hsl(36, 50%, 80%)',
          300: 'hsl(36, 45%, 70%)',
          400: 'hsl(36, 40%, 60%)',
          500: 'hsl(36, 35%, 50%)',
          600: 'hsl(36, 30%, 40%)',
          700: 'hsl(36, 25%, 30%)',
          800: 'hsl(36, 20%, 20%)',
          900: 'hsl(36, 15%, 15%)'
        },
        water: {
          50: 'hsl(210, 90%, 95%)',
          100: 'hsl(210, 85%, 90%)',
          200: 'hsl(210, 80%, 80%)',
          300: 'hsl(210, 75%, 70%)',
          400: 'hsl(210, 70%, 60%)',
          500: 'hsl(210, 65%, 50%)',
          600: 'hsl(210, 60%, 40%)',
          700: 'hsl(210, 55%, 30%)',
          800: 'hsl(210, 50%, 20%)',
          900: 'hsl(210, 45%, 15%)'
        },
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
        'leaf-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'leaf-sway': 'leaf-sway 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'ripple': 'ripple 1.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
