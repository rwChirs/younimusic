import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View, OfficialAccount } from "@tarojs/components";
import {
  getWareStallInfo,
  getDeliveryWareTip,
  getWareDetail,
  getWarePreSaleRemind,
  getWarePreSaleCancelRemind,
  getSkuDetailLaunchApi,
  getRankingListApi,
  getSimilarGoods,
  getLimitMaxNum,
  getWareCategoryAttrApi,
  getTenantShopService,
  getEvaluationJumpSwitch,
  getLoginStatus,
  getCommentListApi,
  getChangeAddressService,
  getCookBookListApi,
  getSkuDetailAddressService,
  getDetailShare,
  getCouponCouponByWare,
  getCouponSend,
  getCouponByWareListApi,
  getWareTrace,
  getUserConfig,
  getCartNum,
  getWareExtApi,
  addCart,
  getConfigService,
  getQueryTemplate,
  getSaveTemplate,
  detailAddCartCheckService,
} from "@7fresh/api";
import CommonPageComponent from "../../utils/common/CommonPageComponent";
import { logClick, structureLogClick } from "../../utils/common/logReport";

import FloatMenus from "./float-menus";
import ShoppingCart from "./shopping-cart";
import Tab from "./tab";
import CustomSwiper from "../../components/custom-swiper";
import ProductAdvanceSale from "./product-advance-sale";
import ProductBasic from "./product-basic";
import ListItem from "./list-item";
import Popup from "../../components/popup";
import SwitchShopModal from "../../components/switch-shop-modal";
import ResourcesImg from "./resources-img";

import Recipe from "./recipe"; //菜谱
import RecommendForYou from "./recommend-for-you";
import RecommendForYouNew from "./recommend-for-you-new";
import RecommendPaper from "./recommend-paper"; // 推荐语
import ProductDetail from "./product-detail";
import Comments from "./comments";
import StallInfo from "./stallInfo";
import Loading from "../../components/loading";
import BottomTip from "./bottom-tip"; // 底部提示条
import NavBar from "../../components/nav-bar";
import DownloadModal from "../../components/download-modal";
import FloorRecommendProduct from "./floor-recommend-product";
import DetailRecommendTail from "./detail-recommend-tail"; //搭配购

import FreshPromoteItemForHere from "./promote-item-for-here"; // 促销标 优惠券 楼层
import FreshSettlementCouponPopupForHere from "./settlement-coupon-popup-for-here";
import SubscribeModal from "../../components/subscribe-modal";

// new-ui迁移到新小程序
import FreshServiceBtn from "./FreshServiceBtn";
import FreshSolitaireDetailPanel from "./FreshSolitaireDetailPanel";
import FreshBottomLogo from "./FreshBottomLogo";

import {
  h5Url,
  getRealUrl,
  isFollowWx,
  getUrlParams,
  getReadlyAddressList,
  getURLParameter,
  // userLogin,
  px2vw,
  filterImg,
} from "../../utils/common/utils";
import { getLocation } from "../../utils/common/index";
import "./index.scss";
import RpxLine from "../../components/rpx-line";
import reportPoints from "./reportPoints";
import PriceDesc from "./price-desc";
import utils from "../login/util";
import getUserStoreInfo, {
  saveAddrInfo,
  getSkuList,
} from "../../utils/common/getUserStoreInfo";
import {
  exportPoint,
  getPageExposure,
  getExposure,
} from "../../utils/common/exportPoint";
import goPage from "../index/goPage";

const app = Taro.getApp();

export default class Detail extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadModalFlag: false,
      imgUrlDownload: "",
      wareQualityAttrList: [],
      couponInfoWeb: [], //优惠券列表数据
      storeId: null,
      skuId: null,
      currentTabId: 0,
      evaluationJumpSwitch: false,
      buriedExplabel: "",
      tabs: [
        {
          name: "商品",
          id: 0,
          class: "product",
          show: true,
          scrollTop: 0,
        },
        {
          name: "菜谱",
          id: 1,
          class: "recipes",
          show: false,
          scrollTop: 0,
        },
        {
          name: "评价",
          id: 2,
          class: "comments",
          show: false,
          scrollTop: 0,
        },
        {
          name: "详情",
          id: 3,
          class: "detail",
          show: true,
          scrollTop: 0,
        },
        {
          name: "推荐",
          id: 4,
          class: "recommend",
          show: false,
          scrollTop: 0,
        },
      ],
      numInCart: 0,
      systemInfo: {},
      productDetail: {},
      remarks: [],
      isLogin: false,
      sp: "",
      isShowBackToTop: false,
      popup: {
        show: false,
        height: 400,
      },
      aList: [],
      bList: [],
      address: "",
      addressId: 608551,
      deliveryTime: "",
      coord: {
        lat: "39.772881",
        lon: "116.468971",
      },
      isCanAddCart: true,
      promotion: {
        // 惠搭配
        wareInSuits: {
          id: "wareInSuits",
          show: false,
          title: "惠搭配",
          type: "package",
          data: [],
          canPopup: true,
        },
      },
      properties: {
        // 属性
        relationWareInfos: {
          id: "attribute",
          show: false,
          title: "属性",
          type: "buttons",
          data: [],
          canPopup: false,
        },
        // 套餐
        suitIncludeWares: {
          id: "suitInclude",
          show: false,
          title: "套餐含",
          type: "package",
          data: [],
          showPrice: false,
          canPopup: true,
        },
        // 加工服务
        service: {
          id: "service",
          show: false,
          title: "已选",
          type: "service",
          data: "",
          canPopup: true,
        },
      },
      from: "miniapp",
      isProductDetailLoaded: false,
      isShowRecommendList: true,
      isShowModal: false,
      serviceTagId: 0,
      forbidScrollFlag: false,
      recommendList: [],
      isCanPreSale: false,
      isPop: false,
      scrollTop: "0px",
      comments: [],
      scene: Taro.getStorageSync("scene"),
      recipeList: [],
      isConcern: true,
      isFirstShow: true,
      isLoad: true,
      activityInfo: {},
      attrs: [],
      productTransRecommend: [],
      preSaleInfo: {},
      waitStartTime: 0,
      time: {},
      stallInfo: {},
      stallPopup: {},
      appParameter: "",
      deliveryStatusTip: "", // 配送状态提醒
      suportNavCustom: false, //是否支持自定义导航栏
      resourcePositions: [], //资源投放
      rankingList: {}, //榜单
      easyBuyWare: false, //是否是放心购产品 true:是 false:否
      easyBuy: {}, //放心购服务
      beforeFilterAddressNum: "", //过滤前总地址数量（现有地址数量）
      baseAddressNum: "", //基础地址数量，当现有地址数量小于基础地址数量时候， 无需过滤直接创建
      couponParams: {
        skuIds: [getCurrentInstance().router.skuId],
        page: 1,
        pageSize: 20,
        module: "ware",
      },
      traceUrl: "",
      middleShopList: [],
      touchstone_expids: "", // ABtest 密匙
      strategyABTest: "", // ABtest value值
      userConfigValue: "", // ABtest 用户配置
      isNewIphone: false,
      AddCartBuriedExpLabel: "",
      AddCartStrategyABTest: "",
      AddCartUserConfigValue: "",
      recommendTailData: [],
      pageStyle: {},
      isLoadPromoteCoupon: false, // 促销标和优惠券都拿到数据才展示
      promoteListInfo: [], // 促销标数据
      showCouponLabels: [], // 优惠券列表数据
      showPromoteCouponModal: false,
      remindFlag: false,
      restartFlag: false,
      remindNum: 0,
      subscriptionType: 1,
      windowHeight: 0,
      windowWidth: 0,
    };
  }

  couponCodes = [];
  tmplIds = "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw";
  alreadyGet = false;
  isAddCart = false;
  timeId = null;
  windowWidth = Taro.getSystemInfoSync().windowWidth;

  /**
   * 如果本地存储含defaultInfo信息，则优先使用defaultInfo地址信息；
   * 如果本地存储没有，则判断用户是否登录；
   * 如果已登录，优先获取用户默认地址，并存储本地；
   * 如果已登录，还未创建地址，则获取当前定位信息；
   * 如果未登录，获取当前定位信息；
   */

  componentWillMount() {
    let _self = this;
    Taro.getSystemInfo({
      success: (res) => {
        const suportNavCustom = res.version.split(".")[0] >= 7;
        this.setState(
          {
            systemInfo: res,
            statusHeight: res.statusBarHeight * 2,
            compatibleHeight: res.statusBarHeight * 2 + 80,
            windowHeight: res.windowHeight || 0,
            windowWidth: res.windowWidth || 0,
            suportNavCustom,
            isNewIphone: /iphone/i.test(res.model) && res.windowHeight >= 812,
          },
          () => {
            let clientRect = wx.getMenuButtonBoundingClientRect();

            if (clientRect) {
              this.setState({
                navHeight: suportNavCustom
                  ? (((clientRect.bottom +
                      clientRect.top -
                      res.statusBarHeight) *
                      2) /
                      res.windowWidth) *
                    375
                  : 0,
              });
            } else {
              this.setState({
                navHeight: this.state.compatibleHeight,
              });
            }
          }
        );
        if (!suportNavCustom) {
          Taro.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
            animation: {
              duration: 400,
              timingFunc: "easeIn",
            },
          });
        }

        if (
          res.model.indexOf("iPhone X") > -1 ||
          res.model.indexOf("iPhone 11") > -1
        ) {
          _self.setState({
            isIpx: true,
          });
        }
      },
    });
    Taro.hideShareMenu();
    let { storeId, skuId } = getCurrentInstance().router.params;

    if (
      getCurrentInstance().router.params.scene &&
      !getCurrentInstance().router.params.room_id
    ) {
      getRealUrl(
        decodeURIComponent(getCurrentInstance().router.params.scene)
      ).then((res) => {
        const params = getUrlParams(res && res.code);
        this.setState(
          {
            storeId: params && params.storeId,
            skuId: params && params.skuId,
            appParameter: `openapp.sevenfresh://virtual?params={"category":"jump","des":"detail","skuId":${
              params.skuId
            },"storeId":${
              params && params.storeId
            },"changeAddressWithStoreID":true,"params":{"changeAddressWithStoreID": true,"storeId":${
              params && params.storeId
            }}}`,
          },
          () => {
            this.checkIsLogin();
          }
        );
      });
      return;
    }

    if (getCurrentInstance().router.params.q) {
      if (getCurrentInstance().router.params.q) {
        const params = getUrlParams(getCurrentInstance().router.params.q);
        if (params.skuId) {
          skuId = params.skuId;
        }
        if (params.storeId) {
          storeId = params.storeId;
        }
      }
    }
    this.setState(
      {
        storeId: storeId ? storeId : app.globalData.$app.storeId,
        skuId,
      },
      () => {
        Taro.getApp().$app.globalData.storeId = storeId;
        this.checkIsLogin(storeId);
        this.setState({
          appParameter: `openapp.sevenfresh://virtual?params={"category":"jump","des":"detail","skuId":${skuId},"storeId":${storeId},"changeAddressWithStoreID":true,"params":{"changeAddressWithStoreID": true,"storeId":${storeId}}}`,
        });
      }
    );
    this.userLogin();
  }

  componentDidShow() {
    if (!this.state.isFirstShow) {
      this.checkIsLogin();
    } else {
      this.setState({
        isFirstShow: false,
      });
    }

    this.onPopupClose();
    this.onPageShow();
    getCurrentInstance().router.params.room_id &&
      this.setChan({
        room_id: getCurrentInstance().router.params.room_id,
      });

    // 小程序打开app浮层按钮 曝光埋点
    if (
      Number(getCurrentInstance().router.params.scene) === 1036 ||
      Number(this.state.scene) === 1036
    ) {
      const params = {
        router: getCurrentInstance().router,
        eid: "Product_details_share_open",
        eparam: {},
      };
      getExposure(params);
    }

    // 单点曝光
    getLoginStatus()
      .then((data) => {
        if (Taro.getStorageSync("loginMark")) {
          this.actPoint(data.isNewUser);
        }
        Taro.removeStorageSync("loginMark");
      })
      .catch(() => {
        Taro.setStorageSync("loginMark", 1);
      });
  }

  componentDidHide() {
    this.onPageHide();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.waitStartTime === this.props.waitStartTime) {
  //     return;
  //   }
  //   clearInterval(this.timeId);
  //   this.setState(
  //     {
  //       waitStartTime: nextProps.waitStartTime,
  //     },
  //     () => {
  //       this.startCountDown();
  //     }
  //   );
  // }

  // 单点曝光
  actPoint = (isNewUser) => {
    this.expPoint(isNewUser);
  };
  expPoint = (isNewUser) => {
    const params = {
      router: getCurrentInstance().router,
      eid: "LoginSource",
      eparam: {
        pageId: "0014",
        pageName: "商品详情页",
        pentrance: "009",
        pentranceName: "普通商详页引入",
        pextra: getCurrentInstance().router.params,
        isNewUser,
        plant: "miniapp",
        eventId: "LoginSource",
      },
    };
    console.log("单点曝光", params);
    getExposure(params);
  };

  startCountDown = () => {
    clearInterval(this.timeId);
    if (this.state.waitStartTime === 0) {
      let time = {
        hour: "00",
        minute: "00",
        second: "00",
      };
      this.setState({
        time,
      });
    } else {
      this.timeId = setInterval(() => {
        let waitStartTime = this.state.waitStartTime;
        this.setState(
          {
            waitStartTime: waitStartTime - 1000,
            time: this.transformTime(this.state.waitStartTime),
          },
          () => {}
        );
      }, 1000);
    }
  };

  /**
   * 初始化数据
   */
  initData = (storeId, skuId) => {
    if (skuId) {
      this.getProductData(storeId, skuId); // 获取商品基础数据
      this.getWareTrace(skuId); // 查看冷链产品溯源信息
      this.getComment(storeId, skuId); // 获取评论数据
      this.getWareStallInfo(skuId); // 获取商品档口信息
      this.getCartNum(storeId); // 获取购物车数量

      // this.getRecommend(skuId); // 获取推荐
      this.userConfig(skuId); //获取ab配置 然后获取推荐
      this.getRecipes(storeId, skuId);
      this.getWareDetailShare(storeId, skuId);
      this.getRecommondPapar(storeId, skuId); // 获取推荐语信息 + 获取商详属性标
      this.getDeliveryWareTip(skuId); // 获取配送状态提醒
      // this.getWareQualityAttrList(storeId, skuId); //获取商详属性标
      this.getTenantShop();
      this.getEvaluationJumpSwitch();
    } else {
      this.gotoHome();
    }
  };

  /**
   * 获取推荐语信息
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */
  getRecommondPapar = (storeId, skuId) => {
    getWareCategoryAttrApi({ storeId, skuId })
      .then((res) => {
        var attrTmp = [];
        var productTransRecommendTmp = [];
        res &&
          res.wareCategoryAttr &&
          res.wareCategoryAttr.length > 0 &&
          res.wareCategoryAttr.map((attr, index) => {
            if (attr.attrName && attr.attrName.indexOf("推荐语") != -1) {
              attrTmp.push(res[index]);
              this.setState({
                ...this.state.attrs,
                attrs: attrTmp,
              });
            } else {
              productTransRecommendTmp.push(res[index]);
            }
          });
        var productTransRecommendTm = [];
        productTransRecommendTmp.map((spec) => {
          productTransRecommendTm.push({
            name: spec && spec.attrName,
            value: spec && spec.attrValNames.join(" "),
          });
        });
        this.setState({
          productTransRecommend: productTransRecommendTm,
          wareQualityAttrList:
            res && res.wareQualityAttrList
              ? res && res.wareQualityAttrList
              : [],
        });
      })
      .catch((err) => console.log(err));
  };

  getRecipes = (storeId, skuId) => {
    getCookBookListApi({ storeId, skuId })
      .then((res) => {
        this.setState({
          recipeList: res && !!res.cookBookList ? res.cookBookList : [],
          tabs: this.state.tabs.map((tab) => {
            if (tab.class === "recipes") {
              tab.show = res.cookBookList && res.cookBookList.length > 0;
            }
            return tab;
          }),
        });
      })
      .catch((err) => console.log(err));
  };

  userLogin = () => {
    getLoginStatus()
      .then((res) => {
        this.setState({
          sp: res.sp,
        });
      })
      .catch((err) => console.log(err));
  };
  /**
   * 检查是否登录
   */
  checkIsLogin = (storeId) => {
    const ptKey =
      Taro.requirePlugin("loginPlugin").getStorageSync("jdlogin_pt_key");
    this.setState({
      isLogin: !!ptKey,
    });
    let lng = getCurrentInstance().router.params.lng;
    let lat = getCurrentInstance().router.params.lat;
    let storeIdTmp = this.state.storeId;
    /** 判断从新建地址回来更新门店id和经纬度 start */
    let createAddress = Taro.getStorageSync("createAddress");
    if (createAddress === 1) {
      Taro.setStorageSync("createAddress", "");
      let addressInfo = Taro.getStorageSync("addressInfo");
      lng = addressInfo.lng;
      lat = addressInfo.lat;
      storeIdTmp = addressInfo.storeId;
      this.setState({
        storeId: addressInfo.storeId,
      });
    }
    /** 判断从新建地址回来更新门店id和经纬度 end */
    getUserStoreInfo(storeIdTmp, lng, lat, "", 4).then((res) => {
      if (storeId && storeId > 0) {
        if (
          res &&
          res.storeId > 0 &&
          parseInt(res.storeId) === parseInt(storeId)
        ) {
          Taro.getApp().$app.globalData.storeId = res.storeId;
          this.setState(
            {
              address: `${res.addressSummary || ""}${res.addressExt || ""}${
                res.where || ""
              }`,
              addressId: res.addressId,
              storeId: res.storeId,
              coord:
                res && res.lon
                  ? {
                      lon: res.lon,
                      lat: res.lat,
                    }
                  : this.state.coord,
            },
            () => {
              this.initData(this.state.storeId, this.state.skuId);
              this.getUserAddress(this.state.storeId, this.state.skuId);
            }
          );
        } else {
          Taro.getApp().$app.globalData.storeId = storeId;
          this.setState(
            {
              address: ``,
              addressId: "",
              storeId: storeId,
              coord: this.state.coord,
            },
            () => {
              this.initData(this.state.storeId, this.state.skuId);
              this.getUserAddress(this.state.storeId, this.state.skuId);
            }
          );
        }
      } else {
        Taro.getApp().$app.globalData.storeId = res.storeId;
        this.setState(
          {
            address: `${res.addressSummary || ""}${res.addressExt || ""}${
              res.where || ""
            }`,
            addressId: res.addressId,
            storeId: res.storeId,
            coord:
              res && res.lon
                ? {
                    lon: res.lon,
                    lat: res.lat,
                  }
                : this.state.coord,
          },
          () => {
            this.initData(this.state.storeId, this.state.skuId);
            this.getUserAddress(this.state.storeId, this.state.skuId);
          }
        );
      }
    });
  };

  /**
   * 获取商品数据
   * @param {Number}} storeId 店铺Id
   * @param {Number} skuId 商品Id
   */
  getProductData = (storeId, skuId) => {
    const { coord } = this.state;
    let { promotionId } = getCurrentInstance().router.params;

    const params = {
      skuId,
      addressInfo: coord,
      promotionId,
      storeId,
    };
    getWareDetail(params)
      .then((data) => {
        console.log("【7fresh.ware.detail】:", data);
        let product = data ? data.wareInfo : {};
        let res = {};
        if (product) {
          switch (product.status) {
            case 1:
              product.statusText = "已下架";
              product.statusMsg = "抱歉，当前配送地址对应门店，该商品已下架";
              break;
            case 3:
              product.statusText = "已抢完";
              product.statusMsg = "抱歉，当前配送地址对应门店，该商品已抢完";
              break;
            case 4:
              product.statusText = "已删除";
              product.statusMsg = "抱歉，当前配送地址对应门店，该商品已下架";
              break;
            case 5:
              if (product.seckillInfo) {
                product.statusText = product.seckillInfo.startTime;
                product.statusMsg = "";
              } else if (product.preSale) {
                product.statusText = "";
                product.statusMsg = "";
              } else {
                product.statusText =
                  product.shipmentInfo.showDeliveryDateAndTime;
                product.statusMsg = "抱歉，当前配送地址对应门店，暂无该商品";
              }
              break;
            case 9:
              product.statusText = "无效商品";
              product.statusMsg = "抱歉，该商品不在配送范围";
              break;
            default:
              product.statusText = "";
              product.statusMsg = "";
          }
          res = {
            ...product,
            imageInfoList: product.imageInfoList,
            jdPrice: product.jdPrice ? parseFloat(product.jdPrice) : null,
            marketPrice: product.marketPrice
              ? parseFloat(product.marketPrice)
              : null,
          };
        }
        this.onProductPageShow(res);
        Taro.showShareMenu();
        const promotionTypes = res.promotionTypes
          ? res.promotionTypes.filter(
              (type) =>
                (type.showTexts && type.showTexts.length > 0) ||
                !!type.limitBuyText
            )
          : [];
        const promoiton = {
          ...this.state.promotion,
          promotionTypes: {
            ...this.state.promotion.promotionTypes,
            data: promotionTypes,
            show: promotionTypes.length > 0 ? true : false,
          },
        };
        const relationWareInfos = res.relationWareInfos
          ? res.relationWareInfos.map((attr) => {
              return {
                id: attr.skuId,
                name: attr.saleAttrInfos[0].valName,
              };
            })
          : [];
        let attrInfoDesc = this.getRemarksStr(res.attrInfoList);
        let serviceData =
          (res.saleSpecDesc ? res.saleSpecDesc : "") +
          (res.servicetagName ? "，" + res.servicetagName : "") +
          (attrInfoDesc ? "，" + attrInfoDesc : "");
        serviceData = serviceData.replace(/^，/, "");

        const properties = {
          ...this.state.properties,
          relationWareInfos: {
            ...this.state.properties.relationWareInfos,
            current: res.skuId,
            data: relationWareInfos,
            show: relationWareInfos.length > 0 ? true : false,
          },
          service: {
            ...this.state.properties.service,
            data: serviceData,
            show: res.isPop,
          },
        };
        this.setState(
          {
            isProductDetailLoaded: true,
            deliveryTime:
              res.status !== 2
                ? product.statusText
                : res.shipmentInfo && res.shipmentInfo.showDeliveryDateAndTime
                ? res.shipmentInfo.showDeliveryDateAndTime
                : res.preSale
                ? res.reserveContentInfo
                : "",
            productDetail: res,
            isPop: res.isPop ? res.isPop : false,
            isCanPreSale:
              res.preSaleInfo &&
              res.preSaleInfo.type &&
              res.preSaleInfo.type === 1
                ? true
                : false,
            isCanAddCart: res.addCart ? res.addCart : false,
            serviceTagId: res.serviceTagId,
            activityInfo:
              res.activiyInfoList && res.activiyInfoList[0]
                ? res.activiyInfoList[0]
                : "",
            promotion: promoiton,
            properties: properties,
            preSaleInfo: res.preSaleInfo,
            preSaleNotice:
              res.preSaleInfo && res.preSaleInfo.preSaleNotice
                ? res.preSaleInfo.preSaleNotice
                : false,
            waitStartTime:
              res.preSaleInfo &&
              res.preSaleInfo.waitStartTime &&
              res.preSaleInfo.waitStartTime !== null
                ? res.preSaleInfo.waitStartTime
                : 0,
            remarks: res.attrInfoList,
            isLoad: false,
            easyBuyWare: res && res.easyBuyWare ? res.easyBuyWare : "",
            easyBuy: res && res.easyBuy ? res.easyBuy : false,
            promoteListInfo: promotionTypes, // todo
            isRealName:
              res && res.productfeatures && res.productfeatures.isRealName
                ? true
                : false,
          },
          () => {
            this.getWareExt(storeId, skuId); // 获取
            this.getSkuDetailLaunch(skuId);
            this.getRankingList(skuId);
            exportPoint(getCurrentInstance().router, res.status).then(
              (unionId) => {
                this.isFollowWx(unionId);
              }
            );
            setTimeout(() => {
              getPageExposure({
                obj: this,
                id: "Product_details_000",
                num: 8,
              });
            }, 500);

            // 预售倒计时
            if (this.state.preSaleInfo && this.state.waitStartTime > 0) {
              if (
                this.state.preSaleInfo.status === 2 ||
                this.state.preSaleInfo.status === 3 ||
                (this.state.preSaleInfo.status === 1 &&
                  this.state.waitStartTime <= 86400000)
              ) {
                this.startCountDown();
              }
            }
          }
        );
      })
      .catch((err) => {
        Taro.showToast({
          title: err,
          icon: "none",
          duration: 2000,
        });
        this.setState({
          isCanAddCart: false,
          isLoad: false,
        });
        // 接口请求失败后，删除无货找相似的缓存
        Taro.removeStorageSync("renderRecommendData");
        Taro.removeStorageSync("countRecommend");
      });
  };

  // 渲染倒计时
  transformTime = (endTime) => {
    let surplus = endTime;
    const day = parseInt(surplus / 1000 / 60 / 60 / 24, 10);
    const hour = parseInt((surplus / 1000 / 60 / 60) % 24, 10);
    const minute = parseInt((surplus / 1000 / 60) % 60, 10);
    const second = parseInt((surplus / 1000) % 60, 10);

    if (
      Number(day) <= 0 &&
      Number(hour) <= 0 &&
      Number(minute) <= 0 &&
      Number(second) <= 0
    ) {
      clearInterval(this.timeId);
      this.timeId = null;
      this.onGetValue();
    }

    return {
      day: day,
      hour: hour < 10 ? `0${hour}` : hour,
      minute: minute < 10 ? `0${minute}` : minute,
      second: second < 10 ? `0${second}` : second,
    };
  };

  // 预售设置提醒
  getWarePreSaleRemind = (skuId) => {
    getWarePreSaleRemind({
      skuId: skuId,
    })
      .then((res) => {
        console.log("【7fresh_ware_preSaleRemind】:", res);
        if (res && res.success) {
          Taro.showToast({
            title: res.toast || "开售前3分钟会提醒您哟~",
            icon: "none",
          });
          this.getProductData(this.state.storeId, this.state.skuId);
        }
        if (res.code === 3) {
          this.gotoLogin();
        }
      })
      .catch((err) => {
        if (err.code === 3) {
          this.gotoLogin();
        }
      });
  };

  // 预售取消提醒
  getWarePreSaleCancelRemind = (skuId) => {
    getWarePreSaleCancelRemind({
      skuId: skuId,
    })
      .then((res) => {
        console.log("【7fresh_ware_preSaleCancelRemind】:", res);
        if (res && res.success) {
          Taro.showToast({
            title: res.toast || "已取消提醒~",
            icon: "none",
          });
          this.getProductData(this.state.storeId, this.state.skuId);
        }

        if (res.code === 3) {
          this.gotoLogin();
        }
      })
      .catch((err) => {
        if (err.code === 3) {
          this.gotoLogin();
        }
      });
  };

  /**
   * 获取评论信息
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */
  getComment = (storeId, skuId) => {
    getCommentListApi({ storeId, skuId })
      .then((res) => {
        this.setState({
          tabs: this.state.tabs.map((tab) => {
            if (tab.class === "comments") {
              if (
                res &&
                res.commentList &&
                res.commentList.length > 0 &&
                res.commentShow
              ) {
                tab.show = true;
              }
            }
            return tab;
          }),
          comments: res,
        });
      })
      .catch((err) => console.log(err));
  };

  /**
   * 查看冷链产品溯源信息
   * @param {Number} skuId 商品id
   */
  getWareTrace = (skuId) => {
    getWareTrace({ skuId })
      .then((res) => {
        console.log("【7fresh.ware.trace】:", res);
        if (res && res.success) {
          this.setState({
            iShowWareTrace: res.isDisplay,
            traceUrl: res.traceUrl,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // 跳转冷链页面
  goWareTrace = () => {
    const { skuId, traceUrl } = this.state;
    structureLogClick({
      eventId: "commodityDetailPage_foodTraceInfo_click",
      eventName: "商品详情页_食品溯源信息模块_点击进入溯源信息详情页",
      owner: "ruanwei",
      jsonParam: {
        clickType: "-1",
        pageId: "0014",
        pageName: "商品详情页",
        clickId: "commodityDetailPage_foodTraceInfo_click",

        firstModuleId: "foodTraceInfo",
        firstModuleName: "食品溯源信息模块",
      },
    });
    const url = `${traceUrl}?coldChainId=${skuId}`;
    utils.navigateToH5({ page: url });
  };

  /**
   * 商品所属档口信息
   * @param {*} storeId
   */
  getWareStallInfo = (skuId) => {
    getWareStallInfo({
      skuId: skuId,
    })
      .then((res) => {
        console.log("【档口信息】:", res);
        if (res && res.stallInfo) {
          this.setState({ stallInfo: res.stallInfo }, () => {});
        } else {
          console.log("stallInfo为空");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  /**
   * 获取配送状态提醒
   * @param {*} skuId
   */
  getDeliveryWareTip = (skuId) => {
    getDeliveryWareTip({
      skuId: skuId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({ deliveryStatusTip: res.tip || "" });
        }
      })
      .catch(() => {});
  };

  /**
   * 获取购物车数量
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */
  getCartNum = (storeId) => {
    getCartNum(storeId)
      .then((res) => {
        const allCartWaresNumber = res.allCartWaresNumber || 0;
        this.setState({
          numInCart: allCartWaresNumber > 99 ? "99+" : allCartWaresNumber,
        });
      })
      .catch((err) => console.log(err));
  };

  /**
   * 获取优惠券、惠搭配信息
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */
  getWareExt = (storeId, skuId) => {
    const { popup } = this.state;
    getWareExtApi({
      skuId,
      storeId,
    })
      .then((res) => {
        let popupData = [];
        if (popup && popup.show && popup.id === "coupon") {
          popupData = res && res.showCouponLabels ? res.showCouponLabels : [];
        }
        this.setState(
          {
            properties: {
              ...this.state.properties,
              suitIncludeWares: {
                ...this.state.properties.suitIncludeWares,
                data: res.suitIncludeWares ? [res.suitIncludeWares] : [],
                show: res.suitIncludeWares ? true : false,
              },
            },
            promotion: {
              ...this.state.promotion,
              wareInSuits: {
                ...this.state.promotion.wareInSuits,
                data: res.wareInSuits ? res.wareInSuits : [],
                show:
                  res.wareInSuits &&
                  res.wareInSuits.packList &&
                  res.wareInSuits.packList.length > 0
                    ? true
                    : false,
              },
              couponLabels: {
                ...this.state.promotion.couponLabels,
                data: res && res.showCouponLabels ? res.showCouponLabels : [],
                show:
                  res && res.showCouponLabels && res.showCouponLabels.length > 0
                    ? true
                    : false,
              },
            },
            popup: {
              ...popup,
              data: popupData,
            },
            // todo 优惠券信息
            showCouponLabels:
              res && res.showCouponLabels ? res.showCouponLabels : [],
            isLoadPromoteCoupon: true,
          },
          () => {
          }
        );
      })
      .catch((err) => console.log(err));
  };

  /**
   * 获取用户地址
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */
  getUserAddress = (storeId, skuId) => {
    if (Number(storeId) > 0 && Number(skuId) > 0) {
      getSkuDetailAddressService({ storeId, skuIds: [skuId] })
        .then((res) => {
          this.setState({
            aList: getReadlyAddressList(res.addressInfos).aList,
            bList: getReadlyAddressList(res.addressInfos).bList,
            beforeFilterAddressNum:
              res && res.beforeFilterAddressNum
                ? res.beforeFilterAddressNum
                : "",
            baseAddressNum: res && res.baseAddressNum ? res.baseAddressNum : "",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  /**
   * 定位当前地址
   */
  getCurrentLocation = () => {
    getLocation()
      .then((res) => {
        this.changeUserAddress("", "", res.latitude, res.longitude);
      })
      .catch((err) => {
        console.log(err);
        if (
          getCurrentInstance().router.params.storeId &&
          getCurrentInstance().router.params.skuId
        ) {
          this.initData(
            getCurrentInstance().router.params.storeId,
            getCurrentInstance().router.params.skuId
          );
          return;
        }
      });
  };

  /**
   * 切换地址
   * isInvalid=true  则 toast提示
   * isInvalid=false，addCart: true，正常切换
   * isInvalid=false，addCart: false，购物车按钮置灰
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   * @param {Number} lat 纬度
   * @param {Number} lon 经度
   */
  changeUserAddress = (address, skuId, lat, lon) => {
    console.log("address=>", address);
    const data = {
      skuIds: getSkuList(skuId) ? getSkuList(skuId) : [],
      // nowBuy: 3,
      addressId: address.addressId,
      lat: lat,
      lon: lon,
    };
    getChangeAddressService(data)
      .then((res) => {
        if (res && res.success && !res.valid) {
          Taro.showToast({
            title: res.invalidTip,
            duration: 2000,
          });
          return;
        } else {
          const tenantShopInfo = res.tenantShopInfo;
          const length = tenantShopInfo && tenantShopInfo.length;
          const lbsData = Taro.getStorageSync("addressInfo");
          let storeId = 0;
          lat = 0;
          lon = 0;
          if (length === 1 && tenantShopInfo) {
            storeId = tenantShopInfo[0] && tenantShopInfo[0].storeId;
            lat = address.lat;
            lon = address.lon;
            address = {
              ...address,
              ...tenantShopInfo[0],
              ...{ lat: address.lat },
              ...{ lon: address.lon },
            };
            if (lbsData.storeId !== tenantShopInfo[0].storeId) {
              Taro.showToast({
                title: `为您切换至${tenantShopInfo[0].storeName}店铺`,
                icon: "none",
              });
            }
          } else {
            let isExist = false;
            if (lbsData && lbsData.storeId && length > 1) {
              for (let i = 0; i < tenantShopInfo.length; i++) {
                if (
                  Number(lbsData.storeId) === Number(tenantShopInfo[i].storeId)
                ) {
                  isExist = true;
                  storeId = lbsData.storeId;
                  lat = lbsData.lat;
                  lon = lbsData.lon;
                  address = {
                    ...address,
                    ...tenantShopInfo[i],
                    ...{ lat: address.lat },
                    ...{ lon: address.lon },
                  };
                  address.storeName = tenantShopInfo[i].storeName;
                  address.tenantId = tenantShopInfo[i].tenantId;
                  address.tenantInfo = tenantShopInfo[i].tenantInfo;
                  break;
                }
              }
            }

            if (isExist === false) {
              let newTenantShopInfo = [];
              for (let i = 0; i < tenantShopInfo.length; i++) {
                if (tenantShopInfo[i].valid === true) {
                  newTenantShopInfo.push(tenantShopInfo[i]);
                }
              }
              if (newTenantShopInfo.length === 1) {
                storeId = newTenantShopInfo[0].storeId;
                lat = newTenantShopInfo[0].lat;
                lon = newTenantShopInfo[0].lon;
                address.tenantId = newTenantShopInfo[0].tenantId;
                address = {
                  ...address,
                  ...newTenantShopInfo[0],
                  ...{ lat: address.lat },
                  ...{ lon: address.lon },
                };
              } else if (newTenantShopInfo.length > 1) {
                this.setState({
                  addressInfo: address,
                  tenantShopInfo: tenantShopInfo,
                  newTenantShopInfo: newTenantShopInfo,
                  switchShopFlag: true,
                });
                return;
              }
            }
          }

          this.setState(
            {
              // currentAddress: address,
              address: `${address.addressSummary || ""}${
                address.addressExt || ""
              }${address.where || ""}`,
              storeId: storeId,
              addressId: address.addressId,
              coord: {
                lon,
                lat,
              },
            },
            () => {
              Taro.getApp().$app.globalData.storeId = storeId;
              saveAddrInfo(address, tenantShopInfo);
              this.initData(storeId, this.state.skuId);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isCanAddCart: false,
          address: "地址获取失败，点击选择地址",
        });
      });
  };
  /**
   * 获取推荐商品
   * cf https://cf.jd.com/pages/viewpage.action?pageId=335955780
   * @param {Number} skuId 商品id
   */
  getRecommend = (skuId, recommendType) => {
    getSimilarGoods({ skuId, recommendType })
      .then((res) => {
        this.setState({
          recommendList: res.wareInfos,

          tabs: this.state.tabs.map((tab) => {
            if (tab.class === "recommend") {
              tab.show =
                res.wareInfos && res.wareInfos.length > 0 ? true : false;
            }
            return tab;
          }),
        });
      })
      .catch((err) => console.log(err));
  };

  /**
   * 获取优惠券
   * @param {Number} storeId 店铺id
   * @param {Number} skuId 商品id
   */

  queryCouponByWareListInfo(params) {
    let { couponInfoWeb } = this.state;

    if (couponInfoWeb.length % params.pageSize !== 0 && params.page !== 1) {
      return;
    }
    getCouponByWareListApi({
      data: params,
    }).then((res) => {
      if (res && res.success) {
        const couponInfoList = [
          ...(params.page !== 1 ? couponInfoWeb : []),
          ...res.myCoupons.pageList.map((data) => {
            return { ...data.couponInfoWeb };
          }),
        ].map((item, key) => {
          return { ...item, keyFlag: key };
        });
        this.setState({
          couponInfoWeb: couponInfoList,
        });
      }
    });
  }

  // 老的获取优惠券方法，1228优惠券需求没有改动这里
  getCoupon = (storeId, skuId) => {
    const { popup } = this.state;
    getCouponCouponByWare(
      {
        skuIds: [skuId],
        module: "ware",
        page: 1,
        pageSize: 20,
      },
      storeId
    )
      .then((res) => {
        let couponList = [];
        if (res && res.myCoupons && res.myCoupons.pageList) {
          res.myCoupons.pageList.map((item) => {
            console.log(item);
            couponList.push(item.couponInfoWeb);
          });
        }
        this.setState({
          promotion: {
            ...this.state.promotion,
            couponLabels: {
              ...this.state.promotion.couponLabels,
              data: couponList,
              show: couponList.length > 0 ? true : false,
            },
          },
        });
        if (popup && popup.show && popup.id === "coupon") {
          this.setState({
            popup: {
              ...popup,
              data: couponList,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  /**
   * 属性点击事件
   */
  onPropertyChange = (skuId, e) => {
    this.gotoDetail({ skuId, type: "property", event: e });
  };

  /**
   * 商品描述弹层
   */
  onProductDescPopup = () => {
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "购买说明",
        data: this.state.productDetail.toasts,
        type: "textArr",
      },
    });
  };

  /**
   * 套餐含弹出层
   */
  onSuitIncludePopup = () => {
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "套餐含",
        data: this.state.properties.suitIncludeWares.data,
        type: "product",
        id: "suitInclude",
      },
    });
  };

  /**
   * 已选服务弹出层
   */
  onServicePopup = (id, type) => {
    const prod = this.state.productDetail;
    const remarks = this.state.remarks;
    const preSaleInfo = this.state.productDetail.preSaleInfo;
    const notJumpCart = this.state.isRealName;
    this.setState(
      {
        popup: {
          ...this.state.popup,
          show: true,
          title: "custom",
          data: [
            {
              imageUrl: prod.imageUrl
                ? prod.imageUrl
                : prod &&
                  prod.imageInfoList &&
                  prod.imageInfoList.length > 0 &&
                  prod.imageInfoList[0].imageUrl,
              servicetagName: prod.servicetagName,
              buyUnit: prod.buyUnit,
              serviceTags: prod.serviceTags,
              serviceTagId: this.state.serviceTagId,
              remarks: remarks,
              saleSpecDesc: prod.saleSpecDesc,
              jdPrice:
                prod && prod.preSaleInfo && prod.preSaleInfo.type === 1
                  ? prod && prod.preSaleInfo && prod.preSaleInfo.price
                  : prod.jdPrice,
              isCanAddCart: this.state.isCanAddCart,
              isCanPreSale: this.state.isCanPreSale,
              status: prod.status,
              statusMsg: prod.statusMsg,
              statusText: prod.statusText,
              type,
              preSale: prod.preSale,
              reserveContentInfo: prod.reserveContentInfo,
              preSaleInfo: preSaleInfo,
              maxBuyUnitNum: prod.maxBuyUnitNum,
              stepBuyUnitNum: prod.stepBuyUnitNum,
              startBuyUnitNum: prod.startBuyUnitNum,
              tips: preSaleInfo && preSaleInfo.restrictionInfo, //限购提示文案
              notJumpCart,
            },
          ],
          type: id,
          id: id,
        },
      },
      () => {
        console.log("popup", this.state.popup);
      }
    );
  };

  // 促销、优惠类 按钮 弹层
  onCanPromoteCoupon = (event) => {
    const { couponParams, skuId } = this.state;
    logClick({
      event,
      eid: "7FRESH_APP_2_201803183|97",
      eparam: { skuId },
    });
    this.setState(
      {
        showPromoteCouponModal: true,
        couponParams: { ...couponParams, page: 1 },
      },
      () => {
        this.queryCouponByWareListInfo({
          ...couponParams,
          page: 1,
        });
      }
    );

    this.onPopupScrollTop();
  };

  /**
   * 促销弹出层
   */
  onPromotionPopup = () => {
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "促销",
        data: this.state.promotion.promotionTypes.data,
        id: "promotion",
        type: "tagSelectList",
      },
    });
  };

  /**
   * 优惠券弹出层
   */
  onCouponPopup = (event) => {
    // this.setState({
    // popup: {
    //   ...this.state.popup,
    //   show: true,
    //   title: '优惠券',
    //   data: this.state.promotion.couponLabels.data,
    //   key: 'batchId',
    //   type: 'coupon',
    //   id: 'coupon',
    // },
    // });

    const { couponParams, skuId } = this.state;
    this.setState(
      {
        couponParams: { ...couponParams, page: 1 },
      },
      () => {
        this.queryCouponByWareListInfo({
          ...couponParams,
          page: 1,
        });
      }
    );
    logClick({
      event,
      eid: "7FRESH_APP_2_201803183|97",
      eparam: { skuId },
    });
  };

  /**
   * 惠搭配弹出层
   */
  onWareInSuitsPopup = () => {
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "惠搭配",
        data: this.state.promotion.wareInSuits.data.packList,
        key: "batchId",
        type: "wareInSuits",
        id: "wareInSuits",
      },
    });
  };

  /**
   * 放心购服务弹出层
   */
  onFreeServicePopup = (event) => {
    const { skuId } = this.state;
    logClick({
      event,
      eid: "7FRESH_APP_9_20200811_1597153579446|60",
      eparam: { skuId },
    });
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "服务",
        data: this.state.easyBuy,
        // key: 'batchId',
        type: "freeservice",
        id: "freeservice",
      },
    });
  };

  /**
   * 地址列表弹层
   */
  onAddressPopup = () => {
    if (!this.state.isLogin) {
      this.gotoLogin();
      return;
    }
    this.setState({
      popup: {
        ...this.state.popup,
        show: true,
        title: "收货地址",
        data: this.state.aList,
        failData: this.state.bList,
        icon: "address",
        selected: this.state.addressId,
        key: "addressId",
        type: "address",
        id: "address",
      },
    });
  };

  /**
   * 弹出层点击事件
   * @param {Object} current 点击对象
   */
  // todo
  onPopupClick = (current, e) => {
    const { popup, storeId, skuId, from, stallPopup } = this.state;
    if (popup.id === "promotion") {
      this.onPromotionChange(current, storeId, skuId, from);
    }
    if (popup.id === "address") {
      this.onAddressChange(current, e);
    }
    if (popup.id === "service" || popup.id === "prepare") {
      this.onServiceChange(current, e);
    }
    if (popup.id === "suitInclude") {
      this.onSuitIncludeChange(current, e);
    }
    // if (popup.id === 'coupon') {
    //   this.onCouponChange(current, e);
    // }
    if (popup.id === "wareInSuits") {
      this.onWareInSuitsChange(current, e);
    }
    if (stallPopup.id === "stall") {
      this.onStallInfoChange(current, e);
    }
    if (popup.id === "freeservice") {
      this.onFreeServiceGo(current, e);
    }
  };

  /**
   * 档口加工点击切换
   * @param {*} current
   */
  onStallInfoChange = (current) => {
    const { stallPopup } = this.state;
    console.log("onStallInfoChange", current);

    this.setState(
      {
        stallPopup: {
          ...stallPopup,
          data: [
            {
              ...stallPopup.data[0],
              cookTime: current.cookTime,
              cookTimeUnit: current.cookTimeUnit,
              serviceTagId: current.serviceTagId,
              servicetagName: current.servicetagName,
              servicetagTime: current.servicetagTime,
            },
          ],
        },
      },
      () => {
        console.log(this.state.stallPopup);
      }
    );
  };

  /**
   * 套餐含弹出层点击事件
   * @param {Object} current 当前选择促销
   * @param {String} from 来源
   */
  onSuitIncludeChange = (current, e) => {
    this.onPopupClose();
    this.gotoDetail({
      skuId: current.skuId,
      type: "suitIncludeWares",
      event: e,
    });
  };

  /**
   * 加工服务点击事件
   * @param {Object} current 当前点击服务
   */
  onServiceChange = (current) => {
    const { productDetail, remarks, serviceTagId } = this.state;
    if (current.tplId) {
      remarks.forEach((item) => {
        if (current.tplId === item.tplId) {
          if (item.checkbox) {
            item.attrItemList.forEach((item2) => {
              if (item2.id === current.id) {
                item2.selected = !item2.selected;
              }
            });
          } else {
            item.attrItemList.forEach((item2) => {
              if (item2.id === current.id) {
                item2.selected = !item2.selected;
              } else {
                item2.selected = false;
              }
            });
          }
        }
      });
    }

    let attrInfoDesc = this.getRemarksStr(remarks);
    let servicetagName = current.servicetagName
      ? current.servicetagName
      : productDetail.serviceTags && productDetail.serviceTags.length > 0
      ? productDetail.serviceTags.filter(
          (item) => item.serviceTagId === serviceTagId
        )[0].servicetagName
      : "";

    this.setState({
      serviceTagId: current.serviceTagId ? current.serviceTagId : serviceTagId,
      properties: {
        ...this.state.properties,
        service: {
          ...this.state.properties.service,
          data:
            this.state.properties.service && this.state.properties.service.data
              ? `${this.state.properties.service.data.split("，")[0]}${
                  servicetagName ? "，" + servicetagName : ""
                }` + `${attrInfoDesc ? "，" + attrInfoDesc : ""}`
              : "",
        },
      },
      popup: {
        ...this.state.popup,
        data: [
          {
            imageUrl: productDetail.imageUrl
              ? productDetail.imageUrl
              : productDetail &&
                productDetail.imageInfoList &&
                productDetail.imageInfoList.length > 0 &&
                productDetail.imageInfoList[0].imageUrl,
            servicetagName: productDetail.servicetagName,
            buyUnit: productDetail.buyUnit,
            serviceTags: productDetail.serviceTags,
            serviceTagId: current.serviceTagId,
            remarks: remarks,
            saleSpecDesc: productDetail.saleSpecDesc,
            jdPrice: productDetail.jdPrice,
            isCanAddCart: this.state.isCanAddCart,
            isCanPreSale: this.state.isCanPreSale,
            status: productDetail.status,
            statusMsg: productDetail.statusMsg,
            statusText: productDetail.statusText,
            type: this.state.isCanPreSale ? "order" : "cart",
            preSale: productDetail.preSale,
            reserveContentInfo: productDetail.reserveContentInfo,
            preSaleInfo: productDetail.preSaleInfo,
            maxBuyUnitNum: productDetail.maxBuyUnitNum,
            stepBuyUnitNum: productDetail.stepBuyUnitNum,
            startBuyUnitNum: productDetail.startBuyUnitNum,
            tips:
              productDetail.preSaleInfo &&
              productDetail.preSaleInfo.restrictionInfo, //限购提示文案
          },
        ],
      },
    });
  };
  //获取商品备注字符串
  getRemarksStr = (list) => {
    let attrInfoDesc = "";
    list &&
      list.length > 0 &&
      list.forEach((item, key) =>
        item.attrItemList.forEach((item2) => {
          if (item2.selected) {
            attrInfoDesc =
              attrInfoDesc +
              `${item2.name}` +
              (list.length - 1 !== key ? "," : "");
          }
        })
      );
    return attrInfoDesc;
  };

  // 促销弹层> .R todo
  onClickPromote = (showTexts, promotionTypes) => {
    const { storeId } = this.state;
    this.onPromotionChange(promotionTypes, storeId);
  };
  /**
   * 促销弹出层点击事件
   * @param {Object} current 当前选择促销
   * @param {Number} storeId 店铺Id
   * @param {Number}} skuId 商品Id
   * @param {String} from 来源
   */
  onPromotionChange = (current, event) => {
    const { storeId, skuId } = this.state;
    logClick({
      event,
      eid: reportPoints.promotion,
    });
    if (current.forward) {
      if (
        current.showTexts &&
        current.showTexts[0] &&
        current.showTexts[0].skuId &&
        Number(current.showTexts[0].skuId) === 200
      ) {
        Taro.navigateTo({
          url: `/pages/detail/index?storeId=${storeId}&skuId=${current.showTexts[0].skuId}`,
        });
      } else {
        const promotionId = current.promoId;
        const promotionSubType = current.promotionSubType;
        let urlName = "addBuy";
        if (promotionSubType === 308) {
          //换件
          urlName = "changeBuy";
        } else {
          urlName = "addBuy";
        }
        const url = `${h5Url}/cart.html/${urlName}?promotionId=${promotionId}&skuId=${skuId}&ref=detail&storeId=${storeId}&promotionSubType=${promotionSubType}&from=miniapp`;

        utils.navigateToH5({ page: url });
      }

      this.onPopupClose();
    }
  };

  /**
   * 优惠券点击事件
   * @param {Object} current 当前选择优惠券
   */
  onCouponChange = (current) => {
    if (!this.state.isLogin) {
      this.gotoLogin();
      return;
    }
    this.alreadyGet = true;
    this.couponCodes = Array.of(current.batchId);
    const { couponInfoWeb } = this.state;
    getCouponSend({
      batchId: current.batchId,
    })
      .then((res) => {
        if (res && res.success) {
          // this.queryCouponByWareListInfo({
          //   ...this.state.couponParams,
          //   page: 1,
          // });
          couponInfoWeb.forEach((item) => {
            if (item.keyFlag === current.keyFlag) {
              item.receivedSuccess = true;
            }
          });
          this.setState({
            couponInfoWeb: [...couponInfoWeb],
          });

          Taro.showToast({
            title: res ? res.msg : "领取成功",
            icon: "success",
            duration: 2000,
          });
          if (this.alreadyGet) {
            this.subscribe();
          }
        } else {
          Taro.showToast({
            title: res ? res.msg : "领取失败",
            icon: "none",
            duration: 2000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  //点击优惠券去使用
  onGoSearch = (current) => {
    const { from } = this.state;
    var couponInfo = 0 + "|" + current.batchId;
    const url = `${h5Url}/search/list?from=${from}&prev=coupon&couponId=${couponInfo}&ruleDescSimple=${
      current.ruleDescSimple || ""
    }`;
    utils.navigateToH5({ page: url });
    // this.onPopupClose();
  };

  // 优惠券弹框分页请求
  onScrollToLower() {
    const { couponParams } = this.state;
    let tempParams = {
      ...couponParams,
      page: couponParams.page + 1,
    };
    this.setState(
      {
        couponParams: tempParams,
      },
      () => {
        this.queryCouponByWareListInfo(tempParams);
      }
    );
  }

  /**
   * 惠搭配点击事件
   * @param {Object} current 当前选中产品组套
   */
  onWareInSuitsChange = (current) => {
    if (current.type === "detail") {
      this.gotoDetail({ skuId: current.skuId, type: "wareInSuits" });
      this.onPopupClose();
    } else {
      this.addCart({
        skuId: current.skuId,
        buyNum: current.startBuyUnitNum,
        serviceTagId: current.serviceTagId,
        from: "wareInSuits",
      });
    }
  };

  /**
   * 放心购服务弹层点击事件
   * @param {Object} current 当前点击服务
   */
  onFreeServiceGo = (current, event) => {
    const { skuId } = this.state;
    logClick({
      event,
      eid: "7FRESH_APP_9_20200811_1597153579446|61",
      eparam: { skuId },
    });
    if (!current) {
      Taro.navigateTo({
        url: `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
          this.state.easyBuy.easyBuyJumpUrl
        )}`,
      });
      this.onPopupClose();
    }
  };

  /**
   * 地址弹层点击事件
   * @param {Object} current 当前点击item
   * @param {Number} skuId 商品Id
   */
  onAddressChange = (current, event) => {
    const { skuId } = this.state;
    if (current) {
      this.changeUserAddress(current, skuId, current.lat, current.lon);
      logClick({
        event,
        eid: reportPoints.changeAddress,
      });
      this.onPopupClose();
    } else {
      this.gotoCreateAddress();
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
      case "delivery":
        this.onAddressPopup(event);
        break;
      case "description":
        this.onProductDescPopup(event);
        break;
      case "suitInclude":
        this.onSuitIncludePopup(event);
        break;
      case "service":
        this.onServicePopup(id, type, event);
        break;
      case "prepare":
        //立即抢购
        const skuId = this.state.skuId;
        logClick({
          event,
          eid: "7FRESH_APP_6_1568944564798|40",
          eparam: { skuId },
        });
        this.onServicePopup(id, "prepare", event);
        break;
      // todo
      case "promotion":
        this.onPromotionPopup(event);
        break;
      case "coupon":
        this.onCouponPopup(event);
        break;
      case "wareInSuits":
        this.onWareInSuitsPopup(event);
        break;
      case "freeservice":
        this.onFreeServicePopup(event);
        break;
    }
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
      scrollTop: "0px",
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
   * 顶部tab标签切换
   */
  onTabChange = (id, className, event) => {
    this.setState({
      currentTabId: id,
    });
    this.pageScrollTo(`.${className}`);
    logClick({ event, eid: reportPoints[className] });
  };

  /**
   * 滚动到制定class
   * @param {String} dom 点击class
   */
  pageScrollTo = (dom) => {
    const { systemInfo, navHeight } = this.state;
    const { windowWidth } = systemInfo;
    Taro.createSelectorQuery()
      .selectViewport()
      .scrollOffset((res) => {
        Taro.createSelectorQuery()
          .select(dom)
          .boundingClientRect((rect) => {
            if (rect) {
              Taro.pageScrollTo({
                scrollTop:
                  rect.top +
                  res.scrollTop -
                  navHeight / 2 -
                  (44 * windowWidth) / 375,
                duration: 0,
              });
            }
          })
          .exec();
      })
      .exec();
  };

  /**
   * 页面滚动函数
   */
  onPageScroll = (ev) => {
    this.scrollNav();
    if (ev.scrollTop > 1000 && !this.state.isShowBackToTop) {
      this.setState({
        isShowBackToTop: true,
      });
    } else if (ev.scrollTop <= 1000 && this.state.isShowBackToTop) {
      this.setState({
        isShowBackToTop: false,
      });
    }
  };

  /**
   * 滚动时监听并切换顶部tab标签
   */
  scrollNav = () => {
    const distanceRange = 60;
    const { navHeight } = this.state;
    Taro.createSelectorQuery()
      .selectAll(".jrolling")
      .boundingClientRect((rect) => {
        if (rect.length) {
          if (rect[4] && rect[4].top <= distanceRange + navHeight / 2) {
            if (this.state.currentTabId !== 4) {
              this.setState({ currentTabId: 4 });
            }
          } else if (rect[3] && rect[3].top <= distanceRange + navHeight / 2) {
            if (this.state.currentTabId !== 3) {
              this.setState({ currentTabId: 3 });
            }
          } else if (rect[2] && rect[2].top <= distanceRange + navHeight / 2) {
            if (this.state.currentTabId !== 2) {
              this.setState({ currentTabId: 2 });
            }
          } else if (
            rect[1] &&
            this.state.comments &&
            this.state.comments.commentShow &&
            rect[1].top <= distanceRange + navHeight / 2
          ) {
            if (this.state.currentTabId !== 1) {
              this.setState({ currentTabId: 1 });
            }
          } else if (rect[0] && rect[0].top <= distanceRange + navHeight / 2) {
            if (this.state.currentTabId !== 0) {
              this.setState({ currentTabId: 0 });
            }
          }
        }
      })
      .exec();
  };

  /**
   * 去评论页
   */
  gotoCommentPage = (labelId) => {
    const { storeId, skuId } = this.state;
    // const url = `${h5Url}/appraiseList.html?feature=0&page=1&pageSize=20&storeId=${storeId}&skuId=${skuId}&from=${from}`;
    // utils.navigateToH5({ page: url });
    Taro.navigateTo({
      url: `/pages-a/comment/index?storeId=${storeId}&skuId=${skuId}&labelId=${labelId}`,
    });
  };

  /**
   * 去登陆页
   */
  gotoLogin = () => {
    const returnPage = `/pages/detail/index?storeId=${this.state.storeId}&skuId=${this.state.skuId}`;
    utils.gotoLogin(returnPage, "redirectTo");
  };

  /**
   * 去新建地址
   */
  gotoCreateAddress = () => {
    // const url = `${h5Url}/address.html?from=${this.state.from}#new`;
    // utils.navigateToH5({ page: url });
    const { beforeFilterAddressNum, baseAddressNum } = this.state;
    const returnPage = `/pages/detail/index?storeId=${this.state.storeId}&skuId=${this.state.skuId}`;
    if (beforeFilterAddressNum < baseAddressNum) {
      this.onPopupClose();
      Taro.navigateTo({
        url: `/pages/address/new/index?type=new&storeId=${
          this.state.storeId
        }&skuId=${
          this.state.skuId
        }&nowBuy=3&from=skuDetail&returnPage=${encodeURIComponent(returnPage)}`,
      });
    } else {
      this.getLimitMaxNumFunc();
    }
  };
  /**
   * 获取地址限制最大条数和文案
   */
  getLimitMaxNumFunc = () => {
    const { beforeFilterAddressNum } = this.state;
    getLimitMaxNum().then((res) => {
      console.log(res);
      if (
        res &&
        res.limitMaxAddressNum &&
        beforeFilterAddressNum >= res.limitMaxAddressNum
      ) {
        Taro.showToast({
          title: res.overMaxRemind,
          icon: "none",
        });
      }
    });
  };

  /**
   * 去购物车
   */
  gotoCart = (event) => {
    let uuid = "";
    const wxUserInfo = Taro.getStorageSync("exportPoint");
    if (wxUserInfo && typeof wxUserInfo === "string" && wxUserInfo !== "{}") {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const lbsData = Taro.getStorageSync("addressInfo") || "";
    /*小程序跳转H5暂不传递租户列表*/
    if (lbsData && lbsData.tenantShopInfo) {
      delete lbsData.tenantShopInfo;
    }
    // TOH5编码

    const url = `${h5Url}/cart.html?from=${this.state.from}&source=detail&storeId=${this.state.storeId}&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`;
    logClick({
      event,
      eid: reportPoints.gotoCart,
    });
    utils.navigateToH5({ page: url });
  };

  /**
   * 添加购物车
   * @param {Number} skuId 商品id
   * @param {Number} buyNum 购买数量
   * @param {Number} serviceTagId 服务Id
   * @param {String} from 加车来源
   */
  addCart = ({
    skuId,
    buyNum = 1,
    serviceTagId = 0,
    from,
    data,
    event,
    skuSequenceNum,
  }) => {
    console.log(skuId, buyNum, serviceTagId, from, data, event, this.state);
    const {
      strategyABTest,
      touchstone_expids,
      recommendList,
      middleShopList,
      AddCartUserConfigValue,
      AddCartBuriedExpLabel,
      productDetail,
      isRealName,
    } = this.state;
    let selectedTasteInfoIds = {};
    const { remarks } = this.state;
    const main_sku = parseFloat(this.state.skuId);
    remarks &&
      remarks.forEach((item1) => {
        let id = [];
        item1.attrItemList.forEach((item2) => {
          if (item2.selected) {
            id.push(item2.id);
          }
        });
        selectedTasteInfoIds[item1.tplId] = id;
      });
    this.onProductAddCart(this.state.productDetail);
    const { storeId } = this.state;
    if (from === "stall") {
      if (data.isPop === true) {
        this.stallAdd(data);
        return;
      }
    } else {
      const isPop = this.state.isPop;
      if (
        (isPop &&
          from !== "popup" &&
          from !== "wareInSuits" &&
          from !== "recommend" &&
          from !== "stall" &&
          from !== "similar" &&
          from !== "middleRecommend") ||
        isRealName
      ) {
        // 43度茅台
        if (isRealName) {
          logClick({
            eid: "Maotaisx_submitOrder",
            eparam: {
              skuId: data && data.skuId,
              skuName: data && data.skuName,
            },
          });
          detailAddCartCheckService({
            skuId: this.state.skuId,
            bizType: 1, //业务类型，1代表茅台
            everyOrderSum: 1,
          })
            .then((checkRes) => {
              if (checkRes && checkRes.code === 3) {
                utils.redirectToLogin(
                  `/pages/detail/index?skuId=${this.state.skuId}&storeId=${this.state.storeId}`
                );
                return;
              }
              if (!checkRes || !checkRes.success) {
                Taro.showToast({
                  title: (checkRes && checkRes.toast) || "超出购买瓶数",
                  icon: "none",
                });
                return;
              } else {
                this.onPopup("service", "cart");
                return;
              }
            })
            .catch((err) => {
              if (err.code === 3) {
                utils.redirectToLogin(
                  `/pages/detail/index?skuId=${this.state.skuId}&storeId=${this.state.storeId}`
                );
                return;
              }
            });
        } else {
          this.onPopup("service", "cart");
          return;
        }
        return;
      }
    }
    if (from === "recommend") {
      logClick({ event, eid: reportPoints.recommendAddCart });
      logClick({
        eid: reportPoints.recommendBottomAddCart,
        eparam: {
          main_sku,
          skuId: data && data.skuId,
          broker_info: data && data.brokerInfo,
          page: data && data.page,
          page_index: (data && data.pageIndex) || (data && data.index),
        },
      });

      // NOTE: 新版加车埋点 - 1217加 - 商详页为你推荐加车
      let sequenceNum = "";
      data &&
        recommendList &&
        recommendList.length > 0 &&
        recommendList.map((item, index) => {
          if (item.skuId === data.skuId) {
            sequenceNum = index + 1;
          }
        });
      structureLogClick({
        eventId: "commodityDetailPage_recommend_addCart",
        jsonParam: {
          firstModuleId: "recommendModule",
          firstModuleName: "为你推荐",
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 1,
          clickId: "commodityDetailPage_recommend_addCart",
          strategyABTest: strategyABTest,
          skuSequenceNum: sequenceNum,
          broker_info: data && data.brokerInfo,
        },
      });
    } else if (from === "similar") {
      logClick({ event, eid: reportPoints.recommendAddCart });
      logClick({
        eid: reportPoints.similarAddCart,
        eparam: {
          main_sku,
          skuId: data && data.skuId,
          broker_info: data && data.brokerInfo,
          page: data && data.page,
          page_index: (data && data.pageIndex) || (data && data.index),
        },
      });
      // NOTE: 新版加车埋点 - 1217加 - 商详页无货相似推荐加车
      structureLogClick({
        eventId: "commodityDetailPage_noStockPop_addCart",
        jsonParam: {
          firstModuleId: "noStockPopModule",
          firstModuleName: "无货弹框",
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 1,
          clickId: "commodityDetailPage_noStockPop_addCart",
          listPageIndex: (data && data.pageIndex) || (data && data.index),
          broker_info: data && data.brokerInfo,
        },
      });
    } else if (from === "wareInSuits") {
      logClick({ event, eid: reportPoints.wareInSuitsAddCart });
    } else if (from === "menu") {
      logClick({ event, eid: reportPoints.addCart });
      // NOTE: 新版加车埋点 - 1217加 - 商详页菜谱区块加车
      structureLogClick({
        eventId: "commodityDetailPage_correlationMenu_menu_addCart",
        jsonParam: {
          firstModuleId: "correlationMenuModule",
          firstModuleName: "相关菜谱",
          secondModuleId: data && data.itemTabId,
          secondModuleName: data && data.itemTabName,
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 1,
          clickId: "commodityDetailPage_correlationMenu_menu_addCart",
          istPageNum: data && data.itemTabIndex,
          listPageIndex: data && data.index,
        },
      });
    } else if (from === "stall") {
      logClick({ event, eid: reportPoints.addCart });
      // 档口加车
    } else if (from === "middleRecommend") {
      let sequenceNum = "";
      data &&
        middleShopList &&
        middleShopList.length > 0 &&
        middleShopList.map((item, index) => {
          if (item.skuId === data.skuId) {
            sequenceNum = index + 1;
          }
        });
      structureLogClick({
        eventId: "commodityDetailPage_Middle_recommend_addCart",
        jsonParam: {
          skuId: skuId,
          skuName: data && data.skuName,
          skuSequenceNum: skuSequenceNum || sequenceNum,
          strategyABTest: strategyABTest,
          clickType: 1,
          listPageIndex: (data && data.pageIndex) || (data && data.index),
          broker_info: data && data.brokerInfo,
        },
        extColumns: {
          touchstone_expids: touchstone_expids,
        },
      });
    } else if (from === "tail") {
      structureLogClick({
        eventId: "commodityDetailPage_matchLayer_addCart",
        jsonParam: {
          lastSkuId: productDetail && productDetail.skuId,
          lastSkuName: productDetail && productDetail.skuName,
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          CartAddCartSpaceNum: AddCartUserConfigValue,
        },
        extColumns: {
          touchstone_expids: AddCartBuriedExpLabel,
        },
      });
    } else {
      this.SkuDetailAddCart();
      logClick({ event, eid: reportPoints.addCart });
      // NOTE: 新版加车埋点 - 1217加 - 普通加车
      structureLogClick({
        eventId: "commodityDetailPage_bottomBar_addCart",
        jsonParam: {
          firstModuleId: "bottomBarModule",
          firstModuleName: "商详加车",
          // secondModuleId: 2,
          // secondModuleName: '二级',
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          clickType: 1,
          clickId: "commodityDetailPage_bottomBar_addCart",
        },
      });
    }

    addCart({
      data: {
        wareInfos: {
          skuId,
          buyNum,
          serviceTagId,
          selectedTasteInfoIds,
        },
        storeId,
      },
    })
      .then((res) => {
        // 商品详情页加车成功后，首页无货找相似自增减一
        if (res && res.success) {
          const renderRecommendData = Taro.getStorageSync(
            "renderRecommendData"
          );
          if (
            renderRecommendData &&
            renderRecommendData.skuId === parseInt(skuId)
          ) {
            let countRecommend = Taro.getStorageSync("countRecommend");
            if (countRecommend) {
              Taro.setStorageSync("countRecommend", countRecommend - 1);
            }
            Taro.removeStorageSync("renderRecommendData");
          }
        }
        Taro.showToast({
          title: (res && res.msg) || "加车失败",
          icon:
            (res && res.msg && res.msg.length > 7) || (res && !res.msg)
              ? "none"
              : "success",
          duration: 2000,
        });
        this.setState({
          numInCart: res.allCartWaresNumber || 0,
        });
      })
      .catch((err) => console.log(err));
  };

  // 茅台43度立即购买
  maotaiJumpOrder = (data) => {
    const { storeId } = this.state;
    const params = {
      wareInfos: [
        {
          storeId: storeId,
          skuId: data && data.skuId,
          buyNum: data && data.startBuyUnitNum,
        },
      ],
    };

    let nowBuy = 19; //立即预订
    const orderUrl = `${h5Url}/order.html?nowBuy=${nowBuy}&storeId=${storeId}&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=${this.state.from}`;
    const url = `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
      orderUrl
    )}`;
    if (this.state.isLogin) {
      utils.navigateToH5({ page: orderUrl });
    } else {
      utils.gotoLogin(url, "redirectTo");
    }
  };

  /**
   * 档口点击加车-判断是否为加工
   * @param {*} data
   */
  stallAdd = (prod) => {
    console.log("档口弹层数据存储", prod);
    // this.onServicePopup('service', 'cart', event);
    this.setState(
      {
        stallPopup: {
          // ...this.state.stallPopup,
          height: 400,
          show: true,
          title: "custom",
          data: [
            {
              type: "stall",
              skuId: prod.skuId,
              jdPrice: prod.jdPrice,
              buyUnit: prod.buyUnit,
              servicetagName: prod.servicetagName,
              serviceTags: prod.serviceTags,
              serviceTagId: prod.serviceTagId,
              saleSpecDesc: prod.saleSpecDesc,
              imageUrl: prod.imageUrl
                ? prod.imageUrl
                : prod &&
                  prod.imageInfoList &&
                  prod.imageInfoList.length > 0 &&
                  prod.imageInfoList[0].imageUrl,
              isCanAddCart: prod.addCart ? prod.addCart : false,
              isCanPreSale:
                prod.preSaleInfo &&
                prod.preSaleInfo.type &&
                prod.preSaleInfo.type === 1
                  ? true
                  : false,
              preSaleInfo: prod.preSaleInfo,
              preSale: prod.preSale,
              status: prod.status,
              statusMsg: prod.statusMsg,
              statusText: prod.statusText,
              reserveContentInfo: prod.reserveContentInfo,
              maxBuyUnitNum: prod.maxBuyUnitNum,
              stepBuyUnitNum: prod.stepBuyUnitNum,
              startBuyUnitNum: prod.startBuyUnitNum,
            },
          ],
          type: "stall",
          id: "stall",
        },
      },
      () => {
        console.log("stallPopup", this.state.stallPopup, this.state.popup);
      }
    );
  };

  /**
   * 立即预订
   * @param {Number} skuId 商品id
   * @param {Number} buyNum 购买数量
   * @param {Number} serviceTagId 服务Id
   */
  addOrder = (skuId, buyNum = 1, serviceTagId = 0, from, event) => {
    const { preSaleInfo } = this.state;
    if (
      preSaleInfo &&
      parseInt(preSaleInfo.type) === 1 &&
      parseInt(preSaleInfo.stockNum) === 0 &&
      preSaleInfo.tip
    ) {
      Taro.showToast({
        title: preSaleInfo.tip ? preSaleInfo.tip : "该商品已抢光，敬请期待",
        icon: "none",
      });
      return;
    }
    const { storeId } = this.state;
    if (from !== "popup") {
      this.onPopup("service", "order");
      return;
    }
    logClick({ event, eid: reportPoints.order });
    const params = {
      wareInfos: [
        {
          storeId,
          skuId,
          buyNum,
          serviceTagId,
        },
      ],
    };
    const orderUrl = `${h5Url}/order.html?nowBuy=3&storeId=${storeId}&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=${this.state.from}`;
    const url = `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
      orderUrl
    )}`;
    if (this.state.isLogin) {
      utils.navigateToH5({ page: orderUrl });
    } else {
      utils.gotoLogin(url, "redirectTo");
    }
  };

  /**
   * 加工服务加入购物车事件
   * @param {Number} num 购买数量
   */
  onPopupAddCart = (num, type, event) => {
    const { isRealName, productDetail } = this.state;
    if (type === "prepare") {
      this.onPrepareCart(
        this.state.skuId,
        num,
        this.state.serviceTagId,
        "popup",
        event
      );
    } else if (type === "order") {
      this.addOrder(
        this.state.skuId,
        num,
        this.state.serviceTagId,
        "popup",
        event
      );
    } else if (type === "stall") {
      const { stallPopup } = this.state;
      this.addCart({
        skuId: stallPopup.data[0].skuId,
        buyNum: num,
        serviceTagId: stallPopup.data[0].serviceTagId,
        from: "popup",
      });
    } else {
      if (isRealName) {
        logClick({
          eid: "Maotaisxdetail_confirm",
          eparam: {
            skuId: this.state.skuId,
            skuName: productDetail && productDetail.skuName,
            buyNum: num,
          },
        });
        // 调用限购接口
        detailAddCartCheckService({
          skuId: this.state.skuId,
          bizType: 1, //业务类型，1代表茅台
          everyOrderSum: num,
        })
          .then((res) => {
            if (res && res.code === 3) {
              utils.redirectToLogin(
                `/pages/detail/index?skuId=${this.state.skuId}&storeId=${this.state.storeId}`
              );
              return;
            }
            if (res && res.success) {
              this.maotaiJumpOrder({
                skuId: this.state.skuId,
                startBuyUnitNum: num,
              });
              return;
            } else {
              Taro.showToast({
                title: (res && res.toast) || "超出购买瓶数",
                icon: "none",
              });
              return;
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.code === 3) {
              utils.redirectToLogin("pages/detail/index", "redirectTo");
              return;
            }
          });
        return;
      }
      this.addCart({
        skuId: this.state.skuId,
        buyNum: num,
        serviceTagId: this.state.serviceTagId,
        from: "popup",
      });
    }

    // if (type === 'cart') {
    //   this.addCart(
    //     this.state.skuId,
    //     num,
    //     this.state.serviceTagId,
    //     'popup',
    //     event
    //   );
    // } else if (type === 'prepare') {
    //   this.onPrepareCart(
    //     this.state.skuId,
    //     num,
    //     this.state.serviceTagId,
    //     'popup',
    //     event
    //   );
    // } else {
    //   this.addOrder(
    //     this.state.skuId,
    //     num,
    //     this.state.serviceTagId,
    //     'popup',
    //     event
    //   );
    // }
    this.onPopupClose();
  };

  /**
   * 点击腰带跳转页
   */
  onbelt = (event) => {
    const { productDetail } = this.state;
    const url = productDetail.beltGotoUrl || "";
    if (!!url) {
      logClick({ event, eid: reportPoints.belt, eparam: { url } });
      utils.navigateToH5({ page: url });
    }
  };

  /**
   * 去新人礼包页
   */
  gotoGift = () => {
    const { from } = this.state;
    const url = `${h5Url}/newGift.html?from=${from}`;
    utils.navigateToH5({ page: url });
  };

  toSearch = (event) => {
    const { skuId } = this.state;
    logClick({ event, eid: reportPoints.toSearch, eparam: { skuId } });

    const addressInfo = Taro.getStorageSync("addressInfo");
    const storeId = addressInfo ? addressInfo.storeId : "";
    const lat = addressInfo ? addressInfo.lat : "";
    const lon = addressInfo ? addressInfo.lon : "";
    const tenantId = addressInfo ? addressInfo.tenantId : 1;

    let url = `${app.h5RequestHost}/search/?from=miniapp&storeId=${storeId}&lat=${lat}&lng=${lon}&tenantId=${tenantId}`;
    utils.navigateToH5({
      page: url,
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
        url: "/pages/index/index",
      });
    }
  };

  /**
   * 回到首页
   */
  gotoHome = (event) => {
    logClick({ event, eid: reportPoints.gotoHome });
    Taro.switchTab({
      url: "/pages/index/index",
    });
  };

  /**
   * 去详情页
   */
  gotoDetail = ({ skuId, type, event, data, skuSequenceNum }) => {
    console.log("skuId, type, event, data", skuId, type, event, data);
    const {
      strategyABTest,
      touchstone_expids,
      middleShopList,
      recommendList,
      AddCartBuriedExpLabel,
      productDetail,
      AddCartUserConfigValue,
    } = this.state;
    const main_sku = parseFloat(this.state.skuId);
    if (type === "recommend") {
      let seqNum = "";
      recommendList &&
        recommendList.length > 0 &&
        recommendList.map((item, index) => {
          if (item.skuId === data.skuId) {
            seqNum = index + 1;
          }
        });
      logClick({ event, eid: reportPoints.recommendClick, eparam: { skuId } });
      logClick({
        eid: reportPoints.recommendBottomClick,
        eparam: {
          main_sku,
          skuId: data && data.skuId,
          broker_info: data && data.brokerInfo,
          page: data && data.page,
          page_index: (data && data.pageIndex) || (data && data.index),
        },
      });
      structureLogClick({
        eventId: "commodityDetailPage_recommend_clickCommodity",
        jsonParam: {
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          skuSequenceNum: skuSequenceNum || seqNum,
          strategyABTest: strategyABTest,
          clickType: 2,
          listPageIndex: data && data.index,
          broker_info: data && data.brokerInfo,
        },
        extColumns: {
          touchstone_expids: touchstone_expids,
        },
      });
    } else if (type === "similar") {
      let seqNum = "";
      recommendList &&
        recommendList.length > 0 &&
        recommendList.map((item, index) => {
          if (item.skuId === data.skuId) {
            seqNum = index + 1;
          }
        });
      logClick({ event, eid: reportPoints.recommendClick, eparam: { skuId } });
      logClick({
        eid: reportPoints.similarClick,
        eparam: {
          main_sku,
          skuId: data && data.skuId,
          broker_info: data && data.brokerInfo,
          page: data && data.page,
          page_index: (data && data.pageIndex) || (data && data.index),
        },
      });
      structureLogClick({
        eventId: "commodityDetailPage_noStockPop_clickCommodity",
        jsonParam: {
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          skuSequenceNum: skuSequenceNum || seqNum,
          strategyABTest: strategyABTest,
          clickType: 2,
          listPageIndex: (data && data.pageIndex) || (data && data.index),
          broker_info: data && data.brokerInfo,
        },
        extColumns: {
          touchstone_expids: touchstone_expids,
        },
      });
    } else if (type === "suitIncludeWares") {
      logClick({
        event,
        eid: reportPoints.suitIncludeWares,
        eparam: { skuId },
      });
    } else if (type === "wareInSuits") {
      logClick({ event, eid: reportPoints.wareInSuits, eparam: { skuId } });
    } else if (type === "middleRecommend") {
      let seqNumMiddle = "";
      middleShopList &&
        middleShopList.length > 0 &&
        middleShopList.map((item, index) => {
          if (item.skuId === data.skuId) {
            seqNumMiddle = index + 1;
          }
        });
      structureLogClick({
        eventId: "commodityDetailPage_Middle_recommend_clickCommodity",
        jsonParam: {
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          skuSequenceNum: skuSequenceNum || seqNumMiddle,
          strategyABTest: strategyABTest,
          clickType: 2,
          listPageIndex: (data && data.pageIndex) || (data && data.index),
          broker_info: data && data.brokerInfo,
        },
        extColumns: {
          touchstone_expids: touchstone_expids,
        },
      });
    } else if (type === "tail") {
      structureLogClick({
        eventId: "commodityDetailPage_matchLayer_clickCommodity",
        jsonParam: {
          lastSkuId: productDetail && productDetail.skuId,
          lastSkuName: productDetail && productDetail.skuName,
          skuId: data && data.skuId,
          skuName: data && data.skuName,
          CartAddCartSpaceNum: AddCartUserConfigValue,
        },
        extColumns: {
          touchstone_expids: AddCartBuriedExpLabel,
        },
      });
    }

    const lbsData = Taro.getStorageSync("addressInfo") || "";
    if (data && data.prepayCardType) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/card-detail/index?from=miniapp&storeId=${this.state.storeId}&skuId=${skuId}&lng=${lbsData.lng}&lat=${lbsData.lat}&tenantId=${lbsData.tenantId}&prepayCardType=${data.prepayCardType}`,
      });
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${skuId}&from=${this.state.from}`,
      });
    }
  };

  /**
   * 回到顶部
   */
  gotoTop = () => {
    Taro.pageScrollTo({ scrollTop: 0 });
    this.setState({
      currentTabId: 0,
    });
  };

  closeRecommendLayer = () => {
    this.setState({
      isShowRecommendList: false,
    });
  };
  showRecommendLayer = () => {
    this.setState({
      isShowRecommendList: true,
    });
  };

  closeModal = () => {
    this.setState({
      isShowModal: false,
    });
  };

  showModal = () => {
    this.setState({
      isShowModal: true,
    });
  };

  getWareDetailShare = (storeId, skuId) => {
    getDetailShare({ storeId, skuId })
      .then((res) => {
        if (res && res.lingLongImageUrl) {
          this.setState({
            lingLongImageUrl: res.lingLongImageUrl,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  /**
   * 右上角转发事件
   */
  onShareAppMessage = (event) => {
    const lingLongImageUrl = this.state.lingLongImageUrl;
    const { av, skuName, imageUrl, imageInfoList } = this.state.productDetail;
    logClick({ event, eid: reportPoints.share });
    const url = this.state.sp
      ? `/pages/detail/index?storeId=${this.state.storeId}&skuId=${this.state.skuId}&from=miniapp&entrancedetail=009_${this.state.storeId}_20191219001&sp=${this.state.sp}`
      : `/pages/detail/index?storeId=${this.state.storeId}&skuId=${this.state.skuId}&from=miniapp&entrancedetail=009_${this.state.storeId}_20191219001`;
    const share = {
      title: skuName ? skuName : av,
      imageUrl: lingLongImageUrl
        ? lingLongImageUrl
        : imageUrl
        ? imageUrl
        : imageInfoList[0]
        ? imageInfoList[0].imageUrl
        : "",
      path: `/pages/index/index?returnUrl=${encodeURIComponent(url)}`,
    };
    this.onPageShare({
      from: event.from,
      ...share,
    });
    return share;
  };

  filterTabs = (tabs) => {
    return tabs.filter((tab) => tab.show);
  };

  //是否关注公众号
  isFollowWx = (unionId) => {
    isFollowWx(unionId).then((res) => {
      Taro.getApp().$app.globalData.isConcern = res && res.concern;
      Taro.getStorage({ key: "scene" }).then(({ data: scene }) => {
        this.setState({
          isConcern:
            (res && res.concern) ||
            !(
              scene === 1047 ||
              scene === 1124 ||
              scene === 1089 ||
              scene === 1038
            ),
        });
      });
    });
  };

  //去接龙&&拼团
  goToSolitaire = () => {
    const { detailUrl, type } = this.state.activityInfo;
    if (detailUrl) {
      const url = getURLParameter(detailUrl.split("?")[1]);
      if (Number(type) === 1) {
        const { storeId, activityId, sID } = url;
        Taro.navigateTo({
          url: `/pages-a/fight-group/detail/index?activityId=${activityId}&storeId=${storeId}&sID=${sID}`,
        });
      } else {
        const { handonId, storeId } = url;
        Taro.navigateTo({
          url: `/pages-a/solitaire/detail/index?storeId=${storeId}&handonId=${handonId}`,
        });
      }
    }
  };

  //弹框关闭
  onShopClose = (info, index) => {
    console.log(info);
    const { tenantShopInfo, newTenantShopInfo } = this.state;
    let addressInfo = this.state.addressInfo;
    addressInfo.tenantId = newTenantShopInfo[index].tenantId;
    addressInfo.storeName = newTenantShopInfo[index].storeName;
    addressInfo.tenantInfo = newTenantShopInfo[index].tenantInfo;
    const _address = {
      ...addressInfo,
      ...newTenantShopInfo[index],
      ...{ lat: addressInfo.lat },
      ...{ lon: addressInfo.lon },
    };
    const lat = _address.lat;
    const lon = _address.lon;
    const storeId = _address.storeId;
    this.setState(
      {
        switchShopFlag: false,
        // currentAddress: _address,
        address: `${_address.addressSummary || ""}${_address.addressExt || ""}${
          _address.where || ""
        }`,
        storeId: storeId,
        addressId: _address.addressId,
        coord: {
          lon,
          lat,
        },
      },
      () => {
        Taro.getApp().$app.globalData.storeId = storeId;
        saveAddrInfo(_address, tenantShopInfo);
        this.initData(storeId, this.state.skuId);
      }
    );
  };

  onDownloadModalClose() {
    this.setState({
      downloadModalFlag: false,
    });
  }

  //预售自提
  onPrepareCart = (skuIds, buyNum = 1, serviceTagId = 0, from, event) => {
    const { preSaleInfo, skuId } = this.state;
    console.log(preSaleInfo, skuId);

    // 预热按钮设置/取消提醒
    if (preSaleInfo && parseInt(preSaleInfo.status) === 1) {
      if (preSaleInfo.preSaleNotice) {
        //预热埋点
        logClick({
          event,
          eid: "7FERSH_APP_7_1578554636820|49",
          eparam: { skuId },
        });
        this.getWarePreSaleCancelRemind(skuId);
      } else {
        logClick({
          event,
          eid: "7FRESH_APP_6_1568944564798|39",
          eparam: { skuId },
        });
        this.getWarePreSaleRemind(skuId);
      }
      return;
    }

    if (preSaleInfo && parseInt(preSaleInfo.status) === 3) {
      Taro.showToast({
        title: preSaleInfo.tip ? preSaleInfo.tip : "该商品已抢光，敬请期待",
        icon: "none",
      });
      return;
    }
    const { storeId } = this.state;
    if (from !== "popup") {
      logClick({
        event,
        eid: "7FRESH_APP_6_1568944564798|40",
        eparam: { skuId },
      });
      this.onPopup("prepare", "order");
      return;
    }

    const params = {
      wareInfos: [
        {
          storeId,
          skuId,
          buyNum,
          serviceTagId,
        },
      ],
    };
    const orderUrl = `${h5Url}/order.html?nowBuy=13&storeId=${storeId}&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=${this.state.from}`;
    const url = `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
      orderUrl
    )}`;
    if (this.state.isLogin) {
      utils.navigateToH5({ page: orderUrl });
    } else {
      utils.gotoLogin(url, "redirectTo");
    }
  };

  onGetValue = () => {
    const { storeId, skuId } = this.state;
    this.getProductData(storeId, skuId); // 获取商品基础数据
  };

  //轮播图滚动
  swiperChange = (previousItemIndex, currentItemIndex, event) => {
    const { skuId } = this.state;
    logClick({
      event,
      eid: reportPoints.imgUrl,
      eparam: { skuId, previousItemIndex, currentItemIndex },
    });
  };

  //资源投放
  getSkuDetailLaunch = (skuId) => {
    const args = {
      skuId,
    };
    getSkuDetailLaunchApi(args).then((res) => {
      let resourcePositions = [];
      if (res && res.floors && res.floors.length > 0) {
        resourcePositions = res.floors;
      }
      this.setState({
        resourcePositions,
      });
    });
  };

  //点击资源投放位
  goResource = (args, event) => {
    const { storeId } = this.state;
    const clsTag = args && args.clsTag;
    const action = args && args.action;
    clsTag && logClick({ event, eid: clsTag });
    goPage({
      action,
      storeId,
    });
  };

  //榜单
  getRankingList = (skuId) => {
    const args = {
      skuId,
    };
    getRankingListApi(args).then((res) => {
      if (res) {
        this.setState({
          rankingList: res,
        });
      }
    });
  };

  //点击榜单跳转
  goRankingList = (url, event) => {
    const { rankingList, skuId, productDetail } = this.state;
    const contentId = rankingList && rankingList.contentId;
    if (rankingList && rankingList.rankingType === 1) {
      // 算法榜单埋点
      structureLogClick({
        eventId: "commodityDetailPage_rankingListClick",
        jsonParam: {
          skuId: skuId,
          skuName: productDetail && productDetail.skuName,
          clickType: -1,
          clickId: "commodityDetailPage_rankingListClick",
        },
      });
    } else {
      // 普通榜单埋点
      logClick({
        event,
        eid: "7FRESH_APP_9_20200811_1597153579446|10",
        eparam: {
          skuId,
          contentId,
          typename: rankingList && rankingList.rankingTypeSub === 0 ? 1 : 2, //0是内容榜单，1是金榜，上报埋点上报1和2
        },
      });
    }

    if (!url) return;
    utils.navigateToH5({ page: url });
  };

  getEvaluationJumpSwitch = () => {
    getEvaluationJumpSwitch()
      .then((res) => {
        this.setState({
          evaluationJumpSwitch: res.skipFlag,
          buriedExplabel: res.buriedExplabel,
        });
        console.log(res, "evaluationJumpSwitch");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //获取租户信息
  getTenantShop = () => {
    const lbsData = Taro.getStorageSync("addressInfo") || {};
    const { storeId } = this.state;
    getTenantShopService({
      storeId,
      tenantId: lbsData.tenantId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({
            tenantData: res.tenantShopInfo && res.tenantShopInfo.tenantInfo,
          });
        } else {
          // Taro.showToast({
          //   title: res.msg || '接口请求错误',
          //   icon: 'none',
          // });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  errorlauch(data) {
    if (
      Taro.getStorageSync("scene") === 1036 &&
      this.state.evaluationJumpSwitch
    ) {
      this.setState({
        downloadModalFlag: true,
        imgUrlDownload:
          (typeof data == "string" && data) ||
          "https://m.360buyimg.com/img/jfs/t1/140803/35/14826/1615/5fb4e4afE1ee7ab37/faf4917c3eab53c6.png",
      });
    }
  }

  // 关闭促销优惠券弹框
  couponColse = () => {
    this.setState({
      showPromoteCouponModal: false,
    });

    this.onPopupClose();
  };

  /**
   * 获取腰部推荐
   * @param {Number} skuId 商品id
   */
  getRecommendMiddle = (skuId, recommendType) => {
    getSimilarGoods({ skuId, recommendType })
      .then((res) => {
        this.setState({
          middleShopList: res.wareInfos,
        });
      })
      .catch((err) => console.log(err));
  };

  // 获取用户推荐浮层相关配置
  userConfig(skuId) {
    getUserConfig().then((recommendConfig) => {
      console.log(recommendConfig)
      if (recommendConfig && recommendConfig.code === "-1") {
        this.getRecommend(skuId);
        return;
      }
      console.log("[getUserConfig]", recommendConfig);
      if (recommendConfig && recommendConfig.userConfigList) {
        const configlist = recommendConfig.userConfigList;
        configlist.forEach((item) => {
          if (item.userConfigKey === "WareDetailMiddlePattern") {
            this.setState(
              {
                touchstone_expids: item.buriedExpLabel,
                strategyABTest: item.userConfigValue,
                userConfigValue: item.userConfigValue,
              },
              () => {
                if (item.userConfigValue === "0") {
                  this.getRecommendMiddle(skuId, 1);
                  this.getRecommend(skuId, 0);
                } else {
                  this.getRecommendMiddle(skuId, 0);
                  this.getRecommend(skuId, 1);
                }
              }
            );
          }

          if (item.userConfigKey === "SkuDetailAddCartSpaceNum") {
            this.setState(
              {
                AddCartBuriedExpLabel: item.buriedExpLabel,
                AddCartStrategyABTest: item.abTestSource,
                AddCartUserConfigValue: item.userConfigValue,
              },
              () => {
                const options = {
                  AddCartBuriedExpLabel: item.buriedExpLabel,
                  CartAddCartSpaceNum: item.userConfigValue,
                };
                this.configService(options);
              }
            );
          }
        });
      }
    });
  }

  // 关闭搭配购弹窗
  closeRecommendTail = () => {
    const { AddCartUserConfigValue, productDetail, AddCartBuriedExpLabel } =
      this.state;
    console.log("productDetail", productDetail);
    structureLogClick({
      eventId: "commodityDetailPage_matchLayer_close",
      eventName: "商详页-加购搭配弹框-点击×关闭弹框",
      jsonParam: {
        lastSkuId: productDetail && productDetail.skuId,
        lastSkuName: productDetail && productDetail.skuName,
        CartAddCartSpaceNum: AddCartUserConfigValue,
      },
      extColumns: {
        touchstone_expids: AddCartBuriedExpLabel,
      },
    });
    this.setState({
      recommendTail: false,
    });
  };

  setOptions = () => {
    const {
      AddCartBuriedExpLabel,
      AddCartStrategyABTest,
      AddCartUserConfigValue,
      productDetail,
    } = this.state;

    return {
      ...productDetail,
      AddCartBuriedExpLabel,
      AddCartStrategyABTest,
      AddCartUserConfigValue,
    };
  };

  // 搭配购弹出逻辑
  SkuDetailAddCart() {
    const { AddCartUserConfigValue } = this.state;
    let nowVal = Taro.getStorageSync("AddCartUserConfigValue") || 1;
    console.log("AddCartUserConfigValue", AddCartUserConfigValue, nowVal);
    if (this.isAddCart === false && Number(AddCartUserConfigValue) >= 0) {
      if (
        Number(nowVal) === 1 ||
        (Number(nowVal) - 1) % (Number(AddCartUserConfigValue) + 1) === 0
      ) {
        let recommendTailRes = this.getMiddleShopListData(1);
        if (
          recommendTailRes &&
          recommendTailRes.wareInfos &&
          recommendTailRes.wareInfos.length > 5
        ) {
          this.setState({
            recommendTail: true,
            recommendTailData: recommendTailRes && recommendTailRes.wareInfos,
          });
        }
      }
      Taro.setStorageSync("AddCartUserConfigValue", Number(nowVal) + 1);
    }
    this.isAddCart = true;
  }

  // 推荐商品接口数据获取
  getMiddleShopListData(recommendType) {
    const { skuId } = this.state;
    getSimilarGoods({
      skuId: skuId,
      recommendType: recommendType,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  // 获取登录信息上报
  configService = (options) => {
    getConfigService().then((res) => {
      if (res && res.userInfo) {
        console.log("res.userInfo", res.userInfo);
        structureLogClick({
          eventId: "homePage_general_AB_parameters",
          eventName: "匹配用户命中哪个AB实验",
          jsonParam: {
            userPin: res.userInfo && res.userInfo.pin,
            CartAddCartSpaceNum: options && options.CartAddCartSpaceNum,
          },
          extColumns: {
            touchstone_expids: options && options.AddCartBuriedExpLabel,
          },
        });
      }
    });
  };

  // 领券成功订阅消息
  subscribe = () => {
    const _this = this;
    Taro.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          // 状态1 订阅消息总开关是开的
          console.log("状态1 订阅消息总开关是开的");
          _this.setState({
            remindFlag: true,
          });
          if (res.subscriptionsSetting.itemSettings) {
            if (
              res.subscriptionsSetting.itemSettings[
                "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"
              ] == "accept"
            ) {
              // 状态4 勾选了“不再询问”并且选项是允许
              console.log("状态4 勾选了“不再询问”并且选项是允许");
              _this.setState({
                remindFlag: false,
              });
              wx.requestSubscribeMessage({
                tmplIds: ["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"],
                success: function (data) {
                  if (
                    data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                    "accept"
                  ) {
                    _this.setState({
                      subscriptionType: 3,
                    });
                    _this.getQueryTemplateFunc();
                  }
                },
                fail(data) {
                  console.log("fail", data);
                },
              });
            } else if (
              res.subscriptionsSetting.itemSettings[
                "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"
              ] == "reject"
            ) {
              // 状态5 勾选了“不再询问”并且选项是取消
              console.log("状态5 勾选了“不再询问”并且选项是取消");
              _this.setState({
                remindFlag: false,
                subscriptionType: 1,
              });
            }
          } else {
            // 状态3 没有勾选“不再询问”  单次
            console.log("状态3 没有勾选“不再询问”");
            console.log(_this.state.welfareData);
            // if(_this.state.welfareData && _this.state.welfareData.couponCodes){
            wx.requestSubscribeMessage({
              tmplIds: ["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"],
              success: function (data) {
                _this.setState({
                  remindFlag: false,
                });
                if (
                  data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                  "reject"
                ) {
                  _this.alreadyGet = false;
                }
                if (
                  data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                  "accept"
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
              fail(data) {
                _this.setState({
                  remindFlag: false,
                });
              },
            });
          }
        } else {
          // 状态2 订阅消息总开关是关的
          console.log("状态2 订阅消息总开关是关的");
          Taro.openSetting();
        }
      },
    });
  };

  // 查询用户的订阅类型
  getQueryTemplateFunc = () => {
    let uuid = "";
    const wxUserInfo = Taro.getStorageSync("exportPoint");
    if (wxUserInfo && typeof wxUserInfo === "string" && wxUserInfo !== "{}") {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const params = {
      templateId: this.tmplIds,
      toUser: uuid,
    };
    getQueryTemplate(params)
      .then((res) => {
        console.log("getQueryTemplate", res.data);
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
        console.log("getSaveTemplate", res);
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

  render() {
    const {
      productDetail,
      tabs,
      currentTabId,
      systemInfo,
      popup,
      storeId,
      skuId,
      scene,
      recipeList,
      isConcern,
      activityInfo,
      isLoad,
      isCanPreSale,
      attrs,
      productTransRecommend,
      preSaleInfo,
      time,
      preSaleNotice,
      stallInfo,
      stallPopup,
      comments,
      deliveryStatusTip,
      suportNavCustom,
      isIpx,
      resourcePositions,
      rankingList,
      navHeight,
      statusHeight,
      easyBuyWare,
      easyBuy,
      wareQualityAttrList,
      coord,
      address,
      tenantData,
      evaluationJumpSwitch,
      buriedExplabel,
      couponInfoWeb,
      middleShopList, //腰部推荐数据
      strategyABTest, // ab测值
      touchstone_expids, // ab测 对应密匙
      isNewIphone,
      recommendTail, //是否展示搭配购
      recommendTailData,
      pageStyle,
      isLoadPromoteCoupon,
      promoteListInfo, // 促销标数据
      showCouponLabels, // 优惠券数据
      showPromoteCouponModal,
      remindFlag,
      restartFlag,
      isRealName,
      windowWidth,
      windowHeight,
    } = this.state;

    const {
      imageInfoList,
      placeOfProduct,
      brand,
      shelfLife,
      saleSpecDesc,
      weightDesc,
      storeProp,
    } = productDetail;
    console.log(
      "[imageInfoList]",
      middleShopList,
      imageInfoList,
      productDetail
    );
    const productDetailSpecs = [
      {
        name: "品牌：",
        value: brand,
      },
      {
        name: "规格：",
        value: saleSpecDesc,
      },
      {
        name: "重量：",
        value: weightDesc,
      },
      {
        name: "产地：",
        value: placeOfProduct,
      },
      {
        name: "保质期：",
        value: shelfLife,
      },
      {
        name: "存储条件：",
        value: storeProp,
      },
    ].filter((item) => !!item.value && item.value != "无");
    productTransRecommend.map((arr) => productDetailSpecs.push(arr));
    const propertyList = Object.keys(this.state.properties).filter(
      (key) => this.state.properties[key].show
    );
    return isLoad ? (
      <View style="z-index:3;">
        <Loading width={windowWidth} height={windowHeight} tip="加载中..." />
      </View>
    ) : (
      <View
        className="product-container"
        onPageScroll={this.onPageScroll}
        style={pageStyle}
      >
        {suportNavCustom && navHeight && (
          <View
            className="detail-top-cover"
            style={{
              height: `${
                ((navHeight - statusHeight) / systemInfo.windowWidth) * 375
              }px`,
              background: "#fff",
            }}
          >
            <NavBar
              title=""
              showSearch
              onSearch={this.toSearch}
              navHeight={navHeight}
              // showBack={showBack}
              onBack={this.handleBack}
              skin="white"
              isIpx={isIpx}
            />
          </View>
        )}

        {/* 头部tab标签 */}
        <View
          className="header"
          style={{
            top: `${navHeight}rpx`,
          }}
        >
          <Tab
            currentTabId={currentTabId}
            tabs={this.filterTabs(tabs)}
            onChange={this.onTabChange}
          />
        </View>

        <View
          className={
            this.state.forbidScrollFlag
              ? `container-outer noscroll`
              : `container-outer`
          }
          style={{
            paddingTop: px2vw(this.state.navHeight + 88),
            paddingBottom:
              this.state.productDetail.status === 2
                ? scene === 1011 || scene === 1047
                  ? "262rpx"
                  : "94rpx"
                : scene === 1011 || scene === 1047
                ? "344rpx"
                : "176rpx",
          }}
        >
          <View
            style={`top: calc(${this.state.scrollTop}); position: relative`}
          >
            {/* 轮播图 */}
            <View className="product jrolling" id="Product_details_0001">
              <CustomSwiper
                height={systemInfo.windowWidth}
                contents={imageInfoList}
                onSwiperChange={this.swiperChange}
              />
              {activityInfo && activityInfo.price && (
                <View className="solitaire-panel">
                  <FreshSolitaireDetailPanel
                    buttonText={
                      activityInfo.goText ? activityInfo.goText : "去接龙"
                    }
                    price={activityInfo.price}
                    description={activityInfo.slogan}
                    unit=""
                    priceText={activityInfo.priceText}
                    type={activityInfo.type}
                    onClick={this.goToSolitaire.bind(this)}
                  />
                </View>
              )}
            </View>

            {/* 促销腰带  腰带只展示一个：秒杀腰带>预售腰带>促销腰带 */}
            {productDetail &&
              productDetail.beltImageUrl &&
              !(
                productDetail.seckillInfo &&
                productDetail.seckillInfo.started &&
                productDetail.seckillInfo.restseckillTime
              ) &&
              !(
                productDetail &&
                !productDetail.isPeriod &&
                preSaleInfo &&
                preSaleInfo.type === 2 &&
                preSaleInfo.status !== null
              ) && (
                <View
                  style={{
                    backgroundColor: "#fff",
                  }}
                >
                  <View
                    style={{
                      width: px2vw(750),
                      height: px2vw(
                        750 / (productDetail.beltImageAspect || 6.94)
                      ),
                      backgroundImage: `url(${
                        filterImg(productDetail.beltImageUrl) ||
                        "https://m.360buyimg.com/img/jfs/t1/121219/22/3639/5971/5ed456c0Ebbc5334c/b1e931eeb48e0394.png"
                      })`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100%",
                    }}
                    onClick={this.onbelt.bind(this)}
                  />
                </View>
              )}

            {/* 预售 */}
            <View className="product-advance-sale">
              <ProductAdvanceSale
                productDetail={productDetail}
                preSaleInfo={preSaleInfo}
                time={time}
                // onGetValue={this.onGetValue.bind(this)}
                onPopup={this.onPopup.bind(this, "description", "")}
              />
            </View>

            {/* 基本信息 */}
            <View className="product-basic">
              <ProductBasic
                data={productDetail}
                wareQualityAttrList={wareQualityAttrList}
                preSaleInfo={preSaleInfo}
                onPopup={this.onPopup.bind(this, "description", "")}
              />
              {/* 产品属性，含属性、套餐含、已选 */}
              {propertyList &&
                propertyList.map((key, index) => {
                  const prop = this.state.properties[key];
                  // 如果prop.data 有值在显示
                  return (
                    prop.data && (
                      <View className="product-property" key={index}>
                        <View className="list-item">
                          {index === 0 && <RpxLine />}
                          <ListItem
                            label={prop.title}
                            type={prop.type}
                            data={prop.data}
                            current={prop.current}
                            canPopup={prop.canPopup}
                            onButtonChange={this.onPropertyChange}
                            onPopupLayerClick={this.onPropertyPopupClick.bind(
                              this,
                              prop
                            )}
                            onPopup={this.onPopup.bind(this, prop.id, "cart")}
                          />
                          {index + 1 < propertyList.length && <RpxLine />}
                        </View>
                      </View>
                    )
                  );
                })}
            </View>
            {/* 优惠-配送-服务 卡片 */}
            <View className="clear" />
            <View className="product-promotion">
              {/* 优惠，含优惠券、促销、惠搭配 */}
              {isLoadPromoteCoupon &&
                ((promoteListInfo && promoteListInfo.length > 0) ||
                  (showCouponLabels && showCouponLabels.length > 0)) && (
                  <FreshPromoteItemForHere
                    promoteListInfo={promoteListInfo}
                    showCouponLabels={showCouponLabels}
                    onCanPromoteCoupon={this.onCanPromoteCoupon}
                  />
                )}
              {showCouponLabels && showCouponLabels.length > 0 && (
                <View
                  id="Product_details_0002"
                  style={{ height: px2vw(1) }}
                ></View>
              )}
              {promoteListInfo && promoteListInfo.length > 0 && (
                <View
                  id="Product_details_0003"
                  style={{ height: px2vw(1) }}
                ></View>
              )}

              {/* 配送楼层 */}
              <View
                className="product-delivery"
                id="Product_details_0004"
                style={{ marginBottom: 0 }}
              >
                <ListItem
                  label="配送"
                  type="delivery"
                  current={this.state.addressId}
                  data={{
                    address: this.state.address,
                    deliveryTime: this.state.deliveryTime,
                    status: productDetail.status,
                    preSale: productDetail.preSale,
                    reserveContentInfo: productDetail.reserveContentInfo
                      ? productDetail.reserveContentInfo
                      : "",
                    shipmentInfo: productDetail.shipmentInfo
                      ? productDetail.shipmentInfo
                      : "",

                    fullSpeed: productDetail.fullSpeed
                      ? productDetail.fullSpeed
                      : "",
                    overWeightInfo: productDetail.overWeightInfo
                      ? productDetail.overWeightInfo
                      : "",
                    fareInfo: productDetail.fareInfo
                      ? productDetail.fareInfo
                      : "",
                    specialInstruction: productDetail.specialInstruction
                      ? productDetail.specialInstruction
                      : "",
                  }}
                  preSaleInfo={preSaleInfo}
                  canPopup
                  onPopup={this.onPopup.bind(this, "delivery", "")}
                />
              </View>
              {/* 放心购服务楼层 */}
              {easyBuyWare && (
                <View className="product-delivery" id="Product_details_0004">
                  <ListItem
                    label="服务"
                    type="freeservice"
                    data={easyBuy}
                    canPopup
                    onPopup={this.onPopup.bind(this, "freeservice", "")}
                  />
                </View>
              )}
              {/* 溯源 */}
              {this.state.iShowWareTrace && (
                <View
                  className="ware-trace"
                  onClick={this.goWareTrace.bind(this)}
                >
                  <View className="ware-trace-info">
                    <View className="ware-trace-left">
                      <View className="img"></View>
                      <View className="des">该商品已加入食品溯源计划</View>
                    </View>
                    <View className="ware-trace-right">
                      <View className="more">了解更多</View>
                      <View className="icon"></View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* 榜单 */}
            {rankingList &&
              JSON.stringify(rankingList) !== "{}" &&
              rankingList.title &&
              rankingList.jumpUrl && (
                <View
                  className="product-property ranking-list"
                  style={{
                    background:
                      rankingList.rankingType === 0 &&
                      rankingList.rankingTypeSub === 1
                        ? `url(${rankingList.rankBgmBigIcon})`
                        : "#fff",
                  }}
                >
                  <View className="list-item">
                    <ListItem
                      label="榜单"
                      type="text"
                      data={rankingList}
                      resData={rankingList}
                      canPopup
                      onClick={this.goRankingList}
                    />
                  </View>
                </View>
              )}

            {/* 精选菜谱 */}
            {recipeList && recipeList.length > 0 && (
              <View className="recipes jrolling" id="Product_details_0005">
                {this.state.isProductDetailLoaded && (
                  <Recipe
                    storeId={storeId}
                    skuDetail={{
                      skuId,
                      lat: coord.lat,
                      lon: coord.lon,
                      address,
                      ...tenantData,
                    }}
                    recipeList={recipeList}
                    onGotoDetail={this.gotoDetail}
                    onAddCart={this.addCart}
                    evaluationJumpSwitch={evaluationJumpSwitch}
                    buriedExplabel={buriedExplabel}
                    onErrorLauch={this.errorlauch}
                  />
                )}
              </View>
            )}

            {/* 腰部推荐 */}
            {middleShopList && middleShopList.length > 6 && (
              <FloorRecommendProduct
                data={middleShopList}
                onGoDetail={this.gotoDetail}
                onAddCart={this.addCart}
                strategyABTest={strategyABTest}
                touchstone_expids={touchstone_expids}
              />
            )}

            {/* 评价楼层 */}
            {comments &&
              comments.commentShow &&
              comments.commentList &&
              comments.commentList.length > 0 && (
                <View className="comments jrolling" id="Product_details_0006">
                  <Comments
                    commentDetail={{
                      skuId,
                      lat: coord.lat,
                      lon: coord.lon,
                      address,
                      ...tenantData,
                      storeId,
                    }}
                    evaluationJumpSwitch={evaluationJumpSwitch}
                    buriedExplabel={buriedExplabel}
                    comments={this.state.comments}
                    onHandleClick={this.gotoCommentPage}
                    onErrorLauch={this.errorlauch}
                  />
                </View>
              )}
            {resourcePositions && resourcePositions.length > 0 && (
              <ResourcesImg
                data={resourcePositions}
                onClick={this.goResource}
              />
            )}

            {/* 推荐语 */}
            {this.state.isProductDetailLoaded && (
              <RecommendPaper attrs={attrs} />
            )}

            {/* 商品详情 */}
            <View className="detail jrolling" id="Product_details_0007">
              {/* 档口 */}
              {Object.keys(stallInfo).length !== 0 && (
                <StallInfo
                  stallInfo={stallInfo}
                  onGotoDetail={this.gotoDetail}
                  onAddCart={this.addCart}
                />
              )}
              {/* 详情 */}
              {this.state.isProductDetailLoaded && (
                <ProductDetail
                  storeId={storeId}
                  skuId={skuId}
                  specs={productDetailSpecs}
                />
              )}

              {/* 价格描述 */}
              <PriceDesc />
            </View>

            {/*  底部为您推荐 */}
            <View className="recommend jrolling" id="Product_details_0008">
              {this.state.isProductDetailLoaded && (
                <RecommendForYou
                  storeId={storeId}
                  skuId={skuId}
                  onAddCart={this.addCart}
                  onGotoDetail={this.gotoDetail}
                  recommendList={this.state.recommendList}
                  strategyABTest={strategyABTest}
                  isShowMarketPrice
                />
              )}
            </View>

            {/* 找相似按钮 */}
            {this.state.recommendList && this.state.productDetail.status === 5 && (
              <View
                className={`is-show-recommend ${
                  this.state.isShowBackToTop ? "is-show-recommendTop" : ""
                }`}
                onClick={this.showModal}
              >
                找相似
              </View>
            )}

            {/* 为您推荐弹框 */}
            {this.state.recommendList &&
              JSON.stringify(this.state.recommendList) !== "[]" &&
              this.state.isShowRecommendList &&
              this.state.productDetail.status === 5 &&
              !isCanPreSale && (
                <View className="recommend-list">
                  <RecommendForYouNew
                    storeId={storeId}
                    skuId={skuId}
                    onAddCart={this.addCart}
                    onGotoDetail={this.gotoDetail}
                    onCloseRecommendLayer={this.closeRecommendLayer}
                    recommendList={this.state.recommendList}
                    isFromPage="recommend"
                  />
                </View>
              )}
            {this.state.recommendList &&
              this.state.isShowModal &&
              this.state.productDetail.status === 5 && (
                <View className="recommend-list">
                  <RecommendForYouNew
                    storeId={storeId}
                    skuId={skuId}
                    onAddCart={this.addCart}
                    onGotoDetail={this.gotoDetail}
                    onCloseRecommendLayer={this.closeModal}
                    recommendList={this.state.recommendList}
                  />
                </View>
              )}
            {/* 页面底部七鲜拖底图 */}
            {!isLoad && (
              <View className="groupon-pay-bottom">
                <FreshBottomLogo />
              </View>
            )}
          </View>
          {/* 快捷操作 */}
          <View
            className="float-tools"
            style={{
              bottom:
                !isConcern && this.state.productDetail.status !== 5
                  ? isNewIphone
                    ? "354rpx"
                    : "320rpx"
                  : isNewIphone
                  ? "154rpx"
                  : "120rpx",
            }}
          >
            <FloatMenus
              isShowBackToTop={this.state.isShowBackToTop}
              appParameter={this.state.appParameter}
              onGotoHome={this.gotoHome}
              onGotoTop={this.gotoTop}
              onErrorLauch={this.errorlauch}
            />
          </View>

          {/* 购物车 */}
          <View
            className="shopping-cart"
            style={{ paddingBottom: isNewIphone ? "34rpx" : 0 }}
          >
            {/* 配送状态提醒 */}
            {productDetail &&
              parseInt(productDetail.status) === 2 &&
              deliveryStatusTip && <BottomTip text={deliveryStatusTip} />}

            {preSaleInfo &&
            parseInt(preSaleInfo.type) === 2 &&
            preSaleInfo.status !== null &&
            productDetail.status != 1 &&
            productDetail.status != 3 ? (
              <FreshServiceBtn
                type="bottom-double"
                isDisabled={
                  preSaleInfo && parseInt(preSaleInfo.status) === 1
                    ? true
                    : false
                }
                isEmpty={productDetail.status === 2 ? false : true}
                name={preSaleInfo.showCopywriting}
                preSaleNotice={preSaleNotice}
                status={preSaleInfo.status}
                desc="加入购物车"
                jdPrice={
                  "¥" +
                  (preSaleInfo.price !== "" &&
                  preSaleInfo.price !== null &&
                  preSaleInfo.price !== undefined &&
                  preSaleInfo.price !== "undefined"
                    ? preSaleInfo.price
                    : "0.00")
                }
                defaultPrice={
                  productDetail.status === 2 && productDetail.saleNum > 0
                    ? "¥" +
                      (productDetail.jdPrice ? productDetail.jdPrice : "0.00")
                    : 0
                }
                isNoPrepare={parseInt(preSaleInfo.status) === 3 ? true : false}
                cartNum={this.state.numInCart}
                imgUrl="https://m.360buyimg.com/img/jfs/t1/132710/32/15092/2737/5fa8db2cEd0fc62d3/c3021ea66707b5ab.png"
                onGoCart={this.gotoCart}
                onPrepareCart={this.onPrepareCart}
                onAddCart={this.addCart.bind(this, {
                  skuId: this.state.skuId,
                  buyNum: this.state.productDetail.startBuyUnitNum,
                  serviceTagId: this.serviceTagId,
                })}
              />
            ) : (
              <ShoppingCart
                data={{
                  status:
                    !!productDetail && productDetail.status
                      ? productDetail.status
                      : 2,
                  text: !!productDetail ? productDetail.statusText : "",
                  msg: !!productDetail ? productDetail.statusMsg : "",
                }}
                preparePrice={
                  preSaleInfo && parseInt(preSaleInfo.type) === 1
                    ? preSaleInfo.price
                    : ""
                }
                preSaleInfo={preSaleInfo}
                jdPrice={productDetail && productDetail.jdPrice}
                isCanAddCart={this.state.isCanAddCart}
                isCanPreSale={this.state.isCanPreSale}
                num={this.state.numInCart}
                onGotoCart={this.gotoCart}
                onAddOrder={this.addOrder.bind(
                  this,
                  this.state.skuId,
                  this.state.productDetail.startBuyUnitNum,
                  this.serviceTagId
                )}
                onAddCart={this.addCart.bind(this, {
                  skuId: this.state.skuId,
                  buyNum: this.state.productDetail.startBuyUnitNum,
                  serviceTagId: this.serviceTagId,
                  data: {
                    skuId: this.state.skuId || 0,
                    skuName: this.state.productDetail.skuName || "",
                  },
                })}
                notJumpCart={isRealName} //不跳购物车
              />
            )}
          </View>

          {/* 弹出层 */}
          <View className="popup">
            {popup && (
              <Popup
                title={popup.title}
                height={popup.height}
                show={popup.show}
                onClose={this.onPopupClose}
                onPopupClick={this.onPopupClick}
                type={popup.type}
                data={popup.data}
                failData={popup.failData}
                selected={popup.selected}
                keyVal={popup.key}
                icon={popup.icon}
                skuId={popup.skuId}
                onAddCart={this.onPopupAddCart}
              />
            )}
            {stallPopup && (
              <Popup
                title={stallPopup.title}
                height={stallPopup.height}
                show={stallPopup.show}
                onClose={this.onPopupClose}
                onPopupClick={this.onPopupClick}
                type={stallPopup.type}
                data={stallPopup.data}
                failData={stallPopup.failData}
                selected={stallPopup.selected}
                keyVal={stallPopup.key}
                icon={stallPopup.icon}
                onAddCart={this.onPopupAddCart}
              />
            )}
            {/* 促销、优惠券列表弹框 */}
            <FreshSettlementCouponPopupForHere
              showPromoteCouponModal={showPromoteCouponModal}
              promoteListInfo={promoteListInfo}
              couponInfoWeb={couponInfoWeb}
              onClose={this.couponColse.bind(this)}
              onScrollToLower={this.onScrollToLower.bind(this)}
              onCouponChange={this.onCouponChange.bind(this)}
              onGoSearch={this.onGoSearch.bind(this)}
              onClickPromote={this.onClickPromote.bind(this)}
            />
          </View>
        </View>
        {!isConcern && this.state.productDetail.status !== 5 && (
          <View
            style={`position: fixed; bottom: ${
              this.state.productDetail.status === 2 ? 108 : 190
            }rpx; left: 20rpx; right: 20rpx; z-index: 1;`}
          >
            <OfficialAccount />
          </View>
        )}

        {recommendTail && recommendTailData && (
          <View className="recommendTail">
            <DetailRecommendTail
              windowWidth={this.windowWidth}
              data={recommendTailData}
              onGoDetail={this.gotoDetail}
              onAddCart={this.addCart}
              onClose={this.closeRecommendTail}
              options={this.setOptions()}
              // slideAction={this.slideAction.bind(this)}
            />
          </View>
        )}

        {/* 领券订阅消息 */}
        <SubscribeModal
          isIphoneX={app.globalData && app.globalData.$app.isIphoneX}
          type={1}
          show={remindFlag}
        />
        <SubscribeModal
          isIphoneX={app.globalData && app.globalData.$app.isIphoneX}
          type={2}
          show={restartFlag}
          onClose={this.onCloseSubscribe.bind(this)}
        />

        {/* 切多个门店 */}
        <SwitchShopModal
          name="当前地址有多个门店可选"
          shopList={this.state.newTenantShopInfo}
          show={this.state.switchShopFlag}
          onClose={this.onShopClose.bind(this)}
        />

        <DownloadModal
          show={this.state.downloadModalFlag}
          data={this.state.imgUrlDownload}
          onDownloadModalClose={this.onDownloadModalClose.bind(this)}
        />
      </View>
    );
  }
}
