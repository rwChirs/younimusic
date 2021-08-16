const network = require("./network.js");
const URL = require("./url.js");
const UTIL = require("./util.js");
const app = getApp();
const uuid = require("./uuid.js");
const plugin =
  process.env.TARO_ENV === "weapp" ? requirePlugin("loginPlugin") : Taro;

function getCouponList(option) {
  option = option || {};
  option.size = option.size || 10;
  option.index = option.index || 1;

  network.ajax({
    url: app.bizRequesgUrl + "/mwp/mobileDispatch",
    data: {
      uuid: uuid,
      client: "m",
      appName: "freshminip",
      api: "freshminip.coupon.couponList",
      data: JSON.stringify({
        page: option.index,
        pageSize: option.size,
      }),
    },
    header: {
      cookie: "pt_key=" + (plugin.getStorageSync("jdlogin_pt_key") || ""),
    },
    success:
      option.success ||
      function(data) {
        console.log(data);
      },
  });
}

function getCoupon(option) {
  option = option || {};
  if (!option.batchId) return;

  network.ajax({
    url: app.bizRequesgUrl + "/mwp/mobileDispatch",
    data: {
      uuid: uuid,
      client: "m",
      appName: "freshminip",
      api: "freshminip.coupon.claimCoupon",
      data: JSON.stringify({
        batchId: option.batchId,
      }),
    },
    header: {
      cookie: "pt_key=" + (plugin.getStorageSync("jdlogin_pt_key") || ""),
    },
    success:
      option.success ||
      function(data) {
        console.log(data);
      },
  });
}

//跳转优惠券商品列表
//https://7fresh.m.jd.com/list.html?couponId=XXX
module.exports = { getCouponList, getCoupon };
