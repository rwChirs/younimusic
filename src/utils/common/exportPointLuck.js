import Taro from '@tarojs/taro';
import { getOpenId } from '@7fresh/api';

const plugin = Taro.requirePlugin('loginPlugin');

/**
 * 获取openid和unionid
 * appId wxb8c24a764d1e1e6d
 * code wx.login
 */
export function exportPoint(router, status, recommendSkuId, recommendSkuName) {
  //h5埋点方法
  let points;
  if (process.env.TARO_ENV === 'h5') {
    points = require('@7fresh/points/build/h5');
    points.setPagePV();
    return;
  } else {
    points = require('./miniReport');
    //小程序埋点方法
    const pages = Taro.getCurrentPages(); //获取加载的页面
    const pt_pin = plugin.getStorageSync('jdlogin_pt_pin') || '';
    const currentPage = pages[pages.length - 1]; //获取当前页面的对象
    const path = (currentPage && currentPage.route) || ''; //当前页面url
    const params = (router && router.params) || currentPage.options; //当前参数
    params.recommendSkuId = recommendSkuId;
    params.recommendSkuName = recommendSkuName;
    params.status = status;
    let storeId = '',
      lat = '',
      lon = '';

    let addressInfo = Taro.getStorageSync('addressInfo');
    const tenantId = (addressInfo && addressInfo.tenantId) || 1;
    if (addressInfo && addressInfo.storeId) {
      storeId = addressInfo.storeId;
      lat = addressInfo.lat;
      lon = addressInfo.lon;
    }
    if (typeof addressInfo === 'string' && addressInfo) {
      addressInfo = JSON.parse(addressInfo);
      storeId = addressInfo && addressInfo.storeId ? addressInfo.storeId : '';
      lat = addressInfo && addressInfo.lat ? addressInfo.lat : '';
      lon = addressInfo && addressInfo.lon ? addressInfo.lon : '';
    }

    if (Taro.getStorageSync('exportPoint')) {
      const pointData = JSON.parse(Taro.getStorageSync('exportPoint'));
      const unionId = pointData.unionId;
      const openid = pointData.openid;
      Taro.getSystemInfo({
        success(res) {
          // 埋点初始化
          if (recommendSkuId) {
            points.onPageSet({
              path,
              urlParam: params ? JSON.stringify(params) : '',
              skuId: params && params.skuId ? params.skuId : '',
              storeId,
              openid,
              unionId,
              account: pt_pin,
              lat,
              lon,
              version: res.version,
              tenantId,
              status,
            });
          } else {
            points.onPageSetPV({
              path,
              urlParam: params ? JSON.stringify(params) : '',
              skuId: params && params.skuId ? params.skuId : '',
              storeId,
              openid,
              unionId,
              account: pt_pin,
              lat,
              lon,
              version: res.version,
              tenantId,
              status,
              developMode: process.env.NODE_ENV === 'development' ? 1 : '',
            });
          }
        },
      });

      return new Promise(resolve => {
        resolve(unionId);
      });
    } else {
      //第一次进入访问接口
      return Taro.login().then(({ code }) => {
        if (code) {
          return getOpenId({
            appId: 'wxb8c24a764d1e1e6d',
            code: code,
          }).then(data => {
            const point = {
              unionId: data.unionId,
              openid: data.openId,
            };

            Taro.getSystemInfo({
              success(res) {
                // 埋点初始化
                if (recommendSkuId) {
                  points.onPageSet({
                    path,
                    urlParam: params ? JSON.stringify(params) : '',
                    skuId: params && params.skuId ? params.skuId : '',
                    storeId,
                    openid: res.openId,
                    unionid: res.unionId,
                    account: pt_pin,
                    lat,
                    lon,
                    version: res.version,
                    tenantId,
                    status,
                  });
                } else {
                  points.onPageSetPV({
                    path,
                    urlParam: params ? JSON.stringify(params) : '',
                    skuId: params && params.skuId ? params.skuId : '',
                    storeId,
                    openid: res.openId,
                    unionid: res.unionId,
                    account: pt_pin,
                    lat,
                    lon,
                    version: res.version,
                    tenantId,
                    status,
                    developMode:
                      process.env.NODE_ENV === 'development' ? 1 : '',
                  });
                }
              },
            });

            Taro.setStorageSync('exportPoint', JSON.stringify(point));
            return data.unionId;
          });
        }
      });
    }
  }
}
