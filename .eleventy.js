// Import plugins
const CleanCSS = require("clean-css");
const markdownIt = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
});


module.exports = function(eleventyConfig) {

  // Filters
  eleventyConfig.addFilter('markdownFilter', function(value) {
    return markdownIt.render(value);
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });


  // A useful way to reference the context we are running eleventy in
  let env = process.env.ELEVENTY_ENV;

  // make the seed target act like prod
  env = (env=="seed") ? "prod" : env;


  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/favicon.ico');


  return{
    dir: {
      input: "src",
      output: "dist",
      data: `_data/${env}`
    }
  }
}
