// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	html: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Table

describe("Table",function() {

  // @simple
  it("simple",function() {
    var html = lib.html.table({
      header: ["one","two","three"],
      rows: [ [1,2,3], [4,5,6], [7,8,9] ],
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><thead><tr class=\"f l\"><th class=\"f\">one</th><th>two</th><th class=\"l\">three</th></tr></thead><tbody><tr class=\"f\"><td class=\"f\">1</td><td>2</td><td class=\"l\">3</td></tr><tr><td class=\"f\">4</td><td>5</td><td class=\"l\">6</td></tr><tr class=\"l\"><td class=\"f\">7</td><td>8</td><td class=\"l\">9</td></tr></tbody></table>",
    });
  });

  // @render
  it("render",function() {
    var html = lib.html.table({
      header: ["one","two","three"],
      rows: [ {a:1,b:2,c:3}, {a:4,b:5,c:6}, {a:7,b:8,c:9} ],
      cells: function(row,idx) {
        return [ row.a * idx, row.b * idx, row.c * idx];
      },
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><thead><tr class=\"f l\"><th class=\"f\">one</th><th>two</th><th class=\"l\">three</th></tr></thead><tbody><tr class=\"f\"><td class=\"f\">0</td><td>0</td><td class=\"l\">0</td></tr><tr><td class=\"f\">4</td><td>5</td><td class=\"l\">6</td></tr><tr class=\"l\"><td class=\"f\">14</td><td>16</td><td class=\"l\">18</td></tr></tbody></table>",
    });
  });

  // @caption
  it("caption",function() {
    var html = lib.html.table({
      caption: "caption",
      header: ["one","two","three"],
      rows: [ [1,2,3], [4,5,6], [7,8,9] ],
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><caption>caption</caption><thead><tr class=\"f l\"><th class=\"f\">one</th><th>two</th><th class=\"l\">three</th></tr></thead><tbody><tr class=\"f\"><td class=\"f\">1</td><td>2</td><td class=\"l\">3</td></tr><tr><td class=\"f\">4</td><td>5</td><td class=\"l\">6</td></tr><tr class=\"l\"><td class=\"f\">7</td><td>8</td><td class=\"l\">9</td></tr></tbody></table>",
    });
  });

});

// - -------------------------------------------------------------------- - //
