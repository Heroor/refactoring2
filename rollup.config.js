const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')

module.exports = {
  input: './index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  output: {
    format: 'umd',
    file: './dist/index.js',
  },
}