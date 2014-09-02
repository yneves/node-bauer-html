// - -------------------------------------------------------------------- - //
// - libs

var lib = {
  dom: function(arg) { return require("bauer-dom")(arg) },
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

module.exports = exports = Element;

// - -------------------------------------------------------------------- - //
