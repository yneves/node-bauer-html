// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	html: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Document

describe("Document",function() {

  // @document
  it("document",function() {
    var html = lib.html.document({
      js: [{ require: "/js/jquery.js", vars: ["$","jQuery"] },"/js/index.js"],
      css: ["/css/style.css","/css/index.css"],
      title: "title",
      description: "description",
      keywords: "keywords",
      icon: "/img/site.ico",
      analytics: "UA-123213",
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<!DOCTYPE html>\n<html><head><meta name=\"keywords\" content=\"keywords\" /><meta name=\"description\" content=\"description\" /><title>title</title><link href=\"/img/site.ico\" rel=\"shortcut icon\" /><link href=\"/css/style.css\" rel=\"stylesheet\" type=\"text/css\" /><link href=\"/css/index.css\" rel=\"stylesheet\" type=\"text/css\" /><script type=\"text/javascript\">window.$ = window.jQuery = require('/js/jquery.js')</script><script src=\"/js/index.js\" type=\"text/javascript\"></script></head><body>{body}<script type=\"text/javascript\"><html>var _gaq = _gaq||[];_gaq.push(['_setAccount','UA-123213']);_gaq.push(['_trackPageview']);(function(){var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();</html></script></body></html>",
    });
  });

});

// - -------------------------------------------------------------------- - //
