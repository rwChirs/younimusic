import {
  getSkuDetailService,
  getSkuDetailAddressService,
  getUserDefaultAddressService,
  getSolitaireOrderListService,
  getSolitaireDetailService,
  getSolitaireListService,
  getSolitaireListShareService,
  getSolitaireShareService,
  getFreshShopService,
  getSolitaireActivity,
  // getRealUrlService,
} from '@7fresh/api';

export const getSkuDetail = (skuId, storeId) => {
  //color没调通
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

export const getUserAddress = params => {
  return getSkuDetailAddressService({ ...params }).then(res => {
    return res;
  });
};

export const getUserDefaultAddress = () => {
  return getUserDefaultAddressService().then(res => {
    return res.defaultAddress;
  });
};

export const getSolitaireOrderList = params => {
  return getSolitaireOrderListService(params).then(res => {
    return res;
  });
};

export const getSolitaireDetail = params => {
  return getSolitaireDetailService(params).then(res => {
    if (res && res.success) {
      return res;
    } else {
      throw new Error(res.msg);
    }
  });
};

export const getSolitaireTodayList = params => {
  return getSolitaireListService(...params).then(res => {
    if (res) {
      return res.skuDetails;
    } else {
      console.log(res);
    }
  });
};

export const getSolitaireToday = params => {
  return getSolitaireListService(...params).then(res => {
    if (res) {
      return res;
    } else {
      throw new Error(res);
    }
  });
};

export const getShareInfo = params => {
  return getSolitaireListShareService(...params).then(res => {
    if (res) {
      return res;
    } else {
      throw new Error(res);
    }
  });
};

export const getSolitaireShare = params => {
  return getSolitaireShareService({
    storeId: params.storeId,
    data: params.data,
  }).then(res => {
    if (res && res.success) {
      return res;
    }
  });
};

export const getAddressByStoreId = () => {
  return getFreshShopService().then(res => {
    return res.freshShopBasicInfos;
  });
};

/**
 * 菊花码解码 网关还没切color
 */
export const getRealUrl = url => {
  return getRealUrlService({
    url
  }).then(res => {
    return res;
  });
};

export const onSolitaireActivity = params => {
  return getSolitaireActivity(params).then(res => {
    if (res && res.success) {
      return res.activityId;
    }
  });
};
