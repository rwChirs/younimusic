import Taro from '@tarojs/taro';
import {
  jsonp,
  commonParams,
  getPtKey,
  getPtPin,
  getOpenId,
  colorUrl,
} from '../adapter/index';

/**
 * http请求封装
 * @param {Object} data
 */
const colorRequest = data => {
  let _data = data && data.data;
  if (_data && typeof _data === 'string') {
    _data = JSON.parse(_data);
  }
  console.log('_data=>', _data);

  const start = new Date().getTime();
  const storeId =
    (_data && _data.storeId) ||
    (data && data.storeId) ||
    (Taro.getStorageSync('addressInfo') &&
      Taro.getStorageSync('addressInfo').storeId) ||
    '';
  const tenantId =
    (_data && _data.tenantId) ||
    (data && data.tenantId) ||
    (Taro.getStorageSync('addressInfo') &&
    Taro.getStorageSync('addressInfo').tenantInfo
      ? Taro.getStorageSync('addressInfo').tenantInfo.tenantId
      : 1);
  const lat =
    (_data && _data.lat) ||
    (data && data.lat) ||
    (Taro.getStorageSync('addressInfo') &&
      Taro.getStorageSync('addressInfo').lat) ||
    '';
  const lon =
    (_data && _data.lon) ||
    (data && data.lon) ||
    (Taro.getStorageSync('addressInfo') &&
      Taro.getStorageSync('addressInfo').lon) ||
    '';

  return getOpenId().then(openId => {
    Taro.setStorageSync('openId', openId);
    return Taro.request({
      jsonp,
      url: colorUrl,
      data: {
        appid: 'SF-MINIAPP',
        t: new Date().getTime(),
        functionId: data.api.split('.').join('_'),
        body: {
          uuid: openId,
          ...data,
          ...commonParams,
          storeId: storeId,
          tenantId: tenantId, //租户id
          platformId: 1, //平台id
          lat: lat,
          lon: lon,
          v: 2,
        },
      },
      header: { cookie: `pt_key=${getPtKey()}; pt_pin=${getPtPin()}` },
    })
      .then(res => {
        console.log(
          `接口【${data.api}】请求耗时：${new Date().getTime() - start}ms`
        );
        return new Promise((resolve, reject) => {
          if (
            (res.statusCode === 200 && res.data.code === '0') ||
            (res.success && res.payOrderInfo)
          ) {
            resolve(res.data.data);
          } else {
            resolve(res.data);
          }
        });
      })
      .catch(res => {
        console.log(res);
      });
  });
};

export default colorRequest;
