import Taro,{getCurrentInstance} from '@tarojs/taro';
import {
  View,
  Image,
  Text,
  ScrollView,
  Map,
  Canvas,
  Button,
} from '@tarojs/components';
import {
  getNewCheckService,
  getOrderDetailService,
  getDeleteOrderService,
  getSelfTakeCodeService,
  getBuyAgainService,
  getPeriodInfoService,
  getGroupShareService,
  getCancelOrderService,
  getTenantShopService,
  getOrderFinishOrder,
  queryOrderCarrierApi,
  getContactTelService,
  getIndexRecommendTabInfo,
  addCart,
  getAfterPayoutApply,
} from '@7fresh/api';
import AES from 'crypto-js/aes';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { logClick, structureLogClick } from '../../utils/common/logReport';
import { exportPoint } from '../../utils/common/exportPoint';
import {
  px2vw,
  formatDateTime,
  filterImg,
  handlerAddCartResult,
} from '../../utils/common/utils';
import utils from '../../pages/login/util';
import Confirm from '../../components/confirm';
import Loading from '../../components/loading';
import EmptyPage from '../../components/empty-page';
import FloorProductGroup from '../order-list/components/floor-product-group';
import Code from '../order-list/components/code';
import InfoModal from '../order-list/components/info-modal';
import SwitchAddressModal from '../../components/switch-address-modal';
import FightGoTop from '../../components/go-top';
import FloorAddCart from '../../components/floor-add-cart';
import { theme } from '../../common/theme';
import getOpenId from '../../utils/openId';
import { saveAddrInfo } from '../../utils/common/getUserStoreInfo';
import CancelOrderModal from './components/cancel-order-modal';
import AfterSalesModal from './components/after-sales-modal';
import OrderDetailSelectOptions from './components/order-detail-select-options';
import OrderPriceTipsModal from './components/order-price-tips-modal';
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
import FreshBottomLogo from '../../components/bottom-logo';
import './index.scss';

const app = Taro.getApp().$app;
const qqmapsdk = new QQMapWX({
  key: app.wx_map_dev_key,
});

export default class OrderDetail extends CommonPageComponent {
  constructor(props) {
    super(props);
    //设置变量
    this.state = {
      showRefundPopup: false,
      scrollHeight: 0,
      pageTop: 0,
      orderId: 0, //订单id
      orderInfo: {}, //订单详情
      periodOrder: {}, //定期送数据
      switchTenantFlag: false, // 切换门店弹层
      delOrderFlag: false, //删除弹层
      chooseData: {}, //所选对象
      tenantShopInfo: {},
      storeId: '',
      lbsData: Taro.getStorageSync('addressInfo') || {},
      tenantId:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').tenantId) ||
        1,
      //状态边框
      isLoading: true,
      codeFlag: false,
      litterFlag: false, //小液态自提码
      periodFlag: false,
      codePicture: '',
      qrCodeText: '',
      isBuyAgast: false, //是否是再次购买
      isShowQrcode: false, //是否显示自提弹层
      tipInfo: {}, //售后打电话弹层文案
      isShowCall: false, // 是否弹出售后打电话弹层
      afsTypeList: [], //售后类型
      isShowAfsTypeList: false, //是否显示售后类型
      selfMention: {}, //自提信息
      isAll: false, //是否显示全部商品,
      isShowCancelModal: false, //是否显示取消订单弹层
      // remainingPayTime: '', //倒计时显示
      minute: '00',
      seconds: '00',
      finishFlag: false,
      isShowMask: false,
      finishInfo: {},
      showGis: false,
      shareInfo: {},
      freshActivated:
        '//m.360buyimg.com/img/jfs/t1/143346/12/9529/19571/5f706b17E451d2853/49150984b2aece39.png',
      mobile: '',
      contactServiceUrlType: 0,
      recommendList: [],
      showCart: false,
      showCartData: [],
      scrollTop: 0,
      //地图相关
      markers: [],
      imageWidth: 750,
      imageHeight: 300,
      showGis: false,
      carrierInfo: {},
      orderState: '',
      scale: '',
      isClose: true,
      priceTipsInfo: {},
      priceTipsModalShow: false,
      isShowYiyeQrCode: false,
    };
  }

  page = 1;
  maxPage = 0;
  isReachBottom = false;

  config = {
    navigationBarTitleText: '订单详情',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#fff',
  };

  componentWillMount() {
    Taro.hideShareMenu();
    exportPoint(getCurrentInstance().router);
    this.getMobile();
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          scrollHeight: res.windowHeight + 'px',
        });
      },
    });
  }

  componentDidMount() {
    const options = getCurrentInstance().router.params;
    this.setState(
      {
        orderId: options.id,
      },
      () => {
        //页面初始化
        this.loadInit();
        //获取为你推荐数据
        this.getGoodsRecommend();
      }
    );
  }

  componentWillUnmount() {}

  //页面初始化
  loadInit() {
    let { orderId } = this.state;
    getOrderDetailService({
      orderId,
      envType: 1, //1:7freshApp（默认）
    })
      .then(res => {
        if (res && JSON.stringify(res) !== '{}') {
          //计算倒计时
          if (res.state === 2 && res.remainingPayTime) {
            this.setState({
              minute: formatDateTime(res.remainingPayTime)[0],
              seconds: formatDateTime(res.remainingPayTime)[1],
            });
            this.handlerTime(res.remainingPayTime);
          }
          //如果是拼团单,处理拼团数据
          if (res.orderDetailFlagInfoWeb && res.orderDetailFlagInfoWeb.group) {
            // 请求拼团分享数据
            this.getDetailShare();
            if (
              res.groupInfoWeb &&
              res.groupInfoWeb.needCount > 0 &&
              res.groupInfoWeb.grouponMemberInfos
            ) {
              let i = 0;
              for (i; i < +res.groupInfoWeb.needCount; i++) {
                res.groupInfoWeb.grouponMemberInfos.push({
                  self: false,
                  isUnkonw: true,
                });
              }
            }
          }
          this.setState(
            {
              orderInfo: res,
              isLoading: false,
              showGis: res.showGis,
            },
            () => {
              if (res.showGis) {
                const { showGis, orderInfo } = this.state;
                const { orderUserAddressWeb, shopInfoExt, state } = orderInfo;
                this.getCarrierInfo(
                  showGis,
                  orderUserAddressWeb,
                  shopInfoExt,
                  state
                ); // 获取配送员信息
              }

              //定期送
              if (
                res.orderDetailFlagInfoWeb &&
                res.orderDetailFlagInfoWeb.periodOrder
              ) {
                this.getPeriodInfo();
              }
              //如果是拼团单,获取拼团分享数据
              if (
                res.orderDetailFlagInfoWeb &&
                res.orderDetailFlagInfoWeb.group
              ) {
                this.getGroupgroupInfoWebShare();
              }
            }
          );
        } else {
          this.setState({
            orderInfo: {},
            isLoading: false,
          });
        }
      })
      .catch(() => {});
  }

  //为你推荐
  getGoodsRecommend() {
    const params = {
      page: this.page || 1,
      pageSize: 10,
      tabType: 4,
    };
    getIndexRecommendTabInfo(params).then(data => {
      if (data && data.totalPage > 0) {
        this.setState(
          {
            recommendList: data.pageList
              ? this.state.recommendList.concat(data.pageList)
              : [],
          },
          () => {
            this.maxPage = (data && data.totalPage) || 0;
            if (this.maxPage === 0) {
              this.setState({ isBottomLoad: false });
            }
          }
        );
      } else {
        this.maxPage = 0;
      }
      this.isReachBottom = false;
    });
  }

  //查看物流
  goOrderLogistics = () => {
    const { orderId, orderInfo } = this.state;
    const { tenantInfo, orderInvoiceInfoWeb, storeId } = orderInfo;
    const { tenantId } = tenantInfo;
    const { status } = orderInvoiceInfoWeb;
    Taro.navigateTo({
      url: `/pages-mine/orderTrack/orderTrack?id=${orderId}&orderTenantId=${tenantId}&storeId=${storeId}&status=${status}`,
    });
  };

  // 获取拼团信息
  getGroupgroupInfoWebShare = () => {
    let { groupInfoWeb, tenantInfo } = this.state.orderInfo;
    if (groupInfoWeb) {
      getGroupShareService({
        activityId: groupInfoWeb.activityId,
        storeId: groupInfoWeb.storeId,
        skuId: groupInfoWeb.skuId,
        groupId: groupInfoWeb.groupId,
        tenantId: tenantInfo && tenantInfo.tenantId,
      })
        .then(res => {
          if (res) {
            this.setState({
              shareInfo: res,
            });
          }
        })
        .catch(() => {});
    }
  };

  /**
   * 定期送
   */
  getPeriodInfo = () => {
    let { orderId, tenantInfo, state } = this.state.orderInfo;
    getPeriodInfoService({
      orderId: orderId,
      state: state,
      tenantId: tenantInfo && tenantInfo.tenantId,
    })
      .then(res => {
        if (res.success && res.periodOrder) {
          this.setState({
            periodOrder: res.periodOrder,
          });
        }
      })
      .catch(() => {});
  };

  /**
   * 订单状态倒计时
   */
  handlerTime = time => {
    let count = 1;
    const { orderInfo } = this.state;
    if (time) {
      this.setState({ remainingPayTime: formatDateTime(time) });
      this.countDown = setInterval(() => {
        if (time > 999) {
          time = time - 1000;
          this.setState({
            // remainingPayTime: formatDateTime(time),
            minute: formatDateTime(time)[0],
            seconds: formatDateTime(time)[1],
          });
        } else {
          if (count < 4 && orderInfo.status === 2) {
            count = count + 1;
          } else {
            clearInterval(this.countDown);
          }
          this.loadInit();
        }
      }, 1000);
    }
  };

  /*
   * 请求在线客服是跳转链接还是打电话
   * @param contactServiceUrlType：代表联系客服的方式，拨打电话（6） or在线客服
   * contactServiceUrl：拨打电话的电话号码or在线客服的页面地址
   */
  getMobile() {
    getContactTelService()
      .then(res => {
        this.setState({
          mobile: Number(res.urlType) === 6 ? res.toUrl : '',
          contactServiceUrlType: Number(res.urlType),
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 关闭切门店弹框
  onCloseShop = () => {
    this.setState({
      switchTenantFlag: false,
      isShowMask: false,
    });
  };

  //关闭提货码弹框
  onCloseModal = () => {
    this.setState({
      isShowQrcode: false,
      isShowMask: false,
    });
  };

  // 关闭售后类型弹层
  onCloseAfsType = () => {
    this.setState({
      isShowAfsTypeList: false,
      isShowMask: false,
    });
  };

  /**
   * 弹出退款弹层提示
   */
  showRefundPopup = () => {
    this.setState({
      isShowRefundPopup: true,
      isShowMask: false,
    });
  };
  /**
   * 关闭退款弹层提示
   */
  closeRefundPopup = () => {
    this.setState({
      isShowRefundPopup: false,
      isShowMask: false,
    });
  };

  // 查看全部
  isShowAllGoods = () => {
    this.setState({
      isAll: !this.state.isAll,
    });
  };

  //关闭自提弹层
  closeZitiLayer = () => {
    this.setState({
      isShowQrcode: false,
    });
  };

  // 取消订单
  onHandleIsCancelOrder = () => {
    this.setState({
      isShowCancelModal: false,
    });
  };

  /**
   * 删除订单
   **/
  onDelete=()=>{
    this.setState({
      delOrderFlag: true,
    });
  };

  /**
   * 删除/售后弹层取消
   */
  modalCancelTxt = () => {
    this.setState({
      delOrderFlag: false,
      isShowCall: false,
    });
  };

  // 晚必赔接口
  onGetAfterPayoutApply = orderId => {
    const params = {
      orderId: orderId,
    };
    getAfterPayoutApply(params).then(res => {
      if (res.success) {
        if (res.progressUrl) {
          utils.navigateToH5({
            page: `${app.h5RequestHost}${res.progressUrl}`,
          });
        }
      } else {
        Taro.showToast({
          title: res && res.msg,
          icon: 'none',
        });
      }
    });
  };

  //确认收货
  getFinishOrder() {
    const { finishInfo } = this.state;
    let count = 1;

    getOrderFinishOrder(finishInfo)
      .then(res => {
        if (res && res.success) {
          //刷新页面
          this.setState(
            {
              finishFlag: false,
              isShowMask: false,
            },
            () => {
              this.timer = setInterval(() => {
                if (count < 4 && this.state.orderInfo.state === 8) {
                  count = count + 1;
                  this.loadInit();
                } else {
                  clearInterval(this.timer);
                }
              }, 1000);
            }
          );
        } else {
          Taro.showToast({
            title: (res && res.msg) || '接口请求异常',
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 弹层确定取消订单
  onCancelOrder = type => {
    logClick('7FRESH_H5_1_201803182|19', '', '', '');
    const { orderInfo } = this.state;
    if (!orderInfo.orderId) {
      return false;
    }
    this.setState(
      {
        isShowCancelModal: false,
      },
      () => {
        getCancelOrderService({
          orderId: orderInfo.orderId,
          reason: orderInfo.reasons[type],
          tenantId:
            orderInfo && orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId,
          storeId: orderInfo.storeId,
        })
          .then(res => {
            if (res && res.success) {
              //取消订单成功后 刷新页面
              Taro.showToast({
                title: (res && res.msg) || '取消成功',
                icon: 'success',
              });
              setTimeout(() => {
                this.loadInit();
              }, 2000);
            } else {
              Taro.showToast({
                title: (res && res.msg) || '取消失败',
                icon: 'none',
              });
            }
          })
          .catch(() => {});
      }
    );
  };

  /**
   * 删除弹层确定
   */
  modalOkTxt = () => {
    const { tenantInfo, orderId } = this.state.orderInfo;
    getDeleteOrderService({
      orderId,
      tenantId: tenantInfo.tenantId,
    })
      .then(res => {
        if (res && res.success) {
          Taro.navigateBack({
            delta: 1,
          });
        } else {
          if (res && res.msg) {
            Taro.showToast({
              title: res && res.msg,
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

  /**
   * 再次购买
   * @param {*} info
   */
  toBuyAgast = () => {
    let { storeId } = this.state.orderInfo;
    let lbsStoreId = this.state.lbsData && this.state.lbsData.storeId;
    //当前门店和该订单门店Id不相等时，进行门店弹框选择
    if (lbsStoreId && lbsStoreId > 0 && storeId !== lbsStoreId) {
        this.onTenantInfo();
        return;
    }
    this.toBuyNext();
  };

  /**
   * 购买请求
   */
  toBuyNext = () => {
    logClick('7FRESH_H5_1_201803182|23', '', '', '');
    const { lbsData } = this.state;
    const orderInfo = this.state.orderInfo;
    const storeId = orderInfo.storeId;
    let wareInfos = [];
    let skuInfoWebList = [];
    for (let index in orderInfo.orderSkuGroupWebList) {
      let tmpList = orderInfo.orderSkuGroupWebList[index].orderSkuInfoWebList;
      for (let j in tmpList) {
        skuInfoWebList.push(tmpList[j]);
      }
    }

    for (let i in skuInfoWebList) {
      const wareInfo = {
        skuId: skuInfoWebList[i].skuId,
        skuName: skuInfoWebList[i].skuName,
        buyNum: skuInfoWebList[i].buyNum,
        serviceTagId: skuInfoWebList[i].serviceTagId || '',
        featureMap: skuInfoWebList[i].featureMap || null,
      };
      if (skuInfoWebList[i].selectedTasteInfoIds) {
        wareInfo.selectedTasteInfoIds = skuInfoWebList[i].selectedTasteInfoIds;
      }
      wareInfos.push(wareInfo);
    }

    // 加车统一结构埋点
    structureLogClick({
      eventId: 'orderDetailPage_orderOperation_addCart',
      jsonParam: {
        firstModuleId: 'orderOperationModule',
        firstModuleName: '再次购买',
        clickType: 1,
        skuName: wareInfos.map(item => item.skuName).join('+'),
        skuId: wareInfos.map(item => item.skuId).join('+'),
      },
    });

    if (orderInfo.giftCard) {
      logClick(
        '7FRESH_APP_9_20200811_1597153579446|23',
        skuInfoWebList[0].skuId,
        '',
        ''
      );
      Taro.setStorageSync('giftCardsWareInfo', JSON.stringify(wareInfos[0]));
      // TOH5编码
      let ciphertext = AES.encrypt(
        JSON.stringify(wareInfos[0]),
        '7fresh-h5'
      ).toString();
      utils.navigateToH5({
        page: `${app.h5RequestHost}/giftCards/cardOrder?from=miniapp&nowBuy=16&lng=${lbsData.lng}&lat=${lbsData.lat}&storeId=${lbsData.storeId}&giftCardsWareInfo=${ciphertext}`,
      });
    } else {
      getBuyAgainService({ storeId: storeId, wareInfos: wareInfos })
        .then(res => {
          if (res && res.success) {
            this.setState(
              {
                periodFlag: false,
              },
              () => {
                utils.navigateToH5({
                  page: `${app.h5RequestHost}/cart.html?form=miniapp`,
                });
              }
            );
          } else {
            Taro.showToast({
              title: res && res.msg,
              icon: 'none',
            });
          }
          return;
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  //获取租户信息
  onTenantInfo() {
    const orderInfo = this.state.orderInfo;
    const tenantId = orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId;
    const storeId = orderInfo.storeId;

    getTenantShopService({ storeId, tenantId })
      .then(res => {
        if (res && res.success) {
          const tenantShopInfo = res.tenantShopInfo;
          this.setState(
            {
              tenantShopInfo: tenantShopInfo,
            },
            () => {
              //订单列表和订单详情都是单门店切换
              this.setState({
                switchTenantFlag: true,
              });
            }
          );
        } else {
          Taro.showToast({
            title: res && res.msg,
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 根据订单状态获取icon
  getIconByState = state => {
    // 已取消
    if (state === 0) {
      return 'first-icon gray-icon';
    } else if (state === 2) {
      //待付款
      return 'first-icon wait-icon';
    } else if (state === 5) {
      //等待拣货
      return 'first-icon wait-icon';
    } else if (state === 8 || state === 7) {
      //配送中
      return 'first-icon bus-icon';
    } else {
      return 'first-icon';
    }
  };

  clickTel() {
    logClick('7FRESH_APP_6_1568944564798|34', '', '', '');
  }

  openPriceTipsModal = info => {
    this.setState({
      priceTipsModalShow: !this.state.priceTipsModalShow,
      priceTipsModalInfo: info,
    });
  };

  //地址信息存入SessionStorage
  onSwitch(tenantShopInfo) {
    const orderInfo = this.state.orderInfo;
    const lbsData = this.state.lbsData;
    let tenant = lbsData && lbsData.tenantShopInfo; //全部租户信息

    if (tenant && tenant.length > 1) {
      //如果有多个租户缓存信息，更新缓存
      for (let i = 0; i < tenant.length; i++) {
        if (tenant[i].storeId === orderInfo.storeId) {
          tenant[i].isSelected = true;
        } else {
          tenant[i].isSelected = false;
        }
      }
    } else {
      //没有缓存，直接将接口取到的租户信息保存
      tenant = [tenantShopInfo];
      tenant[0].isSelected = true;
    }
    var orderUserAddressWeb = orderInfo.orderUserAddressWeb || null;
    var addrInfo = {
      addressId: (orderUserAddressWeb && orderUserAddressWeb.addressId) || '',
      fullAddress: (orderUserAddressWeb && orderUserAddressWeb.address) || '',
      lat: (orderUserAddressWeb && orderUserAddressWeb.lat) || '',
      lon: (orderUserAddressWeb && orderUserAddressWeb.lng) || '',
      storeName: orderInfo.shopName || '',
      storeId: orderInfo.storeId || '',
      tenantInfo: orderInfo.tenantInfo || '',
      tenantId: (orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId) || 1,
      addressSummary: '-1',
      addressExt: (orderUserAddressWeb && orderUserAddressWeb.address) || '',
      coord: [
        (orderUserAddressWeb && orderUserAddressWeb.lat) || '',
        (orderUserAddressWeb && orderUserAddressWeb.lng) || '',
      ],
      where: '-1', //返回地址不全的只保存到addressExt下
    };

    saveAddrInfo(addrInfo, tenant);

    if (this.state.switchTenantFlag) {
      this.setState(
        {
          switchTenantFlag: false,
        },
        () => {
          if (this.state.isBuyAgast) {
            this.toBuyNext();
            return;
          } else {
            //跳转商祥页
            Taro.navigateTo({
              url: `/pages/detail/index?prepayCardType=${orderInfo.giftCard}&storeId=${orderInfo.storeId}&skuId=${this.state.chooseData.skuId}`,
            });
            return;
          }
        }
      );
    } else {
      if (this.state.isBuyAgast) {
        this.toBuyNext();
        return;
      } else {
        //跳转商祥页
        Taro.navigateTo({
          url: `/pages/detail/index?prepayCardType=${orderInfo.giftCard}&storeId=${orderInfo.storeId}&skuId=${this.state.chooseData.skuId}`,
        });
        return;
      }
    }
  }

  showFreshBind = () => {
    const { orderInfo } = this.state;
    return (
      orderInfo &&
      orderInfo.giftCard &&
      orderInfo.orderFreshCardInfoWeb &&
      orderInfo.orderFreshCardInfoWeb.waitBindCardCount &&
      orderInfo.orderFreshCardInfoWeb.waitBindCardCount > 0
    );
  };

  // 关闭码弹框
  onCloseCode = () => {
    this.setState({
      codeFlag: false,
    });
  };

  /**
   * 跳转商品详情
   */
  goDetail = info => {
    logClick('7FRESH_H5_1_201803182|22', '', '', '');
    let { orderInfo } = this.state;
    // 省省卡券包订单
    if (
      orderInfo &&
      orderInfo.orderDetailFlagInfoWeb &&
      orderInfo.orderDetailFlagInfoWeb.cheapCard
    ) {
      Taro.showToast({
        title: '本单为省省卡券包订单',
        icon: 'none',
      });
      return;
    }
    let lbsStoreId = this.state.lbsData && this.state.lbsData.storeId;
    if (lbsStoreId && lbsStoreId > 0) {
      if (orderInfo.storeId === lbsStoreId) {
        getOpenId().then(openId => {
          Taro.navigateTo({
            url: `/pages/detail/index?prepayCardType=${orderInfo.giftCard}&uuid=${openId}&storeId=${orderInfo.storeId}&skuId=${info.skuId}`,
          });
        });
        return;
      } else {
        this.setState(
          {
            isBuyAgast: false,
            chooseData: info,
          },
          () => {
            //弹层切换租户
            this.onTenantInfo();
          }
        );
      }
    } else {
      getOpenId().then(openId => {
        Taro.navigateTo({
          url: `/pages/detail/index?prepayCardType=${orderInfo.giftCard}&uuid=${openId}&storeId=${orderInfo.storeId}&skuId=${info.skuId}`,
        });
      });
    }
  };

  // 进入详情页
  goDetailRecommend = info => {
    structureLogClick({
      eventId: 'orderDetail_recommend_clickCommodity',
      jsonParam: {
        clickId: 'orderDetail_recommend_clickCommodity',
        clickType: 2,
        pageId: '0024',
        pageName: '订单详情页',
        skuId: info.skuId,
        skuName: info.skuName,
        skuStockStatus: info.status ? info.status : '',
        storeId: info.storeId,
        tenantId: this.state.tenantId,
        platformId: 1,
        superiorPageId: '0023',
        superiorPageName: '我的订单页',
      },
    });

    getOpenId().then(openId => {
      Taro.navigateTo({
        url: `/pages/detail/index?skuId=${info.skuId}&uuid=${openId}&storeId=${info.storeId}`,
      });
    });
  };

  // 加车
  onAddCart(args, ev) {
    ev.stopPropagation();
    structureLogClick({
      eventId: 'orderDetail_recommend_addCart',
      jsonParam: {
        clickId: 'orderDetail_recommend_addCart',
        clickType: 1,
        storeId: args.storeId,
        pageId: '0024',
        pageName: '订单详情页',
        skuId: args.skuId,
        skuName: args.skuName,
        skuStockStatus: args.status ? args.status : '',
        tenantId: this.state.tenantId,
        platformId: 1,
        superiorPageId: '0023',
        superiorPageName: '我的订单页',
      },
    });

    if (args.isPop) {
      this.setState({
        showCart: true,
        showCartData: args,
      });
    } else {
      const params = {
        data: {
          wareInfos: {
            buyNum: args.startBuyUnitNum,
            skuId: args.skuId,
            serviceTagId: args.serviceTagId,
          },
        },
      };
      addCart(params, args.storeId).then(data => {
        const msg = data.msg;
        if (data.success) {
          Taro.showToast({
            title: msg || '添加成功！',
            icon: 'success',
          });
          return;
        } else {
          Taro.showToast({
            title: msg || '添加失败！',
            icon: 'none',
          });
          return;
        }
      });
    }
  }

  /**
   * 称重商品加车
   */
  weightAddCart(item) {
    let selectedTasteInfoIds = {};
    item.attrInfoList &&
      item.attrInfoList.forEach(item1 => {
        let id = [];
        item1.attrItemList.forEach(item2 => {
          if (item2.selected) {
            id.push(item2.id);
          }
        });
        if (id.length > 0) {
          selectedTasteInfoIds[item1.tplId] = id;
        }
      });
    const params = {
      wareInfos:
        Object.keys(selectedTasteInfoIds).length !== 0
          ? {
              skuId: item.skuId,
              buyNum: item.startBuyUnitNum,
              serviceTagId: item.serviceTagId || 0,
              selectedTasteInfoIds,
            }
          : {
              skuId: item.skuId,
              buyNum: item.startBuyUnitNum,
              serviceTagId: item.serviceTagId || 0,
            },
      storeId: item.storeId,
    };
    addCart({
      data: JSON.stringify(params),
    }).then(res => {
      handlerAddCartResult(res, item);
      this.setState({
        showCart: false,
      });
    });
  }

  /**
   * 申请售后
   */
  applyAfterSales = (info, e) => {
    e && e.stopPropagation();
    //如果是预付卡埋点走  afterSale
    if (info.prepayCardType) {
      logClick('7FERSH_APP_8_1590127250769|48', '', '', '');
    } else {
      logClick('7FRESH_H5_1_201803182|26', '', '', '');
    }
    const { lbsData, orderInfo } = this.state;
    const orderId = orderInfo && orderInfo.orderId;
    const orderTenantId =
      orderInfo && orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getNewCheckService({
          orderId: orderId,
          orderTenantId: orderTenantId,
          skuId: info.skuId,
          skuUuid: info.uuid,
          skuSaleMode: info.salemode, //销售模式=计件：1 称重：2
        })
          .then(res => {
            this.setState({
              isLoading: false,
            });
            if (res && res.success) {
              let afsTypeList =
                res.checkAfsInfo && res.checkAfsInfo.afsTypeList
                  ? res.checkAfsInfo.afsTypeList
                  : [];
              let afsType =
                res.checkAfsInfo && res.checkAfsInfo.afsType
                  ? res.checkAfsInfo.afsType
                  : '';
              if (afsTypeList && afsTypeList.length > 0) {
                this.setState({
                  isShowAfsTypeList: true,
                  afsTypeList,
                });

                //保存商品信息至本地
                Taro.removeStorageSync('afs-goods-info');
                var afsGoodsInfo = {
                  orderId: orderId,
                  tenantId: orderTenantId,
                  storeId: orderInfo.storeId || (lbsData && lbsData.storeId),
                  skuId: info.skuId,
                  skuUuid: info.uuid,
                  salemode: info.salemode, //销售模式=计件：1 称重：2
                  afsType: afsType, // 售后类型： 1：普通商品售后（默认） 2: 电子七鲜礼品卡售后
                };
                Taro.setStorageSync(
                  'afs-goods-info',
                  JSON.stringify(afsGoodsInfo)
                );
              } else {
                if (res.checkAfsInfo && res.checkAfsInfo.tipInfo) {
                  this.setState({
                    isShowCall: true,
                    tipInfo: res.checkAfsInfo.tipInfo,
                  });
                }
              }
            } else {
              //改变按钮样式
              if (res && res.checkAfsInfo) {
                if (res.checkAfsInfo.tipInfo) {
                  this.setState({
                    isShowCall: true,
                    tipInfo: res.checkAfsInfo.tipInfo,
                  });
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    );
  };

  // 复制
  handleCopy = orderId => {
    Taro.setClipboardData({
      data: orderId.toString(),
      success() {
        wx.getClipboardData({
          success() {
            Taro.showToast({
              title: '复制成功',
              icon: 'success',
            });
          },
        });
      },
    });
  };

  /**
   * 补开&&查看发票
   */
  goInvoice = () => {
    let { orderId, tenantInfo, orderInvoiceInfoWeb } = this.state.orderInfo;
    let fileUrl = '';
    if (
      orderInvoiceInfoWeb.myInvoiceInfo &&
      orderInvoiceInfoWeb.myInvoiceInfo.invoiceList &&
      orderInvoiceInfoWeb.myInvoiceInfo.invoiceList.length > 0
    ) {
      fileUrl = orderInvoiceInfoWeb.myInvoiceInfo.invoiceList[0].fileUrl;
    }

    if (orderInvoiceInfoWeb.status === 2) {
      const invoiceUrl =
        '/invoice/make-invoice?orderId=' +
        orderId +
        '&tenantId=' +
        tenantInfo.tenantId +
        '&from=miniapp';
      utils.navigateToH5({
        page: `${app.h5RequestHost}${invoiceUrl}`,
      });
    } else if (orderInvoiceInfoWeb.status === 3) {
      if (fileUrl) {
        utils.navigateToH5({
          page: `${fileUrl}`,
        });
      }
    }
  };

  // 为你推荐分页
  scrollToLowerRecommoned = () => {
    if (this.page < this.maxPage && this.maxPage !== 0) {
      this.page++;
      this.getGoodsRecommend();
    }
  };

  /**
   * 返回顶部
   */
   goTop = () => {
    this.setState(
      {
        pageTop: '',
      },
      () => {
        this.setState({
          pageTop: 0,
        });
      }
    );
  };

  //页面滚动
  onScroll = e => {
    this.setState({
      scrollTop: e.detail.scrollTop,
    });
  };

  // 关闭称重弹框
  onCloseCart = () => {
    this.setState({
      showCart: false,
    });
  };

  /**
   * 订单详情 底部的按钮
   * TOPAY(1,"去支付"),
   * QUERYUMS(2,"查看物流"),
   * BUGAGAIN(3," 再次购买"),
   * CANCELORDER(4,"取消订单"),
   * CONTINUEPAY(5,"继续支付"),
   * KEFU(6,"联系客服"),
   * APPLYSHOUHOU(7,"申请售后"),
   * APPLYTUIKUAN(9,"申请退款");
   * APPLYTUIKUAN(17,"异业自提，取货二维码");
   * 18 删除订单
   * 20 提货码
   * 13 拼团详情
   */
  btnClick(buttonId) {
    //是否所有情况都切弹框
    const orderInfo = this.state.orderInfo;
    const orderId = orderInfo.orderId;
    const orderStoreId = orderInfo.storeId;
    const orderTenantId = orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId;
    if (buttonId === 2) {
      logClick('7FRESH_H5_1_201803182|21', '', '', '');
      //查看物流
      this.goOrderLogistics();
      return;
    }
    if (buttonId === 3) {
      //再次购买
      logClick('7FRESH_H5_1_201803182|23', '', '', '');
      if (
        orderInfo.orderDetailFlagInfoWeb &&
        orderInfo.orderDetailFlagInfoWeb.periodOrder
      ) {
        this.setState({
          periodFlag: true,
          litterFlag: true,
          isBuyAgast: true,
        });
      } else {
        this.setState(
          {
            isBuyAgast: true,
          },
          () => {
            this.toBuyAgast();
          }
        );
      }
      return;
    }
    if (buttonId === 4 || buttonId === 9) {
      //取消订单
      this.setState({
        isShowCancelModal: true,
      });
      return;
    }
    if (buttonId === 5) {
      //去支付
      logClick('7FRESH_H5_1_201803182|20', '', '', '');
      const url = `/pages/wxpay/wxpay?orderId=${orderId}&storeId=${orderStoreId}&tenantId=${orderTenantId}&from=miniapp&shouldPrice=${orderInfo &&
        orderInfo.orderMoneyInfoWeb &&
        orderInfo.orderMoneyInfoWeb.shouldPrice}`;
      Taro.navigateTo({
        url: url,
      });
      return;
    }
    // 联系客服
    if (buttonId === 6) {
      getContactTelService()
        .then(res => {
          if (res && res.success) {
            if (Number(res.urlType) === 6) {
              //打电话
              const mobile = Number(res.urlType) === 6 ? res.toUrl : '';
              Taro.makePhoneCall({
                phoneNumber: mobile, //仅为示例，并非真实的电话号码
              });
            } else {
              utils.navigateToH5({
                page: res.toUrl,
              });
            }
          }
        })
        .catch(err => {
          console.error('获取baseConfig-错误', err);
        });
      return;
    }
    if (buttonId === 17) {
      //提货二维码
      this.setState({
        codePicture: orderInfo.qrCodeUrlBase64, // base64自提码
        qrCodeText: orderInfo.qrCodeText,
        codeFlag: true,
      });
      return;
    }
    if (buttonId === 18) {
      //删除订单
      logClick('7FRESH_H5_3_1543909294472|3', '', '', '');
      this.onDelete();
      return;
    }
    if (buttonId === 19) {
      //小液态自提码
      logClick('7FRESH_H5_3_1543909294472|84', '', '', '');
      this.getSelfTakeCodeInfo();
      return;
    }
    if (buttonId === 20) {
      //小液态自提码
      this.getSelfTakeCodeInfo();
      return;
    }
    //接龙订单待核销
    if (buttonId === 21) {
      this.setState({
        finishFlag: true,
        isShowMask: true,
        finishInfo: {
          orderId,
          tenantId: orderTenantId,
        },
      });
      return;
    }
    // 晚必赔
    if (buttonId === 22) {
      structureLogClick({
        eventId: 'orderDetailPage_orderOperation_applyForLateCompensate',
        eventName: '订单详情页_订单操作_晚必赔入口点击',
        jsonParam: {
          clickType: '-1',
          pageId: '0024',
          pageName: '订单详情页',
          tenantId: `${orderTenantId}`,
          storeId: `${orderStoreId}`,
          platformId: '1',
          clickId: 'orderDetailPage_orderOperation_applyForLateCompensate',
        },
      });
      this.onGetAfterPayoutApply(orderId);
      return;
    }
  }

  //查看定期送分期详情
  goToPeriodStageInfo = () => {
    const { orderInfo } = this.state;
    const storeId = orderInfo && orderInfo.storeId;
    const orderId = this.state.orderInfo && this.state.orderInfo.orderId;
    const skuId =
      orderInfo &&
      orderInfo.orderSkuGroupWebList[0] &&
      orderInfo.orderSkuGroupWebList[0].orderSkuInfoWebList[0] &&
      orderInfo.orderSkuGroupWebList[0].orderSkuInfoWebList[0].skuId;
    logClick('7FRESH_H5_2_201803184|15', '', '', '');
    utils.navigateToH5({
      page: `${app.h5RequestHost}/fenqiDetail.html?orderId=${orderId}&skuId=${skuId}&storeId=${storeId}&from=miniapp`,
    });
  };

  // 选择售后类型
  onSelectAfsType = type => {
    const afsGoodsInfo = Taro.getStorageSync('afs-goods-info');
    Taro.removeStorageSync('afterSalesAddress');
    const url = `${app.h5RequestHost}/mine/afterSalesApply?from=${
      this.state.from
    }&serviceType=${type}&afsGoodsInfo=${encodeURIComponent(afsGoodsInfo)}`;
    utils.navigateToH5({
      page: url,
    });
    this.setState({
      isShowAfsTypeList: false,
    });
  };

  //获取小业态自提信息
  getSelfTakeCodeInfo = () => {
    let orderInfo = this.state.orderInfo;
    getSelfTakeCodeService({
      orderId: orderInfo.orderId,
      tenantId:
        orderInfo && orderInfo.tenantInfo && orderInfo.tenantInfo.tenantId,
    })
      .then(res => {
        if (res && res.businessCode === 0 && res.success) {
          this.setState({
            isShowQrcode: true,
            selfMention: res,
          });
        } else {
          Taro.showToast({
            title: (res && res.msg) || '商品还不可自提，请您稍后再试',
            icon: 'none',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCarrierInfo(showGis, orderUserAddressWeb, shopInfoExt, state) {
    const { orderId, orderInfo } = this.state;
    const { tenantInfo, storeId } = orderInfo;
    const carrierData = {
      orderId: orderId,
      tenantId: tenantInfo.tenantId,
      storeId: storeId,
    };

    queryOrderCarrierApi({ data: carrierData }).then(carrierRes => {
      const carrier = `${carrierRes && carrierRes.lat},${carrierRes &&
        carrierRes.lon}`;
      const userInfo = `${orderUserAddressWeb &&
        orderUserAddressWeb.lat},${orderUserAddressWeb &&
        orderUserAddressWeb.lng}`;

      const _this = this;
      //调用距离计算接口
      qqmapsdk.calculateDistance({
        mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        //from参数不填默认当前地址
        //获取表单提交的经纬度并设置from和to参数（示例为string格式）
        from: carrier, //若起点有数据则采用起点坐标，若为空默认当前地址
        to: userInfo, //终点坐标
        success: function(res) {
          //成功后的回调
          wx.getImageInfo({
            src:
              'https://m.360buyimg.com/img/jfs/t1/118665/19/7597/13771/5ec50ce4E2bcfeacf/412244bfc0ef62a2.png',
            success: function(imageRes) {
              const ctx = wx.createCanvasContext('myDetailCanvas');
              ctx.setFontSize(24);
              let distance;
              let discountText = '';
              if (
                res &&
                res.result &&
                res.result.elements &&
                res.result.elements[0] &&
                res.result.elements[0].distance &&
                res.result.elements[0].distance > 1000
              ) {
                distance =
                  (res.result.elements[0].distance / 1000).toFixed(1) + 'km';
                discountText = `配送中|距您${distance}`;
              } else if (
                (res.result.elements[0].distance &&
                  res.result.elements[0].distance < 10) ||
                res.result.elements[0].distance === 0
              ) {
                distance = res.result.elements[0].distance
                  ? res.result.elements[0].distance + 'm'
                  : 0 + 'm';
                discountText = `  配送中|距您${distance}`;
              } else {
                distance = res.result.elements[0].distance
                  ? res.result.elements[0].distance + 'm'
                  : 0 + 'm';
                discountText = ` 配送中|距您${distance}`;
              }
              let boxWidth = parseInt(ctx.measureText(discountText).width);
              let width = boxWidth * 1.5;
              let height = imageRes.height;
              //获取屏幕宽度
              let screenWidth = wx.getSystemInfoSync().windowWidth;
              //处理一下图片的宽高的比例
              if (width >= height) {
                if (width > screenWidth) {
                  width = screenWidth;
                }
                height = (height / imageRes.width) * width;
              } else {
                if (width > screenWidth) {
                  width = screenWidth;
                }
                if (height > 400) {
                  height = 400;
                  width = (imageRes.width / imageRes.height) * height;
                } else {
                  height = (height / imageRes.width) * width;
                }
              }
              _this.setState(
                {
                  imageWidth: width,
                  imageHeight: height,
                  markers: [],
                  showGis: showGis,
                  carrierInfo: {
                    avatar: carrierRes.avatar,
                    frequency: carrierRes.frequency,
                    inDeliveryText: carrierRes.inDeliveryText,
                    nameText: carrierRes.nameText,
                    successText: carrierRes.successText,
                    tel: carrierRes.tel,
                    distance: distance,
                    orderId: orderId || '',
                    tenantId: Number(tenantInfo.tenantId) || 1,
                    storeId: storeId,
                    status: state,
                  },
                },
                () => {
                  ctx.clearRect(0, 0, 750, height);
                  ctx.drawImage(imageRes.path, 0, 0, width, height);
                  ctx.rotate(0);
                  ctx.moveTo(0, 0);
                  ctx.beginPath();
                  ctx.setFillStyle('white');
                  ctx.fillText(discountText, boxWidth / 3 + 13, 33);
                  ctx.draw(
                    true,
                    setTimeout(() => {
                      wx.canvasToTempFilePath({
                        canvasId: 'myDetailCanvas',
                        success: res1 => {
                          var tempFilePath = res1 && res1.tempFilePath;
                          let point = [];
                          point =
                            state !== 9
                              ? [
                                  {
                                    latitude: shopInfoExt && shopInfoExt.lat,
                                    longitude: shopInfoExt && shopInfoExt.lon,
                                    iconPath:
                                      'https://m.360buyimg.com/img/jfs/t1/115914/11/3256/5745/5ea78db5Edebb8825/30cd6a3d6773d9d9.png',
                                    width: '58rpx',
                                    height: '74rpx',
                                    type: 'shop',
                                    anchor: { x: 0.5, y: 1 },
                                  },
                                  {
                                    latitude:
                                      orderUserAddressWeb &&
                                      orderUserAddressWeb.lat,
                                    longitude:
                                      orderUserAddressWeb &&
                                      orderUserAddressWeb.lng,
                                    iconPath:
                                      'https://m.360buyimg.com/img/jfs/t1/107478/35/14185/6304/5ea544ccE35fa24fd/9d45a88d751fbc59.png',
                                    width: '66rpx',
                                    height: '80rpx',
                                    type: 'address',
                                    anchor: { x: 0.5, y: 1 },
                                  },
                                  {
                                    latitude: carrierRes && carrierRes.lat,
                                    longitude: carrierRes && carrierRes.lon,
                                    iconPath: tempFilePath,
                                    width: '280rpx',
                                    height: '80rpx',
                                    type: 'carrier',
                                    anchor: { x: 0.15, y: 1 },
                                  },
                                ]
                              : [
                                  {
                                    latitude: shopInfoExt && shopInfoExt.lat,
                                    longitude: shopInfoExt && shopInfoExt.lon,
                                    iconPath:
                                      'https://m.360buyimg.com/img/jfs/t1/115914/11/3256/5745/5ea78db5Edebb8825/30cd6a3d6773d9d9.png',
                                    width: '58rpx',
                                    height: '74rpx',
                                    type: 'shop',
                                    anchor: { x: 0.5, y: 1 },
                                  },
                                  {
                                    latitude:
                                      orderUserAddressWeb &&
                                      orderUserAddressWeb.lat,
                                    longitude:
                                      orderUserAddressWeb &&
                                      orderUserAddressWeb.lng,
                                    iconPath:
                                      'https://m.360buyimg.com/img/jfs/t1/127792/24/328/8455/5eb4d13eE46e8638a/2a93c7e83bbbd4d3.png',
                                    width: '160rpx',
                                    height: '70rpx',
                                    type: 'address',
                                    anchor: { x: 0.25, y: 1 },
                                  },
                                ];
                          _this.mapCtx = wx.createMapContext('logisticsMap');
                          _this.setState(
                            {
                              markers: point,
                            },
                            () => {
                              _this.mapCtx.includePoints({
                                padding: [60, 70, 60, 70],
                                points: point,
                                success: () => {
                                  _this.mapCtx.getScale({
                                    success: getScale => {
                                      _this.setState({
                                        scale: getScale.scale,
                                      });
                                    },
                                  });
                                },
                              });
                            }
                          );
                        },
                      });
                    }, 1000)
                  );
                }
              );
            },
          });
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        },
      });
    });
  }

  // 去地图
  toOrderMap(e) {
    //设置埋点
    logClick({
      event: e, //必填，点击事件event
      eid: `7FRESH_APP_6_1568944564798|33`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/order-detail/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    Taro.setStorageSync('mapInfo', {
      markers: this.state.markers,
      carrierInfo: this.state.carrierInfo,
      scale: this.state.scale || '',
    });
    Taro.navigateTo({
      url: `/pages/orderDetailMap/index`,
    });
  }

  //查看地图
  goToMap = e => {
    //设置埋点
    logClick({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1551092070962|59`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/order-detail/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    const { orderInfo } = this.state;
    let lat = '';
    let lon = '';
    let siteName = '';
    let address = '';
    if (orderInfo && orderInfo.selfTakeAddressInfo) {
      const selfTakeAddressInfo = orderInfo.selfTakeAddressInfo;
      if (selfTakeAddressInfo) {
        if (selfTakeAddressInfo.lat) {
          lat = parseFloat(selfTakeAddressInfo.lat);
        }
        if (selfTakeAddressInfo.lng) {
          lon = parseFloat(selfTakeAddressInfo.lng);
        }
        if (selfTakeAddressInfo.siteName) {
          siteName = selfTakeAddressInfo.siteName;
        }
        if (selfTakeAddressInfo.address) {
          address = selfTakeAddressInfo.address;
        }
      }
    }
    wx.openLocation({
      latitude: lat,
      longitude: lon,
      scale: 18,
      address: address,
      name: siteName,
    });
  };

  // 自提弹框里打电话
  onCallPhone = str => {
    const { selfMention, orderInfo } = this.state;
    const { selfTakeAddressInfo } = orderInfo;
    if (str === 'self') {
      Taro.makePhoneCall({
        phoneNumber: selfTakeAddressInfo.siteMobile,
      });
    } else {
      Taro.makePhoneCall({
        phoneNumber: selfMention.siteMobile,
      });
    }
  };

  onCloseAll = () => {
    this.setState({
      isShowMask: false,
      isShowQrcode: false,
      isShowAfsTypeList: false,
      codeFlag: false,
      periodFlag: false,
      isShowCancelModal: false,
      finishFlag: false,
      isShowCall: false,
    });
  };

  // 关闭核销弹框
  onCancel = () => {
    this.setState({
      finishFlag: false,
      isShowCall: false,
    });
  };

  // 七鲜卡跳校验页
  goCardCheck = () => {
    logClick('7FERSH_APP_8_1590127250769|45', '', '', '');
    let { orderInfo } = this.state;
    let { orderFreshCardInfoWeb } = orderInfo;
    let authType = 1,
      mobile = '',
      mobileMask = '';
    if (!!orderFreshCardInfoWeb) {
      authType = orderFreshCardInfoWeb.authType;
      mobile = orderFreshCardInfoWeb.mobile;
      mobileMask = orderFreshCardInfoWeb.mobileMask;
    }
    const url = `${
      app.h5RequestHost
    }/giftCards/cardCheck?authType=${authType}&orderId=${encodeURIComponent(
      orderInfo.orderId
    )}&mobile=${encodeURIComponent(mobile)}&mobileMask=${mobileMask}`;
    utils.navigateToH5({
      page: url,
    });
  };

  // 获取拼团分享数据
  getDetailShare() {
    const { groupInfoWeb } = this.state.orderInfo;
    if (groupInfoWeb) {
      getGroupShareService({
        activityId: groupInfoWeb.activityId,
        storeId: groupInfoWeb.storeId,
        skuId: groupInfoWeb.skuId,
        groupId: groupInfoWeb.groupId,
      }).then(res => {
        wx.showShareMenu();
        this.setState({
          shareInfo: res,
        });
      });
    }
  }

  // 分享
  onShareAppMessage() {
    const { shareInfo, orderInfo } = this.state;
    const { groupInfoWeb } = this.state.orderInfo;
    const { needCount } = groupInfoWeb;
    const skuInfoWebList =
      orderInfo.orderSkuGroupWebList[0].orderSkuInfoWebList;
    const skuName = skuInfoWebList && skuInfoWebList[0].skuName;
    const jdPrice = skuInfoWebList && skuInfoWebList[0].jdPrice;
    const marketPrice = skuInfoWebList && skuInfoWebList[0].marketPrice;
    const title = `【还差${needCount}人成团】拼团价${jdPrice}元 原价${marketPrice}元 ${skuName}`;
    if (shareInfo) {
      return {
        title: title,
        desc: '',
        imageUrl: shareInfo.appletImageUrl,
        path: shareInfo.appletUrl,
      };
    }
  }

  // 查看定期送配送明细
  goToPeriodDeliveryInfo = () => {
    let orderId = this.state.orderInfo && this.state.orderInfo.orderId;
    logClick('7FRESH_H5_2_201803184|14', '', '', '');
    utils.navigateToH5({
      page: `${app.h5RequestHost}/deliveryDetail.html?orderId=${orderId}&from=miniapp`,
    });
  };

  render() {
    const {
      orderInfo,
      // isShowRefundPopup,
      tenantShopInfo,
      switchTenantFlag,
      delOrderFlag,
      isShowCancelModal,
      isShowQrcode,
      selfMention,
      isLoading,
      periodOrder,
      isShowCall,
      tipInfo,
      afsTypeList,
      isShowAfsTypeList,
      isAll,
      // remainingPayTime,
      minute,
      seconds,
      finishFlag,
      isShowMask,
      priceTipsModalShow,
      priceTipsModalInfo,
      freshActivated,
      recommendList,
      showCart,
      showCartData,
      codeFlag,
      codePicture,
      qrCodeText,
      scrollTop,
      scrollHeight,
      pageTop,
      markers,
      imageWidth,
      imageHeight,
    } = this.state;
    const {
      orderUserAddressWeb,
      selfTakeAddressInfo,
      orderSkuGroupWebList,
      orderInvoiceInfoWeb,
      orderMoneyInfoWeb,
      orderDetailFlagInfoWeb,
      groupInfoWeb,
      commonTabMoneyInfoList,
      orderFreshCardInfoWeb,
      giftCard,
      showGis,
      tenantId,
    } = orderInfo;

    const reg = /(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?|1[34578]\d{9}/; //匹配手机号与国内座机号
    const telPhone =
      orderInfo &&
      orderInfo.lastUmsMessage &&
      orderInfo.lastUmsMessage.match(reg);
    let string_content = orderInfo && orderInfo.lastUmsMessage,
      phone = '';
    if (telPhone) {
      phone = telPhone[0];
      string_content = string_content.split(phone).filter(val => {
        return !(!val || val === '');
      });
    }
    return (
      <View className='my-order-detail'>
        {isShowMask && (
          <View className='my-mask' onClick={this.onCloseAll}></View>
        )}

        {/* 主题内容 */}
        {JSON.stringify(orderInfo) !== '{}' && (
          <ScrollView
            scrollY
            scrollWithAnimation='true'
            style={{
              height: scrollHeight,
            }}
            onScrolltolower={this.scrollToLowerRecommoned}
            onScroll={this.onScroll}
            scroll-top={pageTop}
          >
            {/* state === 0:已取消 1:需付款 2:需付款 5:待配送 8:配送中 */}
            <View
              className={orderInfo.state === 0 ? 'res-box gray' : 'res-box'}
              onClick={this.goOrderLogistics}
            >
              <View className='first'>
                <View className='order-detail-title'>
                  <Text>
                    <Text className={this.getIconByState(orderInfo.state)} />
                    {orderInfo.stateTitle}
                  </Text>
                  {/* {orderInfo.remainingPayTime > 0 && remainingPayTime && (
                    <Text className='remaining-pay-time'>
                      剩余时间：{remainingPayTime}
                    </Text>
                  )} */}
                </View>

                <View className='description'>
                  {orderInfo.remainingPayTime > 0 && orderInfo.state === 2 ? (
                    <View className='remaining-pay-time'>
                      剩余<View className='block'>{minute}</View>
                      <Text>:</Text>
                      <View className='block'>{seconds}</View>
                      ，请尽快支付，超时将取消订单~
                    </View>
                  ) : (
                    <View>
                      {/* 物流信息中手机号可直接拨打 */}
                      {telPhone ? (
                        <View className='desc'>
                          <Text>{string_content[0]}</Text>
                          <Text href={`tel: ${phone}`} className='tel_phone'>
                            {phone}
                          </Text>
                          <Text>{string_content[1]}</Text>
                        </View>
                      ) : (
                        <View className='desc'>{string_content}</View>
                      )}
                    </View>
                  )}
                </View>
              </View>
              <View className='arrow'></View>
            </View>

            <View style={{ position: 'fixed', top: '4999px' }}>
              <Canvas
                style={{ width: imageWidth + 'px', height: imageHeight + 'px' }}
                canvas-id='myDetailCanvas'
              ></Canvas>
            </View>
            {showGis && (
              <Map
                id='logisticsMap'
                class='logistics-map'
                markers={markers}
                scale={10}
                onClick={this.toOrderMap.bind(this)}
              ></Map>
            )}

            {orderDetailFlagInfoWeb &&
              orderDetailFlagInfoWeb.selfTake &&
              selfTakeAddressInfo && (
                <View className='self-mention-box'>
                  <View className='mention-fir'>
                    <View className='mention-address'>
                      自提点：{orderInfo.shopName}
                    </View>
                    <View className='mention-right'>
                      <View onClick={this.onCallPhone.bind(this, 'self')}>
                        <View className='mention-phone' />
                      </View>
                      {selfTakeAddressInfo.showSelfTakeCodeButton && (
                        <View>
                          <View className='h-line'>|</View>
                          <View
                            className='mention-btn'
                            onClick={this.getSelfTakeCodeInfo}
                          >
                            提货码
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className='mention-txt'>
                    营业时间：{selfTakeAddressInfo.openTime}
                  </View>
                  <View className='mention-txt'>
                    {selfTakeAddressInfo.address}
                  </View>
                  <View className='mention-map' onClick={this.goToMap}>
                    查看地图
                  </View>
                  <View className='mention-line bbl'>
                    <View>自提时间</View>
                    <View>{selfTakeAddressInfo.selfTakeTime}</View>
                  </View>
                  <View
                    className={`mention-line ${
                      orderUserAddressWeb && orderUserAddressWeb.realName
                        ? 'bbl'
                        : ''
                    }`}
                  >
                    <View>预留手机</View>
                    <View>{selfTakeAddressInfo.mobile}</View>
                  </View>
                  {orderUserAddressWeb && orderUserAddressWeb.realName && (
                    <View>
                      <View className='mention-line bbl'>
                        <View>证件姓名</View>
                        <View>
                          {orderUserAddressWeb && orderUserAddressWeb.realName}
                        </View>
                      </View>
                      <View className='mention-line'>
                        <View>身份证号</View>
                        <View>
                          {orderUserAddressWeb &&
                            orderUserAddressWeb.idNumberMask}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

            {/* 定期送 */}
            {orderDetailFlagInfoWeb &&
              orderDetailFlagInfoWeb.periodOrder &&
              periodOrder && (
                <View className='period-box'>
                  <View className='period-title'>
                    <View className='period-name'>
                      <View className='period-icon'></View>
                      {periodOrder.periodTitle}
                    </View>
                    <View
                      className='period-edit'
                      style={{ color: theme.color }}
                      onClick={this.goToPeriodDeliveryInfo}
                    >
                      配送明细
                      <Text className='period-arrow' />
                    </View>
                  </View>
                  <View className='period-con'>
                    <View>{periodOrder.showPeriodInfo}</View>
                    <View>{periodOrder.showPeriodSendData}</View>
                    <View>{periodOrder.showPeriodSendTime}</View>
                  </View>
                  {orderDetailFlagInfoWeb.canShowPeriodInfo && (
                    <View
                      className='period-bottom'
                      onClick={this.goToPeriodStageInfo}
                    >
                      <Text className='period-detail'>
                        分期详情
                        <Text className='period-bottom-arrow' />
                      </Text>
                    </View>
                  )}
                </View>
              )}
            {/* 地址 */}
            {orderUserAddressWeb &&
              orderUserAddressWeb.show &&
              !selfTakeAddressInfo &&
              orderDetailFlagInfoWeb &&
              !orderDetailFlagInfoWeb.periodOrder &&
              !giftCard && (
                <View className='addr-info-parent'>
                  <View className='addr-info'>
                    <View className='addr-info-icon'></View>
                    <View className='info'>
                      <View className='name'>{orderUserAddressWeb.name}</View>
                      {orderUserAddressWeb.mobileMask}
                    </View>
                    <View className='addr'>{orderUserAddressWeb.address}</View>
                  </View>
                  <View className='page-delivery-box'></View>
                </View>
              )}

            {/* 售后 */}
            {orderDetailFlagInfoWeb && orderDetailFlagInfoWeb.afsOrder && (
              <View className='after-sales' onClick={this.goAfterSaleDetail}>
                <View className='after-sale-icon'></View>
                售后进度：已提交服务单，待客服审核
                <View className='arrow'></View>
              </View>
            )}

            {/* 拼团 status 1-拼团成功 2-拼团失败 3-拼团进行中  */}
            {orderDetailFlagInfoWeb &&
              orderDetailFlagInfoWeb.group &&
              groupInfoWeb && (
                <View className='fight-group'>
                  <View className='fight-group-title'>
                    {groupInfoWeb.status === 1 && <View>拼团成功</View>}
                    {groupInfoWeb.status === 2 && <View>拼团失败</View>}
                    {groupInfoWeb.status === 3 && (
                      <View className='fight-group-red'>
                        {orderInfo.state === 2
                          ? orderDetailFlagInfoWeb.group &&
                            orderDetailFlagInfoWeb.group.grouponMemberInfos &&
                            orderDetailFlagInfoWeb.group.grouponMemberInfos
                              .length > 1
                            ? '正在参团'
                            : '正在开团'
                          : '拼团中'}
                        {orderInfo.state === 2 && (
                          <View className='fight-group-tip'>
                            立即支付,即可开团成功
                          </View>
                        )}
                      </View>
                    )}

                    {(groupInfoWeb.status === 2 || groupInfoWeb.status === 3) &&
                      orderInfo.state !== 2 && (
                        <View>
                          还差
                          <Text className='fight-group-red'>
                            {groupInfoWeb.needCount}
                          </Text>
                          人成团
                        </View>
                      )}
                    {groupInfoWeb.status === 1 && (
                      <View className='fight-group-status' />
                    )}
                  </View>
                  <View
                    className='fight-group-list'
                    style={{
                      justifyContent:
                        groupInfoWeb &&
                        groupInfoWeb.grouponMemberInfos &&
                        groupInfoWeb.grouponMemberInfos.length > 4
                          ? ''
                          : 'center',
                    }}
                  >
                    {groupInfoWeb.grouponMemberInfos &&
                      groupInfoWeb.grouponMemberInfos.map((info, index) => {
                        return (
                          <View className='fight-group-info' key={index}>
                            <Image
                              alt='7fresh'
                              className='fight-user-img'
                              src={
                                info.isUnkonw
                                  ? 'https://m.360buyimg.com/img/jfs/t1/125145/13/8634/5895/5f28bcb7E426b0ff4/85cfeb5679c94a89.png'
                                  : filterImg(info.avatar, 'user', 'square')
                              }
                              mode='aspectFit'
                              lazyLoad
                            />
                            {!info.isUnkonw && (
                              <View
                                className={
                                  info.self
                                    ? 'fight-group-info-icon'
                                    : 'fight-group-info-icon team'
                                }
                              >
                                {orderInfo.state === 2
                                  ? '待支付'
                                  : info.memberType === 1
                                  ? '团长'
                                  : '沙发'}
                              </View>
                            )}
                          </View>
                        );
                      })}
                  </View>

                  {orderInfo &&
                    orderInfo.state !== 2 &&
                    groupInfoWeb.status === 3 && (
                      <Button className='fight-group-btn' openType='share'>
                        喊好友参团
                      </Button>
                    )}
                </View>
              )}
            {/* 商品信息 */}
            {orderSkuGroupWebList && orderSkuGroupWebList.length > 0 && (
              <View>
                {orderSkuGroupWebList.map((item, index) => {
                  return (
                    <View className='wrap-box' key={index}>
                      {item.showDeliveryTime && (
                        <View className='time-box'>
                          <View className='time-inner-box'>
                            <View className='time-box-icon'></View>
                            <View className='time-tit'>预计收货时段</View>
                            <View className='time'>
                              {item.showDeliveryTime}
                            </View>
                          </View>
                        </View>
                      )}
                      <View className='store-box'>
                        <View className='store-box-icon'></View>
                        <View className='store-tit'>{orderInfo.shopName}</View>
                        <View className='store-addr'>
                          {orderInfo.shopAddress}
                        </View>
                      </View>
                      {item.orderSkuInfoWebList &&
                        item.orderSkuInfoWebList.length > 0 && (
                          <View className='goods-box'>
                            {/* 线上七鲜卡已绑定图标 */}
                            {orderFreshCardInfoWeb &&
                              orderFreshCardInfoWeb.allBind && (
                                <View className='freshActivated'>
                                  <Image
                                    src={freshActivated}
                                    className='img'
                                    mode='aspectFit'
                                    lazyLoad
                                  />
                                </View>
                              )}
                            {item.orderSkuInfoWebList.map((info, i) => {
                              return (
                                !(
                                  !isAll &&
                                  item.orderSkuInfoWebList &&
                                  item.orderSkuInfoWebList.length > 4 &&
                                  i > 3
                                ) && (
                                  <View
                                    className={info.gift ? 'item gift' : 'item'}
                                    key={i}
                                    onClick={this.goDetail.bind(this, info)}
                                  >
                                    {info.gift && (
                                      <View className='img-icon'>
                                        {/* <ProductTag
                                          text={'赠品'}
                                          fontFamily={'PingFangSC-Medium'}
                                        /> */}
                                      </View>
                                    )}
                                    <Image
                                      className='img'
                                      src={info.imageUrl}
                                      mode='aspectFit'
                                      lazyLoad
                                    />
                                    <View className='info'>
                                      <View className='info-tit'>
                                        <View className='info-txt'>
                                          {info.skuName}
                                        </View>
                                      </View>
                                      <View className='info-tit'>
                                        <View className='num'>
                                          {info.saleSpecDesc
                                            ? `规格：${info.saleSpecDesc}`
                                            : ''}
                                        </View>
                                        <View className='count'>
                                          {info.buyNumDesc}
                                        </View>
                                      </View>
                                      {info.tasteInfo && (
                                        <View className='tasteInfo'>
                                          {info.tasteInfo}
                                        </View>
                                      )}
                                      {/* <View className='service-img'>
                                        {info.easyBuyWare &&
                                          info.easyBuy.easyBuyImageUrl && (
                                            <Image
                                              className='easy-img'
                                              src={filterImg(
                                                info.easyBuy.easyBuyImageUrl
                                              )}
                                              mode='aspectFit'
                                              lazyLoad
                                            />
                                          )}
                                      </View> */}
                                      {info &&
                                        info.easyBuyWare &&
                                        info.easyBuy && (
                                          <View className='service-easy-cont'>
                                            {info.easyBuy.easyBuyTypes &&
                                              info.easyBuy.easyBuyTypes.length >
                                                0 &&
                                              info.easyBuy.easyBuyTypes.map(
                                                (data, m) => {
                                                  return (
                                                    <View
                                                      className='easy-icon'
                                                      key={`easy-${m}`}
                                                    >
                                                      {data}
                                                    </View>
                                                  );
                                                }
                                              )}
                                          </View>
                                        )}
                                      {!info.gift && (
                                        <View className='price'>
                                          ￥{info.jdPrice}
                                          <Text className='price-unit'>
                                            {info.buyUnit}
                                          </Text>
                                        </View>
                                      )}
                                      {(info.afsBtnStatus === 1 ||
                                        info.afsBtnStatus === 2) && (
                                        <View
                                          className={
                                            info.afsBtnStatus === 1
                                              ? 'info-btn'
                                              : 'info-btn gray'
                                          }
                                          onClick={this.applyAfterSales.bind(
                                            this,
                                            info
                                          )}
                                        >
                                          申请售后
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                )
                              );
                            })}
                          </View>
                        )}

                      {item.orderSkuInfoWebList.length > 4 && (
                        <View className='more'>
                          共{item.orderSkuInfoWebList.length}种
                          <Text
                            className='more-btn'
                            style={{ color: theme.color }}
                            onClick={this.isShowAllGoods}
                          >
                            {isAll ? '收起' : '查看全部'}
                            <Text
                              className={
                                isAll ? 'more-btn-icon up' : 'more-btn-icon'
                              }
                            />
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* 七鲜卡去绑卡 */}
            {this.showFreshBind() && (
              <View
                className='fresh-bind-card'
                onClick={this.goCardCheck.bind(this)}
              >
                <View className='card-num'>
                  {`${
                    this.showFreshBind()
                      ? orderFreshCardInfoWeb.waitBindCardCount
                      : 0
                  }张卡待绑定`}
                </View>
                <View className='go-bind-card'>
                  <View className='go-bind-card-text'>去绑卡/获取卡密码</View>
                  <View className='go-bind-card-icon' />
                </View>
              </View>
            )}

            {/* 价格信息 */}
            <View className='order-info'>
              <View className='line'>
                <View className='order-info-tit'>订单编号：</View>
                <View className='order-info-txt'>
                  {orderInfo.orderId}
                  <View
                    className='copy'
                    onClick={this.handleCopy.bind(this, orderInfo.orderId)}
                  >
                    复制
                  </View>
                </View>
              </View>
              <View className='line'>
                <View className='order-info-tit'>下单时间：</View>
                <View className='order-info-txt'>
                  {orderInfo.showOrderCreateTime}
                </View>
              </View>
              <View className='line'>
                <View className='order-info-tit'>支付方式：</View>
                <View className='order-info-txt'>{orderInfo.paymentType}</View>
              </View>
              {orderInfo.remark && (
                <View className='line'>
                  <View className='order-info-tit'>订单备注：</View>
                  <View className='order-info-txt'>{orderInfo.remark}</View>
                </View>
              )}
              {/* 餐饮备注等 */}
              {orderInfo.optionInfos &&
                orderInfo.optionInfos.length > 0 &&
                orderInfo.optionInfos.map((item, i) => {
                  return (
                    <View className='line' key={i.toString()}>
                      <View className='order-info-tit'>{item.title}：</View>
                      <View className='order-info-txt'>
                        {item.selectedText}
                      </View>
                    </View>
                  );
                })}
              {orderInvoiceInfoWeb && orderInvoiceInfoWeb.uniqueTypeName && (
                 <View
                  className='line'
                  style={{
                    paddingTop: px2vw(30),
                    marginBottom: 0,
                    borderTop: '1px solid rgba(194, 194, 194, 0.1)',
                  }}
                >
                  <View className='order-info-tit'>发票类型：</View>
                  <View className='order-info-txt'>
                    {orderInvoiceInfoWeb.uniqueTypeName}
                  </View>
                  {orderInvoiceInfoWeb.isShow &&
                    (orderInvoiceInfoWeb.status === 2 ||
                      orderInvoiceInfoWeb.status === 3) && (
                      <Text className='line-btn' onClick={this.goInvoice}>
                        {orderInvoiceInfoWeb.statusName}
                      </Text>
                    )}
                </View>
              )}

              {orderInvoiceInfoWeb && (
                <View>
                  {orderInvoiceInfoWeb.headTypeName && (
                    <View className='line'>
                      <View className='order-info-tit'>抬头类型：</View>
                      <View className='order-info-txt'>
                        {orderInvoiceInfoWeb.headTypeName}
                      </View>
                    </View>
                  )}
                  {orderInvoiceInfoWeb.headTypeName && (
                    <View className='line'>
                      <View className='order-info-tit'>发票内容：</View>
                      <View className='order-info-txt'>
                        {orderInvoiceInfoWeb.contentTypeName}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
            {commonTabMoneyInfoList && commonTabMoneyInfoList.length > 0 && (
              <View className='good-price'>
                {commonTabMoneyInfoList.map((info, i) => {
                  return (
                    <View className='line' key={i.toString()}>
                      <View className='good-price-tit'>
                        {info.name}
                        {info.type > 0 && (
                          <Text
                            className='txt-icon'
                            onClick={this.openPriceTipsModal.bind(this, info)}
                          >
                            ?
                          </Text>
                        )}
                      </View>
                      <View className='good-price-txt'>{info.priceStr}</View>
                    </View>
                  );
                })}
              </View>
            )}
            {orderMoneyInfoWeb && (
              <View className='bottom-price'>
                <View className='reality'>
                  <View className='payment'>
                    实付款：
                    <Text className='reality-price'>
                      ￥{orderMoneyInfoWeb.shouldPrice}
                    </Text>
                  </View>
                  {orderMoneyInfoWeb.refundAmout && (
                    <View className='refund'>
                      <View className='refund-tit'>
                        <Text
                          className='tips'
                          onClick={this.showRefundPopup}
                        ></Text>
                        退款：
                      </View>
                      <Text className='refund-price'>
                        ￥{orderMoneyInfoWeb.refundAmout}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* 为你推荐 */}
            {recommendList && recommendList.length > 0 && (
              <View>
                <View className='hot-items-list'>
                  <Image
                    src='https://m.360buyimg.com/img/jfs/t1/129307/20/15093/10453/5f89478cE655974fd/b0000f595421dd25.png'
                    className='recommend-title-pic-always'
                    mode='aspectFit'
                    lazyLoad
                  />
                  <FloorProductGroup
                    data={{
                      items: recommendList,
                      type: 2,
                      backGroudColor: 'transparent',
                      from: 'detail',
                      tenantId: tenantId,
                    }}
                    onGoDetail={this.goDetailRecommend.bind(this)}
                    onAddCart={this.onAddCart.bind(this)}
                  />
                </View>
                {/* 底部LOGO图标 */}
                {recommendList &&
                  recommendList.length !== 0 &&
                  this.maxPage === 0 && (
                    <View className='bottom-logo'>
                      <FreshBottomLogo />
                    </View>
                  )}
              </View>
            )}

            <View className='mb100'></View>
            {orderInfo.stateButtons && orderInfo.stateButtons.length > 0 && (
              <View className='bottom-box'>
                {orderInfo.stateButtons.map((info, i) => {
                  return (
                    <View key={i}>
                      {info.buttonId !== 5 &&
                        info.buttonId !== 10 &&
                        info.buttonId !== 11 &&
                        info.buttonId !== 12 &&
                        info.buttonId !== 14 &&
                        info.buttonId !== 19 && (
                          <View
                            className='bottom-box-btn'
                            key={i.toString()}
                            onClick={this.btnClick.bind(this, info.buttonId)}
                          >
                            {info.buttonText}
                          </View>
                        )}
                      {info.buttonId === 5 && (
                        <View
                          className='my-green-order-btn'
                          style={{
                            width: !info.remainingPayTime
                              ? px2vw(184)
                              : px2vw(110),
                          }}
                          onClick={this.btnClick.bind(this, info.buttonId)}
                        >
                          {info.buttonText}
                          {minute}
                          {minute ? ':' : ''}
                          {seconds}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
            {/* 不知道list和desc从哪里拿值 */}
            {/* {isShowRefundPopup && (
              <View className='after-sales-popup'>
                <View className='mask' onClick={this.closeRefundPopup.bind(this)} />
                <View className='container'>
                  <View
                    className='popup-title'
                    style={{
                      color: list && list.length > 0 ? '#898989' : '#252525',
                      fontFamily: 'PingFangSC-Regular'
                    }}
                  >
                    预计退款金额
                    <Text className='close' onClick={this.closeRefundPopup.bind(this)} />
                  </View>
                  {desc && (
                    <View
                      className='desc'
                      dangerouslySetInnerHTML={{
                        __html: desc.replace(/\r\n/g, '<br>')
                      }}
                    />
                  )}
                  {list &&
                    list.map((info, index) => {
                      return <View className='list'>{info}</View>
                    })}
                </View>
              </View>
             )} */}
          </ScrollView>
        )}

        {/* 没有数据的托底页 */}
        {!isLoading && JSON.stringify(orderInfo) === '{}' && (
          <View className='page-empty'>
            <EmptyPage
              type='content'
              EmptyPageTxt='暂无数据'
              showButton={false}
            />
          </View>
        )}

        {/* 切一个门店 */}
        <SwitchAddressModal
          name='当前操作需切换门店至'
          data={tenantShopInfo}
          show={switchTenantFlag}
          onSwitch={this.onSwitch.bind(this)}
          onClose={this.onCloseShop}
        />

        {/* 删除订单弹层 */}
        <AfterSalesModal
          name='确定删除此订单？'
          desc='删除后如有售后问题可联系客服恢复'
          show={delOrderFlag}
          type={1}
          okTxt='确定'
          cancelTxt='取消'
          onConfirm={this.modalOkTxt}
          onClose={this.modalCancelTxt}
        />

        {isShowCancelModal && (
          <CancelOrderModal
            reasons={orderInfo.reasons}
            onHandleIsCancelOrder={this.onHandleIsCancelOrder}
            onCancelOrder={this.onCancelOrder}
          />
        )}

        {/* 申请售后打电话弹层 */}
        {isShowCall && tipInfo && (
          <AfterSalesModal
            name={tipInfo.title}
            desc={tipInfo.content}
            mobile={tipInfo.tenantTel}
            show
            type={1}
            okTxt='拨打电话'
            cancelTxt='取消'
            onConfirm={this.modalCancelTxt}
            onClose={this.modalCancelTxt}
          />
        )}

        {/* 选择售后类型弹层 */}
        {isShowAfsTypeList && afsTypeList && (
          <OrderDetailSelectOptions
            data={afsTypeList}
            onClose={this.onCloseAfsType}
            onSelect={this.onSelectAfsType}
          />
        )}

        {isLoading && (
          <View className='page-loading'>
            <Loading tip='加载中' />
          </View>
        )}

        {/* 确认收货 */}
        <Confirm
          show={finishFlag}
          desc='是否确认收货'
          confirmTxt='确认'
          cancelTxt='取消'
          onConfirm={this.getFinishOrder.bind(this)}
          onCancel={this.onCancel.bind(this)}
        />

        {/* 自提码 */}
        <Code
          show={isShowQrcode}
          codeData={selfMention}
          onClick={this.onCloseModal}
          onCallPhone={this.onCallPhone}
        />

        {/* 置顶 */}
        {scrollTop > 100 && (
          <View className='go-top'>
            <FightGoTop type='top' onClick={this.goTop.bind(this)} />
          </View>
        )}

        {priceTipsModalShow && priceTipsModalInfo && (
          <OrderPriceTipsModal
            data={priceTipsModalInfo}
            onClose={this.openPriceTipsModal}
          />
        )}

        {/* 加车弹框 */}
        <FloorAddCart
          show={showCart}
          data={showCartData}
          onAddCart={this.weightAddCart}
          onClose={this.onCloseCart}
        />
        
        {/* 码弹框 */}
        <InfoModal
          show={codeFlag}
          qrCodeText={qrCodeText}
          img={`data:image/png;base64,${codePicture}`}
          onClose={this.onCloseCode}
        />
      </View>
    );
  }
}
