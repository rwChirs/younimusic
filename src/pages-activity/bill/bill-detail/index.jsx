import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import {
  getCookBookListApi,
  getCookDetailApi,
  addCart,
  getCartNum,
  changeCollect,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { logClick, structureLogClick } from '../../../utils/common/logReport';
import {
  addHttps,
  getRealUrl,
  getUrlParams,
  px2vw,
  h5Url,
} from '../../../utils/common/utils';
import utils from '../../../pages/login/util';
import Card from './card/index';
import Steps from './steps/index';
import BillPopup from './bill-pop-up/index';
import Service from './service/index';
import ShoppingCart from './shopping-cart';
import MenuProductItem from '../../../pages/index/components/menu-product-item';
import './index.scss';
import reportPoints from '../reportPoints';
import collect from '../common';
import loginCheck from '../../../utils/login_check';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { exportPoint } from '../../../utils/common/exportPoint';
import BillProductItem from './bill-product-item/index';

const app = Taro.getApp().$app;
const router = getCurrentInstance().router;

export default class BillDetail extends CommonPageComponent {
  state = {
    title: '',
    isPop: false,
    showMoreFoods: false,
    cartNum: 0,
    showGoTop: false,
    canBuyNum: 0,
    isFirstShow: true,
    isMore: false,
    centerTabBar: app.globalData.centerTabBar,
    popup: {
      show: false,
      height: 520,
    },
    forbidScrollFlag: false,
    clickType: 1,
    skuId: '',
    cookBookList: [],
    author: {},
    isUseable: false,
  };
  componentWillMount() {
    exportPoint(router);
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          windowHeight: res.windowHeight,
        });
      },
    });
    if (router.params.scene) {
      getRealUrl(decodeURIComponent(router.params.scene)).then((res) => {
        const params = getUrlParams(res.code);
        this.setState(
          {
            storeId: params.storeId,
            contentId: params.contentId,
            planDate: params.planDate,
          },
          () => {
            this.getStoreId();
          }
        );
      });
      return;
    }
    const { storeId, contentId, planDate } = router.params;
    this.setState(
      {
        storeId,
        contentId,
        planDate,
      },
      () => {
        this.getStoreId();
      }
    );
  }
  componentDidShow() {
    if (!this.state.isFirstShow) {
      this.getStoreId();
    } else {
      this.setState({
        isFirstShow: false,
      });
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        centerTabBar: app.globalData.centerTabBar,
      });
    }, 300);
  }

  getStoreId = () => {
    getUserStoreInfo(this.state.storeId, '', '', '', 3)
      .then((args) => {
        this.setState(
          {
            storeId:
              args.storeId ||
              this.state.storeId ||
              Taro.getApp().globalData.defaultStoreId,
          },
          () => {
            //同步公共数据
            Taro.getApp().globalData.storeId = this.state.storeId;
            Taro.getApp().globalData.coords = [args.lon, args.lat];
            this.initData();
          }
        );
      })
      .catch(() => {
        this.setState(
          {
            storeId: Taro.getApp().globalData.defaultStoreId,
          },
          () => {
            this.initData();
          }
        );
      });
  };
  onPullDownRefresh = () => {
    this.initData();
    Taro.stopPullDownRefresh();
  };
  /**
   * 右上角转发事件
   */
  onShareAppMessage = (ev) => {
    logClick({
      ev,
      eid: reportPoints.detailShare,
      eparam: { contentId: this.state.contentId },
    });

    const { title, coverImg } = this.state;
    const url = `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${this.state.contentId}&planDate=${this.state.planDate}&from=miniapp&entrancedetail=009_${this.state.storeId}_20191219008`;
    return {
      title,
      imageUrl: addHttps(coverImg),
      path: `/pages/center-tab-page/index?returnUrl=${encodeURIComponent(url)}`,
      // path: url,
    };
  };
  onPageScroll = (ev) => {
    const distance = ev.scrollTop;
    if (distance > this.state.windowHeight && !this.state.showGoTop) {
      this.setState({
        showGoTop: true,
      });
    }
    if (distance < this.state.windowHeight && this.state.showGoTop) {
      this.setState({
        showGoTop: false,
      });
    }
  };

  collect = (ev) => {
    ev.stopPropagation();
    logClick({
      ev,
      eid: this.stared
        ? reportPoints.detailCancelCollect
        : reportPoints.detailCollect,
      eparam: { contentId: this.state.contentId },
    });
    if (this.isLogin) {
      collect(this, this.state.contentId, ev);
    } else {
      this.goLogin();
    }
  };
  initData = () => {
    this.getRenderData();
    this.getCartNum();
    this.loginCheck();
  };
  getRenderData = () => {
    const args = {
      storeId: this.state.storeId,
      source: 2,
      contentId: this.state.contentId,
      planDate: this.state.planDate,
    };
    getCookDetailApi(args).then((res) => {
      console.log(this.state.contentId, this.state.planDate, res);
      if (!res.success) {
        setTimeout(() => {
          Taro.switchTab({
            url: `/pages/bill/bill-list/index`,
          });
        }, 1000);
        return;
      }
      Taro.setNavigationBarTitle({
        title: res.title,
      });

      this.setState({
        stared: res.collect || false,
        stepList: res.cookStepInfoList || [],
        cookBaseInfoList: (res && res.cookBaseInfoList) || [],
        cookDifficult: res.cookDifficult || '',
        cookTime: res.cookTime || '',
        coverImg: res.coverImg,
        coverImgSource: res.coverImgSource,
        from: res.from,
        fromLogo: res.fromLogo,
        author: res.author,
        preface: res.preface,
        tags: res.tags,
        title: res.title,
        mainFoodDesc: res.mainFoodDesc || '',
      });
      if (res.skuIdList && res.skuIdList.length) {
        // this.getFoods(res.skuIdList.join(","));
        this.setState(
          {
            foods: res.wareList,
            canBuyNum: this.handleFoodsNum(res.wareList),
          },
          () => {
            this.getStockSkuId();
          }
        );
      } else {
        this.setState({
          foods: [],
          canBuyNum: 0,
        });
      }
    });
  };

  // 获取食材里面对应的有货的skuId
  getStockSkuId = () => {
    const { foods } = this.state;
    for (let i = 0; i < foods.length; i++) {
      if (
        foods[i].status === 2 ||
        foods[i].status === 3 ||
        foods[i].status === 5
      ) {
        this.setState(
          {
            skuId: foods[i].skuId,
            isUseable: true,
          },
          () => {
            this.getCookBookList();
          }
        );
        return;
      } else {
        this.setState({
          isUseable: false,
        });
      }
    }
  };

  //获取菜谱列表
  getCookBookList = () => {
    const { skuId, contentId } = this.state;
    const lbsData = Taro.getStorageSync('addressInfo') || {};
    let cookBookListAll = [];
    const args = {
      skuId,
      addressInfo: {
        lat: lbsData && lbsData.lat,
        lon: lbsData && lbsData.lon,
      },
      promotionId: '',
      contentId: contentId,
    };
    getCookBookListApi(args).then((res) => {
      // console.log('getCookBookListApi', res);
      if (res && res.cookBookList && res.cookBookList.length > 1) {
        cookBookListAll = res.cookBookList;
        this.setState(
          {
            cookBookList:
              cookBookListAll.length % 2 === 0
                ? cookBookListAll
                : cookBookListAll.slice(0, cookBookListAll.length - 1),
          },
          () => {
            console.log('getCookBookListApi', this.state.cookBookList);
          }
        );
      }
    });
  };

  getCartNum = () => {
    if (!this.state.storeId) return;
    getCartNum(this.state.storeId)
      .then((res) => {
        this.setState({
          cartNum: (res && res.allCartWaresNumber) || 0,
        });
      })
      .catch((err) => console.log(err));
  };
  loginCheck = () => {
    loginCheck().then((res) => {
      this.isLogin = res;
    });
  };
  //加车数据请求
  addCart = (val) => {
    console.log('addCart', val.data);
    addCart(val, this.state.storeId)
      .then((res) => {
        console.log('showToast', res);
        Taro.showToast({
          title: res.msg,
          icon: res.msg && res.msg.length > 7 ? 'none' : 'success',
          duration: 2000,
        });
        this.setState({
          cartNum: (res && res.allCartWaresNumber) || 0,
        });
      })
      .catch((err) => console.log(err));
  };
  handleFoodsNum = (foods) => {
    if (!foods || !foods.length) {
      return 0;
    }
    let total = 0;
    foods &&
      foods.length > 0 &&
      foods.map((val) => {
        if (val.addCart) total++;
      });
    return total;
  };
  changeRenderData = (data, ev) => {
    console.log(data);
    logClick({
      ev,
      eid: reportPoints.moreBill,
      eparam: { contentId: data.contentId },
    });

    Taro.navigateTo({
      url: `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${data.contentId}&planDate=${data.planDate}`,
    });
  };
  //加车
  singleAddCart = (num, ev, option, data) => {
    const { popup } = this.state;
    console.log('option', data);
    if (!this.isLogin) {
      this.goLogin();
      return;
    }
    if (option === 'billproductitem') {
      logClick({
        ev,
        eid: '7FRESH_APP_9_20200811_1597153579446|55',
        eparam: { skuId: data.skuId },
      });
    } else {
      logClick({
        ev,
        eid: reportPoints.singleAddCart,
        eparam: { skuId: data.skuId },
      });
    }

    structureLogClick({
      eventId:
        popup && popup.show
          ? 'menuDetailPage_qualitySelectPop_addCart'
          : 'menuDetailPage_qualitySelect_addCart',
      jsonParam: {
        firstModuleId:
          popup && popup.show
            ? 'qualitySelectPopModule'
            : 'qualitySelectModule',
        firstModuleName: popup && popup.show ? '精选食材弹窗' : '精选食材',
        skuId: data.skuId,
        skuName: data.skuName,
        clickType: 1,
      },
    });

    console.log('!data.addCart || data.isPop', !data.addCart, data.isPop);
    if (!data.addCart || data.isPop) {
      this.onServicePopup(data);
      return;
    }
    const params = {
      data: {
        wareInfos: {
          skuId: data.skuId,
          serviceTagId: 0,
          buyNum: 1,
        },
      },
    };
    this.addCart(params);
  };

  //一键加车
  allAddCart = (ev) => {
    logClick({
      ev,
      eid: '7FRESH_APP_9_20200811_1597153579446|56',
    });
    if (!this.isLogin) {
      this.goLogin();
      return;
    }
    const { foods, canBuyNum, popup } = this.state;
    if (!canBuyNum) return;

    let wareInfoList = [];
    foods &&
      foods.length > 0 &&
      foods.map((val) => {
        // if (val.addCart) {
        let selectedTasteInfoIds = {};
        val.attrInfoList &&
          val.attrInfoList.forEach((item1) => {
            let id = [];
            item1.attrItemList.forEach((item2) => {
              if (item2.selected) {
                id.push(item2.id);
              }
            });
            selectedTasteInfoIds[item1.tplId] = id;
          });
        wareInfoList.push({
          skuId: val.skuId,
          skuName: val.skuName,
          serviceTagId: 0,
          buyNum: 1,
          selectedTasteInfoIds: selectedTasteInfoIds,
        });
        // }
      });

    structureLogClick({
      eventId:
        popup && popup.show
          ? 'menuDetailPage_qualitySelectPop_oneKeyBuy_addCart'
          : 'menuDetailPage_qualitySelect_oneKeyBuy_addCart',
      jsonParam: {
        firstModuleId:
          popup && popup.show
            ? 'qualitySelectPopModule'
            : 'qualitySelectModule',
        firstModuleName: popup && popup.show ? '精选食材弹窗' : '精选食材',
        secondModuleId: 'oneKeyBuyModule',
        secondModuleName: '一键买齐',
        clickType: 10,
        skuId: wareInfoList.map((item) => item.skuId).join('+'),
        skuName: wareInfoList.map((item) => item.skuName).join('+'),
      },
    });
    const params = {
      data: {
        wareInfos: wareInfoList,
      },
    };
    this.addCart(params);
  };
  //加工服务弹层
  onServicePopup = (data) => {
    this.setState({
      productInfo: data,
      isPop: true,
    });
  };
  //加工服务弹层加车
  serviceAddCart = (wareInfos) => {
    const params = {
      data: {
        wareInfos: {
          ...wareInfos,
        },
      },
    };
    this.addCart(params);
    this.setState({
      isPop: false,
    });
  };
  //关闭加工服务弹层
  closeService = () => {
    this.setState({
      isPop: false,
    });
  };
  //商祥页跳转
  goDetail = (data, ev, option) => {
    console.log('billproductitem', option);
    if (option === 'billproductitem') {
      logClick({
        ev,
        eid: '7FRESH_APP_9_20200811_1597153579446|59',
        eparam: { skuId: data.skuId },
      });
    } else {
      logClick({
        ev,
        eid: reportPoints.goProductDetail,
        eparam: { skuId: data.skuId },
      });
    }

    Taro.navigateTo({
      url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${data.skuId}`,
    });
    // this.onPopupClose()
  };
  //跳转登录页
  goLogin = () => {
    utils.gotoLogin(
      `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${this.state.contentId}&planDate=${this.state.planDate}`,
      'redirectTo'
    );
  };
  //返回顶部
  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  // 返回菜谱首页
  goBillHome = () => {
    console.log('回菜谱首页');
    // Taro.switchTab({
    //   url: "/pages/bill/bill-index/index",
    // });
    Taro.switchTab({
      url: '/pages/center-tab-page/index',
    });
  };

  //跳转购物车
  goCart = (event) => {
    logClick({
      event,
      eid: '7FRESH_APP_9_20200811_1597153579446|57',
      // eparam: { skuId },
    });
    const uuid = app.globalData.openId;
    const lbsData = Taro.getStorageSync('addressInfo') || {};
    utils.navigateToH5({
      page:
        Taro.getApp().h5RequestHost +
        `/cart.html?from=miniapp&storeId=${this.state.storeId}&uuid=${uuid}}&addressId=${lbsData.addressId}&addressExt=${lbsData.addressExt}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`,
    });
  };
  //头图预览
  onPrevImg = (coverImg, coverImgSource) => {
    Taro.previewImage({
      current: addHttps(coverImg),
      urls: [addHttps(coverImgSource)],
    });
  };
  //显示更多食材
  showMoreFoods = (ev) => {
    logClick({
      ev,
      eid: reportPoints.moreFoods,
    });
    this.setState({
      showMoreFoods: !this.state.showMoreFoods,
    });
  };
  changeMore = () => {
    if (this.state.isMore == true) {
      this.setState({
        isMore: false,
      });
    } else {
      this.setState({
        isMore: true,
      });
    }
  };

  /**
   * popup弹出层
   * @param {String} id 弹出层id
   * @param {String} type 弹出层分类
   */
  onPopup = (id, type, e) => {
    const event = e ? e : type;
    this.onPopupScrollTop();
    switch (id) {
      case 'ingredients':
        this.onIngredientsPopup(event);
        break;
    }
  };

  /**
   * 放心购服务弹出层
   */
  onIngredientsPopup = (event) => {
    const { skuId, foods } = this.state;
    logClick({
      event,
      eid: '7FRESH_APP_9_20200811_1597153579446|58',
      eparam: { skuId },
    });
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: '精选食材',
        data: foods,
        type: 'ingredients',
        id: 'ingredients',
      },
    });
  };

  /**
   * 计算弹出层弹起时滚动条高度
   */
  onPopupScrollTop = () => {
    this.getRectTop().then((res) => {
      this.setState({
        forbidScrollFlag: true,
        scrollTop: `-${res}px`,
      });
    });
  };

  /**
   * 关闭弹出层
   */
  onPopupClose = () => {
    const top = Number(this.state.scrollTop.match(/\d+/)[0]);
    this.setState({
      scrollTop: '0px',
      popup: { ...this.state.popup, show: false },
      stallPopup: { ...this.state.stallPopup, show: false },
      forbidScrollFlag: false,
    });
    setTimeout(function () {
      Taro.pageScrollTo({
        scrollTop: top,
        duration: 0,
      });
    });
  };
  /**
   * 获取当前滚动条高度
   */
  getRectTop = () => {
    const query = Taro.createSelectorQuery();
    return new Promise((resolve) => {
      query
        .selectViewport()
        .scrollOffset((res) => {
          resolve(res.scrollTop);
        })
        .exec();
    });
  };

  // 相似菜谱跳转
  onGoBillDetail = (data) => {
    // console.log('onGoBillDetail',item, index, type)
    const contentId = data && data.contentId;
    logClick({
      eid: '7FRESH_APP_9_20200811_1597153579446|76',
      eparam: {
        contentId: contentId,
      },
    });
    Taro.navigateTo({
      url: `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${contentId}`,
    });
  };

  /**
   * 收藏菜谱信息
   * @param {*} obj
   */
  onCollect = (val, index) => {
    let recommendforYouList = [];
    recommendforYouList = this.state.cookBookList;
    const ifCollect = val.ifCollect;
    console.log('收藏状态修改', val);
    //埋点
    if (ifCollect) {
      logClick({
        eid: '7FRESH_APP_9_20200811_1597153579446|76',
        eparam: {
          contentId: val.contentId,
        },
      });
    } else {
      logClick({
        eid: '7FRESH_APP_9_20200811_1597153579446|75',
        eparam: {
          contentId: val.contentId,
        },
      });
    }
    if (this.isLogin) {
      const params = {
        source: 2,
        contentId: val.contentId || '',
        opType: ifCollect ? 5 : 3,
        author: this.state.author,
      };
      const tipTxt = ifCollect ? '取消收藏' : '收藏';
      changeCollect(params)
        .then((res) => {
          console.log('triggerCollect', res);
          if (res.success) {
            recommendforYouList[index].ifCollect = !ifCollect;
            recommendforYouList[index].collectCount =
              val.collectCount + (ifCollect ? -1 : 1);
            this.setState({
              cookBookList: recommendforYouList,
            });
            Taro.showToast({ title: tipTxt + '成功', icon: 'none' });
          } else {
            Taro.showToast({ title: tipTxt + '失败', icon: 'none' });
          }
        })
        .catch(() => {
          Taro.showToast(tipTxt);
        });
    } else {
      this.goLogin();
    }
  };

  findSimiler = (data, type) => {
    const { storeId } = this.state;
    if (type === 'modal') {
      structureLogClick({
        eventId: 'menuDetailPage_qualitySelectPop_clickSimilarityButton',
        eventName: '菜谱详情页-精选食材弹框找相似',
        jsonParam: {
          firstModuleId: 'qualitySelectPop',
          firstModuleName: '精选食材弹框找相似',
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 3,
        },
      });
    } else {
      structureLogClick({
        eventId: 'menuDetailPage_qualitySelect_clickSimilarityButton',
        eventName: '菜谱详情页-精选食材-找相似按钮点击',
        jsonParam: {
          firstModuleId: 'qualitySelect',
          firstModuleName: '精选食材',
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 3,
        },
      });
    }

    const url = `${h5Url}/similargoods?storeId=${storeId}&skuId=${
      data && data.skuId
    }&from=miniapp`;
    console.log('url:', url);
    utils.navigateToH5({ page: url });
  };

  render() {
    const {
      isPop,
      foods = [],
      showMoreFoods,
      cartNum,
      showGoTop,
      stared,
      productInfo,
      stepList,
      coverImg,
      coverImgSource,
      title = '',
      from = '',
      fromLogo = '',
      author = null,
      tags,
      cookTime = '',
      cookDifficult = '',
      preface = '',
      cookBaseInfoList = [],
      mainFoodDesc,
      isMore,
      centerTabBar,
      popup,
      forbidScrollFlag,
      clickType,
      cookBookList,
      isUseable,
    } = this.state;
    // console.log('isMore', isMore)
    return (
      <View
        className={forbidScrollFlag ? `bill-detail noscroll` : `bill-detail`}
      >
        {/* 加工服务弹窗 */}
        {isPop && (
          <View className='service-wrap'>
            <Service
              info={productInfo}
              onServiceAddCart={this.serviceAddCart}
              onClose={this.closeService.bind(this)}
            />
          </View>
        )}
        {coverImg && (
          <Image
            className='cover-img'
            mode='aspectFill'
            src={addHttps(coverImg)}
            onClick={this.onPrevImg.bind(this, coverImg, coverImgSource)}
          />
        )}
        <View className='star-wrap' onClick={this.collect.bind(this)}>
          <View className={`star ${stared ? 'stared' : 'unstar'}`} />
          <View className='star-txt'>{stared ? '取消' : '收藏'}</View>
        </View>

        <View className='right-fixed-area'>
          {showGoTop && <View className='go-top' onClick={this.goTop} />}
          <View className='tobillhome' onClick={this.goBillHome}>
            {centerTabBar === 0 ? (
              <View className='hometext'>今天吃啥</View>
            ) : (
              <View className='clubtext'>7CLUB</View>
            )}
          </View>
          {/* 20201120需求中去掉右边定位的购物车 */}
          {/* <View className='cart' onClick={this.goCart}>
            {cartNum && (
              <View className='cart-txt'>
                {cartNum < 100 ? cartNum : '99+'}
              </View>
            )}
          </View> */}
        </View>

        <View className='card-wrap'>
          <Card
            title={title}
            author={author}
            from={from}
            fromLogo={fromLogo}
            tags={tags}
            cookTime={cookTime}
            cookDifficult={cookDifficult}
            preface={preface}
            onChangeMore={this.changeMore}
            isMore={isMore}
          />
        </View>

        {stepList && <View className='split' />}

        {/* 精选食材 */}
        {foods.length && (
          <View
            className='foods-wrap'
            style={{
              paddingBottom: Taro.pxTransform(42),
            }}
          >
            <View className='title-wrap foods-title'>
              <View className='foods-title-left'>
                <View className='title'>精选食材</View>
                <View className='sub-title'>共{foods.length}件</View>
                <View className='mainFoodDesc'>{mainFoodDesc}</View>
              </View>
              {/* <View
                className={`add-all-btn ${canBuyNum ? '' : 'disabled'}`}
                onClick={this.allAddCart}
              >
                一键买齐({canBuyNum})
              </View> */}
            </View>
            <View className='foods-list'>
              {foods &&
                foods.length > 0 &&
                foods.map((val, i) => {
                  return (
                    <BillProductItem
                      key={i}
                      data={val}
                      className={`${i > 2 && !showMoreFoods ? 'hide' : ''}`}
                      onGoDetail={this.goDetail}
                      onAddCart={this.singleAddCart}
                      onFindSimiler={this.findSimiler}
                    />
                  );
                })}
            </View>
            {foods.length > 3 && (
              <View
                className={`more-foods-btn ${showMoreFoods ? 'up' : ''}`}
                onClick={this.showMoreFoods}
              >
                更多食材
              </View>
            )}
          </View>
        )}
        {/* 烹饪步骤 */}
        {stepList.length && (
          <View className='step-wrap'>
            <View className='title-wrap'>
              <View className='title'>烹饪步骤</View>
              <View className='sub-title'>共{stepList.length}步</View>
            </View>
            <View className='step-list-wrap'>
              {stepList && <Steps items={stepList} />}
            </View>
          </View>
        )}

        {/* 相关菜谱推荐 */}
        <View className='recommend-menu'>
          {cookBookList && cookBookList.length > 1 && (
            <View className='recommend-title'>相关菜谱推荐</View>
          )}
          {cookBookList &&
            cookBookList.length > 1 &&
            cookBookList.map((val, i) => {
              return (
                <View className='recommend-singal' key={i}>
                  <MenuProductItem
                    data={val}
                    index={i}
                    onGoDetail={this.onGoBillDetail.bind(this, val, i, '')}
                    onCollect={this.onCollect.bind(this, val, i, '')}
                    itemStyle={{
                      marginBottom: px2vw(15),
                    }}
                  />
                </View>
              );
            })}
        </View>

        {/* 今日更多滋味 */}
        {cookBaseInfoList && cookBaseInfoList.length > 0 && (
          <View className='more-wrap'>
            {foods.length > 0 && <View className='split' />}
            <View className='title-wrap'>
              <View className='title'>今日更多滋味</View>
            </View>
            <View className='more-list'>
              {cookBaseInfoList.map((val, i) => {
                return (
                  <Image
                    className='more-list-img'
                    mode='aspectFill'
                    src={addHttps(val.coverSmallImg)}
                    key={i}
                    onClick={this.changeRenderData.bind(this, val)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* 购物车 */}
        <View className='shopping-cart'>
          {/* 配送状态提醒 */}
          <ShoppingCart
            clickType={clickType}
            isUseable={isUseable}
            num={cartNum}
            onGotoCart={this.goCart}
            onPopup={this.onPopup.bind(this, 'ingredients', '')}
          />
        </View>

        {/* 弹出层 */}
        <View className='popup'>
          {popup && (
            <BillPopup
              title={popup.title}
              height={popup.height}
              show={popup.show}
              isUseable={isUseable}
              onClose={this.onPopupClose}
              // onPopupClick={this.onPopupClick}
              type={popup.type}
              data={popup.data}
              failData={popup.failData}
              selected={popup.selected}
              keyVal={popup.key}
              icon={popup.icon}
              skuId={popup.skuId}
              num={cartNum}
              clickType={2}
              onGotoCart={this.goCart}
              onGoDetail={this.goDetail}
              onAddCart={this.singleAddCart}
              onAllAddCart={this.allAddCart}
              onFindSimiler={this.findSimiler}
            />
          )}
        </View>

        <View className='bottomBox'>
          <View className='img' />
        </View>
        <View className='box' />
      </View>
    );
  }
}
