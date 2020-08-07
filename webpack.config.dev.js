const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(__dirname, "src/js/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dev"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dev"),
    index: "index.html",
    port: 9000,
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env"],
            plugins: ["transform-class-properties"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["app"],
      title: "Transaction Development",
      meta: { description: "some Description" },
      template: "src/index.html",
    }),
  ],
};
