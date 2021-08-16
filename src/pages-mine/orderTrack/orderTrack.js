import Taro from '@tarojs/taro';
import colorRequest from '../../utils/common/colorRequest';
import { exportPoint } from '../../utils/common/exportPoint';
import srUtils from '../../utils/zhls';
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
import logUtil from '../../utils/weixinAppReport.js';

const log = logUtil.init();
const app = Taro.getApp().$app;
const qqmapsdk = new QQMapWX({
  key: app.wx_map_dev_key,
});
const { onPageShow, onPageHide } = srUtils;

Page({
  data: {
    //地图相关
    imageWidth: '',
    imageHeight: '',
    carrierInfo: {},
  },
  onLoad(options) {
    exportPoint(this.$router);
    if (options.id) {
      this.setData({
        orderId: options.id || '',
        orderTenantId: options.orderTenantId,
        storeId: options.storeId,
        status: options.status,
      });
    }
    this.getOrderTrack();
  },
  onShow: function() {
    onPageShow();
  },
  onHide: function() {
    onPageHide();
  },
  /*
    点击展示不同的订单类型列表
  */
  getOrderTrack() {
    var that = this;
    colorRequest({
      api: '7fresh.order.ums',
      data: JSON.stringify({
        orderId: that.data.orderId || '',
        tenantId: Number(that.data.orderTenantId) || 1,
      }),
    }).then(({ umsInfos, showGis, orderUserAddressWeb, shopInfoExt }) => {
      umsInfos &&
        umsInfos.map(item => {
          item.content = this.addTelHref(item.content);
        });
      that.setData({
        umsInfo: umsInfos,
      });
      that.getCarrierInfo(umsInfos, showGis, orderUserAddressWeb, shopInfoExt);
    });
  },
  //地图相关
  getCarrierInfo(umsInfos, showGis, orderUserAddressWeb, shopInfoExt) {
    var that = this;
    colorRequest({
      api: '7fresh.order.carrier',
      data: JSON.stringify({
        orderId: that.data.orderId || '',
        tenantId: Number(that.data.orderTenantId) || 1,
        storeId: that.data.storeId,
      }),
    }).then(carrierRes => {
      const carrier = `${carrierRes && carrierRes.lat},${carrierRes &&
        carrierRes.lon}`;
      const userInfo = `${orderUserAddressWeb &&
        orderUserAddressWeb.lat},${orderUserAddressWeb &&
        orderUserAddressWeb.lng}`;
      let point = [];
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
              const ctx = wx.createCanvasContext('myCanvas');
              let distance;
              let discountText = '';
              if (
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
              ctx.setFontSize(24);
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

              that.setData(
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
                    orderId: that.data.orderId || '',
                    tenantId: Number(that.data.orderTenantId) || 1,
                    storeId: that.data.storeId,
                    status: that.data.status,
                  },
                },
                () => {
                  ctx.clearRect(0, 0, 750, height);
                  ctx.drawImage(imageRes.path, 0, 0, width, height);
                  ctx.rotate(0);
                  ctx.moveTo(width / 2, 0);
                  ctx.beginPath();
                  ctx.setFillStyle('white');
                  ctx.fillText(discountText, boxWidth / 3 + 13, 33);
                  ctx.draw(
                    false,
                    setTimeout(() => {
                      wx.canvasToTempFilePath({
                        canvasId: 'myCanvas',
                        success: res1 => {
                          var tempFilePath = res1.tempFilePath;
                          console.log(that, 'status');
                          point =
                            that.data.status !== '9'
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
                          that.mapCtx = wx.createMapContext('logisticsMap');
                          that.mapCtx.includePoints({
                            points: point,
                            padding: [60, 70, 30, 70],
                            success: () => {
                              that.mapCtx.getScale({
                                success: getScale => {
                                  that.setData({
                                    scale: getScale.scale,
                                  });
                                },
                              });
                            },
                          });
                          that.setData({
                            umsInfo: umsInfos,
                            markers: point,
                          });
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
  },
  toOrderDetailMap(e) {
    //设置埋点
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_APP_6_1568944564798|35`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/orderTrack/orderTrack',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    wx.setStorageSync('mapInfo', {
      markers: this.data.markers,
      carrierInfo: this.data.carrierInfo,
      scale: this.data.scale || '',
    });
    wx.navigateTo({
      url: `/pages-mine/orderDetailMap/index`,
    });
  },

  //物流信息中手机号可直接拨打
  addTelHref(string_content) {
    var reg = /(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?|1[34578]\d{9}/; //匹配手机号与国内座机号
    var res = string_content.match(reg);
    let list = [];
    if (res) {
      var phone = res[0];
      string_content = string_content.split(phone).filter(val => {
        return !(!val || val === '');
      });
      string_content.splice(1, 0, phone);
      for (var i in string_content) {
        var flag = string_content[i] != '' && reg.test(string_content[i]);
        string_content[i] != '' &&
          list.push({
            type: flag ? 'phone' : 'text',
            val: string_content[i],
            telFlag: true,
          });
      }
    } else {
      list = [{ type: 'text', val: string_content, telFlag: false }];
    }
    return list;
  },

  makePhoneCall: function(e) {
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_APP_6_1568944564798|34`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/orderTrack/orderTrack',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    });
  },
});
