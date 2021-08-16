import { sendRequest } from '../../utils/common/sendRequest';

//获取列表信息
const getListData = (storeId, planDate) => {
  return sendRequest({
    api: '7fresh.cook.menu',
    storeId,
    data: {
      planDate,
    },
  }).then((res) => {
    return new Promise((resolve) => {
      resolve(res);
    });
  });
};

//获取详情页信息
const getDetailData = (storeId, data) => {
  return sendRequest({
    api: '7fresh.cook.detail',
    storeId,
    data,
  }).then((res) => {
    return new Promise((resolve) => {
      resolve(res);
    });
  });
};

//收藏取消
const triggerCollect = (data) => {
  return sendRequest({
    api: '7fresh.cook.operate',
    data,
  }).then((res) => {
    return new Promise((resolve) => {
      resolve(res);
    });
  });
};

//分享信息获取
const getShareMsg = (storeId) => {
  return sendRequest({
    api: '7fresh.share.getShareInfo',
    data: JSON.stringify({
      shareType: 4,
    }),
    storeId,
  }).then((res) => {
    return new Promise((resolve) => {
      resolve(res);
    });
  });
};

export { getListData, getDetailData, triggerCollect, getShareMsg };
