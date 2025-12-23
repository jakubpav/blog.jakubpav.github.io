import markdownIt from "markdown-it";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("favicon.ico");

  const md = markdownIt({
    html: true,
    linkify: true
  });

  // Override link_open renderer to add target="_blank" and rel="noopener" to external links
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('target');
    const hrefIndex = tokens[idx].attrIndex('href');
    const href = tokens[idx].attrs[hrefIndex][1];

    if (href && href.startsWith('http')) {
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank'; // replace value
      }
      tokens[idx].attrPush(['rel', 'noopener']);
    }
    return self.renderToken(tokens, idx, options);
  };

  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setOutputDirectory("docs");
}
