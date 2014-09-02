// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	html: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Element

describe("Element",function() {

  // @constructor
  it("constructor",function() {
    assert.deepEqual(lib.html(),{ _open: [], _html: "" });
    assert.deepEqual(new lib.html.element(),{ _open: [], _html: "" });
    assert.deepEqual(new lib.html.cls.Element(),{ _open: [], _html: "" });
  });

  // @concat-string
  it("concat-string",function() {
    var html = new lib.html.cls.Element();
    html.concat("test","test",1,2,3);
    assert.deepEqual(html,{
      _open: [],
      _html: "testtest123",
    });
  });

  // @concat-object
  it("concat-object",function() {
    var html = new lib.html.cls.Element();
    html.concat({ cls: ["a","b"], key: "value", key2: "\"value\"", key3: true, key4: false, key5: 123, data: { a: "b", b: "c" } });
    assert.deepEqual(html,{
      _open: [],
      _html: " class=\"a b\" key=\"value\" key2=\"&quot;value&quot;\" key3 key5=\"123\" data-a=\"b\" data-b=\"c\"",
    });
  });

  // @concat-array
  it("concat-array",function() {
    var html = new lib.html.cls.Element();
    html.concat(["test","test"],[1,2,3],[{ key: "value", key2: "\"value\"" }]);
    assert.deepEqual(html,{
      _open: [],
      _html: "testtest123 key=\"value\" key2=\"&quot;value&quot;\"",
    });
  });

  // @concat-callback-0
  it("concat-callback-0",function() {
    var html = new lib.html.cls.Element();
    html.concat(function() { return "test" });
    assert.deepEqual(html,{
      _open: [],
      _html: "test",
    });
  });

  // @concat-callback-1
  it("concat-callback-1",function() {
    var html = new lib.html.cls.Element();
    html.concat(function(content) { content.concat("test") });
    assert.deepEqual(html,{
      _open: [],
      _html: "test",
    });
  });

  // @entity
  it("entity",function() {
    var html = new lib.html.cls.Element();
    html.concat("çáóão╛ªå█Ä").entity();
    assert.deepEqual(html,{
      _open: [],
      _html: "&ccedil;&aacute;&oacute;&atilde;o&#9563;&#170;&#229;&#9608;&#196;",
    });
  });

  // @doctype
  it("doctype",function() {
    var html = new lib.html.cls.Element();
    html.doctype();;
    assert.deepEqual(html,{
      _open: [],
      _html: "<!DOCTYPE html>\n",
    });
  });

  // @open
  it("open",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" }).open("div",{ cls: "center" });
    assert.deepEqual(html,{
      _open: ["div","div"],
      _html: "<div id=\"header\"><div class=\"center\">",
    });
  });

  // @close
  it("close",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" }).open("div",{ cls: "center" }).close().close();
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"></div></div>",
    });
  });

  // @clone
  it("clone",function() {
    var html = new lib.html.cls.Element();
    var clone = html.open("div",{ id: "header" }).open("div",{ cls: "center" }).clone();
    assert.deepEqual(clone,{
      _open: ["div","div"],
      _html: "<div id=\"header\"><div class=\"center\">",
    });
  });

  // @replace-ss
  it("replace-ss",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("{content}")
      .close()
      .close()
      .replace("content","<h1>title</h1>");
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1></div></div>",
    });
  });

  // @replace-so
  it("replace-so",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("{content}")
      .close()
      .close()
      .replace("content",{
        h1: "title",
        p: [{ cls: "error" },"text"],
        h6: function() { return "footer" },
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><p class=\"error\">text</p><h6>footer</h6></div></div>",
    });
  });

  // @replace-rs
  it("replace-rs",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("_content_")
      .concat("_content_")
      .close()
      .close()
      .replace(/_content_/g,"<h1>title</h1>");
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><h1>title</h1></div></div>",
    });
  });

  // @replace-ro
  it("replace-ro",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("_content_")
      .concat("_content_")
      .close()
      .close()
      .replace(/_content_/g,{
        h1: "title",
        p: [{ cls: "error" },"text"],
        h6: function() { return "footer" },
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><p class=\"error\">text</p><h6>footer</h6><h1>title</h1><p class=\"error\">text</p><h6>footer</h6></div></div>",
    });
  });

  // @replace-sf-0
  it("replace-sf-0",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("{content}")
      .close()
      .close()
      .replace("content",function() {
        return "<h1>title</h1>";
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1></div></div>",
    });
  });

  // @replace-sf-1
  it("replace-sf-1",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("{content}")
      .close()
      .close()
      .replace("content",function(content) {
        content.concat("<h1>title</h1>");
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1></div></div>",
    });
  });

  // @replace-rf-0
  it("replace-rf-0",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("_content_")
      .concat("_content_")
      .close()
      .close()
      .replace(/_content_/g,function() {
        return "<h1>title</h1>";
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><h1>title</h1></div></div>",
    });
  });

  // @replace-rf-1
  it("replace-rf-1",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("_content_")
      .concat("_content_")
      .close()
      .close()
      .replace(/_content_/g,function(content) {
        content.concat("<h1>title</h1>");
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><h1>title</h1></div></div>",
    });
  });

  // @replace-s
  it("replace-s",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("{content}")
      .close()
      .close()
      .replace("content")
      .concat("<h1>title</h1>")
      .flush();
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1></div></div>",
    });
  });

  // @replace-r
  it("replace-r",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .open("div",{ cls: "center" })
      .concat("_content_")
      .concat("_content_")
      .close()
      .close()
      .replace(/_content_/g)
      .concat("<h1>title</h1>")
      .flush();
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><div class=\"center\"><h1>title</h1><h1>title</h1></div></div>",
    });
  });

  // @replace-o
  it("replace-o",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .concat("{header}")
      .close()
      .open("div",{ id: "body" })
      .concat("{body}")
      .close()
      .open("div",{ id: "footer" })
      .concat("{footer}")
      .close()
      .replace({
        header: "<h1>title</h1>",
        body: function(content) { content.concat("<p>content</p>") },
        footer: function() { return "<h6>footer</h6>" },
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><h1>title</h1></div><div id=\"body\"><p>content</p></div><div id=\"footer\"><h6>footer</h6></div>",
    });
  });

  // @replace-f-1
  it("replace-f-1",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .concat("{header}")
      .close()
      .open("div",{ id: "body" })
      .concat("{body}")
      .close()
      .open("div",{ id: "footer" })
      .concat("{footer}")
      .close()
      .replace(function(key) {
        if (key == "header") {
          return "<h1>title</h1>";
        } else if (key == "body") {
          return "<p>content</p>";
        } else if (key == "footer") {
          return "<h6>footer</h6>";
        }
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><h1>title</h1></div><div id=\"body\"><p>content</p></div><div id=\"footer\"><h6>footer</h6></div>",
    });
  });

  // @replace-f-2
  it("replace-f-2",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .concat("{header}")
      .close()
      .open("div",{ id: "body" })
      .concat("{body}")
      .close()
      .open("div",{ id: "footer" })
      .concat("{footer}")
      .close()
      .replace(function(key,content) {
        if (key == "header") {
          content.concat("<h1>title</h1>");
        } else if (key == "body") {
          content.concat("<p>content</p>");
        } else if (key == "footer") {
          content.concat("<h6>footer</h6>");
        }
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><h1>title</h1></div><div id=\"body\"><p>content</p></div><div id=\"footer\"><h6>footer</h6></div>",
    });
  });

  // @dom
  it("dom",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .close()
      .open("div",{ id: "body" })
      .close()
      .open("div",{ id: "footer" })
      .close()
      .dom()
      .find("#header")
      .append("<h1>title</h1>")
      .end()
      .find("#body")
      .append("<p>content</p>")
      .end()
      .find("#footer")
      .append("<h6>footer</h6>")
      .end()
      .flush();
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><h1>title</h1></div><div id=\"body\"><p>content</p></div><div id=\"footer\"><h6>footer</h6></div>",
    });
  });

  // @dom-callback
  it("dom-callback",function() {
    var html = new lib.html.cls.Element();
    html.open("div",{ id: "header" })
      .close()
      .open("div",{ id: "body" })
      .close()
      .open("div",{ id: "footer" })
      .close()
      .dom(function(root) {
        root.find("#header")
          .append("<h1>title</h1>")
          .end()
          .find("#body")
          .append("<p>content</p>")
          .end()
          .find("#footer")
          .append("<h6>footer</h6>")
          .end();
      });
    assert.deepEqual(html,{
      _open: [],
      _html: "<div id=\"header\"><h1>title</h1></div><div id=\"body\"><p>content</p></div><div id=\"footer\"><h6>footer</h6></div>",
    });
  });

  // @tag-open-close
  it("tag-open-close",function() {
    var html = new lib.html.cls.Element();
    html.script({ type: "text/javascript", src: "file.js" });
    assert.deepEqual(html,{
      _open: [],
      _html: "<script type=\"text/javascript\" src=\"file.js\"></script>",
    });
  });

  // @tag-closed
  it("tag-closed",function() {
    var html = new lib.html.cls.Element();
    html.img({ cls: "photo", src: "photo.png" });
    assert.deepEqual(html,{
      _open: [],
      _html: "<img class=\"photo\" src=\"photo.png\" />",
    });
  });

  // @tag-open
  it("tag-open",function() {
    var html = new lib.html.cls.Element();
    html.h1({ cls: "header" }).concat("title").close();
    assert.deepEqual(html,{
      _open: [],
      _html: "<h1 class=\"header\">title</h1>",
    });
  });

  // @batch
  it("batch",function() {
    var html = new lib.html.cls.Element();
    html.batch({
      h1: "title",
      h2: "subtitle",
      p: [{ cls: "error" },"text text"],
      img: { src: "photo.png" },
    });
    assert.deepEqual(html,{
      _open: [],
      _html: "<h1>title</h1><h2>subtitle</h2><p class=\"error\">text text</p><img src=\"photo.png\" />",
    });
  });

});

// - -------------------------------------------------------------------- - //
