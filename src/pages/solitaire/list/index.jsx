import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import {
  getSolitaireQuery,
  getSolitaireQueryByPage,
  addSolitaireCartService,
  numSolitaireCartService,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import Loading from '../../../components/loading';
import FreshFloatBtn from '../../../components/float-btn';
import FreshSolitaireProductItem from './solitaire-product-item';
import FreshSolitaireAddCart from './solitaire-add-cart';
import {
  filterImg,
  userLogin,
  getUrlParams,
} from '../../../utils/common/utils';
import { logClick } from '../../../utils/common/logReport';
import { getShareList } from './api';
import LazyLoadImage from '../../../components/render-html/lazy-load-image';
import { exportPoint } from '../../../utils/common/exportPoint';
import utils from '../../login/util';
import './index.scss';

let flag = '';
export default class SolitaireList extends CommonPageComponent {
  constructor(props) {
    super(props);

    this.state = {
      scrollHeight: 0,
      width: 0,
      todayInfo: null, // 今日接龙信息
      storeId: '',
      shareParams: null,
      isLoad: true,
      isSuccess: false,
      noneData: false,
      scrollTop: 0,
      themeTitle: '',
      imageUrl: '',
      canLeader: false, //是否可以成为团长
      list: [], //接龙列表数据
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      promotionId: 0, //促销id
      activityId: 0, //活动id
      commanderPin: null,
      cartNum: 0,
      lbsData: Taro.getStorageSync('addressInfo') || {},
      tenantId:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').tenantId) ||
        1,
      isAddCart: false,
      chooseData: {},
      number: 0,
      opType: 1,
      sp: '',
      isBottomLoad: false,
      loadPicture:
        'https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png',
      grouponOrderAmountDesc: '',
    };
  }

  componentWillMount() {
    //隐藏右上角分享
    Taro.hideShareMenu();

    Taro.getSystemInfo({
      success: res => {
        this.setState({
          scrollHeight: res.windowHeight,
          width: res.windowWidth,
        });
      },
    });
    exportPoint(getCurrentInstance().router);
    this.userLogin();
    this.optionFun();
  }

  //如果returnUrl存在跳转到指定页面
  optionFun() {
    const option = getCurrentInstance().router.params;
    if (option.returnUrl) {
      Taro.navigateTo({
        url: decodeURIComponent(option.returnUrl),
      });
    }
  }

  componentDidMount() {
    this.getAddressInfo();
  }

  getAddressInfo(type) {
    let {
      storeId,
      lat = '',
      lon = '',
      commanderPin,
      opType,
      returnUrl,
    } = getCurrentInstance().router.params;

    commanderPin =
      commanderPin === null ||
      commanderPin === 'null' ||
      commanderPin === 'undefined' ||
      commanderPin === undefined ||
      commanderPin === ''
        ? null
        : commanderPin;
    if (returnUrl) {
      const params = getUrlParams(decodeURIComponent(returnUrl));
      commanderPin = commanderPin
        ? commanderPin
        : params.commanderPin
        ? params.commanderPin
        : null;
      opType = opType ? opType : params.opType ? params.opType : 1;
      storeId = storeId ? storeId : params.storeId ? params.storeId : '';
    }
    const addressInfo = Taro.getStorageSync('addressInfo') || {};
    if (type) {
      storeId = addressInfo.storeId ? addressInfo.storeId : storeId;
    }
    //三公里定位
    this.getStoreInfo(storeId, lon, lat, '', 3)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId,
            commanderPin,
            pageIndex: 1,
            opType: opType ? opType : 1,
          },
          () => {
            //列表渲染
            this.getListQuery();
            //列表分享
            this.initShare();
            //获取购物车数量
            // this.getCartNum();
            flag = 1;
          }
        );
      })
      .catch(err => {
        this.setState({
          imageUrl:
            'https://m.360buyimg.com/img/jfs/t1/10568/2/10399/97980/5c623225E285771c9/861701abd5052726.png',
          isSuccess: true,
        });
      });
  }

  componentDidShow() {
    if (flag) {
      const option = getCurrentInstance().router.params;
      if (option.returnUrl) {
        this.getAddressInfo(1);
      }
    }

    this.onPageShow();
    this.getCartNum();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getListQuery = () => {
    let { commanderPin, pageSize, opType } = this.state;
    getSolitaireQuery({
      commanderPin,
      pageSize,
      opType,
    })
      .then(data => {
        if (!(data && data.todayInfo)) {
          this.setState({
            imageUrl:
              'https://m.360buyimg.com/img/jfs/t1/10568/2/10399/97980/5c623225E285771c9/861701abd5052726.png',
            isSuccess: true,
            isLoad: false,
          });
        } else {
          Taro.setStorageSync('solitaire-storeId', this.state.storeId);
          this.getInitData(data);
        }
      })
      .catch(() => {
        this.setState({
          imageUrl:
            'https://m.360buyimg.com/img/jfs/t1/10568/2/10399/97980/5c623225E285771c9/861701abd5052726.png',
          isSuccess: true,
        });
      });
    //关闭load
    this.setState({
      isLoad: false,
    });
  };

  //处理页面数据
  getInitData = data => {
    let skuDetailPage = data && data.todayInfo && data.todayInfo.skuDetailPage;
    let list = (skuDetailPage && skuDetailPage.pageList) || [];
    this.setState({
      imageUrl:
        data && data.imageUrl ? filterImg(data.imageUrl, 'product') : '',
      storeId:
        list[0] && list[0].skuInfo && list[0].skuInfo.storeId
          ? list[0].skuInfo.storeId
          : this.state.storeId,
      themeTitle: data.todayInfo.themeTitle,
      todayInfo: data.todayInfo, // 今日接龙信息
      canLeader: data.canLeader,
      list: list,
      totalPage: (skuDetailPage && skuDetailPage.totalPage) || 0,
      promotionId: data && data.todayInfo && data.todayInfo.promotionId,
      activityId: data && data.todayInfo && data.todayInfo.activityId,
      grouponOrderAmountDesc: data.grouponOrderAmountDesc,
    });
  };

  //下拉刷新重新请求
  onPullDownRefresh = () => {
    this.setState(
      {
        pageIndex: 1,
        list: [],
      },
      () => {
        this.getListQuery();
        Taro.stopPullDownRefresh();
      }
    );
  };

  // 触底刷新请求数据
  onReachBottom = () => {
    let { totalPage, pageIndex } = this.state;
    if (pageIndex >= totalPage) {
      this.setState({
        noneData: true,
      });
      return;
    }
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1,
        isBottomLoad: true,
      },
      () => {
        this.getListByPage();
      }
    );
  };

  getListByPage = () => {
    const {
      commanderPin,
      activityId,
      promotionId,
      pageIndex,
      pageSize,
      opType,
    } = this.state;

    getSolitaireQueryByPage({
      commanderPin,
      activityId,
      promotionId,
      page: pageIndex,
      pageSize,
      opType,
    })
      .then(res => {
        let data = res && res.skuDetailPage;
        this.setState(
          {
            list: this.state.list.concat(
              data && data.pageList ? data.pageList : []
            ),
          },
          () => {
            //关闭load
            this.setState({
              isBottomLoad: false,
            });
          }
        );
      })
      .catch(err => {
        //关闭load
        this.setState({
          isBottomLoad: false,
        });
      });
  };

  //列表分享
  initShare = () => {
    getShareList()
      .then(shareParams => {
        //放开右上角分享功能
        Taro.showShareMenu();
        this.getShareInfo(shareParams);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getShareInfo = shareParams => {
    this.setState(
      {
        shareParams: shareParams,
      }
    );
  };

  //三公里定位
  getStoreInfo = (storeId, lon, lat, acId, type) => {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then(res => {
      return res;
    });
  };

  //进入详情页
  goDetail = (data, e) => {
    Taro.setStorageSync('solitaire-list-top', this.state.scrollTop);
    const skuId = data.skuId;
    const status = data.skuInfo.status;
    const handonId =
      data && data.skuActivityInfo && data.skuActivityInfo.handonId;
    // 点击埋点
    logClick({
      e,
      eid: '7FRESH_miniapp_1_1530785333379|65',
      eparam: { skuId, status },
    });

    const { activityId } = this.state;
    Taro.navigateTo({
      url: `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${data.commanderInfo &&
        data.commanderInfo.pin}&skuId=${skuId}&storeId=${
        this.state.storeId
      }&handonId=${handonId}`,
    });
  };

  userLogin = () => {
    userLogin()
      .then(res => {
        this.setState({
          sp: res.sp,
        });
      })
      .catch(err => console.log(err));
  };

  onShareAppMessage = e => {
    logClick({ e, eid: '7FRESH_miniapp_1_1530785333379|66' });
    const {
      title,
      appletImageUrl,
      note,
      appletSolitaireListUrl,
    } = this.state.shareParams;
    const { storeId, commanderPin, sp, opType } = this.state;
    return {
      title,
      imageUrl: filterImg(appletImageUrl),
      path: sp
        ? `${appletSolitaireListUrl}&commanderPin=${commanderPin}&opType=${opType}&from=miniapp&entrancedetail=009_${storeId}_20191219003&sp=${sp}`
        : `${appletSolitaireListUrl}&commanderPin=${commanderPin}&opType=${opType}&from=miniapp&entrancedetail=009_${storeId}_20191219003`,
      desc: note,
    };
  };

  //置顶
  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
    this.setState({
      scrollTop: 0,
    });
  };

  //返回首页
  goHome = () => {
    Taro.switchTab({
      url: `/pages/index/index?storeId=${this.state.storeId}`,
    });
  };

  //跳转接龙购物车
  onGoCart = e => {
    // 点击埋点
    logClick({ e, eid: '7FRESH_miniapp_2_1551092070962|96' });
    Taro.navigateTo({
      url: `/pages-activity/solitaire/cart/index?commanderPin=${this.state.commanderPin}`,
    });
  };

  //接龙购物车数量
  getCartNum = () => {
    const { storeId, tenantId, lat, lon } = this.state;
    const params = {
      storeId,
      tenantId,
      platformId: 1,
      lat,
      lon,
    };
    numSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.setState({
            cartNum: res.cartNum,
            isAddCart: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //加车
  addCart = e => {
    const {
      storeId,
      lbsData,
      commanderPin,
      opType,
      chooseData,
      number,
    } = this.state;
    const params = {
      storeId,
      tenantId: lbsData.tenantId,
      lat: lbsData.lat,
      lon: lbsData.lon,
      skuId: chooseData.skuId,
      skuNum: number,
      commanderPin: chooseData.commanderInfo && chooseData.commanderInfo.pin,
      activityId: chooseData.activityId,
    };
    let skuId = chooseData.skuId;
    logClick({
      e,
      eid: '7FRESH_miniapp_2_1551092070962|96',
      eparam: { skuId },
    });

    addSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.setState(
            {
              isAddCart: false,
            },
            () => {
              this.getCartNum();
              if (res && res.msg) {
                Taro.showToast({
                  title: res.msg,
                  icon: 'success',
                });
              }
            }
          );
          return;
        } else {
          if (res.code === 3) {
            utils.gotoLogin(
              `/pages/solitaire/list/index?commanderPin=${commanderPin}&storeId=${storeId}&opType=${opType}`,
              'redirectTo'
            );
            return;
          } else if (res && res.msg) {
            Taro.showToast({
              title: res.msg,
              icon: 'none',
            });
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //处理数据后进入结算页
  goToCartPre = params => {
    this.setState(
      {
        number: params.startBuyUnitNum,
      },
      () => {
        //接龙购物车加车
        this.addCart();
      }
    );
  };

  //单独买
  openSetProduct = info => {
    if (
      (info.skuInfo.serviceTagWebs && info.skuInfo.serviceTagWebs.length > 0) ||
      info.skuInfo.weightSku
    ) {
      this.setState({
        isAddCart: true,
        chooseData: info,
      });
    } else {
      this.setState(
        {
          chooseData: info,
          number: info.skuInfo.startBuyUnitNum,
        },
        () => {
          this.addCart();
        }
      );
    }
  };

  //关闭加车弹层
  closeAddCart = () => {
    this.setState({
      isAddCart: false,
    });
  };

  //页面滚动
  onScroll = e => {
    this.setState({
      scrollTop: e.detail.scrollTop,
    });
  };

  //页面滑动方法
  onPageScroll = e => {
    this.setState({
      scrollTop: e.scrollTop,
    });
  };

  render() {
    const {
      scrollTop,
      todayInfo, // 今日接龙信息
      isLoad,
      isSuccess,
      themeTitle,
      imageUrl,
      width,
      canLeader,
      list,
      cartNum,
      isAddCart,
      chooseData,
      noneData,
      loadPicture,
      isBottomLoad,
      grouponOrderAmountDesc,
    } = this.state;
    return (
      <View className='groupon-new-list' onPageScroll={this.onPageScroll}>
        <View className='groupon-common-main'>
          {/* 主题图片 */}
          {imageUrl && (
            <View className='groupon-theme'>
              <LazyLoadImage
                className='groupon-theme-img'
                width={width}
                src={filterImg(imageUrl)}
              />
              {isSuccess && (
                <View className='groupon-new-list-title'>
                  <LazyLoadImage
                    src='https://m.360buyimg.com/img/jfs/t1/20032/38/6327/15305/5c4ecd94E616d1fd6/21cf60b77fa134b9.png'
                    width={220}
                  />
                </View>
              )}
            </View>
          )}
          {todayInfo && (
            <View className='theme'>
              <View className='theme-icon'>本期接龙</View>
              <View className='themeTitle'>
                {themeTitle ? themeTitle : '跟着买，就对了'}
              </View>
            </View>
          )}

          {/* 成团门槛提示信息 */}
          {grouponOrderAmountDesc && (
            <View className='groupon-warnTip'>{grouponOrderAmountDesc}</View>
          )}

          {todayInfo &&
            list &&
            list.map((info, index) => {
              return (
                <View className='groupon-list-card' key={`${index}`}>
                  <FreshSolitaireProductItem
                    skuDetail={info}
                    canLeader={canLeader}
                    teamName='团长'
                    onClick={this.goDetail.bind(this, info)}
                    onAddCart={this.openSetProduct.bind(this, info)}
                  />
                </View>
              );
            })}

          {/** loading */}
          {isLoad && (
            <Loading />
          )}

          {!isLoad && isBottomLoad && (
            <View className='load-home-cont'>
              <Image className='load-img' src={loadPicture} lazyLoad />
            </View>
          )}

          {/** 拖底图 */}
          {!isLoad && isSuccess && (
            <View className='groupon-new-list-none'>
              当前门店暂无接龙活动，敬请期待
            </View>
          )}

          {/** 底部文案 */}
          {!isLoad && (
            <View>
              {noneData && (
                <View className='groupon-new-list-bottom'>
                   <View className='bottom-main'>
                    <Image
                      className='bottom-picture'
                      src='https://m.360buyimg.com/img/jfs/t1/116226/15/18420/15017/5f69d368E535133c4/faba651954f11ef9.png'
                      mode='aspectFit'
                      lazyLoad
                    />
                  </View>
                </View>
              )}

              <View className='go-cart' onClick={this.onGoCart.bind(this)}>
                <View className='go-cart-icon'>
                  {cartNum > 0 && (
                    <Text className='num'>
                      {cartNum > 99 ? '99+' : cartNum}
                    </Text>
                  )}
                  <Image
                    className='go-cart-icon-img'
                    src='//m.360buyimg.com/img/jfs/t1/94824/31/8964/1614/5e09a176E242d1e6e/b11439eb1eebc4a4.png'
                    width={220}
                  />
                  <View className='go-cart-icon-txt'>购物车</View>
                </View>
              </View>
            </View>
          )}
        </View>

        {isAddCart && chooseData && chooseData.skuInfo && (
          <View>
            <FreshSolitaireAddCart
              data={{
                ...chooseData.skuInfo,
                serviceTags: chooseData.skuInfo.serviceTagWebs,
              }}
              onClick={this.goToCartPre.bind(this)}
              onClose={this.closeAddCart.bind(this)}
            />
          </View>
        )}

        {/** 返回顶部和返回首页 */}
        {scrollTop > 100 && (
          <View className='goTop'>
            <FreshFloatBtn
              type='top'
              title='顶部'
              color='rgb(121,47,37)'
              borderColor='rgba(121,47,37,0.3)'
              onClick={this.goTop.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}
