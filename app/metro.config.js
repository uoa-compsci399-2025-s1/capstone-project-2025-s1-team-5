const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,

  watchFolders: [
    ...defaultConfig.watchFolders,
    path.resolve(__dirname, '../assets'),
  ],

  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...defaultConfig.resolver.assetExts, 'otf', 'ttf'],
  },
};
