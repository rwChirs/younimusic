import {
  share,
  getMyGroupService,
  getGroupDetailService,
  getUserDefaultAddressService,
  getResultPayService,
  getWaitGroupInfoService,
  getSkuDetailService,
  getTenantShopService,
  // getRealUrlService,
} from '@7fresh/api';
import { sendRequest } from '../../../utils/common/sendRequest';

/**
 * 获取三人拼团分享
 */
export const getThreeGroupShare = () => {
  return share({
    shareType: 8,
  }).then(res => {
    return res;
  });
};

/**
 * 我的拼团列表页
 * @param orderListTab - 按状态查询我的拼团,0:全部; 1:成功; 2:失败; 3:进行中
 * @param pageIndex - 请求页码
 * @param pageSize - 每页返回条数
 * @param reqForm - 请求参数
 */
export const listUsingPOST = params => {
  return getMyGroupService(params).then(res => {
    return res;
  });
};

/**
 * 商品详情
 */
export const fightDetailPost = params => {
  return getGroupDetailService(params).then(res => {
    return res;
  });
};

/**
 * 获取用户默认收货地址
 */
export const getUserDefaultAddress = () => {
  return getUserDefaultAddressService().then(res => {
    return new Promise(resolve => {
      resolve(res.defaultAddress ? res.defaultAddress : {});
    });
  });
};

/**
 * 支付结果
 */
export const payResultPost = params => {
  return getResultPayService(params).then(res => {
    return res;
  });
};

/**
 * 大家都在拼
 */
export const waitGroupInfo = params => {
  return getWaitGroupInfoService(params).then(res => {
    return res;
  });
};

export const getSkuDetail = (skuId, storeId) => {
  return getSkuDetailService({
    skuId,
    storeId,
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

export const getTenantInfo = params => {
  return getTenantShopService(params).then(res => {
    return res;
  });
};
