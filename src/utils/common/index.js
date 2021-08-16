// 获取公共参数
import Taro from '@tarojs/taro';

const app = Taro.getApp().$app;
const QQMapWx = require('../qqmap-wx-jssdk.min.js');
const amapFile = require('../amap-wx.js');
export const log = require('../../utils/weixinAppReport.js').init();

const qqmap = new QQMapWx({
  key: app.wx_map_dev_key,
}); // 初始化腾讯地图
const amap = new amapFile.AMapWX({
  key: app.gaodeKey,
}); // 高德地图初始化

/**
 * 获取定位信息
 * - config 配置信息
 */
export const getLocation = (config = { type: 'gcj02' }) => {
  return new Promise(function(resolve, reject) {
    let options = { ...config };
    options.fail = function(err) {
      reject(err);
    };
    options.success = function(res) {
      resolve(res);
    };
    options.complete = ({ errMsg, ...rest }) => {
      if ('getLocation:ok' == errMsg) {
        console.log(
          `%c 坐标体系：${options.type}，坐标：${rest.longitude},${rest.latitude}`,
          'font-size: 16px'
        );
      }
    };
    wx.getLocation(options);
  });
};

/**
 * 获取距离, 腾讯地图位置计算有超出10公里计算不了的限制
 * from: {latitude, longitude}
 * to: {latitude, longitude} / [{latitude, longitude}, {latitude, longitude}]
 * mode: walking / driving
 */
export const getDistance = function(from, to, mode = 'driving', sdk = 'gaode') {
  if (sdk === 'gaode') {
    return new Promise((resolve, reject) => {
      const method =
        mode === 'walking'
          ? 'getWalkingRoute'
          : mode === 'driving'
          ? 'getDrivingRoute'
          : 'getRidingRoute';
      amap[method]({
        origin: `${from.longitude},${from.latitude}`,
        destination: `${to.longitude},${to.latitude}`,
        success: function(data) {
          console.log(data);
          if (data.paths[0] && data.paths[0].distance) {
            resolve(data.paths[0].distance);
          }
        },
        fail: function(err) {
          reject(err);
        },
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      qqmap.calculateDistance({
        mode: mode,
        from: from,
        to: [{ ...to }],
        success: function(res) {
          if (res.status === 0) {
            resolve(res.result.elements[0].distance);
          } else {
            reject(res.message);
          }
        },
        fail: function(err) {
          reject(err);
        },
      });
    });
  }
};

/**
 * 距离格式化
 * - distance Number
 */
export const formatDistanceFormat = function(distance) {
  if (distance < 100) {
    return `${distance} m`;
  } else {
    return `${(distance / 1000).toFixed(2)} km`;
  }
};

// module.exports = {
//   getLocation,
//   getDistance,
//   formatDistanceFormat,
//   log,
// };
