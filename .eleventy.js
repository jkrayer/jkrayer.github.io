const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = (eleventy) => {
  // Plugins
  eleventy.addPlugin(syntaxHighlight);

  eleventy.addWatchTarget('./src/style/');
  eleventy.addPassthroughCopy('./src/style/');

  return {
    dir: {
      input: 'src',
      output: 'public'
    }
  }
};
