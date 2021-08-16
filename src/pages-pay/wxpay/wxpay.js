import { getCurrentInstance } from '@tarojs/taro';
import {
  getPayInitService,
  getPayService,
  getOrderDetailService,
  getWeiXinOpenIdService,
  getQueryTemplate,
  getSaveTemplate,
  getNewUserApplyWelfare,
} from '@7fresh/api';
import { silenceChagneStore } from '../../utils/common/getUserStoreInfo';
import { exportPoint, getExposure } from '../../utils/common/exportPoint';
import { getPtPin, h5Url } from '../../utils/adapter/index';
import utils from '../../pages/login/util';
import srUtils from '../../utils/zhls';

const { onPageShow, onPageHide, onOrderChange } = srUtils;

// eslint-disable-next-line no-undef
Page({
  data: {
    orderId: '',
    openId: '',
    payId: '',
    resource: '',
    flowId: '',
    storeId: '',
    buyCouponForm: '', //来自省省卡 couponPackage-固定页 order-结算页
    couponPackageActId: '', //省省卡活动id
    scanFlag: '', //扫码领新人券流程
    subscriptionType: 1,
    tmplIds: '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw',
    couponCodes: [],
  },
  onLoad: function (option) {
    exportPoint(getCurrentInstance().router);
    console.log(option);
    let lbsData = wx.getStorageSync('addressInfo') || '';
    if (
      Number(lbsData.storeId) !== Number(option && option.storeId) &&
      option.tenantId &&
      option.storeId
    ) {
      silenceChagneStore({
        storeId: option.storeId,
        tenantId: option.tenantId,
      }).then(() => {
        this.setData(
          {
            orderId: option.orderId,
            resource: option.resource ? option.resource : '',
            storeId: option.storeId ? option.storeId : '',
            flowId: option.flowId ? option.flowId : '',
            newResource: option.newResource ? option.newResource : '',
            buyCouponForm: option.buyCouponForm ? option.buyCouponForm : '',
            scanFlag: option.scanFlag ? option.scanFlag : '',
          },
          () => {
            this.getOrderState();
            if (this.data.scanFlag === 'scanFlag') {
              this.getNewUserApplyWelfare();
            }
          }
        );
      });
    } else {
      if (!!option) {
        this.setData(
          {
            orderId: option.orderId,
            resource: option.resource ? option.resource : '',
            storeId: option.storeId ? option.storeId : '',
            flowId: option.flowId ? option.flowId : '',
            newResource: option.newResource ? option.newResource : '',
            buyCouponForm: option.buyCouponForm ? option.buyCouponForm : '',
            scanFlag: option.scanFlag ? option.scanFlag : '',
          },
          () => {
            this.getOrderState();
            if (this.data.scanFlag === 'scanFlag') {
              this.getNewUserApplyWelfare();
            }
          }
        );
      }
    }
  },

  getOrderState() {
    let that = this;
    onOrderChange(that.data.orderId, 'give_order');
    getOrderDetailService({ orderId: that.data.orderId })
      .then((res) => {
        console.log(res);
        // let orderInfo = res.orderInfo;
        if (res && (res.state >= 3 || res.state == 0)) {
          // 已支付 || 取消
          const resource = that.data.resource,
            newResource = that.data.newResource,
            storeId = that.data.storeId,
            flowId = that.data.flowId,
            orderId = that.data.orderId,
            buyCouponForm = that.data.buyCouponForm;
          let orderType = '';
          if (resource == 'fightGroup' || newResource == 'fightGroup') {
            orderType = 'group';
          } else if (resource == 'solitaire' || newResource == 'solitaire') {
            orderType = 'solitaire';
          } else if (resource === 'hallFood' || newResource === 'hallFood') {
            orderType = 'hallFood';
          } else {
            orderType = '';
          }
          if (buyCouponForm) {
            if (buyCouponForm === 'orderPage') {
              utils.navigateToH5(
                {
                  page: `${h5Url}/order.html?storeId=${storeId}&newResource=${resource}&buyCouponForm=${buyCouponForm}`,
                },
                true
              );
              return;
            }
            utils.navigateToH5(
              {
                page: `${h5Url}/channel/couponPackage?orderId=${orderId}&storeId=${storeId}&showNavigationBar=1&fullScreen=true&newResource=${resource}&buyCouponForm=${buyCouponForm}`,
              },
              true
            );
            return;
          }
          wx.redirectTo({
            url: `/pages/payResult/index?orderId=${orderId}&storeId=${storeId}&flowId=${flowId}&orderType=${orderType}`,
          });
        } else {
          that.getOpenIdByCode();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  onShow: function () {
    onPageShow();
  },
  onHide: function () {
    onPageHide();
  },
  getOpenIdByCode: function () {
    var code;
    var that = this;
    wx.login({
      success: function (res) {
        code = res.code;
        if (code) {
          getWeiXinOpenIdService({
            code: code,
            pay_channel: 19,
          })
            .then((result) => {
              console.log(result);
              that.setData({
                openId: result && result.open_id,
              });
              that.getPayId();
            })
            .catch((err) => {
              console.log('获取code码失败！' + err);
            });
        } else {
          console.log('获取code码失败！' + res.errMsg);
        }
      },
    });
  },
  getPayId: function () {
    var that = this;
    getPayInitService({
      order_id: this.data.orderId,
    })
      .then((res) => {
        var payOrderInfo = res.payOrderInfo;
        // TODO: 如果是省省卡的支付，添加调起收银台成功 曝光埋点
        if (this.buyCouponForm) {
          const params = {
            router: getCurrentInstance().router,
            eid: 'Activepage_Turnupthecashiersuccessful',
            eparam: {
              activityId: this.couponPackageActId,
              pin: getPtPin(),
            },
          };
          getExposure(params);
        }
        that.setData({
          payId: payOrderInfo.pay_id,
        });
        that.weixinPay();
      })
      .catch((err) => {
        console.log('获取code码失败！' + err);
      });
  },
  weixinPay: function () {
    let that = this;
    const resource = that.data.resource,
      newResource = that.data.newResource,
      storeId = that.data.storeId,
      orderId = that.data.orderId,
      buyCouponForm = that.data.buyCouponForm,
      couponPackageActId = that.data.couponPackageActId;
    let orderType = '';

    getPayService({
      storeId: '0',
      open_id: this.data.openId,
      pay_id: this.data.payId,
      order_id: orderId,
      pay_channel: 19,
    })
      .then((res) => {
        if (res) {
          let timeStamp = res.timestamp, //时间戳
            nonceStr = res.noncestr, //随机字符串，长度为32个字符以下。
            _package = res.wxPackage, //统一下单接口返回的 prepay_id 参数值
            signType = res.signType, //签名算法，暂支持 MD5
            paySign = res.paySign, //签名
            flowId = res.flow_id;
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: _package,
            signType: signType,
            paySign: paySign,
            success: function () {
              onOrderChange(orderId, 'pay');
              // 省省卡落地页跳转过来的
              if (buyCouponForm) {
                if (buyCouponForm === 'orderPage') {
                  // 结算页省省卡跳转过来的
                  utils.navigateToH5(
                    {
                      page: `${h5Url}/order.html?storeId=${storeId}&newResource=${resource}&buyCouponForm=${buyCouponForm}`,
                    },
                    true
                  );
                  return;
                }
                utils.navigateToH5(
                  {
                    page: `${h5Url}/channel/couponPackage?orderId=${orderId}&storeId=${storeId}&showNavigationBar=1&fullScreen=true&newResource=${resource}&couponPackageActId=${couponPackageActId}&buyCouponForm=${buyCouponForm}`,
                  },
                  true
                );
                return;
              } else if (
                resource == 'fightGroup' ||
                newResource == 'fightGroup'
              ) {
                orderType = 'group';
              } else if (
                resource == 'solitaire' ||
                newResource == 'solitaire'
              ) {
                orderType = 'solitaire';
              } else if (
                resource === 'hallFood' ||
                newResource === 'hallFood'
              ) {
                orderType = 'hallFood';
              } else {
                orderType = '';
              }
              const scanFlag = that.data.scanFlag;
              if (scanFlag === 'scanFlag') {
                that.subscribe();
                return;
              }
              wx.redirectTo({
                url: `/pages/payResult/index?orderId=${orderId}&storeId=${storeId}&flowId=${flowId}&orderType=${orderType}`,
              });
            },
            fail: function (err) {
              console.log(err, 'wx.requestPayment err===========');
              onOrderChange(that.data.orderId, 'cancel_pay');
              // wx.switchTab({
              //   url: '/pages/index/index',
              // });
              if (buyCouponForm) {
                if (buyCouponForm === 'orderPage') {
                  utils.navigateToH5(
                    {
                      page: `${h5Url}/order.html?storeId=${storeId}&newResource=${resource}&buyCouponForm=${buyCouponForm}`,
                    },
                    true
                  );
                  return;
                }
                utils.navigateToH5(
                  {
                    page: `${h5Url}/channel/couponPackage?orderId=${orderId}&storeId=${storeId}&showNavigationBar=1&fullScreen=true&newResource=${resource}&buyCouponForm=${buyCouponForm}`,
                  },
                  true
                );
                return;
              }
              wx.redirectTo({
                url: '/pages-a/order-list/index?status=0',
              });
            },
          });
        }
      })
      .catch((err) => {
        console.log('获取code码失败！' + err);
      });
  },

  // 领券成功订阅消息
  subscribe: function () {
    const _this = this;
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log('res.subscriptionsSetting', res.subscriptionsSetting);
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          // 状态1 订阅消息总开关是开的
          console.log('状态1 订阅消息总开关是开的');
          if (res.subscriptionsSetting.itemSettings) {
            if (
              res.subscriptionsSetting.itemSettings[
                '6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'
              ] == 'accept'
            ) {
              // 状态4 勾选了“不再询问”并且选项是允许
              console.log('状态4 勾选了“不再询问”并且选项是允许');
              wx.requestSubscribeMessage({
                tmplIds: ['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'],
                success: function (data) {
                  console.log('44444', data);
                  if (
                    data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                    'accept'
                  ) {
                    _this.setData({
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
              _this.setData({
                // remindFlag: false,
                subscriptionType: 1,
              });
              wx.redirectTo({
                url: `/pages/payResult/index?orderId=${_this.data.orderId}&storeId=${_this.data.storeId}&flowId=${_this.data.flowId}&orderType=${_this.data.orderType}`,
              });
            }
          } else {
            // 状态3 没有勾选“不再询问”  单次
            console.log('状态3 没有勾选“不再询问”');
            wx.requestSubscribeMessage({
              tmplIds: ['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'],
              success: function (data) {
                console.log('33333', data);
                if (
                  data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                  'reject'
                ) {
                  wx.redirectTo({
                    url: `/pages/payResult/index?orderId=${_this.data.orderId}&storeId=${_this.data.storeId}&flowId=${_this.data.flowId}&orderType=${_this.data.orderType}`,
                  });
                }
                if (
                  data['6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw'] ==
                  'accept'
                ) {
                  // 第一次弹框  第二次不弹框
                  _this.setData(
                    {
                      subscriptionType: 2,
                    },
                    () => {
                      _this.getQueryTemplateFunc();
                    }
                  );
                }
              },
              fail(data) {
                console.log('333fail', data);
              },
            });
          }
        } else {
          // 状态2 订阅消息总开关是关的
          console.log('状态2 订阅消息总开关是关的');
          wx.openSetting();
        }
      },
    });
  },

  // 查询用户的订阅类型
  getQueryTemplateFunc: function () {
    let uuid = '';
    const that = this;
    const wxUserInfo = wx.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const params = {
      templateId: that.data.tmplIds,
      toUser: uuid,
    };
    getQueryTemplate(params)
      .then((res) => {
        console.log('getQueryTemplate', res.data);
        that.getSaveTemplate(uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // 用户订阅模版内容
  getSaveTemplate: function (uuid) {
    const _this = this;
    const args = {
      templateId: this.data.tmplIds,
      subscriptionType: this.data.subscriptionType,
      notifyChannel: 1,
      toUser: uuid,
      businessIds: this.data.couponCodes,
    };
    getSaveTemplate(args)
      .then((res) => {
        console.log('getSaveTemplate', res);
        wx.redirectTo({
          url: `/pages/payResult/index?orderId=${_this.data.orderId}&storeId=${_this.data.storeId}&flowId=${_this.data.flowId}&orderType=${_this.data.orderType}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getNewUserApplyWelfare: function () {
    const that = this;
    getNewUserApplyWelfare({
      storeId: that.data.storeId,
      tenantId: that.data.tenantId,
    }).then((data) => {
      console.log('【7fresh_newUser_applyWelfare】:', data);
      if (data && data.success) {
        that.setData({
          couponCodes: data.couponCodes,
        });
      }
    });
  },
});
