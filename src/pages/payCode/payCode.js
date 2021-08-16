import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  getPaySearchIsOpen,
  getMemberPayStatusService,
  getWeiXinOpenIdService,
  getUserErcodeNewService,
  getCardSettingService,
  getUpdateCardInfoService,
  getUserPayCodeService,
  getEvokePayCodeViewService,
} from '@7fresh/api';
import { exportPoint } from '../../utils/common/exportPoint';
import { isLogined } from '../../utils/common/utils';
import srUtils from '../../utils/zhls';
import logUtil from '../../utils/weixinAppReport.js';
import utils from '../login/util';
import code from './sdk';
import QRCode from './sdk/qrcode';
import { getPtPin } from '../../utils/adapter/index';
import { silenceChagneStore } from '../../utils/common/getUserStoreInfo';

const plugin = requirePlugin('loginPlugin');

const { onPageShow, onPageHide } = srUtils;
const log = logUtil.init();

const app = Taro.getApp().$app;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNoOpen: false, //显示未开通状态栏
    showTopTip: true, //显示顶部开通状态栏
    showOpened: false, //显示已开通面板
    code: '',
    showBarcodePreview: false,
    showBarcodePreviewTip: false,
    QrCodeImage: '',
    BarCodeImage: '',
    cardInfoList: '', //卡信息
    isShowCardInfo: false, //默认关闭卡信息
    isUseStaffCard: false, //默认不用员工卡
    isUseECard: false, //默认不用E卡
    isShowStaffCard: false, //默认不显示员工卡
    isShowECard: false, //默认不显示E卡
    isShowPayTipWrap: false, //是否显示支付设置
    customDraw: false,
    showQrcodePreview: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const pin = plugin.getStorageSync('jdlogin_pt_key');
    if (!pin) {
      utils.redirectToLogin('/pages/payCode/payCode');
      return;
    }
    exportPoint(getCurrentInstance().router);
    wx.getSystemInfo({
      success: (res) => {
        console.log('lemon', res);
        this.devicePixelRatio = res.devicePixelRatio;
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!isLogined()) {
      utils.redirectToLogin('/pages/payCode/payCode');
      return;
    }
    this.setData({
      cardInfoList: '', //卡信息
      isShowCardInfo: false, //默认关闭卡信息
      isUseStaffCard: false, //默认不用员工卡
      isUseECard: false, //默认不用E卡
      isShowStaffCard: false, //默认不显示员工卡
      isShowECard: false, //默认不显示E卡
      isShowPayTipWrap: false, //是否显示支付设置
    });
    this.checkOpenStatus();
    this.getCodeImage();
    this.getPayResult();
    this.getWXPay();
    this.getCardInfo();
    onPageShow();
  },

  /**
   * 生命周期函数--隐藏
   */
  onHide() {
    onPageHide();
    this.GInterval && clearInterval(this.GInterval);
    this.GInterval2 && clearInterval(this.GInterval2);
  },

  /**
   * 清除定时器
   */
  onUnload() {
    this.GInterval && clearInterval(this.GInterval);
    this.GInterval2 && clearInterval(this.GInterval2);
  },

  /**
   * 显示支付设置
   */
  isShowPayTipWrap() {
    this.setData({
      isShowPayTipWrap: !this.data.isShowPayTipWrap,
    });
  },

  /**
   * 显示支付说明弹框
   */
  showPayTip() {
    wx.navigateTo({
      url: '/pages-pay/payTip/payTip',
    });
  },

  /**
   * 查询扫码支付结果
   */
  getPayResult() {
    this.GInterval2 && clearInterval(this.GInterval2);
    this.GInterval2 = setInterval(() => {
      this.queryPayResult();
    }, 1000);
  },

  /**
   * 查询扫码支付结果--调用接口
   */
  queryPayResult() {
    getMemberPayStatusService()
      .then((data) => {
        let storeId = wx.getStorageSync('addressInfo').storeId || '';
        console.log(
          '==getMemberPayStatusService====',
          storeId,
          data,
          data.payOrderInfo,
          data.awakeOnlineMessage
        );
        if (data && data.payOrderInfo && data.success) {
          console.log('orderID', data.payOrderInfo);
          let orderId = data.payOrderInfo.order_id || '',
            payBal = data.payOrderInfo.payBal || '',
            dataStoreId = data.payOrderInfo.storeId;
          //门店不一致，静默切门店
          if (Number(storeId) !== Number(dataStoreId) && dataStoreId) {
            silenceChagneStore({
              storeId: dataStoreId,
              tenantId: data.payOrderInfo.tenantId,
            }).then(() => {
              wx.redirectTo({
                url:
                  '/pages/payResult/index?orderId=' +
                  orderId +
                  '&payBal=' +
                  payBal +
                  '&storeId=' +
                  dataStoreId,
              });
              return;
            });
          }
          console.log('支付', orderId, storeId);
          wx.redirectTo({
            url:
              '/pages/payResult/index?orderId=' +
              orderId +
              '&payBal=' +
              payBal +
              '&storeId=' +
              dataStoreId,
          });
        }
        if (data && data.awakeOnlineMessage) {
          const awakeOnlineMessage = data.awakeOnlineMessage;
          let dataStoreId = awakeOnlineMessage.storeId;
          wx.requestPayment({
            timeStamp: awakeOnlineMessage.timestamp,
            nonceStr: awakeOnlineMessage.noncestr,
            package: awakeOnlineMessage.wxPackage,
            signType: awakeOnlineMessage.signType || '',
            paySign: awakeOnlineMessage.paySign || '',
            success() {
              //门店不一致，静默切门店
              if (Number(storeId) !== Number(dataStoreId)) {
                silenceChagneStore({
                  storeId: dataStoreId,
                  tenantId: awakeOnlineMessage.tenantId,
                }).then(() => {
                  wx.redirectTo({
                    url: `/pages/payResult/index?orderId=${
                      awakeOnlineMessage.orderId
                    }&storeId=${
                      awakeOnlineMessage.storeId
                        ? awakeOnlineMessage.storeId
                        : ''
                    }&flowId=${awakeOnlineMessage.outTradeNo}`,
                  });
                  return;
                });
              }
              wx.redirectTo({
                url: `/pages/payResult/index?orderId=${
                  awakeOnlineMessage.orderId
                }&storeId=${
                  awakeOnlineMessage.storeId ? awakeOnlineMessage.storeId : ''
                }&flowId=${awakeOnlineMessage.outTradeNo}`,
              });
            },
            fail: () => {
              wx.switchTab({
                url: '/pages/index/index',
              });
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * 获取微信拉起微信付款码功能参数
   */
  getWXPay() {
    getEvokePayCodeViewService()
      .then((res) => {
        if (res) {
          this.setData({
            timeStamp: res.timeStamp || '',
            nonceStr: res.nonceStr || '',
            package: res.wxPackage || '',
            signType: res.signType || '',
            paySign: res.paySign || '',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * 关闭开通提示栏
   */
  closeNoOpenPannel() {
    this.setData({
      showTopTip: false,
    });
  },

  /**
   * 跳转到微信官方小程序进行支付
   */
  toPayMniProgram() {
    console.log('to wx pay');
    const {
      timeStamp,
      nonceStr,
      package: _package,
      signType,
      paySign,
    } = this.data;
    wx.openOfflinePayView({
      appId: 'wxb8c24a764d1e1e6d',
      timeStamp,
      nonceStr,
      package: _package,
      signType,
      paySign,
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
      },
      complete: () => {},
    });
  },
  /**
   * 检测微信免密支付状态
   */
  checkOpenStatus() {
    getPaySearchIsOpen({
      user_pin: getPtPin(),
      pay_channel: 3,
    })
      .then((res) => {
        const status = res.status;
        // status:1：已解约，2：未签约，4:已签约
        if (status == 4) {
          this.setData({
            showNoOpen: false,
            showOpened: true,
          });
        } else {
          this.setData({
            showNoOpen: true,
            showOpened: false,
          });
        }
      })
      .catch((err) => {
        if (err && err.code == 3) {
          utils.redirectToLogin('/pages/payCode/payCode');
          return;
        }
      });
  },

  /**
   * 获取付款码图片
   */
  getCodeImage() {
    this.GInterval && clearInterval(this.GInterval);
    this.getQrCode();
    this.GInterval = setInterval(() => {
      this.getQrCode();
    }, 1000 * 60);
  },

  getCustomCodeImage() {
    this.GInterval && clearInterval(this.GInterval);
    this.getQrCodeInfo();
    this.GInterval = setInterval(() => {
      this.getQrCodeInfo();
    }, 1000 * 60);
  },

  /**
   * 获取付款码图片---二维码
   */
  getQrCodeInfo() {
    const that = this;
    wx.login({
      success: function (result) {
        if (result.code) {
          getWeiXinOpenIdService({
            code: result.code,
            pay_channel: 19,
          }).then((res) => {
            getUserErcodeNewService({
              openId: res && res.open_id,
            })
              .then((data) => {
                if (data && data.code !== '3') {
                  setTimeout(() => {
                    code.barcode('barcode', data.code, 610, 187);
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width: 610,
                      height: 187,
                      destWidth: 810,
                      destHeight: 248,
                      canvasId: 'barcode',
                      fileType: 'jpg',
                      success: (response) => {
                        that.setData({
                          BarCodeImage: response.tempFilePath,
                        });
                      },
                      fail: (err) => {
                        console.log(err);
                        that.getCodeImage();
                        that.setData({
                          customDraw: false,
                        });
                      },
                    });
                  }, 500);
                  const qrcode = QRCode.drawImg(data.code, {
                    typeNumber: 1,
                    errorCorrectLevel: 'M',
                    size: 470,
                  });
                  that.setData({
                    QrCodeImage: qrcode,
                  });

                  that.setData({
                    code: data.code,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      },
    });
  },

  /**
   * 获取付款码图片---二维码
   */
  getQrCode() {
    const that = this;
    wx.login({
      success: function (result) {
        if (result.code) {
          getWeiXinOpenIdService({
            code: result.code,
            pay_channel: 19,
          }).then((res) => {
            getUserPayCodeService({ openId: res && res.open_id })
              .then((data) => {
                if (data && data.code !== '3') {
                  that.setData({
                    BarCodeImage:
                      data.code2Url ||
                      `data:image/png;base64, ${data.code2Base64}`,
                    QrCodeImage:
                      data.codeUrl ||
                      `data:image/png;base64, ${data.codeBase64}`,
                    code: data.code,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      },
    });
  },

  /**
   * 跳转到开通微信免密支付页面
   */
  openNopwdPay() {
    wx.navigateTo({
      url: '/pages-pay/openPayCode/openPayCode',
    });
  },

  /**
   * 点击查看条形码图片
   */
  previewBarcodeImage(e) {
    console.log(e);

    if (e && e.type == 'tap' && e.currentTarget.dataset.id == 'get') {
      this.setData({
        showBarcodePreviewTip: !this.data.showBarcodePreviewTip,
      });
    }
    this.setData({
      showBarcodePreview: !this.data.showBarcodePreview,
    });
  },

  /**
   * 点击查看条形码图片 ----提示弹框
   */
  previewBarcodeImageTip() {
    this.setData({
      showBarcodePreviewTip: !this.data.showBarcodePreviewTip,
    });
  },

  /**
   * 点击查看二维码图片
   */
  previewQrcodeImage() {
    this.setData({
      showQrcodePreview: !this.data.showQrcodePreview,
    });
  },

  /**
   * 点击显示下拉菜单
   */
  showActionSheet() {
    wx.showActionSheet({
      itemList: ['刷新付款码'],
      success: (res) => {
        console.log(res.tapIndex);
        var tapIndex = res.tapIndex;
        if (tapIndex == 0) {
          this.GInterval && clearInterval(this.GInterval);
          this.data.customDraw
            ? this.getCustomCodeImage()
            : this.getCodeImage();
        } else if (tapIndex == 1) {
          console.log(res);
        }
      },
      fail: (res) => {
        console.log(res.errMsg);
      },
    });
  },

  /**
   * 解绑付款码
   */
  deletePayRelation() {
    console.log('解绑');
    wx.navigateTo({
      url: '/pages-pay/openPayCode/openPayCode',
    });
  },

  /**
   * 跳转H5
   * @param {*} e
   */
  gotoH5(e) {
    let url = e.currentTarget.dataset.url;
    if (url && /^(https?:)?\/\/.+/.test(url)) {
      utils.redirectToH5({
        page: url,
      });
    }
  },

  /**
   * 员工卡设置开关
   * @param {*} e
   */
  switchStaffCardChange(e) {
    //设置埋点
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1551092070962|24`,
      elevel: '',
      eparam: '',
      pname: '/pages/payCode/payCode',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    this.setData({
      isUseStaffCard: e.detail.value,
    });
  },

  /**
   * E卡设置开关
   * @param {*} e
   */
  switchEcardChange(e) {
    //设置埋点
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_miniapp_2_1551092070962|25`,
      elevel: '',
      eparam: '',
      pname: '/pages/payCode/payCode',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    this.setData({
      isUseECard: e.detail.value,
    });
  },

  /**
   * 关闭卡设置弹框
   */
  closeCardInfo() {
    this.setData({
      isShowCardInfo: !this.data.isShowCardInfo,
    });
  },

  /**
   * 卡信息
   */
  getCardInfo() {
    getCardSettingService()
      .then((data) => {
        console.log('data.cardInfoList=', data.cardInfoList);

        if (data && data.cardInfoList) {
          this.setData({
            cardInfoList: data.cardInfoList,
          });
          for (let i = 0; i < data.cardInfoList.length; i++) {
            if (data.cardInfoList[i].cardType === 1) {
              this.setData({
                isUseStaffCard: data.cardInfoList[i].payUse,
              });
            } else if (data.cardInfoList[i].cardType === 2) {
              this.setData({
                isUseECard: data.cardInfoList[i].payUse,
              });
            }

            if (data.cardInfoList[i].cardType === 1) {
              //员工卡
              if (!data.cardInfoList[i].payUse && data.cardInfoList[i].popup) {
                this.setData({
                  isShowCardInfo: true,
                  isShowStaffCard: true,
                });
              }
            } else if (data.cardInfoList[i].cardType === 2) {
              //e卡
              if (!data.cardInfoList[i].payUse) {
                this.setData({
                  isShowCardInfo: true,
                  isShowECard: true,
                });
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * 卡信息 确定按钮
   */
  cardSureBtn() {
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      isShowCardInfo: false,
    });
    this.updateCardInfo();
  },

  /**
   * 设置卡开，关
   */
  updateCardInfo() {
    let cardInfoListArr = [];
    let { cardInfoList, isUseStaffCard, isUseECard } = this.data;
    console.log('设置卡开，关', cardInfoList, isUseStaffCard, isUseECard);
    if (cardInfoList && cardInfoList.length > 0) {
      for (let i = 0; i < cardInfoList.length; i++) {
        let json = {};
        if (cardInfoList[i].cardType === 1) {
          json.cardType = 1;
          json.payUse = isUseStaffCard;
        } else if (cardInfoList[i].cardType === 2) {
          json.cardType = 2;
          json.payUse = isUseECard;
        }
        cardInfoListArr.push(json);
      }
    }
    const data = {
      cardInfoList: cardInfoListArr,
    };

    getUpdateCardInfoService(data)
      .then(() => {
        wx.hideLoading();
        this.getQrCode();
        this.getWXPay();
      })
      .catch((err) => {
        console.log(err);
        wx.hideLoading();
        this.getQrCode();
        this.getWXPay();
      });
  },
  /**
   * 跳转到我的e卡/七鲜卡
   */
  gotoEcard() {
    utils.navigateToH5({
      page: `${app.h5RequestHost}/giftCards/cardMine?from=miniapp`,
    });
  },
});
