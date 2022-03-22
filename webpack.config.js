module.exports = {
  externals: [nodeExternals(), "pg", "sqlite3", "tedious", "pg-hstore"],
  plugins: [
    new webpack.ContextReplacementPlugin(
      /Sequelize(\\|\/)/,
      path.resolve(__dirname, "./src")
    ),
  ],
};
