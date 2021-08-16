import Taro,{getCurrentInstance} from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import {
  getCartNum,
  addCart,
  changeClubCollect,
  getClubContentDetail,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import AboutProducts from '../components/about-products';
import AboutBill from '../components/about-bill';
import RecommendEvaluation from '../components/recommend-evaluation';
import ClubPageBottom from '../components/club-page-bottom';
import GoTop from '../../../components/go-top';
import AlertDialog from '../components/alert-dialog';
import FloorAddCart from '../../../components/floor-add-cart';
import NavBar from '../../../components/nav-bar';
import Loading from '../../../components/loading';
import DetailContent from './content';
import NoneDataPage from '../../../components/none-data-page';

import {
  getUserStoreInfo,
  utils,
  filterImg,
  goCart,
  goBillDetail,
  goProDetail,
  getShareImage,
  get7clubPath,
  logClick,
  exportPoint,
  structureLogClick,
  isLogined,
} from '../utils';
import {
  PD_CART,
  PD_SHARE,
  PD_PRODUCT,
  PD_PRO_BTN,
  PD_BILL,
  PD_HOT_RECOM,
  PD_ONE_ADD,
  PRO_ALERT_BILL,
  PRO_ALERT_HOT_RECOM,
  PRO_ALERT_ONE_ADD,
  PRO_ALERT_PRODUCT,
  PRO_ALERT_ADD,
} from '../reportPoints';
import './index.scss';

const app = Taro.getApp().$app;
export default class ClubDtail extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeId: '',
      contentId: '',
      contentType: '',
      showGoTop: false,
      windowHeight: '',
      data: {},
      showBack: false,
      addCartPopData: '',
      cartNum: 0,
      isLoading: true,
      navSkin: 'black',
      suportNavCustom: false, //是否支持自定义导航栏
    };
  }
  isLogin = false;

  componentWillMount() {
    const routerParams = getCurrentInstance().router.params || {};
    console.log('======7club图文详情页面参数========', routerParams);
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        const suportNavCustom = res.version.split('.')[0] >= 7;
        this.setState({
          windowHeight: res.windowHeight || 0,
          suportNavCustom,
        });
        if (!suportNavCustom) {
          Taro.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {
              duration: 400,
              timingFunc: 'easeIn',
            },
          });
        }
      },
    });
    this.setState(
      {
        showBack: Taro.getCurrentPages().length > 1,
        contentId: routerParams.contentId || 0,
        contentType: routerParams.contentType,
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

  //绑定子组件
  onRef = ref => {
    this.refAlertDialog = ref;
  };

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

  initData = loading => {
    this.getData(loading);
    this.getCartNum();
    app.globalData = {
      ...app.globalData,
    };
  };

  //获取详情数据
  getData = loading => {
    const { storeId, contentId, contentType } = this.state;
    if (!contentId) {
      this.setState({
        isLoading: false,
      });
      Taro.showToast({
        title: '请求数据失败',
        icon: 'none',
      });
      return;
    }
    const params = {
      contentId: contentId,
      contentType: contentType,
      storeId,
    };
    this.setState(
      {
        isLoading: loading,
      },
      () => {
        getClubContentDetail(storeId, params)
          .then(res => {
            console.log('获取club详情', res);
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
            console.log('获取club详情-err', err);
          });
      }
    );
  };

  //获取购物车数量
  getCartNum = () => {
    getCartNum().then(res => {
      this.setState({
        cartNum: (res && res.allCartWaresNumber) || 0,
      });
      app.globalData.cartNum = (res && res.allCartWaresNumber) || 0;
    });
  };

  //改变收藏状态
  onCollection = option => {
    console.log('onCollection');
    if (!this.checkIsLogin()) {
      utils.redirectToLogin(
        `/pages-activity/7club/club-detail/index?contentId=${this.state.contentId}&contentType=${this.state.contentType}`,
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
        console.log('7club收藏', res);
        if (res.success) {
          Taro.showToast({
            title: option.collect ? '取消收藏' : '收藏成功',
            icon: 'none',
          });
          // this.initData(false);
          let data = this.state.data;
          data.clubDetailInfo.collect = !option.collect;
          data.clubDetailInfo.random = !option.collect
            ? Math.ceil(Math.random() * 100)
            : -1;
          data.clubDetailInfo.collectCount = res.collectSum;
          this.setState({
            data,
          });
        }
      })
      .catch(err => {
        this.changeCollecting = false;
        console.log('7club收藏-err', err);
      });
  };

  //展示推荐弹窗
  showDialog = () => {
    logClick({ eid: PD_PRO_BTN });
    this.refAlertDialog.showDialog();
    Taro.eventCenter.trigger('pause7clubVideo');
  };

  goCart = () => {
    //购物车埋点
    logClick({ eid: PD_CART });
    goCart();
  };

  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  onPageScroll = ev => {
    const distance = ev.scrollTop;
    if (
      distance > 20 &&
      this.state.navSkin === 'black' &&
      this.state.suportNavCustom
    ) {
      this.setNavSkin('white');
    }
    if (
      distance < 5 &&
      this.state.navSkin === 'white' &&
      this.state.suportNavCustom
    ) {
      this.setNavSkin('black');
    }
    if (distance > this.state.windowHeight && !this.state.showGoTop) {
      this.setState({
        showGoTop: true,
      });
    } else {
      if (distance < this.state.windowHeight && this.state.showGoTop) {
        this.setState({
          showGoTop: false,
        });
      }
    }
  };

  /**
   * 切换顶部导航条颜色
   *
   * @param {*} skin:white||black
   * @memberof ClubDtail
   */
  setNavSkin = skin => {
    this.setState({
      navSkin: skin,
    });
    Taro.setNavigationBarColor({
      frontColor: skin === 'white' ? '#000000' : '#ffffff',
      backgroundColor: skin === 'white' ? '#ffffff' : '#000000',
    });
  };

  //加车 是否弹框/直接加车
  onAddCart = option => {
    console.log('加车', option);
    logClick({ eid: PRO_ALERT_ADD, eparam: { skuId: option.skuId } });
    if (option.isPop === true) {
      this.setState({
        addCartPopData: option,
      });
    } else {
      if (Array.isArray(option)) {
        logClick({
          eid: PD_ONE_ADD,
        });
        this._addCart({
          wareInfos: option,
        });
      } else {
        this._addCart({
          wareInfos: {
            skuId: option.skuId,
            skuName: option.skuName,
            buyNum: option.startBuyUnitNum || 1,
            serviceTagId: option.serviceTagId || 0,
          },
        });
      }
    }
  };

  onAlertAddCart = option => {
    if (option.isPop === true) {
      this.setState({
        addCartPopData: option,
      });
    } else {
      if (Array.isArray(option)) {
        console.log({ option });
        logClick({
          eid: PRO_ALERT_ONE_ADD,
          eparam: { skuId: option },
        });
        this._addCart({
          wareInfos: option,
        });
      } else {
        this._addCart({
          wareInfos: {
            skuId: option.skuId,
            skuName: option.skuName,
            buyNum: option.startBuyUnitNum,
            serviceTagId: option.serviceTagId || 0,
          },
        });
      }
    }
  };

  //加车
  _addCart = param => {
    console.log('=======加车', param);
    let params = param;
    if (!params.wareInfos) {
      params = {
        wareInfos: params.selectedTasteInfoIds
          ? {
              skuId: params.skuId,
              skuName: params.skuName,
              buyNum: params.startBuyUnitNum,
              serviceTagId: params.serviceTagId || 0,
              source: 1,
              selectedTasteInfoIds: params.selectedTasteInfoIds,
            }
          : {
              skuId: params.skuId,
              skuName: params.skuName,
              buyNum: params.startBuyUnitNum,
              serviceTagId: params.serviceTagId || 0,
              source: 1,
            },
      };
    }

    if (!Array.isArray(params.wareInfos)) {
      try {
        // 加车统一结构埋点
        structureLogClick({
          eventId: 'shareOrderPage_mentionModule_addCard',
          jsonParam: {
            firstModuleId: 'mentionModule',
            firstModuleName: '提到的商品',
            clickType: 1,
            skuName: params.wareInfos.skuName,
            skuId: params.wareInfos.skuId,
          },
        });
      } catch (error) {
        console.log('埋点报错');
      }

      const wareInfoList = [];
      this.state.data.wareInfoList.map(item => {
        if (params.skuId === item.skuId) {
          wareInfoList.push(params);
        } else {
          wareInfoList.push(item);
        }
      });
      this.setState({
        data: {
          ...this.state.data,
          wareInfoList,
        },
      });
    } else {
      // 一键加车
      try {
        // 加车统一结构埋点
        structureLogClick({
          eventId: 'shareOrderPage_mentionModule_oneKeyBuy_addCard',
          jsonParam: {
            firstModuleId: 'mentionModule',
            firstModuleName: '提到的商品',
            secondModuleId: 'oneKeyBuyModule',
            secondModuleName: '一键买齐',
            clickType: 10,
            skuName: params.wareInfos.map(item => item.skuName).join('+'),
            skuId: params.wareInfos.map(item => item.skuId).join('+'),
          },
        });
      } catch (error) {
        console.log('埋点报错');
      }
    }
    addCart({ data: params })
      .then(res => {
        Taro.showToast({
          title: res.msg || '',
          icon: 'success',
          duration: 2000,
        });
        this.setState({
          addCartPopData: '',
          cartNum: (res && res.allCartWaresNumber) || 0,
        });
        app.globalData.cartNum = (res && res.allCartWaresNumber) || 0;
        this.initData();
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

  //跳转商详
  onGoProDetail = option => {
    console.log('onGoProDetail', option);
    logClick({ eid: PD_PRODUCT, eparam: { skuId: option } });
    goProDetail(option);
  };
  onAlertGoProDetail = option => {
    logClick({ eid: PRO_ALERT_PRODUCT, eparam: { skuId: option } });
    goProDetail(option);
  };

  //跳转菜谱详情
  onGoBillDetail = option => {
    logClick({ eid: PD_BILL, eparam: { contentId: option.contentId } });
    console.log('onGoBillDetail', option);
    goBillDetail(option);
  };
  onAlertGoBillDetail = option => {
    logClick({ eid: PRO_ALERT_BILL, eparam: { contentId: option.contentId } });
    console.log('onGoBillDetail', option);
    goBillDetail(option);
  };

  //跳转7club详情
  onGo7clubDetail = option => {
    logClick({ eid: PD_HOT_RECOM, eparam: { contentId: option.contentId } });
    console.log('club详情', option);
    if (!option.contentId) return;
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };
  onAlertGo7clubDetail = option => {
    logClick({
      eid: PRO_ALERT_HOT_RECOM,
      eparam: { contentId: option.contentId },
    });
    console.log('club详情', option);
    if (!option.contentId) return;
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  //跳转7club首页
  goClubHome = () => {
    Taro.switchTab({
      url: '/pages/center-tab-page/index',
    });
  };

  //点击回退事件
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
    this.initData(true);
  };

  /**
   * 转发事件
   */
  onShareAppMessage() {
    const { data, storeId, contentType, contentId } = this.state;
    logClick({ eid: PD_SHARE, eparam: { contentId } });
    const info = (data && data.clubDetailInfo) || {};
    const url = `/pages-activity/7club/club-detail/index?storeId=${storeId}&contentId=${contentId}&contentType=${contentType}&from=miniapp&entrancedetail=009_${storeId}_20191219009`;
    return {
      title: info.title,
      imageUrl: getShareImage(info),
      path: `/pages/center-tab-page/index?returnUrl=${encodeURIComponent(url)}`,
    };
  }

  render() {
    const {
      showGoTop,
      data,
      showBack,
      addCartPopData,
      cartNum,
      isLoading,
      navSkin,
      suportNavCustom,
    } = this.state;
    const {
      clubDetailInfo,
      cookBaseInfoList,
      recomendInfoList,
      wareInfoList,
    } = data;
    return (
      <View className='detail'>
        {isLoading && <Loading tip='加载中...' />}
        {suportNavCustom && (
          <View
            className='detail-top-cover'
            style={{
              background:
                navSkin === 'black'
                  ? 'linear-gradient(360deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0.52) 100%)'
                  : 'unset',
            }}
          >
            <NavBar
              title={clubDetailInfo.title || '7 CLUB'}
              showBack={showBack}
              onBack={this.handleBack}
              skin={navSkin}
            />
          </View>
        )}

        {!isLoading && !clubDetailInfo && (
          <NoneDataPage
            onRefresh={this.onRefresh}
            styleObj={{ paddingTop: '430rpx' }}
          />
        )}
        {!isLoading && clubDetailInfo && (
          <View>
            <View className='detail-top-box'>
              <Image
                src={filterImg(
                  (clubDetailInfo && clubDetailInfo.coverImg) || ''
                )}
                mode='widthFix'
                className='detail-top-img'
              />
            </View>
            <DetailContent data={clubDetailInfo} />
            {wareInfoList && wareInfoList.length > 0 && (
              <AboutProducts
                data={wareInfoList}
                onGoDetail={this.onGoProDetail}
                onAddCart={this.onAddCart}
              />
            )}
            {cookBaseInfoList && cookBaseInfoList.length > 0 && (
              <AboutBill
                data={cookBaseInfoList}
                onGoBillDetail={this.onGoBillDetail}
              />
            )}
            {recomendInfoList && recomendInfoList.length > 0 && (
              <RecommendEvaluation
                data={recomendInfoList}
                onGoDetail={this.onGo7clubDetail}
              />
            )}
            <View className='page-bottom'>
              <ClubPageBottom
                skin='white'
                onCollection={this.onCollection}
                onClickRightBtn={this.showDialog}
                onGoCart={this.goCart}
                cartNum={cartNum}
                data={data}
                showRightBtn={
                  (wareInfoList && wareInfoList.length > 0) ||
                  (cookBaseInfoList && cookBaseInfoList.length > 0) ||
                  (recomendInfoList && recomendInfoList.length > 0)
                }
              />
            </View>
          </View>
        )}

        <View className='right-fixed-area'>
          {showGoTop && (
            <View className='go-top'>
              <GoTop type='top' onClick={this.goTop} />
            </View>
          )}
          <View className='to-7club' onClick={this.goClubHome}>
            <View className='hometext'>7CLUB</View>
          </View>
        </View>
        <AlertDialog
          data={data}
          onGoProDetail={this.onAlertGoProDetail}
          onAddCart={this.onAlertAddCart}
          onGoBillDetail={this.onAlertGoBillDetail}
          onGo7clubDetail={this.onAlertGo7clubDetail}
          ref={this.onRef}
        />

        <FloorAddCart
          show={addCartPopData?true:false}
          data={addCartPopData}
          onAddCart={this._addCart}
          onClose={this.onCloseAddCartPop}
        />
      </View>
    );
  }
}
