import Taro from '@tarojs/taro';
import { getOpenId } from '@7fresh/api';
import { commonLogExposure } from './miniReport';
import srUtils from '../zhls';

const plugin = Taro.requirePlugin('loginPlugin');

const OpenidArray = [
  'pages/index/index',
  'pages/my/index',
  'pages/transition/transition',
];

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
    let storeId = '';

    let addressInfo = Taro.getStorageSync('addressInfo');
    const tenantId = (addressInfo && addressInfo.tenantId) || 1;
    if (addressInfo && addressInfo.storeId) {
      storeId = addressInfo.storeId;
    }
    if (typeof addressInfo === 'string' && addressInfo) {
      addressInfo = JSON.parse(addressInfo);
      storeId = addressInfo && addressInfo.storeId ? addressInfo.storeId : '';
    }

    if (Taro.getStorageSync('exportPoint')) {
      const pointData = JSON.parse(Taro.getStorageSync('exportPoint'));
      const unionid = pointData && pointData.unionId;
      const openid = pointData && pointData.openid;
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
              unionid,
              account: pt_pin,
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
              unionid,
              account: pt_pin,
              version: res.version,
              tenantId,
              status,
              developMode: process.env.NODE_ENV === 'development' ? 1 : '',
            });
          }
        },
      });
      if (pt_pin && OpenidArray.includes(path)) {
        Taro.login().then(({ code }) => {
          if (code) {
            getOpenId({
              appId: 'wxb8c24a764d1e1e6d',
              code: code,
            });
          }
        });
      }

      return new Promise(resolve => {
        resolve(unionid);
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
              unionId: data && data.unionId,
              openid: data && data.openId,
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
                    openid: data && data.openId,
                    unionid: data && data.unionId,
                    account: pt_pin,
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
                    openid: data && data.openId,
                    unionid: data && data.unionId,
                    account: pt_pin,
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

/**
 * 曝光埋点
 * @param {*} params
 * @param {String} eid 必填，日志标识
 * @param {String} elevel 否，点击位置event level
 * @param {String} eparam 否，点击位置event param
 * @param {String} router 是，路由
 * @param {String} pparam 否,事件发生时的page param
 */

export function getExposure(data) {
  const points = require('./miniReport');
  const pages = Taro.getCurrentPages(); //获取加载的页面
  const currentPage = pages[pages.length - 1]; //获取当前页面的对象
  const path = (currentPage && currentPage.route) || ''; //当前页面url
  const router = data && data.router;
  const params =
    data.eparam || (router && router.params) || currentPage.options; //当前参数
  points.onPageExposure({
    path: path || '',
    eid: data.eid || '',
    elevel: data.elevel || '',
    eparam: typeof params === 'object' ? JSON.stringify(params) : params,
    pparam: {
      ...params,
      developMode: process.env.NODE_ENV === 'development' ? 1 : '',
    },
  });
}

/**
 * 小程序页面曝光埋点公共方法
 * id 页面id
 * num 一个页面有多少id需要上报
 * rule 上报规则 例如 `Product_details_000${i}1${tenantId}${storeId}` 传Product_details_000就可以
 * 以key/value的形式放在扩展字段里（关键词：keyWord;主商品SKU：currentSkuId;推荐商品SKU：recommendSkuId;商品状态：commodityState）
 * data 鲜橙新埋点数据（若需要）
 */

export function getPageExposure({
  obj,
  id,
  num,
  eid,
  data,
  needOldPoints = true,
}) {
  // 需要直接上报子节点的楼层 功能聚合
  const componentChildrenMap = [3];
  try {
    for (let i = 0; i <= num; i++) {
      const targetDom = `#${id}${i}`;
      obj._intersectionObserver = Taro.createIntersectionObserver(obj.$scope);
      obj._intersectionObserver
        .relativeToViewport({ bottom: 50 })
        .observe(targetDom, () => {
          if (!obj.exposureData) obj.exposureData = {};
          if (!obj.exposureData[`${id}${i}`]) {
            // console.log('楼层曝光-旧埋点', targetDom, data)
            //曝光埋点
            const params = {
              router: obj.$router,
              eid: eid || `${id}${i}`,
            };
            if (needOldPoints) {
              getExposure(params);
            }
            obj.exposureData[`${id}${i}`] = true;
            // 鲜橙新埋点
            if (data && data.buriedPointVo) {
              console.log('楼层曝光-鲜橙新埋点', data);
              commonLogExposure({
                action: data.expAction || {}, // 曝光动作参数
                buriedPointVo: data.buriedPointVo,
              });
            }
            if (
              data &&
              data.floorType &&
              componentChildrenMap.indexOf(data.floorType) !== -1
            ) {
              componentChildrenExposure(data);
            }
          }
        });
    }
  } catch (err) {
    console.warn('版本过低', err);
  }
}

/**
 * 监测组件曝光埋点
 * @param {*} obj
 * @param {*} eid
 * @param {*} id
 */
export function getComponentExposure({ obj, eid, id, product, eparam }) {
  try {
    // const srUtils = require('../zhls');
    const targetDom = `#${id}-${product.skuId}`;
    obj._intersectionObserver = Taro.createIntersectionObserver(obj.$scope);
    obj._intersectionObserver
      .relativeToViewport({ bottom: 100 })
      .observe(targetDom, () => {
        if (!obj[`${id}-${product.skuId}`]) {
          //曝光埋点
          const params = {
            router: obj.$router,
            eid: `${eid}`,
            eparam,
          };

          exportPoint(
            obj.$router,
            product.status,
            product.skuId,
            product.skuName
          );
          srUtils.onProductExpose(product);
          getExposure(params);
          obj[`${id}-${product.skuId}`] = true;
        }
      });
  } catch (err) {
    console.warn('版本过低', err);
  }
}

/**
 * 组件内部主动上报曝光埋点
 * @param {*} data
 * 包括：功能聚合
 */
export function componentChildrenExposure(data) {
  if (data && data.floorType === 3 && data.items && data.items.length > 0) {
    data.items.map((item, i) => {
      commonLogExposure({
        action: {
          ...data.expAction,
          index: i + 1,
          target: 3,
          imageUrl: item.image,
          floorIndex: data.floorIndex,
        }, // 曝光动作参数
        buriedPointVo: data.buriedPointVo,
      });
    });
  }
}
