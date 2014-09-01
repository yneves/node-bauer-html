// - -------------------------------------------------------------------- - //
// - libs

var lib = {
  path: require("path"),
  widget: require("./widget.js"),
  element: require("./element.js"),
  factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //

// @Document
var Document = lib.factory.class({
  inherits: lib.widget,

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
    var html = new lib.element();
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

module.exports = exports = Document;

// - -------------------------------------------------------------------- - //
