// Metro config — Expo SDK 54
// Workaround para `qrcode` (dep transitiva de react-native-qrcode-svg) que hace
// require('./utils') donde Metro espera ruta explícita al index.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === './utils' &&
    context.originModulePath &&
    context.originModulePath.includes(`qrcode${path.sep}lib${path.sep}core`)
  ) {
    return context.resolveRequest(context, './utils/index.js', platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
