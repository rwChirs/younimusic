!(function(e, a) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = a();
  else if ('function' == typeof define && define.amd) define([], a);
  else {
    var t = a();
    for (var n in t) ('object' == typeof exports ? exports : e)[n] = t[n];
  }
})(this, function() {
  return (function(e) {
    var a = {};
    function t(n) {
      if (a[n]) return a[n].exports;
      var i = (a[n] = { i: n, l: !1, exports: {} });
      return e[n].call(i.exports, i, i.exports, t), (i.l = !0), i.exports;
    }
    return (
      (t.m = e),
      (t.c = a),
      (t.d = function(e, a, n) {
        t.o(e, a) || Object.defineProperty(e, a, { enumerable: !0, get: n });
      }),
      (t.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (t.t = function(e, a) {
        if ((1 & a && (e = t(e)), 8 & a)) return e;
        if (4 & a && 'object' == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (
          (t.r(n),
          Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
          2 & a && 'string' != typeof e)
        )
          for (var i in e)
            t.d(
              n,
              i,
              function(a) {
                return e[a];
              }.bind(null, i)
            );
        return n;
      }),
      (t.n = function(e) {
        var a =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return t.d(a, 'a', a), a;
      }),
      (t.o = function(e, a) {
        return Object.prototype.hasOwnProperty.call(e, a);
      }),
      (t.p = ''),
      t((t.s = 1))
    );
  })([
    function(e, a) {
      !(function() {
        var a = {
            1e3: ['direct', 't_1000578828_xcx_1000_wxtd', 'xcx', ''],
            1001: ['direct', 't_1000578828_xcx_1001_fxrk', 'xcx', ''],
            1005: ['weixin', 't_1000578826_xcx_1005_fxss', 'xcx', ''],
            1006: ['weixin', 't_1000578826_xcx_1006_fxss', 'xcx', ''],
            1007: ['weixin', 't_1000578832_xcx_1007_drxxkp', 'xcx', ''],
            1008: ['weixin', 't_1000578832_xcx_1008_qlxxkp', 'xcx', ''],
            1011: ['weixin', 't_1000578833_xcx_1011_smewm', 'xcx', ''],
            1012: ['weixin', 't_1000578833_xcx_1012_tpsm', 'xcx', ''],
            1013: ['weixin', 't_1000578833_xcx_1013_xcsm', 'xcx', ''],
            1014: ['weixin', 't_1000578827_xcx_1014_xcxmbxx', 'xcx', ''],
            1017: ['weixin', 't_1000578829_xcx_1017_tyb', 'xcx', ''],
            1019: ['direct', 't_1000578830_xcx_1019_qb', 'xcx', ''],
            1020: ['weixin', 't_1000072662_xcx_1020_gzhjs', 'xcx', ''],
            1022: ['direct', 't_1000578828_xcx_1022_zdrk', 'xcx', ''],
            1023: ['direct', 't_1000578828_xcx_1023_zmtb', 'xcx', ''],
            1024: ['direct', 't_1000578828_xcx_1024_xcxjs', 'xcx', ''],
            1025: ['weixin', 't_1000578833_xcx_1025_smywm', 'xcx', ''],
            1026: ['weixin', 't_1000578829_xcx_1026_fjxcx', 'xcx', ''],
            1027: ['weixin', 't_1000578826_xcx_1027_dbss', 'xcx', ''],
            1028: ['direct', 't_1000578836_xcx_1028_kqkb', 'xcx', ''],
            1029: ['direct', 't_1000578836_xcx_1029_kqxq', 'xcx', ''],
            1030: ['weixin', 't_1000578829_xcx_1030_zdhcs', 'xcx', ''],
            1031: ['weixin', 't_1000578833_xcx_1031_tpsm', 'xcx', ''],
            1032: ['weixin', 't_1000578833_xcx_1032_xcsm', 'xcx', ''],
            1034: ['weixin', 't_1000578827_xcx_1034_zfwcxx', 'xcx', ''],
            1035: ['weixin', 't_1000072662_xcx_1035_cdl', 'xcx', ''],
            1036: ['weixin', 't_335139774_xcx_1036_appfxxx', 'xcx', ''],
            1037: ['weixin', 't_1000578834_xcx_1037_xcxtz', 'xcx', ''],
            1038: ['weixin', 't_1000578834_xcx_1038_xcxtz', 'xcx', ''],
            1039: ['weixin', 't_1000578829_xcx_1039_yds', 'xcx', ''],
            1042: ['weixin', 't_1000578826_xcx_1042_tjss', 'xcx', ''],
            1043: ['weixin', 't_1000072662_xcx_1043_gzhxx', 'xcx', ''],
            1044: ['weixin', 't_1000578832_xcx_1044_fxxxkp', 'xcx', ''],
            1045: ['weixin', 't_1000578835_xcx_1045_pyq', 'xcx', ''],
            1046: ['weixin', 't_1000578835_xcx_1046_xqy', 'xcx', ''],
            1047: ['weixin', 't_1000578833_xcx_1047_smxcxm', 'xcx', ''],
            1048: ['weixin', 't_1000578833_xcx_1048_tpsm', 'xcx', ''],
            1049: ['weixin', 't_1000578833_xcx_1049_xcsm', 'xcx', ''],
            1052: ['direct', 't_1000578836_xcx_1052_kqmdlb', 'xcx', ''],
            1053: ['weixin', 't_1000578826_xcx_1053_sys', 'xcx', ''],
            1054: ['direct', 't_1000578828_xcx_1054_dbss', 'xcx', ''],
            1055: ['weixin', 't_1000578829_xcx_1055_h5hq', 'xcx', ''],
            1056: ['weixin', 't_1000578829_xcx_1056_ylbf', 'xcx', ''],
            1057: ['direct', 't_1000578830_xcx_1057_yxkxqy', 'xcx', ''],
            1058: ['weixin', 't_1000072663_xcx_1058_gzhwz', 'xcx', ''],
            1059: ['weixin', 't_1000578829_xcx_1059_yqy', 'xcx', ''],
            1064: ['weixin', 't_1000578829_xcx_1064_wifilj', 'xcx', ''],
            1067: ['weixin', 't_1000578835_xcx_1067_gzh', 'xcx', ''],
            1068: ['weixin', 't_1000578835_xcx_1068_fjxcx', 'xcx', ''],
            1069: ['weixin', 't_1000578829_xcx_1069_ydyy', 'xcx', ''],
            1071: ['direct', 't_1000578830_xcx_1071_yxklby', 'xcx', ''],
            1072: ['weixin', 't_1000578833_xcx_1072_ewmsk', 'xcx', ''],
            1073: ['weixin', 't_1000578829_xcx_1073_kfxx', 'xcx', ''],
            1074: ['weixin', 't_1000072663_xcx_1074_gzhxx', 'xcx', ''],
            1077: ['weixin', 't_1000578829_xcx_1077_yzb', 'xcx', ''],
            1078: ['weixin', 't_1000578829_xcx_1078_wifilj', 'xcx', ''],
            1079: ['weixin', 't_1000578829_xcx_1079_yxzx', 'xcx', ''],
            1081: ['weixin', 't_1000578829_xcx_1081_kfwzl', 'xcx', ''],
            1082: ['weixin', 't_1000072663_xcx_1082_hhwzl', 'xcx', ''],
            1084: ['weixin', 't_1000578835_xcx_1084_ysy', 'xcx', ''],
            1089: ['direct', 't_1000578828_xcx_1089_ltkxl', 'xcx', ''],
            1090: ['direct', 't_1000578828_xcx_1090_xcxcd', 'xcx', ''],
            1091: ['weixin', 't_1000072663_xcx_1091_wzspkp', 'xcx', ''],
            1092: ['direct', 't_1000578829_xcx_1092_csfwrk', 'xcx', ''],
            1095: ['weixin', 't_1000578835_xcx_1095_xcxzj', 'xcx', ''],
            1096: ['direct', 't_1000578828_xcx_1096_ltjl', 'xcx', ''],
            1097: ['weixin', 't_1000578829_xcx_1097_zfqy', 'xcx', ''],
            1099: ['direct', 't_1000578829_xcx_1099_cj', 'xcx', ''],
            1102: ['weixin', 't_1000072663_xcx_1102_fwyl', 'xcx', ''],
            1103: ['direct', 't_1000578829_xcx_1103_fxwd', 'xcx', ''],
            1104: ['direct', 't_1000578829_xcx_1104_xlwd', 'xcx', ''],
            1129: ['weixin', 't_1000578829_xcx_11129_pc', 'xcx', ''],
          },
          t = function(e) {
            var a = '';
            try {
              a = wx.getStorageSync(e);
            } catch (e) {}
            return a;
          },
          n = function(e, a) {
            try {
              wx.setStorageSync(e, a);
            } catch (e) {}
          },
          i = wx.request,
          r = wx.getSystemInfo,
          p = wx.getNetworkType,
          o = '__jda',
          c = '__jdd',
          d = '__jdv',
          _ = 'union_customerinfo',
          x = '__refer',
          s = function() {
            var e = 'https://neptune.jd.com/log/m';
            try {
              var a = getApp({ allowDefault: !0 });
              a &&
                a.globalRequestUrl &&
                (e = a.globalRequestUrl.replace(/\/*$/, '/neptune/log/m'));
            } catch (e) {}
            return e;
          },
          g = 0;
        function u(e) {
          (e = e || 'tr-' + g++),
            (this.name = e),
            (this.logCache = []),
            (this.env = []),
            (this.ext = {}),
            (this.isReady = u.isWxDataReady),
            u.loggerList &&
              u.loggerList instanceof Array &&
              u.loggerList.push(this),
            u.isInitJda || (u.initJda(), (u.isInitJda = !0));
        }
        (u.loggerList = []),
          (u.dependList = { sysinfo: 0, netType: 0 }),
          (u.isWxDataReady = !1),
          (u.dataReady = function(e) {
            if (!u.isWxDataReady) {
              for (var a in ((u.dependList[e] = 1), u.dependList))
                if (!u.dependList[a]) return;
              (u.isWxDataReady = !0), (a = 0);
              for (var t = u.loggerList.length; a < t; a++)
                u.loggerList[a].ready();
              delete u.loggerList;
            }
          }),
          (u.pr = u.prototype),
          (u.pr.ready = function() {
            this.isReady = !0;
            for (var e = this.logCache.length, a = 0; a < e; a++)
              this.sendData.apply(this, this.logCache[a]);
          }),
          (u.pr.sendData = function(e, a, t) {
            var n;
            ((n =
              'pv' == a
                ? this.initPvData(t)
                : 'cl' == a
                ? this.initClickData(t)
                : 'cd' == a
                ? this.initShoppingData(t)
                : 'od' == a
                ? this.initOrderData(t)
                : 'sr' == a
                ? this.initPageUnloadData(t)
                : 'ep' == a
                ? this.initExposureData(t)
                : t).tpc = e),
              (n.report_ts = l() / 1e3),
              (n.token = u.md5(n.report_ts + '5YT%aC89$22OI@pQ')),
              (n.data[0].typ = a),
              this.request(n, 'sr' == a || 'cl' == a);
          }),
          (u.pr.send = function(e, a, t) {
            this.isReady
              ? this.sendData.apply(this, arguments)
              : this.logCache.push(arguments);
          }),
          (u.pr.request = function(e, a) {
            if (
              (i({
                url: s() + '?std=' + e.std,
                data: e,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                success: function(a) {
                  if (e && e.data && e.data[0]) {
                    console.info(
                      '===埋点-'
                        .concat(
                          {
                            pv: 'PV',
                            cl: '点击',
                            cd: '加购',
                            od: '订单',
                            sr: '留存',
                            ep: '曝光',
                          }[e.data[0].typ] || e.data[0].typ,
                          '-'
                        )
                        .concat(e.data[0].eid, '==='),
                      {
                        type: e.data[0].typ,
                        eid: e.data[0].eid,
                        ext: e.data[0].ext,
                        eparam: e.data[0].eparam,
                        all: e,
                      }
                    );
                  }
                },
              }),
              a)
            )
              for (var t = l() + 100; l() < t; );
          }),
          (u.pr.exports = function() {
            var e = this;
            return {
              set: function(a) {
                e.setData(a);
              },
              pv: function(a) {
                (e.lastPvTime && l() - e.lastPvTime < 100) ||
                  ((e.lastPvTime = l()),
                  e.env[O] || (e.setupPageview(), (e.env[O] = !0)),
                  e.send('wx_app.000000', 'pv', a),
                  (e.env[O] = !1));
              },
              click: function(a) {
                e.send('wx_app.000001', 'cl', a);
              },
              exposure: function(a) {
                e.send('wx_app.000005', 'ep', a);
              },
              autoClick: function(a) {
                var t,
                  n = a.target.dataset,
                  i = a.currentTarget.dataset;
                if ((n && n.eid ? (t = n) : i && i.eid && (t = i), t)) {
                  var r = {
                    eid: t.eid,
                    elevel: t.elevel,
                    eparam: t.eparam,
                    pname: t.pname,
                    pparam: t.pparam,
                    target: t.target,
                    event: a,
                  };
                  e.send('wx_app.000001', 'cl', r);
                }
              },
              addToCart: function(a) {
                e.send('wx_app.000002', 'cd', a);
              },
              order: function(a) {
                e.send('wx_app.000003', 'od', a);
              },
              pageUnload: function(a) {
                e.send('wx_app.000004', 'sr', a);
              },
              getSeries: function() {
                return (
                  e.env[O] || (e.setupPageview(), (e.env[O] = !0)),
                  JSON.stringify(e.getSeriesData())
                );
              },
              urlAddSeries: function(e) {
                var a = (e || '').indexOf('#'),
                  t = 'wxappSeries=' + encodeURIComponent(this.getSeries());
                return a > -1
                  ? a === e.length - 1
                    ? e + t
                    : e + '&' + t
                  : e + '#' + t;
              },
              setMParam: function(a) {
                return e.setMParam(a);
              },
            };
          }),
          (function(e) {
            var a = 0;
            function t(e, a, t, n, i, r) {
              return o(
                ((p = o(o(a, e), o(n, r))) << (c = i)) | (p >>> (32 - c)),
                t
              );
              var p, c;
            }
            function n(e, a, n, i, r, p, o) {
              return t((a & n) | (~a & i), e, a, r, p, o);
            }
            function i(e, a, n, i, r, p, o) {
              return t((a & i) | (n & ~i), e, a, r, p, o);
            }
            function r(e, a, n, i, r, p, o) {
              return t(a ^ n ^ i, e, a, r, p, o);
            }
            function p(e, a, n, i, r, p, o) {
              return t(n ^ (a | ~i), e, a, r, p, o);
            }
            function o(e, a) {
              var t = (65535 & e) + (65535 & a);
              return (((e >> 16) + (a >> 16) + (t >> 16)) << 16) | (65535 & t);
            }
            u.md5 = function(e) {
              return (function(e) {
                for (
                  var t,
                    n = a ? '0123456789ABCDEF' : '0123456789abcdef',
                    i = '',
                    r = 0;
                  r < e.length;
                  r++
                )
                  (t = e.charCodeAt(r)),
                    (i += n.charAt((t >>> 4) & 15) + n.charAt(15 & t));
                return i;
              })(
                (function(e) {
                  return (function(e) {
                    for (var a = '', t = 0; t < 32 * e.length; t += 8)
                      a += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
                    return a;
                  })(
                    (function(e, a) {
                      (e[a >> 5] |= 128 << a % 32),
                        (e[14 + (((a + 64) >>> 9) << 4)] = a);
                      for (
                        var t = 1732584193,
                          c = -271733879,
                          d = -1732584194,
                          _ = 271733878,
                          x = 0;
                        x < e.length;
                        x += 16
                      ) {
                        var s = t,
                          g = c,
                          u = d,
                          l = _;
                        (c = p(
                          (c = p(
                            (c = p(
                              (c = p(
                                (c = r(
                                  (c = r(
                                    (c = r(
                                      (c = r(
                                        (c = i(
                                          (c = i(
                                            (c = i(
                                              (c = i(
                                                (c = n(
                                                  (c = n(
                                                    (c = n(
                                                      (c = n(
                                                        c,
                                                        (d = n(
                                                          d,
                                                          (_ = n(
                                                            _,
                                                            (t = n(
                                                              t,
                                                              c,
                                                              d,
                                                              _,
                                                              e[x + 0],
                                                              7,
                                                              -680876936
                                                            )),
                                                            c,
                                                            d,
                                                            e[x + 1],
                                                            12,
                                                            -389564586
                                                          )),
                                                          t,
                                                          c,
                                                          e[x + 2],
                                                          17,
                                                          606105819
                                                        )),
                                                        _,
                                                        t,
                                                        e[x + 3],
                                                        22,
                                                        -1044525330
                                                      )),
                                                      (d = n(
                                                        d,
                                                        (_ = n(
                                                          _,
                                                          (t = n(
                                                            t,
                                                            c,
                                                            d,
                                                            _,
                                                            e[x + 4],
                                                            7,
                                                            -176418897
                                                          )),
                                                          c,
                                                          d,
                                                          e[x + 5],
                                                          12,
                                                          1200080426
                                                        )),
                                                        t,
                                                        c,
                                                        e[x + 6],
                                                        17,
                                                        -1473231341
                                                      )),
                                                      _,
                                                      t,
                                                      e[x + 7],
                                                      22,
                                                      -45705983
                                                    )),
                                                    (d = n(
                                                      d,
                                                      (_ = n(
                                                        _,
                                                        (t = n(
                                                          t,
                                                          c,
                                                          d,
                                                          _,
                                                          e[x + 8],
                                                          7,
                                                          1770035416
                                                        )),
                                                        c,
                                                        d,
                                                        e[x + 9],
                                                        12,
                                                        -1958414417
                                                      )),
                                                      t,
                                                      c,
                                                      e[x + 10],
                                                      17,
                                                      -42063
                                                    )),
                                                    _,
                                                    t,
                                                    e[x + 11],
                                                    22,
                                                    -1990404162
                                                  )),
                                                  (d = n(
                                                    d,
                                                    (_ = n(
                                                      _,
                                                      (t = n(
                                                        t,
                                                        c,
                                                        d,
                                                        _,
                                                        e[x + 12],
                                                        7,
                                                        1804603682
                                                      )),
                                                      c,
                                                      d,
                                                      e[x + 13],
                                                      12,
                                                      -40341101
                                                    )),
                                                    t,
                                                    c,
                                                    e[x + 14],
                                                    17,
                                                    -1502002290
                                                  )),
                                                  _,
                                                  t,
                                                  e[x + 15],
                                                  22,
                                                  1236535329
                                                )),
                                                (d = i(
                                                  d,
                                                  (_ = i(
                                                    _,
                                                    (t = i(
                                                      t,
                                                      c,
                                                      d,
                                                      _,
                                                      e[x + 1],
                                                      5,
                                                      -165796510
                                                    )),
                                                    c,
                                                    d,
                                                    e[x + 6],
                                                    9,
                                                    -1069501632
                                                  )),
                                                  t,
                                                  c,
                                                  e[x + 11],
                                                  14,
                                                  643717713
                                                )),
                                                _,
                                                t,
                                                e[x + 0],
                                                20,
                                                -373897302
                                              )),
                                              (d = i(
                                                d,
                                                (_ = i(
                                                  _,
                                                  (t = i(
                                                    t,
                                                    c,
                                                    d,
                                                    _,
                                                    e[x + 5],
                                                    5,
                                                    -701558691
                                                  )),
                                                  c,
                                                  d,
                                                  e[x + 10],
                                                  9,
                                                  38016083
                                                )),
                                                t,
                                                c,
                                                e[x + 15],
                                                14,
                                                -660478335
                                              )),
                                              _,
                                              t,
                                              e[x + 4],
                                              20,
                                              -405537848
                                            )),
                                            (d = i(
                                              d,
                                              (_ = i(
                                                _,
                                                (t = i(
                                                  t,
                                                  c,
                                                  d,
                                                  _,
                                                  e[x + 9],
                                                  5,
                                                  568446438
                                                )),
                                                c,
                                                d,
                                                e[x + 14],
                                                9,
                                                -1019803690
                                              )),
                                              t,
                                              c,
                                              e[x + 3],
                                              14,
                                              -187363961
                                            )),
                                            _,
                                            t,
                                            e[x + 8],
                                            20,
                                            1163531501
                                          )),
                                          (d = i(
                                            d,
                                            (_ = i(
                                              _,
                                              (t = i(
                                                t,
                                                c,
                                                d,
                                                _,
                                                e[x + 13],
                                                5,
                                                -1444681467
                                              )),
                                              c,
                                              d,
                                              e[x + 2],
                                              9,
                                              -51403784
                                            )),
                                            t,
                                            c,
                                            e[x + 7],
                                            14,
                                            1735328473
                                          )),
                                          _,
                                          t,
                                          e[x + 12],
                                          20,
                                          -1926607734
                                        )),
                                        (d = r(
                                          d,
                                          (_ = r(
                                            _,
                                            (t = r(
                                              t,
                                              c,
                                              d,
                                              _,
                                              e[x + 5],
                                              4,
                                              -378558
                                            )),
                                            c,
                                            d,
                                            e[x + 8],
                                            11,
                                            -2022574463
                                          )),
                                          t,
                                          c,
                                          e[x + 11],
                                          16,
                                          1839030562
                                        )),
                                        _,
                                        t,
                                        e[x + 14],
                                        23,
                                        -35309556
                                      )),
                                      (d = r(
                                        d,
                                        (_ = r(
                                          _,
                                          (t = r(
                                            t,
                                            c,
                                            d,
                                            _,
                                            e[x + 1],
                                            4,
                                            -1530992060
                                          )),
                                          c,
                                          d,
                                          e[x + 4],
                                          11,
                                          1272893353
                                        )),
                                        t,
                                        c,
                                        e[x + 7],
                                        16,
                                        -155497632
                                      )),
                                      _,
                                      t,
                                      e[x + 10],
                                      23,
                                      -1094730640
                                    )),
                                    (d = r(
                                      d,
                                      (_ = r(
                                        _,
                                        (t = r(
                                          t,
                                          c,
                                          d,
                                          _,
                                          e[x + 13],
                                          4,
                                          681279174
                                        )),
                                        c,
                                        d,
                                        e[x + 0],
                                        11,
                                        -358537222
                                      )),
                                      t,
                                      c,
                                      e[x + 3],
                                      16,
                                      -722521979
                                    )),
                                    _,
                                    t,
                                    e[x + 6],
                                    23,
                                    76029189
                                  )),
                                  (d = r(
                                    d,
                                    (_ = r(
                                      _,
                                      (t = r(
                                        t,
                                        c,
                                        d,
                                        _,
                                        e[x + 9],
                                        4,
                                        -640364487
                                      )),
                                      c,
                                      d,
                                      e[x + 12],
                                      11,
                                      -421815835
                                    )),
                                    t,
                                    c,
                                    e[x + 15],
                                    16,
                                    530742520
                                  )),
                                  _,
                                  t,
                                  e[x + 2],
                                  23,
                                  -995338651
                                )),
                                (d = p(
                                  d,
                                  (_ = p(
                                    _,
                                    (t = p(
                                      t,
                                      c,
                                      d,
                                      _,
                                      e[x + 0],
                                      6,
                                      -198630844
                                    )),
                                    c,
                                    d,
                                    e[x + 7],
                                    10,
                                    1126891415
                                  )),
                                  t,
                                  c,
                                  e[x + 14],
                                  15,
                                  -1416354905
                                )),
                                _,
                                t,
                                e[x + 5],
                                21,
                                -57434055
                              )),
                              (d = p(
                                d,
                                (_ = p(
                                  _,
                                  (t = p(t, c, d, _, e[x + 12], 6, 1700485571)),
                                  c,
                                  d,
                                  e[x + 3],
                                  10,
                                  -1894986606
                                )),
                                t,
                                c,
                                e[x + 10],
                                15,
                                -1051523
                              )),
                              _,
                              t,
                              e[x + 1],
                              21,
                              -2054922799
                            )),
                            (d = p(
                              d,
                              (_ = p(
                                _,
                                (t = p(t, c, d, _, e[x + 8], 6, 1873313359)),
                                c,
                                d,
                                e[x + 15],
                                10,
                                -30611744
                              )),
                              t,
                              c,
                              e[x + 6],
                              15,
                              -1560198380
                            )),
                            _,
                            t,
                            e[x + 13],
                            21,
                            1309151649
                          )),
                          (d = p(
                            d,
                            (_ = p(
                              _,
                              (t = p(t, c, d, _, e[x + 4], 6, -145523070)),
                              c,
                              d,
                              e[x + 11],
                              10,
                              -1120210379
                            )),
                            t,
                            c,
                            e[x + 2],
                            15,
                            718787259
                          )),
                          _,
                          t,
                          e[x + 9],
                          21,
                          -343485551
                        )),
                          (t = o(t, s)),
                          (c = o(c, g)),
                          (d = o(d, u)),
                          (_ = o(_, l));
                      }
                      return Array(t, c, d, _);
                    })(
                      (function(e) {
                        var a,
                          t = Array(e.length >> 2);
                        for (a = 0; a < t.length; a++) t[a] = 0;
                        for (a = 0; a < 8 * e.length; a += 8)
                          t[a >> 5] |= (255 & e.charCodeAt(a / 8)) << a % 32;
                        return t;
                      })(e),
                      8 * e.length
                    )
                  );
                })(
                  (function(e) {
                    for (var a, t, n = '', i = -1; ++i < e.length; )
                      (a = e.charCodeAt(i)),
                        (t = i + 1 < e.length ? e.charCodeAt(i + 1) : 0),
                        55296 <= a &&
                          a <= 56319 &&
                          56320 <= t &&
                          t <= 57343 &&
                          ((a = 65536 + ((1023 & a) << 10) + (1023 & t)), i++),
                        a <= 127
                          ? (n += String.fromCharCode(a))
                          : a <= 2047
                          ? (n += String.fromCharCode(
                              192 | ((a >>> 6) & 31),
                              128 | (63 & a)
                            ))
                          : a <= 65535
                          ? (n += String.fromCharCode(
                              224 | ((a >>> 12) & 15),
                              128 | ((a >>> 6) & 63),
                              128 | (63 & a)
                            ))
                          : a <= 2097151 &&
                            (n += String.fromCharCode(
                              240 | ((a >>> 18) & 7),
                              128 | ((a >>> 12) & 63),
                              128 | ((a >>> 6) & 63),
                              128 | (63 & a)
                            ));
                    return n;
                  })(e)
                )
              );
            };
          })();
        var l = function() {
            return new Date().getTime();
          },
          m = function() {
            return l() + '' + parseInt(2147483647 * Math.random());
          },
          f = function(e) {
            return '[object Object]' == {}.toString.call(e);
          },
          v = function(e, a) {
            if (f(e) && f(a)) for (var t in a) e[t] = a[t];
          },
          h = function(e) {
            if (f(e)) {
              var a = [];
              for (var t in e) 'm_param' !== t && a.push(t + '=' + e[t]);
              return a.join('&');
            }
          },
          y = 0,
          w = y++,
          b = y++,
          P = y++,
          I = y++,
          S = y++,
          k = y++,
          C = y++,
          j = y++,
          D = y++,
          O = y++,
          N = y++,
          R = y++,
          A = y++,
          E = y++,
          M = y++,
          T = y++,
          U = y++,
          q = y++,
          z = y++,
          J = y++,
          L = y++,
          H = y++,
          F = y++,
          V = y++,
          W = y++,
          X = y++,
          Y = y++,
          $ = y++,
          B = y++,
          G = y++;
        u.pr.getData = function(e) {
          for (var a = {}, t = 0, n = e.length; t < n; t++) {
            var i = e[t];
            a[i[0]] = this.env[i[1]] || '';
          }
          return a;
        };
        var K = null;
        (u.pr.setupPageview = function() {
          var e,
            i,
            r,
            p = this.env,
            s = l(),
            g = parseInt(s / 1e3),
            u = t(o),
            f = t(c),
            v = t(d);
          (p[D] = !1),
            (e = g),
            (i = p),
            (r = (f || '').split('.')).length > 1
              ? (i[D] = i[D] || 1 * r[1] + 1800 < e)
              : (i[D] = !0);
          var h,
            y,
            w,
            O,
            N,
            M,
            T,
            U,
            J,
            L,
            H,
            X,
            Y,
            $ = (function(e, t, n) {
              var i = (e || '').split('|'),
                r = '',
                p = '',
                o = '',
                c = '',
                d = !1;
              i.length >= 6 &&
                (t - i[5] <= 864e5
                  ? ((r = i[1]), (p = i[2]), (o = i[3]), (c = i[4]))
                  : (d = !0));
              var _ = n[E],
                x = [];
              if (K && a[K]) {
                var s = a[K];
                (x[0] = s[0]),
                  (x[1] = encodeURIComponent(s[1])),
                  (x[2] = encodeURIComponent(s[2]) || 'none'),
                  (x[3] = encodeURIComponent(s[3]) || '-'),
                  (K = null);
              }
              _ &&
                _.utm_source &&
                ((x[0] = encodeURIComponent(_.utm_source)),
                (x[1] = encodeURIComponent(_.utm_campaign || '') || p),
                (x[2] = encodeURIComponent(_.utm_medium || '') || o),
                (x[3] = encodeURIComponent(_.utm_term || '') || c),
                (d = !0));
              var g = !1;
              x.length > 0 && 'direct' != x[0]
                ? (g =
                    (x[0] !== r || x[1] !== p || x[2] !== o) &&
                    'referral' !== x[2])
                : x.length > 0 &&
                  'direct' == x[0] &&
                  ('direct' === r || !r) &&
                  (g = x[1] !== p || x[2] !== o || x[3] !== c);
              var u = '';
              return (
                (n[D] || g) &&
                  ((r = x[0] || r),
                  (p = x[1] || p),
                  (o = x[2] || o),
                  (c = x[3] || c)),
                (d || g || i.length < 5) &&
                  (u = [
                    1,
                    r || 'direct',
                    p || '-',
                    o || 'none',
                    c || '-',
                    t,
                  ].join('|')),
                (n[D] = n[D] || g),
                u
              );
            })(v, s, p),
            Q =
              ((L = g),
              (H = p),
              (Y = 1),
              (X = (f || '').split('.')).length > 1
                ? ((H[D] = H[D] || 1 * X[1] + 1800 < L),
                  (Y = (H[D] ? 1 : 1 * X[0] + 1) || 1))
                : (H[D] = !0),
              (H[k] = Y)),
            Z =
              ((h = g),
              (y = p),
              (U = 1),
              (J = 1),
              (T = (u || '').split('.')).length > 5
                ? ((U = T[0] || U),
                  (w = T[1] || m()),
                  (O = T[2] || h),
                  y[D]
                    ? ((N = T[4] || h), (M = h), (J = 1 * T[5] + 1 || 1))
                    : ((N = T[3] || h), (M = T[4] || h), (J = 1 * T[5] || 1)))
                : ((w = m()), (O = N = M = h), (J = 1)),
              (y[B] = U),
              (y[b] = w),
              (y[P] = O),
              (y[I] = N),
              (y[S] = M),
              (y[C] = J),
              [U, w, O, N, M, J].join('.'));
          !(function(e) {
            if (e[G] && e[G].pv_sid && e[G].pv_seq) {
              var a = 1 * e[G].pv_sid,
                t = 1 * e[G].pv_seq;
              a > 99999999 ||
                ((a > e[C] || (a == e[C] && t >= e[k])) &&
                  ((e[C] = a), (e[k] = t + 1)));
            }
          })(p),
            $ && n(d, $),
            (Q = [p[k], g].join('.')),
            (Z = [p[B], p[b], p[P], p[I], p[S], p[C]].join('.')),
            n(c, Q),
            n(o, Z);
          var ee,
            ae,
            te = (function(e, a, t) {
              var n = t[E],
                i = '',
                r = '';
              if (n && n.customerinfo) (i = n.customerinfo), (r = a);
              else {
                var p = e instanceof Array ? e : [];
                2 == p.length && a - p[1] < 86400 && ((i = p[0]), (r = p[1]));
              }
              return (t[W] = i), i ? [i, r] : [];
            })(t(_), g, p);
          if (
            (n(_, te),
            (p[j] = $ || v),
            (ee = this.env),
            (ae = t('jdwcx') || t('jdzdm')) &&
              (ae.unionid && (ee[F] = ae.unionid),
              ae.wxversion && (ee[V] = ae.wxversion)),
            !p[R])
          )
            try {
              var ne = getCurrentPages(),
                ie = ne[ne.length - 1];
              ie.__route__
                ? (p[R] = ie.__route__)
                : ie.route && (p[R] = ie.route);
            } catch (e) {}
          if (p[D]) (p[q] = ''), (p[z] = '');
          else {
            var re = t(x);
            (p[q] = re[0]), (p[z] = re[1]);
          }
          n(x, [p[R], p[A]]);
        }),
          (u.pr.initPvData = function(e) {
            (this.pageLoadTime = l()), (this.maxClickDeep = 0), (e = e || {});
            var a = this.baseEnv(),
              t = [
                ['sku', X],
                ['shp', Y],
                ['shopid', Y],
                ['tit', N],
                ['ldt', $],
              ],
              n = this.getData(t);
            return (
              (n.page_id = e.pageId || this.env[M] || ''),
              (n.pname = e.pname || this.env[T] || this.env[R] || ''),
              (n.pparam = e.pparam || this.env[U] || this.env[A] || ''),
              (n.par = e.par || ''),
              (n.lat = e.lat || ''),
              (n.lon = e.lon || ''),
              v(a.data[0], n),
              v(a.data[0].ext, e.ext),
              a
            );
          }),
          (u.pr.initClickData = function(e) {
            var a,
              t = this.baseEnv(),
              n = t.data[0];
            if (
              ((n.eid = e.eid || ''),
              (n.eparam = e.eparam || ''),
              (n.elevel = e.elevel || ''),
              (n.page_id = e.pageId || this.env[M] || ''),
              (n.pname = e.pname || this.env[T] || this.env[R] || ''),
              (n.pparam = e.pparam || this.env[U] || this.env[A] || ''),
              (n.par = e.par || ''),
              (n.lat = e.lat || ''),
              (n.lon = e.lon || ''),
              (n.tar = e.target || ''),
              (n.x = 0),
              (n.y = 0),
              (a = e.event),
              f(a) && a.type && a.target)
            ) {
              var i = e.event,
                r = i.touches;
              if (
                ((!r || r.length < 1) && (r = i.changedTouches),
                r && r.length > 0)
              ) {
                n.x = parseInt(r[0].pageX);
                var p = parseInt(r[0].pageY);
                (n.y = p), p > this.maxClickDeep && (this.maxClickDeep = p);
              }
            }
            return v(n.ext, e.ext), t;
          }),
          (u.pr.initExposureData = u.pr.initClickData),
          (u.pr.initShoppingData = function(e) {
            var a = this.baseEnv(),
              t = a.data[0];
            return (
              (t.eid = e.eid || ''),
              (t.eparam = e.eparam || ''),
              (t.elevel = e.elevel || ''),
              (t.page_id = e.pageId || this.env[M] || ''),
              (t.pname = e.pname || this.env[T] || this.env[R] || ''),
              (t.pparam = e.pparam || this.env[U] || this.env[A] || ''),
              (t.sku_list = e.shoppingList
                ? JSON.stringify(e.shoppingList)
                : ''),
              v(t.ext, e.ext),
              a
            );
          }),
          (u.pr.initOrderData = function(e) {
            var a = this.baseEnv(),
              t = a.data[0];
            return (
              (t.eid = e.eid || ''),
              (t.eparam = e.eparam || ''),
              (t.elevel = e.elevel || ''),
              (t.page_id = e.pageId || this.env[M] || ''),
              (t.pname = e.pname || this.env[T] || this.env[R] || ''),
              (t.pparam = e.pparam || this.env[U] || this.env[A] || ''),
              (t.sku_list = e.orderList ? JSON.stringify(e.orderList) : ''),
              (t.order_total_fee = e.total || 0),
              (t.sale_ord_id = e.orderid || ''),
              v(t.ext, e.ext),
              a
            );
          }),
          (u.pr.initPageUnloadData = function(e) {
            var a = ((l() - this.pageLoadTime) / 1e3).toFixed(3),
              t = this.baseEnv(),
              n = t.data[0];
            return (
              (e = e || {}),
              (n.page_id = e.pageId || this.env[M] || ''),
              (n.pname = e.pname || this.env[T] || this.env[R] || ''),
              (n.pparam = e.pparam || this.env[U] || this.env[A] || ''),
              (n.alive_seconds = a),
              (n.click_deep = this.maxClickDeep),
              v(n.ext, e.ext),
              t
            );
          }),
          (function() {
            u.wxDat = {};
            var e = u.wxDat;
            r({
              success: function(a) {
                a &&
                  ((e.dvc = a.model),
                  (e.pixelRatio = (a.pixelRatio || '') + ''),
                  (e.scr =
                    parseInt(a.windowWidth) + 'x' + parseInt(a.windowHeight)),
                  (e.lang = a.language),
                  (e.wxver = a.version),
                  (e.sdkver = a.SDKVersion || ''));
              },
              complete: function() {
                u.dataReady('sysinfo');
              },
            }),
              p({
                success: function(a) {
                  a && (e.net = a.networkType);
                },
                complete: function() {
                  u.dataReady('netType');
                },
              });
          })(),
          (u.pr.setData = function(e) {
            if (f(e)) {
              var a = {
                account: [J],
                siteId: [w],
                skuid: [X],
                shopid: [Y],
                title: [N],
                loadtime: [$],
                url: [R],
                urlParam: [A, h],
                pageId: [M],
                pname: [T],
                pparam: [U],
                appid: [L],
                openid: [H],
                unionid: [F],
              };
              for (var n in e) {
                var i = a[n];
                i
                  ? (this.env[i[0]] = i[1] ? i[1](e[n]) : e[n])
                  : (this.ext[n] = e[n]);
              }
              (this.env[E] = e.urlParam || {}),
                e &&
                  f(e.urlParam) &&
                  e.urlParam.m_param &&
                  this.setMParam(e.urlParam.m_param),
                this.env[L] || (this.env[L] = t('appid'));
            }
          }),
          (u.appDat = {}),
          (u.setAppData = function(e) {
            for (var a in e) u.appDat[a] = e[a];
          }),
          (u.scene = null),
          (u.setScene = function(e) {
            (u.scene = e), (K = e);
          }),
          (u.pr.setMParam = function(e) {
            try {
              this.env[G] = JSON.parse(e) || {};
            } catch (e) {}
          }),
          (u.pr.baseEnv = function() {
            var e = this.env,
              a = u.wxDat,
              n = {
                cli: 'wx-app',
                std: e[w] || 'JA2018_5131196',
                uuid: e[b] || '',
                scr: a.scr || '',
                dvc: a.dvc || '',
                lang: a.lang || '',
                appkey: e[V] || '',
                appid: e[L] || '',
                openid: e[H] || '',
                unionid: e[F] || '',
                gender: a.gender || '',
                city: a.city || '',
                province: a.province || '',
                country: a.country || '',
                wxver: a.wxver || '',
                data: [],
              },
              i = [
                ['ctp', R],
                ['par', A],
                ['ref', q],
                ['rpr', z],
                ['seq', k],
                ['vts', C],
                ['pin', J],
                ['fst', P],
                ['pst', I],
                ['vct', S],
              ],
              r = this.getData(i);
            return (
              (r.jsver = 'WX1.0.0'),
              (r.net = a.net || ''),
              (r.lat = a.lat || ''),
              (r.lon = a.lon || ''),
              (r.speed = a.speed || ''),
              (r.accuracy = a.accuracy || ''),
              (r.pixelRatio = a.pixelRatio || ''),
              (r.jdv = e[j] || ''),
              (r.customerInfo = e[W] || ''),
              (r.unpl = t('unpl') || ''),
              (r.scene = u.scene || ''),
              (r.sdkver = a.sdkver || ''),
              (r.ext = {}),
              v(r.ext, this.ext),
              v(r.ext, u.appDat),
              n.data.push(r),
              n
            );
          }),
          (u.pr.getSeriesData = function() {
            var e = this.env,
              a = {
                uuid: e[b] || '',
                std: e[w] || 'JA2018_5131196',
                seq: e[k],
                vts: e[C],
              };
            return e[V] && (a.appkey = e[V]), e[L] && (a.appid = e[L]), a;
          }),
          (u.initJda = function() {
            var e = t(o);
            if (!e) {
              var a = new Date().getTime();
              (e = [
                1,
                a + '' + parseInt(2147483647 * Math.random()),
                a,
                a,
                a,
                0,
              ].join('.')),
                n(o, e);
            }
            return e;
          }),
          (e.exports = {
            init: function(e) {
              return new u(e).exports();
            },
            setAppData: function(e) {
              u.setAppData(e);
            },
            setScene: function(e) {
              u.setScene(e);
            },
          });
      })();
    },
    function(e, a, t) {
      'use strict';
      t.r(a);
      var n = {
        'pages/index/index': { page_id: '0001', page_name: '首页' },
        'pages/login/index': { page_id: '0003', page_name: '登录页' },
        'pages/payCode/payCode': { page_id: '0011', page_name: '付款码页' },
        'pages/category/index': { page_id: '0012', page_name: '分类页' },
        'pages/category/sub/index': {
          page_id: '0013',
          page_name: '分类列表页',
        },
        'pages/detail/index': { page_id: '0014', page_name: '商品详情页' },
        'pages/activity/index': { page_id: '0015', page_name: '活动页' },
        'pages/address/list/index': {
          page_id: '0018',
          page_name: '选择收货地址页',
        },
        'pages/address/new/index': {
          page_id: '0019',
          page_name: '新增/编辑收货地址页',
        },
        'pages/wxpay/wxpay': { page_id: '0021', page_name: '收银台' },
        'pages/my/index': { page_id: '0022', page_name: '个人中心' },
        'pages-a/order-list/index': {
          page_id: '0023',
          page_name: '我的订单页',
        },
        'pages-a/order-detail/index': {
          page_id: '0024',
          page_name: '订单详情页',
        },
        'pages-a/invitation/index': { page_id: '0031', page_name: '邀请有礼' },
        'pages-pay/openPayCode/openPayCode': {
          page_id: '0043',
          page_name: '支付方式设置',
        },
        'pages-a/invoice/index': { page_id: '0045', page_name: '发票页面' },
        'pages/paySuccess/paySuccess': {
          page_id: '0046',
          page_name: '支付成功',
        },
        'pages/payResult/index': { page_id: '0046', page_name: '支付结果页' },
        'pages/secondaryActivity/seckill/index': {
          page_id: '0051',
          page_name: '秒杀',
        },
        'pages/solitaire/pay/index': {
          page_id: '0069',
          page_name: '接龙支付成功页面',
        },
        'pages/bill/bill-index/index': {
          page_id: '0073',
          page_name: '菜谱列表页',
        },
        'pages/bill/bill-detail/index': {
          page_id: '0074',
          page_name: '菜谱详情页',
        },
        'pages-b/my-collection/index': {
          page_id: '0075',
          page_name: '菜谱我的收藏页',
        },
        'pages/arrivedStore/arrivedStore': {
          page_id: '0079',
          page_name: '到店',
        },
        'pages-pay/payTip/payTip': { page_id: '0080', page_name: '付款码说明' },
        'pages-a/orderTrack/orderTrack': {
          page_id: '0081',
          page_name: '订单状态追踪',
        },
        'pages/price-desc/index': { page_id: '0082', page_name: '价格说明' },
        'pages/solitaire/list/index': {
          page_id: '0083',
          page_name: '接龙列表',
        },
        'pages/solitaire/future/index': {
          page_id: '0084',
          page_name: '接龙下期预告页',
        },
        'pages/solitaire/detail/index': {
          page_id: '0085',
          page_name: '接龙详情',
        },
        'pages-a/solitaire/detail/index': {
          page_id: '0085',
          page_name: '接龙详情',
        },
        'pages-a/solitaire/my-rebate/index': {
          page_id: '0086',
          page_name: '团长返佣',
        },
        'pages/luck-red-envelopes/index': {
          page_id: '0087',
          page_name: '拼手气红包',
        },
        'pages/luck-red-envelopes/luck-hand-rule/index': {
          page_id: '0088',
          page_name: '拼手气红包规则',
        },
        'pages/secondaryActivity/top100/index': {
          page_id: '0089',
          page_name: 'Top100',
        },
        'pages/secondaryActivity/newcustomer/index': {
          page_id: '0090',
          page_name: '新人好礼',
        },
        'pages/secondaryActivity/nm/index': {
          page_id: '0091',
          page_name: 'N件M元',
        },
        'pages/secondaryActivity/multiple-orders-gift/index': {
          page_id: '0092',
          page_name: '多单有礼',
        },
        'pages-a/customer-service/index': {
          page_id: '0093',
          page_name: '客服助手',
        },
        'pages-a/fight-group/list/index': {
          page_id: '0094',
          page_name: '拼团列表',
        },
        'pages-a/fight-group/detail/index': {
          page_id: '0095',
          page_name: '拼团商品详情',
        },
        'pages-a/fight-group/team-detail/index': {
          page_id: '0096',
          page_name: '拼团详情页',
        },
        'pages-a/fight-group/my-order/index': {
          page_id: '0097',
          page_name: '我的拼团',
        },
        'pages-a/fight-group/three-group/index': {
          page_id: '0098',
          page_name: '三人团',
        },
        'pages-a/draw/index': { page_id: '0099', page_name: '下单抽大奖' },
        'pages-a/red-envelope-rain/index': {
          page_id: '0101',
          page_name: '红包雨',
        },
        'pages-a/red-envelope-rain/winning/index': {
          page_id: '0102',
          page_name: '红包雨中奖页',
        },
        'pages/cabinet/index/index': { page_id: '0103', page_name: '无人货柜' },
        'pages-activity/7club/home/index': { page_id: '0121', page_name: '7club首页' },
        'pages/center-tab-page/index': {
          page_id: '0121',
          page_name: '7club首页',
        },
        'pages-activity/7club/video-detail/index': {
          page_id: '0122',
          page_name: '7club视频',
        },
        'pages-activity/7club/club-detail/index': {
          page_id: '0123',
          page_name: '7club详情页',
        },
        'pages-activity/7club/master/index': {
          page_id: '0124',
          page_name: '7Club大咖亲临',
        },
        'pages-a/sales/index/index': { page_id: '0134', page_name: '大客户甄选' },
        'pages-a/sales/form/index': { page_id: '0134', page_name: '大客户甄选' },
        'pages/orderDetailMap/index': {
          page_id: '0136',
          page_name: '订单轨迹页',
        },
        'pages/coupons/index': { page_id: '0139', page_name: '今日福利' },
        'pages/login/index/index': { page_id: '0140', page_name: '登录过渡页' },
        'pages/login/web-view/web-view': {
          page_id: '0141',
          page_name: '登录过渡页2',
        },
        'pages/login/wv-common/wv-common': {
          page_id: '0142',
          page_name: '小程序包裹h5页',
        },
        'pages/select-store/index': { page_id: '0143', page_name: '选择门店' },
        'pages/groupon/group-home/index': {
          page_id: '0144',
          page_name: '小程序7fresh拼团-旧首页',
        },
        'pages/groupon/group-detail/index': {
          page_id: '0145',
          page_name: '小程序7fresh拼团-旧拼团详情',
        },
        'pages-a/comment/index': { page_id: '0146', page_name: '全部评价' },
        'pages-a/storeIntroduction/storeIntroduction': {
          page_id: '0147',
          page_name: '门店展示',
        },
        'pages-b/offline/index': {
          page_id: '0148',
          page_name: '小程序好物社区前面的跳转页',
        },
        'pages-a/invoice-download/index': {
          page_id: '0149',
          page_name: '查看发票',
        },
        'pages-c/discovery/index': { page_id: '0150', page_name: '发现' },
        'pages-c/new-gift/index': { page_id: '0151', page_name: '新人礼包' },
        'pages-a/invitation/gift/index': {
          page_id: '0164',
          page_name: '邀请有礼-被邀者',
        },
        'pages-a/solitaire/cart/index': {
          page_id: '0176',
          page_name: '接龙独立购物车',
        },
        'pages-activity/7club/notes-detail/index': {
          page_name: '7Club笔记详情',
          page_id: '0191',
        },
        'pages-activity/7club/topic-detail/index': {
          page_name: '7Club话题详情',
          page_id: '0193',
        },
        'pages/secondaryActivity/business-status-bag-buy/index': {
          page_id: '0195',
          page_name: '小程序异业购券拉新-购买页',
          buyCpsNow: { event_id: '7FRESH_miniapp_2_1578553760939|56' },
        },
        'pages/secondaryActivity/business-status-bag-use/index': {
          page_id: '0196',
          page_name: '小程序异业购券拉新-结果页',
          buyCpsAll7: { event_id: '7FRESH_miniapp_2_1578553760939|57' },
          buyCpsAllJd: { event_id: '7FRESH_miniapp_2_1578553760939|58' },
          buyCps7toUse: { event_id: '7FRESH_miniapp_2_1578553760939|59' },
          buyCpsJdtoUse: { event_id: '7FRESH_miniapp_2_1578553760939|60' },
          buyCpsGoHome: { event_id: '7FRESH_miniapp_2_1578553760939|61' },
          buyCpsReset: { event_id: '7FRESH_miniapp_2_1578553760939|62' },
          buyCpsToHome: { event_id: '7FRESH_miniapp_2_1578553760939|63' },
        },
        'pages/scan-result/index': {
          page_id: '0233',
          page_name: '微信扫POS支付领新人礼包',
        },
      };
      function i(e, a) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          a &&
            (n = n.filter(function(a) {
              return Object.getOwnPropertyDescriptor(e, a).enumerable;
            })),
            t.push.apply(t, n);
        }
        return t;
      }
      function r(e) {
        for (var a = 1; a < arguments.length; a++) {
          var t = null != arguments[a] ? arguments[a] : {};
          a % 2
            ? i(Object(t), !0).forEach(function(a) {
                p(e, a, t[a]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : i(Object(t)).forEach(function(a) {
                Object.defineProperty(
                  e,
                  a,
                  Object.getOwnPropertyDescriptor(t, a)
                );
              });
        }
        return e;
      }
      function p(e, a, t) {
        return (
          a in e
            ? Object.defineProperty(e, a, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[a] = t),
          e
        );
      }
      var o = t(0).init(),
        c = function(e) {
          var a = {};
          try {
            var t = e;
            if (!e) {
              var i = getCurrentPages();
              if (!i) return a;
              var r = i[i.length - 1];
              t = (r && r.route) || '';
            }
            return (
              t && n[t]
                ? ((a.pageId = n[t].page_id), (a.pageName = n[t].page_name))
                : ((a.pageId = t), (a.pageName = '')),
              a
            );
          } catch (e) {
            return a;
          }
        },
        d = function() {
          var e = {};
          if (!wx) return {};
          var a = c(),
            t = (function() {
              var e = {};
              try {
                var a = getCurrentPages();
                if (!a) return e;
                var t = a[a.length - 1],
                  n = (t && t.options) || {};
                return n.lastPageID || n.lastPageName
                  ? ((e.pageId = n.lastPageID),
                    (e.pageName = n.lastPageName),
                    e)
                  : (a.length > 1 && c(a[a.length - 2].route)) || e;
              } catch (a) {
                return e;
              }
            })(),
            n = wx.getStorageSync('addressInfo');
          return (
            'string' == typeof n && n && (n = JSON.parse(n)),
            (e.storeId = (n && n.storeId) || ''),
            (e.lat = (n && n.lat) || ''),
            (e.lon = (n && n.lon) || ''),
            (e.tenantId = (n && n.tenantId) || 1),
            (e.platformId = (n && n.platformId) || 1),
            (e.timestamp = new Date().getTime()),
            (a.pageId || a.pageName) &&
              ((e.pageId = a.pageId), (e.pageName = a.pageName)),
            (t.pageId || t.pageName) &&
              ((e.lastPageID = t.pageId), (e.lastPageName = t.pageName)),
            e
          );
        },
        _ = function(e) {
          console.log('埋点【logSet】： ', e);
          var a = d();
          o.set(
            r({}, a, {
              url: e.path,
              urlParam: e.urlParam,
              skuid: e.skuId,
              shopid: e.storeId || a.storeId,
              openid: e.openid,
              unionid: e.unionid,
              page_id: e.page_id || a.pageId,
              page_name: e.page_name || a.pageName,
              title: e.page_name || a.pageName,
              siteId: 'JA2018_5131196',
              account: e.account,
              appid: 'wxb8c24a764d1e1e6d',
              lat: e.lat || a.lat,
              lon: e.lon || a.lon,
              par: e.urlParam,
              tenantId: e.tenantId || a.tenantId || 1,
              platformId: e.platformId || a.platformId || 1,
              status: e.status,
            })
          );
        },
        x = function(e) {
          console.info('埋点【logPv】：params='.concat(JSON.stringify(e)));
          var a = d();
          o.pv(
            p(
              {
                pname: e.path,
                pparam: '{}' === e.urlParam ? '' : e.urlParam,
                ext: e.ext,
                openid: e.openid,
                unionid: e.unionid,
                lat: e.lat,
                lon: e.lon,
                par: '{}' === e.urlParam ? '' : e.urlParam,
                tit: e.page_name,
              },
              'ext',
              r({}, a, {}, e.ext)
            )
          );
        },
        s = function(e) {
          var a = d();
          o.click(
            r({}, e, {
              event: e.e || e.event,
              eid: e.eid,
              elevel: e.elevel,
              eparam: e.eparam,
              pname: e.pname || a.pageName,
              pparam: e.pparam || e.eparam,
              target: e.target,
              ext: r({}, a, {}, e.ext),
            })
          );
        },
        g = function(e) {
          var a = e.action,
            t = e.buriedPointVo;
          if (a && t) {
            var n = d(),
              i = r({}, n, {}, a, {}, t);
            if (a.imageUrl && t.imageMap) {
              var p = t.imageMap[a.imageUrl] || {};
              i.imageName = p.imageName;
            }
            delete i.imageMap,
              o.click({
                eid: '7FERSH_APP_8_1590127250769|10',
                eparam: JSON.stringify(i),
                ext: r({}, n),
              });
          }
        },
        u = function(e) {
          var a = e.action,
            t = e.storeId,
            n = e.eventId,
            i = e.jsonParam,
            p = void 0 === i ? {} : i,
            c = e.developMode,
            _ = e.extColumns,
            x = e.pageParam,
            s = e.eparam,
            g = d(),
            u = r({}, x),
            l = r({}, g, { MaVersion: 2, storeId: t || g.storeId }, _),
            m = r({}, g, { clickType: -1, clickId: n }, a, {}, p);
          if (a && a.imageUrl && p.imageMap) {
            var f = p.imageMap[a.imageUrl] || {};
            m.imageName = f.imageName;
          }
          delete m.imageMap,
            (l.json_param = JSON.stringify(m)),
            1 === c && (l.developMode = 1),
            o.click({
              ext: l,
              eid: n,
              eparam: (s && JSON.stringify(s)) || '',
              pparam: JSON.stringify(u),
            });
        },
        l = function(e) {
          var a = e.action,
            t = e.buriedPointVo,
            n = e.ext;
          if (a && t) {
            var i = d(),
              p = r({}, a, {}, t);
            if (a.imageUrl && t.imageMap) {
              var c = t.imageMap[a.imageUrl] || {};
              p.imageName = c.imageName;
            }
            delete p.imageMap,
              o.exposure({
                eid: '7FERSH_APP_8_1590127250769|11',
                eparam: JSON.stringify(p),
                ext: r({}, i, {}, n),
              });
          }
        },
        m = function(e) {
          var a = d();
          o.order(r({}, e, { pname: a.pageName, ext: r({}, a, {}, e.ext) }));
        },
        f = function(e) {
          return o.urlAddSeries(e);
        },
        v = function() {
          return o.pageUnload();
        },
        h = function(e) {
          Object.keys(n).forEach(function(a) {
            e.path === a &&
              ((e.page_id = n[a].page_id),
              (e.page_name = n[a].page_name),
              _(e));
          });
        },
        y = function(e) {
          Object.keys(n).forEach(function(a) {
            e.path === a &&
              ((e.page_id = n[a].page_id),
              (e.page_name = n[a].page_name),
              (function(e) {
                _(e);
                var a = d(),
                  t = r({}, a, {
                    page_id: e.page_id || a.pageId,
                    page_name: e.page_name || a.pageName,
                    title: e.page_name || a.pageName,
                    shopid: e.storeId || a.storeId,
                    account: e.account,
                    version: e.version,
                    status: e.status,
                    par: '{}' === e.urlParam ? '' : e.urlParam,
                  });
                e.developMode && (t.developMode = e.developMode),
                  (e.ext = t),
                  x(e);
              })(e));
          });
        },
        w = function(e) {
          Object.keys(n).forEach(function(a) {
            (e.page_id = n[a].page_id),
              (e.page_name = n[a].page_name),
              e.path === a && x(e);
          });
        },
        b = function(e) {
          var a = '/' + getCurrentPages()[getCurrentPages().length - 1].route;
          Object.keys(n).forEach(function(t) {
            var i = n[t].page_id;
            n[t].page_name;
            a === t &&
              s(
                i,
                e.event,
                n[t][e.clickName].event_id,
                e.elevel,
                e.eparam,
                e.pparam,
                e.target
              );
          });
        },
        P = function(e) {
          Object.keys(n).forEach(function(a) {
            var t = n[a].page_id,
              i = n[a].page_name;
            e.path === a &&
              (function() {
                var e =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : '',
                  a =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : '',
                  t =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : '',
                  n =
                    arguments.length > 3 && void 0 !== arguments[3]
                      ? arguments[3]
                      : '',
                  i =
                    arguments.length > 4 && void 0 !== arguments[4]
                      ? arguments[4]
                      : '',
                  p =
                    arguments.length > 5 && void 0 !== arguments[5]
                      ? arguments[5]
                      : '',
                  c = arguments.length > 6 ? arguments[6] : void 0,
                  _ = d();
                o.exposure({
                  eid: e || '',
                  elevel: a || '',
                  eparam: t || '',
                  pname: n || '',
                  pageId: i || '',
                  pparam: p || '',
                  ext: r({}, _, {}, c),
                });
              })(e.eid, e.elevel, e.eparam, i, t, e.pparam);
          });
        };
      t.d(a, 'onPageSetPV', function() {
        return y;
      }),
        t.d(a, 'onPageSet', function() {
          return h;
        }),
        t.d(a, 'onPagePv', function() {
          return w;
        }),
        t.d(a, 'onPageClick', function() {
          return b;
        }),
        t.d(a, 'onPageExposure', function() {
          return P;
        }),
        t.d(a, 'logPageUnload', function() {
          return v;
        }),
        t.d(a, 'logUrlAddSeries', function() {
          return f;
        }),
        t.d(a, 'logPointsClick', function() {
          return s;
        }),
        t.d(a, 'commonLogClick', function() {
          return g;
        }),
        t.d(a, 'commonLogExposure', function() {
          return l;
        }),
        t.d(a, 'wxStructureLogClick', function() {
          return u;
        }),
        t.d(a, 'logSet', function() {
          return _;
        }),
        t.d(a, 'logOrder', function() {
          return m;
        }),
        t.d(a, 'getPageInfo', function() {
          return c;
        });
    },
  ]);
});
