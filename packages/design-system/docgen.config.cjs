const { resolve } = require("node:path");

module.exports = {
  alias: {
    "@": resolve(__dirname, "src"),
    "@/tokens/src": resolve(__dirname, "src/tokens/.cache"),
  },
};
