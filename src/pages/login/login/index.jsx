import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {
  getClubQueryUserInfo,
  getWxLoginStatus,
  getPlatformAddressAndStore,
  getChangeAddressService,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import Modal from '../../../components/modal';
import { exportPoint } from '../../../utils/common/exportPoint';

const router = getCurrentInstance().router;
export default class Login extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeList: [],
      showStoreList: false,
      storeId: 0,
      coupons: [],
      showCoupons: false,
      showModal: false,
    };
  }

  componentDidShow() {
    exportPoint(router);
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentWillMount() {
    this.getClubQueryUserInfo();
  }

  getClubQueryUserInfo() {
    getClubQueryUserInfo()
      .then((res) => {
        console.log('【7fresh.user.queryUserInfo】pages/login/index res:', res);
        this.getSetting();
      })
      .catch((err) => {
        console.log('【7fresh.user.queryUserInfo】pages/login/index err:', err);
        this.getSetting();
      });
  }

  getSetting = () => {
    let obj = this;
    if (
      router.params &&
      router.params.to &&
      router.params.to.indexOf('scan-result') > -1
    ) {
      this.gotoPage();
      return;
    }
    Taro.getSetting({
      success(resp) {
        if (!resp.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
          })
            .then((res) => {
              console.log('scope.userLocation success', res);
              obj.getLocation();
            })
            .catch((err) => {
              console.log('scope.userLocation error', err);
              obj.setState({
                showModal: true,
              });
            });
        } else {
          obj.getLocation();
        }
      },
    });
  };

  getLocation = () => {
    Taro.getLocation({ type: 'gcj02' })
      .then((resp) => {
        console.log('resp==>>', resp);
        const lon = resp && resp.longitude ? resp.longitude : null;
        const lat = resp && resp.latitude ? resp.latitude : null;
        this.getStoreId(lat, lon);
      })
      .catch((err) => {
        console.log(err);
        this.gotoPage();
      });
  };

  userLogin = (storeId) => {
    if (!storeId) {
      Taro.showToast({ title: '请选择门店！', icon: 'none' });
      return;
    }
    const returnPage = router.params.to;
    Taro.getApp().storeId = storeId;
    getWxLoginStatus({
      appName: '7fresh',
      storeId,
      fromsource: 'weix',
      source: returnPage
        ? returnPage.indexOf('groupon') > -1
          ? '30'
          : returnPage.indexOf('cabinet') > -1
          ? '34'
          : returnPage.indexOf('luck-red-envelopes') > -1
          ? '9'
          : '100'
        : '100', //新人入驻同步用户数据需要传参
      subSource: '',
    })
      .then((res) => {
        if (res.success && res.coupons && res.coupons.length > 0) {
          this.setState({
            showStoreList: false,
            showCoupons: true,
            coupons: res.coupons,
          });
          return;
        } else {
          this.gotoPage();
        }
      })
      .catch((err) => {
        console.log(err);
        this.gotoPage();
      });
  };

  gotoPage = () => {
    this.onRegister();
    const to = router.params.to;
    switch (router.params.pageType) {
      case 'switchTab':
        Taro.switchTab({
          url: decodeURIComponent(to),
        });
        break;
      case 'redirectTo':
        Taro.redirectTo({
          url: decodeURIComponent(to),
        });
        break;
      case 'navigateTo':
        Taro.navigateTo({
          url: decodeURIComponent(to),
        });
        break;
      default:
        Taro.switchTab({
          url: decodeURIComponent('/pages/my/index'),
        });
        break;
    }
  };

  getStoreId = (lat, lon) => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const globalStoreId = Taro.getApp().$app.storeId;
    if (addressInfo && addressInfo.storeId) {
      this.userLogin(addressInfo.storeId);
    } else if (globalStoreId) {
      this.userLogin(globalStoreId);
    } else {
      getPlatformAddressAndStore({
        lat,
        lon,
      })
        .then((res) => {
          if (
            res &&
            res.success &&
            res.type === 3 &&
            res.tenantShopInfo.length > 0
          ) {
            this.setState({
              storeList: res.tenantShopInfo,
            });
            return;
          }
          if (res.addressInfo && res.addressInfo.storeId) {
            this.userLogin(res.addressInfo.storeId);
          } else {
            getChangeAddressService({
              lat,
              lon,
            }).then((data) => {
              if (data && data.success) {
                this.setState({
                  storeList: data.tenantShopInfo,
                  showStoreList: true,
                });
              }
            });
          }
        })
        .catch(() => {
          this.gotoPage();
        });
    }
  };

  selectStore = (id) => {
    this.setState({
      storeList: this.state.storeList.map((store) => {
        if (store.storeId === id) {
          store.active = true;
          const lbsData = {
            storeId: store.storeId || '',
          };
          Taro.setStorageSync('addressInfo', lbsData);
        } else {
          store.active = false;
        }
        return store;
      }),
      storeId: id,
    });
  };

  confirm = () => {
    this.userLogin(this.state.storeId);
  };

  closeRedPacket = () => {
    this.gotoPage();
  };

  openSetting = () => {
    Taro.openSetting().then((resp) => {
      if (resp.authSetting['scope.userLocation']) {
        this.setState(
          {
            showModal: false,
          },
          () => {
            Taro.getLocation({ type: 'gcj02' })
              .then((res) => {
                const lon = res && res.longitude ? res.longitude : null;
                const lat = res && res.latitude ? res.latitude : null;
                this.getStoreId(lat, lon);
              })
              .catch(() => {
                this.gotoPage();
              });
          }
        );
      }
    });
  };

  render() {
    return (
      <View className='login'>
        {this.state.showStoreList && (
          <View className='select-store'>
            <View className='select-box'>
              {this.state.storeList.map((store) => {
                return (
                  <View
                    key={store.storeId}
                    className='store'
                    onClick={this.selectStore.bind(this, store.storeId)}
                  >
                    <View className='left'>
                      <View
                        className={`radio ${store.active ? 'active' : ''}`}
                      />
                    </View>
                    <View className='right'>
                      <View className='name'>
                        {store.tenantInfo.tenantName}-{store.storeName}
                      </View>
                      <View className='address'>{store.storeAddress}</View>
                    </View>
                  </View>
                );
              })}
            </View>
            <View className='confirm'>
              <View className='btn' onClick={this.confirm}>
                确认门店
              </View>
            </View>
          </View>
        )}
        {this.state.showCoupons && (
          <View className='red-packet'>
            <freshman-gift
              redPackets={this.state.coupons}
              onClose={this.closeRedPacket}
            />
          </View>
        )}

        {this.state.showModal && (
          <Modal
            content='为了更好地匹配地理位置，请允许七鲜使用您的地理位置'
            onSetting={this.openSetting.bind(this)}
            show={this.state.showModal}
          />
        )}
      </View>
    );
  }
}
