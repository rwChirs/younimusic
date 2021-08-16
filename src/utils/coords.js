import Taro from "@tarojs/taro";
import loc from "./locate";

const app = process.env.TARO_ENV === "weapp" ? Taro.getApp().$app : {};

//获取或返回经纬度
export default function() {
  return new Promise((resolve, reject) => {
    // if(!app.globalData.coords){
    Taro.authorize({
      scope: "scope.userLocation",
      success() {
        loc({ type: "gcj02" })
          .then(({ latitude, longitude }) => {
            if (latitude && longitude) {
              app.globalData.coords = [longitude, latitude]; //[经度，纬度]
              resolve(app.globalData.coords);
            } else {
              console.warn("无法获取经纬度");
              reject("未定位到经纬度");
            }
          })
          .catch(e => {
            reject("无法定位到经纬度");
          });
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
