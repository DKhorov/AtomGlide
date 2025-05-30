module.exports = {
    theme: {
      extend: {
        boxShadow: {
          'chat': '0 8px 32px rgba(0, 0, 0, 0.05)'
        },
        backgroundImage: {
          'gradient-chat': 'linear-gradient(145deg, #f8fafc 0%, #f0f4ff 100%)'
        }
      }
    },
    plugins: [
      require('tailwind-scrollbar')({ nocompatible: true })
    ]
  }