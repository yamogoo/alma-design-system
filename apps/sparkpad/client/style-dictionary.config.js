import styleDictionaryPkg from "style-dictionary";

const StyleDictionary = styleDictionaryPkg.extend({
  source: ["./src/tokens/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "src/scss/",
      files: [
        {
          destination: "./src/assets/scss/abstracts/test.scss",
          format: "scss/variables",
        },
      ],
    },
  },
});

StyleDictionary.buildAllPlatforms();
