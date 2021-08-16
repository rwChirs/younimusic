import {
  getSolitaireShareListService,
  getSolitaireQueryListService,
} from '@7fresh/api';

//获取列表分享数据
export const getShareList = () => {
  return getSolitaireShareListService({ type: 1 }).then(res => {
    return res;
  });
};

//获取列表数据
export const getListInit = storeId => {
  return getSolitaireQueryListService(storeId).then(res => {
    if (res && res.success) {
      return res;
    }
  });
};
