// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	cheerio: require("cheerio"),
	factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //
// - wrap

lib.factory.extend({

	wrap: {

		// .wrap(class,methods)
		fo: function(cls,methods) {
			for (var name in methods) {
				lib.factory.wrap(cls,name,methods[name]);
			}
		},

		// .wrap(class,methods,callback)
		faf: function(cls,names,callback) {
			for (var i = 0; i < names.length; i++) {
				lib.factory.wrap(cls,names[i],callback);
			}
		},

		// .wrap(class,method,callback)
		fsf: function(cls,name,callback) {
			if (cls && cls.prototype && cls.prototype[name]) {
				var original = cls.prototype[name];
				var method = callback.apply(cls,[original,name]);
				cls.prototype[name] = lib.factory.method(method);
			} else if (cls[name]) {
				var original = cls[name];
				var method = callback.apply(cls,[original,name]);
				cls[name] = method;
			}
		},

	}

});

// - -------------------------------------------------------------------- - //
// - cheerio

lib.factory.wrap(
	lib.cheerio,
	["map","each","filter"],
	function(original) {
		return function(callback) {
			if (lib.factory.isFunction(callback)) {
				return original.apply(this,[function() {
					return callback.apply(lib.cheerio(this),arguments);
				}]);
			} else {
				return original.apply(this,arguments);
			}
		}
	}
);


lib.factory.extend(lib.cheerio.prototype,{

	values: lib.factory.method({

		// .values(values)
		o: function(values) {
			for (var name in values) {
				this.find("[name='"+name+"']").each(function() {
					if (this.is("textarea")) {
						this.text(values[name]);
					} else if (this.is("select")) {
						this.find("option[value='"+values[name]+"']")
							.attr("selected","selected");
					} else {
						this.attr("value",values[name]);
					}
				})
			}
			return this;
		},

		// .values()
		_: "return this;",

	}),

});

// - -------------------------------------------------------------------- - //

module.exports = function(html) {
	return lib.cheerio.load(html).root();
};

// - -------------------------------------------------------------------- - //
