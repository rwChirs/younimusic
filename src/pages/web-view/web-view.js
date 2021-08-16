
import Taro,{ getCurrentInstance } from '@tarojs/taro';
import util from '../../utils/util.js';
import { exportPoint } from '../../utils/common/exportPoint';
import srUtils from '../../utils/zhls';

const { onPageShow, onPageHide } = srUtils;

// eslint-disable-next-line no-undef
const plugin = requirePlugin('loginPlugin');

// eslint-disable-next-line no-undef
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    h5_url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    exportPoint(getCurrentInstance().router);
    let { token, h5_url = '' } = options,
      that = this;
    if (!h5_url) {
      wx.switchTab({
        url: '/pages/index/index',
      });
      return;
    }
    if (token && !h5_url) {
      that.handleBackFromH5(token);
      return;
    }
    that.setData({ h5_url });
    plugin
      .genToken({
        h5_url,
      })
      .then(res => {
        let { isSuccess, err_code, url, tokenkey } = res;
        if (isSuccess && !err_code) {
          that.setData({
            url: `${url}?to=${h5_url}&tokenkey=${tokenkey}`,
          });
        } else {
          that.handleError(res);
        }
      })
      .catch(res => console.jdLoginLog(res));
  },
  onShow: function() {
    onPageShow();
  },
  onHide: function() {
    onPageHide();
  },
  handleError: function(params = {}) {
    let { err_msg = '页面跳转失败，请重试' } = params;
    let { h5_url } = this.data;
    wx.showModal({
      title: '提示',
      content: err_msg,
      success: function(res) {
        if (res.confirm) {
          util.h5JumpOnly(h5_url);
        }
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    let { h5_url } = this.data;
    h5_url =
      h5_url == encodeURIComponent(options.webViewUrl)
        ? h5_url
        : encodeURIComponent(options.webViewUrl);
    var detailIndex = h5_url.indexOf('detail.html');
    var shareTitle = detailIndex > 0 ? '商品详情' : '七鲜';
    return {
      title: shareTitle,
      path:
        detailIndex > 0
          ? `/pages/detail/index?${decodeURIComponent(
              h5_url.substr(detailIndex + 12)
            )}`
          : `/pages/web-view/web-view?h5_url=${h5_url}`,
    };
  },
  handleBackFromH5(token) {
    util.tokenLogin({
      token,
      callback: res => {
        let { err_code, err_msg = '网络错误，请重试', pt_key, isSuccess } = res;
        if (isSuccess && !err_code) {
          this.tokenLoginSuccess(pt_key);
        } else {
          wx.showModal({
            title: '提示',
            content: err_msg,
            success: function(resp) {
              if (resp.confirm) {
                this.handleBackFromH5(token);
              }
            },
          });
        }
      },
    });
  },
  tokenLoginSuccess(pt_key) {
    let returnPage = plugin.getStorageSync('jdlogin_returnPage');
    let pageType = plugin.getStorageSync('jdlogin_pageType');
    let obj = { returnPage, pageType };
    wx.removeStorageSync('jdlogin_returnPage');
    wx.removeStorageSync('jdlogin_pageType');
    util.setListStorage([{ key: 'jdlogin_pt_key', val: pt_key }]);
    util.goBack(obj);
  },

  getMessage({ detail }) {
    if (detail && detail.data) {
      detail.data.forEach(message => {
        switch (message.type) {
          case 'address_changed':
            if (message.data && message.data.storeId) {
              // eslint-disable-next-line no-undef
              getApp().globalData.storeId = message.data.storeId;
            }
            if (message.data && message.data.sendTo) {
              // eslint-disable-next-line no-undef
              getCurrentPages()[0].setData({
                addr: message.data.sendTo,
                defaultAddr: {
                  storeId: message.data.storeId,
                  addressSummary: message.data.sendTo,
                  addressExt: message.data.sendTo,
                  address: message.data.sendTo,
                  lat: message.data.coord[0],
                  lon: message.data.coord[1],
                  userName: message.data.userName,
                  mobile: message.data.mobile,
                  fullAddress: message.data.fullAddress,
                },
              });
              wx.setStorageSync('addressInfo', {
                storeId: message.data.storeId,
                addressSummary: message.data.sendTo,
                addressExt: message.data.sendTo,
                address: message.data.sendTo,
                lat: message.data.coord[0],
                lon: message.data.coord[1],
                userName: message.data.userName,
                mobile: message.data.mobile,
                fullAddress: message.data.fullAddress,
              });
            }
            break;
        }
      });
    }
  },
});
