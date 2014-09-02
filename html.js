/*!
**  bauer-html -- HTML building tool.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-html>
*/
// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	fs: require("fs"),
	path: require("path"),
	factory: require("bauer-factory"),
	table: require("./lib/table.js"),
	pager: require("./lib/pager.js"),
	document: require("./lib/document.js"),
	element: require("./lib/element.js"),
	widget: require("./lib/widget.js"),
};

// - -------------------------------------------------------------------- - //
// - exports

exports = function() { return new lib.element() }
exports.element = function() { return new lib.element() }

exports.pager = function(params) { return new lib.pager(params).toElement() }
exports.table = function(params) { return new lib.table(params).toElement() }
exports.document = function(params) { return new lib.document(params).toElement() }

exports.cls = {}
exports.cls.Element = lib.element;
exports.cls.Widget = lib.widget;
exports.cls.Table = lib.table;
exports.cls.Pager = lib.pager;
exports.cls.Document = lib.document;

var cache = {};
exports.require = function(name) {
	if (!cache[name]) {
		cache[name] = new lib.element();
		var html = name + ".html";
		if (lib.fs.existsSync(html)) {
			cache[name].concat(lib.fs.readFileSync(html,"utf8"));
		}
		var js = name + ".js";
		if (lib.fs.existsSync(js)) {
			var code = require(js);
			if (lib.factory.isFunction(code)) {
				code(cache[name]);
			}
		}
	}
	return cache[name];
};

module.exports = exports;

// - -------------------------------------------------------------------- - //
