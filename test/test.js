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
// - Require

describe("Require",function() {

	// @require
	it("require",function() {
		var html = lib.html.require(__dirname + "/sample");
		assert.deepEqual(html,{
			_open: [],
			_html: "<div><div class=\"div1\"></div><div class=\"div2\"></div><div class=\"div3\"></div><div class=\"div4\"></div></div>",
		})
	});

});

// - -------------------------------------------------------------------- - //
