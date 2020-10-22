const { DateTime } = require('luxon');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = (eleventy) => {
  // Plugins
  eleventy.addPlugin(syntaxHighlight);

  eleventy.addWatchTarget('./src/style/');
  eleventy.addPassthroughCopy('./src/style/');

  //Filters
  eleventy.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('LLL dd, yyyy');
  });

  eleventy.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  return {
    dir: {
      input: 'src',
      output: 'public'
    }
  }
};
