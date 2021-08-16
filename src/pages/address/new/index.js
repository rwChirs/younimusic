import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, Input } from '@tarojs/components';
import {
  getChangeAddressService,
  getUserAddressTags,
  userAddressUpdate,
  userAddressSave,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import './index.scss';
import RpxLine from '../../../components/rpx-line';
import { imageList } from '../image';
import SwitchShopModal from '../../../components/switch-shop-modal';
import BaseModal from '../../../components/base-modal';
import { saveAddrInfo } from '../../../utils/common/getUserStoreInfo';
import { exportPoint } from '../../../utils/common/exportPoint';
import utils from '../../login/util';
import { checkTel } from '../../../utils/utils';
// import { px2vw } from '../../../utils/common/utils';

export default class AddressNew extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: null,
      userName: '',
      mobile: '',
      where: '',
      addressId: '',
      type: 'new',
      from: getCurrentInstance().router.params.from || '',
      tagKey: '',
      selectedAddress: {
        addressSummary: '',
        addressExt: '',
        detail: '',
        brief: '',
        storeId: '',
        lon: '',
        lat: '',
      },
      firstLoaded: true,
      labelTip: [],
      current: '',
      source: getCurrentInstance().router.params.source || [],
      skuId: getCurrentInstance().router.params.skuId || [],
      nowBuy: getCurrentInstance().router.params.nowBuy || '',
      isSelfTakeOrder: getCurrentInstance().router.params.isSelfTakeOrder || '',
      ads: getCurrentInstance().router.params.ads || '',
      switchShopFlag: false,
      tenantShopInfo: {},
      lbsData: Taro.getStorageSync('addressInfo') || {},
      BaseModalData: {},
      showBaseModal: false,
      forceAdd: false,
    };
  }

  config = {
    navigationBarTitleText: '新建地址',
  };

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    const option = getCurrentInstance().router.params;
    this.setState(
      {
        from: option.from,
        activityId: option && option.activityId,
        addressId: option.addressId,
        joinType: option.joinType,
        skuId: option.skuId,
        storeId: option.storeId,
        grouponId: option.grouponId,
        option: option,
        tagKey: option.tagKey,
      },
      () => {
        console.log(this.state.from);
        this.getTags();
      }
    );
    Taro.setStorageSync('selectedAddress', '');
    if (option && option.type === 'edit') {
      Taro.setNavigationBarTitle({
        title: '修改地址',
      });
      this.setState(
        {
          userName: option.userName,
          mobile: option.mobile,
          addressId: option.addressId,
          selectedAddress: {
            addressSummary: option.addressSummary,
            addressExt: option.addressExt,
            detail: option.addressExt,
            brief: option.addressExt,
            storeId: option.storeId,
            lon: option.longitude,
            lat: option.latitude,
          },
          where: option.where,
          type: option.type,
        },
        () => {
          Taro.setStorageSync('selectedAddress', this.state.selectedAddress);
        }
      );
    } else {
      this.setState({
        selectedAddress: {},
      });
    }
  }

  componentDidShow() {
    if (!this.state.firstLoaded) {
      this.setState({
        selectedAddress: Taro.getStorageSync('selectedAddress'),
      });
    } else {
      this.setState({
        firstLoaded: false,
      });
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getTags = () => {
    //请求tag标签数据
    const tagKey = this.state.tagKey;
    getUserAddressTags()
      .then((res) => {
        console.log('【7fresh.user.address.getTags】:', res);
        if (res && res.success) {
          this.setState({
            labelTip: res.tags,
          });
          if (res.tags.length > 0) {
            for (let i in res.tags) {
              if (res && res.tags && res.tags[i].key === tagKey) {
                this.setState(
                  {
                    current: parseInt(i),
                  },
                  () => {
                    console.log(this.state.current);
                  }
                );
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bindUserNameInput = (e) => {
    this.setState({
      userName: e.detail.value,
    });
  };

  bindMobileInput = (e) => {
    // let mobile = '';
    // if (e.detail.value.length == 11) {
    //   mobile = e.detail.value;
    // }
    this.setState({
      mobile: e.detail.value,
    });
  };

  bindAddressInput = (e) => {
    this.setState({
      where: e.detail.value,
    });
  };

  codeConvert = (str) => {
    if (str && typeof str == 'string') {
      return str
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  };

  saveBtn = () => {
    const {
      userName,
      mobile,
      selectedAddress,
      where,
      labelTip,
      current,
      skuId,
      nowBuy,
      isSelfTakeOrder,
      forceAdd,
    } = this.state;
    console.log(this.state);
    // 读取编辑前存放在storage里的地址信息
    const addressDetail = Taro.getStorageSync('addressDetailForCheck') || {};
    if (userName === '') {
      Taro.showToast({
        title: '请输入收货人',
        icon: 'none',
      });
      return false;
    }
    if (mobile === '') {
      Taro.showToast({
        title: '请输入手机号码',
        icon: 'none',
      });
      return false;
    }
    // 参考H5的实现当保存时判断手机号如果未编辑过，则跳过手机号正则验证
    if (
      !(
        addressDetail &&
        addressDetail.mobile &&
        mobile === addressDetail.mobile
      )
    ) {
      if (mobile && !checkTel(mobile)) {
        Taro.showToast({
          title: '请正确填写手机号',
          icon: 'none',
        });
        return false;
      }
    }
    // if (mobile && !checkTel(mobile)) {
    //   Taro.showToast({
    //     title: '请正确填写手机号',
    //     icon: 'none',
    //   });
    //   return false;
    // }
    if (selectedAddress.addressExt === '') {
      Taro.showToast({
        title: '请选择收货地址',
        icon: 'none',
      });
      return false;
    }
    if (where === '') {
      Taro.showToast({
        title: '请输入楼号门牌号',
        icon: 'none',
      });
      return false;
    }

    let params = {
      userName: this.codeConvert(userName),
      mobile: this.codeConvert(mobile),
      tagKey: current ? labelTip[current].key : '',
      addressExt: selectedAddress.addressExt,
      where: this.codeConvert(where),
      addressSummary: selectedAddress.addressSummary || '',
      isDefault: true,
      lat: selectedAddress.lat || '',
      lon: selectedAddress.lon || '',
      source: '',
      skuIds: Number(skuId) > 0 ? [skuId] : [],
      nowBuy: nowBuy,
      useSelfTake: isSelfTakeOrder === 'true' ? true : false,
      forceAdd,
    };

    if (this.state.type === 'edit') {
      params.addressId = this.state.addressId;
    }
    this.editAddress(params, this.state.type)
      .then((res) => {
        if (res && res.success) {
          Taro.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000,
          });
        }

        //保存地址后 changeAddress后更新默认地址
        const data = {
          skuIds:
            params.skuIds && params.skuIds.length > 0 ? params.skuIds : null,
          nowBuy: params.nowBuy,
          addressId:
            this.state.type === 'edit' ? this.state.addressId : res.addressId,
          lat: params.lat,
          lon: params.lon,
          useSelfTake: isSelfTakeOrder === 'true' ? true : false,
        };
        getChangeAddressService(data)
          .then((result) => {
            if (result && result.success) {
              if (!result.valid) {
                Taro.showToast({
                  title: result.invalidTip,
                  icon: 'none',
                });
                return;
              }
              const tenantShopInfo = result.tenantShopInfo;
              this.setState(
                {
                  tenantShopInfo: tenantShopInfo,
                  addressId: data.addressId,
                },
                () => {
                  const length =
                    tenantShopInfo && tenantShopInfo.length
                      ? tenantShopInfo.length
                      : 0;
                  let lbsData = this.state.lbsData;
                  if (length === 1) {
                    this.onSwitch(tenantShopInfo && tenantShopInfo[0], 0);
                    if (lbsData.storeId !== tenantShopInfo[0].storeId) {
                      Taro.setStorageSync('changeAddressToast', 1);
                      // Taro.showToast({
                      //   title: `为您切换至${tenantShopInfo[0].storeName}店铺`,
                      //   icon: 'none',
                      // });
                    }
                  } else {
                    let isExist = false;
                    if (lbsData && lbsData !== '{}') {
                      for (let i = 0; i < tenantShopInfo.length > 0; i++) {
                        if (tenantShopInfo[i].storeId === lbsData.storeId) {
                          isExist = true;
                          this.onSwitch(tenantShopInfo[i], i);
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
                }
              );
            } else {
              Taro.showToast({
                title: result.msg,
                duration: 2000,
              });
            }
          })
          .catch(() => {});
      })
      .catch((err) => {
        if (err.code === '3') {
          utils.redirectToLogin('/pages/address/new/index', 'redirectTo');
          return;
        }
        if (err.boundErrorCode !== 1009 && err.boundErrorCode !== 1010) {
          Taro.showToast({
            title: err.msg,
            icon: 'none',
          });
          return;
        }
        this.setState({
          showBaseModal: true,
          BaseModalData: {
            title: err.toastTitle || '',
            content: err.msg,
            onOkText: '去修改',
            onCancelText: '继续保存',
            showCancelBtn: err.boundErrorCode === 1009,
          },
        });
      });
  };

  editAddress = (params, type = 'edit') => {
    return type === 'edit'
      ? userAddressUpdate(JSON.stringify(params)).then((res) => {
          return new Promise((resolve, reject) => {
            if (res.success) {
              resolve(res);
            } else {
              reject(res);
            }
          });
        })
      : userAddressSave(JSON.stringify(params)).then((res) => {
          return new Promise((resolve, reject) => {
            if (res.success) {
              resolve(res);
            } else {
              reject(res);
            }
          });
        });
  };

  //切换地址
  onSwitch = (info, index) => {
    console.log('***', info, index);
    this.setAddrInfo(info, index || 0);
  };

  //地址信息存入SessionStorage
  setAddrInfo = (info, index) => {
    const { selectedAddress, tenantShopInfo, where, addressId } = this.state;

    const addrInfo = {
      addressExt: selectedAddress.addressExt,
      addressId: addressId,
      fullAddress: selectedAddress.addressExt,
      addressSummary: selectedAddress.addressSummary,
      where: where,
      lat: selectedAddress.lat,
      lon: selectedAddress.lon,
      tenantInfo: info.tenantInfo,
      storeName: info.storeName,
      tenantId: (info && info.tenantInfo && info.tenantInfo.tenantId) || 1,
      storeId: info.storeId,
    };

    if (tenantShopInfo && tenantShopInfo.length > 0) {
      for (let i = 0; i < tenantShopInfo.length; i++) {
        if (i === Number(index)) {
          tenantShopInfo[index].isSelected = true;
        } else {
          tenantShopInfo[i].isSelected = false;
        }
      }
    }

    saveAddrInfo(addrInfo, tenantShopInfo);

    if (this.state.switchTenantFlag) {
      this.setState({
        switchTenantFlag: false,
      });
    } else {
      Taro.setStorageSync('createAddress', 1);
      if (!!this.state.ads) {
        Taro.switchTab({
          url: '/pages/index/index',
        });
      } else {
        Taro.navigateBack();
      }
    }
  };

  chooseTip = (index) => {
    this.setState({
      current: index,
    });
  };

  onCancel = (item) => {
    console.log(item);
    this.setState(
      {
        forceAdd: true,
        showBaseModal: false,
      },
      () => {
        this.saveBtn();
      }
    );
  };

  onOk = (item) => {
    console.log(item);
    this.setState({
      showBaseModal: false,
    });
  };

  onShopSwitch = (info, index, str) => {
    console.log(info, index);
    this.setAddrInfo(info, index || 0, str);
  };

  onShopClose = (info, index) => {
    this.setState(
      {
        switchShopFlag: false,
      },
      () => {
        this.setAddrInfo(info, index);
      }
    );
  };

  /**
   * 选择收货地址
   */
  onChooseAddress = () => {
    const { lat, lon } = this.state.selectedAddress;
    Taro.navigateTo({
      url: `/pages/address/search/index?latitude=${lat}&longitude=${lon}`,
    });
  };

  render() {
    const {
      switchShopFlag,
      tenantShopInfo,
      BaseModalData,
      showBaseModal,
      type,
    } = this.state;
    return (
      <View className='new-address'>
        <View className='new-edit'>
          <View className='edit-list'>
            <Text>收货人：</Text>
            <Input
              maxlength='16'
              value={this.state.userName}
              onInput={this.bindUserNameInput.bind(this)}
              placeholder='收货人姓名'
              placeholderClass='text-placeholder'
              disabled={switchShopFlag || showBaseModal}
            />
          </View>
          <RpxLine />
          <View className='edit-list'>
            <Text>联系电话：</Text>
            <Input
              type='number'
              maxlength='11'
              value={this.state.mobile}
              onInput={this.bindMobileInput.bind(this)}
              placeholder='配送员联系您的电话'
              placeholderClass='text-placeholder'
              disabled={switchShopFlag || showBaseModal}
            />
          </View>
          <RpxLine />
          <View
            className='edit-list'
            style={{
              height: type === 'edit' ? '86rpx' : '100rpx',
              lineHeight: type === 'edit' ? 'auto' : '100rpx',
            }}
            onClick={this.onChooseAddress.bind(this)}
          >
            <Text>收货地址：</Text>
            <Text className='choose-address'>
              {this.state.selectedAddress.addressExt && (
                <Text className='address-ext'>
                  {this.state.selectedAddress.addressExt}
                </Text>
              )}
              {!this.state.selectedAddress.addressExt && (
                <Text className='placeholder'>小区/写字楼/学校</Text>
              )}
            </Text>
            <Image className='address-right-icon' src={imageList.moreIcon} />
          </View>

          {type === 'edit' && (
            <View className='cell-bottom'>
              <Image
                src='https://m.360buyimg.com/img/jfs/t1/182042/31/6167/981/60af3c9eE4451fa5c/c962a98391eaf1b8.png'
                className='cell-bottom-img'
                alt='七鲜'
              />
              <View className='cell-bottom-text'>
                温馨提示：修改地址时请重新定位选择收货地址
              </View>
            </View>
          )}
          <RpxLine />
          <View className='edit-list'>
            <Text>楼号门牌：</Text>
            <Input
              placeholder='例如：A座909室'
              value={this.state.where}
              placeholderClass='text-placeholder'
              onInput={this.bindAddressInput.bind(this)}
              disabled={switchShopFlag || showBaseModal}
            />
          </View>
          <View className='edit-list'>
            <Text>标签：</Text>
            <View className='address-o'>
              {this.state.labelTip &&
                this.state.labelTip.map((info, index) => {
                  return (
                    <Text
                      className={
                        index === this.state.current
                          ? 'label-tip current'
                          : 'label-tip'
                      }
                      key={index}
                      onClick={this.chooseTip.bind(this, index)}
                    >
                      {info.name}
                    </Text>
                  );
                })}
            </View>
          </View>
        </View>
        <View className='saveBtn' onClick={this.saveBtn.bind(this)}>
          保存
        </View>

        {/* 保存地址弹窗 */}
        <BaseModal
          data={BaseModalData}
          show={showBaseModal}
          onOk={this.onOk.bind(this)}
          onCancel={this.onCancel.bind(this)}
        />

        {/* 切多个门店 */}
        <SwitchShopModal
          name='当前地址有多个门店可选'
          shopList={tenantShopInfo}
          show={switchShopFlag}
          onSwitch={this.onShopSwitch.bind(this)}
          onClose={this.onShopClose.bind(this)}
        />
      </View>
    );
  }
}
