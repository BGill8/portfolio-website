import type { Config } from 'tailwindcss'

const config: Config = {
  // This is the line that fixes your dark mode issue
  darkMode: 'class', 
  
  // These paths tell Tailwind where to look for your class names
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src'// If you're using the App Router
  ],
  
  // This is where you can customize your theme (colors, fonts, etc.)
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  
  // This is where you add plugins, like the typography plugin
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config