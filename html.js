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
	dom: require("./dom.js"),
	factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //
// - global

var TAG_OPEN_CLOSE = ["script","iframe","style"];

var TAG_CLOSED = ["br","hr","img","link","meta","input","source","param","embed","base"];

var TAG_OPEN = [
	"html","body","head","title",
	"section","nav","article","aside","header","footer","address","main",
	"h1","h2","h3","h4","h5","h6",
	"div","span","a","p","em","strong","small","big",
	"pre","blockquote","cite","code",
	"ol","ul","li","dl","dd","dt",
	"table","caption","tbody","thead","tfoot","tr","th","td",
	"form","fieldset","button","select","textarea","label","option",
	"object","video","audio","canvas","svg"
];

var ENTITY = {
	"º": "&deg;",		"ã": "&atilde;",	"õ": "&otilde;",
	"Ã": "&Atilde;",	"Õ": "&Otilde;",	"â": "&acirc;",
	"ê": "&ecirc;",		"î": "&icirc;",		"ô": "&ocirc;",
	"û": "&ucirc;",		"Â": "&Acirc;",		"Ê": "&Ecirc;",
	"Î": "&Icirc;",		"Ô": "&Ocirc;",		"Û": "&Ucirc;",
	"á": "&aacute;",	"é": "&eacute;",	"í": "&iacute;",
	"ó": "&oacute;",	"ú": "&uacute;",	"Á": "&Aacute;",
	"É": "&Eacute;",	"Í": "&Iacute;",	"Ó": "&Oacute;",
	"Ú": "&Uacute;",	"ç": "&ccedil;",	"Ç": "&Ccedil;",
};

// - -------------------------------------------------------------------- - //
// @Element

var Element = lib.factory.class({

	// @constructor
	constructor: function() {
		this._open = [];
		this._html = "";
	},

	// .toString()
	toString: function() {
		return this._html;
	},

// - -------------------------------------------------------------------- - //

	// .clone()
	clone: function() {
		var clone = new Element();
		clone._html = this._html;
		for (var i = 0; i < this._open.length; i++) {
			clone._open[i] = this._open[i];
		}
		return clone;
	},

// - -------------------------------------------------------------------- - //

	dom: {

		// .dom()
		0: function() {
			var html = this;
			var dom = lib.dom(html._html);
			dom.flush = function() {
				html._html = dom.html();
				return html;
			};
			return dom;
		},

		// .dom(callback)
		f: function(callback) {
			var dom = lib.dom(this._html);
			callback.call(dom,dom);
			this._html = dom.html();
			return this;
		},

	},

// - -------------------------------------------------------------------- - //

	// .concat()
	concat: function() {
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "object") {

				// .concat(html)
				if (arg instanceof Element) {
					this._html += arg._html;

				// .concat(object)
				} else {
					for (var key in arg) {
						var aname = (key == "cls") ? "class" : key;
						var avalue = arg[key];
						var atype = lib.factory.type(avalue);
						if (atype == "array") {
							if (avalue.length > 0) {
								this._html += " " + aname + "=\"" + avalue.join(" ").replace(/\"/g,"&quot;") + "\"";
							}
						} else if (atype == "object") {
							for (var akey in avalue) {
								var avtype = lib.factory.type(avalue[akey]);
								var avvalue = avalue[akey];
								if (avtype == "object" || avtype == "array") {
									avvalue = JSON.stringify(avvalue);
								}
								this._html += " " + aname + "-" + akey + "=\"" + avvalue.replace(/\"/g,"&quot;") + "\"";
							}
						} else if (atype == "string") {
							this._html += " " + aname + "=\"" + avalue.replace(/\"/g,"&quot;") + "\"";
						} else if (atype == "number") {
							this._html += " " + aname + "=\"" + avalue.toString() + "\"";
						} else if (atype == "boolean") {
							if (avalue) {
								this._html += " " + aname;
							}
						}
					}
				}

			// .concat(callback)
			} else if (type == "function") {
				if (arg.length == 0) {
					this.concat(arg());
				} else if (arg.length == 1) {
					var content = new Element();
					arg(content);
					this._html += content._html;
				}

			// .concat(string)
			} else if (type == "string") {
				this._html += arg;

			// .concat(number)
			} else if (type == "number") {
				this._html += arg.toString();

			// .concat(array)
			} else if (type == "array" || type == "arguments") {
				this.concat.apply(this,arg);
			}
		}
		return this;
	},

// - -------------------------------------------------------------------- - //

	replace: {

		// .replace(key)
		s: function(key) {
			var html = this;
			var content = new Element();
			content.flush = function() {
				return html.replace(key,content._html);
			};
			return content;
		},

		// .replace(re)
		r: function(re) {
			var html = this;
			var content = new Element();
			content.flush = function() {
				return html.replace(re,content._html);
			};
			return content;
		},

		// .replace(macros)
		o: function(macros) {
			for (var key in macros) {
				this.replace(key,macros[key]);
			}
			return this;
		},

		// .replace(callback)
		f: function(callback) {
			var re = /\{[a-zA-Z0-9\-\_]+\}/g;
			this._html = this._html.replace(re,function(token) {
				var key = token.substr(1,token.length-2);
				if (callback.length <= 1) {
					return callback(key);
				} else if (callback.length == 2) {
					var content = new Element();
					callback(key,content);
					return content._html;
				}
				return callback(token,idx);
			});
		},

		// .replace(key,content)
		ss: function(key,content) {
			var re = new RegExp("{"+key+"}","g");
			this._html = this._html.replace(re,content);
			return this;
		},

		// .replace(key,callback)
		sf: function(key,callback) {
			var re = new RegExp("{"+key+"}","g");
			var content = new Element();
			if (callback.length == 0) {
				content.concat(callback());
			} else if (callback.length == 1) {
				callback(content);
			}
			this._html = this._html.replace(re,content._html);
			return this;
		},

		// .replace(key,object)
		so: function(key,object) {
			var re = new RegExp("{"+key+"}","g");
			if (object instanceof Element) {
				this._html = this._html.replace(re,object._html);
			} else {
				var content = new Element();
				content.batch(object);
				this._html = this._html.replace(re,content._html);
			}
			return this;
		},

		// .replace(regexp,content)
		rs: function(re,content) {
			this._html = this._html.replace(re,content);
			return this;
		},

		// .replace(regexp,callback)
		rf: function(re,callback) {
			if (callback.length == 0) {
				this._html = this._html.replace(re,callback());
			} else if (callback.length == 1) {
				var content = new Element();
				callback(content);
				this._html = this._html.replace(re,content._html);
			}
			return this;
		},

		// .replace(regexp,object)
		ro: function(re,object) {
			if (object instanceof Element) {
				this._html = this._html.replace(re,object._html);
			} else {
				var content = new Element();
				content.batch(object);
				this._html = this._html.replace(re,content._html);
			}
			return this;
		},

	},

// - -------------------------------------------------------------------- - //

	// .batch()
	batch: function() {
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "object") {
				for (var key in arg) {
					if (lib.factory.isFunction(this[key])) {
						var atype = lib.factory.type(arg[key]);
						if (atype == "array") {
							this[key].apply(this,arg[key]);
						} else if (atype == "object") {
							this[key].call(this,arg[key],"");
						} else {
							this[key].call(this,arg[key]);
						}
					}
				}
			} else if (type == "array") {
				this.batch.apply(this,arg);
			} else if (type == "string" || type == "number") {
				this.concat(arg);
			}
		}
		return this;
	},

// - -------------------------------------------------------------------- - //

	open: {

		// .open(name)
		s: function(name) {
			this.concat("<",name,">");
			this._open.push(name);
			return this;
		},

		// .open(name,attr)
		so: function(name,attr) {
			this.concat("<",name,attr,">");
			this._open.push(name);
			return this;
		},

	},

// - -------------------------------------------------------------------- - //

	// .close()
	close: function() {
		if (this._open.length > 0) {
			var name = this._open.pop();
			this.concat("</" + name + ">");
		}
		return this;
	},

// - -------------------------------------------------------------------- - //

	// .wrap()
	wrap: function() {
		var content = this._html;
		this._html = "";
		this.open.apply(this,arguments);
		this.concat(content);
		this.close();
		return this;
	},

// - -------------------------------------------------------------------- - //

	// .entity()
	entity: function() {
		for (var key in ENTITY) {
			var re = new RegExp(key,"g");
			this._html = this._html.replace(re,ENTITY[key]);
		}
		this._html = this._html.replace(/[^\w]/g,function(str) {
			var index = str.charCodeAt(0);
			return index > 127 ? '&#'+index+';' : str;
		});
		return this;
	},

// - -------------------------------------------------------------------- - //

	// .doctype()
	doctype: function() {
		return this.concat("<!DOCTYPE html>\n");
	},

});

// - -------------------------------------------------------------------- - //

// @tag-open-close
TAG_OPEN_CLOSE.forEach(function(name) {
	Element.prototype[name] = function() {
		var attr = {}, args = [];
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "object") {
				if (arg instanceof Element) {
					args.push(arg);
				} else {
					lib.factory.extend(attr,arg);
				}
			} else {
				args.push(arg);
			}
		}
		if (args.length > 0) {
			this.open(name,attr);
			this.concat.apply(this,args);
			this.close();
		} else {
			return this.open(name,attr).close();
		}
	};
});

// @tag-closed
TAG_CLOSED.forEach(function(name) {
	Element.prototype[name] = function() {
		var attr = {};
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "object") {
				if (arg instanceof Element) {
				} else {
					lib.factory.extend(attr,arg);
				}
			}
		}
		return this.concat("<",name,attr," />");
	};
});

// @tag-open
TAG_OPEN.forEach(function(name) {
	Element.prototype[name] = function() {
		var attr = {}, args = [];
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "object") {
				if (arg instanceof Element) {
					args.push(arg);
				} else {
					lib.factory.extend(attr,arg);
				}
			} else {
				args.push(arg);
			}
		}
		if (args.length > 0) {
			this.open(name,attr);
			this.concat.apply(this,args);
			this.close();
			return this;
		} else {
			return this.open(name,attr);
		}
	};
});

// - -------------------------------------------------------------------- - //

// @Widget
var Widget = lib.factory.class({

	// @constructor
	constructor: function(params) {
		this._params = {};
		this.param(params);
	},

	param: {

		_: function() {},

		// .param(params)
		o: function(params) {
			for (var name in params) {
				this._params[name] = params[name];
			}
			return this;
		},

		// .param(name,value)
		2: function(name,value) {
			this._params[name] = value;
			return this;
		},

		// .param(name)
		s: function(name) {
			return this._params[name];
		},

		// .param()
		0: function() {
			return this._params;
		},

	},

	// .toElement()
	toElement: function() {
		throw new Error("not implemented");
	},

});

// - -------------------------------------------------------------------- - //

// @Table
var Table = lib.factory.class({
	inherits: Widget,
	toElement: function() {
		var params = this.param();
		var html = new Element();

		// table
		html.table({ cellspacing: 0, cellpadding: 0, border: 0 });

		// caption
		lib.factory.isString(params.caption) && html.caption(params.caption);

		if (!lib.factory.isArray(params.rows)) {
			params.rows = [];
		}

		// header
		if (lib.factory.isNull(params.header)) {
			if (lib.factory.isObject(params.rows[0])) {
				params.header = Object.keys(params.rows[0]);
			}
		}
		if (lib.factory.isArray(params.header)) {
			html.thead();
			var hrows = [];
			params.header.forEach(function(head,idx) {
				if (lib.factory.isArray(head)) {
					while (hrows.length < head.length) {
						hrows.push([]);
					}
					head.forEach(function(hitem,hidx) {
						if (lib.factory.isArray(hitem)) {
							hitem.forEach(function(hcell) {
								hrows[hidx].push([0,hcell]);
							});
						} else {
							var len = head[hidx + 1].length;
							hrows[hidx].push([len,hitem]);
						}
					});
				} else {
					if (hrows.length < 1) hrows.push([]);
					hrows[0].push([0,head]);
				}
			});
			hrows.forEach(function(hrow,ridx) {
				var cls = [];
				if (ridx == 0) cls.push("f");
				if (ridx == hrows.length-1) cls.push("l");
				html.tr({ cls: cls });
				hrow.forEach(function(cell,cidx) {
					var cls = [];
					if (cidx == 0) cls.push("f");
					if (cidx == hrow.length-1) cls.push("l");
					if (cell[0] > 0) {
						html.th({ colspan: cell[0], cls: cls },cell[1]);
					} else {
						html.th({ cls: cls },cell[1]);
					}
				});
				html.close();
			});
			html.close();
		}

		// cells
		if (lib.factory.isArray(params.cells)) {
			var keys = params.cells;
			params.cells = function(row) {
				var vals = [];
				for (var i = 0; i < keys.length; i++) {
					vals.push(row[keys[i]]);
				}
				return vals;
			};
		}
		if (!lib.factory.isFunction(params.cells)) {
			var type = lib.factory.type(params.rows[0]);
			if (type == "array") {
				params.cells = function(row) {
					return row;
				};
			} else if (type == "object") {
				var keys = Object.keys(params.rows[0]);
				params.cells = function(row) {
					var vals = [];
					for (var i = 0; i < keys.length; i++) {
						vals.push(row[keys[i]]);
					}
					return vals;
				};
			}
		}

		// rows
		if (params.rows.length > 0) {
			html.tbody();
			params.rows.forEach(function(row,ridx) {
				var rcls = [];
				if (ridx == 0) rcls.push("f");
				if (ridx == params.rows.length-1) rcls.push("l");
				html.tr({ cls: rcls });
				var cells = params.cells(row,ridx);
				cells.forEach(function(content,idx) {
					var cls = [];
					if (idx == 0) cls.push("f");
					if (idx == cells.length-1) cls.push("l");
					var ctype = lib.factory.type(content);
					if (ctype == "undefined") {
						content = "";
					} else if (ctype == "object") {
						if (content.cls) {
							cls.push(content.cls);
						}
						if (content.val) {
							if (content.url) {
								content = "<a href=\""+content.url+"\">"+content.val+"</a>";
							} else {
								content = content.val;
							}
						}
					}
					html.td({ cls: cls },content);
				});
				html.close();
			});
			html.close();
		}

		// footer
		if (lib.factory.isArray(params.footer)) {
			html.tfoot();
			params.footer.forEach(function(foot,idx) {
				var frows = [];
				if (lib.factory.isArray(foot)) {
					while (frows.length < foot.length) {
						frows.push([]);
					}
					foot.forEach(function(fitem,fidx) {
						if (lib.factory.type(fitem) == "array") {
							fitem.forEach(function(fcell) {
								frows[hidx].push([0,fcell]);
							});
						} else {
							var len = foot[fidx + 1].length;
							frows[hidx].push([len,fitem]);
						}
					});
				} else {
					if (frows.length < 1) frows.push([]);
					frows[0].push([0,foot]);
				}
				frows.forEach(function(hrow) {
					html.tr();
					frow.forEach(function(cell) {
						if (cell[0] > 0) {
							html.td({ colspan: cell[0] },cell[1]);
						} else {
							html.td(cell[1]);
						}
					});
					html.close();
				});
			});
			html.close();
		}

		html.close();
		return html;

	},

});

// - -------------------------------------------------------------------- - //

// @Pager
var Pager = lib.factory.class({
	inherits: Widget,
	toElement: function() {
		var params = this.param();
		var html = new Element();
		var count = params.count || 0;
		var limit = params.limit || 25;
		var url = params.url || "?page={page}";
		var page = parseInt(params.page) || 1;
		var size = params.size || 10;
		var back = params.back || 5;
		var start = 0;
		var stop = size;
		if (page > back) {
			start = page - back;
			stop = page + size - back - 1;
		}
		html.open("div",{ cls: "pages" });
		var number = 0;
		var pages = 0;
		for (var i = 0; i < count; i += limit) {
			number++;
			if (number >= start && number <= stop) {
				pages++;
				var href = url.replace(/{page}/,number);
				html.a(number,{ href: href, cls: page == number ? "on" : null });
			}
			if (pages >= size) {
				break;
			}
		}
		html.close();
		return html;
	},
});

// - -------------------------------------------------------------------- - //

// @Document
var Document = lib.factory.class({
	inherits: Widget,

	addFiles: function(html) {
		var files = [];
		for (var i = 1; i < arguments.length; i++) {
			var arg = arguments[i];
			var type = lib.factory.type(arg);
			if (type == "array" || type == "arguments") {
				for (var g = 0; g < arg.length; g++) {
					var atype = lib.factory.type(arg[g]);
					if (atype == "string" || atype == "object") {
						files.push(arg[g]);
					}
				}
			} else if (type == "string" || type == "object") {
				files.push(arg);
			}
		}
		while (files.length > 0) {
			var arg = files.shift();
			var type = lib.factory.type(arg);
			if (type == "object" && lib.factory.isString(arg.require)) {
				var ext = lib.path.extname(arg.require);
				if (ext == ".js") {
					var content = "";
					if (lib.factory.isArray(arg.vars)) {
						content += arg.vars.map(function(name) { return "window." + name + " = " }).join("");
					} else if (lib.factory.isString(arg.vars)) {
						content += "window." + arg.vars + " = ";
					}
					content += "require('" + arg.require + "')";
					html.script({ type: "text/javascript" },content);
				}
			} else if (type == "string") {
				var ext = lib.path.extname(arg);
				if (ext == ".js") {
					html.script({ src: arg, type: "text/javascript" });
				} else if (ext == ".jsx") {
					html.script({ src: arg, type: "text/jsx" });
				} else if (ext == ".css") {
					html.link({ href: arg, rel: "stylesheet", type: "text/css" });
				} else if (ext == ".ico") {
					html.link({ href: arg, rel: "shortcut icon" });
				}
			}
		}
	},

	toElement: function() {
		var params = this.param();
		var html = new Element();
		html.doctype();
		html.html();
		html.head();
		lib.factory.isString(params.base) && html.base({ href: params.base });
		lib.factory.isString(params.keywords) && html.meta({ name: "keywords", content: params.keywords });
		lib.factory.isString(params.description) && html.meta({ name: "description", content: params.description });
		lib.factory.isString(params.title) && html.title(params.title);
		this.addFiles(html,params.icon,params.css,params.js,params.files);
		html.close();
		html.body();
		html.concat("{body}");
		if (lib.factory.isString(params.analytics)) {
			html.open("script",{ type: "text/javascript" });
			html.html([
				"var _gaq = _gaq||[];",
				"_gaq.push(['_setAccount','" + params.analytics + "']);",
				"_gaq.push(['_trackPageview']);",
				"(function(){",
				"var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ",
				"ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';",
				"var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
				"})();",
			]);
			html.close();
		}
		html.close();
		html.close();
		return html;
	},

});

// - -------------------------------------------------------------------- - //
// - exports

exports = function() { return new Element() }

exports.element = function() { return new Element() }

exports.pager = function(params) { return new Pager(params).toElement() }
exports.table = function(params) { return new Table(params).toElement() }
exports.document = function(params) { return new Document(params).toElement() }

exports.cls = {}
exports.cls.Element = Element;
exports.cls.Widget = Widget;
exports.cls.Table = Table;
exports.cls.Pager = Pager;
exports.cls.Document = Document;

var cache = {};
exports.require = function(name) {
	if (!cache[name]) {
		cache[name] = new Element();
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
