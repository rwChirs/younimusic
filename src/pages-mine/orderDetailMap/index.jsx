import Taro,{getCurrentInstance} from '@tarojs/taro';
import {
  View,
  Map,
  Image,
  CoverView,
  CoverImage,
  Canvas,
} from '@tarojs/components';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { exportPoint } from '../../utils/common/exportPoint';
import colorRequest from '../../utils/common/colorRequest';
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
import logUtil from '../../utils/weixinAppReport.js';
import './index.scss';

const log = logUtil.init();
const app = Taro.getApp().$app;
const qqmapsdk = new QQMapWX({
  key: app.wx_map_dev_key,
});
let timer = null;
let markersInit = [];
export default class OrderDetailMap extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      status: getCurrentInstance().router.params.status,
      mapWidth: `${wx.getSystemInfoSync().windowWidth}px`,
      mapHeight: `${wx.getSystemInfoSync().windowHeight}px`,
      markers: [],
      carrierInfo:
        Taro.getStorageSync('mapInfo') &&
        Taro.getStorageSync('mapInfo').carrierInfo,
      mapCenter: {},
      scale:
        Taro.getStorageSync('mapInfo') && Taro.getStorageSync('mapInfo').scale,
      imageWidth: 750,
      imageHeight: 300,
    };
  }

  componentDidMount() {
    this.setState(
      {
        markers:
          Taro.getStorageSync('mapInfo') &&
          Taro.getStorageSync('mapInfo').markers,
      },
      () => {
        // this.getCarrierInfo(true);
        exportPoint(getCurrentInstance().router);
        const { markers } = this.state;
        if (markers && markers.length !== 0) {
          this.mapCtx = wx.createMapContext('logisticsAllMap');
          markersInit = markers;
          this.mapCtx.includePoints({
            points: markers,
            padding: [130, 130, 130, 130],
          });
        }
      }
    );
  }

  componentWillUnmount() {
    clearInterval(timer);
    Taro.setStorageSync('mapInfo', null);
  }

  componentDidShow() {
    const { carrierInfo } = this.state;
    timer = setInterval(() => {
      this.getCarrierInfo(true);
    }, (carrierInfo.frequency || 60) * 1000);
    this.onPageShow();
  }

  componentDidHide() {
    clearInterval(timer);
    Taro.setStorageSync('mapInfo', null);
    this.onPageHide();
  }

  onTap() {}

  callPhone(phone, e) {
    //设置埋点
    log.click({
      event: e, //必填，点击事件event
      eid: `7FRESH_APP_6_1568944564798|37`,
      elevel: '',
      eparam: '',
      pname: '/pages-mine/orderDetailMap/index',
      pparam: '',
      target: '', //选填，点击事件目标链接，凡是能取到链接的都要上报
    });
    //拨打电话
    Taro.makePhoneCall({
      phoneNumber: phone,
    });
  }

  getCarrierInfo = () => {
    var that = this;
    const { carrierInfo, markers } = this.state;
    colorRequest({
      api: '7fresh.order.carrier',
      data: JSON.stringify({
        orderId: carrierInfo.orderId || '',
        tenantId: Number(carrierInfo.orderTenantId) || 1,
        storeId: carrierInfo.storeId,
      }),
    }).then(carrierRes => {
      const orderUserAddressWeb = markers.filter(
        item => item.type === 'address'
      )[0];
      const shopInfoExt =
        markers.filter(item => item.type === 'shop')[0] &&
        markers.filter(item => item.type === 'shop')[0];
      const carrier = `${carrierRes.lat},${carrierRes.lon}`;
      const userInfo = `${orderUserAddressWeb.latitude},${orderUserAddressWeb.longitude}`;
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
              // ctx.setFontSize(16);
              ctx.setFontSize(24);
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
                discountText = ` 配送中 | 距您${distance}`;
              } else {
                distance = res.result.elements[0].distance
                  ? res.result.elements[0].distance + 'm'
                  : 0 + 'm';
                discountText = ` 配送中|距您${distance}`;
              }
              let boxWidth = parseInt(ctx.measureText(discountText).width);
              console.log(boxWidth, 'boxWidth');
              // let width = boxWidth * 1.8;
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
              that.setState(
                {
                  imageWidth: width + 'px',
                  imageHeight: height + 'px',
                },
                () => {
                  ctx.clearRect(0, 0, 750, height);
                  ctx.drawImage(imageRes.path, 0, 0, width, height);
                  ctx.rotate(0);
                  ctx.moveTo(width / 2, 0);
                  ctx.beginPath();
                  ctx.setFillStyle('white');
                  ctx.fillText(discountText, boxWidth / 3 + 13, 33);
                  // ctx.fillText(discountText, boxWidth / 3+ 23 , 20);
                  ctx.draw(false, () => {
                    wx.canvasToTempFilePath({
                      canvasId: 'myCanvas',
                      success: res1 => {
                        var tempFilePath = res1.tempFilePath;
                        point =
                          carrierInfo.status.toString() !== '9'
                            ? [
                                {
                                  latitude: shopInfoExt.latitude,
                                  longitude: shopInfoExt.longitude,
                                  iconPath:
                                    'https://m.360buyimg.com/img/jfs/t1/115914/11/3256/5745/5ea78db5Edebb8825/30cd6a3d6773d9d9.png',
                                  width: '58rpx',
                                  height: '74rpx',
                                  anchor: { x: 0.5, y: 1 },
                                  type: 'shop',
                                },
                                {
                                  latitude: orderUserAddressWeb.latitude,
                                  longitude: orderUserAddressWeb.longitude,
                                  iconPath:
                                    'https://m.360buyimg.com/img/jfs/t1/107478/35/14185/6304/5ea544ccE35fa24fd/9d45a88d751fbc59.png',
                                  width: '66rpx',
                                  height: '80rpx',
                                  anchor: { x: 0.5, y: 1 },
                                  type: 'address',
                                },
                                {
                                  latitude: carrierRes.lat,
                                  longitude: carrierRes.lon,
                                  iconPath: tempFilePath,
                                  width: '280rpx',
                                  height: '80rpx',
                                  anchor: { x: 0.15, y: 1 },
                                  type: 'carrier',
                                },
                              ]
                            : [
                                {
                                  latitude: shopInfoExt.latitude,
                                  longitude: shopInfoExt.longitude,
                                  iconPath:
                                    'https://m.360buyimg.com/img/jfs/t1/115914/11/3256/5745/5ea78db5Edebb8825/30cd6a3d6773d9d9.png',
                                  width: '58rpx',
                                  height: '74rpx',
                                  type: 'shop',
                                },
                                {
                                  latitude: orderUserAddressWeb.latitude,
                                  longitude: orderUserAddressWeb.longitude,
                                  iconPath:
                                    'https://m.360buyimg.com/img/jfs/t1/127792/24/328/8455/5eb4d13eE46e8638a/2a93c7e83bbbd4d3.png',
                                  width: '160rpx',
                                  height: '70rpx',
                                  type: 'address',
                                  anchor: { x: 0.25, y: 1 },
                                },
                              ];
                        if (point && point.length !== 0) {
                          that.mapCtx = wx.createMapContext('logisticsAllMap');
                          that.mapCtx.includePoints({
                            points: point,
                            padding: [130, 130, 130, 130],
                          });
                        }
                        that.setState({
                          markers: point,
                          carrierInfo: {
                            ...that.state.carrierInfo,
                            avatar: carrierRes.avatar,
                            frequency: carrierRes.frequency,
                            inDeliveryText: carrierRes.inDeliveryText,
                            nameText: carrierRes.nameText,
                            successText: carrierRes.successText,
                            tel: carrierRes.tel,
                            distance: distance,
                          },
                        });
                      },
                    });
                  });
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
  };

  onControls() {
    this.mapCtx.includePoints({
      points: markersInit,
    });
  }

  render() {
    const {
      mapHeight,
      mapWidth,
      carrierInfo,
      markers,
      scale,
      imageWidth,
      imageHeight,
    } = this.state;
    return (
      <View>
        <View style={{ position: 'fixed', top: '9999rpx' }}>
          <Canvas
            style={{ width: imageWidth, height: imageHeight }}
            canvasId='myCanvas'
          />
        </View>
        <Map
          onClick={this.onTap}
          style={{ width: mapWidth, height: mapHeight }}
          show-scale
          markers={markers}
          scale={scale}
          id='logisticsAllMap'
        >
          <CoverView class='controls' onClick={this.onControls}>
            <CoverImage
              class='coverImg'
              src='https://m.360buyimg.com/img/jfs/t1/80495/27/5191/8998/5d36dc1cEfcfc903c/7bf245ddae79d37e.png'
            />
          </CoverView>
        </Map>
        <View className='bottom-info'>
          <Image
            src={
              carrierInfo.avatar
                ? carrierInfo.avatar
                : 'https://m.360buyimg.com/img/jfs/t1/110459/22/14936/624/5ea9392fE73712d8a/002e5d7518f564f5.png'
            }
            alt='7FRESH'
            className='carrier-pic'
          />
          <View>
            <View className='carrier-name'>{carrierInfo.nameText}</View>
            <View className='carrier-distance'>
              {carrierInfo.status !== '9'
                ? carrierInfo.inDeliveryText + carrierInfo.distance
                : carrierInfo.successText}
            </View>
          </View>
          <View className='carrier-line'></View>
          <View onClick={this.callPhone.bind(this, carrierInfo.tel)}>
            <Image
              src='https://m.360buyimg.com/img/jfs/t1/115747/25/3562/425/5ea937adE79493444/985cc83db33c20e2.png'
              alt='7FRESH'
              className='carrier-phone'
            />
          </View>
        </View>
      </View>
    );
  }
}
