const esm = ["node-fetch", "data-uri-to-buffer", "fetch-blob", "formdata-polyfill"];

module.exports = {
  transformIgnorePatterns: [`/node_modules/(?!(${esm.join("|")}))`],
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
};
