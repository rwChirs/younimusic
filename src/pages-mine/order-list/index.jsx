import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import {
  getOrderListService,
  getDeleteOrderService,
  getSelfTakeCodeService,
  getBuyAgainService,
  getTenantShopService,
  getOrderFinishOrder,
  getAlwaysEntry,
  getPeriodOrderList,
  getContactTelService,
  getIndexRecommendTabInfo,
  addCart,
  getAfterPayoutApply,
} from '@7fresh/api';
import AES from 'crypto-js/aes';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { logClick, structureLogClick } from '../../utils/common/logReport';
import { exportPoint } from '../../utils/common/exportPoint';
import { px2vw, handlerAddCartResult } from '../../utils/common/utils';
import { theme } from '../../common/theme';
import { saveAddrInfo } from '../../utils/common/getUserStoreInfo';
import utils from '../../pages/login/util';
import OrderSearchBar from '../../components/order-search-bar';
import AlwaysTop from './components/always-top';
import MyOrderList from './components/my-order-list';
import SearchEmpty from './components/search-empty';
import Loading from '../../components/loading';
import Code from './components/code';
import InfoModal from './components/info-modal';
import EmptyPage from '../../components/empty-page';
import FightGoTop from '../../components/go-top';
import Confirm from '../../components/confirm';
import FloorProductGroup from './components/floor-product-group';
import SwitchAddressModal from '../../components/switch-address-modal';
import FloorAddCart from '../../components/floor-add-cart';
import AfterSalesModal from '../order-detail/components/after-sales-modal';
import getOpenId from '../../utils/openId';
import FreshBottomLogo from '../../components/bottom-logo';
import './index.scss';

const app = Taro.getApp().$app;
export default class OrderList extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollHeight: 0,
      pageTop: 0,
      orderListTab: 0,
      pageIndex: 1,
      pageSize: 20,
      totalElements: 0,
      scrollTop: 0,
      list: [],
      //状态边框
      loadFlag: true,
      noneData: false,
      isMiniprogram: false,
      codeFlag: false,
      litterFlag: false, //小液态自提码
      periodFlag: false,
      showCart: false,
      codePicture: '',
      qrCodeText: '',
      tabList: ['全部', '待付款', '待配送', '待收货'],
      chooseData: {}, //所选对象
      codeData: {},
      tenantShopInfo: {},
      lbsData: Taro.getStorageSync('addressInfo') || {},
      tenantId:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').tenantId) ||
        1,
      storeId:
        Taro.getStorageSync('addressInfo') &&
        Taro.getStorageSync('addressInfo').storeId,
      switchTenantFlag: false,
      //搜索相关字段
      keyWord: '',
      searchBtnTxt: '搜索',
      defaultKeyWord: '商品名称/订单号',
      isShowSearchBtn: false,
      isShowMask: false,
      isSearchPage: false, //是否是搜索页
      finishFlag: false,
      finishInfo: {},
      noneList: false,
      mobile: '',
      contactServiceUrlType: 0,
      isShowAlwaysBuy: false,
      abTest: '',
      frequentPurchaseUrlList: '',
      recommendList: [],
      isBottomLoad: false,
      loadPicture:
        'https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png',
      frequentPurchaseUrlList: '',
      deleteData: {},
    };
  }

  page = 1;
  maxPage = 0;
  isReachBottom = false;

  config = {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#fff',
  };

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.hideShareMenu();
    const options = getCurrentInstance().router.params;
    this.getMobile();
    this.setState(
      {
        keyWord: options && options.keyWord || '',
        isSearchPage: options && options.isSearchPage ? true : false,
      },
      () => {
        Taro.getSystemInfo({
          success: res => {
            const height = !this.state.isSearchPage
              ? res.windowHeight - 105
              : res.windowHeight - 60;
            this.setState({
              scrollHeight: height + 'px',
            });
          },
        });
      }
    );

    if (options && options.status) {
      this.setState({
        orderListTab: options.status,
      });
    }
  }

  componentDidMount() {
    //常购清单
    this.setAlwaysEntry();
  }

  componentDidShow() {
    //页面初始化
    this.setState(
      {
        list: [],
      },
      () => {
        this.loadList();
      }
    );
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  //页面初始化
  loadList(i, isSearch) {
    let pageIndex = i ? this.state.pageIndex : 1;
    let { orderListTab, pageSize, keyWord } = this.state;
    getOrderListService({
      status: orderListTab,
      page: pageIndex,
      pageSize: pageSize,
      keyWords: keyWord,
    })
      .then(res => {
        this.setState(
          {
            list:
              res.pageList && !isSearch
                ? this.state.list.concat(res.pageList)
                : isSearch
                ? res.pageList
                : this.state.list,
            totalElements: res.totalCount,
            loadFlag: false,
          },
          () => {
            if (res.totalCount === 0) {
              //获取为你推荐数据
              this.getGoodsRecommend();
            }
            let orderIds = [];
            for (let m in this.state.list) {
              if (this.state.list[m].periodOrder) {
                orderIds.push(this.state.list[m].orderId);
              }
            }
            // 每组列表在查询是否有定期送数据
            this.onPeriodOrder(orderIds);

            if (
              this.state.list &&
              this.state.list.length >= this.state.totalElements
            ) {
              this.setState({
                noneData: true,
              });
            }
            if (this.state.list === null || this.state.list.length === 0) {
              setTimeout(() => {
                this.setState({
                  noneList: true,
                });
              }, 80);
            }
          }
        );
      })
      .catch(err => {
        if (err.code === '3') {
          //登录
          utils.gotoLogin('/pages-mine/order-list/index?status=0', 'redirectTo');
          return;
        } else {
          this.setState({
            list: [],
            loadFlag: false,
            noneList: false,
          });
          return;
        }
      });
  }

  //滑动到底部触发
  scrollToLower = () => {
    if (this.state.noneData) return;
    if (this.state.list && this.state.list.length < this.state.totalElements) {
      this.setState(
        {
          pageIndex: this.state.pageIndex + 1,
        },
        () => {
          this.loadList(this.state.pageIndex);
        }
      );
    } else {
      this.setState({
        noneData: true,
      });
    }
  };

  // 为你推荐分页
  scrollToLowerRecommoned = () => {
    if (
      this.state.totalElements === 0 &&
      this.page < this.maxPage &&
      this.maxPage !== 0
    ) {
      this.setState(
        {
          isBottomLoad: true,
        },
        () => {
          this.page++;
          this.getGoodsRecommend();
        }
      );
    }
  };

  //定期送
  onPeriodOrder(orderIds) {
    if (orderIds.length > 0) {
      getPeriodOrderList({ orderIds: orderIds })
        .then(res => {
          if (
            res &&
            res.success &&
            res.periodOrderList &&
            res.periodOrderList.length > 0
          ) {
            let json = this.state.list;
            for (let i in this.state.list) {
              for (let j in res.periodOrderList) {
                if (
                  this.state.list[i].orderId === res.periodOrderList[j].orderId
                ) {
                  json[i] = {
                    ...json[i],
                    periodList: res.periodOrderList[j],
                  };
                }
              }
            }
            this.setState({
              list: json,
            });
          }
        })
        .catch(err => {
          console.log('定期送错误日志', err);
        });
    }
  }

  //为你推荐
  getGoodsRecommend() {
    const params = {
      page: this.page || 1,
      pageSize: 100,
      tabType: 4,
    };
    getIndexRecommendTabInfo(params).then(data => {
      if (data && data.totalPage > 0) {
        this.setState(
          {
            recommendList: data.pageList
              ? this.state.recommendList.concat(data.pageList)
              : [],
            isBottomLoad: false,
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
        this.setState({ isBottomLoad: false });
      }
    });
  }

  //请求在线客服是跳转链接还是打电话
  /*
   * 请求在线客服是跳转链接还是打电话
   * @param contactServiceUrlType：代表联系客服的方式，拨打电话（6） or在线客服
   * contactServiceUrl：拨打电话的电话号码or在线客服的页面地址
   */
  getMobile() {
    getContactTelService()
      .then(res => {
        if (res && res.success) {
          this.setState({
            mobile: Number(res.urlType) === 6 ? res.toUrl : '',
            contactServiceUrlType: Number(res.urlType),
          });
        }
      })
      .catch(err => {
        console.error('获取baseConfig-错误', err);
      });
  }

  // 判断常购清单入口是否展示
  setAlwaysEntry() {
    const params = {
      data: {
        source: 0,
      },
    };
    getAlwaysEntry(params).then(res => {
      if (res && res.success && res.showFlag) {
        this.setState({
          isShowAlwaysBuy: true,
          abTest: res.buriedExplabel,
          frequentPurchaseUrlList: res.frequentPurchaseUrlList,
        });
      }
    });
  }

  //跳转常购清单
  onGoAlways() {
    const { abTest, orderListTab } = this.state;
    structureLogClick({
      eventId: 'onGoPurchaseEntrance',
      jsonParam: {
        pageId: 'orderListPage',
        pageName: '订单列表页',
        firstModuleId: orderListTab,
        firstModuleName:
          orderListTab === 0
            ? '全部'
            : orderListTab === 1
            ? '待付款'
            : orderListTab === 2
            ? '待配送'
            : '待收货',
        secondModuleId: 'regularPurchaseEntrance',
        secondModuleName: '常购清单入口',
      },
      extColumns: {
        touchstone_expids: abTest,
      },
    });
    utils.navigateToH5({
      page: `${app.h5RequestHost}/alwaysBuy?request_par=${abTest}`,
    });
  }

  // 键盘回车事件
  searchKeyUp(e) {
    //设置埋点
    logClick({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1578553760939|15`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/order-list/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    this.clickSearchBtn();
  }

  // 搜索框选中||输入数据
  changeWord = e => {
    let keyWord = e.target.value.trim();
    this.setState({ keyWord }, () => {
      this.setState({
        isShowSearchBtn: true,
        searchBtnTxt: keyWord ? '搜索' : '取消',
      });
      if (keyWord.length === 0) {
        this.clearValue();
      }
    });
  };

  // 点击搜索/取消按钮
  clickSearchBtn = e => {
    //设置埋点
    logClick({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1578553760939|14`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/order-list/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    Taro.getSystemInfo({
      success: res => {
        this.setState(
          {
            scrollHeight: res.windowHeight - 70 + 'px',
            isShowSearchBtn: false,
          },
          () => {
            if (this.state.keyWord) {
              this.setState(
                {
                  isSearchPage: true,
                },
                () => {
                  this.loadList(0, true);
                }
              );
            }
          }
        );
      },
    });
  };

  // 搜索框小叉号
  clearValue = () => {
    this.setState(
      {
        keyWord: '',
        searchBtnTxt: this.state.keyWord ? '搜索' : '取消',
        pageIndex: 1,
        list: [],
        noneList: false,
      },
      () => {
        this.loadList();
      }
    );
  };

  onFocusSearch = e => {
    //设置埋点
    logClick({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1578553760939|13`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/order-list/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    let keyWord = e.target.value.trim();
    this.setState({
      keyWord,
      isShowMask: true,
      isShowSearchBtn: true,
      searchBtnTxt: keyWord ? '搜索' : '取消',
    });
  };

  onBlurSearch = () => {
    this.setState({
      isShowMask: false,
      isShowSearchBtn: this.state.keyWord ? true : false,
    });
  };

  onService = () => {
    const { contactServiceUrlType, mobile } = this.state;
    if (contactServiceUrlType === 6) {
      //打电话
      Taro.makePhoneCall({
        phoneNumber: mobile, //仅为示例，并非真实的电话号码
      });
    } else {
      utils.navigateToH5({
        page: 'https://7fresh.m.jd.com/mine/service',
      });
    }
  };

  //切换顶部菜单
  onTabClick(index) {
    logClick('7FRESH_H5_1_201803182|14', '', '', '');
    this.setState(
      {
        orderListTab: index,
        list: [],
        pageIndex: 1,
        totalElements: 0,
        noneData: false,
        noneList: false,
        loadFlag: true,
      },
      () => {
        this.loadList();
      }
    );
  }

  //进入订单详情页
  onOrderDetail(info) {
    console.log(info);
    const { orderId, canteenOrder, showProcess } = info;
    if (canteenOrder === true) {
      utils.navigateToH5({
        page: `${app.h5RequestHost}/food-order-detail/?orderId=${orderId}&showProcess=${showProcess}`,
      });
    } else {
      Taro.navigateTo({
        url: '/pages-mine/order-detail/index?id=' + orderId,
      });
    }
  }

  //删除订单
  modalOkTxt = () => {
    logClick('7FRESH_H5_3_1543909294472|2', '', '', '');
    const { deleteData } = this.state;
    const tenantId = deleteData.tenantInfo && deleteData.tenantInfo.tenantId;
    const storeId = deleteData.orderShopInfo.storeId;
    const params = {
      orderId: deleteData.orderId,
      tenantId: tenantId,
    };
    getDeleteOrderService(params, storeId, tenantId)
      .then(res => {
        this.modalCancelTxt();
        if (res && res.success) {
          this.setState(
            {
              pageIndex: 1,
              list: [],
              noneList: false,
            },
            () => {
              this.loadList();
            }
          );
        } else {
          if (res && res.msg) {
            Taro.showModal({
              title: '提示',
              content: res && res.msg,
            });
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  /*
      订单按钮的操作
    */
  onGoBuy(index, info, item) {
    // buttonId == 1 去支付 ，
    // buttonId == 2 查看物流 ,
    // buttonId == 3 再次购买 ,
    // buttonId == 4 取消订单 ,
    // buttonId == 5  继续支付,
    // buttonId == 6 联系客服 ,
    // buttonId == 7 申请售后 ,
    // buttonId == 8 查看退款 ,
    // buttonId == 9 申请退款 ,
    // buttonId == 10 评价 ,
    // buttonId == 11 写追评
    // buttonId == 12 查看评价
    // buttonId == 17 异业取货码
    // buttonId == 19 提货码

    const orderId = info.orderId;
    const orderTenantId = info.tenantInfo.tenantId;
    const buttonId = item.buttonId;
    const storeId = info.orderShopInfo.storeId;
    if (buttonId === 1) {
      //去支付
      logClick('7FRESH_H5_1_201803182|15', '', '', '');
      //小程序
      const url = `/pages/wxpay/wxpay?orderId=${orderId}&storeId=${storeId}&tenantId=${orderTenantId}&from=miniapp&shouldPrice=${info.shouldPrice ||
        0}`;
      Taro.navigateTo({
        url: url,
      });
      return;
    }
    if (buttonId === 2) {
      //查看物流
      Taro.navigateTo({
        url:
          '/pages-mine/orderTrack/orderTrack?id=' +
          orderId +
          '&orderTenantId=' +
          orderTenantId +
          '&storeId=' +
          storeId +
          '&status=' +
          info.state,
      });
      return;
    }
    if (buttonId === 3) {
      //再次购买
      logClick('7FRESH_H5_1_201803182|17', '', '', '');
      if (info.periodOrder) {
        this.setState(
          {
            periodFlag: true,
          },
          () => {
            this.setState({
              chooseData: info,
            });
          }
        );
      } else {
        this.toBuyAgast(info);
      }
      return;
    }

    if (buttonId === 7) {
      // 申请售后-跳到订单详情页
      this.onOrderDetail(info);
      return;
    }

    if (buttonId === 17) {
      //提货二维码
      this.setState({
        codePicture: info.qrCodeUrlBase64, // base64自提码
        qrCodeText: info.qrCodeText,
        codeFlag: true,
      });
      return;
    }

    if (buttonId === 20) {
      //小液态自提码
      logClick('7FRESH_H5_3_1543909294472|83', '', '', '');
      getSelfTakeCodeService({
        orderId,
        storeId,
        tenantId: orderTenantId,
      })
        .then(res => {
          if (res && res.success) {
            this.setState({
              codeData: res,
              litterFlag: true,
            });
          } else {
            Taro.showToast({
              title: (res && res.msg) || '商品还不可自提，请您稍后再试',
              icon: 'none',
            });
            return;
          }
        })
        .catch(err => {
          console.log(err);
        });
      return;
    }

    //接龙订单待核销
    if (buttonId === 21) {
      this.setState({
        orderListTab: index,
        finishFlag: true,
        isShowMask: true,
        finishInfo: {
          orderId: info.orderId,
          tenantId: info.tenantInfo.tenantId,
        },
      });
      return;
    }

    // 晚必赔
    if (buttonId === 22) {
      structureLogClick({
        eventId: 'orderListPage_orderCard_applyForLateCompensate',
        eventName: '订单列表页_订单卡片_晚必赔入口点击',
        jsonParam: {
          clickType: '-1',
          pageId: '0023',
          pageName: '我的订单页',
          tenantId: `${orderTenantId}`,
          storeId: `${storeId}`,
          platformId: '1',
          clickId: 'orderListPage_orderCard_applyForLateCompensate',
        },
      });
      this.onGetAfterPayoutApply(orderId);
      return;
    }
  }

  // 晚必赔接口
  onGetAfterPayoutApply = orderId => {
    const params = {
      orderId: orderId,
    };
    getAfterPayoutApply(params)
      .then(res => {
        if (res.success) {
          if (res.progressUrl) {
            utils.navigateToH5({
              page: `${app.h5RequestHost}${res.progressUrl}`,
            });
          }
        } else {
          Taro.showToast({
            title: (res && res.msg) || '接口错误',
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        if (err.code === '0') {
          Taro.showToast({
            title: '申请成功，请前往服务单列表查看',
            icon: 'success',
          });
          return;
        }
      });
  };

  //页面滚动
  onScroll = e => {
    this.setState({
      scrollTop: e.detail.scrollTop,
    });
  };

  //返回顶部
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

  // 进入详情页
  goDetailRecommend = info => {
    const tenantId =
      (info && info.tenantInfo && info.tenantInfo.tenantId) ||
      this.state.tenantId;
    structureLogClick({
      eventId: 'orderListPage_recommend_clickCommodity',
      jsonParam: {
        clickId: 'orderListPage_recommend_clickCommodity',
        clickType: 2,
        storeId: info.storeId,
        pageId: '0023',
        pageName: '我的订单页',
        skuId: info.skuId,
        skuName: info.skuName,
        skuStockStatus: info.status ? info.status : '',
        tenantId,
        platformId: 1,
        superiorPageId: '0022',
        superiorPageName: '个人中心',
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
    const tenantId =
      (args && args.tenantInfo && args.tenantInfo.tenantId) ||
      this.state.tenantId;
    structureLogClick({
      eventId: 'orderListPage_recommend_addCart',
      jsonParam: {
        clickId: 'orderListPage_recommend_addCart',
        clickType: 1,
        storeId: args.storeId,
        pageId: '0023',
        pageName: '我的订单页',
        skuId: args.skuId,
        skuName: args.skuName,
        skuStockStatus: args.status ? args.status : '',
        tenantId,
        platformId: 1,
        superiorPageId: '0022',
        superiorPageName: '个人中心',
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
  weightAddCart=(item)=> {
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

  //定期送服务
  onOk() {
    const { chooseData } = this.state;
    const skuId =
      chooseData &&
      chooseData.skuInfoWebList &&
      chooseData.skuInfoWebList[0].skuId;
    const storeId =
      chooseData &&
      chooseData.orderShopInfo &&
      chooseData.orderShopInfo.storeId;
    this.setState(
      {
        periodFlag: false,
      },
      () => {
        getOpenId().then(openId => {
          Taro.navigateTo({
            url: `/pages/detail/index?skuId=${skuId}&uuid=${openId}&storeId=${storeId}`,
          });
        });
      }
    );
  }

  //加入购物车
  onNo() {
    this.setState(
      {
        periodFlag: false,
      },
      () => {
        this.toBuyAgast(this.state.chooseData);
      }
    );
  }

  //再次购买
  toBuyAgast(info) {
    const { storeId } = this.state;
    //当前门店和该订单门店Id不相等时，进行门店弹框选择
    if (storeId !== info.orderShopInfo.storeId) {
      this.onTenantInfo(info);
      return;
    } else {
      this.toBuyNext(info);
    }
  }

  //获取租户信息
  onTenantInfo(info) {
    const data = {
      storeId: info.orderShopInfo.storeId,
      tenantId: info.tenantInfo.tenantId,
    };
    getTenantShopService(data)
      .then(res => {
        if (res && res.success) {
          const tenantShopInfo = res.tenantShopInfo;
          this.setState(
            {
              tenantShopInfo: tenantShopInfo,
              chooseData: info,
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

  //购买请求
  toBuyNext(info) {
    const { lbsData } = this.state;
    const tenantId = info.tenantInfo.tenantId;
    const storeId = info.orderShopInfo.storeId;
    const giftCard = info.giftCard;
    const wareInfos = [];
    for (let i in info.skuInfoWebList) {
      const wareInfo = {
        skuId: info.skuInfoWebList[i].skuId,
        skuName: info.skuInfoWebList[i].skuName,
        buyNum: info.skuInfoWebList[i].buyNum,
        serviceTagId: info.skuInfoWebList[i].serviceTagId || '',
        featureMap: info.skuInfoWebList[i].featureMap || null,
      };
      if (info.skuInfoWebList[i].selectedTasteInfoIds) {
        wareInfo.selectedTasteInfoIds =
          info.skuInfoWebList[i].selectedTasteInfoIds;
      }
      wareInfos.push(wareInfo);
    }
    // 加车统一结构埋点
    structureLogClick({
      eventId: 'orderListPage_Tab_listItem_addCart',
      jsonParam: {
        firstModuleId: 'tabModule',
        firstModuleName: '全部',
        secondModuleId: 'listItemModule',
        secondModuleName: '订单模块再次购买',
        clickType: 1,
        skuName: wareInfos.map(item => item.skuName).join('+'),
        skuId: wareInfos.map(item => item.skuId).join('+'),
      },
    });

    if (giftCard) {
      logClick({
        eid: '7FRESH_APP_9_20200811_1597153579446|23',
        eparam: {
          skuId: wareInfos[0] && wareInfos[0].skuId,
        },
      });
      // TOH5编码
      let ciphertext = AES.encrypt(
        JSON.stringify(wareInfos[0]),
        '7fresh-h5'
      ).toString();
      utils.navigateToH5({
        page: `${app.h5RequestHost}/giftCards/cardOrder?from=miniapp&nowBuy=16&lng=${lbsData.lng}&lat=${lbsData.lat}&storeId=${lbsData.storeId}&giftCardsWareInfo=${ciphertext}`,
      });
    } else {
      getBuyAgainService(
        { storeId: storeId, wareInfos: wareInfos },
        storeId,
        tenantId
      )
        .then(data => {
          if (data) {
            if (data.msg) {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000,
                success: () => {
                  if (data.showCart) {
                    getOpenId().then(openId => {
                      utils.navigateToH5({
                        page: `${app.h5RequestHost}/cart.html?from=miniapp&source=orderList&storeId=${storeId}&uuid=${openId}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`,
                      });
                    });
                  }
                },
              });
              return;
            }
            if (data.showCart) {
              getOpenId().then(openId => {
                utils.navigateToH5({
                  page: `${app.h5RequestHost}/cart.html?from=miniapp&source=orderList&storeId=${storeId}&uuid=${openId}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`,
                });
              });
            }
          } else {
            Taro.showModal({
              title: '提示',
              content: '加车失败，请重试',
              showCancel: false,
              success: function() {},
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  //确认收货
  getFinishOrder() {
    const { finishInfo, orderListTab } = this.state;
    getOrderFinishOrder(finishInfo)
      .then(res => {
        if (res && res.success) {
          //刷新页面 等到状态改变并且最多轮询3次
          this.setState(
            {
              finishFlag: false,
              isShowMask: false,
            },
            () => {
              setTimeout(() => {
                this.setState(
                  {
                    orderListTab,
                    list: [],
                    pageIndex: 1,
                    totalElements: 0,
                    noneData: false,
                  },
                  () => {
                    this.loadList();
                  }
                );
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

  //取消确认收货
  onCancel() {
    this.setState({
      finishFlag: false,
      isShowMask: false,
    });
  }

  // 不切换门店- 同租户下正常加车
  onNoSwitch(tenantShopInfo) {
    if (
      tenantShopInfo.tenantInfo &&
      tenantShopInfo.tenantInfo.tenantId !== this.state.tenantId
    ) {
      this.setState({
        switchTenantFlag: false,
        periodFlag: false,
      });
      return;
    }

    let params = {
      tenantInfo: { tenantId: this.state.tenantId },
      orderShopInfo: { storeId: this.state.storeId },
      skuInfoWebList: this.state.chooseData
        ? this.state.chooseData.skuInfoWebList
        : [],
    };
    this.setState(
      {
        switchTenantFlag: false,
        periodFlag: false,
      },
      () => {
        this.toBuyNext(params);
        return;
      }
    );
  }

  //地址信息存入SessionStorage
  onSwitch(tenantShopInfo) {
    const info = this.state.chooseData;
    const lbsData = this.state.lbsData;
    let tenant = lbsData.tenantShopInfo; //全部租户信息

    if (tenant && tenant.length > 1) {
      //如果有多个租户缓存信息，更新缓存
      for (let i = 0; i < tenant.length; i++) {
        if (tenant[i].storeId === info.orderShopInfo.storeId) {
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

    const addrInfo = {
      addressId: '',
      fullAddress: info.orderShopInfo.addressDetail,
      lat: info.orderShopInfo.geoLatitude,
      lon: info.orderShopInfo.geoLongitude,
      storeName: info.orderShopInfo.storeName,
      storeId: info.orderShopInfo.storeId,
      tenantInfo: tenantShopInfo.tenantInfo,
      tenantId: tenantShopInfo.tenantInfo.tenantId,
      addressSummary: '-1',
      addressExt: info.orderShopInfo.addressDetail,
      coord: [info.orderShopInfo.geoLatitude, info.orderShopInfo.geoLongitude],
      where: '-1', //返回地址不全的只保存到addressExt下
    };
    saveAddrInfo(addrInfo, tenant);

    let skuList = [];
    for (let i in info.skuInfoWebList) {
      skuList.push(info.skuInfoWebList[i].skuId);
    }
    if (this.state.switchTenantFlag) {
      this.setState(
        {
          switchTenantFlag: false,
          periodFlag: false,
        },
        () => {
          this.toBuyNext(this.state.chooseData);
          return;
        }
      );
    } else {
      this.toBuyNext(this.state.chooseData);
      return;
    }
  }

  // 关闭称重弹框
  onCloseCart = () => {
    this.setState({
      showCart: false,
    });
  };

  //关闭提货码弹框
  onCloseModal = () => {
    this.setState({
      litterFlag: false,
    });
  };

  // 关闭二维码弹框
  onCloseCode = () => {
    this.setState({
      codeFlag: false,
    });
  };

  onCloseAll() {
    this.onCloseModal();
    this.onCloseCode();
    this.onCloseCart();
    this.onCancel();
  }

  onCallPhone = () => {
    const { codeData } = this.state;
    Taro.makePhoneCall({
      phoneNumber: codeData.siteMobile,
    });
  };

  /**
   * 删除订单
   **/
  onDelete = info => {
    this.setState({
      delOrderFlag: true,
      deleteData: info,
    });
  };

  /**
   * 删除弹层取消
   */
  modalCancelTxt = () => {
    this.setState({
      delOrderFlag: false,
    });
  };

  // 刷新列表
  onHandlerTime = () => {
    this.setState(
      {
        pageIndex: 1,
        list: [],
        noneList: false,
      },
      () => {
        this.loadList();
      }
    );
  };

   // 放心购点击跳转
   onFreeBuy = () => {
    const url = `${app.h5RequestHost}/freeBuy/buyService`;
    Taro.navigateTo({
      url: `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(url)}`,
    });
  };

  render() {
    const {
      keyWord,
      searchBtnTxt,
      isShowSearchBtn,
      defaultKeyWord,
      isShowMask,
      isSearchPage,
      tabList,
      orderListTab,
      isShowAlwaysBuy,
      frequentPurchaseUrlList,
      list,
      scrollHeight,
      pageTop,
      noneList,
      recommendList,
      isBottomLoad,
      loadPicture,
      noneData,
      scrollTop,
      periodFlag,
      litterFlag,
      finishFlag,
      tenantShopInfo,
      switchTenantFlag,
      showCart,
      showCartData,
      codeData,
      codeFlag,
      qrCodeText,
      codePicture,
      tenantId,
      delOrderFlag,
      loadFlag,
    } = this.state;
    return (
      <View className='my-order-page'>
        {/* 顶部搜索框 */}
        <View className='search-box'>
          <OrderSearchBar
            keyWord={keyWord}
            searchBtnTxt={searchBtnTxt}
            isShowSearchBtn={isShowSearchBtn}
            defaultKeyWord={defaultKeyWord}
            onChangeWord={this.changeWord.bind(this)}
            onClickSearchBtn={this.clickSearchBtn.bind(this)}
            onClearValue={this.clearValue.bind(this)}
            onKeyUp={this.searchKeyUp.bind(this)}
            onFocusSearch={this.onFocusSearch.bind(this)}
            onBlurSearch={this.onBlurSearch.bind(this)}
            onService={this.onService.bind(this)}
            canService
            isShowClearValueBtn
          />
        </View>
        {loadFlag && <Loading />}
        {/* 遮罩层 */}
        {isShowMask && (
          <View
            className='my-mask'
            style={{
              top: isSearchPage ? px2vw(100) : px2vw(190),
            }}
          ></View>
        )}
        {/* 菜单栏 */}
        {!isSearchPage && (
          <View className='my-order-tag'>
            <View className='mine-tab'>
              {tabList &&
                tabList.map((info, index) => {
                  return (
                    <View
                      className='item'
                      style={{
                        color:
                          index == orderListTab
                            ? theme.color
                            : 'rgb(37, 37, 37)',
                      }}
                      key={index.toString()}
                      onClick={this.onTabClick.bind(this, index)}
                    >
                      <Text className='txt'>
                        {info}
                        {index == orderListTab && (
                          <Text
                            className='txt-line'
                            style={{ background: theme.color }}
                          />
                        )}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
        {/* 主体内容 */}
        <View
          className='order-main'
          style={{
            top:!isSearchPage ? px2vw(80) : px2vw(-20),
            display: noneList ? 'none' : 'block',
          }}
        >
          {/* 新增常购页面入口*/}
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            onScrolltolower={this.scrollToLower}
            style={{
              height: scrollHeight,
            }}
            onScroll={this.onScroll}
            scroll-top={pageTop}
          >
            {isShowAlwaysBuy && (
              <View className='alwaysbuy'>
                <AlwaysTop
                  title='常购清单'
                  desc='您常买的都在这'
                  onGoAlways={this.onGoAlways.bind(this)}
                  frequentPurchaseUrlList={frequentPurchaseUrlList}
                />
              </View>
            )}
            {list && list.length > 0 && (
              <View className='mine-order-list'>
                {list.map((item, index) => {
                  return (
                    <MyOrderList
                      info={item}
                      key={index.toString()}
                      onOrderDetail={this.onOrderDetail.bind(this)}
                      onDelete={this.onDelete.bind(this)}
                      onGoBuy={this.onGoBuy.bind(this, index)}
                      onHandlerTime={this.onHandlerTime.bind(this)}
                      onFreeBuy={this.onFreeBuy.bind(this)}
                    />
                  );
                })}
              </View>
            )}
            {noneData && list && list.length > 0 && (
              <View className='none-list-date'>已经全部加载完毕</View>
            )}
          </ScrollView>
        </View>
        {noneList && (
          <View className='page-empty'>
            {isSearchPage ? (
              <View
                style={{
                  paddingTop: px2vw(400),
                }}
              >
                <SearchEmpty
                  imgUrl='https://m.360buyimg.com/img/jfs/t1/100417/2/13253/73993/5e561c01Ed43c1e46/59ebbd4c946c011a.png'
                  showButton={false}
                  lineOne='没有找到相关订单哦~'
                  lineTwo='试试其他的关键词吧'
                />
              </View>
            ) : (
              <ScrollView
                className='scrollview'
                scrollY
                scrollWithAnimation='true'
                onScrolltolower={this.scrollToLowerRecommoned}
                style={{
                  height: scrollHeight,
                  position: 'fixed',
                  top: !isSearchPage ? px2vw(210) : px2vw(120),
                  left: 0,
                }}
                onScroll={this.onScroll}
                scroll-top={pageTop}
              >
                <View className='none-page'>
                  <EmptyPage
                    type='content'
                    EmptyPageTxt='你还没有订单哦'
                    showButton={false}
                  />
                  {/* 为你推荐 */}
                  {recommendList && recommendList.length > 0 && (
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
                          tenantId: tenantId,
                        }}
                        orderListTab={orderListTab}
                        tabList={tabList}
                        onGoDetail={this.goDetailRecommend.bind(this)}
                        onAddCart={this.onAddCart.bind(this)}
                      />
                    </View>
                  )}
                  {/* 为你推荐加载的load */}
                  {isBottomLoad && (
                    <View className='load-home-cont'>
                      <Image
                        className='load-img'
                        src={loadPicture}
                        mode='aspectFit'
                        lazyLoad
                      />
                    </View>
                  )}
                  {/* 底部LOGO图标 */}
                  {recommendList &&
                    recommendList.length !== 0 &&
                    this.maxPage === 0 && (
                      <View className='bottom-logo'>
                        <FreshBottomLogo />
                      </View>
                    )}
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {/* 定期送弹框 */}
        <Confirm
          show={periodFlag}
          desc='请选择购买商品方式'
          confirmTxt='定期送服务'
          cancelTxt='加入购物车'
          onConfirm={this.onOk.bind(this)}
          onCancel={this.onNo.bind(this)}
        />

        {/* 确认收货 */}
        <Confirm
          show={finishFlag}
          desc='是否确认收货'
          confirmTxt='确认'
          cancelTxt='取消'
          onConfirm={this.getFinishOrder.bind(this)}
          onCancel={this.onCancel.bind(this)}
        />

        <InfoModal
          show={codeFlag}
          qrCodeText={qrCodeText}
          img={`data:image/png;base64,${codePicture}`}
          onClose={this.onCloseCode}
        />

        {/* 自提码 */}
        <Code
          show={litterFlag}
          codeData={codeData}
          onClick={this.onCloseModal}
          onCallPhone={this.onCallPhone}
        />
        
        {/* 切一个门店 */}
        <SwitchAddressModal
          name='当前操作需切换门店至'
          data={tenantShopInfo}
          show={switchTenantFlag}
          onSwitch={this.onSwitch.bind(this)}
          onClose={this.onNoSwitch.bind(this)}
        />

        {/* 加车弹框 */}
        <FloorAddCart
          show={showCart}
          data={showCartData}
          onAddCart={this.weightAddCart}
          onClose={this.onCloseCart}
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

         {/* 置顶 */}
         {scrollTop > 100 && (
          <View className='go-top'>
            <FightGoTop type='top' onClick={this.goTop.bind(this)} />
          </View>
        )} 
      </View>
    );
  }
}
