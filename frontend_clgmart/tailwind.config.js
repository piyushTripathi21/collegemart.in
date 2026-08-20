export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#002f34',
        'primary-teal': '#23e5db',
        'background': '#f2f4f5',
        'featured-badge': '#f6b200',
        'text-secondary': '#888888',
        'condition-good': '#e6f9f2',
        'condition-good-text': '#27ae60',
        'condition-amber': '#fff4e0',
        'condition-amber-text': '#f39c12',
        'condition-red': '#fdecea',
        'condition-red-text': '#e74c3c',
      },
      spacing: {
        'navbar-height': '60px',
        'tab-height': '48px',
      },
      fontSize: {
        'section-title': '20px',
        'card-price': '17px',
        'card-title': '13px',
        'card-meta': '11px',
      },
    },
  },
  plugins: [],
}
