// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	html: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - Module

describe("Module",function() {

	it("exports",function() {
		assert.deepEqual(lib.html(),new lib.html.cls.Element());
		assert.deepEqual(lib.html(),lib.html.element());
		assert.deepEqual(lib.html.table(),new lib.html.cls.Table().toElement());
		assert.deepEqual(lib.html.pager(),new lib.html.cls.Pager().toElement());
		assert.deepEqual(lib.html.document(),new lib.html.cls.Document().toElement());
	});

});

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
// - Document

describe("Document",function() {

	// @document
	it("document",function() {
		var html = lib.html.document({
			js: ["/js/jquery.js","/js/index.js"],
			css: ["/css/style.css","/css/index.css"],
			title: "title",
			description: "description",
			keywords: "keywords",
			icon: "/img/site.ico",
			analytics: "UA-123213",
		});
		assert.deepEqual(html,{
			_open: [],
			_html: "<!DOCTYPE html>\n<html><head><meta name=\"keywords\" content=\"keywords\" /><meta name=\"description\" content=\"description\" /><title>title</title><link href=\"/img/site.ico\" rel=\"shortcut icon\" /><link href=\"/css/style.css\" rel=\"stylesheet\" type=\"text/css\" /><link href=\"/css/index.css\" rel=\"stylesheet\" type=\"text/css\" /><script src=\"/js/jquery.js\" type=\"text/javascript\"></script><script src=\"/js/index.js\" type=\"text/javascript\"></script></head><body>{body}<script type=\"text/javascript\"><html>var _gaq = _gaq||[];_gaq.push(['_setAccount','UA-123213']);_gaq.push(['_trackPageview']);(function(){var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();</html></script></body></html>",
		});
	});

});

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
			_html: "<div class=\"pages\"><a href=\"/page/1\">1</a><a href=\"/page/2\">2</a><a href=\"/page/3\" class=\"on\">3</a><a href=\"/page/4\">4</a><a href=\"/page/5\">5</a><a href=\"/page/6\">6</a><a href=\"/page/7\">7</a><a href=\"/page/8\">8</a></div>",
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
			_html: "<div class=\"pages\"><a href=\"/page/2\">2</a><a href=\"/page/3\" class=\"on\">3</a><a href=\"/page/4\">4</a><a href=\"/page/5\">5</a><a href=\"/page/6\">6</a><a href=\"/page/7\">7</a><a href=\"/page/8\">8</a><a href=\"/page/9\">9</a></div>",
		});
	});

});

// - -------------------------------------------------------------------- - //
