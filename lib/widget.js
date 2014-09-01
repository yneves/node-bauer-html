// - -------------------------------------------------------------------- - //

var lib = {
  factory: require("bauer-factory"),
};

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

module.exports = exports = Widget;

// - -------------------------------------------------------------------- - //
