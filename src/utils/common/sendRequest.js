import Taro from '@tarojs/taro';
import {
  jsonp,
  bizReqUrl,
  commonParams,
  getPtKey,
  getPtPin,
  getOpenId,
} from '../adapter/index';

/**
 * http请求封装
 * @param {Object} data
 */
export const sendRequest = data => {
  const addressInfo = Taro.getStorageSync('addressInfo');
  let _data = data && data.data;
  if (_data && typeof _data === 'string') {
    _data = JSON.parse(_data);
  }
  const start = new Date().getTime();
  const storeId =
    (_data && _data.storeId) ||
    (data && data.storeId) ||
    (addressInfo && addressInfo.storeId) ||
    '';
  const tenantId =
    _data && _data.tenantId
      ? _data.tenantId
      : data && data.tenantId
      ? data.tenantId
      : addressInfo && addressInfo.tenantInfo
      ? addressInfo.tenantInfo.tenantId
      : 1;
  const lat =
    (_data && _data.lat) ||
    (data && data.lat) ||
    (addressInfo && addressInfo.lat) ||
    '';
  const lon =
    (_data && _data.lon) ||
    (data && data.lon) ||
    (addressInfo && addressInfo.lon) ||
    '';

  console.log('【请求入参】=> ', { ...data, storeId, tenantId, lon, lat });
  return getOpenId().then(openId => {
    Taro.setStorageSync('openId', openId);
    return Taro.request({
      jsonp: jsonp ? jsonp + data.api.replace(/\./g, '') : false,
      enableHttp2: true,
      enableQuic: true,
      enableCache: true,
      url: bizReqUrl,
      data: {
        uuid: openId,
        ...data,
        ...commonParams,
        storeId: storeId,
        tenantId: tenantId || 1, //租户id
        platformId: 1, //平台id
        lat: lat,
        lon: lon,
      },
      header: { cookie: `pt_key=${getPtKey()}; pt_pin=${getPtPin()}` },
    })
      .then(res => {
        console.log(
          `接口【${data.api}】请求耗时：${new Date().getTime() - start}ms`,
          res.data
        );
        return new Promise((resolve, reject) => {
          if (
            (res.statusCode === 200 &&
              res.data.code === '0' &&
              res.data.ret === 200) ||
            (res.success && res.payOrderInfo)
          ) {
            resolve(res.data.data);
          } else if (res.data.ret === 201) {
            reject(res.data);
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