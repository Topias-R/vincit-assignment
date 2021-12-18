import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  entry: './src/index.tsx',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js' },
  resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer]
          })
        }
      },
      { test: /\.css$/, use: ['css-loader'] },
      { test: /\.js$/, enforce: 'pre', use: ['source-map-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    })
  ]
};
