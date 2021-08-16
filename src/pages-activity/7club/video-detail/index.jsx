import Taro,{getCurrentInstance} from '@tarojs/taro';
import {
  getCartNum,
  addCart,
  changeClubCollect,
  getClubContentDetail,
} from '@7fresh/api';

import { View } from '@tarojs/components';
import NavBar from '../../../components/nav-bar';
import NoneDataPage from '../../../components/none-data-page';
import './index.scss';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import VideoContent from '../components/video-content/index';
import ClubPageBottom from '../components/club-page-bottom/index';
import VideoText from '../components/video-text';
import VideoControl from '../components/video-control';
import AlertDialog from '../components/alert-dialog';
import FloorAddCart from '../../../components/floor-add-cart';
import PartScreenVideo from './part-screen-video';
import {
  getUserStoreInfo,
  utils,
  goCart,
  goBillDetail,
  goProDetail,
  getShareImage,
  get7clubPath,
  logClick,
  exportPoint,
  isLogined,
} from '../utils';
import {
  VD_CART,
  VD_LIKE,
  VD_PLAY_CONTENT,
  VD_PRODUCT,
  VD_SHARE,
} from '../reportPoints';

export default class VideoDetail extends CommonPageComponent {

  constructor(props) {
    super(props);
    this.state = {
      storeId: '',
      contentId: '',
      contentType: '',
      showVideoControl: false,
      addCartPopData: '',
      data: {},
      isLoading: true,
      suportNavCustom: true,
      showBackClub: false,
    };
  }

  componentWillMount() {
    //目前小程序不支持视频播放、所以先文案提示
    Taro.showModal({
      title: '提示',
      content: '小程序暂不支持视频播放',
      showCancel: false,
      success() {
        Taro.switchTab({
          url: '/pages/center-tab-page/index',
        });
      },
    });
    return;

    const routerParams = getCurrentInstance().router.params || {};
    // console.log('======7club视频详情页面参数========', routerParams);
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          suportNavCustom: res.version.split('.')[0] >= 7,
        });
        if (res.version.split('.')[0] < 7) {
          Taro.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
          });
        }
      },
    });
    this.setState(
      {
        contentId: routerParams.contentId || 0,
        contentType: routerParams.contentType,
        showBackClub: Taro.getCurrentPages().length <= 1,
      },
      () => {
        this.getStoreId();
      }
    );
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getStoreId = () => {
    const { storeId = '', lat = '', lon = '' } = getCurrentInstance().router.params;

    //三公里定位
    getUserStoreInfo(storeId, lon, lat, '', 3)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId || 131229,
          },
          () => {
            this.initData();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * 检查是否登录
   */
  checkIsLogin = () => {
    return isLogined();
  };

  initData = () => {
    this.getDetailData();
    this.getCartNum();
  };

  //绑定子组件
  onRef = ref => {
    this.refAlertDialog = ref;
  };

  //获取详情数据
  getDetailData = () => {
    const { storeId } = this.state;
    const params = {
      contentId: this.state.contentId,
      contentType: this.state.contentType,
      storeId,
    };
    this.setState({
      isLoading: true,
    });
    getClubContentDetail(storeId, params)
      .then(res => {
        this.setState({
          isLoading: false,
        });
        if (res.success && res.clubDetailInfo) {
          this.setState({
            data: res,
          });
          if (res.clubDetailInfo.title) {
            Taro.setNavigationBarTitle({
              title: res.clubDetailInfo.title,
            });
          }
        } else {
          Taro.showToast({
            title: res.msg || '请求数据失败',
            icon: 'none',
          });
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        Taro.showToast({
          title: err.msg || '请求数据失败',
          icon: 'none',
        });
      });
  };

  //获取购物车数量
  getCartNum = () => {
    getCartNum().then(res => {
      this.setState({
        cartNum: (res && res.allCartWaresNumber) || 0,
      });
    });
  };

  //是否展示视频控制条
  toggleShow = () => {
    logClick({ eid: VD_PLAY_CONTENT });
    this.setState({
      showVideoControl: !this.state.showVideoControl,
    });
  };

  closeAlertDialog = () => {};

  onCollection = option => {
    // console.log('onCollection', option);
    logClick({ eid: VD_LIKE });
    if (!this.checkIsLogin()) {
      utils.gotoLogin(
        `/pages-activity/7club/video-detail/index?contentId=${this.state.contentId}&contentType=${this.state.contentType}`,
        'redirectTo'
      );
      return;
    }
    if (this.changeCollecting) return;
    const params = {
      contentId: option.contentId,
      contentType: option.contentType,
      opType: option.collect ? 5 : 3,
    };
    this.changeCollecting = true;
    changeClubCollect(this.state.storeId, params)
      .then(res => {
        this.changeCollecting = false;
        if (res.success) {
          Taro.showToast({
            title: option.collect ? '取消收藏' : '收藏成功',
            icon: 'none',
          });
          // this.initData();
          let data = this.state.data;
          data.clubDetailInfo.collect = !option.collect;
          data.clubDetailInfo.collectCount = res.collectSum;
          this.setState({
            data,
          });

          // console.log(res, 'COLLECT ACTION SUCCESS ');
          // 收藏成功后，拿到收藏总数，最新的收藏状态
        }
      })
      .catch(err => {
        this.changeCollecting = false;
        console.log('7club收藏-err', err);
      });
  };

  showDialog = () => {
    // console.log('showDialog');
    logClick({ eid: VD_PRODUCT });
    // Taro.eventCenter.trigger("show7clubProDialog");
    this.refAlertDialog.showDialog();
    Taro.eventCenter.trigger('pause7clubVideo');
  };

  goCart = () => {
    logClick({ eid: VD_CART });
    goCart();
  };

  //加车 是否弹框/直接加车
  onAddCart = option => {
    // console.log('加车', option);
    if (option.isPop === true) {
      this.setState({
        addCartPopData: option,
      });
    } else {
      if (Array.isArray(option)) {
        this._addCart({
          wareInfos: option,
        });
      } else {
        this._addCart({
          wareInfos: {
            skuId: option.skuId,
            buyNum: option.startBuyUnitNum,
            serviceTagId: option.serviceTagId || 0,
          },
        });
      }
    }
  };

  //加车
  _addCart = params => {
    addCart({ data: params })
      .then(res => {
        Taro.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
        });
        this.setState({
          addCartPopData: '',
          cartNum: (res && res.allCartWaresNumber) || 0,
        });
      })
      .catch(err => console.log(err));
  };

  /**
   * 称重商品取消加车
   */
  onCloseAddCartPop = e => {
    if (e && e.stopPropagation) {
      // 防止冒泡
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    this.setState({
      addCartPopData: '',
    });
  };

  onGoProDetail = option => {
    goProDetail(option);
  };
  onGoBillDetail = option => {
    goBillDetail(option);
  };

  onGo7clubDetail = option => {
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  goClubHome = () => {
    Taro.switchTab({
      url: '/pages/center-tab-page/index',
    });
  };
  handleBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      Taro.switchTab({
        url: '/pages/center-tab-page/index',
      });
    }
  };

  // 无数据时点击刷新
  onRefresh = () => {
    this.getStoreId();
  };

  /**
   * 转发事件
   */
  onShareAppMessage() {
    const { data, storeId, contentType, contentId } = this.state;
    logClick({ eid: VD_SHARE, eparam: { contentId } });
    const info = (data && data.clubDetailInfo) || {};
    return {
      title: info.title,
      imageUrl: getShareImage(info),
      path: `/pages-activity/7club/video-detail/index?storeId=${storeId}&contentId=${contentId}&contentType=${contentType}`,
    };
  }

  render() {
    const {
      showVideoControl,
      addCartPopData,
      cartNum,
      data,
      isLoading,
      suportNavCustom,
      showBackClub,
    } = this.state;
    const {
      clubDetailInfo,
      cookBaseInfoList,
      recomendInfoList,
      wareInfoList,
    } = data;
    return (
      <View
        className='video-page'
        style={{ backgroundColor: suportNavCustom ? '#000000' : '#ffffff' }}
      >
        <View>
          {suportNavCustom && (
            <View className='top-cover'>
              <NavBar
                title={clubDetailInfo.title || '7 CLUB'}
                showBack
                onBack={this.handleBack}
              />
            </View>
          )}

          {!isLoading &&
            clubDetailInfo &&
            (suportNavCustom ? (
              <View
                className='video-detail'
                onClick={this.toggleShow.bind(this)}
              >
                <VideoContent videoUrl={clubDetailInfo.videoUrl || ''} />
                <View style={{ display: showVideoControl ? 'none' : 'block' }}>
                  <VideoText
                    styleObj={{ color: '#fff', opacity: 0.7 }}
                    author={(clubDetailInfo && clubDetailInfo.author) || {}}
                    preface={(clubDetailInfo && clubDetailInfo.preface) || ''}
                    label={(clubDetailInfo && clubDetailInfo.tags) || ''}
                  />
                </View>
                {/* <View style={{ display: showVideoControl ? 'block' : 'none' }}> */}
                <View>
                  <VideoControl showPlay={showVideoControl} />
                </View>
              </View>
            ) : (
              <PartScreenVideo
                onGoProDetail={this.onGoProDetail}
                onAddCart={this.onAddCart}
                onGoBillDetail={this.onGoBillDetail}
                onGo7clubDetail={this.onGo7clubDetail}
                data={data}
              />
            ))}

          {!isLoading && !showVideoControl && clubDetailInfo && (
            <View
              className='page-bottom'
              style={{
                backgroundColor: suportNavCustom ? 'unset' : '#ffffff',
              }}
            >
              <ClubPageBottom
                onCollection={this.onCollection}
                onClickRightBtn={this.showDialog}
                onGoCart={this.goCart}
                cartNum={cartNum}
                data={data}
                showShare
                showRightBtn={
                  suportNavCustom &&
                  ((wareInfoList && wareInfoList.length > 0) ||
                    (cookBaseInfoList && cookBaseInfoList.length > 0) ||
                    (recomendInfoList && recomendInfoList.length > 0))
                }
                skin={suportNavCustom ? 'black' : 'white'}
              />
            </View>
          )}

          {!isLoading && !clubDetailInfo && (
            <NoneDataPage
              styleObj={{ paddingTop: '430rpx' }}
              skin='black'
              onRefresh={this.onRefresh}
            />
          )}
          {!suportNavCustom && showBackClub && (
            <View className='right-fixed-area'>
              <View className='to-7club' onClick={this.goClubHome}>
                <View className='hometext'>7CLUB</View>
              </View>
            </View>
          )}
          <FloorAddCart
            show={addCartPopData?true:false}
            data={addCartPopData}
            onAddCart={this.onAddCart}
            onClose={this.onCloseAddCartPop}
          />
          <AlertDialog
            data={data}
            onGoProDetail={this.onGoProDetail}
            onAddCart={this.onAddCart}
            onGoBillDetail={this.onGoBillDetail}
            onGo7clubDetail={this.onGo7clubDetail}
            ref={this.onRef}
          />
        </View>
      </View>
    );
  }
}
