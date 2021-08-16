import coords from "./coords";
import login_check from "./login_check";
import { sendRequest } from "../utils/common/sendRequest";

const app = getApp();

//获取或返回storeId
export default function(lon, lat) {
  return new Promise((resolve, reject) => {
    let getStoreIdByCoords = (lon, lat) => {
      // 通过经纬度获取storeId
      sendRequest({
        api: "7fresh.ware.changeAddress",
        data: JSON.stringify({ lon: lon, lat: lat }),
      })
        .then(data => {
          let storeId = data && data.wareInfo && data.wareInfo.storeId;
          if (!storeId || storeId == 0) {
            reject("Cannot get storeId by coords from server.");
          } else {
            app.globalData.storeId = storeId;
            resolve({ storeId: storeId, latitude: lat, longitude: lon });
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    //先缓存
    if (!app.globalData.storeId) {
      //再默认地址
      login_check().then(logined => {
        app.globalData.defaultAddress = null;
        if (logined) {
          //如果已登录获取默认地址

          sendRequest({
            api: "7fresh.user.address.getDefault",
          })
            .then(data => {
              if (data && data.defaultAddress && data.defaultAddress.storeId) {
                app.globalData.storeId = data.defaultAddress.storeId;
                resolve(data.defaultAddress);
              } else {
                reject("Cannot getstoreId from default address.");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //如果传入了经纬度
          if (lon && lat) {
            getStoreIdByCoords(lon, lat);
          } else {
            //否则进行定位
            coords()
              .then(coords => {
                getStoreIdByCoords(coords[0], coords[1]);
              })
              .catch(e => {
                reject(e);
              });
          }
        }
      });
    } else {
      resolve({ storeId: app.globalData.storeId });
    }
  });
}
