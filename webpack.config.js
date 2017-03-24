// var path = require('path');
import path from 'path';

module.exports = {
  entry: "./basics/main",
  output: {
    path: path.resolve(__dirname, 'basics/'),
    filename: "app.js"
  },
  devServer:{
    contentBase: 'basics'
  },
  module: {
    loaders: [
      {
        test: /.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
}