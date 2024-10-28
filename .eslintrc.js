// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./"]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules"]
      }
    }
  }
};
