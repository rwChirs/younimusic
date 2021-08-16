// import { getRealUrlService } from '@7fresh/api';
import { sendRequest } from '../../../utils/common/sendRequest';

/**
 * 我的拼团列表页
 * @param orderListTab - 按状态查询我的拼团,0:全部; 1:成功; 2:失败; 3:进行中
 * @param pageIndex - 请求页码
 * @param pageSize - 每页返回条数
 * @param reqForm - 请求参数
 */
export const listUsingPOST = params => {
  return sendRequest({
    api: '7fresh.group.myGroup',
    data: JSON.stringify({
      ...params,
    }),
  }).then(res => {
    return res;
  });
};

/**
 * 获取用户收货地址
 * 1.登录 isLBS
 * 2.未登录 isLBS
 */
export const getUserAddress = (storeId, skuId) => {
  let api = '7fresh.user.address.get';
  let data = '';
  if (Number(storeId) > 0 && Number(skuId) > 0) {
    api = '7fresh.sku.detail.address.get';
    data = JSON.stringify({
      storeId: storeId,
      skuIds: [skuId],
    });
  }
  return sendRequest({
    api: api,
    data: data,
  }).then(res => {
    return new Promise(resolve => {
      resolve(res.addressInfos);
    });
  });
};

/**
 * 是否登录
 */
export const getLoginStatus = () => {
  return sendRequest({
    api: '7fresh.newUser.checkUserIsNew',
  }).then(res => {
    if (res.code === '3') {
      return false;
    } else {
      return true;
    }
  });
};

/**
 * 校验提单
 */
export const checkUserPost = params => {
  return sendRequest({
    api: '7fresh.group.checkUserType',
    data: JSON.stringify({
      ...params,
    }),
  }).then(res => {
    return res;
  });
};

export const getSkuDetail = (skuId, storeId) => {
  return sendRequest({
    api: '7fresh.sku.detail',
    data: JSON.stringify({
      skuId,
      storeId,
    }),
  }).then(res => {
    if (res && res.success) {
      const specs = [
        {
          name: '品牌',
          value:
            res && res.skuSpec && res.skuSpec.brand ? res.skuSpec.brand : '',
        },
        {
          name: '规格',
          value:
            res && res.skuSpec && res.skuSpec.saleSpecDesc
              ? res.skuSpec.saleSpecDesc
              : '',
        },
        {
          name: '重量',
          value:
            res && res.skuSpec && res.skuSpec.weight ? res.skuSpec.weight : '',
        },
        {
          name: '产地',
          value:
            res && res.skuSpec && res.skuSpec.placeOfProduct
              ? res.skuSpec.placeOfProduct
              : '',
        },
        {
          name: '保质期',
          value:
            res && res.skuSpec && res.skuSpec.shelfLife
              ? res.skuSpec.shelfLife
              : '',
        },
      ];

      specs.push(
        ...res.skuSpec.skuAttrInfoWebs.map(data => {
          return {
            name: data.attrName,
            value: data.attrValNames
              .toString()
              .split(',')
              .join('，'),
          };
        })
      );
      return {
        detailImageUrl: res.detailImageUrl,
        skuSpec: specs,
        skuPriceDescList: res.skuPriceDescList,
        recommendDesc: res.recommendDesc,
      };
    }
  });
};

/**
 * 菊花码解码
 */
export const getRealUrl = url => {
  // return getRealUrlService({
  //   url: decodeURIComponent(url),
  // }).then(res => {
  //   return res;
  // });
  return sendRequest({
    api: '7fresh.qrcode.getRealUrl',
    url: url,
  }).then(res => {
    return res;
  });
};
