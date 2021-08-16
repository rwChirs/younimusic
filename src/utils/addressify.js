import Taro from '@tarojs/taro';
import QQMapWX from './qqmap-wx-jssdk.min';

const app = Taro.getApp().$app;
const instant = new QQMapWX({
  key: app.wx_map_dev_key,
});

function addressify({ longitude, latitude, coord_type = 5 }) {
  return new Promise((resolve, reject) => {
    instant.reverseGeocoder({
      // 输入的locations的坐标类型，可选值为[1,6]之间的整数，每个数字代表的类型说明：
      // 1 GPS坐标
      // 2 sogou经纬度
      // 3 baidu经纬度
      // 4 mapbar经纬度
      // 5 [默认]腾讯、google、高德坐标
      // 6 sogou墨卡托
      coord_type: coord_type,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      complete: ({ message, result }) => {
        if ('query ok' == message) {
          console.log(
            `%c 参数： coord_type:${coord_type}，longitude:${longitude}，latitude:${latitude}.[${result.address}]`,
            'font-size: 16px'
          );
          resolve(result);
        } else {
          reject(result);
        }
      },
    });
  });
}

export { addressify };
