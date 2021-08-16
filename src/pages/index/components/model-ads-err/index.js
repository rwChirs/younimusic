// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Map } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
// import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
import './index.scss';

// const app = Taro.getApp();
// const qqmapsdk = new QQMapWX({
//   key: app.wx_map_dev_key,
// });

export default class ModelAdsErr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 腾讯地图服务key
      // wx_map_dev_key: 'BNZBZ-MBPR3-KDB33-YNKYF-HK6AQ-GGBLD'
    };
  }
  componentDidMount() {
    this.loadMapScript();
  }

  // 地图
  loadMapScript = () => {
    const { lat, lon } = this.props;
    console.log('修正地址经纬度:', Number(lat), Number(lon));

    //   // 创建一个script去添加引入js
    //   const script = document.createElement('script')
    //   script.type = 'text/javascript'
    //   script.src = `https://map.qq.com/api/js?v=2.exp&key=${this.state.wx_map_dev_key}&callback=init&libraries=drawing,geometry,autocomplete,convertor`
    //   document.body.appendChild(script)

    //   const that = this
    //   window.init = function() {
    //     let geoLatitude = lat || ''
    //     let geoLongitude = lon || ''
    //     console.log('geoLatitude, geoLongitude:', geoLatitude, geoLongitude)
    //     // 地图

    //     that.setState({}, () => {
    //       const center = new window.qq.maps.LatLng(geoLatitude, geoLongitude)
    //       const map = new window.qq.maps.Map(document.getElementById('map'), {
    //         center: center,
    //         zoom: 16, //设置缩放级别
    //         backgroundColor: '#fff',
    //         zoomControl: false, // 缩放控件
    //         mapTypeControl: false, // 地图类型控件
    //         panControl: false, //平移控件
    //         scaleControl: false, // 比例尺控件
    //         draggable: false, //设置是否可以拖拽
    //         disableDoubleClickZoom: true //设置是否可以双击放大
    //       })
    //       console.log('【地图属性】:', window.qq.maps)
    //       // marker
    //       const marker = new window.qq.maps.Marker({
    //         //设置Marker的位置坐标
    //         // position: center,
    //         //设置显示Marker的地图
    //         map: map
    //       })
    //       marker.setAnimation(window.qq.maps.MarkerAnimation.DOWN)
    //       // 定位标志
    //       // let anchor = new window.qq.maps.Point(40, 50),
    //       //   size = new window.qq.maps.Size(68, 57),
    //       //   origin = new window.qq.maps.Point(0, 0),
    //       //   icon = new window.qq.maps.MarkerImage(
    //       //     'https://m.360buyimg.com/img/jfs/t1/71321/39/192/3389/5ce4f339E88b5e325/d3be80797f13c469.png',
    //       //     size,
    //       //     origin,
    //       //     anchor
    //       //   )
    //       // marker.setIcon(icon)
    //     })
    //   }
  };

  render() {
    const { styles, sendTo, lat, lon } = this.props;
    let markers = [
      {
        latitude: lat,
        longitude: lon,
        iconPath:
          'https://m.360buyimg.com/img/jfs/t1/107478/35/14185/6304/5ea544ccE35fa24fd/9d45a88d751fbc59.png',
        width: '66rpx',
        height: '80rpx',
        anchor: { x: 0.5, y: 1 },
        type: 'address',
      },
    ];
    return (
      <View>
        <View className='ads-layer'>
          <View
            className='ads-code-model'
            style={{
              width: styles && styles.width ? styles.width : px2vw(610),
              height: styles && styles.height ? styles.height : px2vw(558),
            }}
          >
            <View className='ads-title'>请确认地图位置是否准确</View>
            <View className='ads-des'>收货地址：{sendTo}</View>
            <Map
              className='ads-map'
              id='map'
              latitude={lat}
              longitude={lon}
              scale={16}
              // enableZoom={false}
              // enableScroll={false}
              enableRotate={false}
              markers={markers}
            ></Map>
            <View className='ads-btn'>
              <View className='sure' onClick={this.props.onSureAds}>
                没问题
              </View>
              <View className='updata' onClick={this.props.onGoAds}>
                我要修改
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
