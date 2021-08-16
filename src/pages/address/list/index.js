import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import {
  getLimitMaxNum,
  getChangeAddressService,
  getChangeMapAddressService,
  getTenantShopService,
  deleteUserAddress,
  getAreastoreNearby,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import './index.scss';
import RpxLine from '../../../components/rpx-line';
import { imageList } from '../image';
import { getAddressList, getSkuList } from './api';
import login_check from '../../../utils/login_check.js';
import utils from '../../login/util';
import AddressTo from '../components/address-to';
import AddressPosition from '../components/address-position';
import AddressNone from '../components/address-none';
import AddressLogin from '../components/address-login';
import {
  getReadlyAddressList,
  filterDescription,
} from '../../../utils/common/utils';
import SwitchAddressModal from '../../../components/switch-address-modal';
import SwitchShopModal from '../../../components/switch-shop-modal';
import getUserStoreInfo, {
  saveAddrInfo,
} from '../../../utils/common/getUserStoreInfo';
import Modal from '../../../components/modal';
import { addressify } from '../../../utils/addressify';
import { exportPoint } from '../../../utils/common/exportPoint';
import Loading from '../../../components/loading';

export default class AddressList extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadFlag: true,
      screenHeight: 0,
      actions: [
        {
          name: '删除',
          color: '#fff',
          fontsize: '20',
          width: 60,
          icon: 'like',
          background: '#ed3f14',
        },
      ],
      addressData: {},
      addressList: [],
      failAddressList: [],
      tenantShopInfo: {},
      currentChooseAddress: {},
      from: getCurrentInstance().router.params.from || '',
      ads: getCurrentInstance().router.params.ads || '',
      closeFlag: true,
      lbsData: Taro.getStorageSync('addressInfo') || {},
      switchTenantFlag: false,
      switchShopFlag: false,
      showModal: false,
      position: '定位中...',
      lat: '',
      lng: '',
      isMatchPosition: true,
      showAddressList: false,
      beforeFilterAddressNum: '',
      baseAddressNum: '',
    };
  }

  // config = {
  //   navigationBarTitleText: '收货地址',
  //   usingComponents: {
  //     'p-swipeout': '../../../components/swipeout/index',
  //   },
  // };

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          screenHeight: res.windowHeight - 60,
          from: getCurrentInstance().router.params.from,
        });
      },
    });
    if (getCurrentInstance().router.params.from !== 'user') {
      this.getSetting('query').then((res) => {
        if (res) {
          this.getLocation();
        }
      });
    }
    //如果没有缓存，请求三公里定位
    if (!this.state.lbsData) {
      getUserStoreInfo(
        this.state.lbsData && this.state.lbsData.storeId,
        '',
        '',
        '',
        1
      )
        .then((args) => {
          this.setState({
            lbsData: args,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentDidShow() {
    login_check().then((logined) => {
      if (!logined) {
        // this.gotoLogin();
        this.setState({
          notLogin: true,
          loadFlag: false,
        });
        return false;
      } else {
        this.setState(
          {
            notLogin: false,
            addressData: getCurrentInstance().router.params,
            lbsData: Taro.getStorageSync('addressInfo') || {},
          },
          () => {
            console.log(this.state.addressData);
            //获取地址列表
            this.getAddressList();
            this.getSetting('query');
          }
        );
      }
    });
    this.onPageShow();
    const addressInfo = Taro.getStorageSync('addressInfo');
    if (
      Number(Taro.getStorageSync('changeAddressToast')) === 1 &&
      addressInfo &&
      addressInfo.storeName
    ) {
      Taro.showToast({
        title: `为您切换至${addressInfo.storeName}店铺`,
        icon: 'none',
      });
      Taro.setStorageSync('changeAddressToast', 2);
    }
  }

  componentDidHide() {
    this.onPageHide();
  }

  getSetting = (flag) => {
    return Taro.getSetting().then((res) => {
      if (!res.authSetting['scope.userLocation']) {
        return Taro.authorize({
          scope: 'scope.userLocation',
        })
          .then((result) => {
            console.log('scope.userLocation success', result);
            return true;
          })
          .catch((err) => {
            console.log('scope.userLocation error', err);
            if (flag && flag === 'query') {
              this.setState({
                position: '定位服务未开启',
              });
            } else {
              this.setState({
                showModal: true,
              });
            }
            return false;
          });
      }
      return true;
    });
  };

  openSetting = () => {
    Taro.openSetting().then((res) => {
      if (res.authSetting['scope.userLocation']) {
        this.setState({
          showModal: false,
        });
      }
    });
  };

  //关闭提示信息
  onTipClose = () => {
    this.setState({
      closeFlag: false,
    });
  };

  /**
   * 去登陆页
   */
  gotoLogin = () => {
    const returnPage = `/pages/address/list/index?from=${this.state.from}`;
    utils.redirectToLogin(returnPage);
    // utils.gotoLogin(returnPage, 'redirectTo');
  };

  //定位点击事件
  getCurPosition = () => {
    const { lat, lng, position } = this.state;
    const params = {};
    if (position === '定位失败') return;
    params.addressInfos = [];
    for (var i = 0; i < 1; i++) {
      params.addressInfos.push({
        addressId: i,
        lat: lat,
        lon: lng,
      });
    }

    console.log(params);

    getChangeMapAddressService({
      lat,
      lon: lng,
    }).then((res) => {
      const info = res && res.tenantShopInfo && res.tenantShopInfo[0];
      this.onTenantInfo(info && info.storeId);
    });
  };

  //开始定位
  getLocation = () => {
    this.setState(
      {
        position: '定位中...',
      },
      () => {
        let flag = true;
        Taro.getLocation({ type: 'gcj02' }).then((res) => {
          flag = false;
          addressify(res).then((result) => {
            this.showPosition(result);
          });
        });
        setTimeout(() => {
          if (flag && this.state.position !== '定位服务未开启') {
            this.setState({
              position: '定位失败',
            });
          }
        }, 1000);
      }
    );
  };

  defaultCompareToPosition = () => {
    const { lbsData, addressList } = this.state;
    const addressInfo = Taro.getStorageSync('addressInfo') || lbsData;
    const defaultAddress = addressList.filter(
      (item) =>
        item.isDefault === 1 &&
        (`${item.addressId}` === `${addressInfo.addressId}` ||
          (!addressInfo.addressId && !addressInfo.storeId))
    )[0];
    if (defaultAddress) {
      getChangeMapAddressService(defaultAddress).then((res) => {
        const storeArr = res.tenantShopInfo.map((data) => data.storeId);
        if (
          storeArr.indexOf(addressInfo.storeId) === -1 &&
          addressInfo.addressId !== defaultAddress.addressId
        ) {
          if (defaultAddress.addressId && addressInfo.storeId) {
            this.setState({
              isMatchPosition: false,
            });
          }
        } else {
          this.setState({
            isMatchPosition: true,
          });
        }
      });
      // 根据经纬度，获取门店id
      getAreastoreNearby({ addressInfos: defaultAddress }).then((res) => {
        console.log('【7fresh.areastore.nearby】:', res);
      });
    } else {
      this.setState({
        isMatchPosition: false,
      });
    }
  };

  //根据腾讯api获取到详细地址和经纬度
  showPosition = (position) => {
    console.log('【当前定位地址】', position);
    const addr =
      position.address_component.street ||
      position.formatted_addresses.recommend;
    this.setState({
      position: addr,
      lat: position.location.lat,
      lng: position.location.lng,
    });
  };

  showError = (error) => {
    console.log(error);
  };

  //获取租户信息
  onTenantInfo = (storeId) => {
    const data = {
      storeId: storeId,
    };
    const lbsData = this.state.lbsData;
    getTenantShopService(data)
      .then((res) => {
        if (res && res.success) {
          console.log(`【租户信息】: ${JSON.stringify(res.tenantShopInfo)}`);
          this.onSwitch(res.tenantShopInfo);
          if (lbsData.storeId !== storeId && res.tenantShopInfo.storeName) {
            // 选取定位地址切换时提示门店信息
            Taro.setStorageSync('changeAddressToast', 1);
          }
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none',
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  create = () => {
    const { beforeFilterAddressNum, baseAddressNum } = this.state;
    this.getSetting().then((isCanPosition) => {
      if (isCanPosition) {
        let {
          activityId = '',
          addressId = '',
          joinType = '',
          skuId = '',
          storeId = '',
          grouponId = '',
          from = '',
        } = this.state.addressData;
        if (skuId === 'undefined') {
          skuId = '';
        }
        if (beforeFilterAddressNum < baseAddressNum) {
          Taro.navigateTo({
            url: `/pages/address/new/index?type=new&from=${from}&skuId=${skuId}&storeId=${storeId}&activityId=${activityId}&joinType=${joinType}&grouponId=${grouponId}&addressId=${addressId}`,
          });
        } else {
          this.getLimitMaxNumFunc();
        }
      }
    });
  };
  /**
   * 获取地址限制最大条数和文案
   */
  getLimitMaxNumFunc = () => {
    const { beforeFilterAddressNum } = this.state;
    getLimitMaxNum().then((res) => {
      console.log(res);
      if (res.code === 3) {
        this.gotoLogin();
        return;
      }
      if (
        res &&
        res.limitMaxAddressNum &&
        beforeFilterAddressNum >= res.limitMaxAddressNum
      ) {
        Taro.showToast({
          title: res.overMaxRemind,
          icon: 'none',
        });
      }
    });
  };

  edit = (address) => {
    let { activityId, joinType, skuId, grouponId } = this.state.addressData;
    if (skuId === 'undefined') {
      skuId = '';
    }
    let {
      lat,
      lon,
      userName,
      mobile,
      addressSummary,
      addressExt,
      where,
      addressId,
      storeId,
      tagKey,
    } = address;
    if (activityId === undefined) {
      activityId = '';
    }
    if (joinType === undefined) {
      joinType = '';
    }
    if (grouponId === undefined) {
      grouponId = '';
    }
    let from = this.state.addressData.from;

    // 参考H5的实现在跳转到地址编辑页面之前把当前地址信息存储到storage中
    Taro.setStorageSync('addressDetailForCheck', address);

    Taro.navigateTo({
      url: `/pages/address/new/index?type=edit&from=${from}&latitude=${lat}&longitude=${lon}&userName=${userName}&mobile=${mobile}&addressSummary=${addressSummary}&skuId=${skuId}&storeId=${storeId}&addresssId=${addressId}&addressExt=${addressExt}&where=${where}&addressId=${addressId}&activityId=${activityId}&joinType=${joinType}&grouponId=${grouponId}&tagKey=${tagKey}&ads=${this.state.ads}`,
    });
  };

  //删除地址
  delete = (address, e) => {
    if (e.detail.index === 0) {
      deleteUserAddress({
        addressId: address.addressId,
      })
        .then((res) => {
          console.log('【7fresh.user.address.get】: ', res);
          if (res && res.success) {
            Taro.showToast({
              title: res.msg,
              icon: 'success',
            });

            //删除默认地址
            console.log(this.state.addressList.length);
            if (address.isDefault === 1) {
              if (this.state.addressList.length === 1) {
                //最后一个地址被删除
                this.getAddressList();
              } else {
                this.onChangeAddress(this.state.addressList[1], 'delete');
              }
            } else {
              this.getAddressList();
            }
          }
        })
        .catch((err) => {
          Taro.showToast({
            title: err,
            icon: 'none',
          });
        });
    }
  };

  /**
   * 获取地址列表
   */
  getAddressList = () => {
    const { from } = this.state;
    console.log('from', from);
    let params = {};
    if (from === 'index') {
      params = {
        source: 1,
      };
    } else if (from === 'user') {
      params = {
        source: 2,
      };
    }
    getAddressList(params)
      .then((res) => {
        if (res && res.success) {
          this.setState(
            {
              addressList:
                from === 'cart' || from === 'order'
                  ? getReadlyAddressList(res.addressInfos).aList
                  : res.addressInfos,
              loadFlag: false,
              failAddressList:
                from === 'cart' || from === 'order'
                  ? getReadlyAddressList(res.addressInfos).bList
                  : [],
              showAddressList: true,
              beforeFilterAddressNum: res.beforeFilterAddressNum
                ? res.beforeFilterAddressNum
                : '',
              baseAddressNum: res.baseAddressNum ? res.baseAddressNum : '',
            },
            () => {
              if (this.state.ads === '1' && Taro.getStorageSync('ads') !== 2) {
                Taro.setStorageSync('ads', 2);

                this.state.addressList &&
                  this.state.addressList.length > 0 &&
                  this.state.addressList.forEach((val) => {
                    if (val.isDefault === 1) {
                      this.edit(val);
                    }
                  });
              }
              this.defaultCompareToPosition();
            }
          );
        } else {
          this.setState({
            loadFlag: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          loadFlag: false,
        });
      });
  };

  onChangeAddress = (info, str) => {
    if (this.state.from === 'user') return;
    console.log('onChangeAddress', info);
    const { skuIds } = this.state;
    const data = {
      skuIds:
        getSkuList(skuIds) && getSkuList(skuIds).length > 0
          ? getSkuList(skuIds)
          : null,
      nowBuy: '',
      addressId: info.addressId,
      lat: info.lat,
      lon: info.lon,
    };
    // changeAddress(data)
    getChangeAddressService(data)
      .then((res) => {
        console.log('【7fresh.platform.user.address.change】:', res);
        if (res && res.success) {
          if (!res.valid) {
            Taro.showToast({
              title: res.invalidTip,
              icon: 'none',
            });
            return;
          }
          const tenantShopInfo = res.tenantShopInfo;
          this.setState(
            {
              tenantShopInfo: tenantShopInfo,
              currentChooseAddress: info,
            },
            () => {
              console.log('tenantShopInfo', tenantShopInfo);
              let lbsData = this.state.lbsData;
              const length = tenantShopInfo && tenantShopInfo.length;
              if (length === 1 && tenantShopInfo) {
                //让用户无感知，直接切换
                this.onSwitch(
                  {
                    ...info,
                    ...tenantShopInfo[0],
                    tenantId: tenantShopInfo[0].tenantId,
                    lat: info.lat,
                    lon: info.lon,
                  },
                  0,
                  str,
                  {
                    fix: res.fix || false,
                  }
                );
                if (
                  lbsData.storeId !== tenantShopInfo[0].storeId &&
                  tenantShopInfo[0].storeName
                ) {
                  Taro.setStorageSync('changeAddressToast', 1);
                }
                return;
              }

              let isExist = false;
              if (lbsData && lbsData !== {}) {
                for (let i = 0; i < tenantShopInfo.length > 0; i++) {
                  if (tenantShopInfo[i].storeId === lbsData.storeId) {
                    isExist = true;
                    this.onSwitch(
                      {
                        ...info,
                        ...tenantShopInfo[i],
                        tenantId: tenantShopInfo[i].tenantId,
                        lat: info.lat,
                        lon: info.lon,
                      },
                      i,
                      str,
                      {
                        fix: res.fix || false,
                      }
                    );
                    break;
                  }
                }
              }

              if (isExist === false && length > 1) {
                //弹多租户切换弹框
                this.setState({
                  switchShopFlag: true,
                });
              }
            }
          );
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none',
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onClose = () => {
    this.setState({
      switchTenantFlag: false,
    });
  };

  onSwitch = (info, index, str, obj) => {
    console.log('***', info, index);
    this.setAddrInfo(info, index || 0, str, obj);
  };

  //地址信息存入SessionStorage
  setAddrInfo = (info, index, str, obj) => {
    const addrInfo = info; //当前选择的地址
    const tenant = this.state.tenantShopInfo;

    if (tenant && tenant.length > 0) {
      for (let i = 0; i < tenant.length; i++) {
        if (i === Number(index)) {
          tenant[index].isSelected = true;
          addrInfo.tenantInfo = tenant[index].tenantInfo;
          addrInfo.tenantId = tenant[index].tenantInfo.tenantId;
          addrInfo.storeName = tenant[index].storeName;
          addrInfo.storeId = tenant[index].storeId;
          addrInfo.coord = [info.lat, info.lon];
        } else {
          tenant[i].isSelected = false;
        }
      }
    } else {
      addrInfo.addressSummary = addrInfo.storeAddress;
      addrInfo.addressExt = addrInfo.storeAddress;
      addrInfo.fullAddress = addrInfo.storeAddress;
      addrInfo.detailAddress = addrInfo.storeAddress;
      addrInfo.sendTo = addrInfo.storeName;
      addrInfo.where = addrInfo.storeAddress;
      addrInfo.addressId = -1;
    }
    saveAddrInfo(addrInfo, tenant, obj);

    if (str !== 'delete') {
      Taro.switchTab({
        url: `/pages/index/index`,
      });
    } else {
      this.setState(
        {
          lbsData: Taro.getStorageSync('addressInfo') || {},
        },
        () => {
          this.getAddressList();
        }
      );
    }
  };

  //弹框关闭
  onShopClose = (info, index) => {
    const { currentChooseAddress, tenantShopInfo } = this.state;
    this.setState(
      {
        switchShopFlag: false,
      },
      () => {
        this.setAddrInfo(
          {
            ...currentChooseAddress,
            ...tenantShopInfo[index],
            tenantId: tenantShopInfo[index].tenantId,
            lat: currentChooseAddress.lat,
            lon: currentChooseAddress.lon,
          },
          index,
          'close'
        );
      }
    );
  };

  onChooseAddress = () => {
    const { lat, lon } = this.state;
    Taro.navigateTo({
      url: `/pages/address/search/index?latitude=${lat}&longitude=${lon}`,
    });
  };

  render() {
    const {
      from,
      closeFlag,
      position,
      addressList,
      failAddressList,
      switchTenantFlag,
      tenantShopInfo,
      isMatchPosition,
      showModal,
      isLoad,
      switchShopFlag,
      notLogin,
      showAddressList,
    } = this.state;
    let tip = '';
    if (from !== 'user' && isMatchPosition && addressList.length !== 0) {
      tip =
        (addressList.filter((item) => item.isDefault === 1) &&
          addressList.filter((item) => item.isDefault === 1)[0] &&
          addressList.filter((item) => item.isDefault === 1)[0].addressExt) ||
        '';
    }
    if (Taro.getStorageSync('addressInfo')) {
      tip = Taro.getStorageSync('addressInfo').addressExt || tip;
    }
    return (
      <View className='addr-container'>
        <RpxLine />
        <ScrollView
          className=''
          scrollY
          style={`height:${this.state.screenHeight}px;`}
        >
          {from === 'index' && closeFlag && (
            <View className='address-tip-modal'>
              <AddressTo
                tip={
                  (position &&
                    position !== '定位服务未开启' &&
                    position !== '定位失败' &&
                    position !== '定位中...') ||
                  tip
                    ? `送至：${tip || position}`
                    : position
                }
                onClick={this.getSetting.bind(this)}
              />
            </View>
          )}
          {from === 'index' && (
            <View className='address-content'>
              <View className='litter-title-position'>当前定位</View>
              <AddressPosition
                position={position}
                onClick={this.getCurPosition.bind(this)} // 点击当前定位地址切换
                onGetPosition={this.getLocation.bind(this)} // 重新定位
                onChooseAddress={this.onChooseAddress.bind(this)} // 附近地址
                styleColor={
                  position &&
                  (position === '定位服务未开启' || position === '定位失败')
                }
              />
              <View className='litter-title-address'>我的收货地址</View>
              {notLogin && <AddressLogin onClick={this.gotoLogin.bind(this)} />}
            </View>
          )}

          {from === 'index' &&
            ((addressList && addressList.length === 0 && showAddressList) ||
              (!addressList && showAddressList)) && (
              <View className='address-not-setting'>您还没有设置收货地址</View>
            )}
          {addressList &&
            addressList.length > 0 &&
            addressList.map((item, index) => {
              return (
                <View className='list-address' key={index}>
                  <View className='list-cont'>
                    <p-swipeout
                      actions={this.state.actions}
                      unclosable={false}
                      onchange={this.delete.bind(this, item)}
                    >
                      <View className='item-page' slot='content'>
                        <View className='item-cont'>
                          <Image
                            onClick={this.onChangeAddress.bind(this, item)}
                            style={`display:${
                              item.isDefault === 1 &&
                              from !== 'user' &&
                              isMatchPosition
                                ? 'block'
                                : 'none'
                            }`}
                            className='address-choose'
                            src={imageList.blueOk}
                          />
                          <View
                            onClick={this.onChangeAddress.bind(this, item)}
                            className={
                              item.isDefault === 1 &&
                              from !== 'user' &&
                              isMatchPosition
                                ? `main main-current`
                                : `main`
                            }
                          >
                            <View class='top'>
                              <View class='pr20'>
                                {filterDescription(item.userName, 7)}
                              </View>
                              <View class='pr20 mobile'>{item.mobile}</View>
                              {item.tagName && (
                                <Text className='tag-name'>{item.tagName}</Text>
                              )}
                            </View>
                            <View className='bottom'>
                              {item.addressSummary == 'undefined' ||
                              item.addressSummary == undefined
                                ? ''
                                : item.addressSummary}
                              {item.addressExt}
                              {item.where}
                            </View>
                          </View>
                          <Image
                            onClick={this.edit.bind(this, item)}
                            className='address-edit'
                            src={imageList.addressEdit}
                          />
                        </View>
                        <View style={{ padding: '0 20px' }}>
                          <RpxLine />
                        </View>
                      </View>
                    </p-swipeout>
                  </View>
                </View>
              );
            })}

          {failAddressList && failAddressList.length > 0 && (
            <View className='fail-list'>
              <View className='title'>
                <Image
                  src='//m.360buyimg.com/img/jfs/t1/80554/12/5898/1418/5d417369Ecdcab63f/d0ab262d4b3261cd.png'
                  alt='七鲜'
                  className='fail-pic'
                />
                <Text>部分商品不支持配送至以下收货地址</Text>
              </View>
            </View>
          )}

          {failAddressList &&
            failAddressList.length > 0 &&
            failAddressList.map((item, index) => {
              return (
                <View className='list-address' key={index}>
                  <View className='list-cont'>
                    <p-swipeout
                      actions={this.state.actions}
                      unclosable={false}
                      onchange={this.delete.bind(this, item)}
                    >
                      <View className='item-page' slot='content'>
                        <View className='item-cont'>
                          <View className='main'>
                            <View class='grey-top'>
                              <View class='pr20'>
                                {' '}
                                {filterDescription(item.userName, 7)}
                              </View>
                              <View class='pr20'>{item.mobile}</View>
                              {item.tagName && (
                                <Text className='tag-name'>{item.tagName}</Text>
                              )}
                            </View>
                            <View className='bottom'>
                              {item.addressSummary == 'undefined' ||
                              item.addressSummary == undefined
                                ? ''
                                : item.addressSummary}
                              {item.addressExt}
                              {item.where}
                            </View>
                          </View>
                          <Image
                            onClick={this.edit.bind(this, item)}
                            className='address-edit'
                            src={imageList.addressEdit}
                          />
                        </View>
                      </View>
                    </p-swipeout>
                  </View>
                  <RpxLine />
                </View>
              );
            })}

          {from !== 'index' &&
            from !== 'user' &&
            addressList.length === 0 &&
            failAddressList.length === 0 &&
            !isLoad && <AddressNone onClick={this.create} />}
        </ScrollView>

        <View className='createBtn' onClick={this.create}>
          新增收货地址
        </View>

        {this.state.loadFlag && <Loading />}

        {/** 切换弹框 */}
        <SwitchAddressModal
          name='当前操作需切换门店至'
          data={tenantShopInfo && tenantShopInfo[0]}
          show={switchTenantFlag}
          onSwitch={this.onSwitch.bind(this)}
          onClose={this.onClose.bind(this)}
        />

        {/* 切多个门店 */}
        <SwitchShopModal
          name='当前地址有多个门店可选'
          shopList={tenantShopInfo}
          show={switchShopFlag}
          onSwitch={this.onSwitch.bind(this)}
          onClose={this.onShopClose.bind(this)}
        />

        {showModal && (
          <Modal
            content='为了更好地匹配地理位置，请允许七鲜使用您的地理位置'
            onSetting={this.openSetting.bind(this)}
            show={showModal}
          />
        )}
      </View>
    );
  }
}
