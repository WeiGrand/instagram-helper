/**
 * Created by heweiguang on 2019-02-21.
 */

!(function (n) {
    'use strict'

    function t (n, t) {
      var o = (65535 & n) + (65535 & t)
      return (n >> 16) + (t >> 16) + (o >> 16) << 16 | 65535 & o
    }

    function o (n, t) {
      return n << t | n >>> 32 - t
    }

    function u (n, u, c, f, h, l) {
      return t(o(t(t(u, n), t(f, l)), h), c)
    }

    function c (n, t, o, c, f, h, l) {
      return u(t & o | ~t & c, n, t, f, h, l)
    }

    function f (n, t, o, c, f, h, l) {
      return u(t & c | o & ~c, n, t, f, h, l)
    }

    function h (n, t, o, c, f, h, l) {
      return u(t ^ o ^ c, n, t, f, h, l)
    }

    function l (n, t, o, c, f, h, l) {
      return u(o ^ (t | ~c), n, t, f, h, l)
    }

    function v (n, o) {
      n[o >> 5] |= 128 << o % 32,
        n[14 + (o + 64 >>> 9 << 4)] = o
      var u, v, p, s, C, A = 1732584193, b = -271733879, x = -1732584194,
        y = 271733878
      for (u = 0; u < n.length; u += 16)
        v = A,
          p = b,
          s = x,
          C = y,
          b = l(b = l(b = l(b = l(b = h(b = h(b = h(b = h(b = f(b = f(b = f(
            b = f(b = c(b = c(b = c(b = c(b, x = c(x,
              y = c(y, A = c(A, b, x, y, n[u], 7, -680876936), b, x, n[u + 1],
                12, -389564586), A, b, n[u + 2], 17, 606105819), y, A, n[u + 3],
              22, -1044525330), x = c(x,
              y = c(y, A = c(A, b, x, y, n[u + 4], 7, -176418897), b, x,
                n[u + 5], 12, 1200080426), A, b, n[u + 6], 17, -1473231341), y,
              A, n[u + 7], 22, -45705983), x = c(x,
              y = c(y, A = c(A, b, x, y, n[u + 8], 7, 1770035416), b, x,
                n[u + 9], 12, -1958414417), A, b, n[u + 10], 17, -42063), y, A,
              n[u + 11], 22, -1990404162), x = c(x,
              y = c(y, A = c(A, b, x, y, n[u + 12], 7, 1804603682), b, x,
                n[u + 13], 12, -40341101), A, b, n[u + 14], 17, -1502002290), y,
              A, n[u + 15], 22, 1236535329), x = f(x,
              y = f(y, A = f(A, b, x, y, n[u + 1], 5, -165796510), b, x,
                n[u + 6], 9, -1069501632), A, b, n[u + 11], 14, 643717713), y,
              A, n[u], 20, -373897302), x = f(x,
              y = f(y, A = f(A, b, x, y, n[u + 5], 5, -701558691), b, x,
                n[u + 10], 9, 38016083), A, b, n[u + 15], 14, -660478335), y, A,
            n[u + 4], 20, -405537848), x = f(x,
            y = f(y, A = f(A, b, x, y, n[u + 9], 5, 568446438), b, x, n[u + 14],
              9, -1019803690), A, b, n[u + 3], 14, -187363961), y, A, n[u + 8],
            20, 1163531501), x = f(x,
            y = f(y, A = f(A, b, x, y, n[u + 13], 5, -1444681467), b, x,
              n[u + 2], 9, -51403784), A, b, n[u + 7], 14, 1735328473), y, A,
            n[u + 12], 20, -1926607734), x = h(x,
            y = h(y, A = h(A, b, x, y, n[u + 5], 4, -378558), b, x, n[u + 8],
              11, -2022574463), A, b, n[u + 11], 16, 1839030562), y, A,
            n[u + 14], 23, -35309556), x = h(x,
            y = h(y, A = h(A, b, x, y, n[u + 1], 4, -1530992060), b, x,
              n[u + 4], 11, 1272893353), A, b, n[u + 7], 16, -155497632), y, A,
            n[u + 10], 23, -1094730640), x = h(x,
            y = h(y, A = h(A, b, x, y, n[u + 13], 4, 681279174), b, x, n[u], 11,
              -358537222), A, b, n[u + 3], 16, -722521979), y, A, n[u + 6], 23,
            76029189), x = h(x,
            y = h(y, A = h(A, b, x, y, n[u + 9], 4, -640364487), b, x,
              n[u + 12], 11, -421815835), A, b, n[u + 15], 16, 530742520), y, A,
            n[u + 2], 23, -995338651), x = l(x,
            y = l(y, A = l(A, b, x, y, n[u], 6, -198630844), b, x, n[u + 7], 10,
              1126891415), A, b, n[u + 14], 15, -1416354905), y, A, n[u + 5],
            21, -57434055), x = l(x,
            y = l(y, A = l(A, b, x, y, n[u + 12], 6, 1700485571), b, x,
              n[u + 3], 10, -1894986606), A, b, n[u + 10], 15, -1051523), y, A,
            n[u + 1], 21, -2054922799), x = l(x,
            y = l(y, A = l(A, b, x, y, n[u + 8], 6, 1873313359), b, x,
              n[u + 15], 10, -30611744), A, b, n[u + 6], 15, -1560198380), y, A,
            n[u + 13], 21, 1309151649), x = l(x,
            y = l(y, A = l(A, b, x, y, n[u + 4], 6, -145523070), b, x,
              n[u + 11], 10, -1120210379), A, b, n[u + 2], 15, 718787259), y, A,
            n[u + 9], 21, -343485551),
          A = t(A, v),
          b = t(b, p),
          x = t(x, s),
          y = t(y, C)
      return [A, b, x, y]
    }

    function p (n) {
      var t, o = '', u = 32 * n.length
      for (t = 0; t < u; t += 8)
        o += String.fromCharCode(n[t >> 5] >>> t % 32 & 255)
      return o
    }

    function s (n) {
      var t, o = []
      for (o[(n.length >> 2) - 1] = void 0,
             t = 0; t < o.length; t += 1)
        o[t] = 0
      var u = 8 * n.length
      for (t = 0; t < u; t += 8)
        o[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32
      return o
    }

    function C (n) {
      return p(v(s(n), 8 * n.length))
    }

    function A (n, t) {
      var o, u, c = s(n), f = [], h = []
      for (f[15] = h[15] = void 0,
           c.length > 16 && (c = v(c, 8 * n.length)),
             o = 0; o < 16; o += 1)
        f[o] = 909522486 ^ c[o],
          h[o] = 1549556828 ^ c[o]
      return u = v(f.concat(s(t)), 512 + 8 * t.length),
        p(v(h.concat(u), 640))
    }

    function b (n) {
      var t, o, u = '0123456789abcdef', c = ''
      for (o = 0; o < n.length; o += 1)
        t = n.charCodeAt(o),
          c += u.charAt(t >>> 4 & 15) + u.charAt(15 & t)
      return c
    }

    function x (n) {
      return unescape(encodeURIComponent(n))
    }

    function y (n) {
      return C(x(n))
    }

    function _ (n) {
      return b(y(n))
    }

    function j (n, t) {
      return A(x(n), x(t))
    }

    function I (n, t) {
      return b(j(n, t))
    }

    function R (n, t, o) {
      return t ? o ? j(t, n) : I(t, n) : o ? y(n) : _(n)
    }

    'function' == typeof define && define.amd ? define(function () {
      return R
    }) : 'object' == typeof m && m.exports ? m.exports = R : n.md5 = R
  }
)(this);

