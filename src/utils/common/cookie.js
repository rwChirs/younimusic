module.exports = {
  /**
   * [setCookie 设置cookie]
   * @param {[String]} sName  [cookie名]
   * @param {[String]} sValue [cookie值]
   * @param {[Number|String|Date]} expire [过期时间,单位是秒]
   * @param {[String]} domain [域名]
   * @param {[String]} path   [路径]
   * @param {[Boolean]} secure        []
   */
  setCookie: function(sName, sValue, expire, domain, path, secure) {
    if (!sName || /^(?:expires|max\-age|path|domain|secure)$/i.test(sName)) {
      return false;
    }
    var sExpires = "";
    if (expire) {
      switch (expire.constructor) {
        case Number:
          // sExpires = expire === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + expire;
          sExpires =
            expire === Infinity
              ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
              : "; expires=" +
                new Date(expire * 1e3 + Date.now()).toUTCString();
          /*
            Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
            version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
            the end parameter might not work as expected. A possible solution might be to convert the the
            relative time to an absolute time. For instance, replacing the previous line with:
            */
          /*
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
            */
          break;
        case String:
          sExpires = "; expires=" + expire;
          break;
        case Date:
          sExpires = "; expires=" + expire.toUTCString();
          break;
      }
    }
    document.cookie =
      sName +
      "=" +
      encodeURIComponent(sValue) +
      sExpires +
      (domain ? "; domain=" + domain : "") +
      (path ? "; path=" + path : "") +
      (secure ? "; secure" : "");
    return true;
  },

  getCookie: function(sName) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
      var aCrumb = aCookie[i].split("=");
      if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
    }
    return "";
  },

  delCookie: function(sName, domain, path) {
    document.cookie =
      sName +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (domain ? "; domain=" + domain : "") +
      (path ? "; path=" + path : "");
    return true;
  },
};
