import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  View,
  Image,
  // Button
} from '@tarojs/components';
import {
  getSpellLuckShareService,
  // getRealUrlService,
  getRedPackageService,
  getCustomCommonFixedPage,
  getLoginStatus,
} from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import {
  gotoLogin, initShare, getRealUrl, pointResult
  // getURLParameter
} from './api'; // structureLogClick
import toUrlByType from './goPage';
import toUrlH5 from './goPage-h5';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import HandItem from './hand-item/index';
import RedInfo from './red-envelope-info/index';

import Modal from '../../components/modal';
import FloorNotice from '../../components/floor-notice';
import NavBar from '../../components/nav-bar';

import './index.scss';

let callApp;
if (process.env.TARO_ENV === 'h5') {
  callApp = require('../../utils/common/callApp');
}

export default class LuckRedEnvelopes extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBack: false,
      showGoHome: false,
      navSkin: 'black',
      suportNavCustom: false, //是否支持自定义导航栏

      windowWidth: 375,

      storeId: 0,
      orderId: null,
      businessId: null,

      floorsLuck: {}, // 鲜橙拼手气楼层对象
      floors: null,
      businessCode: -10000,
      // errorMsg: '请稍后，红包打开中...',
      errorMsg: '',

      couponList: [],
      userInfo: {},
      summaryList: null,

      orderShare: {},
      btnText: '去首页逛逛',
      btnShow: false, //下拉图标显示
      showModal: false,
      wechatAvatar: '',
      wechatNickName: '',
      qFreshImage:
        'https://m.360buyimg.com/img/jfs/t1/151581/25/10245/68613/5fdc75d2E05616b88/a98652eeef1a76ed.jpg', // 七鲜公众号
      qLiveImage:
        'https://m.360buyimg.com/img/jfs/t1/134781/39/6845/17525/5f320681E9b2dece3/25f103ce7794ffe1.png', //七鲜生活公众号

      iShowRule: false,
      ruleList: [
        '1.红包新老用户同享',
        '2.红包可与部分优惠叠加使用',
        '3.使用红包时的下单手机号需为抢红包时使用的手机号',
        '4.红包仅限在七鲜最新版客户端使用，下载APP后登录领取红包的手机号账户，下单时即可使用',
        '5.APP购物及门店购物时手机支付均可使用，每张订单仅限使用一张红包，红包不找零',
      ],
    };
  }
  storeId = '131229';
  orderId = '';
  businessId = '';
  pageState = 1;
  fixedPageId = '';


  UNSAFE_componentWillMount() {
    //埋点上报
    if (process.env.TARO_ENV === 'h5') {
      const pointsM = require('@7fresh/points/build/h5');
      pointsM.setPagePV();
      pointsM.init();

      // 曝光
      const json_p = {
        pageId: '0087',
        pageName: '拼手气红包',
        eventId: '拼手气红包详情页面展示',
      };
      window.expLogJSON(
        '0087',
        'Lucky_red_detail_show',
        JSON.stringify(json_p)
      );

      getLoginStatus()
        .then(res => {
          if (sessionStorage.getItem('loginMark')) {
            // 渠道单点曝光
            window.expLogJSON(
              '0087',
              'LoginSource',
              JSON.stringify({
                pageId: '0087',
                pageName: '拼手气红包',
                pentrance: '006',
                pentranceName: '拼手气红包引入',
                pextra: window.location.search.split('?')[1],
                isNewUser: res.isNewUser,
                plant: this.state.from ? this.state.from : 'h5',
                eventId: 'LoginSource',
              })
            );
          }
          sessionStorage.removeItem('loginMark');
        })
        .catch(() => {
          sessionStorage.setItem('loginMark', 1);
        });
    } else {
      const EP = require('../../utils/common/exportPointLuck');
      EP.exportPoint(getCurrentInstance().router);

      const params = {
        router: getCurrentInstance().router,
        eid: 'Lucky_red_detail_show',
        eparam: {},
      };
      pointResult().getExposure(params);

      getLoginStatus()
        .then(res => {
          if (Taro.getStorageSync('loginMark')) {
            // 渠道单点曝光
            let miniPoint = {
              router: getCurrentInstance().router,
              eid: 'LoginSource',
              eparam: {
                pageId: '0087',
                pageName: '拼手气红包',
                pentrance: '006',
                pentranceName: '拼手气红包引入',
                pextra: getCurrentInstance().router.params,
                isNewUser: res.isNewUser,
                plant: 'miniapp',
                eventId: 'LoginSource',
              },
            };
            pointResult().getExposure(miniPoint);
          }
          Taro.removeStorageSync('loginMark');
        })
        .catch(() => {
          Taro.setStorageSync('loginMark', 1);
        });
    }

    Taro.getSystemInfo().then(res => {
      if (res.platform === 'android') {
        this.setState({
          // appParameter: 'openapp.sevenfresh://',
          windowWidth: res.windowWidth,
        });
      }

      this.setState({
        suportNavCustom: res.version.split('.')[0] >= 7,
      });
    });
    this.setState({
      showBack: Taro.getCurrentPages().length > 1,
    });

    // 因为当时再分享的话会有string报错，所以小程序拼手气禁用分享
    Taro.hideShareMenu();

    let {
      scene = '',
      orderId = '',
      storeId = '131229',
      businessId = '',
      fixedPageId = '',
    } = getCurrentInstance().router.params;

    console.log('【拼手气红包】***地址栏参数***', getCurrentInstance().router.params);
    // 扫海报小程序码进入
    if (scene) {
      console.log('【拼手气红包】扫来源于朋友圈海报');
      this.setState({ showGoHome: true });
      getRealUrl(decodeURIComponent(scene))
        .then(res => {
          if (res) {
            console.log(
              '【拼手气红包】解码成功！解码值：',
              decodeURIComponent(res.code)
            );
            const data = {};
            const code = decodeURIComponent(res.code).split('&');
            code.forEach(item => {
              const value = item.split('=');
              data[value[0]] = value[1];
            });
            this.init(data);
          } else {
            console.log('【拼手气红包】解码失败！错误信息：', res);
            this.onError();
          }
        })
        .catch(err => {
          console.log('【拼手气红包】解码失败！错误信息：', err);
          this.onError();
        });
    } else {
      console.log('【拼手气红包】扫来源于朋友');
      this.init({
        orderId,
        businessId,
        storeId,
        fixedPageId,
      });
    }
  }

  componentDidShow() {
    Taro.hideShareMenu();
    this.onPageShow();
  }
  componentDidHide() {
    this.onPageHide();
  }
  onPullDownRefresh = () => {
    Taro.stopPullDownRefresh();
  };

  // 页面滚动
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
  };
  setNavSkin = skin => {
    this.setState({
      navSkin: skin,
    });
  };

  init = ({ orderId, businessId, storeId, fixedPageId }) => {
    if (!orderId && !businessId) {
      console.log('【拼手气红包】orderId或businessId为空');
      this.onError();
      return;
    }
    if (process.env.TARO_ENV === 'weapp') {
      this.orderId = orderId;
      this.businessId = businessId;
      this.fixedPageId = fixedPageId;
      getUserStoreInfo(storeId, '', '', '', 3)
        .then(res => {
          console.log('【拼手气红包】获取三公里定位成功！返回结果：', res);
          this.storeId = res && res.storeId > 0 ? res.storeId : '131229';
          this.getCustomCommonFixedPage();
          this.mainLogic();
        })
        .catch(err => {
          console.log('【拼手气红包】获取三公里定位失败！错误信息：', err);

          this.getCustomCommonFixedPage();
          this.mainLogic();
        });
    }
    if (process.env.TARO_ENV === 'h5') {
      const hash = window.location.hash;
      const search = hash.split('?')[1];
      const params = search.split('&');
      const businessQuery = params.filter(
        param => param.indexOf('businessId') > -1
      );
      let _businessId = businessId;
      if (businessQuery.length > 0) {
        _businessId = params
          .filter(param => param.indexOf('businessId') > -1)[0]
          .replace('businessId=', '');
        _businessId = encodeURIComponent(_businessId);
      }
      this.businessId = _businessId;

      const fixedPageIdQuery = params.filter(
        param => param.indexOf('fixedPageId') > -1
      );
      let _fixedPageId = '';
      if (fixedPageIdQuery.length > 0) {
        _fixedPageId = params
          .filter(param => param.indexOf('fixedPageId') > -1)[0]
          .replace('fixedPageId=', '');
        _fixedPageId = encodeURIComponent(_fixedPageId);
      }
      this.fixedPageId = _fixedPageId;

      this.orderId = orderId;
      this.storeId = storeId;
      this.getCustomCommonFixedPage();
      this.mainLogic();
    }
  };

  // 鲜橙配置 拼手气红包自定义固定页
  getCustomCommonFixedPage = () => {
    getCustomCommonFixedPage({
      fixedPageId: this.fixedPageId,
      storeId: this.storeId,
    })
      .then(data => {
        console.log('【7fresh_custom_commonFixedPage】success:', data);
        if (data && data.success && data.floors) {
          this.setState({ floors: data.floors });
          const floorsLuck =
            data.floors && data.floors.filter(item => item.floorType === 98);
          const floorsNotice =
            data.floors && data.floors.filter(item => item.floorType === 19);
          if (floorsLuck && floorsLuck.length > 0) {
            this.setState({ floorsLuck: floorsLuck[0] }, () => { });
          }
          if (floorsNotice && floorsNotice.length > 0) {
            // 楼层曝光数据埋点
            let actionId = '';
            setTimeout(() => {
              floorsNotice &&
                floorsNotice.forEach((val, i) => {
                  if (process.env.TARO_ENV === 'weapp') {
                    // const params = {
                    //   obj: this,
                    //   id: `floor-${val.floorType}-${val.sort}-`,
                    //   num: 0,
                    //   eid: 'Lucky_red_activity_show',
                    //   data: {
                    //     ...val,
                    //     expAction: {
                    //       floorIndex: i + 1,
                    //       target: 1,
                    //       activtiid: actionId,
                    //     },
                    //   },
                    //   needOldPoints: false,
                    // };
                    // pointResult().getPageExposure(params);
                    const targetDom = `#floor-${val.floorType}-${val.sort}`;
                    const intersectionObserver = Taro.createIntersectionObserver(
                      this.$scope
                    );
                    intersectionObserver
                      .relativeToViewport({ bottom: 0 })
                      .observe(targetDom, () => {
                        const params = {
                          router: getCurrentInstance().router,
                          eid: 'Lucky_red_activity_show',
                          eparam: {
                            floorIndex: i + 1,
                            target: 1,
                            activtiid: this.getAcId(val.action.toUrl),
                          },
                        };
                        pointResult().getExposure(params);
                        intersectionObserver.disconnect();
                      });
                  }
                  if (process.env.TARO_ENV === 'h5') {
                    const json_p = {
                      pageId: '0087',
                      pageName: '拼手气红包',
                      eventId: '拼手气红包页面活动展示',
                      activtiid: actionId,
                    };
                    window.expLogJSON(
                      '0087',
                      'Lucky_red_activity_show',
                      JSON.stringify(json_p)
                    );
                  }
                });
            }, 500);
          }
        }
      })
      .catch(err => {
        console.log('【7fresh_custom_commonFixedPage】err:', err);
      });
  };

  getAcId = link => {
    let reg,
      group,
      arr = [],
      acId = '';
    reg = new RegExp('(\\?|&)' + 'id' + '=([^&]*)', 'g');
    group = link.match(reg);
    if (group) {
      for (let i = 0; i < group.length; i++) {
        let idx = group[i].indexOf('='),
          value = group[i].substr(idx + 1);
        if (value) {
          try {
            value = decodeURIComponent(value);
          } catch (e) {
            value = '';
          }
          arr.push(value);
        }
      }
    }
    acId = arr && arr[0] ? arr[0] : '';
    return acId;
  };

  // 获取微信权限
  mainLogic = () => {
    if (process.env.TARO_ENV === 'weapp') {
      let that = this;
      wx.showModal({
        title: '温馨提示',
        content: '需微信登录授权领取',
        success(ress) {
          //如果用户点击了确定按钮
          if (ress.confirm) {
            if (wx && wx.getUserProfile) {
              wx.getUserProfile({
                desc: '获取你的昵称及头像信息',
                success: res => {
                  if (
                    res &&
                    res.userInfo &&
                    res.userInfo.nickName &&
                    res.userInfo.avatarUrl
                  ) {
                    that.setState(
                      {
                        wechatNickName: res.userInfo.nickName || '',
                        wechatAvatar: res.userInfo.avatarUrl || '',
                      },
                      () => {
                        that.getLoginStatus();
                      }
                    );
                  }
                },
                fail: resb => {
                  console.log('拒绝授权', resb);
                  //拒绝授权
                  wx.showToast({
                    title: '您拒绝了请求',
                    icon: 'error',
                    duration: 2000,
                  });
                  return;
                },
              });
            } else {
              Taro.getUserInfo()
                .then(res => {
                  console.log('【拼手气红包】获取用户信息成功！', res.userInfo);
                  if (
                    res &&
                    res.userInfo &&
                    res.userInfo.nickName &&
                    res.userInfo.avatarUrl
                  ) {
                    that.setState(
                      {
                        wechatNickName: res.userInfo.nickName || '',
                        wechatAvatar: res.userInfo.avatarUrl || '',
                      },
                      () => {
                        that.getLoginStatus();
                      }
                    );
                  }
                })
                .catch(err => {
                  console.log(
                    '【拼手气红包】获取用户信息失败！显示弹窗设置权限',
                    err
                  );
                  that.setState({
                    showModal: true,
                  });
                });
            }
          } else if (ress) {
            //如果用户点击了取消按钮
            console.log('取消', ress);
            wx.showToast({
              title: '您拒绝了请求',
              icon: 'error',
              duration: 2000,
            });
            return;
          }
        },
      });
    }
    if (process.env.TARO_ENV === 'h5') {
      this.getLoginStatus();
    }
  };

  // 判断登录-是否进入自动流程
  getLoginStatus = () => {
    getLoginStatus()
      .then(res => {
        if (res && res.success) {
          this.getRedPackage();
        }
      })
      .catch(err => console.log(err));
  };

  // 用户信息
  openSetting = e => {
    console.log(
      '【拼手气红包】授权后得到的用户信息：',
      e.currentTarget.userInfo
    );
    this.setState(
      {
        showModal: false,
        wechatAvatar:
          e &&
            e.currentTarget &&
            e.currentTarget.userInfo &&
            e.currentTarget.userInfo.avatarUrl
            ? e.currentTarget.userInfo.avatarUrl
            : '',
        wechatNickName:
          e &&
            e.currentTarget &&
            e.currentTarget.userInfo &&
            e.currentTarget.userInfo.nickName
            ? e.currentTarget.userInfo.nickName
            : '',
      },
      () => {
        this.getRedPackage();
      }
    );
  };

  getRedPackage = () => {
    const { wechatNickName, wechatAvatar } = this.state;
    getRedPackageService({
      businessId: this.orderId ? this.orderId : this.businessId,
      storeId: this.storeId,
      type: this.orderId ? 1 : 2,
      wechatNickName: wechatNickName,
      wechatAvatar: wechatAvatar,
    })
      .then(res => {
        console.log(
          '【拼手气红包】【7fresh.spellLuck.claimWelfare】领取红包请求成功:',
          res
        );
        if (res.code === 3) {
          this.pointsBtn('nologin');
          gotoLogin({
            orderId: this.orderId,
            storeId: this.storeId,
            businessId: this.businessId,
            fixedPageId: this.fixedPageId,
          });
          return;
        }

        this.pointsBtn('login');

        this.setState({
          couponList: res.coupons || [],

          userInfo: {
            mobile: res.mobile,
            nickname: res.nickname,
          },
          summaryList: res.summaryList || [],
          btnShow: res.summaryList && res.summaryList.length > 3,
          businessCode: res.businessCode || null,
        });

        if (!res.success) {
          /**
           * businessCode 枚举
           * 120001: 订单不存在
           * 120002: 活动已结束
           * 120003: 订单已领取完
           * 120004: 订单已过期
           * 120005: 优惠券不存在
           * 120006: 该用户已领取优惠券
           */
          if (res.businessCode === 120006) {
            this.pageState = 2;
            Taro.showToast({
              title: res.msg || '已经领过这个红包了哦～',
              duration: 3000,
              icon: 'none',
            });
            this.getOrderShare();
          } else {
            Taro.hideShareMenu();
            this.pageState = 3;
            this.setState({
              btnText: '去首页逛逛',
              errorMsg: res.msg || '红包已经被抢光了',
            });
          }

          if (res.businessCode === 120003) {
            if (process.env.TARO_ENV === 'weapp') {
              const params = {
                router: getCurrentInstance().router,
                eid: 'Lucky_red_detail_Allthelooting_show',
                eparam: {},
              };
              pointResult().getExposure(params);
            }
            if (process.env.TARO_ENV === 'h5') {
              // 曝光
              const json_p = {
                pageId: '0087',
                pageName: '拼手气红包',
                eventId: '拼手气优惠券被抢完点击展示',
              };
              window.expLogJSON(
                '0087',
                'Lucky_red_detail_Allthelooting_show',
                JSON.stringify(json_p)
              );
            }
          }
        } else {
          if (res && res.summaryList && res.summaryList.length > 0) {
            this.pageState = 2;
          } else {
            this.pageState = 3;
          }
          // 提前获取分享信息
          this.getOrderShare();
        }
      })
      .catch(err => {
        console.log(
          '【拼手气红包】【7fresh.spellLuck.claimWelfare】领取红包失败:',
          err
        );
        if (err.code === 3) {
          this.pointsBtn('nologin');
          gotoLogin({
            orderId: this.orderId,
            storeId: this.storeId,
            businessId: this.businessId,
            fixedPageId: this.fixedPageId,
          });
          return;
        }
      });
  };

  pointsBtn = str => {
    pointResult().structureLogClick({
      eventId: 'Lucky_red_detail_receive',
      eventName: '拼手气红包页面领取点击',
      owner: 'ruanwei',
      jsonParam: {
        clickType: '-1',
        pageId: '0087',
        pageName: '拼手气红包',
        clickId: 'Lucky_red_detail_receive',

        status: str,
      },
    });
  };

  /**
   * 右上角转发事件
   */
  onShareAppMessage = () => {
    const { title, bigImageUrl } = this.state.orderShare;
    const pageUrl = `/pages/luck-red-envelopes/index?storeId=${this.state.storeId}&orderId=${this.state.orderId}&businessId=${this.state.businessId}`;

    /**
     * https://cf.jd.com/pages/viewpage.action?pageId=421782465
     */
    pointResult().structureLogClick({
      eventId: 'Lucky_red_share',
      eventName: '拼手气红包分享',
      owner: 'ruanwei',
      jsonParam: {
        clickType: '-1',
        pageId: '0087',
        pageName: '拼手气红包',
        clickId: 'Lucky_red_share',

        clicksource: 'WeChat',
      },
    });
    return {
      title: title ? title : '拼手气红包',
      imageUrl:
        bigImageUrl && bigImageUrl.indexOf('http') > -1
          ? bigImageUrl
          : bigImageUrl
            ? `https:${bigImageUrl}`
            : null,
      path: `/pages/index/index?returnUrl=${encodeURIComponent(pageUrl)}`,
    };
  };

  onError = () => {
    this.setState({
      errorMsg: '红包已经被抢光了',
      businessCode: -1,
      btnText: '去七鲜逛逛',
    });
  };

  // 状态点击按钮
  onGoButton = () => {
    const { floorsLuck, businessCode } = this.state;
    // const acId = this.getAcId(floorsLuck.buttonLink);

    // 去领取
    if (this.pageState === 1) {
      this.getRedPackage();
    }
    // 去跳转活动页
    if (this.pageState === 2) {
      pointResult().structureLogClick({
        eventId: 'Lucky_red_detail_receive_shopping',
        eventName: '拼手气红包页面领取红包成功点击去逛逛',
        owner: 'ruanwei',
        jsonParam: {
          clickType: '-1',
          pageId: '0087',
          pageName: '拼手气红包',
          clickId: 'Lucky_red_detail_receive_shopping',
        },
      });

      // 跳转逻辑
      if (floorsLuck && floorsLuck.buttonLink) {
        if (process.env.TARO_ENV === 'weapp') {
          // ev.stopPropagation();
          toUrlByType(
            { urlType: '210', toUrl: floorsLuck.buttonLink },
            this.storeId
          );
        }
        if (process.env.TARO_ENV === 'h5') {
          // ev.stopPropagation();
          toUrlH5(
            { urlType: '210', toUrl: floorsLuck.buttonLink },
            this.storeId
          );
        }
      }
    }

    // 去首页
    if (this.pageState === 3) {
      pointResult().logClick({ eid: '7FRESH_miniapp_2_1551092070962|23' });
      if (businessCode === 120003) {
        pointResult().structureLogClick({
          eventId: 'Lucky_red_detail_Allthelooting_click',
          eventName: '拼手气优惠券被抢完点击去首页',
          owner: 'ruanwei',
          jsonParam: {
            clickType: '-1',
            pageId: '0087',
            pageName: '拼手气红包',
            clickId: 'Lucky_red_detail_Allthelooting_click',
          },
        });
      }
      if (process.env.TARO_ENV === 'weapp') {
        Taro.switchTab({
          url: '/pages/index/index',
        });
        return;
      } else {
        if (process.env.TARO_ENV === 'h5') {
          if (api.getURLParameter('sw') != 1) {
            const app = new callApp({
              scheme: `openapp.sevenfresh://virtual?params={"category":"jump","des":"home"}`,
              timeout: 3000,
              success: function () { },
              error: function () {
                window.location.href = 'https://7fresh.m.jd.com/download.html';
              },
            });
            app.call();
          } else {
            window.location.href = 'https://7fresh.m.jd.com/download.html';
          }
        }
      }
    }
  };

  //点击回退事件
  handleBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      Taro.switchTab({
        url: '/pages/index/index',
      });
    }
  };

  /**
   * 跳转活动规则页
   */
  rule = () => {
    pointResult().logClick({ eid: '7FRESH_miniapp_2_1551092070962|21' });
    this.setState({ iShowRule: true });
    // Taro.navigateTo({
    //   url: '/pages/luck-red-envelopes/luck-hand-rule/index',
    // });
  };

  onUnShowRule = () => {
    this.setState({ iShowRule: false });
  };

  /**
   * 显示更多按钮
   */
  more = () => {
    this.setState({
      btnShow: false,
    });
  };

  // 页面跳转
  handleAction = (buriedPointVo, action, ev) => {
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    }
    if (action && action.toUrl) {
      const acId = this.getAcId(action.toUrl) || '';
      pointResult().structureLogClick({
        eventId: 'Lucky_red_activity_click',
        eventName: '拼手气红包页面活动点击',
        owner: 'ruanwei',
        jsonParam: {
          clickType: '-1',
          pageId: '0087',
          pageName: '拼手气红包',
          clickId: 'Lucky_red_activity_click',

          activtiid: acId,
        },
      });
    }
    pointResult().logClick({ eid: '7FRESH_miniapp_2_1551092070962|22' });
    if (!action) return;

    if (process.env.TARO_ENV === 'weapp') {
      toUrlByType(action, this.state.storeId);
    }
    if (process.env.TARO_ENV === 'h5') {
      toUrlH5(action, this.state.storeId);
    }
  };

  getOrderShare = () => {
    getSpellLuckShareService({
      orderId: this.state.orderId,
      activityId: this.state.businessId,
      type: this.state.orderId ? 1 : 2,
    }).then(res => {
      console.log('【拼手气红包】分享接口 getSpellLuckShareService:', res);
      if (!res.success) {
        Taro.hideShareMenu();
      } else {
        let orderShare = {
          title: res.title || '',
          bigImageUrl: res.bigImageUrl || '',
        };
        this.setState(
          {
            orderShare: orderShare ? orderShare : {},
          },
          () => {
            // if (process.env.TARO_ENV === 'weapp') {
            //   Taro.showShareMenu();
            //   if (res && !res.canShare) {
            //     Taro.hideShareMenu();
            //   }
            // }
          }
        );

        if (process.env.TARO_ENV === 'h5') {
          if (res && res.orderShare && res.isShare) {
            initShare({
              title: res.orderShare.title,
              desc: res.orderShare.content,
              link: res.orderShare.h5Url,
              imgUrl: res.orderShare.url,
            });
          }
        }
      }
    });
  };

  saveImage = (url, e) => {
    const qrCodePath = url;
    console.log(url);
    const _this = this;
    e.stopPropagation();
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //没有授权
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              _this.downloadImgToAlbum(qrCodePath);
            },
            fail: () => {
              _this.setState({
                //显示授权层
                openSetting: true,
              });
            },
          });
        } else {
          //已授权
          _this.downloadImgToAlbum(qrCodePath);
        }
      },
    });
  };

  downloadImgToAlbum = qrCodePath => {
    Taro.showToast({
      title: '正在保存，请稍等',
      icon: 'none',
      duration: 2000,
    });
    //下载图片
    this.downloadHttpImg(qrCodePath).then(res => {
      this.sharePosteCanvas(res);
    });
  };
  downloadHttpImg = httpImg => {
    return new Promise(resolve => {
      Taro.downloadFile({
        url: httpImg,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            Taro.showToast({
              title: '图片下载失败！',
              icon: 'none',
              duration: 1000,
            });
          }
        },
        fail: () => {
          Taro.showToast({
            title: '图片下载失败！',
            icon: 'none',
            duration: 1000,
          });
        },
      });
    });
  };
  sharePosteCanvas = imgUrl => {
    Taro.saveImageToPhotosAlbum({
      filePath: imgUrl,
      success() {
        Taro.showToast({
          title: '图片已保存到相册',
          icon: 'none',
          duration: 1000,
        });
      },
      fail() {
        Taro.showToast({
          title: '图片保存失败',
          icon: 'none',
          duration: 1000,
        });
      },
    });
  };

  onButtonText = () => {
    const { floorsLuck } = this.state;

    let text = '立即领取';
    if (this.pageState === 1) {
      text = '立即领取';
    }
    if (this.pageState === 2) {
      if (floorsLuck && floorsLuck.buttonText) {
        text = floorsLuck.buttonText;
      } else {
        text = '去活动会场逛逛';
      }
    }
    if (this.pageState === 3) {
      text = '去首页逛逛';
    }
    return text;
  };

  onHome = () => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.switchTab({
        url: '/pages/index/index',
      });
    }
  };

  // launchAppError = e => {
  //   e.stopPropagation(); // 阻止事件冒泡
  //   pointResult().logClick({ eid: '7FRESH_miniapp_2_1551092070962|23' });
  //   Taro.switchTab({
  //     url: '/pages/index/index',
  //   });
  //   return;
  // };

  // launchApp = () => {
  //   pointResult().logClick({ eid: '7FRESH_miniapp_2_1551092070962|23' });
  //   if (process.env.TARO_ENV === 'h5') {
  //     if (getURLParameter('sw') != 1) {
  //       const app = new callApp({
  //         scheme: `openapp.sevenfresh://virtual?params={"category":"jump","des":"home"}`,
  //         timeout: 3000,
  //         success: function() {},
  //         error: function() {
  //           window.location.href = 'https://7fresh.m.jd.com/download.html';
  //         },
  //       });
  //       app.call();
  //     } else {
  //       window.location.href = 'https://7fresh.m.jd.com/download.html';
  //     }
  //   }
  // };

  render() {
    const {
      suportNavCustom,
      navSkin,
      showBack,
      showGoHome,

      floors,
      floorsLuck,
      couponList,

      userInfo,
      summaryList,
      // btnText,
      businessCode,
      errorMsg,
      btnShow,
      windowWidth,
      qFreshImage,
      // qLiveImage,
      ruleList,
    } = this.state;
    return (
      <View className='luck-red-envelopes'>
        {/* 沉浸式 */}
        {suportNavCustom && process.env.TARO_ENV === 'weapp' && (
          <View className='nav-bar-box'>
            <NavBar
              title='拼手气红包'
              showBack={showBack}
              skin={navSkin}
              onBack={this.handleBack}
              showGoHome={showGoHome}
              onHome={this.onHome}
            />
          </View>
        )}

        {/* 顶部不占位效果图 */}
        <Image
          className='floor-top'
          src={`${floorsLuck && floorsLuck.bgImage
            ? floorsLuck.bgImage
            : 'https://m.360buyimg.com/img/jfs/t1/154572/25/17524/221840/6019234dEd8ae05af/35ed5c6d5776354d.png'
            }`}
          alt='七鲜'
        ></Image>

        {/* 框内信息展示 */}
        <View className='floor-top-zw'>
          <View className='rule' onClick={this.rule.bind(this)}>
            活动规则
          </View>

          {this.pageState === 1 && (
            <View className='before-receive-text'>
              <View>拼手气,</View>
              <View className='before-receive-price'>
                <View>随机获得</View>
                <View className='before-receive-price-num'>1~10</View>
                <View>元红包</View>
              </View>
            </View>
          )}
          {this.pageState === 1 && (
            <View className='before-receive-des'>
              注：不同门店红包面额会不一样哦
            </View>
          )}

          {/* TODO */}
          {businessCode === 10000 || businessCode === 120006 ? (
            <View>
              {couponList &&
                couponList.map((coupon, index) => {
                  return (
                    <View key={index.toString()}>
                      <RedInfo redInfo={coupon} userInfo={userInfo} />
                    </View>
                  );
                })}
            </View>
          ) : (
            <View></View>
          )}

          {this.pageState === 3 && (
            <View className='go-home-text'>
              <View>{errorMsg}</View>
              <View>去首页逛逛吧~</View>
            </View>
          )}
          {/* <View className='message'>{errorMsg}</View> */}

          {/* 按钮 */}
          <View className='info-btn' onClick={this.onGoButton.bind(this)}>
            <View>{this.onButtonText()}</View>
            {(this.pageState === 2 || this.pageState === 3) && (
              <View className='info-btn-icon' />
            )}
          </View>
        </View>

        {/* 领取人列表 */}
        <View className='feeling-lucky'>
          {/* 必加上占位box */}
          <View className='feeling-lucky-up-zw'>
            <View className='feeling-title'>
              <View className='feeling-img'></View>
              <View className='feeling-title-text'>看看好友的手气</View>
            </View>
          </View>

          {/* 领取列表卡片 */}
          <View className='feeling-lucky-down-zw'>
            <View className='feeling-lucky-box'>
              {this.pageState === 1 && (
                <View className='feeling-empty'>
                  <View className='feeling-empty-img'></View>
                  <View className='feeling-empty-text'>
                    登录后可查看全部领取情况~
                  </View>
                </View>
              )}

              {this.pageState === 3 &&
                !(summaryList && summaryList.length > 0) && (
                  <View className='feeling-empty'>
                    <View className='feeling-empty-img'></View>
                    <View className='feeling-empty-text'>
                      手气王还没出现！快来拼拼手气吧～
                    </View>
                  </View>
                )}

              {/* 手气组件层 */}
              <View
                className='handInfo'
                style={`padding-bottom: ${btnShow ? '0' : '10px'}`}
                onClick={this.more.bind(this)}
              >
                {btnShow &&
                  summaryList &&
                  summaryList.slice(0, 3).map((item, index) => {
                    return (
                      <HandItem key={index.toString()} redEnvelope={item} />
                    );
                  })}
                {!btnShow &&
                  summaryList &&
                  summaryList.map((item, index) => {
                    return (
                      <HandItem key={index.toString()} redEnvelope={item} />
                    );
                  })}

                {btnShow && <View className='hand-item-line' />}
                {btnShow && (
                  <View className='more-all'>
                    展开全部
                    <View className='more' />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 鲜橙通栏及二维码 */}
        <View>
          {floors &&
            floors.length > 0 &&
            floors.map((val, i) => {
              // 鲜橙新埋点,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
              const buriedPointVo = {
                ...val.buriedPointVo,
                floorIndex: i + 1,
              };
              val.buriedPointVo = buriedPointVo;
              val.floorIndex = i + 1;

              return (
                <View
                  // key={val.uuid | i}
                  key={i.toString()}
                  id={`floor-${val.floorType}-${val.sort}`}
                  style={{
                    marginTop: `${val.floorType === 19 ? '-1px' : '0'}`,
                  }}
                >
                  {/* 通栏 */}
                  {val.floorType === 19 && (
                    <FloorNotice
                      data={val}
                      windowWidth={windowWidth}
                      onGoToUrl={this.handleAction.bind(this, buriedPointVo)}
                    />
                  )}
                </View>
              );
            })}
          <View className='promotion-bg'>
            <View className='promotion'>
              扫码关注公众号，参与享福利
              <View className='promotionleft' />
              <View className='promotionright' />
            </View>
            <View className='nopublic'>
              <View className='freshInfo'>
                <Image
                  className='qrcodeImg'
                  src={qFreshImage}
                  onLongPress={this.saveImage.bind(this, qFreshImage)}
                />
                <View className='codeName'>七鲜公众号</View>
              </View>
              {/* <View className='fanInfo'>
                <Image
                  className='qrcodeImg'
                  src={qLiveImage}
                  onLongPress={this.saveImage.bind(this, qLiveImage)}
                />
                <View className='codeName'>七鲜生活公众号</View>
              </View> */}
            </View>
            <View className='nopublic-zw'></View>
            {/* <View className='underpin'>
              <View className='underpin-img'></View>
            </View> */}
          </View>
        </View>

        {this.state.showModal && (
          <Modal
            type='userInfo'
            content='我们需要获取权限，为你发放红包'
            onSetting={this.openSetting}
            show={this.state.showModal}
          />
        )}

        {this.state.iShowRule && (
          <View className='rule-model'>
            <View className='rule-content'>
              <View
                className='rule-title'
                onClick={this.onUnShowRule.bind(this)}
              >
                活动规则<View className='rule-img'></View>
              </View>

              <View className='rule-list'>
                {ruleList &&
                  ruleList.length > 0 &&
                  ruleList.map((val, i) => {
                    return (
                      <View className='rule-item' key={i.toString()}>
                        {val}
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        )}

        {/* todo头部红包优惠券信息 */}
        {/* <View className='redbgc'>
          <View className='couponInfo'></View>

          <View className='arc' />
          <View className='rule' onClick={this.rule.bind(this)}>
            活动规则
          </View>
        </View> */}

        {/* {process.env.TARO_ENV === 'weapp' ? (
          <Button
            className='btn'
            // openType={"launchApp"}
            // appParameter={this.state.appParameter}
            onClick={this.launchAppError}
          >
            {btnText}
          </Button>
        ) : (
          <Button className='btn' onClick={this.launchApp}>
            {btnText}
          </Button>
        )} */}
      </View>
    );
  }
}
