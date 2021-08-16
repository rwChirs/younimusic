// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg, px2vw } from '../../../../utils/common/utils';

export default class StackingSwiper extends Component {
  static defaultProps = {
    data: {
      pictureAspect: 0,
      image: '',
      items: [],
      moreAction: [],
      horizontalScrollIndicator: 1,
      action: {},
    },
    speed: 3000,
    duration: 500,
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      bannerSite: {
        pre: 3,
        current: 0,
        next1: 1,
        next2: 2,
      },
      transitionStyle: {},
    };
    this.timer = null;
    this.touchX = 0;
    this.touchY = 0;
    this.isScrolling = false;
  }

  componentWillMount() {
    if (this.timer) clearInterval(this.timer);
    this.init();
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  init() {
    const { data } = this.props;
    let items = data.items;
    items = items.length > 4 ? items : [...items, ...items]; //如果不够3个克隆一遍

    this.setState(
      {
        items: items,
        bannerSite: {
          pre: items.length - 1,
          current: 0,
          next1: 1,
          next2: 2,
        },
        transitionStyle: this.calTransitionStyle(
          data.width,
          data.pictureAspect
        ),
      },
      () => {
        this.startMove();
      }
    );
  }

  calTransitionStyle(width, pictureAspect) {
    const duration = this.props.duration || 500;
    var _multiples = (w, m) => {
      if (w <= 345 * m) {
        return m;
      } else {
        return _multiples(w, m + 1);
      }
    };
    let multiples = _multiples(width, 1); //计算几倍图
    const _width = Math.round(750 * (width / (375 * multiples))); //计算每个轮播图单位为px的宽
    const _height = Math.round(_width / pictureAspect); //计算每个轮播图单位为px的高

    return {
      width: px2vw(_width),
      height: px2vw(_height),
      default: {
        width: px2vw(_width),
        height: px2vw(_height),
        transitionDuration: `${duration}ms`,
      },
      current: {
        right: px2vw(690 - _width),
        transform: `scale(1)`,
        zIndex: 3,
        opacity: 1,
      },
      next1: {
        right: px2vw((690 - _width) / 2),
        transform: `scale(0.85)`,
        zIndex: 2,
        opacity: 1,
      },
      next2: {
        right: 0,
        transform: `scale(0.66)`,
        zIndex: 1,
        opacity: 1,
      },
      pre: {
        right: px2vw(750),
        transform: `scale(1)`,
        zIndex: 4,
        opacity: 0,
      },
    };
  }
  //direction: 正向：1；倒向 -1
  move(direction) {
    const { onChange, data } = this.props;
    let items = data.items;
    const maxIndex = this.state.items.length - 1;
    let bannerSite = this.state.bannerSite;
    if (direction === -1) {
      bannerSite.current =
        bannerSite.current - 1 < 0 ? maxIndex : bannerSite.current - 1;
    } else {
      bannerSite.current =
        bannerSite.current + 1 > maxIndex ? 0 : bannerSite.current + 1;
    }
    bannerSite.next1 =
      bannerSite.current + 1 > maxIndex ? 0 : bannerSite.current + 1;
    bannerSite.next2 =
      bannerSite.next1 + 1 > maxIndex ? 0 : bannerSite.next1 + 1;
    bannerSite.pre =
      bannerSite.current === 0 ? maxIndex : bannerSite.current - 1;
    // console.log('startMove',bannerSite)
    onChange &&
      onChange(
        bannerSite.current > items.length - 1
          ? bannerSite.current - items.length
          : bannerSite.current
      );
    this.setState({
      bannerSite,
    });
  }

  startMove() {
    clearInterval(this.timer);
    const speed = this.props.speed || 3000;
    this.timer = setInterval(() => {
      this.move(1);
    }, speed);
  }

  handleTouchStart(ev) {
    clearInterval(this.timer);
    // console.log('handleTouchStart',ev)
    this.touchX = ev.touches[0].pageX;
    this.touchY = ev.touches[0].pageY;
  }

  handleTouchMove(ev) {
    const moveX = Math.abs(ev.touches[0].pageX - this.touchX);
    const moveY = Math.abs(ev.touches[0].pageY - this.touchY);
    // console.log('moveX', moveX, moveY);
    if (moveX < moveY) {
      this.isScrolling = true;
    } else {
      ev.stopPropagation();
      this.isScrolling = false;
    }
  }

  handleTouchEnd(ev) {
    // console.log('handleTouchEnd',ev)
    if (this.isScrolling) return;
    let pageX = ev.changedTouches[0].pageX;
    if (this.touchX - pageX < -10) {
      this.move(-1);
    } else {
      this.move(0);
    }
    this.startMove();
  }

  handleClick = (item, i, ev) => {
    ev.stopPropagation();
    this.props.onClick && this.props.onClick({ ...item, index: i });
  };

  render() {
    const {
      data: { floorIndex },
    } = this.props;
    const { items, bannerSite, transitionStyle } = this.state;
    const _selectStyle = (i) => {
      if (i === bannerSite.current) {
        return transitionStyle.current;
      }
      if (i === bannerSite.next1) {
        return transitionStyle.next1;
      }
      if (i === bannerSite.next2) {
        return transitionStyle.next2;
      }
      if (i === bannerSite.pre) {
        return transitionStyle.pre;
      }
    };
    return (
      <View className='stacking-swiper'>
        <View className='slides-box'>
          <View
            className='slide_wrap'
            style={{
              height: transitionStyle.height,
            }}
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
          >
            {items &&
              items.length > 0 &&
              items.map((item, i) => {
                return (
                  <View
                    className='slide lazy-load-img'
                    style={{
                      ...transitionStyle.default,
                      ..._selectStyle(i),
                    }}
                    key={i}
                    onClick={this.handleClick.bind(this, item, i)}
                  >
                    <Image
                      id={`floor-better-100-${floorIndex}-${i}`}
                      className='img'
                      alt='优选100'
                      style={{
                        width: transitionStyle.width,
                        height: transitionStyle.height,
                      }}
                      src={filterImg(item.image)}
                      lazyLoad
                    />
                  </View>
                );
              })}
          </View>
        </View>
      </View>
    );
  }
}
