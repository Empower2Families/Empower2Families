// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  settings: {
    "import/resolver": {
      node: {
        paths: ["./"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules"]
      }
    }
  }
};
