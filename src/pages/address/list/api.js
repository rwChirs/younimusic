// import Taro from '@tarojs/taro';
import { getUserAddress, getSettlementAddress } from '@7fresh/api';
import { sendRequest } from '../../../utils/common/sendRequest';
/**
 * 获取我的地址列表
 * 首页和个人中心进入地址列表 7fresh.user.address.get
 * 结算页进入地址列表 7fresh.settlement.address.get
 * 订单详情进入地址列表 7fresh.order.address.get
 */
function getAddressList(params, from) {
  const data = {
    ...params,
  };
  if (from === 'order') {
    return getSettlementAddress(data).then((res) => {
      return new Promise((resolve, reject) => {
        console.log(`【7fresh.user.address.get】: ${res}`);
        if (res && res.success) {
          resolve(res);
        } else {
          reject(res.msg);
        }
      });
    });
  } else {
    return getUserAddress(data).then((res) => {
      return new Promise((resolve, reject) => {
        console.log(`【7fresh.user.address.get】: ${res}`);
        if (res && res.success) {
          resolve(res);
        } else {
          reject(res.msg);
        }
      });
    });
  }
}

function getPosition(params = {}) {
  return sendRequest({
    api: '7fresh.user.address.getPosition',
    data: JSON.stringify(params),
  }).then((res) => {
    return new Promise((resolve, reject) => {
      if (res) {
        resolve(res);
      } else {
        reject(res.msg);
      }
    });
  });
}

function getSkuList(skuIds) {
  let skuIdList = [],
    skuList = [];
  if (skuIds && skuIds.length > 0) {
    skuIdList = skuIds.split(',');
    for (let i in skuIdList) {
      if (skuIdList[i] !== '') {
        skuList.push(Number(skuIdList[i]));
      }
    }
  }

  return skuList;
}

export { getAddressList, getPosition, getSkuList };
// module.exports = {
//   getAddressList,
//   getPosition,
//   getSkuList,
// };
