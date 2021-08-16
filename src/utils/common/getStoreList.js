import { getShopInfoPageListService,getNewIndexServer } from '@7fresh/api';
export const getStoreList = () => {
  //TODO: 需要验证
  return getNewIndexServer()
    .then(res => {
      let data = [];
      if (res && res.data && res.data.floors) {
        data = res.data.floors
          .filter(floor => floor.floorType === 8)
          .map((floor, index) => {
            return {
              id: floor.action.toUrl ? floor.action.toUrl.split('/')[1] : 0,
              no: 310000 + index,
              name: floor.firstTitle,
              address: floor.secondTitle,
              imageUrl: floor.image,
              lat: floor.thirdTitle
                ? +parseFloat(floor.thirdTitle.split(';')[1]).toFixed(6)
                : null,
              lng: floor.thirdTitle
                ? +parseFloat(floor.thirdTitle.split(';')[0]).toFixed(6)
                : null,
              distance: '',
              opentime: floor.firstTitle,
              eid: floor.action.clsTag,
            };
          });
      } else {
        data = [];
      }
      return data;
    })
    .catch(err => {
      console.log(err);
    });
};

export const getNewStoreList = page => {
  return getShopInfoPageListService({
    page: page,
    pageSize: 10,
  })
    .then(res => {
      let data = [];
      if (
        res &&
        res.shopInfoList &&
        res.shopInfoList.pageList &&
        res.shopInfoList.pageList.length > 0
      ) {
        data = res.shopInfoList.pageList;
      }
      return data;
    })
    .catch(err => {
      console.log(err);
    });
};
