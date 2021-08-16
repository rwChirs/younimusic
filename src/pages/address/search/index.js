import Taro from '@tarojs/taro';
import { View, Image, Text, Input } from '@tarojs/components';
import { getAreastoreNearby } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';

import './index.scss';
import RpxLine from '../../../components/rpx-line';
import { imageList } from '../image';
import { throttle } from '../../../utils/common/utils';
import Modal from '../../../components/modal';
import { exportPoint } from '../../../utils/common/exportPoint';

export default class AddressSearch extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      keyword: '',
      showModal: false,
      needPage: false,
    };
  }
  page = 1;
  pageSize = 20;

  componentWillMount() {
    this.searchKeyword();
    this.getSetting();
    exportPoint(this.$router);
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  /**
   * 取消
   */
  onCancel = () => {
    Taro.navigateBack();
  };

  selectAddress = (addr) => {
    console.log(addr);
    if (addr.supportDelivery) {
      Taro.setStorageSync('selectedAddress', {
        ...addr,
        addressExt: addr.title,
      });
      Taro.navigateBack();
    } else {
      Taro.showToast({
        title: '该地址不在配送范围内，请选择其它地址',
        icon: 'none',
      });
    }
  };

  bindKeyInput = (e) => {
    this.setState(
      {
        keyword: e.currentTarget.value,
      },
      () => {
        this.page = 1;
        this.searchKeyword();
      }
    );
  };

  searchKeyword = () => {
    let addressInfo = Taro.getStorageSync('addressInfo');
    getAreastoreNearby({
      keyword: this.state.keyword,
      city: this.state.keyword ? '北京市' : '',
      searchBy: this.state.keyword ? 1 : 2,
      pageNo: this.page,
      pageSize: this.pageSize,
      lat: addressInfo.lat,
      lon: addressInfo.lon,
    })
      .then((res) => {
        let addressList =
          (res && res.addressInfoList && this.page > 1
            ? this.state.addressList.concat(res.addressInfoList)
            : res.addressInfoList) || [];
        this.setState({
          addressList,
          needPage: res.needPage,
        });
      })
      .catch((err) => {
        console.log('AddressSearch -> searchKeyword -> err', err);
      });
    // searchKeyword({ keyword: this.state.keyword })
    //   .then(res => {
    //     this.setState({ addressList: res });
    //   })
    //   .catch(err => {
    //     if (err.status === 1000) {
    //       Taro.authorize({
    //         scope: 'scope.userLocation',
    //       })
    //         .then(() => {
    //           this.searchKeyword();
    //         })
    //         .catch(err1 => {
    //           console.log(err1);
    //           this.setState({
    //             showModal: true,
    //           });
    //         });
    //     }
    //     console.log(err);
    //   });
  };

  onReachBottom() {
    // if (this.getListing) return;
    // const { tabId } = this.state;

    if (this.state.needPage) {
      this.page += 1;
      this.setState(
        {
          loadingData: true,
        },
        () => {
          this.searchKeyword();
        }
      );
    }
  }

  getSetting = () => {
    let obj = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
          })
            .then((resp) => {
              console.log('scope.userLocation success', resp);
            })
            .catch((err) => {
              console.log('scope.userLocation error', err);
              obj.setState({
                showModal: true,
              });
            });
        }
      },
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

  handleInput = throttle(this.bindKeyInput.bind(this), 500);

  render() {
    return (
      <View className='choose-address'>
        <View className='search-container'>
          <View className='search-header'>
            <View className='search-bar'>
              <Image className='search-icon' src={imageList.searchIcon} />
              <Input
                type='text'
                className='search-input'
                placeholder='搜索小区/写字楼/学校等'
                placeholderClass='text-placeholder'
                onInput={this.handleInput}
              />
            </View>
            <Text className='search-cancel' onClick={this.onCancel}>
              取消
            </Text>
          </View>
          <RpxLine />
        </View>
        <View className='search-result'>
          {this.state.addressList.map((addr, index) => {
            return (
              <View
                className='search-li'
                onClick={this.selectAddress.bind(this, addr)}
                key={index}
              >
                <View
                  className={addr.supportDelivery ? `item` : `item disabled`}
                >
                  <View className='title'>
                    {index === 0 && !this.state.keyword && (
                      <Text>[当前位置]</Text>
                    )}
                    <Text>{addr.title}</Text>
                  </View>
                  <View className='address'>{addr.address}</View>
                </View>
                <RpxLine />
              </View>
            );
          })}
        </View>
        {this.state.showModal && (
          <Modal
            content='为了更好地匹配地理位置，请允许七鲜使用您的地理位置'
            onSetting={this.openSetting}
            show={this.state.showModal}
          />
        )}
      </View>
    );
  }
}
