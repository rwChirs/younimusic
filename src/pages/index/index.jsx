import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, OfficialAccount, Image } from '@tarojs/components';
import AES from 'crypto-js/aes';

import {
  getSingleFloor,
  getGrabRedPacket,
  getPositionApi,
  getRedisGet,
  categoryV2GetFirstCategory,
  getCartNum,
  addCart as addCartSever,
  getSearchNewDefaultKeyWord,
  getNewUserApplyWelfare,
  getNewIndexServer,
  getIsConcernService,
  getIndexRecommendTabInfo,
  getWareUpc,
  getNewUserTaskPop,
  getNewUserTaskTake,
  getTenantShopService,
  getLoginStatus,
  changeCollect,
  // getQueryCommand,
  getShopInfoPageListService,
  getQueryTemplate,
  getSaveTemplate,
  getIndexcolumnBox,
  getRandomWareRecommend,
  getUserConfig,
  platformUserAddressFix,
  getVersionPolicy,
} from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import {
  logClick,
  commonLogClick,
  structureLogClick,
} from '../../utils/common/logReport';
import {
  getRealUrl,
  isLogined,
  getURLParameter,
  getUrlParams,
  px2vw,
  formatDate,
} from '../../utils/common/utils';
import utils from '../login/util';
import goPage from './goPage';

import SkeletionScreen from './components/skeleton-screen';
import CustomTabBar from '../../components/custom-tab-bar';
import NavBar from './components/nav-bar';
import TopSearch from './components/top-search';
import BusinessesList from './components/businesses-list';
import FloorAdPop from './components/floor-ad-pop'; //  福袋、 21弹屏广告
import FloorNews from './freshComponents/floor-news'; // 2.七鲜快报
import FreshFloorIndexIcon from './freshComponents/floor-index-icon'; // 3.功能聚合
import FloorSingleItems from './freshComponents/floor-single-items'; // 6.单品
import FloorThemeProduct from './freshComponents/floor-theme-product'; // 7.主题商品
import FloorEntrance from './floor-entrance'; // 8.门店信息
import FloorNotice from '../../components/floor-notice'; // 19.通栏、 83.小程序直播入口
import FloorScroll from './freshComponents/floor-scroll'; //20.滑动图
import FloorFloatImg from './freshComponents/floor-float-img'; // 25.浮动图
import FloorSpace from './freshComponents/floor-space'; //28.楼层间隔
import FloorWrapProduct from './freshComponents/floor-wrap-product'; //29.包裹式商品
import FloorNewBornZone from './freshComponents/floor-new-born-zone'; // 40.新人专区
import FloorFastFood from './freshComponents/floor-fast-food'; // 41.速食快餐
import FloorRelay from './freshComponents/floor-relay'; // 43.七鲜接龙
import FloorImg from './freshComponents/floor-img'; // 1,35,44 首页轮播
import FloorCouponTip from './freshComponents/floor-coupon-tip'; // 47
import FloorRedRun from './freshComponents/floor-red-run'; // 48
import FloorGroupon from './freshComponents/floor-groupon'; // 51
import FloorScrambleToday from './freshComponents/floor-scramble-today'; // 52.今日值得抢
import FloorSeasonItems from './freshComponents/floor-season-items'; // 53.时令新品
import FloorBetter100 from './freshComponents/floor-better-100'; // 54.优选100
import FloorRecommendForYou from './freshComponents/floor-recommend-for-you'; // 55.为你推荐
import FloorQualitySelected from './freshComponents/floor-quality-selected'; // 68
import FloorBrandSelected from './freshComponents/floor-brand-selected'; // 69
import FreshFloorScrambleToday from './freshComponents/floor-scramble-week'; // 71.本周值得抢
import FloorNewPersonEntry from './freshComponents/floor-new-person-entry'; // 93.新人任务入口
import FloorColumnOperate from './freshComponents/floor-column-operate'; // 100.首页独立运营-功能聚合
import EmptyPage from '../../components/empty-page';
import FloorNewPersonModal from '../../components/new-person-modal'; //新人任务弹窗
import FloorRedPop from './freshComponents/floor-red-pop'; // 口令红包弹框
import FreshBottomLogo from './freshComponents/bottom-logo'; // 页面底部七鲜拖底图
import FloorAddCart from '../../components/floor-add-cart'; // 加车弹框
import ChangeBusinessesLayer from './components/change-businesses-layer'; // 切换租户的动画组件
import FreshFloatBtn from './components/float-btn'; //返回顶部按钮
import SubscribeModal from '../../components/subscribe-modal'; // 领券订阅消息
import ModelAdsErr from './components/model-ads-err'; // 修正地址弹框
import PolicyModal from './components/policy-modal'; // 隐私政策弹框

import getUserStoreInfo, {
  saveAddrInfo,
} from '../../utils/common/getUserStoreInfo';
import { h5Url } from '../../utils/adapter';
import {
  exportPoint,
  getPageExposure,
  getExposure,
} from '../../utils/common/exportPoint';
import colorRequest from '../../utils/common/colorRequest';
// import getOpenId from '../../utils/openId';
import './index.scss';

const app = Taro.getApp().$app;

/**
 * 首页进入场景
 * 1.第一次打开首页，执行定位逻辑
 *
 * 2.小程序切入后台，再回到前台，走定位逻辑
 *
 * 3.小程序通过分享卡片打开
 *
 */

export default class Home extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '送到家',
      logined: true, // 是否登录
      loaded: false, // 是否加载
      floors: [], // 楼层数据
      windowWidth: 375, // 屏幕宽度
      recommendforYouListLeft: [], // 推荐列表左列
      recommendforYouListRight: [], // 推荐列表右列
      addressExt: '', // 送至
      sendTo: '', // 详细地址
      cartNum: app.globalData.cartNum, // 购物车数量
      showGoTop: false, // 是否返回顶部
      defaultKeyword: '', // 搜索关键词
      scene: null, // 场景
      isShowTopAddr: true, // 显示地址
      storeId: '', // 门店Id
      tenantId: 1, // 租户Id
      platformId: 1, // 平台Id
      isConcern: true, // 是否关注公众号
      isLoad: true,
      isBottomLoad: false,
      loadPicture:
        'https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png',
      recommendForYouProps: {
        fixedNav: false,
        tabIndex: 0,
        showLoading: false,
        showRefresh: false,
      },
      addCartPopData: '',
      showBusinessesList: false,
      showPageIndexTools: false,
      shopInfoPagedList: [],
      showChangeBusinessesLayer: false,
      fuDaiData: {},
      isHideFloorFloatImg: false,
      isShowAddApplet: false,
      isShowApplet: false,
      // isFirstShowPageIndexTools: false,
      isShowNewCustomer: false, //显示新人专区高亮弹窗
      showFlyToCart: false,
      isRecommedLoad: false,
      storeName: '',
      newUserTaskPop: {},
      notNewPerson: false,
      showAwardModal: false, //新人任务弹窗
      goDetailButton: false,
      canteenEntrance: '',
      navHeight: '',
      redPassword: {},
      goCopyFlag: false,
      customerFlag: false,
      toUserId: '',
      remindFlag: false,
      restartFlag: false,
      remindNum: 0,
      subscriptionType: 1,
      afterResultList: [],
      pageStyle: {},
      policyShow: false,
      policyCon: {}, //隐私政策
    };
  }
  /*******************页面渲染未使用的数据**********************/
  isFirstOpen = true; // 是否是第一次打开首页
  isFreshPerson = true; // 是否是新人
  blackSkuList = []; // 黑名单商品列表
  remainingFloor = 0; // 剩余楼层
  startFloor = 0; // 开始楼层
  pageSize = 8; // 楼层初始时请求楼层数
  fromSecondFloorStartCount = 5; // 楼层每页请求楼层数
  hasRecommend = false; // 是否有推荐数据
  hasRecommendForYou = false; // 是否有为你推荐数据
  fromBackgroundHide = false; // 是否从后台切回来
  recommendForYouData = {}; // 为你推荐数据
  hasShopInfoPagedList = false; // 是否有门店楼层
  recommendforYouList = [];
  scrollTop = 0;
  //托底店铺分页信息
  shopListArgs = {
    page: 0,
    pageSize: 10,
  };
  //推荐商品分页信息
  tabIndex = 0;
  heightDataTotal = [0, 0];
  recommend = {
    max: 1,
    page: 0,
    pageSize: 40,
  };
  pageDistance = 0; // 页面顶部距离

  count = 0;
  coords = {};
  loadHeight = 0; // 浮动图高度
  addressInfo = {}; // 地址信息
  addressId = ''; // 地址id
  canScrollTop = false;
  newCustomerPosition = true; //控制新人专区是否滑动
  getFuDaiDataOver = false; //是否已经获取到弹窗数据了
  recommendforYouListTemp = '';
  isNextRecommond = false;
  exposureData = {}; // 曝光记录

  isShowNewPersonModal = '';
  isNotFromLogin = false;
  tmplIds = '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw';
  alreadyGet = false;
  couponCodes = [];
  columnRuleList = [];
  radomWareRecommend = [];
  touchstone_expids = ''; //abTest埋点
  IndexRecommendSpaceNum = 1; // 用户配置返回的间隔次数
  countRecommend = Taro.getStorageSync('countRecommend') || 0; //统计点击的间隔次数
  oldVersionCode = 0;
  isRejectPolicy = false;

  /*******************页面渲染未使用的数据**********************/
  /*******************生命周期**********************/
  componentWillMount() {
    app.globalData.tabBar = 0;

    // 小程序进入后台监听
    wx.onAppHide(() => {
      if (this.state.logined) {
        this.fromBackgroundHide = true;
        this.setState({
          showBusinessesList: false,
          showPageIndexTools: false,
        });
      }
      Taro.setStorageSync('alreadyShowNewCustomer', false);
      try {
        Taro.setStorage({ key: 'showPageIndexTools', data: false });
      } catch (e) {
        console.log(e);
      }
    });
    let clientRect = wx.getMenuButtonBoundingClientRect();
    Taro.getSystemInfo().then((res) => {
      console.info(`【系统信息】：${JSON.stringify(res)}`);
      const model = res.model;
      const isIphoneX =
        /iphone\sx/i.test(model) ||
        (/iphone/i.test(model) && /unknown/.test(model)) ||
        /iphone\s11/i.test(model) ||
        /iphone\s12/i.test(model);
      this.setState({
        windowWidth: Taro.getSystemInfoSync().windowWidth,
        windowHeight: Taro.getSystemInfoSync().windowHeight,
        isIphoneX,
        navHeight:
          (clientRect.bottom + clientRect.top - res.statusBarHeight) * 2,
      });
      console.log('navHeight', this.state.navHeight, this.state.windowWidth);
    });

    // 获取右侧浮动图位置
    wx.createSelectorQuery()
      .select('.load-home-cont-hidden')
      .boundingClientRect((rect) => {
        if (rect) {
          this.loadHeight = rect.height;
        }
      })
      .exec();
    this.handleWithOptionsParams(); // 带参数场景跳转逻辑
  }

  /**
   * 页面加载
   */
  componentDidMount() {
    console.log('getCurrentInstance', getCurrentInstance().router);
    const option = getCurrentInstance().router.params;
    const addressInfo = Taro.getStorageSync('addressInfo');
    if (
      option.storeId &&
      ((addressInfo && addressInfo.storeId !== option.storeId) || !addressInfo)
    ) {
      // 地址栏有storeId 无缓存情况下 取地址栏
      getTenantShopService({
        storeId: option.storeId,
      }).then((res) => {
        const shop = res && res.tenantShopInfo;
        this.firstPageInit(option.storeId, shop && shop.lon, shop && shop.lat);
      });

      return;
    }

    this.firstPageInit(); // 页面初始化
    this.onSetSence(); // 场景相关处理
    this.getRedisGet(); // 获取保健品黑名单 只需请求一次
  }

  /**
   * 页面显示
   * 0.第一次打开时，不执行楼层加载
   * 1.切换地址时，走缓存逻辑
   * 2.从后台切入前台走定位逻辑
   */
  componentDidShow() {
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
    this.handlerNewCustomerCallback();
    this.onPageShow();
    this.UserConfig(); //获取abTest数据

    // tab切换需要刷新
    const clickIndexTab = Taro.getStorageSync('clickIndexTab');
    // 如果没登录并且获取到pin时 || 1208新增逻辑，点击tab时进行刷新首页，其余按照老逻辑走
    if ((!this.state.logined && isLogined()) || clickIndexTab) {
      Taro.setStorageSync('clickIndexTab', false);
      this.initData();
    } else {
      this.getVersionPolicyText();
    }
    this.setState({
      logined: isLogined(),
    });
    // ZMH 2020-09-27 jira:40229 解决在购物车页面操作之后返回首页CartNum没变的问题
    this.getCartNum();

    if (this.pageDistance > this.state.windowHeight) {
      setTimeout(() => (this.canScrollTop = true), 500);
    }

    //埋点上报
    exportPoint(getCurrentInstance().router);

    //是否关注公众号
    this.isFollowWx();

    if (this.isFirstOpen) {
      this.isFirstOpen = false;
      return;
    }

    if (!this.state.storeId && !this.addressId) {
      this.setState({ isLoad: true });
      this.firstPageInit();
      this.goTop();
      return;
    }
    if (addressInfo.addressId !== '') {
      // 防止从别的页面返回首页出现骨架屏 故注释 isLoad
      // this.setState({ isLoad: true });
      this.initPage(addressInfo); // 切换地址逻辑
      this.goTop();
    }

    if (this.addressId === addressInfo.addressId) {
      return;
    }
    this.heightDataTotal = [0, 0];
  }

  /**
   * 页面隐藏
   */
  componentDidHide() {
    this.onPageHide();
    this.canScrollTop = false;
    this.setState({
      customerFlag: false,
    });
  }

  componentWillUnmount() {
    Taro.setStorageSync('home_storeId', this.state.storeId);
    if (this.ctx) {
      this.ctx.destroy();
      this.ctx = null;
    }
  }

  /**
   * 触底
   */
  onReachBottom() {
    if (this.state.storeId && this.hasRecommendForYou) {
      this.setState({
        isBottomLoad: true,
      });
      if (this.recommend.page === 1) {
        this.getRecommendForYou('', true);
      } else {
        this.separateData();
        this.getRecommendForYou('', '', true);
      }
    }
  }

  /**
   * 分享
   * @param {} options 分享数据
   */
  onShareAppMessage(options) {
    let share = {
      title: '七鲜 ，一周7天，每天新鲜',
      url: '/pages/index/index',
    };
    if (
      options.from === 'button' &&
      options.target.dataset.type === 'groupon'
    ) {
      const shareInfo = options.target.dataset.info.shareInfoWeb;
      console.log({
        title: shareInfo.shareTitle,
        imageUrl: shareInfo.appletImageUrl,
        url: shareInfo.appletUrl,
      });
      share = {
        title: shareInfo.shareTitle,
        imageUrl: shareInfo.appletImageUrl,
        url: `/pages/index/index?returnUrl=${encodeURIComponent(
          shareInfo.appletUrl
        )}`,
      };
    }
    this.onPageShare({
      from: options.from,
      ...share,
    });
    return share;
  }

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    if (!this.state.storeId) {
      this.shopListArgs.page = 0;
      this.getShopInfoPagedList();
    } else {
      this.initData();
      Taro.setStorageSync('columnStoreId', '');
      Taro.setStorageSync('columnList', []);
      this.setState({
        afterResultList: [],
      });
    }
  }

  /**
   * Tab点击
   * @param {*} item
   */
  onTabItemTap() {
    if (this.canScrollTop) {
      this.goTop();
    }
  }
  /*******************生命周期**********************/

  /*******************页面初始化逻辑**********************/
  /**
   * 解决分享页面跳转先打开送到家首页，后打开分享页面；
   * 如果retureUrl存在，则跳转到指定分享页面；
   */
  handleWithOptionsParams() {
    console.log(
      '【首页入参】:',
      getCurrentInstance().router.params,
      getCurrentInstance().router
    );

    const option = getCurrentInstance().router.params;
    let { returnUrl, from } = option;
    // 邀请有礼
    if (returnUrl) {
      // 通过协议打开小程序
      if (from === 'scheme' && wx.getLaunchOptionsSync().scene === 1065) {
        returnUrl = returnUrl.replace(/\$/g, '%');
      }
      if (returnUrl.indexOf('inviteHasGifts.html') > -1) {
        Taro.navigateTo({
          url: `/pages-a/invitation/index`,
        });
      } else {
        Taro.navigateTo({
          url: decodeURIComponent(returnUrl),
        });
      }
    }
    // 新人专区落地页 spareSp:备用sp
    if (option.pageId === '0225') {
      const sp =
        option.spareSp ||
        (option.sp && option.sp !== '(null)' ? option.sp : '');
      Taro.navigateTo({
        url: `/pages/secondaryActivity/newcustomer/index?sp=${sp}&venderId=${option.venderId}&inviterTenantId=${option.inviterTenantId}`,
      });
    }

    // 新人有礼
    if (option.type) {
      if (option.type === 'new-customer') {
        utils.navigateToH5({
          page: `${h5Url}/new-customer/?id=6960&channel=jd`,
        });
      }
    }
    // 朋友圈投放广告
    if (option.ad) {
      const params = option.ad.split('-');
      const storeId = (params && params[2]) || '';
      const pageType = option.pageType || '';
      //如果是固定页类型 如：茅台-maotai
      if (pageType) {
        utils.navigateToH5({
          page: `${h5Url}/channel/${pageType}?id=${params[0]}&from=jdad&entrancedetail=${params[1]}`,
        });
        return;
      }
      utils.navigateToH5({
        page: `${h5Url}/channel/?id=${params[0]}&from=jdad&entrancedetail=${params[1]}&storeId=${storeId}`,
      });
    }
    // 小程序码
    if (option.scene) {
      getRealUrl(decodeURIComponent(option.scene)).then((res) => {
        const code = decodeURIComponent(res.code);
        console.log('scene: ', code);

        if (
          (code.indexOf('activity.html') > -1 && code.indexOf('?') > -1) ||
          (code.indexOf('?') > -1 && code.indexOf('/channel') > -1)
        ) {
          // 活动页
          Taro.navigateTo({
            url: `/pages/activity/index?${code.split('?')[1]}`,
          });
        } else if (code.indexOf('detail.html') > -1 && code.indexOf('?') > -1) {
          // 商详
          Taro.navigateTo({
            url: `/pages/detail/index?${code.split('?')[1]}`,
          });
        } else if (code.indexOf('http') > -1 && code.indexOf('?') > -1) {
          // 商详
          Taro.navigateTo({
            url: `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
              code.replace('forwardUrl=', '')
            )}`,
          });
        } else {
          Taro.navigateTo({
            url: `/pages/activity/index?${
              code.indexOf('?') > -1 ? code.split('?')[1] : code
            }`,
          });
        }
      });
    }
    // 通过服务通知跳转拼团详情页
    if (from === 'MiniappPush') {
      console.log('服务通知去拼团');
      utils.navigateToH5({
        page: Taro.getApp().h5RequestHost + `/coupon/?showNavigationBar=1`,
      });
    }
  }

  /**
   * 首次进入清除缓存去走定位接口，然后更新判断的状态值
   */
  onSetSence() {
    Taro.getStorage({ key: 'scene' })
      .then(({ data: scene }) => {
        console.log(`【场景值】：${scene}`);
        this.setState({
          scene,
        });

        if (
          !(
            scene == 1007 || // 单人聊天会话中的小程序消息卡片
            scene == 1008 || // 群聊会话中的小程序消息卡片
            scene == 1011 || // 扫描二维码
            scene == 1012 || // 长按图片识别二维码
            scene == 1013 || // 扫描手机相册中选取的二维码
            scene == 1017 || // 前往小程序体验版的入口页
            scene == 1036 || // App 分享消息卡片
            scene == 1044 || // 带 shareTicket 的小程序消息卡片
            scene == 1047 || // 扫描小程序码
            scene == 1048 || // 长按图片识别小程序码
            scene == 1049 || // 扫描手机相册中选取的小程序码
            scene == 1096
          ) // 聊天记录，打开小程序
        ) {
          try {
            Taro.setStorage({ key: 'addressInfo', data: '' });
          } catch (e) {
            console.log(e);
          }
        }
        // 根据场景值，当天首次展示添加我的小程序
        if (
          scene == 1005 ||
          scene == 1006 ||
          scene == 1007 ||
          scene == 1008 ||
          scene == 1009 ||
          scene == 1010 ||
          scene == 1011 ||
          scene == 1012 ||
          scene == 1013 ||
          scene == 1036 ||
          scene == 1047 ||
          scene == 1048 ||
          scene == 1049 ||
          scene == 1017 ||
          scene == 1035 ||
          scene == 1037
        ) {
          Taro.getStorage({ key: 'appletTime' })
            .then(({ data: appletTime }) => {
              if (new Date().toDateString() !== appletTime.toDateString()) {
                this.setState(
                  {
                    isShowApplet: true,
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        isShowApplet: false,
                      });
                    }, 30000);
                  }
                );
                try {
                  Taro.setStorage({ key: 'appletTime', data: new Date() });
                } catch (e) {
                  console.log(e);
                }
              }
            })
            .catch((err) => {
              console.log(err);
              this.setState(
                {
                  isShowApplet: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      isShowApplet: false,
                    });
                  }, 30000);
                }
              );
              try {
                Taro.setStorage({ key: 'appletTime', data: new Date() });
              } catch (e) {
                console.log(e);
              }
            });
        } else {
          try {
            Taro.setStorage({ key: 'appletTime', data: new Date() });
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch((err) => console.log('未获取到场景值', err));
  }

  /**
   * 初始化请求数据
   */
  initData() {
    // 重置参数
    this.exposureData = {};
    this.recommend.max = 1;
    this.recommend.page = 0;
    this.remainingFloor = 10;
    this.startFloor = 0;
    this.hasRecommend = false;
    this.hasRecommendForYou = false;
    this.hasShopInfoPagedList = false;
    this.shopListArgs.page = 0;
    this.setState({
      shopInfoPagedList: [],
      recommendforYouListLeft: [],
      recommendforYouListRight: [],
    });
    const home_storeId = Taro.getStorageSync('home_storeId');
    Taro.removeStorageSync('bubble'); // 清除底部导航 7club 气泡数据
    if (
      home_storeId &&
      this.state.storeId &&
      home_storeId.toString() !== this.state.storeId.toString()
    ) {
      this.recommend = {
        max: 1,
        page: 0,
        pageSize: 40,
      };
    }

    // 获取楼层数据
    try {
      this.getFloors(this.startFloor, this.pageSize);
    } catch (error) {
      this.setState({
        isLoad: false,
      });
    }

    this.newUserTaskPop(); //新人一转N弹窗

    // 获取默认搜索词
    this.getSearchDefaultKeyWord();
    // 获取购物车数量
    this.getCartNum();
    // 获取分类信息
    this.categoryGetall();
    this.setState(
      {
        logined: isLogined(),
      },
      () => {
        if (!this.state.logined || !Taro.getStorageSync('fuDaiDataFlag')) {
          this.getSingleFloor();
        } else {
          this.getGrabRedPacket();
        }
        if (this.state.logined) {
          // this.redPasswordPop();
        }
        console.log('口令红包', this.state.floors, this.state.floors.length);
        const clickIndexTab = Taro.getStorageSync('clickIndexTab');
        if (!isLogined() && !clickIndexTab) {
          // this.redPasswordPop();
        }
      }
    );
    this.getIndexEntrance();
  }

  /**
   * 获取首页楼层
   * @param {*} startF 起始楼层
   * @param {*} pageSize 每页楼层数量
   */
  getFloors(startF, pageSize) {
    const endF = startF + pageSize;
    this.getInitData(startF, endF).then((res) => {
      if (res && res.floors) {
        // if (pageSize === this.pageSize) {
        //   //页面加载第一次请求接口，处理新人专区登录回调相关
        //   this.handlerNewCustomerCallback(res);
        // }

        this.handleFloorsData(res);
        this.setState(
          {
            floors:
              pageSize === this.pageSize
                ? res.floors
                : this.state.floors.concat(res.floors),
            navImage: res.navImage || '',
          },
          () => {
            //触发新人专区楼层滚动-start
            if (this.hasNewCustomer) {
              this.hasNewCustomer = false;
              this.handlerNewCustomerScroll();
            }
            //触发新人专区楼层滚动-end
            Taro.stopPullDownRefresh();
            if (res.remainingFloor > 0) {
              this.getFloors(
                endF + 1,
                res.remainingFloor > 6 ? 6 : res.remainingFloor
              );
            } else {
              Taro.removeStorageSync('home');
              Taro.setStorageSync('home', {
                ...res,
                floors: this.state.floors,
              });
              // 楼层曝光数据埋点
              const { floors } = this.state;
              floors &&
                floors.map((val, i) => {
                  if (val && val.clsTag) {
                    getPageExposure({
                      obj: this,
                      id: `floor-${val.floorType}-${val.sort}-`,
                      num: 0,
                      eid: val.clsTag,
                      data: {
                        ...val,
                        expAction: {
                          floorIndex: i + 1,
                          target: 1,
                        },
                      },
                    });
                  }
                });
            }
          }
        );
        const recommendForYouFloor = res.floors.filter(
          (val) => val.floorType === 55
        )[0];

        if (
          recommendForYouFloor &&
          recommendForYouFloor.tab &&
          recommendForYouFloor.tab.length > 0
        ) {
          if (
            recommendForYouFloor.tab[0] &&
            recommendForYouFloor.tab[0].contents &&
            recommendForYouFloor.tab[0].contents.pageList
          ) {
            const recommendforYouList = this.filterRecommendforYouListSearch(
              recommendForYouFloor.tab[0].contents.pageList.filter(
                (item) => item.style !== 6 && item.style !== 3
              )
            );

            this.separateData(recommendforYouList);
          }
          this.recommendForYouData = recommendForYouFloor;
          this.hasRecommendForYou = true;
          this.recommend.max = 2;
          this.recommend.page = 1;
        }
      }
    });
  }

  //为你推荐分成左右两列
  separateData = (data) => {
    this.recommendforYouList = data;
    if (!data || data.length === 0) return;
    let { recommendforYouListLeft, recommendforYouListRight } = this.state;
    let heightData = this.heightDataTotal; //接收累计高度的容器数组
    data.forEach((item) => {
      let height = this.getHeight(item); //拿到高度
      let minNum = Math.min.apply(null, heightData); // 从heighetData筛选最小项
      let minIndex = heightData.indexOf(minNum); // 获取 最小项的小标 准备开始进行累加
      heightData[minIndex] = heightData[minIndex] + height; //从 heightData 中找到最小的项后进行累加，
      if (minIndex === 0) {
        //[0]加到left [1]加到 right
        recommendforYouListLeft.push(item);
      } else {
        recommendforYouListRight.push(item);
      }
    });
    this.heightDataTotal = heightData;
    this.setState(
      {
        recommendforYouListLeft,
        recommendforYouListRight,
      },
      () => {
        //存放当前tab数据
        this.recommend[`tab${this.tabIndex}`] = {
          listLeft: this.state.recommendforYouListLeft,
          listRight: this.state.recommendforYouListRight,
          page: this.recommend.page,
          max: this.recommend.max,
        };
      }
    );
  };

  //获取为你推荐每个组件的高度
  getHeight = (item) => {
    let height = 0;
    if (item && item.style === 5) {
      height = 468;
    } else if (item && item.style === 4) {
      height = 494;
    } else if (item && item.style === 3) {
      height = 544;
    } else if (item && item.style === 2) {
      height = 460;
    } else if (item && item.style === 1) {
      // if (item.advertisement || item.av || item.promotionTypes) {
      //   height = 520;
      // } else {
      //   height = 500;
      // }
      if (item.smartAV && item.smartAV.content) {
        if (item.promotionTypes) {
          height = 570;
        } else {
          height = 520;
        }
      } else {
        height = 520;
      }
    } else if (item && item.style === 100) {
      height = 536;
    }
    // console.log(item&&item.style,height)
    return height;
  };

  /**
   * 初始化执行逻辑
   * @param {*} addressInfo 门店信息
   */
  initPage(addressInfo = {}) {
    console.log(1111111, addressInfo);
    this.addressId = addressInfo.addressId || '';
    this.setState(
      {
        addressExt: addressInfo.addressExt || '',
        sendTo: addressInfo.sendTo || '',
        isShowTopAddr: true,
        addrInfo: addressInfo,
        storeId: addressInfo.storeId,
        tenantId: addressInfo.tenantId || 1,
        platformId: addressInfo.platformId || 1,
        recommendForYouProps: {
          fixedNav: false,
          tabIndex: 0,
          showLoading: false,
          showRefresh: false,
        },
        fix: addressInfo.fix || false,
        fLat: addressInfo.lat || '',
        fLon: addressInfo.lon || '',
      },
      () => {
        this.initData();
      }
    );

    this.coords = {
      lng: addressInfo.lon || '',
      lat: addressInfo.lat || '',
    };

    // 同步公共数据
    app.globalData = {
      ...app.globalData,
      storeId: addressInfo.storeId || '',
      tenantId: addressInfo.tenantId || 1,
      platformId: addressInfo.platformId || 1,
      coords:
        addressInfo.lon && addressInfo.lat
          ? [addressInfo.lon, addressInfo.lat]
          : ['', ''],
      fix: addressInfo.fix || false,
    };
  }

  /*
   * 首次打开页面初始化
   * 如果有缓存，先走缓存渲染，优先渲染页面，再走接口
   * 异步获取可能会存在在接口之后获取到缓存数据
   */
  firstPageInit(storeId = '', lon = '', lat = '') {
    Taro.getStorage({ key: 'home' })
      .then(({ data: home }) => {
        if (home.storeId === storeId) {
          home && this.setPageInfo(home, true);
        }
      })
      .catch(() => console.log('首页数据未缓存'));

    this.getStoreId(storeId, lon, lat)
      .then((res) => {
        if (res && res.bottoming === true) {
          this.hasShopInfoPagedList = true;
          this.shopListArgs.page = 0;
          this.initData();
          this.getShopInfoPagedList();
        } else {
          this.initPage(res);
          this.showPageIndexTools();
        }
        const _addrInfo = Taro.getStorageSync('addressInfo');
        this.setState({
          addrInfo: _addrInfo,
          tenantShopInfoList: _addrInfo && _addrInfo.tenantShopInfo,
        });
      })
      .catch((err) => {
        console.log(err);
        this.initData();
      });
  }

  /**
   * 根据经纬度判断是否显示下拉工具楼层
   */
  showPageIndexTools() {
    Taro.getLocation({ type: 'gcj02' })
      .then((res) => {
        getPositionApi({
          data: {
            lat: res.latitude,
            lon: res.longitude,
            platformId: 1,
          },
        }).then((result) => {
          if (
            result &&
            result.nearStore &&
            result.tenantShopInfoList &&
            result.tenantShopInfoList[0] &&
            result.tenantShopInfoList[0].storeId === this.state.storeId
          ) {
            this.setState({
              showPageIndexTools: true,
              // isFirstShowPageIndexTools: true,
            });
            Taro.setStorageSync('showPageIndexTools', true);
          } else {
            this.setState({
              showPageIndexTools: false,
            });
            Taro.setStorageSync('showPageIndexTools', false);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          showPageIndexTools: false,
        });
        Taro.setStorageSync('showPageIndexTools', false);
      });
  }

  /*******************页面初始化逻辑**********************/

  /*******************数据请求**********************/

  /**
   * 三公里定位逻辑获取门店
   * @param {*} storeId 门店Id
   */
  getStoreId(storeId, lon = '', lat = '') {
    const option = getCurrentInstance().router.params;
    let id = '';
    let type = '';
    if (option.returnUrl) {
      let parmas = getURLParameter(
        decodeURIComponent(option.returnUrl).split('?')[1]
      );
      let targetPage = decodeURIComponent(option.returnUrl).split('?')[0];
      if (
        parmas.h5_url &&
        (parmas.h5_url.indexOf('activity.html') > -1 ||
          parmas.h5_url.indexOf('channel') > -1 ||
          parmas.h5_url.indexOf('food-detail') > -1)
      ) {
        storeId =
          getUrlParams(decodeURIComponent(parmas.h5_url)).storeId || storeId;
        id = getUrlParams(decodeURIComponent(parmas.h5_url)).id || '';
        lon = getUrlParams(decodeURIComponent(parmas.h5_url)).lon || lon;
        lat = getUrlParams(decodeURIComponent(parmas.h5_url)).lat || lat;
        type = parmas.h5_url.indexOf('food-detail') > -1 ? 4 : 2;
      } else if (parmas && targetPage.indexOf('pages/detail') > -1) {
        storeId = parmas.storeId || storeId;
        lon = parmas.lon || lon;
        lat = parmas.lat || lat;
        type = 4;
      } else if (parmas) {
        storeId = parmas.storeId || storeId;
        lon = parmas.lon || lon;
        lat = parmas.lat || lat;
        type = 3;
      }
    }
    // 获取定位门店信息，如果缓存和三公里不一样走三公里定位门店渲染
    return getUserStoreInfo(storeId, lon, lat, id, type).then((args) => {
      return args;
    });
  }

  /**
   * 新版推荐
   */
  getRecommendForYou(tabIndex, isScrollToLower, isTemp) {
    console.log(isTemp);
    const { recommendForYouProps, storeId } = this.state;
    const recommendForYouData = this.recommendForYouData;
    this.recommend.page++;
    if (this.recommend.max < this.recommend.page) {
      this.showBottonLogo = true;
      this.setState({ isBottomLoad: false, isRecommedLoad: false });
      return;
    }
    // 为你推荐-浏览页码 埋点
    if (isScrollToLower) {
      const tab = this.getRecommendForYouTabData();
      logClick({
        eid: '7FRESH_APP_2_201803183|49',
        eparam: {
          tabName: tab && tab.title,
          storeId: storeId,
          page: this.recommend.page,
        },
      });
    }
    recommendForYouProps.showLoading = true;
    this.setState(
      {
        recommendForYouProps,
        isRecommedLoad: false,
      },
      () => {
        let params = {
          page: this.recommend.page,
          pageSize: this.recommend.pageSize,
          tabType:
            recommendForYouData &&
            recommendForYouData.tab &&
            recommendForYouData.tab[tabIndex || recommendForYouProps.tabIndex]
              .tabType,
          recommendTabId:
            recommendForYouData && recommendForYouData.recommendTabId,
          tabId:
            recommendForYouData &&
            recommendForYouData.tab &&
            recommendForYouData.tab[tabIndex || recommendForYouProps.tabIndex]
              .tabId,
        };

        getIndexRecommendTabInfo(params)
          .then((res) => {
            if (res) {
              this.recommend.max = res.totalPage;
              let resRecommendList = res.pageList || [];

              // 为你推荐---55
              if (resRecommendList && resRecommendList.length > 0) {
                this.blackSkuList.forEach((skuIds) => {
                  resRecommendList.forEach((item, index, arr) => {
                    if (Number(skuIds) === item.skuId) {
                      arr.splice(index, 1);
                      item = this.handleProductItem(item);
                    }
                  });
                });
              }

              recommendForYouProps.showLoading = false;
              recommendForYouProps.showRefresh = false;
              const recommendforYouList = this.filterRecommendforYouListSearch(
                resRecommendList.filter(
                  (item) => item.style !== 6 && item.style !== 3
                )
              );

              this.separateData(recommendforYouList);

              this.setState(
                {
                  recommendforYouList,
                  recommendForYouProps,
                  isBottomLoad: false,
                },
                () => {
                  if (this.recommend.page >= this.recommend.max) {
                    this.showBottonLogo = true;
                    this.setState({ isRecommedLoad: false });
                    return;
                  }
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
            recommendForYouProps.showLoading = false;
            recommendForYouProps.showRefresh = true;
            this.setState({
              recommendForYouProps,
              isBottomLoad: false,
              isRecommedLoad: false,
            });
          });
      }
    );
  }

  //过滤为你推荐不满5个热词的搜索组件
  filterRecommendforYouListSearch = (recommendforYouList) => {
    const newRecommendforYouList = [];
    for (let i = 0; i < recommendforYouList.length; i++) {
      if (recommendforYouList[i].style === 4) {
        const hotWordLocalList = recommendforYouList[i].hotWordLocalList;
        if (hotWordLocalList && hotWordLocalList.length > 5) {
          newRecommendforYouList.push(recommendforYouList[i]);
        }
      } else {
        newRecommendforYouList.push(recommendforYouList[i]);
      }
    }
    return newRecommendforYouList;
  };

  //渲染页面数据
  setPageInfo(res) {
    this.handleFloorsData(res);
    let recommendForYouDataArr = res.floors.filter(
      (val) => val.floorType === 55
    );
    let newCustomerDataArr = res.floors.filter((val) => val.floorType === 40);
    //新人专区是否有滑动交互
    this.newCustomerPosition =
      (newCustomerDataArr &&
        newCustomerDataArr[0] &&
        newCustomerDataArr[0].autoPosition) ||
      false;
    this.remainingFloor = res.remainingFloor || 0;
    this.startFloor = this.pageSize;
    this.hasRecommend =
      res.floors.filter((val) => val.floorType === 30 && val.floorStyle === 1)
        .length > 0;
    this.hasRecommendForYou = recommendForYouDataArr.length >= 1;
    this.recommendForYouData =
      recommendForYouDataArr.length >= 1 ? recommendForYouDataArr[0] : {};
    const recommendforYouList =
      recommendForYouDataArr.length >= 1 &&
      recommendForYouDataArr[0].tab[0].contents &&
      recommendForYouDataArr[0].tab[0].contents.pageList
        ? this.filterRecommendforYouListSearch(
            recommendForYouDataArr[0].tab[0].contents.pageList.filter(
              (item) => item.style !== 6 && item.style !== 3 // 3是app直播
            )
          )
        : [];

    this.separateData(recommendforYouList);
    this.setState(
      {
        navImage: res.navImage || '',
        floors: res.floors,
        loaded: true,
        isLoad: false,
      },
      () => {
        if (recommendforYouList && recommendforYouList.length > 0) {
          this.recommend.max = 2;
          this.recommend.page = 1;
        }
      }
    );
  }

  /**
   * 首页楼层请求接口
   * @param {*} startF 起始楼层
   * @param {*} endF 结束楼层
   */
  getInitData(startF = 0, endF) {
    const { storeId, tenantId = 1, platformId = 1 } = this.state;
    return getNewIndexServer({
      storeId,
      tenantId,
      platformId,
      data: { startF, endF },
    }).then((res) => {
      this.setState({
        isLoad: false,
      });
      if (!(res && res.floors)) {
        if (this.count < 4) {
          this.count++;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.getInitData(startF, endF));
            }, 500);
          });
        } else {
          console.log('接口返回无数据');
          this.count = 0;
          return { floors: [] };
        }
      }
      this.count = 0;
      return res;
    });
  }

  getIndexcolumnBox = (startF = 0, endF, floorIndex) => {
    const { storeId, tenantId = 1, platformId = 1 } = this.state;
    getIndexcolumnBox({
      storeId,
      tenantId,
      platformId,
      data: { startF, endF },
    }).then((r) => {
      if (r && r.floors && r.floors.length > 0) {
        let resultList = [],
          afterResultList = [];
        r.floors.forEach((e, i) => {
          const buriedPointVo = {
            ...e.buriedPointVo,
            floorIndex: floorIndex,
            columnIndex: i + 1,
          };
          e.buriedPointVo = buriedPointVo;
          e.floorIndex = floorIndex;
          e.columnIndex = i + 1;
          resultList.push(e);
        });

        this.columnRuleList.forEach((ele, index) => {
          let showType = ele.showType;
          afterResultList[index] = [];
          resultList.forEach((e, i) => {
            if (i < showType && resultList.length >= showType) {
              afterResultList[index].push(e);
            }
          });
          afterResultList = afterResultList.filter(
            (item) => JSON.stringify(item) !== undefined && item.length > 0
          );
          resultList.splice(0, showType);
        });

        this.setState(
          {
            afterResultList: afterResultList,
          },
          () => {
            const columnStoreId = Taro.getStorageSync('addressInfo');
            Taro.setStorageSync('columnList', this.state.afterResultList);
            Taro.setStorageSync(
              'columnStoreId',
              columnStoreId && columnStoreId.storeId
            );
          }
        );
      } else {
        this.setState(
          {
            afterResultList: [],
          },
          () => {
            Taro.getStorageSync('columnList', []);
          }
        );
      }
    });
  };

  /**
   * 获取保健品相关skuList
   */
  getRedisGet() {
    getRedisGet({ data: {} }).then((data) => {
      if (data && typeof data === 'string') {
        data = !!data ? data.split(',') : [];
        this.blackSkuList = data;
      }
    });
  }

  /**
   * 获取单楼层接口
   */
  getSingleFloor() {
    const params = {
      floorType: '21',
    };
    //已经获取完弹层数据了
    this.getFuDaiDataOver = false;
    getSingleFloor({ data: params }).then((data) => {
      if (data.success) {
        this.setState(
          {
            fuDaiData: {
              ...data.floor,
              image: data.floor && (data.floor.imageGif || data.floor.image),
            },
          },
          () => {
            if (!data.floor) {
              // 新人专区滑动效果
              this.getFuDaiDataOver = true;
              this.handlerNewCustomerScroll();
            }
          }
        );
      } else {
        Taro.showToast({
          title: data.msg || '',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  }

  /**
   * 领取福袋接口
   * @param {*} fuDaiData 福袋数据
   */
  getGrabRedPacketApi(fuDaiData) {
    getGrabRedPacket().then((res) => {
      if (!res.success) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        });
        this.setState(
          {
            fuDaiData: {},
          },
          () => {
            Taro.removeStorageSync('fuDaiDataFlag');
          }
        );

        return;
      }
      fuDaiData = {
        ...fuDaiData,
        isClickCoupon: true,
      };
      if (res.status === 3) {
        Taro.removeStorageSync('fuDaiDataFlag');
        fuDaiData = {
          ...fuDaiData,
          image: fuDaiData.failVision && fuDaiData.failVision.image,
          action: fuDaiData.failVision && fuDaiData.failVision.action,
          Looting: true,
        };
      } else if (res.status === 1) {
        Taro.removeStorageSync('fuDaiDataFlag');
        fuDaiData = {
          ...fuDaiData,
          image: fuDaiData.successVision && fuDaiData.successVision.image,
          action: fuDaiData.successVision && fuDaiData.successVision.action,
          isFuDaiCoupon: true,
          couponInfoList: res.couponInfoList ? res.couponInfoList : [],
        };
      } else if (res.status === 2) {
        fuDaiData = {};
      } else if (res.status === 0) {
        Taro.removeStorageSync('fuDaiDataFlag');
      }
      this.setState(
        {
          fuDaiData,
        },
        () => {
          if (res.status === 2 && Taro.getStorageSync('fuDaiDataFlag')) {
            Taro.showToast({
              title: res.grabTextNotice || '您已领取过',
              icon: 'none',
              duration: 2000,
            });
            Taro.removeStorageSync('fuDaiDataFlag');
          }
        }
      );
    });
  }

  /**
   * 获取购物车数量接口
   */
  getCartNum() {
    const { storeId } = this.state;
    getCartNum(storeId).then((res) => {
      this.setState({
        cartNum: res && res.allCartWaresNumber,
      });
      app.globalData.cartNum = res && res.allCartWaresNumber;
    });
  }

  /**
   * 一级分类接口
   */
  categoryGetall() {
    const params = { source: 1 };
    categoryV2GetFirstCategory({ data: params }).then((data) => {
      if (data && data.allCategoryList) {
        this.setState({
          allCategoryList: data.allCategoryList || [],
        });
      }
    });
  }

  /**
   * 加车接口
   * @param {*} data 加车数据
   */
  _addCart(data) {
    this.onProductAddCart(data);
    // 鲜橙新埋点
    console.log('_addCart', data);
    if (data.buriedPointVo && data.buriedPointVo.pageId && data.action) {
      commonLogClick({
        action: data.action,
        buriedPointVo: data.buriedPointVo,
      });
    }
    const {
      skuId,
      startBuyUnitNum = 1,
      serviceTagId = 0,
      selectedTasteInfoIds = {},
    } = data;
    addCartSever({
      data: {
        wareInfos: {
          skuId,
          buyNum: startBuyUnitNum | 1,
          serviceTagId: serviceTagId,
          selectedTasteInfoIds: selectedTasteInfoIds,
        },
      },
    })
      .then((res) => {
        if (res.success) {
          //新人专享价商品的多次加购时处理
          let newPeopleAddCartTip = Taro.getStorageSync('newPeopleAddCartTip');
          let isAgainAddGoodsTmp = Taro.getStorageSync('isAgainAddGoods');
          let isAgainAddGoods = isAgainAddGoodsTmp
            ? JSON.parse(isAgainAddGoodsTmp)
            : {};
          if (
            newPeopleAddCartTip &&
            isAgainAddGoods &&
            isAgainAddGoods['skuId' + skuId] >= 1
          ) {
            Taro.showToast({
              title: '加购2件及以上将以原价结算呦~',
              icon: 'none',
              duration: 2000,
            });
          } else {
            Taro.showToast({
              title: res.msg || '添加成功！',
              icon: res.msg && res.msg.length > 7 ? 'none' : 'success',
              duration: 2000,
            });
          }
          // 记录新人专享价已加车成功商品
          Taro.setStorageSync(
            'isAgainAddGoods',
            JSON.stringify({
              ...isAgainAddGoods,
              ['skuId' + skuId]: 1,
            })
          );
          this.setState({
            cartNum: res && res.allCartWaresNumber,
            addCartPopData: '',
          });
          app.globalData.cartNum = res && res.allCartWaresNumber;
        } else {
          Taro.showToast({
            title: res.msg || '添加失败！',
            icon: 'none',
            duration: 2000,
          });
        }
      })
      .catch(() => {
        Taro.showToast({
          title: '加车失败',
          icon: 'none',
          duration: 2000,
        });
      });
  }

  /**
   * 是否关注公众号接口
   * @param {*} unionId
   */
  isFollowWx() {
    getIsConcernService({
      appId: 'wxaa4f871ccd55cb2a', //入参是公众号Id
    })
      .then((res) => {
        if (res && res.success) {
          this.setState(
            {
              isConcern: res && res.concern,
            },
            () => {
              console.log('是否关注过公众号', res);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * 获取默认搜索暗纹词
   */
  getSearchDefaultKeyWord() {
    getSearchNewDefaultKeyWord().then((res) => {
      let defaultKeyWord = [{ keyword: '搜索七鲜美食商品' }];
      if (res && res.keyWordItemList && res.keyWordItemList.length > 0) {
        defaultKeyWord = res.keyWordItemList;
      }
      this.setState({
        defaultKeyword: defaultKeyWord,
      });
    });
  }

  /**
   * 获取拖底店铺列表接口
   */
  getShopInfoPagedList() {
    this.shopListArgs.page++;
    const params = {
      page: this.shopListArgs.page,
      pageSize: this.shopListArgs.pageSize,
    };
    getShopInfoPageListService(params)
      .then((res) => {
        if (
          res &&
          res.shopInfoList &&
          res.shopInfoList.pageList &&
          res.shopInfoList.pageList.length > 0
        ) {
          const pageList = res.shopInfoList.pageList;
          this.setState(
            {
              shopInfoPagedList: this.state.shopInfoPagedList.concat(pageList),
              isLoad: false,
            },
            () => {
              let floorData = this.state.floors;
              if (!floorData || floorData.length === 0) {
                floorData = [
                  {
                    floorType: 8,
                    shopInfoList: { pageList: [] },
                  },
                ];
              }
              if (
                floorData.filter((item) => item.floorType === 8).length === 0
              ) {
                floorData.push({
                  floorType: 8,
                  shopInfoList: { pageList: [] },
                });
              }
              if (floorData && floorData.length > 0) {
                for (let i = 0; i < floorData.length; i++) {
                  if (
                    floorData[i] &&
                    floorData[i].floorType &&
                    floorData[i].floorType === 8
                  ) {
                    floorData[i].shopInfoList.pageList =
                      this.state.shopInfoPagedList;
                  }
                }
                this.setState({
                  floors: floorData,
                });
              }
              this.getShopInfoPagedList();
            }
          );
        } else {
          this.hasShopInfoPagedList = false;
          this.setState({
            isLoad: false,
            isBottomLoad: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          isLoad: false,
        });
      });
  }
  /*******************数据请求**********************/

  /*******************响应事件**********************/
  //处理点击新人专区登录回调相关
  handlerNewCustomerCallback = () => {
    const clickFirstOrderZone = Taro.getStorageSync('clickFirstOrderZone');
    const firstOrderZoneGetCoupon = Taro.getStorageSync(
      'firstOrderZoneGetCoupon'
    );
    const newCustomerTmp = Taro.getStorageSync('newCustomerAction');
    const newCustomerAction = newCustomerTmp
      ? newCustomerTmp && typeof newCustomerTmp === 'object'
        ? newCustomerTmp
        : JSON.parse(newCustomerTmp)
      : {};
    console.log('newCustomerTmp=>', newCustomerTmp, newCustomerAction);
    // userLogin().
    getLoginStatus().then((res) => {
      if (res && res.success) {
        this.setState(
          {
            logined: res.success,
          },
          () => {
            this.isFreshPerson = res && res.freshPerson;
            //登录完成领取新人专区惠券
            if (this.state.logined && firstOrderZoneGetCoupon) {
              if (res.isNewUser === 1) {
                this.sureApplyWelfare();
              } else {
                Taro.showToast({
                  title: '您已是七鲜家的人啦，快去逛逛吧~',
                  icon: 'none',
                  duration: 2000,
                });
              }
              Taro.setStorageSync('firstOrderZoneGetCoupon', false);
              this.initData();
            } else if (this.state.logined && clickFirstOrderZone) {
              //没有下过单
              if (this.isFreshPerson) {
                if (
                  newCustomerAction &&
                  typeof newCustomerAction === 'object'
                ) {
                  Taro.setStorageSync('newCustomerAction', '');
                  Taro.setStorageSync('clickFirstOrderZone', false);
                  this.goToUrl(newCustomerAction);
                }
              } else {
                Taro.showToast({
                  title: '您已是七鲜家的人啦，快去逛逛吧~',
                  icon: 'none',
                  duration: 2000,
                });
                Taro.setStorageSync('clickFirstOrderZone', false);
                Taro.setStorageSync('newCustomerAction', '');
              }
            }
          }
        );
      }
    });
  };

  /**
   * 新人自动滑动定位至新人专区组件
   * 触发时机：用户打开APP/小程序/H5首页时，且弹窗被关闭后触发（同1个session仅触发1次）
   * 针对用户：全渠道新用户+未登录用户
   * 根据魔法石给到的“开关”，可选择开启/关闭自动滑动定位
   **/
  handlerNewCustomerScroll = () => {
    //记录交互只触发一次
    let alreadyShowNewCustomer =
      Taro.getStorageSync('alreadyShowNewCustomer') || false;
    if (
      this.getFuDaiDataOver &&
      this.newCustomerPosition &&
      this.isFreshPerson &&
      !alreadyShowNewCustomer
    ) {
      let tmp;
      if (tmp) {
        tmp.disconnect();
      }
      // 获取新人专区了楼层相关数据
      tmp = Taro.createSelectorQuery()
        .select('.new-born-box')
        .boundingClientRect((rect) => {
          if (rect) {
            let scrollTop =
              rect.top - (this.state.windowHeight - rect.height) / 2;
            Taro.pageScrollTo({
              scrollTop: scrollTop,
              duration: 0,
            });
            setTimeout(() => {
              this.setState(
                {
                  isShowNewCustomer: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      isShowNewCustomer: false,
                    });
                  }, 1500);
                  Taro.setStorageSync('alreadyShowNewCustomer', true);
                }
              );
            }, 1000);
          }
        })
        .exec();
    }
  };

  /**
   * 关闭福袋弹窗
   */
  onCloseCouponPop = () => {
    const { fuDaiData } = this.state;
    Taro.removeStorageSync('fuDaiDataFlag');
    if (fuDaiData.isFuDaiCoupon) {
      logClick({ eid: '7FRESH_miniapp_2_1578553760939|7' });
    }
    if (fuDaiData.Looting) {
      logClick({ eid: '7FRESH_miniapp_2_1578553760939|8' });
    }
    if (!fuDaiData.isClickCoupon) {
      logClick({ eid: '7FRESH_miniapp_2_1578553760939|9' });
      //红包
    }
    this.setState(
      {
        fuDaiData: {},
      },
      () => {
        this.getFuDaiDataOver = true;
        this.handlerNewCustomerScroll();
      }
    );
  };

  // 关闭口令红包弹框
  onCloseRedPop = () => {
    this.setState({
      goCopyFlag: false,
    });
  };

  onCloseGetPop = () => {
    this.setState({
      customerFlag: false,
    });
  };

  /**
   * 领取福袋事件
   */
  getGrabRedPacket() {
    Taro.setStorageSync('fuDaiDataFlag', true);
    logClick({ eid: '7FRESH_miniapp_2_1578553760939|6' });
    if (!this.state.logined) {
      this.setState({ fuDaiData: {} }, () => {
        utils.gotoLogin('/pages/index/index', 'switchTab');
      });
      return;
    }
    let { fuDaiData } = this.state;
    const params = {
      floorType: '21',
    };
    if (JSON.stringify(fuDaiData) === '{}') {
      getSingleFloor({ data: params }).then((data) => {
        this.getGrabRedPacketApi(data.floor);
      });
    } else {
      this.getGrabRedPacketApi(fuDaiData);
    }
  }

  //为你推荐加车埋点
  addCartRecommendForYou = (buriedPointVo, data) => {
    const tab = this.getRecommendForYouTabData();
    logClick({
      eid: '7FRESH_APP_2_201803183|48',
      eparam: {
        tabName: tab && tab.title,
        storeId: data && data.storeId,
        index: data && data.index,
        skuId: data && data.skuId,
      },
    });

    structureLogClick({
      eventId: 'frontPage_recommend_tabID_addCart',
      jsonParam: {
        firstModuleId: 'bottomRecommend',
        firstModuleName: '为你推荐',
        secondModuleId: tab && tab.tabId,
        secondModuleName: tab && tab.title,
        clickType: 1,
        skuId: data && data.skuId,
        skuName: data && data.skuName,
        listPageIndex: data && data.index,
        broker_info: data && data.brokerInfo,
      },
    });

    this.addCart({ ...data, buriedPointVo });
  };

  //加车 是否弹框/直接加车
  addCart = (data) => {
    if (data.isPop === true) {
      this.setState({
        addCartPopData: data,
        showBusinessesList: false,
        showPageIndexTools: false,
      });
    } else {
      this._addCart(data);
    }
  };

  //新人专区加车
  newCustomerAddCart = (buriedPointVo, info) => {
    let { floors } = this.state;
    let newCustomerFloor = floors.filter((item) => item.floorType === 40);
    let newPeopleAddCartTip =
      (newCustomerFloor && newCustomerFloor[0].newPeopleAddCartTip) || false;

    if (info.addCart) {
      Taro.setStorageSync('newPeopleAddCartTip', newPeopleAddCartTip);
      this.addCart({ ...info, buriedPointVo });
    }
  };

  // 领取新人专区优惠券
  sureApplyWelfare = (val) => {
    console.log('xinren', val);
    if (this.state.logined) {
      this.alreadyGet = true;
      getNewUserApplyWelfare({}).then((res) => {
        if (res) {
          const msg = res.msg || '';
          if (res.success) {
            let floors = this.state.floors;
            if (floors) {
              this.couponCodes = res.couponCodes;
              floors.forEach((item) => {
                if (item.floorType === 40) {
                  item.haveReceived = true;
                }
              });
              this.setState(
                {
                  floors,
                },
                () => {
                  Taro.showToast({
                    title: msg || '恭喜，领取成功',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              );
              if (this.alreadyGet) {
                this.subscribe();
              }
            }
          } else {
            Taro.showToast({
              title: msg || '领取失败，请重试',
              icon: 'none',
              duration: 2000,
            });
          }
        }
      });
    } else {
      Taro.setStorageSync('firstOrderZoneGetCoupon', true);
      utils.gotoLogin('/pages/index/index', 'switchTab');
    }
  };

  //跳转新人专区二级页
  goToSecondaryPage = (buriedPointVo, data) => {
    this.handleAction(buriedPointVo, data.action);
  };

  /**
   * 称重商品取消加车
   */
  onCloseAddCartPop = (e) => {
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

  /**
   * 根据urlType进行页面跳转
   * @param {*} action 点击数据
   * @param {*} ev 点击
   */
  goToUrl = (action, ev) => {
    if (ev) {
      ev.stopPropagation();
    }
    goPage({
      action,
      storeId: this.state.storeId,
      coords: this.coords,
      tenantId: this.state.tenantId,
      platformId: this.state.platformId,
      allCategoryList: this.state.allCategoryList,
    });
    const { fuDaiData } = this.state;
    if (action.toUrl && fuDaiData && fuDaiData.popCondition === 2) {
      this.setState({
        fuDaiData: {},
      });
    }
  };

  /**
   * 展开浮动图
   */
  showFloorFloatImg = () => {
    if (this.state.isHideFloorFloatImg) {
      this.setState({
        isHideFloorFloatImg: false,
      });
    }
  };

  /**
   * 跳转商详
   * @param {*} skuId 商品id
   * @param {*} data 商品数据
   */
  goDetail = (skuId, data) => {
    if (data) {
      this.onProductTrigger(data);
    }
    if (data.prepayCardType) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/card-detail/index?from=miniapp&storeId=${this.state.storeId}&skuId=${skuId}&lng=${this.coords.lng}&lat=${this.coords.lat}&tenantId=${this.state.tenantId}&prepayCardType=${data.prepayCardType}`,
      });
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${skuId}&lng=${this.coords.lng}&lat=${this.coords.lat}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
      });
    }
  };

  /**
   * 跳转菜谱详情
   * @param {*} data 菜谱数据
   */
  goBillDetail(data) {
    logClick({ eid: '7FRESH_miniapp_2_1551092070962|60' });

    if (!data.contentId) return;
    Taro.navigateTo({
      url: `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${data.contentId}&planDate=${data.planDate}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
    });
  }

  /**
   * 切换门店
   * @param {*} data 门店数据
   */
  changeStoreId = (data) => {
    if (data && data.storeId) {
      this.setState({
        isLoad: true,
      });
      const addressInfo = {
        addressId: '',
        storeId: data.storeId,
        tenantId: data.tenantInfo.tenantId,
        tenantInfo: data.tenantInfo,
        lat: data.lat,
        lon: data.lon,
        coord: [],
        isDefault: false,
        where: '',
        addressSummary: '',
        addressExt: '',
        fullAddress: '',
        detailAddress: '',
        sendTo: data.storeName,
        storeName: data.storeName,
        tenantShopInfo: {},
        bottoming: false,
      };
      this.addressInfo = addressInfo;
      this.initPage(addressInfo);
      Taro.setStorageSync('addressInfo', addressInfo);
      this.goTop();
    }
  };

  /**
   * 点击切换租户
   * todo
   * @param {*} data 租户数据
   * @param {*} index
   */
  onChangeBusinesses = (data, index) => {
    Taro.setStorageSync('columnStoreId', '');
    Taro.setStorageSync('columnList', []);
    this.setState({
      afterResultList: [],
    });
    this.getSingleFloor();
    let tenantShopInfoList = [];
    let addressInfo = Taro.getStorageSync('addressInfo');
    if (
      addressInfo &&
      addressInfo.tenantShopInfo &&
      addressInfo.tenantShopInfo.length > 0
    ) {
      tenantShopInfoList = (addressInfo && addressInfo.tenantShopInfo) || [];
      if (tenantShopInfoList && tenantShopInfoList.length > 0) {
        for (let i = 0; i < tenantShopInfoList.length; i++) {
          if (i === Number(index)) {
            tenantShopInfoList[index].isSelected = true;
          } else {
            tenantShopInfoList[i].isSelected = false;
          }
        }
      }
    }

    addressInfo.tenantShopInfo = tenantShopInfoList;

    this.setState({
      showBusinessesList: false,
      newImg: data && data.tenantInfo && data.tenantInfo.bigLogo,
      originalImg:
        addressInfo && addressInfo.tenantInfo && addressInfo.tenantInfo.bigLogo,
      storeName: data && data.storeName,
    });
    const addrInfo = this.state.addrInfo;
    if (
      Number(data && data.tenantInfo && data.tenantInfo.tenantId) !==
      Number(addrInfo && addrInfo.tenantId)
    ) {
      this.setState({
        showChangeBusinessesLayer: true,
      });
    } else {
      Taro.showToast({
        title: `为您切换至${data.storeName}店铺`,
        icon: 'none',
      });
    }
    // 同一个地址切门店时保留addressId
    saveAddrInfo(data, tenantShopInfoList);
    const _addressInfo = Taro.getStorageSync('addressInfo');

    this.initPage({
      ..._addressInfo,
      addressId: this.addressId,
    });
    this.goTop();
  };

  // 获取用户推荐浮层相关配置
  UserConfig() {
    getUserConfig()
      .then((recommendConfig) => {
        // 间隔新增  IndexRecommendSpaceNum
        if (recommendConfig && recommendConfig.userConfigList) {
          const configlist = recommendConfig.userConfigList;
          configlist.forEach((val) => {
            if (val.userConfigKey === 'IndexRecommendSpaceNum') {
              // 间隔多少个商品可以插入找相似卡片
              this.IndexRecommendSpaceNum = parseInt(val.userConfigValue);
              // 从商详页返回的时候执行无货找相似卡片插入
              const renderRecommendData = Taro.getStorageSync(
                'renderRecommendData'
              );
              if (renderRecommendData) {
                // 无货找相似
                this.renderRecommend(renderRecommendData);
              }
            }
            if (val.userConfigKey === 'WareDetailMiddlePattern') {
              this.touchstone_expids = val.buriedExpLabel;
            }
          });
        } else {
          // 用户没有登陆不执行插入无货找相似功能，如果之前存过缓存，就删除
          Taro.removeStorageSync('renderRecommendData');
          Taro.removeStorageSync('countRecommend');
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  // 比较左右高度
  getCompareHeight() {
    let leftHeight = 0,
      rightHeight = 0;
    let { recommendforYouListLeft, recommendforYouListRight } = this.state;
    recommendforYouListLeft &&
      recommendforYouListLeft.forEach((item) => {
        leftHeight = this.getHeight(item) + leftHeight; //拿到高度
      });
    recommendforYouListRight &&
      recommendforYouListRight.forEach((item) => {
        rightHeight = this.getHeight(item) + rightHeight; //拿到高度
      });
    return {
      leftHeight,
      rightHeight,
    };
  }

  // 无货找相似，点击每个商品的方法
  onToRecommendDetail(info, index) {
    // 无货找相似点击埋点
    structureLogClick({
      eventId: 'frontPage_recommend_backActionForSimilarities_clickCommodity',
      jsonParam: {
        firstModuleId: 'bottomRecommend',
        firstModuleName: '为你推荐',
        secondModuleI: 'backActionForSimilarities',
        secondModuleName: '返回找相似',
        clickType: 2,
        listPageIndex: index + 1,
        skuName: info.skuName,
        skuId: info.skuId,
        touchstone_expids: this.touchstone_expids,
      },
    });
    console.log('=====首页找相似点击埋点======', {
      firstModuleId: 'bottomRecommend',
      firstModuleName: '为你推荐',
      secondModuleI: 'backActionForSimilarities',
      secondModuleName: '返回找相似',
      clickType: 2,
      listPageIndex: index + 1,
      skuName: info.skuName,
      skuId: info.skuId,
      touchstone_expids: this.touchstone_expids,
    });
    Taro.navigateTo({
      url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${info.skuId}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
    });
    return;
  }

  /*
  * 无货找相似
  * 1.点击商品进入商详时，需要首先验证是否已点击过，已点击商品不计入间隔统计；
    2.验证是否在间隔上，间隔统计数均+1；
    3.商详页加车，不返回数据，同时间隔统计数-1；
    4.获取推荐数小于4条，间隔统计数-1；
    5.如果在间隔上，获取数据失败，间隔统计数-1；
  */
  renderRecommend(action) {
    // 点击过的不在请求
    if (action && action.productItem && action.productItem.addClick) {
      return;
    }

    let { recommendforYouListLeft, recommendforYouListRight } = this.state;
    getRandomWareRecommend({
      skuId: action.skuId,
      source: 'home',
    }).then((data) => {
      data.style = 100; // 打一个类型标识，判断显示组件用
      // 判断左右侧高度的对比
      const heightData = this.getCompareHeight();
      // 保存点击次数
      this.countRecommend = this.countRecommend + 1;
      Taro.setStorageSync('countRecommend', this.countRecommend);
      if (
        this.IndexRecommendSpaceNum === 0 ||
        (this.IndexRecommendSpaceNum === 1 &&
          (this.countRecommend + this.IndexRecommendSpaceNum) % 2 === 1) ||
        (this.IndexRecommendSpaceNum === 2 &&
          (this.countRecommend + this.IndexRecommendSpaceNum) % 3 === 1) ||
        (this.IndexRecommendSpaceNum > 2 &&
          this.countRecommend % this.IndexRecommendSpaceNum === 1)
      ) {
        if (action.position === 'left') {
          for (let i = 0; i < recommendforYouListLeft.length; i++) {
            if (
              recommendforYouListLeft[i] &&
              recommendforYouListLeft[i].skuId === action.skuId &&
              !recommendforYouListLeft[i].addClick
            ) {
              // 如果找相似商品大于等于4个，就插入列表中
              if (data && data.wareInfos && data.wareInfos.length >= 4) {
                // 打一个已经点击的标识
                recommendforYouListLeft[i].addClick = true;
                if (heightData.leftHeight <= heightData.rightHeight) {
                  //如果点击的是左侧的商品，当左侧商品高度小于等于右侧，左侧商品下面插入找相似商品组
                  recommendforYouListLeft.splice(action.positionIndex, 0, data);
                } else {
                  //如果点击的是左侧的商品，当左侧商品高度大于右侧，需要在左侧商品下面插入找相似商品组，插入商品所占的商品卡移到右侧；
                  // 判断左侧列表个数大于右侧列表个数并且点击的是最后一个商品，将data插入到右侧
                  if (
                    (recommendforYouListLeft.length >
                      recommendforYouListRight.length ||
                      heightData.leftHeight > heightData.rightHeight) &&
                    recommendforYouListLeft[recommendforYouListLeft.length - 1]
                      .skuId === action.skuId
                  ) {
                    recommendforYouListRight.splice(
                      action.positionIndex,
                      0,
                      data
                    );
                  } else {
                    // 先把左侧当前点击商品下面的商品复制一份插入到右侧
                    recommendforYouListRight.splice(
                      action.positionIndex,
                      0,
                      recommendforYouListLeft[action.positionIndex]
                    );
                    // 在把左侧的删掉
                    recommendforYouListLeft.splice(action.positionIndex, 1);
                    // 然后插入找相似组件
                    recommendforYouListLeft.splice(
                      action.positionIndex,
                      0,
                      data
                    );
                  }
                }
              } else {
                this.countRecommend = this.countRecommend - 1;
                Taro.setStorageSync('countRecommend', this.countRecommend);
              }
              break;
            }
          }
        } else if (action.position === 'right') {
          for (let i = 0; i < recommendforYouListRight.length; i++) {
            if (
              recommendforYouListRight[i] &&
              recommendforYouListRight[i].skuId === action.skuId &&
              !recommendforYouListRight[i].addClick
            ) {
              // 如果找相似商品大于等于4个，就插入列表中
              if (data && data.wareInfos && data.wareInfos.length >= 4) {
                // 打一个已经点击的标识
                recommendforYouListRight[i].addClick = true;
                if (heightData.rightHeight < heightData.leftHeight) {
                  //如果点击的是右侧的商品，当右侧商品高度小于等于左侧，右侧商品下面插入找相似商品组；
                  recommendforYouListRight.splice(
                    action.positionIndex,
                    0,
                    data
                  );
                  break;
                } else {
                  // 如果点击的是右侧的商品，当右侧商品高度大于左侧，右侧商品下面插入找相似商品，插入商品所占的商品卡移到左侧。
                  // 判断右侧列表个数大于左侧列表个数并且点击的是最后一个商品，将data插入到左侧
                  if (
                    (recommendforYouListRight.length >
                      recommendforYouListLeft.length ||
                      heightData.rightHeight >= heightData.leftHeight) &&
                    recommendforYouListRight[
                      recommendforYouListRight.length - 1
                    ].skuId === action.skuId
                  ) {
                    recommendforYouListLeft.splice(
                      action.positionIndex,
                      0,
                      data
                    );
                  } else {
                    // 先把右侧当前点击商品下面的商品复制一份插入到右侧
                    recommendforYouListLeft.splice(
                      action.positionIndex + 1,
                      0,
                      recommendforYouListRight[action.positionIndex]
                    );
                    // 在把右侧的删掉
                    recommendforYouListRight.splice(action.positionIndex, 1);
                    // 然后插入找相似组件
                    recommendforYouListRight.splice(
                      action.positionIndex,
                      0,
                      data
                    );
                  }
                }
              } else {
                this.countRecommend = this.countRecommend - 1;
                Taro.setStorageSync('countRecommend', this.countRecommend);
              }
            }
          }
        }

        // 插入数据
        this.setState(
          {
            recommendforYouListLeft,
            recommendforYouListRight,
          },
          () => {
            const wareInfos = data && data.wareInfos;
            let skuIds = [],
              skuNames = [];
            if (wareInfos && wareInfos.length > 0) {
              for (let i = 0; i < 4; i++) {
                skuIds.push(wareInfos && wareInfos[i] && wareInfos[i].skuId);
                skuNames.push(
                  wareInfos && wareInfos[i] && wareInfos[i].skuName
                );
              }
            }
            skuIds = skuIds.join('+');
            skuNames = skuNames.join('+');
            //插入的时候就曝光
            // const showReferpagepath = Taro.getCurrentPages() && Taro.getCurrentPages()[0] && Taro.getCurrentPages()[0].__displayReporter && Taro.getCurrentPages()[0].__displayReporter.showReferpagepath;
            const params = {
              router: getCurrentInstance().router,
              eid: 'frontPage_recommend_backActionForSimilarities_expose',
              eparam: {
                eventId: 'frontPage_recommend_backActionForSimilarities_expose',
                skuId: skuIds,
                skuName: skuNames,
                touchstone_expids: this.touchstone_expids,
              },
            };
            console.log('=====首页找相似曝光埋点======', params);
            getExposure(params);
          }
        );
      }
    });
  }

  // 页面跳转加新埋点
  handleAction = (buriedPointVo, action, ev) => {
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    }
    if (!action) return;

    // 兼容跳菜谱详情老埋点
    if (action.urlType === '220') {
      //老埋点
      // logClick({ eid: '7FRESH_miniapp_2_1551092070962|60' });
      // 新埋点
      let tab = this.getRecommendForYouTabData();
      logClick({
        eid: '7FERSH_APP_8_1590127250769|16',
        eparam: {
          tabName: tab && tab.title,
          index: action.index,
          contentId: action.contentId,
        },
      });
    }

    const productItem = action && action.productItem;

    // 如果是商品组卡片执行无货找相似请求 商品必须是上架的状态
    if (productItem && productItem.style === 1 && productItem.status === 2) {
      // 跳转到商详页记一个标记，返回的时候执行无货找相似卡片插入
      Taro.setStorageSync('renderRecommendData', action);
    } else {
      Taro.removeStorageSync('renderRecommendData');
    }
    // 跳商详单独处理
    if (action.urlType === '1') {
      if (action.productItem) {
        this.onProductTrigger(action.productItem);
        delete action.productItem;
      }
      const tab = this.getRecommendForYouTabData();
      logClick({
        eid: '7FRESH_APP_2_201803183|47',
        eparam: {
          tabName: tab && tab.title,
          storeId: this.state.storeId,
          index: action.index,
          skuId: productItem.skuId,
        },
      });
      if (action && action.from === 'recommend') {
        structureLogClick({
          eventId: 'frontPage_recommend_tabID_clickCommodity',
          jsonParam: {
            firstModuleId: 'bottomRecommend',
            firstModuleName: '为你推荐',
            secondModuleId: tab && tab.tabId,
            secondModuleName: tab && tab.title,
            clickType: 2,
            skuId: productItem.skuId,
            skuName: action && action.skuName,
            listPageIndex: action && action.index,
            broker_info: action && action.broker_info,
          },
        });
      }
    }

    goPage({
      action,
      buriedPointVo,
      storeId: this.state.storeId,
      coords: this.coords,
      tenantId: this.state.tenantId,
      platformId: this.state.platformId,
      allCategoryList: this.state.allCategoryList,
      productItem: productItem,
    });
    const { fuDaiData } = this.state;
    if (action.toUrl && fuDaiData && fuDaiData.popCondition === 2) {
      this.setState({
        fuDaiData: {},
      });
    }
  };

  /**
   * 页面滚动事件
   * 滚动事件尽可能少的改变state
   */
  onPageScroll = (detail) => {
    let isHideFloorFloatImg = false;
    if (detail.scrollTop > this.state.windowHeight && !this.canScrollTop) {
      this.canScrollTop = true;
    }
    if (this.state.addressExt) {
      this.setState({
        addressExt: '',
      });
    }
    if (detail.scrollTop <= this.state.windowHeight && this.canScrollTop) {
      this.canScrollTop = false;
    }
    if (detail.scrollTop > this.scrollTop) {
      //向下滚动
      isHideFloorFloatImg = true;
    } else {
      //向上滚动
      isHideFloorFloatImg = false;
    }

    if (this.state.isHideFloorFloatImg !== isHideFloorFloatImg) {
      this.setState({
        isHideFloorFloatImg,
      });
    }
    if (this.state.showPageIndexTools) {
      this.setState({
        showPageIndexTools: false,
      });
    }
    this.scrollTop = detail.scrollTop;
  };

  /**
   * 切换动画
   */
  handelShowChangeBusinessesLayer() {
    this.setState({
      showChangeBusinessesLayer: false,
    });
  }

  /**
   * 显示/隐藏租户列表
   * @param {*} bool
   */
  handelBusinessesList = (bool) => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    if (
      addressInfo &&
      addressInfo.tenantShopInfo &&
      addressInfo.tenantShopInfo.length > 0
    ) {
      this.setState({
        showBusinessesList: bool,
        showPageIndexTools: false,
        tenantShopInfoList: addressInfo.tenantShopInfo,
        addrInfo: addressInfo,
      });
    }
    Taro.setStorageSync('showPageIndexTools', true);
  };

  /**
   * 显示/隐藏下拉楼层
   * @param {*} bool
   */
  handelPageIndexTools = (bool) => {
    this.setState({
      showPageIndexTools: bool,
      showBusinessesList: false,
      // isFirstShowPageIndexTools: false,
    });
  };

  /**
   * 返回顶部
   */
  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    });
  };

  /**
   * 去购物车
   */
  goCart = () => {
    let uuid = '';
    const exportPoint2 = Taro.getStorageSync('exportPoint');
    if (
      exportPoint2 &&
      typeof exportPoint2 === 'string' &&
      exportPoint2 !== '{}'
    ) {
      uuid = JSON.parse(exportPoint2).openid;
    }
    const lbsData = Taro.getStorageSync('addressInfo') || {};

    utils.navigateToH5({
      page:
        Taro.getApp().h5RequestHost +
        `/cart.html?from=miniapp&source=index&storeId=${
          this.state.storeId
        }&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${
          lbsData && lbsData.tenantId
        }`,
    });
  };

  /**
   * 预付卡去结算页
   */
  goCardOrder = (buriedPointVo, data) => {
    if (this.state.logined) {
      logClick({
        eid: '7FRESH_APP_9_20200811_1597153579446|23',
        eparam: {
          skuId: data && data.skuId,
        },
      });
      let needData = this.wareInfoModel(data);
      // TOH5编码
      let ciphertext = AES.encrypt(
        JSON.stringify(needData),
        '7fresh-h5'
      ).toString();
      if (buriedPointVo) {
        commonLogClick({
          action: {
            ...data.action,
            skuId: data && data.skuId,
            index: data && data.index,
            target: 14,
            urlType: 'goCardOrder',
          },
          buriedPointVo: buriedPointVo,
        });
      }
      utils.navigateToH5({
        page:
          Taro.getApp().h5RequestHost +
          `/giftCards/cardOrder?from=miniapp&nowBuy=16&lng=${this.coords.lng}&lat=${this.coords.lat}&giftCardsWareInfo=${ciphertext}`,
      });
      return;
    } else {
      utils.gotoLogin('/pages/index/index', 'switchTab');
    }
  };

  // 渲染提取必要商品参数
  wareInfoModel(data) {
    let wareInfoModel = {};
    if (data.skuId > 0) {
      wareInfoModel.skuId = data.skuId;
    }
    wareInfoModel.buyNum = data.buyNum || 1;
    wareInfoModel.features = data.features;
    return wareInfoModel;
  }

  /**
   * 去付款码页面
   */
  gotoPayCode() {
    if (this.state.logined) {
      Taro.navigateTo({
        url: '/pages/payCode/payCode',
      });
    } else {
      utils.gotoLogin('/pages/payCode/payCode');
    }
  }

  /**
   * 去扫一扫
   */
  gotoScan() {
    Taro.scanCode({
      success: (res) => {
        console.log('/扫码结果/:', res);
        if (res.scanType === 'WX_CODE') {
          let path = res.path;
          if (path.indexOf('food-category') > -1) {
            let url = path.split('h5_url=');
            if (url[1].indexOf('%') > -1) {
              path = path + '%26channel%3d2';
            } else {
              path =
                url[0] +
                'h5_url=' +
                encodeURIComponent(url[1]) +
                '%26channel%3d2';
            }
          }
          Taro.navigateTo({
            url: path[0] === '/' ? path : `/${path}`,
          });
          return;
        }
        if (res.result.indexOf('cabinet') > -1) {
          Taro.navigateTo({ url: res.result.split('#')[1] });
          return;
        }
        if (res.result.indexOf('activity.html') > -1) {
          utils.navigateToH5({ page: res.result });
          return;
        }

        getWareUpc({
          storeId: this.state.storeId,
          code: res.result,
          tenantId: this.state.tenantId,
          platformId: this.state.platformId,
        }).then((data) => {
          if (!data.success) {
            Taro.showToast({
              title: '未发现有效的二维码/条形码',
              icon: 'none',
            });
            return;
          }
          if (data.businessCode === 3) {
            utils.gotoLogin('/pages/index/index', 'switchTab');
            return;
          }
          if (data.business === 2) {
            Taro.navigateTo({
              url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${data.skuId}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
            });
            return;
          }
          if (data.business === 4 && data.isJump) {
            utils.navigateToH5({
              page:
                data.url.indexOf('http:') > -1
                  ? data.url.replace('http', 'https')
                  : data.url,
            });
            return;
          }
          Taro.navigateTo({ url: data.url });
        });
      },
      fail: (err) => {
        console.log('fail: ', err);
      },
    });
  }

  /**
   * 跳转堂食分类页
   */
  gotoFoodCategory(e) {
    logClick({ event: e, eid: '7FRESH_H5_4_1557026833364|51' });
    utils.navigateToH5({
      page: `${h5Url}/food-category/?channel=3`,
    });
  }

  //堂食点餐入口
  getIndexEntrance() {
    colorRequest({
      api: '7fresh.index.entrance',
    }).then((res) => {
      if (res && res.canteenEntrance) {
        this.setState({
          canteenEntrance: res.canteenEntrance,
        });
      }
    });
  }

  /**
   * 去切换地址页面
   */
  gotoAddressPage(ads = '') {
    // this.setState({
    //   showBusinessesList: false,
    //   showPageIndexTools: false,
    // });
    Taro.setStorageSync('showPageIndexTools', true);
    Taro.removeStorageSync('ads');
    Taro.navigateTo({
      url: `/pages/address/list/index?from=index&ads=${ads}`,
    });
  }

  /**
   * 隐藏顶部地址气泡
   */
  hideTopAddr = () => {
    this.setState({
      isShowTopAddr: false,
    });
  };

  /**
   * 为你推荐Tab切换
   * @param {*} index
   */
  oldIndex = 0;
  recommendTabChange = (index) => {
    const { recommendForYouProps } = this.state;
    if (recommendForYouProps.tabIndex === index) return;
    this.setState({
      isRecommedLoad: true,
    });
    recommendForYouProps.tabIndex = index;
    this.tabIndex = index;
    // //保存上一个tab的高度
    if (recommendForYouProps.fixedNav) {
      this.recommend[`tab${this.oldIndex}scrollTop`] = this.scrollTop;
      Taro.pageScrollTo({ selector: '#floorRecommendForYou', duration: 0 });
    }
    if (
      this.recommend[`tab${index}`] &&
      this.recommend[`tab${index}`].listLeft &&
      this.recommend[`tab${index}`].listLeft.length > 0
    ) {
      this.setState(
        {
          recommendforYouListLeft:
            this.recommend[`tab${index}`] &&
            this.recommend[`tab${index}`].listLeft,
          recommendforYouListRight:
            this.recommend[`tab${index}`] &&
            this.recommend[`tab${index}`].listRight,
          isRecommedLoad: false,
        },
        () => {
          console.log(this.state.recommendforYouListRight);
        }
      );
    } else {
      this.setState(
        {
          recommendforYouListLeft: [],
          recommendforYouListRight: [],
          [recommendForYouProps.tabIndex]: index,
        },
        () => {
          this.recommend.page = 0;
          this.recommend.max = 1;
          this.getRecommendForYou(index);
        }
      );
    }
    this.oldIndex = index;
    this.heightDataTotal = [0, 0];
  };

  /**
   * 为你推荐刷新
   */
  onRecommendRefresh = () => {
    const { isFixedTop, recommendForYouProps } = this.state;
    let tabIndex = (recommendForYouProps && recommendForYouProps.tabIndex) || 0;
    const tab = this.getRecommendForYouTabData();
    logClick({
      eid: '7FRESH_APP_3_201803231|49',
      eparam: {
        tabIndex,
        tabName: tab && tab.title,
      },
    });
    Taro.pageScrollTo({
      selector: '#floorRecommendForYou',
      duration: 0,
    });
    if (isFixedTop) {
      //刷新为你推荐
      this.recommend = {
        max: 1,
        page: 0,
        pageSize: 40,
      };
      this.setState({
        recommendforYouListLeft: [],
        recommendforYouListRight: [],
      });
      this.getRecommendForYou();
    } else {
      //滑动到为你推荐
      this.setState({
        isFixedTop: true,
      });
    }
  };

  /**
   * 获取为你推荐tab名称
   */
  getRecommendForYouTabData = () => {
    const { recommendForYouProps } = this.state;
    const tabIndex =
      (recommendForYouProps && recommendForYouProps.tabIndex) || 0;
    const recommendFloor = this.recommendForYouData;
    const tabs = (recommendFloor && recommendFloor.tab) || [];
    return tabs[tabIndex] || {};
  };

  /**
   * 收藏菜谱信息
   * @param {*} obj
   */
  onCollect(obj) {
    let recommendforYouList = [];
    let index = 0;
    if (obj.type === 'left') {
      recommendforYouList = this.state.recommendforYouListLeft;
      index = 2 * obj.index;
    } else {
      recommendforYouList = this.state.recommendforYouListRight;
      index = 2 * obj.index + 1;
    }
    const tab = this.getRecommendForYouTabData();
    //埋点
    logClick({
      eid: '7FERSH_APP_8_1590127250769|17',
      eparam: {
        tabName: tab && tab.title,
        index: index,
        contentId: obj.data.contentId,
      },
    });
    const ifCollect = obj.data.ifCollect;
    console.log('收藏状态修改', obj);
    if (this.state.logined) {
      const params = {
        source: 2,
        contentId: obj.data.contentId || '',
        opType: ifCollect ? 5 : 3,
      };
      const tipTxt = ifCollect ? '取消收藏' : '收藏';
      changeCollect(params)
        .then((res) => {
          if (res.success) {
            recommendforYouList[obj.index].ifCollect = !ifCollect;
            recommendforYouList[obj.index].collectCount =
              obj.data.collectCount + (ifCollect ? -1 : 1);
            if (obj.type === 'left') {
              this.setState(
                {
                  recommendforYouListLeft: recommendforYouList,
                },
                () => {
                  this.recommend[`tab${this.tabIndex}`] = {
                    ...this.recommend[`tab${this.tabIndex}`],
                    listLeft: recommendforYouList,
                    page: this.recommend.page,
                    max: this.recommend.max,
                  };
                }
              );
            } else {
              this.setState(
                {
                  recommendforYouListRight: recommendforYouList,
                },
                () => {
                  this.recommend[`tab${this.tabIndex}`] = {
                    ...this.recommend[`tab${this.tabIndex}`],
                    listRight: recommendforYouList,
                    page: this.recommend.page,
                    max: this.recommend.max,
                  };
                }
              );
            }
            Taro.showToast({ title: tipTxt + '成功', icon: 'none' });
          } else {
            Taro.showToast({ title: tipTxt + '失败', icon: 'none' });
          }
        })
        .catch(() => {
          Taro.showToast(tipTxt);
        });
    } else {
      utils.gotoLogin('/pages/index/index', 'switchTab');
    }
  }

  /**
   * 跳转商品详情
   * @param {*} info
   */
  onGoDetail(info) {
    this.onProductTrigger(info);
    this.goDetail(info.skuId, info);
  }

  /**
   * 查看更多
   * @param {*} val
   */
  onSearchMore(val) {
    utils.navigateToH5({
      page: (val && val.action && val.action.toUrl) || '',
    });
  }

  /**
   * 关闭引导添加我的小程序的横条
   */
  onCancelApplet() {
    this.setState({
      isShowApplet: false,
    });
  }

  /**
   * 展示引导添加我的小程序的操作流程
   */
  onAddApplet() {
    this.setState({
      isShowAddApplet: true,
    });
  }
  /**
   * 隐藏引导添加我的小程序的操作流程
   */
  onCancelAddApplet() {
    this.setState({
      isShowAddApplet: false,
    });
  }
  /*******************响应事件**********************/

  /*******************加工数据**********************/
  /**
   * 处理商品数据
   * @param {*} product 商品数据
   */
  handleProductItem = (product) => {
    const {
      action,
      skuId,
      flagImage,
      status,
      imageUrl,
      promotionTypes,
      advertisement,
      av,
      isPeriod,
      preSale,
      dailyFresh,
      skuName,
      skuShortName,
      jdPrice,
      marketPrice,
      buyUnit,
      addCart,
      isPop,
      startBuyUnitNum,
      stepBuyUnitNum,
      maxBuyUnitNum,
      serviceTagId,
      selectedTasteInfoIds,
      saleSpecDesc,
      serviceTags,
      attrInfoList,
    } = product;
    return {
      action,
      skuId,
      flagImage,
      status,
      imageUrl,
      promotionTypes,
      advertisement,
      av,
      isPeriod,
      preSale,
      dailyFresh,
      skuName,
      skuShortName,
      jdPrice,
      marketPrice,
      buyUnit,
      addCart,
      isPop,
      startBuyUnitNum,
      stepBuyUnitNum,
      maxBuyUnitNum,
      serviceTagId,
      selectedTasteInfoIds,
      saleSpecDesc,
      serviceTags,
      attrInfoList,
    };
  };

  /**
   * 处理楼层数据
   * @param {*} res 接口数据
   */
  handleFloorsData = (res) => {
    let floors = res.floors;
    if (floors && floors.length > 0) {
      floors.forEach((floor, m) => {
        floor.floorIndex = m + 1;
        // 主题商品---7
        if (floor.floorType === 7) {
          this.blackSkuList.forEach((skuIds) => {
            floor.items &&
              floor.items.length > 0 &&
              floor.items.forEach((item, index, arr) => {
                if (Number(skuIds) === item.skuId) {
                  arr.splice(index, 1);
                }
                item = this.handleProductItem(item);
              });
          });
        }

        if (floor.floorType === 41) {
          floor.group =
            floor.group &&
            floor.group.map((g) => {
              return {
                ...g,
                items: g.items.map((i) => {
                  return this.handleProductItem(i);
                }),
              };
            });
        }

        if (floor.floorType === 53) {
          floor.items =
            floor.items &&
            floor.items.map((i) => {
              return this.handleProductItem(i);
            });
        }

        // 为你推荐分类商品---55
        if (floor.floorType === 55) {
          floor.tab &&
            floor.tab.length > 0 &&
            floor.tab.forEach((val) => {
              this.blackSkuList.forEach((skuIds) => {
                val &&
                  val.contents &&
                  val.contents.pageList &&
                  val.contents.pageList.length > 0 &&
                  val.contents.pageList.forEach((item, index, arr) => {
                    if (Number(skuIds) === item.skuId) {
                      arr.splice(index, 1);
                    }
                    item = this.handleProductItem(item);
                  });
              });
            });
        }
        //新人专区
        if (floor.floorType === 40) {
          this.hasNewCustomer = true; //已经获取到新人专区组件
          this.newCustomerPosition = floor.autoPosition;
        }

        // 栏目聚合
        if (floor.floorType === 100) {
          let floorData = res.floors.filter((val) => val.floorType === 100)[0];
          this.columnRuleList = floorData.ruleList;
          const endF = this.startFloor + this.pageSize;
          console.log('floorData', floorData, floorData.floorIndex);
          if (
            Taro.getStorageSync('columnStoreId') == '' ||
            Taro.getStorageSync('columnStoreId') !=
              Taro.getStorageSync('addressInfo').storeId
          ) {
            Taro.setStorageSync('columnList', []);

            this.getIndexcolumnBox(this.startFloor, endF, floorData.floorIndex);
          } else {
            this.setState({
              afterResultList: Taro.getStorageSync('columnList'),
            });
          }
        }

        // 底部导航 7club 气泡
        if (floor.floorType === 103) {
          Taro.setStorageSync('bubble', {
            ...floor,
            iconIndex: 2,
          });
        }
      });
    }
  };
  /*******************加工数据**********************/
  isFixedTop = false;
  onFixedTop = (flag) => {
    console.log('***************是否吸顶', flag);
    this.isFixedTop = flag;
  };

  //关闭弹窗
  onCloseModal = () => {
    const { newUserTaskPop } = this.state;
    const useData = {
      activityId:
        (newUserTaskPop &&
          newUserTaskPop.taskAwardInfo &&
          newUserTaskPop.taskAwardInfo.activityId) ||
        (newUserTaskPop && newUserTaskPop.actId),
      taskId:
        newUserTaskPop &&
        newUserTaskPop.taskAwardInfo &&
        newUserTaskPop.taskAwardInfo.taskId,
      batchId:
        newUserTaskPop &&
        newUserTaskPop.taskAwardInfo &&
        newUserTaskPop.taskAwardInfo.couponInfoWeb &&
        newUserTaskPop.taskAwardInfo.couponInfoWeb.batchId,
    };
    structureLogClick({
      eventId: 'homePage_newUserTaskPopWindow_clickClose',
      jsonParam: {
        ...useData,
        firstModuleId: 'newUserTaskPopWindow',
        firstModuleName: '新人任务弹窗',
        clickType: -1,
      },
    });
    this.setState({
      showAwardModal: false,
    });
    // const floorAdPopInfo = Taro.getStorageSync('FloorAdPopInfoNew') || {};
    Taro.setStorageSync('FloorAdPopInfoNew', formatDate(new Date()));
  };

  // 查看更多任务
  onGoMoreTask = (source, val) => {
    const { newUserTaskPop, storeId } = this.state;
    let useData = '';
    if (source === 'floor') {
      useData = {
        activityId:
          val.newUserTaskEntranceInfo && val.newUserTaskEntranceInfo.actId,
        taskId:
          val.newUserTaskEntranceInfo && val.newUserTaskEntranceInfo.taskId,
      };
    } else {
      useData = {
        activityId:
          (newUserTaskPop.taskAwardInfo &&
            newUserTaskPop.taskAwardInfo.activityId) ||
          newUserTaskPop.actId,
        taskId:
          newUserTaskPop.taskAwardInfo && newUserTaskPop.taskAwardInfo.taskId,
        batchId:
          newUserTaskPop &&
          newUserTaskPop.taskAwardInfo &&
          newUserTaskPop.taskAwardInfo.couponInfoWeb &&
          newUserTaskPop.taskAwardInfo.couponInfoWeb.batchId,
      };
    }
    console.log('useData', useData);
    let eventId = '';
    if (source === 'floor') {
      eventId =
        val &&
        val.newUserTaskEntranceInfo &&
        val.newUserTaskEntranceInfo.taskStatus === 1
          ? 'homePage_newUserTaskFloor_clickGetTask'
          : 'homePage_newUserTaskFloor_clickToLook';
    } else {
      eventId =
        val && val.from === 'more'
          ? 'homePage_newUserTaskPopWindow_clickMoreTask'
          : newUserTaskPop && newUserTaskPop.taskCount === 1
          ? 'homePage_newUserTaskPopWindow_clickToGetTask'
          : 'homePage_newUserTaskPopWindow_clickToLook';
    }
    structureLogClick({
      eventId,
      jsonParam: {
        ...useData,
        firstModuleId:
          source === 'floor' ? 'newUserTaskFloor' : 'newUserTaskPopWindow',
        firstModuleName: source === 'floor' ? '新人任务楼层' : '新人任务弹窗',
        clickType: -1,
      },
    });

    utils.navigateToH5({
      page: `${app.h5RequestHost}/newPerson?storeId=${storeId}`,
    });
  };

  // 领任务
  onGetTask = () => {
    const { floors, newUserTaskPop } = this.state;
    const _params = {
      activityId:
        newUserTaskPop &&
        newUserTaskPop.taskAwardInfo &&
        newUserTaskPop.taskAwardInfo.activityId,
      taskId:
        newUserTaskPop &&
        newUserTaskPop.taskAwardInfo &&
        newUserTaskPop.taskAwardInfo.taskId,
      batchId:
        newUserTaskPop &&
        newUserTaskPop.taskAwardInfo &&
        newUserTaskPop.taskAwardInfo.couponInfoWeb &&
        newUserTaskPop.taskAwardInfo.couponInfoWeb.batchId,
    };
    structureLogClick({
      eventId: 'homePage_newUserTaskPopWindow_clickGetTask',
      jsonParam: {
        ..._params,
        firstModuleId: 'newUserTaskPopWindow',
        firstModuleName: '新人任务弹窗',
        clickType: -1,
      },
    });
    getNewUserTaskTake(_params).then((res) => {
      console.log('getNewUserTaskTake', res);
      if (res && res.success) {
        Taro.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000,
        });
        const params = {
          floorType: '93',
        };
        this.setState({
          goDetailButton: true,
        });
        getSingleFloor({ data: params }).then((taskFloorData) => {
          console.log('taskFloorData', taskFloorData);
          floors &&
            taskFloorData &&
            taskFloorData.floor &&
            taskFloorData.floor.newUserTaskEntranceInfo &&
            floors.map((val, i) => {
              if (val.floorType === 93) {
                floors[i].newUserTaskEntranceInfo =
                  taskFloorData.floor.newUserTaskEntranceInfo;
              }
            });
          this.setState({
            floors,
          });
        });
      } else {
        Taro.showToast({
          title: '任务已过期,请点击查看更多',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  };

  // TODO: 新人弹窗
  newUserTaskPop = () => {
    getNewUserTaskPop()
      .then((res) => {
        let isShow = this.isShowFloorAdPopFuncs();
        if (isShow && res && res.success === true) {
          const params = {
            router: getCurrentInstance().router,
            eid: 'homePage_newUserTaskPopWindow',
            eparam: {
              eventId: 'homePage_newUserTaskPopWindow',
              activityId: res.actId || '',
              taskId: (res.taskAwardInfo && res.taskAwardInfo.taskId) || '',
            },
          };
          getExposure(params);
          this.setState({
            showAwardModal: true,
            newUserTaskPop: res,
            notNewPerson: false,
          });
        } else {
          this.setState({
            notNewPerson: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          notNewPerson: true,
        });
      });
  };

  //是否显示弹屏广告
  isShowFloorAdPopFuncs() {
    let isShowAdPopIndex = false;
    let floorAdPopInfo = Taro.getStorageSync('FloorAdPopInfoNew') || '';
    if (floorAdPopInfo && floorAdPopInfo === formatDate(new Date())) {
      isShowAdPopIndex = false;
    } else {
      isShowAdPopIndex = true;
    }
    return isShowAdPopIndex;
  }

  // 复制
  handleCopy = () => {
    if (this.state.logined) {
      let ordervalue = this.state.redPassword.command;
      /*
       * https://cf.jd.com/pages/viewpage.action?pageId=412685833
       * 20210125 zmh
       */
      structureLogClick({
        eventId: 'Passwordenvelope_Applets_copy',
        eventName: '口令红包复制app按钮',
        jsonParam: {
          clickType: '-1',
          pageId: '0001',
          pageName: '首页',
          tenantId: `${this.state.tenantId}`,
          storeId: `${this.state.storeId}`,
          platformId: '1',
          clickId: 'Passwordenvelope_Applets_copy',
        },
      });
      let _this = this;
      Taro.setClipboardData({
        data: ordervalue.toString(),
        success() {
          _this.setState(
            {
              // customerFlag: true,
              goCopyFlag: false,
            },
            () => {
              this.isNotFromLogin = false;
              Taro.setStorageSync('isNotFromLogin', false);
              const params = {
                router: getCurrentInstance().router,
                eid: 'Passwordenvelope_Applets_guideshow',
                eparam: {
                  eventId: 'Passwordenvelope_Applets_guideshow',
                },
              };
              getExposure(params);
            }
          );
          // },
          // });
        },
      });
    } else {
      structureLogClick({
        eventId: 'Passwordenvelope_Applets_land',
        eventName: '口令红包登录',
        jsonParam: {
          clickType: '-1',
          pageId: '0001',
          pageName: '首页',
          tenantId: `${this.state.tenantId}`,
          storeId: `${this.state.storeId}`,
          platformId: '1',
          clickId: 'Passwordenvelope_Applets_land',
        },
      });
      this.setState({
        goCopyFlag: false,
        customerFlag: false,
      });
      Taro.setStorageSync('isNotFromLogin', true);
      utils.gotoLogin('/pages/index/index', 'switchTab');
      return false;
    }

    console.log('goCopyFlag', this.state.goCopyFlag);
  };

  // 口令红包渲染数据
  // redPasswordPop = () => {
  //   getOpenId().then(toUserId => {
  //     this.setState(
  //       {
  //         toUserId: toUserId,
  //       },
  //       () => {
  //         const data = {
  //           toUser: this.state.toUserId,
  //         };
  //         getQueryCommand(data)
  //           .then(res => {
  //             if (res && res.success) {
  //               this.setState(
  //                 {
  //                   redPassword: {
  //                     command: res.command,
  //                     appletCommandCopyImg: res.appletCommandCopyImg,
  //                     appletCommandImg: res.appletCommandImg,
  //                   },
  //                 },
  //                 () => {
  //                   if (this.state.logined) {
  //                     if (JSON.stringify(res.command) !== 'null') {
  //                       // if (Taro.getStorageSync('isNotFromLogin')) {
  //                       //   this.handleCopy();
  //                       // } else {
  //                       this.setState({
  //                         goCopyFlag: true,
  //                         customerFlag: false,
  //                       });
  //                       // }
  //                     } else {
  //                       this.setState({
  //                         goCopyFlag: false,
  //                         customerFlag: false,
  //                       });
  //                     }
  //                   } else {
  //                     this.setState({
  //                       customerFlag: true,
  //                     });
  //                     const params = {
  //                       router: getCurrentInstance().router,
  //                       eid: 'Passwordenvelope_Applets_show',
  //                       eparam: {
  //                         eventId: 'Passwordenvelope_Applets_show',
  //                       },
  //                     };
  //                     getExposure(params);
  //                   }
  //                 }
  //               );
  //             } else {
  //               if (!this.state.logined) {
  //                 this.setState({
  //                   customerFlag: true,
  //                 });
  //               } else {
  //                 this.setState({
  //                   customerFlag: false,
  //                 });
  //               }
  //             }
  //           })
  //           .catch(() => {});
  //       }
  //     );
  //   });
  // };

  // 领券成功订阅消息
  subscribe = () => {
    const _this = this;
    Taro.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log('res.subscriptionsSetting', res.subscriptionsSetting);
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          // 状态1 订阅消息总开关是开的
          console.log('状态1 订阅消息总开关是开的');
          _this.setState({
            remindFlag: true,
          });
          if (res.subscriptionsSetting.itemSettings) {
            if (
              res.subscriptionsSetting.itemSettings[
                '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'
              ] == 'accept'
            ) {
              // 状态4 勾选了“不再询问”并且选项是允许
              console.log('状态4 勾选了“不再询问”并且选项是允许');
              _this.setState({
                remindFlag: false,
              });
              wx.requestSubscribeMessage({
                tmplIds: ['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'],
                success: function (data) {
                  console.log('44444', data);
                  if (
                    data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                    'accept'
                  ) {
                    _this.setState({
                      subscriptionType: 3,
                    });
                    _this.getQueryTemplateFunc();
                  }
                },
                fail(data) {
                  console.log('fail', data);
                },
              });
            } else if (
              res.subscriptionsSetting.itemSettings[
                '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'
              ] == 'reject'
            ) {
              // 状态5 勾选了“不再询问”并且选项是取消
              console.log('状态5 勾选了“不再询问”并且选项是取消');
              _this.setState({
                remindFlag: false,
                subscriptionType: 1,
              });
            }
          } else {
            // 状态3 没有勾选“不再询问”  单次
            console.log('状态3 没有勾选“不再询问”');
            console.log(_this.state.welfareData);
            wx.requestSubscribeMessage({
              tmplIds: ['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'],
              success: function (data) {
                _this.setState({
                  remindFlag: false,
                });
                if (
                  data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                  'reject'
                ) {
                  _this.alreadyGet = false;
                }
                if (
                  data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                  'accept'
                ) {
                  // 第一次弹框  第二次不弹框
                  _this.setState(
                    {
                      remindNum: _this.state.remindNum + 1,
                      subscriptionType: 2,
                    },
                    () => {
                      if (_this.state.remindNum < 2) {
                        _this.setState({
                          restartFlag: true,
                        });
                      } else {
                        _this.alreadyGet = false;
                      }
                      _this.getQueryTemplateFunc();
                    }
                  );
                }
              },
              fail() {
                _this.setState({
                  remindFlag: false,
                });
              },
            });
          }
        } else {
          // 状态2 订阅消息总开关是关的
          console.log('状态2 订阅消息总开关是关的');
          Taro.openSetting();
        }
      },
    });
  };

  // 查询用户的订阅类型
  getQueryTemplateFunc = () => {
    let uuid = '';
    const wxUserInfo = Taro.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const params = {
      templateId: this.tmplIds,
      toUser: uuid,
    };
    getQueryTemplate(params)
      .then((res) => {
        console.log('getQueryTemplate', res.data);
        this.getSaveTemplate(uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 用户订阅模版内容
  getSaveTemplate = (uuid) => {
    const { subscriptionType } = this.state;
    const args = {
      templateId: this.tmplIds,
      subscriptionType: subscriptionType,
      notifyChannel: 1,
      toUser: uuid,
      businessIds: this.couponCodes,
    };
    getSaveTemplate(args)
      .then((res) => {
        console.log('getSaveTemplate', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onCloseSubscribe = () => {
    this.setState({
      restartFlag: false,
      remindFlag: true,
    });
    this.subscribe();
  };

  // 唤起修正弹层
  chooseAdsErr = () => {
    // 单点曝光
    const params = {
      router: getCurrentInstance().router,
      eid: 'errorAddressConfirm',
      eparam: {
        pageId: '0001',
        pageName: '首页',
        eventId: 'errorAddressConfirm',
      },
    };
    getExposure(params);
    const { fix } = this.state;

    if (fix) {
      this.setState({ iShowAdsModel: true }, () => {
        this.preventBodyScrool();
      });
    }
  };

  // 弹层-没问题
  sureAds = () => {
    let addressInfo = Taro.getStorageSync('addressInfo');
    // 地址修正接口
    platformUserAddressFix({
      addressId: addressInfo.addressId,
    }).then((data) => {
      console.log('【7fresh_platform_user_address_fix】', data);
      if (data && data.success) {
        addressInfo.fix = false;

        Taro.setStorageSync('addressInfo', addressInfo);
        this.setState({ iShowAdsModel: false }, () => {
          this.bodyScrool();
          this.initPage(addressInfo);
          this.goTop();
        });
      }
    });
  };

  // 弹层-我要修改
  goAds = () => {
    this.setState({ iShowAdsModel: false }, () => {
      this.bodyScrool();
      this.gotoAddressPage('1');
    });
  };

  //阻止页面滚动
  preventBodyScrool = () => {
    this.setState({
      pageStyle: {
        position: 'fixed',
        height: '100%',
        overflow: 'hidden',
      },
    });
  };

  //解除阻止页面滚动
  bodyScrool = () => {
    this.setState({
      pageStyle: {},
    });
  };

  // 隐私政策文案
  getVersionPolicyText() {
    getVersionPolicy().then((res) => {
      console.log('getVersionPolicy', res);
      this.setState(
        {
          policyCon: res,
        },
        () => {
          // console.log(
          //   'oldVersionCode',
          //   Taro.getStorageSync('oldVersionCode'),
          //   this.state.policyCon.versionCode,
          //   this.oldVersionCode == this.state.policyCon.versionCode,
          //   Taro.getStorageSync('isRejectPolicy'),
          //   Taro.getStorageSync('isLoginRejectPolicy')
          // );
          if (Taro.getStorageSync('isLoginRejectPolicy')) {
            Taro.setStorageSync('isRejectPolicy', false);
            Taro.setStorageSync(
              'newVersionCode',
              this.state.policyCon.versionCode
            );
            Taro.setStorageSync(
              'oldVersionCode',
              this.state.policyCon.versionCode
            );
            Taro.setStorageSync('isLoginRejectPolicy', false);
            return;
          }

          if (Taro.getStorageSync('oldVersionCode') === 0) {
            this.setState({
              policyShow: false,
            });
            Taro.setStorageSync(
              'oldVersionCode',
              this.state.policyCon.versionCode
            );
          } else if (
            Taro.getStorageSync('oldVersionCode') ==
            this.state.policyCon.versionCode
          ) {
            this.setState({
              policyShow: false,
            });
          } else {
            this.setState(
              {
                policyShow: true,
              },
              () => {
                const params = {
                  router: getCurrentInstance().router,
                  eid: 'privacyPolicyPop_expose',
                  eparam: {
                    eventId: 'privacyPolicyPop_expose',
                    pageId: '0001',
                    policyVersion: this.state.policyCon.versionCode,
                  },
                };
                getExposure(params);
              }
            );
          }
        }
      );
    });
  }

  // 跳转协议
  onGoToPolicyUrl = (e) => {
    if (e) {
      structureLogClick({
        eventId: 'privacyPolicyPop_clickUrl',
        eventName: '隐私升级弹框_点击跳转隐私协议链接',
        jsonParam: {
          clickType: '-1',
          pageId: '0001',
          pageName: '首页',
          tenantId: `${this.state.tenantId}`,
          storeId: `${this.state.storeId}`,
          platformId: '1',
          clickId: 'privacyPolicyPop_clickUrl',
          policyUrl: e,
        },
      });
    }
    utils.navigateToH5({
      page: e,
    });
  };

  // 不同意协议
  onCancelPolicy = () => {
    const { policyCon } = this.state;
    this.isRejectPolicy = true;
    structureLogClick({
      eventId: 'privacyPolicyPop_refuseTerms',
      eventName: '隐私升级弹框_点击拒绝',
      jsonParam: {
        clickType: '-1',
        pageId: '0001',
        pageName: '首页',
        tenantId: `${this.state.tenantId}`,
        storeId: `${this.state.storeId}`,
        platformId: '1',
        clickId: 'privacyPolicyPop_refuseTerms',
        policyVersion: policyCon.versionCode,
      },
    });
    this.setState(
      {
        policyShow: false,
      },
      () => {
        Taro.setStorageSync('isRejectPolicy', this.isRejectPolicy);
        Taro.setStorageSync('newVersionCode', policyCon.versionCode);
        Taro.setStorageSync('oldVersionCode', policyCon.versionCode);
      }
    );
  };

  // 同意协议
  onOkPolicy = () => {
    const { policyCon } = this.state;
    this.isRejectPolicy = false;
    // https://cf.jd.com/pages/viewpage.action?pageId=529702773
    structureLogClick({
      eventId: 'privacyPolicyPop_acceptTerms',
      eventName: '隐私升级弹框_点击同意',
      jsonParam: {
        clickType: '-1',
        pageId: '0001',
        pageName: '首页',
        tenantId: `${this.state.tenantId}`,
        storeId: `${this.state.storeId}`,
        platformId: '1',
        clickId: 'privacyPolicyPop_acceptTerms',
        policyVersion: policyCon.versionCode,
      },
    });
    this.setState(
      {
        policyShow: false,
      },
      () => {
        // 清除不同意的缓存
        Taro.setStorageSync('isRejectPolicy', false);
        Taro.setStorageSync('newVersionCode', '');
        Taro.setStorageSync('oldVersionCode', policyCon.versionCode);
      }
    );
  };

  render() {
    const {
      navHeight,
      windowWidth,
      floors,
      addressExt,
      showGoTop,
      navImage,
      defaultKeyword,
      isShowTopAddr,
      isConcern,
      isLoad,
      isBottomLoad,
      loadPicture,
      recommendforYouListLeft,
      recommendforYouListRight,
      addCartPopData,
      showBusinessesList,
      showPageIndexTools,
      showChangeBusinessesLayer,
      recommendForYouProps,
      fuDaiData,
      isHideFloorFloatImg,
      isShowApplet,
      isShowAddApplet,
      // isFirstShowPageIndexTools,
      isShowNewCustomer,
      tenantShopInfoList,
      scrollTop,
      isIphoneX,
      isRecommedLoad,
      storeName,
      newUserTaskPop,
      showAwardModal,
      notNewPerson,
      goDetailButton,
      canteenEntrance,
      redPassword,
      goCopyFlag,
      restartFlag,
      remindFlag,
      afterResultList,
      pageStyle,
      customerFlag,
      policyCon,
      policyShow,
    } = this.state;

    return (
      <View className='home' style={pageStyle}>
        <View
          className='top-cover'
          style={{
            backgroundPositionY: `${(navHeight / windowWidth) * 375 - 170}rpx`,
          }}
        >
          <NavBar
            title={' '}
            showBack={false}
            onHandelBusinessesList={this.handelBusinessesList}
            showBusinessesList={showBusinessesList}
            showPageIndexTools={showPageIndexTools}
            addrInfo={this.state.addrInfo}
          />
        </View>
        {/* 长列表前的内容 */}
        <View
          className='content'
          style={{
            paddingBottom: isShowApplet ? px2vw(80) : 0,
          }}
        >
          {/* 顶部搜索 */}
          <TopSearch
            navHeight={navHeight}
            windowWidth={windowWidth}
            addressExt={addressExt || ''}
            canteenEntrance={canteenEntrance}
            isShowTopAddr={isShowTopAddr}
            onGoToUrl={this.goToUrl}
            bgImage={navImage}
            defaultKeyword={defaultKeyword}
            onGotoPayCode={this.gotoPayCode}
            onGotoScan={this.gotoScan}
            onGotoFoodCategory={this.gotoFoodCategory}
            onGotoAddressPage={this.gotoAddressPage}
            storeId={this.state.storeId || ''}
            tenantId={this.state.tenantId || 1}
            platformId={this.state.platformId || 1}
            onHandelBusinessesList={this.handelBusinessesList}
            onHandelPageIndexTools={this.handelPageIndexTools}
            showBusinessesList={showBusinessesList}
            showPageIndexTools={showPageIndexTools}
            addrInfo={this.state.addrInfo}
            isShowApplet={isShowApplet}
            isShowAddApplet={isShowAddApplet}
            onAddApplet={this.onAddApplet}
            onCancelAddApplet={this.onCancelAddApplet}
            onCancelApplet={this.onCancelApplet}
            fix={this.state.fix}
            onChooseAdsErr={this.chooseAdsErr}
          />
          {/* 多租户列表 */}
          {showBusinessesList && (
            <BusinessesList
              navHeight={navHeight}
              windowWidth={windowWidth}
              addressExt={addressExt || ''}
              tenantShopInfoList={tenantShopInfoList}
              onHandelChangeBusinesses={this.onChangeBusinesses}
              onHandelBusinessesList={this.handelBusinessesList}
            />
          )}
          {/* 福袋 */}
          {fuDaiData &&
            JSON.stringify(fuDaiData) !== '{}' &&
            fuDaiData.popCondition === 2 && (
              <View id={`floor-${fuDaiData.floorType}-${fuDaiData.sort}-0`}>
                <FloorAdPop
                  data={fuDaiData}
                  onGoToUrl={this.handleAction.bind(
                    this,
                    fuDaiData.buriedPointVo
                  )}
                  source='index'
                  storeId={this.state.storeId}
                  onClick={this.getGrabRedPacket}
                  onCloseCouponPop={this.onCloseCouponPop}
                />
              </View>
            )}
        </View>
        {/* 骨架屏 */}
        {isLoad && <SkeletionScreen />}
        {/* 首页长列表数据 */}
        {!isLoad && floors && floors.length > 0 && (
          <View
            style={
              {
                // marginTop: `${(navHeight / windowWidth) * 375 + 20}rpx`,
              }
            }
          >
            {floors.map((val, i) => {
              let _val = null;
              if (val.floorType === 41 && val.group) {
                _val = {
                  ...val,
                  group:
                    val &&
                    val.group &&
                    val.group.filter((item) => item.title !== '营养保健'),
                };
              }
              // 鲜橙新埋点,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
              const buriedPointVo = {
                ...val.buriedPointVo,
                floorIndex: i + 1,
              };
              val.buriedPointVo = buriedPointVo;
              val.floorIndex = i + 1;

              return (
                <View
                  key={val.uuid | i}
                  id={
                    val.floorType === 21 || val.floorType === 25
                      ? ''
                      : `floor-${val.floorType}-${val.sort}-0`
                  }
                  style={{
                    marginTop: `${val.floorType === 19 ? '-1px' : '0'}`,
                    background: `${
                      val && val.floorType === 46 ? val.backGroudColor : 'none'
                    }`,
                  }}
                >
                  {/* 七鲜快报 */}
                  {val.floorType === 2 && (
                    <FloorNews data={val} onGoToUrl={this.goToUrl} />
                  )}

                  {/* 功能聚合 */}
                  {val.floorType === 3 && val.items && (
                    <View style={{ marginTop: '-1px' }}>
                      <FreshFloorIndexIcon
                        data={val}
                        onClick={this.handleAction.bind(this, buriedPointVo)}
                      />
                    </View>
                  )}

                  {/* 单品 */}
                  {val.floorType === 6 && (
                    <FloorSingleItems
                      data={val}
                      onAddCart={this.addCart}
                      onGoDetail={this.goDetail}
                      onGoCardOrder={this.goCardOrder.bind(this, buriedPointVo)}
                      windowWidth={windowWidth}
                    />
                  )}

                  {/* 主题商品 */}
                  {val.floorType === 7 && (
                    <FloorThemeProduct
                      data={val}
                      onGoToUrl={this.goToUrl}
                      onAddCart={this.addCart}
                      onGoDetail={this.goDetail}
                      windowWidth={windowWidth}
                    />
                  )}

                  {/* 门店信息 */}
                  {val.floorType === 8 && (
                    <FloorEntrance data={val} onGoToUrl={this.changeStoreId} />
                  )}

                  {/* 通栏 */}
                  {val.floorType === 19 && (
                    <View style={{ width: '100%', overflow: 'hidden' }}>
                      <FloorNotice
                        data={val}
                        windowWidth={windowWidth}
                        onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                      />
                    </View>
                  )}

                  {/* 弹屏广告 */}
                  {val.floorType === 21 &&
                    val.popCondition !== 2 &&
                    notNewPerson && (
                      <View>
                        {/* 占位楼层曝光用 */}
                        <View
                          className='box-placeholder'
                          id={`floor-${val.floorType}-${val.sort}-0`}
                        ></View>
                        <FloorAdPop
                          data={val}
                          onGoToUrl={this.handleAction.bind(
                            this,
                            buriedPointVo
                          )}
                          source='index'
                          storeId={this.state.storeId}
                          onCloseCouponPop={this.onCloseCouponPop}
                        />
                      </View>
                    )}

                  {/* 滑动图 */}
                  {val.floorType === 22 && (
                    <FloorScroll
                      data={val}
                      windowWidth={windowWidth}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                    />
                  )}

                  {/* 浮动图 */}
                  {val.floorType === 25 && (
                    <View>
                      {/* 占位楼层曝光用 */}
                      <View
                        className='box-placeholder'
                        id={`floor-${val.floorType}-${val.sort}-0`}
                      ></View>
                      <FloorFloatImg
                        data={val}
                        onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                        isConcern={isConcern}
                        isHideFloorFloatImg={isHideFloorFloatImg}
                        onShowFloorFloatImg={this.showFloorFloatImg}
                      />
                    </View>
                  )}

                  {/* 楼层间隔 */}
                  {val.floorType === 28 && <FloorSpace />}

                  {/* 包裹式商品 */}
                  {val.floorType === 29 && (
                    <FloorWrapProduct
                      data={val}
                      onGoToUrl={this.goToUrl}
                      onAddCart={this.addCart}
                      onGoDetail={this.goDetail}
                      windowWidth={windowWidth}
                    />
                  )}

                  {/* 新人专区 TODO埋点*/}
                  {val.floorType === 40 && (
                    <View className='new-born-box'>
                      <FloorNewBornZone
                        data={val}
                        onAddCart={this.newCustomerAddCart.bind(
                          this,
                          buriedPointVo
                        )}
                        onGoToSecondaryPage={this.goToSecondaryPage.bind(
                          this,
                          buriedPointVo
                        )}
                        onGetCoupon={this.sureApplyWelfare}
                      />
                    </View>
                  )}

                  {/* 速食快餐 */}
                  {val.floorType === 41 && val.group && (
                    <FloorFastFood
                      data={_val}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                    />
                  )}

                  {/* 七鲜接龙 */}
                  {val.floorType === 43 && (
                    <FloorRelay
                      data={val}
                      storeId={this.state.storeId}
                      tenantId={this.state.tenantId || 1}
                      platformId={this.state.platformId || 1}
                      onCoords={this.coords}
                      current={0}
                    />
                  )}

                  {/* 首页轮播 */}
                  {(val.floorType === 35 ||
                    val.floorType === 1 ||
                    val.floorType === 44) &&
                    val.items &&
                    val.items.length > 0 && (
                      <FloorImg
                        data={val}
                        windowWidth={windowWidth}
                        onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                      />
                    )}

                  {val.floorType === 47 && (
                    <FloorCouponTip data={val} onGoToUrl={this.goToUrl} />
                  )}
                  {val.floorType === 48 && (
                    <FloorRedRun
                      data={val}
                      onGoToUrl={this.goToUrl}
                      windowWidth={windowWidth}
                      storeId={this.state.storeId}
                      tenantId={this.state.tenantId || 1}
                      platformId={this.state.platformId || 1}
                    />
                  )}

                  {val.floorType === 51 && (
                    <FloorGroupon
                      data={val}
                      onGoToUrl={this.goToUrl}
                      onGoToDetail={this.goToUrl}
                    />
                  )}

                  {/* 今日值得抢 */}
                  {val && val.floorType && val.floorType === 52 && (
                    <FloorScrambleToday
                      data={val}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                      storeId={this.state.storeId}
                      tenantId={this.state.tenantId || 1}
                      platformId={this.state.platformId || 1}
                      floorType={52}
                      floorNum={val.floorNum || Number(val.sort) + 1}
                    />
                  )}

                  {/* 新品时令 */}
                  {val.floorType === 53 && (
                    <FloorSeasonItems
                      data={val}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                    />
                  )}

                  {/* 优选100 */}
                  {val.floorType === 54 && (
                    <FloorBetter100
                      data={val}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                    />
                  )}

                  {/* 为你推荐 */}
                  {val.floorType === 55 && i === floors.length - 1 && (
                    <View id='floorRecommendForYou'>
                      <FloorRecommendForYou
                        data={val}
                        scrollTop={scrollTop}
                        flag={
                          recommendforYouListLeft && recommendforYouListRight
                            ? true
                            : false
                        }
                        onCoords={this.coords}
                        navHeight={navHeight}
                        isShowApplet={isShowApplet}
                        leftItems={recommendforYouListLeft}
                        rightItems={recommendforYouListRight}
                        recommendForYouProps={recommendForYouProps}
                        onAddCart={this.addCartRecommendForYou.bind(
                          this,
                          buriedPointVo
                        )}
                        onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                        onGoCardOrder={this.goCardOrder.bind(
                          this,
                          buriedPointVo
                        )}
                        onCollect={this.onCollect}
                        windowWidth={windowWidth}
                        onFixedTop={this.onFixedTop}
                        isRecommedLoad={isRecommedLoad}
                        onTabSelect={this.recommendTabChange.bind(this)}
                        onRefresh={this.onRecommendRefresh.bind(this)}
                        // getRecommendGroupTop={this.getRecommendGroupTop.bind(
                        //   this
                        // )}
                        onToRecommendDetail={this.onToRecommendDetail.bind(
                          this
                        )}
                      />
                    </View>
                  )}

                  {val.floorType === 68 && (
                    <FloorQualitySelected
                      data={val}
                      onGoToUrl={this.goToUrl}
                      onGoDetail={this.goDetail}
                      onAddCart={this.addCart}
                    />
                  )}

                  {val.floorType === 69 && (
                    <FloorBrandSelected
                      data={val}
                      onGoToUrl={this.goToUrl}
                      onGoDetail={this.goDetail}
                    />
                  )}

                  {/* 本周值得抢 */}
                  {val.floorType === 71 && (
                    <FreshFloorScrambleToday
                      theme='week'
                      isSwiper
                      data={val}
                      onGoDetail={this.onGoDetail.bind(this)}
                      onAddCart={this.addCart}
                      onSearchMore={this.onSearchMore.bind(this, val)}
                    />
                  )}

                  {/* 小程序直播入口 */}
                  {val.floorType === 83 && (
                    <FloorNotice
                      data={val}
                      windowWidth={windowWidth}
                      onGoToUrl={this.goToUrl}
                    />
                  )}

                  {/*  新人任务入口 93 */}
                  {val.floorType === 93 && val.newUserTaskEntranceInfo && (
                    <FloorNewPersonEntry
                      data={val}
                      onGoNewPerson={this.onGoMoreTask.bind(this, 'floor', val)}
                    />
                  )}

                  {/* 功能聚合 */}
                  {val &&
                    val.floorType &&
                    val.floorType === 100 &&
                    afterResultList.length > 0 && (
                      <FloorColumnOperate
                        data={afterResultList}
                        columnRuleList={this.columnRuleList}
                        onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                      />
                    )}
                </View>
              );
            })}
          </View>
        )}
        {/* 首页拖底图 */}
        {!isLoad && floors.length === 0 && (
          <EmptyPage
            style={{
              height: `${
                (this.state.windowHeight * 750) / this.state.windowWidth
              }rpx`,
            }}
            onRefresh={this.onPullDownRefresh}
            showButton
          />
        )}

        {/* 新人任务弹框 */}
        {showAwardModal && newUserTaskPop && (
          <FloorNewPersonModal
            isHome
            data={newUserTaskPop}
            show={showAwardModal}
            onClose={this.onCloseModal.bind(this)}
            onGoMoreTask={this.onGoMoreTask}
            onGetTask={this.onGetTask}
            goDetailButton={goDetailButton}
          />
        )}

        {/* 口令红包弹窗 */}
        {goCopyFlag && (
          <View>
            <FloorRedPop
              source='index'
              data={redPassword}
              goCopyFlag={goCopyFlag}
              onGoCopy={this.handleCopy}
              storeId={this.state.storeId}
              onCloseRedPop={this.onCloseRedPop}
              data-pass={redPassword.command}
            />
          </View>
        )}

        {/* 未登录弹框 */}
        {customerFlag && (
          <View>
            <FloorRedPop
              source='already'
              data={redPassword}
              customerFlag={customerFlag}
              storeId={this.state.storeId}
              onGoCopy={this.handleCopy}
              onCloseRedPop={this.onCloseGetPop}
            />
          </View>
        )}

        <View className='home-bottom'>
          {/* 长列表后的内容 */}
          {/* 关注公众号组件 */}
          {!isConcern && (
            <View
              style={{
                position: 'fixed',
                bottom: `${isIphoneX ? 162 : 128}rpx`,
                left: '28rpx',
                right: '28rpx',
                zIndex: 100,
              }}
            >
              <OfficialAccount />
            </View>
          )}
          {/* 为你推荐的load图 */}
          {!isLoad && isBottomLoad && (
            <View className='load-home-cont lazy-load-img'>
              <Image className='load-img' src={loadPicture} lazyLoad />
            </View>
          )}
          {/* 页面底部七鲜拖底图 */}
          {!isLoad && !isBottomLoad && this.showBottonLogo && (
            <View className='bottom'>
              <FreshBottomLogo />
            </View>
          )}

          {/* 加车弹框 */}
          {addCartPopData && (
            <FloorAddCart
              data={addCartPopData}
              onAddCart={this._addCart}
              onClose={this.onCloseAddCartPop}
            />
          )}
          {/* 切换租户的动画组件 */}
          {showChangeBusinessesLayer === true && (
            <ChangeBusinessesLayer
              newImg={this.state.newImg}
              originalImg={this.state.originalImg}
              onHandelShow={this.handelShowChangeBusinessesLayer}
              storeName={storeName}
            />
          )}

          {/* 新人专区弹窗 */}
          {isShowNewCustomer && (
            <View className='new-customer-modal'>
              <View className='box-bg'>
                <View className='img'></View>
                <View className='txt'>~新人福利到~</View>
              </View>
            </View>
          )}
          {/* 自定义底部菜单 */}
          <CustomTabBar
            selected={0}
            onFlag={this.isFixedTop}
            current
            onSwitchTab={this.onRecommendRefresh.bind(this)}
          />
          {/* 返回顶部按钮 */}
          {showGoTop && (
            <View
              className='go-top'
              style={{
                bottom: !isConcern ? px2vw(470) : px2vw(300),
              }}
            >
              <FreshFloatBtn
                type='top'
                title='顶部'
                color='rgb(94, 100, 109)'
                onClick={this.goTop.bind(this)}
              />
            </View>
          )}

          {/* 领券订阅消息 */}
          <SubscribeModal
            isIphoneX={app.globalData.isIphoneX}
            type={1}
            show={remindFlag}
          />
          <SubscribeModal
            isIphoneX={app.globalData.isIphoneX}
            type={2}
            show={restartFlag}
            onClose={this.onCloseSubscribe.bind(this)}
          />

          {/* 修正地址弹层 */}
          {this.state.iShowAdsModel && (
            <ModelAdsErr
              sendTo={this.state.sendTo || ''}
              lat={this.state.fLat}
              lon={this.state.fLon}
              onSureAds={this.sureAds}
              onGoAds={this.goAds}
            />
          )}

          {/* 隐私政策弹框 */}
          {policyCon &&
            policyCon.tip !== '' &&
            policyCon.versionCode &&
            policyShow && (
              <PolicyModal
                data={policyCon}
                show={policyShow}
                onGoToPolicyUrl={this.onGoToPolicyUrl}
                onOk={this.onOkPolicy}
                onCancel={this.onCancelPolicy}
              />
            )}
        </View>
      </View>
    );
  }
}
