import Taro from '@tarojs/taro';
import { sendRequest } from "../utils/common/sendRequest";
const app = Taro.getApp().$app;
const plugin =
  process.env.TARO_ENV === "weapp" ? requirePlugin("loginPlugin") : Taro;

export default function(callback) {
  return new Promise(function(resolve, reject) {
    let jdlogin_pt_key = plugin.getStorageSync("jdlogin_pt_key");

    if (jdlogin_pt_key) {
      sendRequest({
        url: app.requestUrl + "/serialCode/isLogin",
      })
        .then(data => {
          let logined = data.resultCode != -4;
          resolve(logined);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      resolve(false);
    }
  });
};
