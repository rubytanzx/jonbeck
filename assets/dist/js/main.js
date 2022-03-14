"use strict";
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
	Prism = function () {
		var o = /\blang(?:uage)?-(\w+)\b/i,
			t = 0,
			C = _self.Prism = {
				manual: _self.Prism && _self.Prism.manual,
				util: {
					encode: function (e) {
						return e instanceof s ? new s(e.type, C.util.encode(e.content), e.alias) : "Array" === C.util.type(e) ? e.map(C.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
					},
					type: function (e) {
						return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
					},
					objId: function (e) {
						return e.__id || Object.defineProperty(e, "__id", {
							value: ++t
						}), e.__id
					},
					clone: function (e) {
						switch (C.util.type(e)) {
							case "Object":
								var t = {};
								for (var a in e) e.hasOwnProperty(a) && (t[a] = C.util.clone(e[a]));
								return t;
							case "Array":
								return e.map && e.map(function (e) {
									return C.util.clone(e)
								});
						}
						return e
					}
				},
				languages: {
					extend: function (e, t) {
						var a = C.util.clone(C.languages[e]);
						for (var n in t) a[n] = t[n];
						return a
					},
					insertBefore: function (a, e, t, n) {
						var r = (n = n || C.languages)[a];
						if (2 == arguments.length) {
							for (var i in t = e) t.hasOwnProperty(i) && (r[i] = t[i]);
							return r
						}
						var s = {};
						for (var l in r)
							if (r.hasOwnProperty(l)) {
								if (l == e)
									for (var i in t) t.hasOwnProperty(i) && (s[i] = t[i]);
								s[l] = r[l]
							}
						return C.languages.DFS(C.languages, function (e, t) {
							t === n[a] && e != a && (this[e] = s)
						}), n[a] = s
					},
					DFS: function (e, t, a, n) {
						for (var r in n = n || {}, e) e.hasOwnProperty(r) && (t.call(e, r, e[r], a || r), "Object" !== C.util.type(e[r]) || n[C.util.objId(e[r])] ? "Array" !== C.util.type(e[r]) || n[C.util.objId(e[r])] || (n[C.util.objId(e[r])] = !0, C.languages.DFS(e[r], t, r, n)) : (n[C.util.objId(e[r])] = !0, C.languages.DFS(e[r], t, null, n)))
					}
				},
				plugins: {},
				highlightAll: function (e, t) {
					var a = {
						callback: t,
						selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
					};
					C.hooks.run("before-highlightall", a);
					for (var n, r = a.elements || document.querySelectorAll(a.selector), i = 0; n = r[i++];) C.highlightElement(n, !0 === e, a.callback)
				},
				highlightElement: function (e, t, a) {
					for (var n, r, i = e; i && !o.test(i.className);) i = i.parentNode;
					i && (n = (i.className.match(o) || [, ""])[1].toLowerCase(), r = C.languages[n]), e.className = e.className.replace(o, "").replace(/\s+/g, " ") + " language-" + n, i = e.parentNode, /pre/i.test(i.nodeName) && (i.className = i.className.replace(o, "").replace(/\s+/g, " ") + " language-" + n);
					var s = {
						element: e,
						language: n,
						grammar: r,
						code: e.textContent
					};
					if (C.hooks.run("before-sanity-check", s), !s.code || !s.grammar) return s.code && (C.hooks.run("before-highlight", s), s.element.textContent = s.code, C.hooks.run("after-highlight", s)), void C.hooks.run("complete", s);
					if (C.hooks.run("before-highlight", s), t && _self.Worker) {
						var l = new Worker(C.filename);
						l.onmessage = function (e) {
							s.highlightedCode = e.data, C.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a && a.call(s.element), C.hooks.run("after-highlight", s), C.hooks.run("complete", s)
						}, l.postMessage(JSON.stringify({
							language: s.language,
							code: s.code,
							immediateClose: !0
						}))
					} else s.highlightedCode = C.highlight(s.code, s.grammar, s.language), C.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a && a.call(e), C.hooks.run("after-highlight", s), C.hooks.run("complete", s)
				},
				highlight: function (e, t, a) {
					var n = C.tokenize(e, t);
					return s.stringify(C.util.encode(n), a)
				},
				matchGrammar: function (e, t, a, n, r, i, s) {
					var l = C.Token;
					for (var o in a)
						if (a.hasOwnProperty(o) && a[o]) {
							if (o == s) return;
							var u = a[o];
							u = "Array" === C.util.type(u) ? u : [u];
							for (var g = 0; g < u.length; ++g) {
								var c = u[g],
									p = c.inside,
									d = !!c.lookbehind,
									m = !!c.greedy,
									f = 0,
									h = c.alias;
								if (m && !c.pattern.global) {
									var y = c.pattern.toString().match(/[imuy]*$/)[0];
									c.pattern = RegExp(c.pattern.source, y + "g")
								}
								c = c.pattern || c;
								for (var b = n, v = r; b < t.length; v += t[b].length, ++b) {
									var k = t[b];
									if (t.length > e.length) return;
									if (!(k instanceof l)) {
										c.lastIndex = 0;
										var w = 1;
										if (!(_ = c.exec(k)) && m && b != t.length - 1) {
											if (c.lastIndex = v, !(_ = c.exec(e))) break;
											for (var P = _.index + (d ? _[1].length : 0), S = _.index + _[0].length, x = b, A = v, j = t.length; x < j && (A < S || !t[x].type && !t[x - 1].greedy); ++x)(A += t[x].length) <= P && (++b, v = A);
											if (t[b] instanceof l || t[x - 1].greedy) continue;
											w = x - b, k = e.slice(v, A), _.index -= v
										}
										if (_) {
											d && (f = _[1].length);
											S = (P = _.index + f) + (_ = _[0].slice(f)).length;
											var _, O = k.slice(0, P),
												F = k.slice(S),
												N = [b, w];
											O && (++b, v += O.length, N.push(O));
											var E = new l(o, p ? C.tokenize(_, p) : _, h, _, m);
											if (N.push(E), F && N.push(F), Array.prototype.splice.apply(t, N), 1 != w && C.matchGrammar(e, t, a, b, v, !0, o), i) break
										} else if (i) break
									}
								}
							}
						}
				},
				tokenize: function (e, t) {
					var a = [e],
						n = t.rest;
					if (n) {
						for (var r in n) t[r] = n[r];
						delete t.rest
					}
					return C.matchGrammar(e, a, t, 0, 0, !1), a
				},
				hooks: {
					all: {},
					add: function (e, t) {
						var a = C.hooks.all;
						a[e] = a[e] || [], a[e].push(t)
					},
					run: function (e, t) {
						var a = C.hooks.all[e];
						if (a && a.length)
							for (var n, r = 0; n = a[r++];) n(t)
					}
				}
			},
			s = C.Token = function (e, t, a, n, r) {
				this.type = e, this.content = t, this.alias = a, this.length = 0 | (n || "").length, this.greedy = !!r
			};
		if (s.stringify = function (t, a, e) {
				if ("string" == typeof t) return t;
				if ("Array" === C.util.type(t)) return t.map(function (e) {
					return s.stringify(e, a, t)
				}).join("");
				var n = {
					type: t.type,
					content: s.stringify(t.content, a, e),
					tag: "span",
					classes: ["token", t.type],
					attributes: {},
					language: a,
					parent: e
				};
				if ("comment" == n.type && (n.attributes.spellcheck = "true"), t.alias) {
					var r = "Array" === C.util.type(t.alias) ? t.alias : [t.alias];
					Array.prototype.push.apply(n.classes, r)
				}
				C.hooks.run("wrap", n);
				var i = Object.keys(n.attributes).map(function (e) {
					return e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
				}).join(" ");
				return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + (i ? " " + i : "") + ">" + n.content + "</" + n.tag + ">"
			}, !_self.document) return _self.addEventListener && _self.addEventListener("message", function (e) {
			var t = JSON.parse(e.data),
				a = t.language,
				n = t.code,
				r = t.immediateClose;
			_self.postMessage(C.highlight(n, C.languages[a], a)), r && _self.close()
		}, !1), _self.Prism;
		var e = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
		return e && (C.filename = e.src, !document.addEventListener || C.manual || e.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(C.highlightAll) : window.setTimeout(C.highlightAll, 16) : document.addEventListener("DOMContentLoaded", C.highlightAll))), _self.Prism
	}();
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
	comment: /<!--[\s\S]*?-->/,
	prolog: /<\?[\s\S]+?\?>/,
	doctype: /<!DOCTYPE[\s\S]+?>/i,
	cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
	tag: {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\s\S])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			tag: {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					punctuation: /^<\/?/,
					namespace: /^[^\s>\/:]+:/
				}
			},
			"attr-value": {
				pattern: /=(?:('|")[\s\S]*?(\1)|[^\s>]+)/i,
				inside: {
					punctuation: /[=>"']/
				}
			},
			punctuation: /\/?>/,
			"attr-name": {
				pattern: /[^\s>\/]+/,
				inside: {
					namespace: /^[^\s>\/:]+:/
				}
			}
		}
	},
	entity: /&#?[\da-z]{1,8};/i
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function (e) {
	"entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
}), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.css = {
	comment: /\/\*[\s\S]*?\*\//,
	atrule: {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			rule: /@[\w-]+/
		}
	},
	url: /url\((?:(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	string: {
		pattern: /("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0
	},
	property: /(\b|\B)[\w-]+(?=\s*:)/i,
	important: /\B!important\b/i,
	function: /[-a-z0-9]+(?=\()/i,
	punctuation: /[(){};:]/
}, Prism.languages.css.atrule.inside.rest = Prism.util.clone(Prism.languages.css), Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
	style: {
		pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
		lookbehind: !0,
		inside: Prism.languages.css,
		alias: "language-css"
	}
}), Prism.languages.insertBefore("inside", "attr-value", {
	"style-attr": {
		pattern: /\s*style=("|').*?\1/i,
		inside: {
			"attr-name": {
				pattern: /^\s*style/i,
				inside: Prism.languages.markup.tag.inside
			},
			punctuation: /^\s*=\s*['"]|['"]\s*$/,
			"attr-value": {
				pattern: /.+/i,
				inside: Prism.languages.css
			}
		},
		alias: "language-css"
	}
}, Prism.languages.markup.tag)), Prism.languages.clike = {
	comment: [{
		pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
		lookbehind: !0
	}, {
		pattern: /(^|[^\\:])\/\/.*/,
		lookbehind: !0
	}],
	string: {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0
	},
	"class-name": {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: !0,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	boolean: /\b(true|false)\b/,
	function: /[a-z0-9_]+(?=\()/i,
	number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	punctuation: /[{}[\];(),.:]/
}, Prism.languages.javascript = Prism.languages.extend("clike", {
	keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	number: /\b-?(0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
}), Prism.languages.insertBefore("javascript", "keyword", {
	regex: {
		pattern: /(^|[^\/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: !0,
		greedy: !0
	}
}), Prism.languages.insertBefore("javascript", "string", {
	"template-string": {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: !0,
		inside: {
			interpolation: {
				pattern: /\$\{[^}]+\}/,
				inside: {
					"interpolation-punctuation": {
						pattern: /^\$\{|\}$/,
						alias: "punctuation"
					},
					rest: Prism.languages.javascript
				}
			},
			string: /[\s\S]+/
		}
	}
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
	script: {
		pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
		lookbehind: !0,
		inside: Prism.languages.javascript,
		alias: "language-javascript"
	}
}), Prism.languages.js = Prism.languages.javascript, Array.prototype.forEach.call(document.querySelectorAll("[data-scroll]:not([data-lightbox])"), function (c) {
	c.addEventListener("click", function (e) {
		e.preventDefault();
		var t, a, n, r, i, s, l, o = c.getAttribute("href"),
			u = document.querySelector(o),
			g = c.getAttribute("data-speed");
		u && (t = u, a = g || 500, i = window.pageYOffset, s = t.offsetTop, n = 0 <= (l = (s - i) / (a / 16)) ? function () {
			var e = window.pageYOffset;
			(s - l <= e || window.innerHeight + e >= document.body.offsetHeight) && clearInterval(r)
		} : function () {
			window.pageYOffset <= (s || 0) && clearInterval(r)
		}, r = setInterval(function () {
			window.scrollBy(0, l), n()
		}, 16))
	}, !1)
}), document.querySelector(".trigger-lightbox").addEventListener("click", function () {
	new lightbox("#modal")
});
