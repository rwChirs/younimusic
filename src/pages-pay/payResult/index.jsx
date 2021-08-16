import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import AES from 'crypto-js/aes';
import { View, Image, Text, Button } from '@tarojs/components';
// import {
//   FreshPayResult,
//   FreshSearchAll,
//   FreshBottomLogo,
//   FreshProductItem,
//   FreshPayResultDetail,
//   FreshPayOrderPanel,
//   FreshPayFightResult,
//   FreshFightResultInfo,
//   FreshFloatBtn,
//   FreshFloorCouponGroup,
// } from '@7fresh/new-ui';
import FreshBottomLogo from '../../components/bottom-logo';
import FreshProductItem from '../../components/product-item';
import FreshFloatBtn from '../../components/float-btn';
import FreshPayResult from './components/pay-result';
import FreshSearchAll from './components/search-all';
import FreshPayResultDetail from './components/new-person-result-modal'
import FreshPayOrderPanel from './components/pay-order-panel'
import FreshPayFightResult from './components/pay-fight-reslut'
import FreshFightResultInfo from './components/fight-result-info'
import FreshFloorCouponGroup from './components/floor-coupon-group'

import {
  getLaunchPaySuccess,
  addCart as addCartSever,
  getCouponBatchSendApi,
  getGroupDetailService,
  getCartNum,
  getSolitaireQuery,
  getOrderCouponInfoService,
  getRedisSocialGet,
  getGroupShareService,
  getSpellLuckShareService,
  getPeriodInfoService,
  getOrderDetailService,
  getNewUserTaskPaySuccess,
  getSolitaireListShareService,
  getSolitaireShareService,
  getWaitGroupInfoService,
  getQueryPaymentCommand,
  getQueryTemplate,
  getSaveTemplate,
  getPayResultMainService,
  getPayResultExtService,
} from '@7fresh/api';
// import {
//   logClick,
//   commonLogClick,
//   logOrder,
//   structureLogClick,
// } from '@/utils/common/logReport';
import {
  logClick,
  commonLogClick,
  logOrder,
  structureLogClick,
} from '../../utils/common/logReport';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import utils from '../../pages/login/util';
import { getPtPin, getPwdId } from '../../utils/adapter/index';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import { exportPoint, getExposure } from '../../utils/common/exportPoint';
import FloorAddCart from '../../components/floor-add-cart';
import {
  goToList,
  payShare,
  goPayDetail,
  visitFriend,
  lookHome,
  searchOrder,
  haveCoupon,
  goCoupon,
} from './utils/reportPoints';
import BackProduct from '../../components/back-product';
import Loading from '../../components/loading';
import NavBar from '../../components/nav-bar';
import FloorNotice from '../../components/floor-notice';
import NewPersonResultModal from './components/new-person-result-modal';
import SubscribeModal from '../../components/subscribe-modal';

import { h5Url, px2vw, filterImg } from '../../utils/common/utils';
import goPage from '../../utils/goPage';
import './index.scss';

const app = Taro.getApp().$app;

export default class payResult extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      storeId: '',
      flowId: '',
      skuId: '',
      orderType: '',
      commanderPin: '',

      resultData: null,
      payOrderInfo: null,
      activityInfo: null,
      groupInfoWeb: null,
      shareInfo: null,
      userName: '',
      orderLotteryPayResult: '',

      canShare: false,
      isCanShare: false,
      openType: '',
      payGiftPackets: '',
      bagShareInfo: null,

      goodList: [],
      pageStyle: {},
      isAllshow: false,
      shareFlag: false,
      isShowSucImg: true,
      isLoad: true,

      handonId: '',
      recommend: {
        info: '',
        tags: ['', '', ''],
      },

      grouponList: [],
      windowWidth: 0,
      floors: [],
      cartNum: 0,
      scrollTop: 0,
      addCartPopData: '',
      fightTitle: '',
      pageSize: 20,
      couponAmountText: '', //订单满返劵文案
      communityUrl: '', //社群入口跳转url
      orderDetail: {}, // 订单详情数据
      periodOrder: null, // 定期送订单信息
      showAwardModal: false, //新人任务弹窗
      taskAwardInfo: {},
      noNewPerson: false,
      suportNavCustom: false, //是否支持自定义导航栏
      magic: '', //优惠卷批次
      orangeShareImg: '', //鲜橙配的红包分享图
      redPayCommand: false, //口令红包
      redPassword: {},
      remindFlag: false,
      restartFlag: false,
      remindNum: 0,
      subscriptionType: 1,
      giftCardInfo: {}, //预付卡数据
      tastMtInfo: null, //茅台的数据
    };
  }

  couponCodes = [];
  tmplIds = '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw';
  alreadyGet = false;

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    console.log('地址栏allinfo', getCurrentInstance().router);
    const { orderType } = getCurrentInstance().router.params;
    if (orderType === 'solitaire') {
      wx.setNavigationBarTitle({
        title: '七鲜接龙',
      });
    }
    Taro.getSystemInfo().then((res) => {
      const suportNavCustom = res.version.split('.')[0] >= 7;
      this.setState({
        windowWidth: res.windowWidth,
        suportNavCustom,
      });
      if (!suportNavCustom) {
        Taro.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
        });
      }
    });
  }

  componentDidMount() {
    const { storeId, flowId, orderId, skuId, orderType } =
      getCurrentInstance().router.params;
    this.setState({
      scrollTop: 0,
    });

    getUserStoreInfo(storeId, '', '', '', 3)
      .then((args) => {
        this.setState(
          {
            storeId: args.storeId || '',
            flowId,
            orderId,
            skuId,
            orderType,
          },
          () => {
            this.init();
            this.getResultExt();
            this.getLaunchPay();
            this.getCartNum();
            this.newUserTaskPaySuccess(orderId);
            if (orderType === 'solitaire') {
              this.queryTodayList();
            } else {
              this.getSpellLuck();
            }

            //获取订单满返劵数据
            if (
              this.state.resource !== 'solitaire' &&
              this.state.resource !== 'fightGroup'
            ) {
              this.getOrderCouponInfo();
            }
          }
        );
      })
      .catch(() => {
        this.setState(
          {
            storeId: getCurrentInstance().router.params.storeId || '',
            flowId,
            orderId,
            skuId,
            orderType,
          },
          () => {
            this.init();
            this.getResultExt();
            if (orderType === 'solitaire') {
              this.queryTodayList();
            } else if (orderType === 'group') {
              // 拼团
              // 红包分享和拼团分享一起请求
              this.getSpellLuck();
              // this.waitGroupFc();
            } else {
              this.getSpellLuck();
            }
          }
        );
      });
    this.getCommunityData();
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  //获取拼团详细信息
  getGroupDetail(activityId, skuId, grouponId) {
    let params = {};
    if (activityId) {
      params.activityId = activityId;
    }
    if (grouponId) {
      params.grouponId = grouponId;
    }
    if (skuId) {
      params.skuId = skuId;
    }
    if (this.state.storeId) {
      params.storeId = this.state.storeId;
    }

    getGroupDetailService(params)
      .then((res) => {
        if (res && res.success) {
          const grouponScale = res.grouponScale;
          const grouponCount =
            (res.grouponMembers && res.grouponMembers.length) || 0;
          const needCount = grouponScale - grouponCount;
          const skuName = res.skuInfoWeb && res.skuInfoWeb.skuName;
          const grouponPrice = res.skuInfoWeb && res.skuInfoWeb.grouponPrice;
          const basePrice = res.skuInfoWeb && res.skuInfoWeb.basePrice;
          const title = `【还差${needCount}人成团】拼团价${grouponPrice}元 原价${basePrice}元 ${skuName}`;
          this.setState({
            fightTitle: title,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 分享
  onShareAppMessage = (e) => {
    structureLogClick({
      eventId: 'Lucky_red_share',
      eventName: '拼手气红包分享',
      jsonParam: {
        clickType: '-1',
        pageId: '0046',
        pageName: '支付结果页',
        clicksource: 'WeChat',
        clickId: 'Lucky_red_share',
      },
    });
    console.log('分享e对象', e);
    const pin = getPtPin() ? getPtPin() : getPwdId();
    const skuId = this.state.skuId;
    const userName = this.state.userName;
    let { orderType, canShare } = this.state;

    if (orderType === 'solitaire') {
      logClick({ e, eid: payShare, eparam: { pin, skuId } });
    }
    if (orderType === 'group') {
      logClick({ e, eid: visitFriend });
    }

    let titleTxt = '';
    let path = '';
    let imgUrl = '';
    let desc = '';
    if (orderType === 'solitaire') {
      let title =
        this.state.shareInfo && this.state.shareInfo.title
          ? this.state.shareInfo.title
          : '';
      let bigImageUrl =
        this.state.shareInfo && this.state.shareInfo.bigImageUrl
          ? this.state.shareInfo.bigImageUrl
          : '';
      let url =
        this.state.shareInfo && this.state.shareInfo.url
          ? this.state.shareInfo.url
          : '';
      let content =
        this.state.shareInfo && this.state.shareInfo.content
          ? this.state.shareInfo.content
          : '';
      titleTxt = `【${userName}邀请你进行接龙】${title}`;
      path = `/pages-a/solitaire/detail/index?storeId=${this.state.storeId}&handonId=${this.state.handonId}`;
      if (!!bigImageUrl) {
        if (bigImageUrl.indexOf('http') > -1) {
          imgUrl = bigImageUrl;
        } else {
          imgUrl = `https:${bigImageUrl}`;
        }
      } else if (!!url) {
        if (url.indexOf('http') > -1) {
          imgUrl = url;
        } else {
          imgUrl = `https:${url}`;
        }
      }
      desc = content;
    } else if (orderType === 'group') {
      if (
        e &&
        e.target &&
        e.target.dataset &&
        e.target.dataset.info &&
        e.target.dataset.info.title &&
        e.target.dataset.info.title.indexOf('拼手气') > -1
      ) {
        // 拼手气红包
        // console.log(e.target.dataset.info);
        let { shareInfo } = this.state;
        titleTxt = shareInfo && shareInfo.title ? shareInfo.title : '';
        let info = e.target.dataset.info;
        titleTxt =
          this.state.bagShareInfo && this.state.bagShareInfo.title
            ? this.state.bagShareInfo.title
            : '';
        path = info && info.miniProUrl ? info.miniProUrl : '';
        // 兼容处理图片
        if (!!info.bigImageUrl) {
          if (info.bigImageUrl.indexOf('http') > -1) {
            imgUrl = info.bigImageUrl;
          } else {
            imgUrl = `https:${info.bigImageUrl}`;
          }
        } else if (!!info.url) {
          if (info.url.indexOf('http') > -1) {
            imgUrl = info.url;
          } else {
            imgUrl = `https:${info.url}`;
          }
        }
        desc = info && info.content ? info.content : '';
      } else {
        // 拼团分享信息
        let { shareInfo } = this.state;
        titleTxt = this.state.fightTitle;
        // titleTxt = shareInfo && shareInfo.title ? shareInfo.title : '';
        path = shareInfo && shareInfo.miniProUrl ? shareInfo.miniProUrl : '';

        // 支付成功-点击“喊好友参团”
        structureLogClick({
          eventId: 'Grouppay_calltojoin_ck',
          eventName: '支付成功-喊好友参团',
          owner: 'myh',
          jsonParam: {
            pageId: '0046',
            pageName: '支付结果页',
            clickType: -1,
            clickId: 'Grouppay_calltojoin_ck',
          },
        });
        if (shareInfo && shareInfo.bigImageUrl) {
          if (shareInfo.bigImageUrl.indexOf('http') > -1) {
            imgUrl = shareInfo.bigImageUrl;
          } else {
            imgUrl = `https:${shareInfo.bigImageUrl}`;
          }
        }
        desc = shareInfo && shareInfo.content ? shareInfo.content : '';
      }
    } else {
      console.log('bagShareInfo', this.state.bagShareInfo);
      let title =
        this.state.bagShareInfo && this.state.bagShareInfo.title
          ? this.state.bagShareInfo.title
          : '';
      let bigImageUrl =
        this.state.bagShareInfo && this.state.bagShareInfo.bigImageUrl
          ? this.state.bagShareInfo.bigImageUrl
          : '';
      let url =
        this.state.bagShareInfo && this.state.bagShareInfo.url
          ? this.state.bagShareInfo.url
          : '';
      let content =
        this.state.bagShareInfo && this.state.bagShareInfo.content
          ? this.state.bagShareInfo.content
          : '';
      let miniProUrl =
        this.state.bagShareInfo && this.state.bagShareInfo.miniProUrl
          ? this.state.bagShareInfo.miniProUrl
          : '';
      titleTxt = title;
      path = miniProUrl;
      // 兼容处理图片
      if (!!bigImageUrl) {
        if (bigImageUrl.indexOf('http') > -1) {
          imgUrl = bigImageUrl;
        } else {
          imgUrl = `https:${bigImageUrl}`;
        }
      } else if (!!url) {
        if (url.indexOf('http') > -1) {
          imgUrl = url;
        } else {
          imgUrl = `https:${url}`;
        }
      }
      desc = content;
    }
    if (canShare) {
      this.bagClose();
    }

    return {
      title: titleTxt,
      path: path,
      imageUrl: imgUrl,
      desc: desc,
    };
  };

  // 渲染接口
  init = () => {
    const { flowId, orderId, storeId } = this.state;
    let params = {
      flowId, //支付流水
      orderId,
      storeId,
    };
    getPayResultMainService(params)
      .then((res) => {
        console.log('****支付结果****', res);
        if (res && res.success) {
          this.setState(
            {
              resultData: res,
              payOrderInfo: (res && res.payOrderInfo) || '',
              orderId: (res && res.payOrderInfo.orderId) || '',
              isLoad: false,
              tastMtInfo: (res && res.tastMtInfo) || '',
            },
            () => {
              // 订单埋点
              if (res && res.tastMtInfo) {
                console.log('----------茅台品鉴曝光埋点---------');
                const param = {
                  router: getCurrentInstance().router,
                  eid: 'MaotaiWinetasting_Payment_Successful',
                };
                getExposure(param);
              }
              this.initOrderLog();
            }
          );
        }
        this.getQueryPaymentCommand();
      })
      .catch((res) => {
        this.setState({
          isLoad: false,
        });
        if (res.code === 3 || res.code === '3') {
          //未登录，跳转登陆
          let { orderType } = getCurrentInstance().router.params;

          if (orderType === 'solitaire') {
            utils.gotoLogin(
              `/pages/payResult/index?orderId=${orderId}&storeId=${storeId}&flowId=${flowId}&from=&showNavigationBar=1&orderType=solitaire`,
              'redirectTo'
            );
          }
          if (orderType === 'group') {
            utils.gotoLogin(
              `/pages/payResult/index?orderId=${orderId}&storeId=${storeId}&flowId=${flowId}&orderType=group`,
              'redirectTo'
            );
          }
        } else {
          console.log(res);
          return;
        }
      });
  };

  // NOTE: 获取支付结果附加信息查询（接龙、拼团、订单抽大奖）
  getResultExt = () => {
    const { orderId } = this.state;
    getPayResultExtService({ orderId })
      .then((res) => {
        if (res) {
          const {
            orderLotteryPayResult = '',
            groupInfoWeb = '',
            activityInfo = '',
          } = res;
          const activityId = groupInfoWeb && groupInfoWeb.activityId;
          const skuId = groupInfoWeb && groupInfoWeb.skuId;
          const groupId = groupInfoWeb && groupInfoWeb.groupId;
          const handonId = (activityInfo && activityInfo.handonId) || '';

          this.setState(
            {
              orderLotteryPayResult,
              activityInfo,
              groupInfoWeb: groupInfoWeb
                ? {
                    ...groupInfoWeb,
                    payDate: res.payDate,
                  }
                : '',
              commanderPin: activityInfo && activityInfo.commanderPin,
              handonId,
              giftCardInfo: res && res.giftCardInfo,
            },
            () => {
              if (handonId) {
                this.initShare(handonId);
              }
              if (groupInfoWeb) {
                this.queryDetailShare();
              }
            }
          );
          //拼团分享用
          if (groupId) {
            this.getGroupDetail(activityId, skuId, groupId);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //查看全部
  SearchAll = () => {
    this.setState({
      isAllshow: true,
    });
  };

  // 授权
  getUserInfo = () => {
    const { shareInfo } = this.state;
    Taro.getUserInfo()
      .then((res) => {
        console.log('res', res, shareInfo);
        let type = '';
        if (shareInfo && shareInfo.canGroupon) {
          type = res.userInfo.nickName ? '' : 'getUserInfo';
        } else {
          type = res.userInfo.nickName ? 'share' : 'getUserInfo';
        }
        this.setState({
          userName: res.userInfo.nickName,
          openType: type,
        });
      })
      .catch((err) => {
        this.setState({
          openType: 'getUserInfo',
        });
        console.log(err);
      });
  };

  getUserInfoClick = () => {
    const { bagShareInfo } = this.state;
    Taro.getUserInfo()
      .then((res) => {
        console.log('res', res, bagShareInfo);
        let type = '';
        if (bagShareInfo) {
          type = res.userInfo.nickName ? '' : 'getUserInfo';
        } else {
          type = res.userInfo.nickName ? 'share' : 'getUserInfo';
        }
        this.setState({
          userName: res.userInfo.nickName,
          openType: type,
          canShare: true,
        });
      })
      .catch((err) => {
        this.setState({
          openType: 'getUserInfo',
          canShare: true,
        });
        console.log(err);
      });
  };

  // 初次进入红包分享接口
  getSpellLuck = () => {
    const { orderId } = this.state;
    let params = {
      orderId: orderId,
      type: 1,
    };
    getSpellLuckShareService(params).then((res) => {
      if (res && res.success) {
        console.log('拼手气红包分享接口', res);
        if (res.payGiftPackets) {
          let bagShareInfo = {
            title: res.title || '',
            content: res.content || '',
            bigImageUrl: res.bigImageUrl || '',
            url: res.url || '',
            miniProUrl: res.miniProUrl || '',
          };
          this.setState(
            {
              canShare: res.canShare,
              isCanShare: res.canShare,
              payGiftPackets: res.payGiftPackets,
              orangeShareImg: res.orangeShareImg,
              bagShareInfo: bagShareInfo,
            },
            () => {
              const param = {
                router: getCurrentInstance().router,
                eid: 'Lucky_red_show',
              };
              getExposure(param);
              this.getUserInfo();
              this.preventBodyScrool();
            }
          );
        }
      } else {
        console.log('接口success字段', res);
        console.log('canShare', this.state.canShare);
        return;
      }
    });
  };

  //阻止页面滚动
  preventBodyScrool = () => {
    this.setState({
      pageStyle: {
        position: 'fixed',
        width: '100%',
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

  bagClose = () => {
    this.setState(
      {
        canShare: false,
      },
      () => {
        this.bodyScrool();
      }
    );
  };

  //接龙-请求支付页分享文案
  initShare = (handonId) => {
    if (!this.state.orderType) return;
    getSolitaireListShareService({ handonId: handonId })
      .then((res) => {
        if (res.success) {
          if (res.canGroupon) {
            this.setState(
              {
                shareInfo: res,
              },
              () => {
                this.getUserInfo();
              }
            );
          } else {
            this.setState(
              {
                shareInfo: res.shareTextWeb,
              },
              () => {
                this.getUserInfo();
              }
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  //进入-接龙详情页
  goDetail = (data, e) => {
    let skuId = data.skuId;
    logClick({ e, eid: goPayDetail, eparam: { skuId } });

    Taro.navigateTo({
      url: `/pages-a/solitaire/detail/index?handonId=${data.skuActivityInfo.handonId}&storeId=${this.state.storeId}&commanderPin=${this.state.commanderPin}&showNavigationBar=1`,
    });
  };

  //继续接龙
  goToList = (e) => {
    const { activityInfo } = this.state;
    if (activityInfo && activityInfo.keepSolitaire) {
      logClick({ e, eid: goToList });

      Taro.navigateTo({
        url: `/pages/solitaire/list/index?storeId=${this.state.storeId}&commanderPin=${this.state.commanderPin}`,
      });
    } else {
      // 回到首页
      logClick({ e, eid: lookHome });
      Taro.switchTab({
        url: `/pages/index/index`,
      });
    }
  };

  // 接龙推荐
  queryTodayList = () => {
    const { commanderPin, pageSize } = this.state;
    getSolitaireQuery({
      commanderPin,
      pageSize,
    }).then((res) => {
      if (res && res.success) {
        const todayInfo =
          res.todayInfo &&
          res.todayInfo.skuDetailPage &&
          res.todayInfo &&
          res.todayInfo.skuDetailPage.pageList;
        this.getListData(todayInfo);
      }
    });
  };

  getListData = (data) => {
    this.setState({
      isLoad: false,
      goodList: data || [],
      isAllshow: data ? (data.length >= 2 ? false : true) : '',
    });
  };

  // 接龙弹框分享
  onShare = () => {
    let recommend = this.state.recommend.info
      ? this.state.recommend.info
      : this.state.shareInfo.handonInfo.commanderInfo.recommendation;
    let tagList = [];
    let flag = true;
    console.log(recommend.info);
    if (recommend.info === '') {
      flag = false;
      Taro.showToast({ title: '请输入推荐语', icon: 'none', duration: 2000 });
      return;
    }

    let tagNewList = recommend.tags
      ? recommend.tags
      : this.state.shareInfo.handonInfo.commanderInfo.tags;
    if (tagNewList.length === 0) {
      flag = false;
      Taro.showToast({
        title: '请至少输入1个关键字',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    tagNewList.map((tag, i) => {
      if (tag == '' && i === 0) {
        flag = false;
        Taro.showToast({
          title: '请至少输入1个关键字',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      if (tag !== '' && tag.length < 2) {
        flag = false;
        Taro.showToast({
          title: '请输入2-4个关键字',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      tagList.push(tag == '' ? '' : tag);
    });

    if (!flag) return;

    let params = {
      handonId: this.state.handonId,
      canGroupon: true,
      recommendText: recommend,
      labelList: tagList,
    };

    console.log(params);

    getSolitaireShareService({
      storeId: this.state.storeId,
      data: params,
    })
      .then((shareParams) => {
        if (shareParams.success) {
          this.setState(
            {
              shareInfo: shareParams,
              openType: 'share',
            },
            () => {
              Taro.getUserInfo().then((res) => {
                this.setState({
                  userName: res.userInfo.nickName,
                });
              });

              Taro.showToast({
                title: '保存成功，快分享给其他小伙伴吧～',
                icon: 'none',
                duration: 2000,
              });
              return;
            }
          );
        } else {
          Taro.showToast({
            title: shareParams.msg,
            icon: 'none',
            duration: 2000,
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  // 接龙关闭弹窗
  onClose = () => {
    this.setState({
      shareFlag: false,
      // successFlag: false,
    });
  };

  onTextChange = (e) => {
    this.setState({
      recommend: e,
    });
  };

  // onInfoModalOnclick = () => {
  //   let { shareInfo } = this.state;
  //   //判断是否弹分享框
  //   if (shareInfo && shareInfo.canGroupon) {
  //     this.setState({
  //       shareFlag: true,
  //       openType: '',
  //     });
  //   } else {
  //     this.getUserInfo();
  //   }
  // };

  // 订单抽大奖
  gotoUrl = (e) => {
    logClick({ e, eid: `7FRESH_miniapp_1_1530785333379|74` });
    const { orderLotteryPayResult } = this.state;
    let params = orderLotteryPayResult.activityUrl
      ? orderLotteryPayResult.activityUrl.split('?')[1]
      : '';

    if (orderLotteryPayResult && orderLotteryPayResult.activityUrl && params) {
      wx.navigateTo({
        url: '/pages-a/draw/index?' + params,
      });
    }
  };

  closeSucImg = () => {
    this.setState({
      isShowSucImg: false,
    });
  };

  // 拼团分享
  queryDetailShare = () => {
    const { storeId, groupInfoWeb } = this.state;
    const groupId = groupInfoWeb && groupInfoWeb.groupId;
    const activityId = groupInfoWeb && groupInfoWeb.activityId;
    const skuId = groupInfoWeb && groupInfoWeb.skuId;
    const args = {
      activityId,
      skuId,
      storeId,
      groupId,
    };
    getGroupShareService(args)
      .then((res) => {
        // Taro.showShareMenu(); //禁止分享
        if (res) {
          let shareInfo = {
            // title: res.shareTitle || '',
            title:
              `${
                this.state.userName ? this.state.userName : ''
              }邀请您参加拼团，${res.shareTitle}，快来一起参与吧～` || '',
            content: res.shareDesc || '',
            bigImageUrl: res.appletImageUrl || '',
            url: res.url || '',
            miniProUrl: res.appletUrl || '',
          };

          this.setState({
            shareInfo: shareInfo,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 大家都在拼
  waitGroupFc = () => {
    const { storeId } = this.state;
    getWaitGroupInfoService({ storeId })
      .then((res) => {
        let content = res && res.waitGroupInfos ? res.waitGroupInfos : [];
        this.setState({
          grouponList: content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //返回首页
  onGoHome = (e) => {
    logClick({ e, eid: lookHome });
    Taro.switchTab({
      url: `/pages/index/index`,
    });
  };

  //查看订单详情
  searchOrder = (e) => {
    const { orderId, orderDetail, tastMtInfo } = this.state;
    const { orderSkuGroupWebList } = orderDetail;
    console.log('@@@@@@@@@@@@@-埋点-@@@@@@@@@@@@@@@', orderSkuGroupWebList);

    if (tastMtInfo && orderSkuGroupWebList && orderSkuGroupWebList.length > 0) {
      structureLogClick({
        eventId: 'MaotaiiWinetasting_View_Orde_Details',
        jsonParam: {
          clickType: -1,
          orderId: orderId,
          skuId:
            orderSkuGroupWebList[0] &&
            orderSkuGroupWebList[0].orderSkuInfoWebList[0].skuId,
          skuName:
            orderSkuGroupWebList[0] &&
            orderSkuGroupWebList[0].orderSkuInfoWebList[0].skuName,
        },
      });
    }
    logClick({ e, eid: searchOrder });
    const { orderType } = getCurrentInstance().router.params;
    if (orderType !== 'hallFood') {
      Taro.navigateTo({
        url: '/pages-a/order-list/index?status=0',
      });
    } else {
      utils.navigateToH5({
        page: `${app.h5RequestHost}/food-order-detail/?orderId=${this.state.orderId}&showProcess=true&from=miniapp`,
      });
    }
  };

  // 预付卡  去绑卡
  onBindCard = () => {
    const { giftCardInfo } = this.state;
    let mobile = giftCardInfo && giftCardInfo.mobile ? giftCardInfo.mobile : '';
    let mobileMask =
      giftCardInfo && giftCardInfo.mobileMask ? giftCardInfo.mobileMask : '';
    let authType =
      giftCardInfo && giftCardInfo.authType ? giftCardInfo.authType : '';
    utils.navigateToH5({
      page: `${
        app.h5RequestHost
      }/giftCards/cardCheck?from=miniapp&nowBuy=16&authType=${authType}&orderId=${encodeURIComponent(
        this.state.orderId
      )}&mobile=${encodeURIComponent(mobile)}&mobileMask=${mobileMask}`,
    });
  };

  //进入拼团商品详情页
  goToDetail = (info) => {
    //进入详情
    Taro.navigateTo({
      url:
        '/pages-a/fight-group/detail/index?activityId=' + info &&
        info.grouponingInfo &&
        info.grouponingInfo.activityId +
          '&storeId=' +
          this.state.storeId +
          '&skuId=' +
          info &&
        info.skuInfoWeb &&
        info.skuInfoWeb.skuId + '&grouponId=',
    });
  };

  /**
   * 跳转商详
   * @param {*} skuId 商品id
   * @param {*} data 商品数据  todo
   */
  onGoDetail = (skuId, storeId, prepayCardType, data, e) => {
    const { resultData } = this.state;
    let listPageIndex =
      e && e.currentTarget ? e.currentTarget.dataset.index : 0;
    // 跳转商详统一结构埋点
    structureLogClick({
      eventId:
        resultData && resultData.payStatus === 5
          ? 'orderFailPage_recommend_clickCommodity'
          : 'orderSuccessPage_recommend_clickCommodity',
      jsonParam: {
        firstModuleId: 'recommendModule',
        firstModuleName: '更多推荐',
        clickType: 2,
        skuName: data.skuName,
        skuId: data.skuId,
        listPageIndex: listPageIndex,
        broker_info: data.brokerInfo ? data.brokerInfo : '',
      },
    });
    if (prepayCardType) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/card-detail/index?from=miniapp&storeId=${storeId}&skuId=${skuId}&prepayCardType=${prepayCardType}`,
      });
      return;
    } else {
      const lbs_data = Taro.getStorageSync('addressInfo') || {};
      Taro.navigateTo({
        url: `/pages/detail/index?storeId=${storeId}&skuId=${skuId}&lng=${
          lbs_data && lbs_data.lng
        }&lat=${lbs_data && lbs_data.lat}&tenantId=${
          lbs_data && lbs_data.tenantId
        }&platformId=1`,
      });
    }
  };

  // 去预付卡结算页
  goCardOrder = (data) => {
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
    const lbsData = Taro.getStorageSync('addressInfo') || '';
    utils.navigateToH5({
      page:
        Taro.getApp().h5RequestHost +
        `/giftCards/cardOrder?from=miniapp&nowBuy=16&lng=${lbsData.lng}&lat=${lbsData.lat}&giftCardsWareInfo=${ciphertext}`,
    });
    return;
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

  //加车
  onAddCart() {
    console.log('onAddCart');
  }

  //返回
  handleBack = (e) => {
    const { activityInfo, groupInfoWeb } = this.state;
    logClick({ e, eid: '7FERSH_APP_8_1590127250769|65' });
    // if (Taro.getCurrentPages().length > 1) {
    //   Taro.navigateBack({
    //     delta: 1,
    //   });
    // } else {
    if (this.state.orderType === 'solitaire') {
      const commanderPin = activityInfo && activityInfo.commanderPin;
      Taro.redirectTo({
        url: `/pages-a/solitaire/cart/index?commanderPin=${commanderPin}&storeId=${this.state.storeId}&source=wxappPay`,
      });
      return;
    } else if (this.state.orderType === 'group') {
      // const { groupInfoWeb } = payOrderInfo;
      const { activityId, skuId, groupId } = groupInfoWeb;
      Taro.redirectTo({
        url:
          '/pages-a/fight-group/detail/index?activityId=' +
          activityId +
          '&storeId=' +
          this.state.storeId +
          '&skuId=' +
          skuId +
          '&grouponId=' +
          groupId +
          '&source=wxappPay',
      });
      return;
    } else {
      let uuid = '';
      const wxUserInfo = Taro.getStorageSync('exportPoint');
      if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
        uuid = JSON.parse(wxUserInfo).openid;
      }
      const lbsData = Taro.getStorageSync('addressInfo') || '';
      const url = `${h5Url}/cart.html?from=wxapp&source=wxappPay&storeId=${this.state.storeId}&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`;
      utils.navigateToH5({ page: url }, true);
    }
    // }
  };

  //支付结果楼层
  getLaunchPay(floorType, floorUuid, couponReceiveInfoList) {
    let orderId = getCurrentInstance().router.params.orderId || '';
    let params = {
      orderId: orderId,
    };
    if (floorType && floorUuid && couponReceiveInfoList) {
      params = {
        orderId,
        refreshFloorType: floorType,
        floorUuid,
        couponReceiveInfoList,
      };
    }
    getLaunchPaySuccess(params)
      .then((res) => {
        if (res && res.floors) {
          let { floors } = this.state;
          if (floors && floorType && floorUuid) {
            floors.forEach((item, i) => {
              if (
                item.floorType === floorType &&
                item.floorUuid === floorUuid
              ) {
                floors[i] = res.floors[0];
              }
            });
          } else {
            floors = res.floors;
          }
          this.setState(
            {
              floors,
            },
            () => {
              console.log('修改后的floors===', floors);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /* 领取优惠劵
   *  type-按钮类型 1：点击领取
   *  2：去使用 floorUuid-楼层标识
   */
  getCoupon = (type, floorUuid, e) => {
    if (type === 1) {
      logClick({ e, eid: haveCoupon });
      let { floors } = this.state;
      let params = [];
      // couponInfoWebList = [];
      floors.forEach((item) => {
        if (item.floorType === 86 && item.floorUuid === floorUuid) {
          item.couponInfoWebList &&
            item.couponInfoWebList.forEach((info) => {
              params.push(info.batchKey);
            });
          // couponInfoWebList = item.couponInfoWebList;
        }
      });
      this.alreadyGet = true;
      getCouponBatchSendApi({ data: { batchKeyList: params } })
        .then((res) => {
          console.log('getCouponBatchSendApi====', res);
          if (res) {
            this.couponCodes = res.couponCodes;
            // if (res.refreshFloor) {
            //刷新楼层
            this.getLaunchPay(86, floorUuid, res.batchItemList);
            Taro.showToast({
              title: res && res.message,
              icon: 'none',
              duration: 2000,
            });
            if (this.alreadyGet) {
              this.subscribe();
            }
          } else {
            Taro.showToast({
              title: '系统错误',
              icon: 'none',
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      logClick({ e, eid: goCoupon });
      utils.navigateToH5({
        page:
          Taro.getApp().h5RequestHost +
          `/coupon?from=miniapp&storeId=${this.state.storeId}&fromResult=1`,
      });
      // window.location.href = '/coupon';
    }
  };

  // 页面跳转
  handleAction(action) {
    if (!action || !action.toUrl) return;
    const buriedPointVo = action && action.buriedPointVo;
    commonLogClick({ action, buriedPointVo, storeId: this.state.storeId });
    goPage({
      action,
      buriedPointVo,
      storeId: this.state.storeId,
    });
  }

  //加车 是否弹框/直接加车
  onProductAddCart = (ev, data, e) => {
    const { resultData } = this.state;
    // 单独写e 是因为ev子组件传出来的 拿不到自定义的data
    let listPageIndex =
      e && e.currentTarget ? e.currentTarget.dataset.index : 0;
    // 加车统一结构埋点
    structureLogClick({
      eventId:
        resultData && resultData.payStatus === 5
          ? 'orderFailPage_recommend_addCart'
          : 'orderSuccessPage_recommend_addCart',
      jsonParam: {
        firstModuleId: 'recommendModule',
        firstModuleName: '更多推荐',
        clickType: 1,
        skuName: data.skuName,
        skuId: data.skuId,
        listPageIndex: listPageIndex,
        broker_info: data.brokerInfo ? data.brokerInfo : '',
      },
    });

    if (data.isPop === true) {
      this.setState({
        addCartPopData: data,
      });
    } else {
      this._addCart(data);
    }
  };

  /**
   * 获取购物车数量接口
   */
  getCartNum() {
    const { storeId } = this.state;
    getCartNum(storeId).then((res) => {
      this.setState({
        cartNum: res && res.allCartWaresNumber,
      });
    });
  }

  /**
   * 加车接口
   * @param {*} data 加车数据
   */
  _addCart(data) {
    // 鲜橙新埋点
    if (data.buriedPointVo && data.buriedPointVo.pageId && data.action) {
      commonLogClick({
        action: data.action,
        buriedPointVo: data.buriedPointVo,
      });
    }
    const { skuId, startBuyUnitNum = 1, serviceTagId = 0 } = data;
    addCartSever({
      data: {
        wareInfos: {
          skuId,
          buyNum: startBuyUnitNum | 1,
          serviceTagId: serviceTagId,
        },
        storeId: this.state.storeId,
      },
    })
      .then((res) => {
        if (res.success) {
          this.setState(
            {
              cartNum:
                res && res.allCartWaresNumber > 99
                  ? '99+'
                  : res.allCartWaresNumber,
              addCartPopData: '',
            },
            () => {
              Taro.showToast({
                title: '添加成功！',
                icon: 'none',
                duration: 2000,
              });
            }
          );
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

  //页面滑动方法
  onPageScroll = (e) => {
    this.setState({
      scrollTop: e.scrollTop,
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

  //获取订单满返劵数据
  getOrderCouponInfo() {
    const { orderId } = this.state;
    getOrderCouponInfoService({
      orderId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({
            couponAmountText: res.couponAmountText,
          });
        }
      })
      .catch((err) => {
        console.log('==订单满返劵接口报错== ' + err);
      });
  }

  goToRebateCoupon = () => {
    let { orderId, storeId } = this.state;
    const lbsData = Taro.getStorageSync('addressInfo') || {};
    utils.navigateToH5({
      page:
        Taro.getApp().h5RequestHost +
        `/coupon/rebate-coupon?from=miniapp&storeId=${storeId}&orderId=${orderId}&tenantId=${
          lbsData && lbsData.tenantId
        }`,
    });
  };

  //获取社群入口数据
  getCommunityData = () => {
    const storeId = getCurrentInstance().router.params.storeId;
    getRedisSocialGet({
      key: `mapping_wx_group_url_${storeId}`,
    })
      .then((res) => {
        //打开对应的公众号链接
        if (res && res.indexOf('http') > -1) {
          this.setState(
            {
              communityUrl: res,
            },
            () => {
              //曝光埋点
              this.communityExposure();
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 社群扩充流量入口
  goToCommunity = (e) => {
    logClick({ e, eid: `payment_communityEntrance` });
    if (this.state.communityUrl) {
      Taro.navigateTo({
        url: `/pages/my/concern/index?articleUrl=${encodeURIComponent(
          this.state.communityUrl
        )}`,
      });
    } else {
      Taro.showToast({
        title: '链接配置有误，请联系客服',
        icon: 'none',
        duration: 2000,
      });
    }
  };

  // 社区入口曝光
  communityExposure = () => {
    const targetDom = `#community-box`;
    const intersectionObserver = Taro.createIntersectionObserver(this.$scope);
    intersectionObserver
      .relativeTo('#result-page', { right: 0 })
      .observe(targetDom, () => {
        const params = {
          router: getCurrentInstance().router,
          eid: 'Payment_communityEntrance',
          eparam: {},
        };
        getExposure(params);
        intersectionObserver.disconnect();
      });
  };

  // 订单埋点入口
  initOrderLog = () => {
    const { resultData, orderId } = this.state;
    if (
      resultData &&
      (resultData.payStatus === 4 || resultData.payStatus === 5)
    ) {
      let logedOrderIdInSession = Taro.getStorageSync('logedOrderId'); // 格式以 , 分割的字符串
      if (
        logedOrderIdInSession &&
        logedOrderIdInSession.indexOf(orderId) > -1
      ) {
        //埋过
        getOrderDetailService({
          orderId,
          envType: 1, //1:7freshApp（默认） 2：京东app
        }).then((res) => {
          if (res && res.success) {
            this.setState({
              orderDetail: res,
            });
          }
        });
      } else {
        // 未埋过
        logedOrderIdInSession = `${
          logedOrderIdInSession ? `${logedOrderIdInSession},` : ''
        }${orderId}`;
        this.getOrderInfo();
      }
    }
  };

  // 获取订单详情
  getOrderInfo = () => {
    const { orderId } = this.state;
    getOrderDetailService({
      orderId,
      envType: 1, //1:7freshApp（默认） 2：京东app
    }).then((res) => {
      if (res && res.success) {
        this.setState(
          {
            orderDetail: res,
          },
          () => {
            if (
              res.orderDetailFlagInfoWeb &&
              res.orderDetailFlagInfoWeb.periodOrder
            ) {
              this.getPeriodInfo();
            } else {
              this.orderLog();
            }
          }
        );
      }
    });
  };

  /**
   * 定期送订单
   */
  getPeriodInfo = () => {
    const { orderId, tenantInfo, state } = this.state.orderDetail;
    getPeriodInfoService({
      orderId: orderId,
      state: state,
      tenantId: tenantInfo && tenantInfo.tenantId,
    }).then((res) => {
      console.log('res.periodOrder', res.periodOrder);
      if (res.success && res.periodOrder) {
        this.setState(
          {
            periodOrder: res.periodOrder,
          },
          () => {
            this.orderLog();
          }
        );
      }
    });
  };

  /** 订单埋点
   *  订单埋点修改如下：
   * 1.增加商品数量字段格式如下："prod_id" ："100111 #1+100112#2+100113#3"   称重商品按克报  如500g   1kg换算成1000g
   * 2.上报时机修改，改为支付成功之后上报
   * 3.增加字段order_ts，order_time  具体字段含义见文档(http://bdp.jd.com/dataassets/table/detail.html?cluster=sc&linuxUser=mart_sc&dbName=adm&tbName=adm_7fresh_d04_online_log_import_order_di_test)
   *
   */
  orderLog = () => {
    const { orderId, orderDetail = {} } = this.state;
    const { orderMoneyInfoWeb, orderCreateTime, showOrderCreateTime } =
      orderDetail;
    const skuIdInfo = this.getSkuList();
    let logedOrderId = Taro.getStorageSync('logedOrderId'); // 格式以 , 分割的字符串
    logedOrderId = logedOrderId ? `${logedOrderId},${orderId}` : `${orderId}`;
    Taro.setStorageSync('logedOrderId', logedOrderId);

    // 订单埋点
    logOrder({
      eid: 'order_paySuccess',
      orderid: orderId,
      total:
        (orderMoneyInfoWeb && orderMoneyInfoWeb.orderTotalAmount) ||
        (orderMoneyInfoWeb && orderMoneyInfoWeb.shouldPrice),
      orderList: skuIdInfo.skuIdObj,
      ext: {
        sale_ord_id: orderId,
        order_ts: orderCreateTime,
        order_time: showOrderCreateTime,
        order_total_fee:
          (orderMoneyInfoWeb && orderMoneyInfoWeb.orderTotalAmount) ||
          (orderMoneyInfoWeb && orderMoneyInfoWeb.shouldPrice),
        prod_id: skuIdInfo.skuIdString,
      },
    });
  };

  // 获取商品sku列表
  getSkuList = () => {
    const { orderDetail = {}, periodOrder } = this.state;
    const { orderSkuGroupWebList } = orderDetail;
    let skuId = [];
    const skuIdObj = {};
    if (orderSkuGroupWebList && orderSkuGroupWebList.length > 0) {
      for (let i = 0; i < orderSkuGroupWebList.length; i++) {
        const orderSkuInfoWebList = orderSkuGroupWebList[i].orderSkuInfoWebList;
        if (orderSkuInfoWebList && orderSkuInfoWebList.length > 0) {
          for (let j = 0; j < orderSkuInfoWebList.length; j++) {
            const skuInfo = orderSkuInfoWebList[j];
            if (skuInfo) {
              const skuNum = periodOrder
                ? this.getPeriodOrderNum(skuInfo.convertBuryUnit)
                : skuInfo.buryPointAmount;
              skuId.push(`${skuInfo.skuId}#${skuNum}`);
              skuIdObj[skuInfo.skuId] = skuNum;
            }
          }
        }
      }
    }
    return {
      skuIdString: skuId.join('+'),
      skuIdObj,
    };
  };

  // 单位g需换算成kg convertBuryUnit 是否需要转换
  getPeriodOrderNum = (convertBuryUnit) => {
    const { periodOrder } = this.state;
    let result = 1;
    if (periodOrder && periodOrder.periods && periodOrder.realBuyNum) {
      result = periodOrder.periods * periodOrder.realBuyNum;
      if (convertBuryUnit) {
        result = result / 1000;
      }
    }
    return result;
  };
  //关闭新人任务弹窗
  closeAwardModal = (type) => {
    console.log('close Modal', type);
    const { newPersonRes, magic } = this.state;
    const eventId =
      type === 'know'
        ? 'paySuccessPage_newUserTaskPopWindow_clickIKnow'
        : 'paySuccessPage_newUserTaskPopWindow_clickClose';
    structureLogClick({
      eventId: eventId,
      jsonParam: {
        firstModuleId: 'newUserTaskPopWindow',
        firstModuleName: '新人任务弹窗',
        clickType: -1,
        activityId: newPersonRes && newPersonRes.actId,
        taskId:
          newPersonRes &&
          newPersonRes.taskAwardInfo &&
          newPersonRes.taskAwardInfo.taskId,
        batchId: magic,
      },
    });
    this.setState({
      showAwardModal: false,
    });
  };

  onGoMoreTask = () => {
    const { newPersonRes, storeId, magic } = this.state;
    let eventId = '';
    if (newPersonRes && newPersonRes.magicAwardInfo) {
      eventId = 'paySuccessPage_newUserTaskPopWindow_clickToLookFreeGift';
    } else {
      // 继续挑战
      if (newPersonRes && newPersonRes.taskCount === 2) {
        eventId = 'paySuccessPage_newUserTaskPopWindow_continueChallenge';
      } else {
        // 去领任务
        eventId = 'paySuccessPage_newUserTaskPopWindow_clickToGetTask';
      }
    }
    structureLogClick({
      eventId: eventId,
      jsonParam: {
        firstModuleId: 'newUserTaskPopWindow',
        firstModuleName: '新人任务弹窗',
        clickType: -1,
        activityId: newPersonRes && newPersonRes.actId,
        taskId:
          newPersonRes &&
          newPersonRes.taskAwardInfo &&
          newPersonRes.taskAwardInfo.taskId,
        batchId: magic,
      },
    });
    utils.redirectToH5({
      page: `${app.h5RequestHost}/newPerson?storeId=${storeId}`,
    });
  };

  //  新人一转N弹窗
  newUserTaskPaySuccess() {
    let orderId = getCurrentInstance().router.params.orderId || '';
    let params = {
      orderId: orderId,
    };
    console.log('orderId-------------------------', orderId);
    getNewUserTaskPaySuccess(params)
      .then((res) => {
        console.log('[getNewUserTaskPaySuccess]', res);
        if (res && res.taskAwardInfo) {
          let magic = '';
          res.magicAwardInfo &&
            res.magicAwardInfo.batchIdList &&
            res.magicAwardInfo.batchIdList.length > 0 &&
            res.magicAwardInfo.batchIdList.map((item) => {
              magic += item + '+';
            });
          if (res.taskAwardInfo.couponInfoWeb) {
            magic += res.taskAwardInfo.couponInfoWeb.batchId;
          }
          this.setState({
            showAwardModal: true,
            noNewPerson: false,
            newPersonRes: res,
            magic: magic,
          });
          const jsonParam = {
            router: getCurrentInstance().router,
            eid: 'payment_newUserTaskEntrance',
            eparam: {
              eventId: 'payment_newUserTaskEntrance',
              activityId: res.actId,
              taskId: res.taskAwardInfo.taskId,
            },
          };
          getExposure(jsonParam);
        } else {
          this.setState({
            noNewPerson: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          noNewPerson: true,
        });
      });
  }

  // 客服回调
  handleContact = (e) => {
    console.log('handleContact', e);
  };
  handleCopy = () => {
    // let ordervalue = e.currentTarget.dataset.pass;
    let ordervalue = JSON.stringify(this.state.redPassword.command);
    if (ordervalue !== 'null') {
      /*
       * https://cf.jd.com/pages/viewpage.action?pageId=412685833
       * 20210127 zmh
       */
      structureLogClick({
        eventId: 'Passwordenvelope_Applets_Paymentclick',
        eventName: '小程序支付完成页口令红包点击',
        jsonParam: {
          clickType: '-1',
          pageId: '0046',
          pageName: '支付结果页',
          tenantId: `${this.state.tenantId}`,
          storeId: `${this.state.storeId}`,
          platformId: '1',
          clickId: 'Passwordenvelope_Applets_Paymentclick',
        },
      });
      Taro.setClipboardData({
        data: ordervalue.toString(),
        success() {
          console.log('复制成功');
        },
      });
    }
  };

  // 口令红包接口
  getQueryPaymentCommand = () => {
    let toUser = '';
    const wxUserInfo = Taro.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      toUser = JSON.parse(wxUserInfo).openid;
    }
    console.log('toUser', toUser);
    const data = {
      toUser: toUser,
    };
    getQueryPaymentCommand(data)
      .then((res) => {
        if (res.success) {
          if (res.status && res.status === 1) {
            this.setState(
              {
                redPassword: {
                  command: res.command,
                  imgUrl: res.imgUrl,
                },
              },
              () => {
                this.setState(
                  {
                    redPayCommand: true,
                  },
                  () => {
                    const params = {
                      router: getCurrentInstance().router,
                      eid: 'Passwordenvelope_Applets_payshow',
                      eparam: {
                        eventId: 'Passwordenvelope_Applets_payshow',
                      },
                    };
                    getExposure(params);
                  }
                );
              }
            );
          }
        }
      })
      .catch({});
  };

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
            // if(_this.state.welfareData && _this.state.welfareData.couponCodes){
            wx.requestSubscribeMessage({
              tmplIds: ['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'],
              success: function (data) {
                console.log('33333', data);
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
                      console.log('44444', _this.state.remindNum);
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
                console.log('333fail', data);
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
    const { tmplIds } = this.state;
    let uuid = '';
    const wxUserInfo = Taro.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const params = {
      templateId: tmplIds,
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
    const { tmplIds, subscriptionType } = this.state;
    const args = {
      templateId: tmplIds,
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

  goToMaotian = () => {
    const { storeId, tenantId } = this.state;
    const url = `${h5Url}/taste-wine?storeId=${storeId}&tenantId=${tenantId}`;
    utils.navigateToH5({ page: url });
  };

  render() {
    const {
      resultData,
      canShare,
      isCanShare,
      openType,
      // payGiftPackets,
      goodList,
      isAllshow,
      shareInfo,
      // shareFlag,
      orderLotteryPayResult,
      isShowSucImg,
      orderType,
      isLoad,
      // grouponList,
      payOrderInfo,
      groupInfoWeb,
      bagShareInfo,
      activityInfo,
      windowWidth,
      floors,
      addCartPopData,
      scrollTop,
      cartNum,
      pageStyle,
      couponAmountText,
      communityUrl,
      newPersonRes,
      showAwardModal,
      noNewPerson,
      suportNavCustom,
      orangeShareImg,
      redPayCommand,
      redPassword,
      remindFlag,
      restartFlag,
      tastMtInfo,
    } = this.state;
    const imgs =
      'https://m.360buyimg.com/img/jfs/t1/184360/17/4825/802/60a36d3cE4b5ac342/a7c3da9f0dc5f572.png';
    return (
      <View
        className='result-page'
        id='result-page'
        style={pageStyle}
        onPageScroll={this.onPageScroll}
      >
        {suportNavCustom && (
          <View className='top-cover'>
            <NavBar
              title={
                resultData && resultData.payStatus === 5
                  ? '支付失败'
                  : '支付成功'
              }
              showBack
              onBack={this.handleBack}
              skin='white'
            />
          </View>
        )}

        {/* 拼手气红包的弹框 */}
        {canShare && noNewPerson && orangeShareImg && (
          <View
            className='fixedModel'
            style={{
              zIndex: `${orderLotteryPayResult ? -2 : 10}`,
            }}
          >
            <View
              className='bag'
              style={{
                backgroundImage: `url(${orangeShareImg})`,
                width: px2vw(670),
                height: px2vw(800),
                left: px2vw(44),
              }}
            >
              <Button
                className='shareFriend button-hover'
                openType={openType}
                dataInfo={bagShareInfo}
                onClick={this.getUserInfo.bind(this)}
              >
                <Image src='https://m.360buyimg.com/img/jfs/t1/166622/29/4607/23413/6010c300Eee9f3eb9/1e676c037b0ad2b7.png' />
              </Button>
            </View>
            <View
              className='bag-close'
              style={{
                top: px2vw(1104),
              }}
              onClick={this.bagClose.bind(this)}
            >
              <View className='orangebagClose' />
            </View>
          </View>
        )}

        {orderLotteryPayResult && <View className='fixOrder' />}

        {/* 拼手气弹窗右侧小浮标 - 不是接龙单，没有命中订单抽大奖 */}
        {orderType !== 'solitaire' && isCanShare && !orderLotteryPayResult && (
          <View className='p-icon'>
            {/* <Button */}
            <View
              className='bagIcon'
              role='redBag'
              openType={openType}
              dataInfo={bagShareInfo}
              onClick={this.getUserInfoClick.bind(this)}
            ></View>
          </View>
        )}

        <View className='result-bg'>
          {/* 拼团楼层 */}
          {groupInfoWeb &&
            groupInfoWeb.endTime > 0 &&
            resultData &&
            resultData.payStatus !== 5 &&
            groupInfoWeb.needCount !== 0 && (
              <FreshFightResultInfo
                endTime={groupInfoWeb.payDate}
                payOrderInfo={{ groupInfoWeb }}
                resource='result'
                openType={openType}
                dataInfo={shareInfo}
                onClick={this.getUserInfo.bind(this)}
              />
            )}

          {/* 拼团成功支付结果信息 */}
          {groupInfoWeb && groupInfoWeb.needCount === 0 && (
            <FreshPayFightResult
              payOrderInfo={{ groupInfoWeb }}
              resource='result'
              payStatus={resultData && resultData.payStatus}
              onGoHome={this.onGoHome.bind(this)}
              onSearchOrder={this.searchOrder.bind(this)}
            />
          )}
        </View>

        {/* 支付结果金额等主信息 */}
        {payOrderInfo && !groupInfoWeb && (
          <View className='groupon-pay-price'>
            <View className='groupon-pay-success'>
              <FreshPayResult
                price={
                  payOrderInfo && payOrderInfo.payAmount
                    ? Number(payOrderInfo.payAmount)
                    : 0.0
                }
                status={resultData && resultData.payStatus}
              />
            </View>
            <View className='groupon-pay-price-top'>
              {resultData && resultData.payStatus === 4 ? (
                <View>
                  {payOrderInfo && payOrderInfo.deliveryInfo && (
                    <View className='word'>
                      {payOrderInfo && payOrderInfo.deliveryInfo}
                    </View>
                  )}
                  {payOrderInfo.payDiscount > 0 && (
                    <View className='word'>
                      支付优惠：
                      <Text className='red'>-￥{payOrderInfo.payDiscount}</Text>
                    </View>
                  )}
                  {payOrderInfo &&
                    payOrderInfo.amountItemList &&
                    payOrderInfo.amountItemList.length > 0 && (
                      <View className='amount-list'>
                        <FreshPayResultDetail
                          list={payOrderInfo.amountItemList}
                        />
                      </View>
                    )}
                </View>
              ) : (
                <View>{resultData && resultData.payStatusDesc}</View>
              )}
            </View>
            {couponAmountText && (
              <View className='ac-coupon-tips' onClick={this.goToRebateCoupon}>
                <Text className='coupon-icon'></Text>
                <Text className='coupon-txt'>{couponAmountText}</Text>
                <Text className='coupon-arrow'></Text>
              </View>
            )}

            {tastMtInfo && (
              <View className='maotai-outbox'>
                <View className='maotai-pickcode'>
                  <View className='title'>{tastMtInfo.title}</View>
                  <View className='line' />
                  <View className='code'>{tastMtInfo.proofCode}</View>
                  <View className='descs'>
                    <View className='desc-inner'>
                      <Image
                        className='imgs'
                        src={filterImg(imgs)}
                        alt='七鲜'
                      />
                      {tastMtInfo.expireTimeDesc}
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View className='groupon-pay-btn'>
              {!tastMtInfo && (
                <View
                  className='grey-btn mr24'
                  onClick={this.goToList.bind(this)}
                >
                  {activityInfo && activityInfo.keepSolitaire
                    ? '继续接龙'
                    : '首页逛逛'}
                </View>
              )}
              {tastMtInfo && (
                <View
                  className='grey-btn green mr24'
                  onClick={this.goToMaotian.bind(this)}
                >
                  返回活动页
                </View>
              )}

              {payOrderInfo && payOrderInfo.orderType === 16 ? (
                <View
                  className=' grey-btn grey-btn-card'
                  onClick={this.onBindCard.bind(this)}
                >
                  去绑卡
                </View>
              ) : (
                <View
                  className='grey-btn'
                  onClick={this.searchOrder.bind(this)}
                >
                  查看订单
                </View>
              )}
              {/* <View className='grey-btn' onClick={this.searchOrder.bind(this)}>
                查看订单
              </View> */}
            </View>
          </View>
        )}

        {orderType === 'group' && groupInfoWeb && (
          <View className='result-content'>
            <FreshPayOrderPanel
              orderData={payOrderInfo}
              payDate={groupInfoWeb.payDate}
              onClick={this.searchOrder.bind(this)}
            />
          </View>
        )}

        {/**接龙推荐 */}
        {orderType === 'solitaire' && (
          <View>
            <View className='groupon-recommend'>
              <View className='groupon-title'>
                <FreshSeatTitle title='接龙推荐' />
              </View>
              <View className='groupon-model'>
                {goodList &&
                  goodList.map((item, k) => {
                    return (
                      <View key={k}>
                        {(isAllshow ? true : k < 2) && (
                          <View className='groupon-back-card'>
                            <BackProduct
                              data={item.skuInfo}
                              productDescription={
                                item.commanderInfo
                                  ? item.commanderInfo.recommendation
                                  : ''
                              }
                              alreadyCount={`已接龙${item.skuSalesInfo.historyCount}件`}
                              type='litter'
                              onClick={this.goDetail.bind(this, item)}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                {!isAllshow && (
                  <View className='groupon-back-all'>
                    <FreshSearchAll
                      text='查看全部'
                      onClick={this.SearchAll.bind(this)}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/**订单抽奖弹框*/}
        {orderLotteryPayResult && isShowSucImg && noNewPerson && (
          <View className='suc-img-container'>
            <View class='suc-img-main'>
              <Image
                class='suc-img'
                src={orderLotteryPayResult.imageUrl}
                onClick={this.gotoUrl.bind(this)}
              />
              <Image
                class='close'
                onClick={this.closeSucImg}
                src='https://m.360buyimg.com/img/jfs/t1/10349/24/14101/2325/5c87d0c4Ecb11e278/acf83602a7908ba1.png'
              />
            </View>
          </View>
        )}

        {isLoad && (
          <Loading
            width={wx.getSystemInfoSync().windowWidth}
            height={wx.getSystemInfoSync().windowHeight}
            tip='加载中...'
          />
        )}

        {/* 社群扩充流量入口v1.0--接龙不显示 */}
        {orderType !== 'solitaire' && communityUrl && (
          <View id='community-box' onClick={this.goToCommunity}>
            <Image
              className='community'
              src='//m.360buyimg.com/img/jfs/t1/129101/34/18521/142197/5fb1edb7E3103216e/0065a8a268226b87.png'
            />
          </View>
        )}

        {/* 口令红包入口 */}
        {redPayCommand && (
          <Button
            openType='contact'
            sendMessageTitle='上七鲜，享受精致生活'
            sendMessagePath='/pages/index/index'
            showMessageCard='true'
            sessionFrom='Passwordpay'
            onContact={this.handleContact}
            className='kefu'
            onClick={this.handleCopy}
            data-pass={redPassword.command}
          >
            <Image className='Image' src={redPassword.imgUrl} lazyLoad />
          </Button>
        )}

        {/* 商品组展示 */}
        <View className='result-product-list'>
          {orderType !== 'solitaire' &&
            floors &&
            floors.map((val, index) => {
              return (
                <View className='result-list' key={`${index}`}>
                  {val.floorType === 19 && (
                    <FloorNotice
                      data={val}
                      windowWidth={windowWidth}
                      onGoToUrl={this.handleAction.bind(this)}
                    />
                  )}
                  {val.floorType === 86 && (
                    <FreshFloorCouponGroup
                      data={val}
                      onClick={this.getCoupon}
                    />
                  )}
                  <View className='result-product-item' key={index}>
                    {val.floorType === 16 &&
                      val.items &&
                      // eslint-disable-next-line no-shadow
                      val.items.map((info, m) => {
                        return (
                          <View className='pro-item-style' key={`${m}`}>
                            <FreshProductItem
                              type={2}
                              addType={1}
                              data={info}
                              data-index={`${m}`}
                              onGoDetail={this.onGoDetail}
                              onAddCart={this.onProductAddCart}
                              onGoCardOrder={this.goCardOrder}
                            />
                          </View>
                        );
                      })}
                  </View>
                </View>
              );
            })}
        </View>
        {addCartPopData && (
          <FloorAddCart
            data={addCartPopData}
            onAddCart={this._addCart}
            onClose={this.onCloseAddCartPop}
          />
        )}

        {/** 返回顶部和返回首页 */}
        {scrollTop > 100 && (
          <View className='goTop'>
            <FreshFloatBtn
              type='top'
              title='顶部'
              color='rgb(94, 100, 109)'
              onClick={this.goTop.bind(this)}
            />
          </View>
        )}
        <View className='cart-icon' onClick={this.goCart}>
          <View className='cart-image' />
          {!!cartNum && (
            <View className='cart-num'>{cartNum < 100 ? cartNum : '99+'}</View>
          )}
        </View>

        {/* 新人任务 */}
        {showAwardModal && newPersonRes && (
          <View>
            <View className='newpersonOuter'>
              <NewPersonResultModal
                isHome={false}
                data={newPersonRes}
                show={showAwardModal}
                onClose={this.closeAwardModal}
                onGoMoreTask={this.onGoMoreTask}
              />
            </View>
            <View id='pay-result-newUserTask'></View>
          </View>
        )}

        {/* 页面底部七鲜拖底图 */}
        {!isLoad && (
          <View className='groupon-pay-bottom'>
            <FreshBottomLogo />
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
      </View>
    );
  }
}
