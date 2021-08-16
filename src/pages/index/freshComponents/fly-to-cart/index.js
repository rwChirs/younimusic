// import Taro, { Component, getApp } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

const app = Taro.getApp().$app;

class FlyToCart extends Component {
  constructor() {
    this.state = {
      ani: null,
      flag: true,
      imgUrl: null,
    };
  }

  componentWillMount() {
    this.timer && clearInterval(this.timer);
  }

  componentDidMount() {
    Taro.getSystemInfo().then((res) => {
      const { screenWidth, screenHeight } = res;
      const isConcern = app.globalData.isConcern;
      this.endPos = {
        x: screenWidth - 50,
        y: screenHeight - (!isConcern ? 300 : 150),
      };
      console.log(this.endPos);
      if (!this.state.flag) return;
      this.setState({
        flag: false,
      });
      let {
        startPos, //初始位置
        img, //图片路径
      } = this.props;
      this.setState(
        {
          imgUrl: img,
          startPos,
        },
        () => {
          console.log(this.props);
          var topPoint = {};

          if (startPos['y'] < this.endPos['y']) {
            topPoint['y'] = startPos['y'] - 50;
          } else {
            topPoint['y'] = this.endPos['y'] - 50;
          }
          topPoint['x'] =
            Math.abs(startPos['x'] - this.endPos['x']) / 2 + startPos['x'];
          this.linePos = this.bezier([startPos, topPoint, this.endPos], 20);
          // 缩小动画
          this.scaleAnimation(1);
          // 贝塞尔曲线动画
          this.startAnimation();
        }
      );
    });
  }

  endPos = {
    x: 320,
    y: 600,
  };

  bezier = (points, times) => {
    // 0、以3个控制点为例，点A,B,C,AB上设置点D,BC上设置点E,DE连线上设置点F,则最终的贝塞尔曲线是点F的坐标轨迹。
    // 1、计算相邻控制点间距。
    // 2、根据完成时间,计算每次执行时D在AB方向上移动的距离，E在BC方向上移动的距离。
    // 3、时间每递增100ms，则D,E在指定方向上发生位移, F在DE上的位移则可通过AD/AB = DF/DE得出。
    // 4、根据DE的正余弦值和DE的值计算出F的坐标。
    // 邻控制AB点间距
    var bezier_points = [];
    var points_D = [];
    var points_E = [];
    const DIST_AB = Math.sqrt(
      Math.pow(points[1]['x'] - points[0]['x'], 2) +
        Math.pow(points[1]['y'] - points[0]['y'], 2)
    );
    // 邻控制BC点间距
    const DIST_BC = Math.sqrt(
      Math.pow(points[2]['x'] - points[1]['x'], 2) +
        Math.pow(points[2]['y'] - points[1]['y'], 2)
    );
    // D每次在AB方向上移动的距离
    const EACH_MOVE_AD = DIST_AB / times;
    // E每次在BC方向上移动的距离
    const EACH_MOVE_BE = DIST_BC / times;
    // 点AB的正切
    const TAN_AB =
      (points[1]['y'] - points[0]['y']) / (points[1]['x'] - points[0]['x']);
    // 点BC的正切
    const TAN_BC =
      (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
    // 点AB的弧度值
    const RADIUS_AB = Math.atan(TAN_AB);
    // 点BC的弧度值
    const RADIUS_BC = Math.atan(TAN_BC);
    // 每次执行
    for (var i = 1; i <= times; i++) {
      // AD的距离
      var dist_AD = EACH_MOVE_AD * i;
      // BE的距离
      var dist_BE = EACH_MOVE_BE * i;
      // D点的坐标
      var point_D = {};
      point_D['x'] = dist_AD * Math.cos(RADIUS_AB) + points[0]['x'];
      point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
      points_D.push(point_D);
      // E点的坐标
      var point_E = {};
      point_E['x'] = dist_BE * Math.cos(RADIUS_BC) + points[1]['x'];
      point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
      points_E.push(point_E);
      // 此时线段DE的正切值
      var tan_DE =
        (point_E['y'] - point_D['y']) / (point_E['x'] - point_D['x']);
      // tan_DE的弧度值
      var radius_DE = Math.atan(tan_DE);
      // 地市DE的间距
      var dist_DE = Math.sqrt(
        Math.pow(point_E['x'] - point_D['x'], 2) +
          Math.pow(point_E['y'] - point_D['y'], 2)
      );
      // 此时DF的距离
      var dist_DF = (dist_AD / DIST_AB) * dist_DE;
      // 此时DF点的坐标
      var point_F = {};
      point_F['x'] = dist_DF * Math.cos(radius_DE) + point_D['x'];
      point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
      bezier_points.push(point_F);
    }
    return {
      bezier_points: bezier_points,
    };
  };

  startAnimation = () => {
    var index = 0,
      bezier_points = this.linePos['bezier_points'];
    this.setState({
      bus_x: this.state.startPos.x,
      bus_y: this.state.startPos.y,
    });
    this.timer = setInterval(() => {
      index++;
      this.setState({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y'],
      });
      if (index >= 18) {
        clearInterval(this.timer);
        this.setState({
          flag: true,
        });
        this.scaleAnimation(0);
        // 重置动画
        this.props.onEnd();
      } else {
        this.scaleAnimation(1 - index / 18);
      }
    }, 20);
  };

  scaleAnimation = (radio) => {
    const animation = wx.createAnimation({
      duration: 20, // 33*28
      timingFunction: 'linear',
    });
    animation.scale(radio).step();
    this.setState({
      ani: animation.export(),
    });
  };

  render() {
    const { flag, bus_x = 0, bus_y = 0, imgUrl, ani } = this.state;
    return (
      <View
        className='flyBox'
        hidden={flag}
        style={{
          left: `${bus_x}px`,
          top: `${bus_y}px`,
          position: 'fixed',
          zIndex: 999,
        }}
        animation={ani}
      >
        {bus_x > 0 && bus_y > 0 && <Image src={imgUrl} className='img'></Image>}
      </View>
    );
  }
}

export default FlyToCart;
