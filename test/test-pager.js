// - -------------------------------------------------------------------- - //
// - libs

var lib = {
  html: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Pager

describe("Pager",function() {

  // @pager
  it("pager",function() {
    var html = lib.html.pager({
      count: 20,
      limit: 2,
      back: 3,
      size: 8,
      page: 3,
      url: "/page/{page}",
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div class=\"pager\"><a href=\"/page/1\">1</a><a href=\"/page/2\">2</a><a href=\"/page/3\" class=\"on\">3</a><a href=\"/page/4\">4</a><a href=\"/page/5\">5</a><a href=\"/page/6\">6</a><a href=\"/page/7\">7</a><a href=\"/page/8\">8</a></div>",
    });
  });

  // @back
  it("back",function() {
    var html = lib.html.pager({
      count: 40,
      limit: 4,
      back: 1,
      size: 8,
      page: 3,
      url: "/page/{page}",
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div class=\"pager\"><a href=\"/page/2\">2</a><a href=\"/page/3\" class=\"on\">3</a><a href=\"/page/4\">4</a><a href=\"/page/5\">5</a><a href=\"/page/6\">6</a><a href=\"/page/7\">7</a><a href=\"/page/8\">8</a><a href=\"/page/9\">9</a></div>",
    });
  });

});

// - -------------------------------------------------------------------- - //
