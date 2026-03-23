module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // nativewind/babel is a metro/app transform only; skip it during Jest runs
    plugins: process.env.NODE_ENV === 'test' ? [] : ['nativewind/babel'],
  };
};
