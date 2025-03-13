const { getDefaultConfig } = require("expo/metro-config");

// Configuração base do Expo
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

const { withTamagui } = require("@tamagui/metro-plugin");
const tamaguiConfig = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./tamagui-web.css",
});


tamaguiConfig.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

tamaguiConfig.resolver.assetExts = tamaguiConfig.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
tamaguiConfig.resolver.sourceExts.push("svg");
tamaguiConfig.resolver.sourceExts.push("mjs"); // Mantendo suporte para `.mjs`

module.exports = tamaguiConfig;
