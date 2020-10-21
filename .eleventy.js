module.exports = (eleventy) => {

  eleventy.addWatchTarget('./src/style/');
  eleventy.addPassthroughCopy('./src/style/');

  return {
    dir: {
      input: 'src',
      output: 'public'
    }
  }
};
