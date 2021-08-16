import Taro from "@tarojs/taro";
import http from "./http.js";
import app_info from "../appInfo.js";

const plugin =
  process.env.TARO_ENV === "weapp" ? Taro.requirePlugin("loginPlugin") : Taro;

// let app = getApp();

module.exports = {
  request: function({
    url = `${getApp().bizRequesgUrl}/mwp/mobileDispatch`,
    data,
    header,
    method = "GET",
    ...other
  }) {
    const pt_key = plugin.getStorageSync("jdlogin_pt_key");
    const pt_pin = encodeURIComponent(plugin.getStorageSync("jdlogin_pt_pin"));

    let option = {
      url,
      method,
      data: { ...app_info, ...data /* , pin: pt_pin  */ },
      header: { cookie: `pt_key=${pt_key}; pt_pin=${pt_pin}`, ...header },
      ...other,
    };

    return http
      .request(option)
      .then(data => {
        //TODO，过滤登录code
        return Promise.resolve(data);
      })
      .catch((e = { data, errMsg, header, statusCode }) => {
        return Promise.reject(e);
      });
  },
};
