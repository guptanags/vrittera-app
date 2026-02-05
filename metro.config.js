const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};
const defaultconfig = getDefaultConfig(__dirname);
defaultconfig.resolver.sourceExts.push('cjs');
defaultconfig.resolver.unstable_enablePackageExports = false;
module.exports = mergeConfig( defaultconfig, config);
