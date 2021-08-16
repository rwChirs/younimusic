import Taro, { getStorageSync,getCurrentInstance } from '@tarojs/taro';
import {
  View,
  Image,
  OpenData,
  Swiper,
  SwiperItem,
  Text,
} from '@tarojs/components';
import {
  getConfigService,
  getClubQueryUserInfo,
  getQueryFailedDrawService,
  isCouponOrderNewService,
  couponOrderConsumeService,
  getIsConcernService,
  getNewUserEntrance,
  getCartNum,
  getIntegralExpireIntegral,
} from '@7fresh/api';
import { logClick, structureLogClick } from '../../utils/common/logReport';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import utils from '../login/util.js';
import reportPoints from './reportPoints';
import links from './links';
import { filterImg, px2vw, formatDateTime } from '../../utils/common/utils';
import { getExposure, exportPoint } from '../../utils/common/exportPoint';
import { getPtPin } from '../../utils/adapter/index';
import CustomTabBar from '../../components/custom-tab-bar';
import NavBar from '../../components/nav-bar';
import NewPersonNavMine from '../../components/new-person-nav-mine';
import './index.scss';
const app = Taro.getApp().$app;
const plugin = Taro.requirePlugin('loginPlugin');

export default class My extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      myConfig: {},
      userInfo: {},
      isLogin: true, //先默认登录，然后在getConfig里判断是否登录
      isFirstOpen: true,
      isFailRecord: false,
      storeId: 0,
      tenantId: 1,
      isLoad: true,
      haveNewCoupon: false, //是否有新劵到账
      isIphoneX: false,
      isConcern: false,
      entranceData: '',
      time: '',
    };
  }

  currentUrl = '/pages/my/index';

  componentWillMount() {
    exportPoint(getCurrentInstance().router).then(unionId => {
      this.isFollowWx(unionId);
    });
    this.init();
    let clientRect = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        const model = res.model;
        const isIphoneX =
          /iphone\sx/i.test(model) ||
          (/iphone/i.test(model) && /unknown/.test(model)) ||
          /iphone\s11/i.test(model) ||
          /iphone\s12/i.test(model);
        console.log(clientRect, res.statusBarHeight);
        this.setState({
          isIphoneX,
          windowWidth: res.windowWidth,
          navHeight:
            (clientRect.bottom + clientRect.top - res.statusBarHeight) * 2,
        });
      },
    });
  }

  componentDidShow() {
    if (!this.state.isFirstOpen) {
      this.init();
    }
    this.setState({
      isFirstOpen: false,
    });

    const lbsData = getStorageSync('addressInfo') || {};
    this.setState(
      {
        storeId: lbsData.storeId || 131229,
        tenantId: lbsData.tenantId || 1,
      },
      () => {
        this.getFailRecord();
      }
    );
    this.getCartNum();
  }

  init = () => {
    getConfigService().then(res => {
      if (res) {
        this.setState(
          {
            myConfig: res.myConfig,
          },
          () => {
            // 是否倒计时
            const { myConfig } = res;
            const { myOrderUmsList } = myConfig;
            const umsList =
              myOrderUmsList &&
              myOrderUmsList[0] &&
              myOrderUmsList[0].umsInfos &&
              myOrderUmsList[0].umsInfos.filter(value => value.state !== 9);
            umsList &&
              umsList.forEach(value => {
                if (
                  value.remainingPayTime > 0 &&
                  value.state === 2 &&
                  !value.majorAccount
                ) {
                  this.setState({
                    time:
                      formatDateTime(value.remainingPayTime)[0] +
                      ':' +
                      formatDateTime(value.remainingPayTime)[1],
                  });
                  this.handlerTime(value.remainingPayTime);
                }
              });

            this.setState({
              isLoad: false,
            });
            //如果有省省卡，则添加曝光埋点
            let HaveCheapCard =
              res.myConfig &&
              res.myConfig.myCommonList.filter(
                item => item.clientFun === 'cheapCard'
              );
            if (
              res.myConfig &&
              res.myConfig.myCommonList &&
              HaveCheapCard.length > 0
            ) {
              setTimeout(() => {
                const targetDom = `#my-item-${HaveCheapCard[0].clientFun}`;
                const intersectionObserver = Taro.createIntersectionObserver(
                  this.$scope
                );
                intersectionObserver
                  .relativeToViewport({ bottom: 0 })
                  .observe(targetDom, () => {
                    const params = {
                      router: getCurrentInstance().router,
                      eid: 'individualCenter_SavemoneycardEntranceclick',
                      eparam: {
                        eventId: 'individualCenter_SavemoneycardEntranceclick',
                        pin: getPtPin(),
                      },
                    };
                    getExposure(params);
                    intersectionObserver.disconnect();
                  });
              }, 300);
            }
            this.isCouponOrderNew();
          }
        );
      }
    });

    getClubQueryUserInfo().then(res => {
      console.log('【7fresh.user.queryUserInfo】:', res);
      this.setState(
        {
          userInfo: res.userInfo,
          isLogin: !!res.userInfo,
        },
        () => {
          console.log('是否登录', this.state.isLogin);
        }
      );
    });

    getIntegralExpireIntegral().then(data => {
      console.log('【7fresh.integral.expireIntegral】:', data);
      if (data && data.success) {
        this.setState({ expireIntegralInfo: data.expireIntegralInfo || {} });
      }
    });

    this.getNewUserEntrance();
  };

  toLogin = () => {
    utils.gotoLogin(this.currentUrl, 'switchTab', 1);
  };

  jump = (item, event) => {
    if (item && item.urlType === '6') {
      Taro.makePhoneCall({
        phoneNumber: item.toUrl,
      });
      return false;
    }
    let url = item.toUrl;
    if (item && item.toUrl && item.toUrl.indexOf('https') <= -1) {
      url = item.toUrl.replace('http', 'https');
    }
    // 点击埋点
    if (reportPoints[item.clientFun]) {
      logClick({
        event,
        eid: reportPoints[item.clientFun],
        pname: this.currentUrl,
      });
    }
    if (!this.state.isLogin && item.clientFun !== 'officialAccounts') {
      utils.gotoLogin(
        links[item.clientFun]
          ? links[item.clientFun]
          : `/pages/login/wv-common/wv-common?h5_url=${url}`,
        'redirectTo',
        1
      );
      return;
    }
    // 七鲜乐园
    if (item.clientFun === 'getPeaGameInfo') {
      //关注入口点击埋点
      logClick({ eid: '7FRESH_APP_9_20200811_1597153579446|70' });
      utils.navigateToH5({
        page: url,
      });
      return;
    }

    /**
     * 家万佳卡
     * https://cf.jd.com/pages/viewpage.action?pageId=391105926
     */
    if (item.clientFun === 'jwjOuterMember') {
      structureLogClick({
        eventId: 'PersonalCenter_MyService_JwjCard',
        eventName: '个人中心-我的服务-家万佳卡',
        owner: 'ruanwei',
        jsonParam: {
          clickType: '-1',
          pageId: '0022',
          pageName: '个人中心',
          tenantId: `${this.state.tenantId}`,
          storeId: `${this.state.storeId}`,
          platformId: '1',
          clickId: 'PersonalCenter_MyService_JwjCard',
          firstModuleId: 'myService',
          firstModuleName: '我的服务',
        },
      });
      utils.navigateToH5({
        page: url,
      });
      return;
    }

    // 订单列表
    // const { storeId } = this.state;
    if (item.clientFun === 'allOrder') {
      Taro.navigateTo({
        url: `/pages-mine/order-list/index?status=0`,
      });
      return;
    }
    if (item.clientFun === 'waitPay') {
      Taro.navigateTo({
        url: `/pages-mine/order-list/index?status=1`,
      });
      return;
    }
    if (item.clientFun === 'waitShip') {
      Taro.navigateTo({
        url: `/pages-mine/order-list/index?status=2`,
      });
      return;
    }
    if (item.clientFun === 'waitReceive') {
      Taro.navigateTo({
        url: `/pages-mine/order-list/index?status=3`,
      });
      return;
    }

    // 关于我们
    if (item.clientFun === 'about') {
      Taro.navigateTo({
        url: `/pages-mine/about/index`,
      });
      return;
    }

    // 售后服务
    if (item.clientFun === 'afterSaleSevices') {
      utils.navigateToH5({
        page: `${app.h5RequestHost}/mine/afterSalesList?status=0`,
      });
      return;
    }

    // 公众号有礼
    if (item.clientFun === 'officialAccounts') {
      //关注入口点击埋点
      logClick({ eid: '7FRESH_APP_9_20200811_1597153579446|32' });
      Taro.navigateTo({
        url: `/pages/my/concern/index`,
      });
      return;
    }

    if (item.clientFun === 'contact' && item.urlType === '6') {
      //拨打电话
      Taro.makePhoneCall({
        phoneNumber: item.toUrl,
      });
      return;
    }
    if (item.clientFun === 'cheapCard') {
      structureLogClick({
        eventId: 'individualCenter_SavemoneycardEntranceclick',
        eventName: '个人中心-我的服务-省省卡',
        jsonParam: {
          clickType: '-1',
          pageId: '0022',
          pageName: '个人中心',
          clickId: 'individualCenter_SavemoneycardEntranceclick',
          firstModuleId: 'myService',
          firstModuleName: '我的服务',
        },
      });
    }
    // 原生页面跳转
    if (links[item.clientFun]) {
      Taro.navigateTo({
        url: links[item.clientFun]
      });
      return;
    } else {
      // h5页面跳转
      //如果跳转优惠劵页面，消费掉新劵到账的标记

      console.log('点击跳转的URL:', url);
      // 积分入口记录切换账号 网关返回的积分链接是错误的
      if (item.clientFun === 'myScore') {
        url =
          `https://7fresh.m.jd.com/mine/pointsHome?iShowDescription=${getStorageSync('iShowDescription') || 1}`;
        Taro.setStorageSync('iShowDescription', 2);
        // iShowDescription: 1:true展示 2:false
      }
      if (item.clientFun === 'myCoupons' && this.state.haveNewCoupon) {
        this.couponOrderConsume();
      }
      utils.navigateToH5({
        page: url,
      });
    }
  };

  // 订单详情
  jumpOrderDetail = item => {
    // 去支付
    if (item.state === 2) {
      //小程序
      const url = `/pages/wxpay/wxpay?orderId=${item.orderId}&storeId=${item.storeId}&tenantId=${item.tenantId}&from=miniapp`;
      Taro.navigateTo({
        url: url,
      });
      return;
    } else {
      Taro.navigateTo({
        url: `/pages-mine/order-detail/index?id=${item.orderId}`,
      });
    }
  };

  quit = () => {
    Taro.setStorageSync('iShowDescription', 1);
    // 用户退出后，删除无货找相似的缓存
    Taro.removeStorageSync('renderRecommendData');
    Taro.removeStorageSync('countRecommend');

    plugin.logout().then(() => {
      this.init();
      utils.gotoLogin(this.currentUrl, 'switchTab', 1);
    });
  };

  //查询失败的提现记录,如果有记录就在团长收益上面加个小红点
  getFailRecord = () => {
    const { storeId, tenantId } = this.state;
    if (!storeId) {
      return;
    }
    const params = {
      storeId,
      tenantId,
    };
    getQueryFailedDrawService(params)
      .then(res => {
        if (res && res.success) {
          this.setState({
            isFailRecord: res && res.totalCount > 0 ? true : false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //获取是否有新劵到账   haveNewCoupon-1:有 2:没有
  isCouponOrderNew = () => {
    isCouponOrderNewService({}).then(res => {
      console.log(res, 'isCouponOrderNew');
      if (res && res.success) {
        this.setState({
          haveNewCoupon: Number(res.haveNewCoupon) === 1 ? true : false,
        });
      }
    });
  };

  //消费订单满返券消息
  couponOrderConsume = () => {
    couponOrderConsumeService({}).then(res => {
      console.log(res, 'couponOrderConsume');
    });
  };

  //是否关注公众号
  isFollowWx() {
    getIsConcernService({
      appId: 'wxaa4f871ccd55cb2a', //入参是公众号Id
    })
      .then(res => {
        this.setState({
          isConcern: res && res.isConcern,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // 跳转新人任务落地页
  onGoNewPerson = () => {
    const { storeId, entranceData } = this.state;
    const eventId =
      entranceData && entranceData.taskStatus === 2
        ? 'ndividualCenterPage_newUserTaskFloor_clickToLook'
        : 'individualCenterPage_newUserTaskFloor_clickGetTask';
    structureLogClick({
      eventId: eventId,
      jsonParam: {
        firstModuleId: 'newUserTaskFloor',
        firstModuleName: '新人任务楼层',
        clickType: -1,
        activityId: entranceData && entranceData.actId,
        taskId: entranceData && entranceData.taskId,
      },
    });
    utils.navigateToH5({
      page: `${app.h5RequestHost}/newPerson?storeId=${storeId}`,
    });
  };

  // 获取个人中心新人任务接口
  getNewUserEntrance = () => {
    getNewUserEntrance()
      .then(res => {
        console.log('[getNewUserEntrance]', res);
        if (res && res.success) {
          const params = {
            router: getCurrentInstance().router,
            eid: 'individualCenter_newUserTaskEntrance',
            eparam: {
              eventId: 'individualCenter_newUserTaskEntrance',
              activityId: res.actId,
              taskId: res.taskId,
            },
          };
          getExposure(params);

          this.setState({
            entranceData: res,
          });
        } else {
          this.setState({
            entranceData: '',
          });
        }
      })
      .catch(() => {
        this.setState({
          entranceData: '',
        });
      });
  };

  /**
   * 获取购物车数量接口
   */
  getCartNum() {
    const { storeId } = this.state;
    getCartNum(storeId).then(res => {
      app.cartNum = res && res.allCartWaresNumber;
    });
  }

  // 订单倒计时
  handlerTime = time => {
    if (time) {
      this.countDown = setInterval(() => {
        if (time > 999) {
          time = time - 1000;
          this.setState({
            time: formatDateTime(time)[0] + ':' + formatDateTime(time)[1],
          });
        } else {
          clearInterval(this.countDown);
          this.init();
        }
      }, 1000);
    }
  };

  render() {
    const {
      isLogin,
      myConfig,
      userInfo,
      isFailRecord,
      haveNewCoupon,
      isIphoneX,
      isConcern,
      entranceData,
      expireIntegralInfo,
      time,
    } = this.state;
    const {
      myAccountList = [],
      myCommonList = [],
      myMemPayCodeList = [],
      myOrderStatusList = [],
      myOrderUmsList = [],
    } = myConfig || {
      myAccountList: [],
      myCommonList: [],
      myMemPayCodeList: [],
      myOrderStatusList: [],
      myOrderUmsList: [],
    };

    const memberPromList =
      myConfig && myConfig.memberPromList ? myConfig.memberPromList : [];

    const myOrderStatusListFilter =
      myOrderStatusList &&
      myOrderStatusList.filter(item => {
        return item.title !== '待评价' && item.title !== '全部订单';
      });
    const umsList =
      myOrderUmsList &&
      myOrderUmsList[0] &&
      myOrderUmsList[0].umsInfos &&
      myOrderUmsList[0].umsInfos.filter(value => value.state !== 9);

    return (
      <View
        className='my'
        style={{
          height: isLogin
            ? !isConcern
              ? px2vw(1700)
              : px2vw(1800)
            : px2vw(1250),
        }}
      >
        <View
          className='top-cover'
          style={{
            backgroundPositionY: `${(this.state.navHeight /
              this.state.windowWidth) *
              375 -
              170}rpx`,
          }}
        >
          <NavBar title={' '} showBack={false} skin={'black'} />
        </View>
        <View
          className='bg'
          style={{
            backgroundPositionY: `-170rpx`,
          }}
        />
        <View
          className='userinfo'
          style={{
            marginTop: `${(this.state.navHeight / this.state.windowWidth) *
              375}rpx`,
          }}
        >
          {isLogin ? (
            <View className='userinfo-box'>
              <OpenData class='avatar' type='userAvatarUrl' />
              <View className='nickname'>
                <open-data className='userinfo-nickname' type='userNickName' />
                <View className='pin'>{userInfo.pin}</View>
              </View>
            </View>
          ) : (
            <View className='userinfo-box' onClick={this.toLogin}>
              <Image
                className='avatar'
                src='https://m.360buyimg.com/img/jfs/t1/113895/12/18390/5070/5f6c5afcE98125a97/7a307f1dc6b757a7.png'
                backgroundSize='cover'
              />
              <View className='nickname'>马上登录</View>
            </View>
          )}
          {/* 关注公众号 */}
          {/* <View className='follow-public-account'>公众号</View> */}
          {myMemPayCodeList.length > 0 &&
            myMemPayCodeList.map((item, i) => {
              return (
                <View
                  className='pay-code'
                  key={i.toString()}
                  onClick={this.jump.bind(this, item)}
                >
                  {/* todo */}
                  <Image
                    className='icon'
                    src='https://m.360buyimg.com/img/jfs/t1/122894/31/12894/253/5f648900E1b4d93a7/48dd280e9e32eb0e.png'
                  />
                  <View className='word'>{item.title}</View>
                </View>
              );
            })}
        </View>

        {myAccountList && myAccountList.length > 0 && (
          <View className='user-data'>
            {myAccountList.map((item, i) => {
              return (
                <View
                  className='item'
                  onClick={this.jump.bind(this, item)}
                  key={i.toString()}
                >
                  <View className='item-value'>
                    <View className='item-value-text'>
                      {i === 0
                        ? item.showText === '--'
                          ? item.showText
                          : '¥' + item.showText
                        : item.showText}
                      {/* 积分兑换 - 礼 */}
                      {i === 1 && parseInt(item.showText) > 0 && (
                        <View>
                          {expireIntegralInfo &&
                          expireIntegralInfo.centerTag ? (
                            <Text
                              className='item-tip'
                              style={{
                                left:
                                  item.showText < 10
                                    ? px2vw(16)
                                    : item.showText < 100
                                    ? px2vw(40)
                                    : item.showText < 1000
                                    ? px2vw(60)
                                    : item.showText < 10000
                                    ? px2vw(80)
                                    : px2vw(100),
                              }}
                            >
                              {expireIntegralInfo.centerTag || ''}
                            </Text>
                          ) : (
                            <Image
                              src='//m.360buyimg.com/img/jfs/t1/94191/20/13468/2860/5e561bdeE9603716e/47f94881e159f879.png'
                              className='gift-img'
                              style={{
                                left:
                                  item.showText < 10
                                    ? px2vw(16)
                                    : item.showText < 100
                                    ? px2vw(40)
                                    : item.showText < 1000
                                    ? px2vw(60)
                                    : item.showText < 10000
                                    ? px2vw(80)
                                    : px2vw(100),
                              }}
                            />
                          )}
                        </View>
                        // <Text
                        //   className='gift'
                        //   style={{
                        //     left:
                        //       item.showText < 10
                        //         ? px2vw(16)
                        //         : item.showText < 100
                        //         ? px2vw(40)
                        //         : item.showText < 1000
                        //         ? px2vw(60)
                        //         : item.showText < 10000
                        //         ? px2vw(80)
                        //         : px2vw(100),
                        //   }}
                        // >
                        //   兑好礼
                        // </Text>
                      )}
                      {/* 优惠劵 - 新劵到账 订单满返劵 */}
                      {i === 2 && haveNewCoupon && (
                        <Image
                          src='//m.360buyimg.com/img/jfs/t1/134791/13/9622/3363/5f5ae118E77df4e26/74f108fd798d2260.png'
                          alt='七鲜'
                          className='coupon-img'
                        />
                      )}
                    </View>
                  </View>
                  <Text className='item-label'>{item.title}</Text>
                </View>
              );
            })}
          </View>
        )}
        {myOrderStatusList.length > 0 && (
          <View className='user-orders'>
            <View className='order-all-head'>
              <Text className='order-all'>我的订单</Text>
              <View className='order-all-link'>
                <View
                  className='order-all-text'
                  onClick={this.jump.bind(
                    this,
                    myOrderStatusList[myOrderStatusList.length - 1]
                  )}
                >
                  全部订单
                </View>
              </View>
            </View>
            <View className='order-sub'>
              {myOrderStatusListFilter.map((item, i) => {
                return (
                  <View
                    className='order-nav-item'
                    key={i.toString()}
                    onClick={this.jump.bind(this, item)}
                  >
                    <View
                      className='order-item-icon'
                      style={{ backgroundImage: `url(${item.imgUrl})` }}
                    >
                      {item.showText > 0 && (
                        <View className='order-item-number'>
                          {item.showText}
                        </View>
                      )}
                    </View>
                    <View className='order-item-text'>{item.title}</View>
                  </View>
                );
              })}
            </View>
            {umsList && umsList.length > 0 && (
              <Swiper
                className='order-info'
                autoplay
                circular
                interval={3000}
                duration={200}
              >
                {umsList.map((item, i) => {
                  let imgUrl = '';
                  let leftContent = '';
                  let rightContent = '';
                  let expectedDeliveryTime = item && item.expectedDeliveryTime;
                  if (item.imageUrl.indexOf('jpg') > -1) {
                    imgUrl = `${item.imageUrl.split('jpg')[0]}jpg`;
                  }
                  if (item.imageUrl.indexOf('png') > -1) {
                    imgUrl = `${item.imageUrl.split('png')[0]}png`;
                  }
                  if (
                    item &&
                    item.content &&
                    item.content.includes('%s') &&
                    item.state !== 2
                  ) {
                    leftContent = item.content.split('%s')[0];
                    rightContent = item.content.split('%s')[1];
                  } else if (
                    item &&
                    item.state === 2 &&
                    item.remainingPayTime > 0 &&
                    item.content.includes('%s')
                  ) {
                    // 倒计时
                    leftContent = item.content.split('%s')[0];
                    rightContent = item.content.split('%s')[1];
                    expectedDeliveryTime = time;
                  } else {
                    leftContent = item.content;
                    expectedDeliveryTime = '';
                  }
                  return (
                    <SwiperItem
                      className='order-item'
                      key={i.toString()}
                      onClick={this.jumpOrderDetail.bind(this, item)}
                    >
                      {/* <View className='date-box'>
                        <View className='title'>{item.deliveryTitle}</View>
                        <View className='date'>{item.deliveryNodeNewTime}</View>
                      </View> */}
                      <View className='info'>
                        <Image className='img' src={filterImg(imgUrl)} />
                        <View className='status'>
                          <View className='status-text'>
                            {item.deliveryStatusDesc}
                          </View>
                          <View className='address'>
                            {leftContent}
                            <Text className='red'>{expectedDeliveryTime}</Text>
                            {rightContent}
                          </View>
                        </View>
                        {item && item.state === 2 ? (
                          <View className='btn'>去支付</View>
                        ) : (
                          <View className='right-icon' />
                        )}
                      </View>
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}
          </View>
        )}

        {entranceData && (
          <NewPersonNavMine
            data={entranceData}
            onGoNewPerson={this.onGoNewPerson.bind(this)}
          />
        )}

        {memberPromList.length > 0 && (
          <View className='promotion-list'>
            <View
              className='invite-courteous'
              style={{
                // backgroundImage: `url(//m.360buyimg.com/img/jfs/t1/133691/7/13004/66913/5f8e50b1E3ef0cf3c/99124d4d03386190.png)`,
                backgroundImage: `url(${
                  memberPromList[0].imgUrl
                    ? filterImg(memberPromList[0].imgUrl)
                    : ''
                })`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
              onClick={this.jump.bind(this, memberPromList[0])}
            ></View>
            {memberPromList.length > 1 && (
              <View
                className='pea-game'
                style={{
                  // backgroundImage: `url(//m.360buyimg.com/img/jfs/t1/122621/17/15556/75513/5f8e51adE2fbd9bdb/5d91cb0568c95335.png)`,
                  backgroundImage: `url(${filterImg(
                    memberPromList[1].imgUrl
                  )})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }}
                onClick={this.jump.bind(this, memberPromList[1])}
              ></View>
            )}
          </View>
        )}
        {myCommonList.length > 0 && (
          <View className='user-service'>
            <View className='title-service'>我的服务</View>
            <View className='items'>
              {myCommonList.map((item, i) => {
                return (
                  <View
                    className='item'
                    key={i.toString()}
                    onClick={this.jump.bind(this, item)}
                  >
                    <View className='my-item' id={`my-item-${item.clientFun}`}>
                      {item.icon && (
                        <View
                          className='my-item-img-icon'
                          style={{
                            background: `url(${item.icon}) no-repeat`,
                            backgroundSize: `100% 100%`,
                          }}
                        />
                      )}
                      {item.clientFun === 'solitaireLeaderProfit' &&
                        isFailRecord && <Text className='red-point' />}
                      <Image
                        src={item.imgUrl.replace('http:', 'https:')}
                        className='my-item-icon'
                      />
                    </View>
                    {item.title}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {isLogin && (
          <View className='buttons'>
            <View className='btn-quit' onClick={this.quit.bind(this)}>
              退出当前账号
            </View>
          </View>
        )}
        <View className='bottom-logo-component'>
          <View className='bottom-logo-img'>
            <Image
              mode='aspectFit'
              className='image'
              src='https://m.360buyimg.com/img/jfs/t1/145675/20/9185/5362/5f6c1226E6313dedf/289be20ac1ae4fe1.png'
              lazyLoad
            />
          </View>
        </View>
        <View
          style={{
            position: 'fixed',
            bottom: isIphoneX ? px2vw(158) : px2vw(124),
            left: px2vw(24),
            right: px2vw(24),
            display: isLogin && isConcern ? 'block' : 'none',
          }}
        >
          <official-account></official-account>
        </View>
        <CustomTabBar selected={4} />
      </View>
    );
  }
}
