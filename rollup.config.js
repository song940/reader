import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'src/main.jsx',
  plugins: [
    resolve(),
    babel(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Component', 'PureComponent', 'Fragment', 
          'Children', 'createElement'
        ],
        'node_modules/react-is/index.js': [
          'isValidElementType'
        ]
      }
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
  ],
  output: {
    file: 'js/app.js',
    format: 'iife'
  }
};