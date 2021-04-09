const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = (eleventy) => {
  // Plugins
  eleventy.addPlugin(syntaxHighlight);

  eleventy.addWatchTarget("./src/style/");
  eleventy.addPassthroughCopy("./src/style/");
  eleventy.addPassthroughCopy("./src/images/");

  // Collections
  eleventy.addCollection("tagList", (collection) => {
    let tagSet = new Set();

    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (tag !== "posts") {
          tagSet.add(tag);
        }
      });
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  //Filters
  eleventy.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLL dd, yyyy"
    );
  });

  eleventy.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "public",
    },
  };
};
