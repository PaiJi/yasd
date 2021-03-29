'use strict'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json')

process.env.REACT_APP_VERSION = pkg.version

module.exports = {
  plugins: [],
  style: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
