import { getWeiXinOpenIdService } from '@7fresh/api';
import Taro from "@tarojs/taro";

const app = Taro.getApp().$app
const globalData = process.env.TARO_ENV === "weapp" && app ? app.globalData : {};

//获取或返回openId
export default function() {
  return new Promise((resolve, reject) => {
    if (!globalData.openId) {
      Taro.login({
        success: ({ code }) => {
          getWeiXinOpenIdService({
            code: code,
              pay_channel: 19,
          })
            .then(data => {
              let open_id = data.open_id;
              globalData.openId = open_id;
              resolve(globalData.openId);
            })
            .catch(err => {
              globalData.openId = undefined;
              console.warn("无法获取openId",err);
              reject("无法获取openId");
            });
        },
      });
    } else {
      resolve(globalData.openId);
    }
  });
}
