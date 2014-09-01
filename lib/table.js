// - -------------------------------------------------------------------- - //
// - libs

var lib = {
  widget: require("./widget.js"),
  element: require("./element.js"),
  factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //

// @Table
var Table = lib.factory.class({
  inherits: lib.widget,
  toElement: function() {
    var params = this.param();
    var html = new lib.element();

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

module.exports = exports = Table;

// - -------------------------------------------------------------------- - //
