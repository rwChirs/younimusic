import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getFreshShopService } from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';

export default class NewStore extends CommonPageComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const storeId = getCurrentInstance().router.params.storeId;
    this.getAddressByStoreId(storeId).then((res) => {
      Taro.setStorageSync('addressInfo', res);
      Taro.setStorageSync('scene', 1007);
      Taro.switchTab({
        url: `/pages/index/index`,
      });
    });
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getAddressByStoreId = (storeId) => {
    return getFreshShopService()
      .then((res) => {
        const store = res.freshShopBasicInfos.filter(
          (_store) => _store.id + '' === storeId
        )[0];
        return {
          storeId: store.id,
          lat: store.geoLatitude,
          lon: store.geoLongitude,
          addressSummary: store.addressDetail,
          addressExt: store.name,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return <View />;
  }
}
