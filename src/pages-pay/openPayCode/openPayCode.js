import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  getPaymentConfigService,
  getUpdateCardInfoService,
  getPaySearchIsOpen,
  getPayCancelOpened,
  getApplyNoSecretService,
} from '@7fresh/api';
import { exportPoint } from '../../utils/common/exportPoint';
import { getPtPin } from '../../utils/adapter/index';
import srUtils from '../../utils/zhls';

const { onPageShow, onPageHide } = srUtils;
// eslint-disable-next-line import/no-commonjs
const logUtil = require('../../utils/weixinAppReport.js');

const log = logUtil.init();
const app = Taro.getApp().$app;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openPayStatus: '',
    isOpenPay: false,
    openBtn: '',
    cardInfoList: [], //卡设置信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option = {}) {
    console.log(option);
    exportPoint(getCurrentInstance().router);

    // 埋点初始化 老代码
    log.set({
      url: '/pages-pay/openPayCode/openPayCode', //当前页面地址，小程序插件环境需要传入，普通环境采集代码会自动获取
      urlParam: '', //onLoad事件传入的url参数对象
      siteId: 'JA2018_5131196', //子午线里获取站点编号，必填
      account: '', //传入用户登陆京东的账号，选填，建议填写
      pageId: '', //页面标识，默认为空，必填
      pname: '/pages-pay/openPayCode/openPayCode', //页面名称，默认取当前页面路径，选填
      pparam: '', //页面参数，默认取当前页面访问参数，选填
      skuid: '', //单品页上报，传入商品id，其他选填
      title: '支付设置', //网页标题，选填
      shopid: '', //店铺id，店铺页pop商品页传店铺id，其他页面选填
      loadtime: 2.3, //页面加载耗时，单位秒，选填
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPaymentConfig();
    this.checkOpenStatus();
    // this.setPayCode();
    // 页面pv
    log.pv({
      pname: '/pages-pay/openPayCode/openPayCode', //页面名称，默认取当前页面路径,选填
      pparam: '', //页面参数 ，默认取当前页面访问参数,选填
    });
    onPageShow();
  },
  onHide: function () {
    onPageHide();
  },
  /*
    检测微信免密支付状态
  */
  checkOpenStatus() {
    let that = this;
    getPaySearchIsOpen({
      user_pin: getPtPin(),
      pay_channel: 3,
    }).then(({ status }) => {
      // status:1：已解约，2：未签约，4:已签约
      if (status == 4) {
        that.setData({
          openPayStatus: '已开通',
          isOpenPay: true,
          openBtn: '解除授权',
        });
      } else {
        that.setData({
          openPayStatus: '未开通',
          isOpenPay: false,
          openBtn: '马上开通',
        });
        that.openPayWithoutPwd();
      }
    });
  },
  /*
    根据状态做开通和解绑操作
  */
  payOperate(e) {
    // 点击埋点
    log.click({
      event: e, //必填，点击事件event
      eid: '7FRESH_miniapp_1_1530785333379|20',
      elevel: '',
      eparam: '',
      pname: '/pages-pay/openPayCode/openPayCode',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    var that = this;
    var payStatus = this.data.isOpenPay;
    if (payStatus) {
      //已经开通，点击进行解绑
      wx.showModal({
        title: '提示',
        content: '确认要关闭微信免密支付吗？',
        success: function (res) {
          if (res.confirm) {
            that.deleteOpenPayRelation();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    }
  },
  /*
    解绑操作
  */
  deleteOpenPayRelation() {
    let that = this;
    getPayCancelOpened({
      user_pin: getPtPin(),
      pay_channel: 3,
    }).then(({ success }) => {
      // status:1：已解约，2：未签约，4:已签约
      if (success) {
        that.setData({
          openPayStatus: '未开通',
          isOpenPay: false,
          openBtn: '马上开通',
        });
      }
    });
  },
  setPayCode() {
    this.setData({
      appId: app.appId,
      path: app.path,
      extraData: app.extraData,
    });
  },
  /*
    开通免密支付getOrderDetailService
  */
  openPayWithoutPwd() {
    getApplyNoSecretService({ app_id: 'wxb8c24a764d1e1e6d' })
      .then((res) => {
        if (res && res.extraDatal) {
          const extraDatal = JSON.parse(res.extraDatal);
          this.setData({
            appId: 'wxbd687630cd02ce1d',
            path: 'pages/index/index',
            extraData: {
              appid: extraDatal.appid,
              contract_code: extraDatal.contract_code,
              contract_display_account: extraDatal.contract_display_account,
              mch_id: extraDatal.mch_id,
              notify_url: extraDatal.notify_url,
              plan_id: extraDatal.plan_id,
              request_serial: extraDatal.request_serial,
              timestamp: extraDatal.timestamp,
              sign: extraDatal.sign,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  //支付默认设置修改
  switchDefaultPayChange(e) {
    const { cardInfoList } = this.data;
    const index = e.currentTarget.dataset.index;
    const cardtype = e.currentTarget.dataset.cardtype;
    const value = e.detail.value;
    //设置埋点
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1551092070962|${cardtype === 1 ? 26 : 27}`,
      elevel: '',
      eparam: '',
      pname: '/pages-pay/openPayCode/openPayCode',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    cardInfoList[index].payUse = value;
    this.setData(
      {
        cardInfoList: cardInfoList,
      },
      () => {
        this.updateCardInfo();
      }
    );
  },

  //获取页面设置项信息
  getPaymentConfig() {
    getPaymentConfigService()
      .then(({ paymentConfigs }) => {
        if (
          paymentConfigs &&
          paymentConfigs[4] &&
          paymentConfigs[4].cardInfoList
        ) {
          this.setData({
            cardInfoList: paymentConfigs[4].cardInfoList,
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  },

  //设置卡开，关
  updateCardInfo() {
    const { cardInfoList } = this.data;
    let _cardInfoList = [];
    for (let i = 0; i < cardInfoList.length; i++) {
      _cardInfoList.push({
        cardType: cardInfoList[i].cardType,
        payUse: cardInfoList[i].payUse,
      });
    }
    const params = {
      cardInfoList: _cardInfoList,
    };
    getUpdateCardInfoService(params)
      .then(({ success }) => {
        console.log('updateCardInfo===', success);
        if (success) {
          this.getPaymentConfig();
        }
      })
      .catch((res) => {
        console.log(res);
      });
  },
});
