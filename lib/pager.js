// - -------------------------------------------------------------------- - //
// - libs

var lib = {
  widget: require("./widget.js"),
  element: require("./element.js"),
  factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //

// @Pager
var Pager = lib.factory.class({
  inherits: lib.widget,
  toElement: function() {
    var params = this.param();
    var html = new lib.element();
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
    html.open("div",{ cls: "pager" });
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

module.exports = exports = Pager;

// - -------------------------------------------------------------------- - //
