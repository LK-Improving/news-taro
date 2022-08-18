"use strict";
function t(t, e, i) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (t[e] = i),
    t
  );
}
function e(e) {
  function n(t) {
    if (e._edit) e._edit.insert(t);
    else {
      var i = e.data.nodes.slice(0);
      i.push(t), e._editVal("nodes", e.data.nodes, i, !0);
    }
  }
  function s(t) {
    "string" == typeof t.src && (t.src = [t.src]);
    for (var i = new r(e), s = 0; s < t.src.length; s++)
      t.src[s] = i.getUrl(t.src[s]);
    n({ name: "div", attrs: { style: "text-align:center" }, children: [t] });
  }
  var a = this;
  (this.vm = e), (this.editHistory = []), (this.editI = -1), (e._mask = []);
  var l = function(i) {
    var r = a.editHistory[a.editI + i];
    r && ((a.editI += i), e.setData(t({}, r.key, r.value)));
  };
  (e.undo = function() {
    return l(-1);
  }),
    (e.redo = function() {
      return l(1);
    }),
    (e._editVal = function(i, r, n, s) {
      for (; a.editI < a.editHistory.length - 1; ) a.editHistory.pop();
      for (; a.editHistory.length > 30; ) a.editHistory.pop(), a.editI--;
      var l = a.editHistory[a.editHistory.length - 1];
      (l && l.key === i) ||
        (l && (a.editHistory.pop(), a.editI--),
        a.editHistory.push({ key: i, value: r }),
        a.editI++),
        a.editHistory.push({ key: i, value: n }),
        a.editI++,
        s && e.setData(t({}, i, n));
    }),
    (e._getItem = function(t, r, n) {
      var s, a;
      return (
        "img" === t.name
          ? ((s = i.img.slice(0)),
            e.getSrc ||
              ((a = s.indexOf("换图")),
              -1 !== a && s.splice(a, 1),
              (a = s.indexOf("超链接")),
              -1 !== a && s.splice(a, 1),
              -1 !== (a = s.indexOf("预览图")) && s.splice(a, 1)),
            -1 !== (a = s.indexOf("禁用预览")) &&
              t.attrs.ignore &&
              (s[a] = "启用预览"))
          : "a" === t.name
          ? ((s = i.link.slice(0)),
            e.getSrc || (-1 !== (a = s.indexOf("更换链接")) && s.splice(a, 1)))
          : "video" === t.name || "audio" === t.name
          ? ((s = i.media.slice(0)),
            (a = s.indexOf("封面")),
            e.getSrc || -1 === a || s.splice(a, 1),
            (a = s.indexOf("循环")),
            t.attrs.loop && -1 !== a && (s[a] = "不循环"),
            (a = s.indexOf("自动播放")),
            t.attrs.autoplay && -1 !== a && (s[a] = "不自动播放"))
          : (s = i.node.slice(0)),
        r || (-1 !== (a = s.indexOf("上移")) && s.splice(a, 1)),
        n || (-1 !== (a = s.indexOf("下移")) && s.splice(a, 1)),
        s
      );
    }),
    (e._tooltip = function(t) {
      e.setData({ tooltip: { top: t.top, items: t.items } }),
        (e._tooltipcb = t.success);
    }),
    (e._slider = function(t) {
      e.setData({
        slider: { min: t.min, max: t.max, value: t.value, top: t.top }
      }),
        (e._slideringcb = t.changing),
        (e._slidercb = t.change);
    }),
    (e._maskTap = function() {
      for (; this._mask.length; ) this._mask.pop()();
      var t = {};
      this.data.tooltip && (t.tooltip = null),
        this.data.slider && (t.slider = null),
        (this.data.tooltip || this.data.slider) && this.setData(t);
    }),
    (e.insertHtml = function(t) {
      a.inserting = !0;
      var i = new r(e).parse(t);
      a.inserting = void 0;
      for (var s = 0; s < i.length; s++) n(i[s]);
    }),
    (e.insertImg = function() {
      e.getSrc &&
        e
          .getSrc("img")
          .then(function(t) {
            "string" == typeof t && (t = [t]);
            for (var i = new r(e), s = 0; s < t.length; s++)
              n({ name: "img", attrs: { src: i.getUrl(t[s]) } });
          })
          .catch(function() {});
    }),
    (e.insertLink = function() {
      e.getSrc &&
        e
          .getSrc("link")
          .then(function(t) {
            n({
              name: "a",
              attrs: { href: t },
              children: [{ type: "text", text: t }]
            });
          })
          .catch(function() {});
    }),
    (e.insertTable = function(t, e) {
      for (
        var i = {
            name: "table",
            attrs: {
              style:
                "display:table;width:100%;margin:10px 0;text-align:center;border-spacing:0;border-collapse:collapse;border:1px solid gray"
            },
            children: []
          },
          r = 0;
        r < t;
        r++
      ) {
        for (var s = { name: "tr", attrs: {}, children: [] }, a = 0; a < e; a++)
          s.children.push({
            name: "td",
            attrs: { style: "padding:2px;border:1px solid gray" },
            children: [{ type: "text", text: "" }]
          });
        i.children.push(s);
      }
      n(i);
    }),
    (e.insertVideo = function() {
      e.getSrc &&
        e
          .getSrc("video")
          .then(function(t) {
            s({ name: "video", attrs: { controls: "T" }, src: t });
          })
          .catch(function() {});
    }),
    (e.insertAudio = function() {
      e.getSrc &&
        e
          .getSrc("audio")
          .then(function(t) {
            var e;
            t.src ? ((e = t.src), (t.src = void 0)) : ((e = t), (t = {})),
              (t.controls = "T"),
              s({ name: "audio", attrs: t, src: e });
          })
          .catch(function() {});
    }),
    (e.insertText = function() {
      n({ name: "p", attrs: {}, children: [{ type: "text", text: "" }] });
    }),
    (e.clear = function() {
      e._maskTap(),
        (e._edit = void 0),
        e.setData({
          nodes: [
            { name: "p", attrs: {}, children: [{ type: "text", text: "" }] }
          ]
        });
    }),
    (e.getContent = function() {
      var t = "";
      !(function e(i, r) {
        for (var n = 0; n < i.length; n++) {
          var s = i[n];
          if ("text" === s.type)
            t += s.text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, "<br>")
              .replace(/\xa0/g, "&nbsp;");
          else {
            if (
              "img" === s.name &&
              (s.attrs.src || "").includes("data:image/svg+xml;utf8,")
            ) {
              t += s.attrs.src
                .substr(24)
                .replace(/%23/g, "#")
                .replace("<svg", '<svg style="' + (s.attrs.style || "") + '"');
              continue;
            }
            if ("video" === s.name || "audio" === s.name)
              if (s.src.length > 1) {
                s.children = [];
                for (var a = 0; a < s.src.length; a++)
                  s.children.push({ name: "source", attrs: { src: s.src[a] } });
              } else s.attrs.src = s.src[0];
            else
              "div" === s.name &&
                (s.attrs.style || "").includes("overflow:auto") &&
                "table" === (s.children[0] || {}).name &&
                (s = s.children[0]);
            if (
              "table" === s.name &&
              ((r = s.attrs), (s.attrs.style || "").includes("display:grid"))
            ) {
              s.attrs.style = s.attrs.style.split("display:grid")[0];
              for (
                var l = [{ name: "tr", attrs: {}, children: [] }], c = 0;
                c < s.children.length;
                c++
              )
                (s.children[c].attrs.style = s.children[c].attrs.style.replace(
                  /grid-[^;]+;*/g,
                  ""
                )),
                  s.children[c].r !== l.length
                    ? l.push({
                        name: "tr",
                        attrs: {},
                        children: [s.children[c]]
                      })
                    : l[l.length - 1].children.push(s.children[c]);
              s.children = l;
            }
            t += "<" + s.name;
            for (var o in s.attrs) {
              var d = s.attrs[o];
              d &&
                ("T" !== d && !0 !== d
                  ? ("t" === s.name[0] &&
                      "style" === o &&
                      r &&
                      ((d = d.replace(/;*display:table[^;]*/, "")),
                      r.border &&
                        (d = d.replace(/border[^;]+;*/g, function(t) {
                          return t.includes("collapse") ? t : "";
                        })),
                      r.cellpadding && (d = d.replace(/padding[^;]+;*/g, "")),
                      !d)) ||
                    (t += " " + o + '="' + d.replace(/"/g, "&quot;") + '"')
                  : (t += " " + o));
            }
            (t += ">"),
              s.children && (e(s.children, r), (t += "</" + s.name + ">"));
          }
        }
      })(e.data.nodes);
      for (var i = e.plugins.length; i--; )
        e.plugins[i].onGetContent && (t = e.plugins[i].onGetContent(t) || t);
      return t;
    });
}
var i = require("./config"),
  r = require("../parser");
(e.prototype.onUpdate = function(t, e) {
  var i = this;
  this.vm.data.editable &&
    (this.vm._maskTap(),
    (e.entities.amp = "&"),
    this.inserting ||
      ((this.vm._edit = void 0),
      t ||
        setTimeout(function() {
          i.vm.setData({
            nodes: [
              { name: "p", attrs: {}, children: [{ type: "text", text: "" }] }
            ]
          });
        }, 0)));
}),
  (e.prototype.onParse = function(t) {
    !this.vm.data.editable ||
      ("td" !== t.name && "th" !== t.name) ||
      this.vm.getText(t.children) ||
      t.children.push({ type: "text", text: "" });
  }),
  (module.exports = e);
