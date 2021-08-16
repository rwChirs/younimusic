import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';
import { commonLogExposure } from '../../../../utils/common/logReport';

export default class FloorImg extends Component {
  static defaultProps = {
    data: {
      items: [],
      image: '',
      pictureAspect: 0,
    },
    windowWidth: 375,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      autoplay: true,
    };
  }

  componentWillMount() {
    this.imageExposure();
  }

  componentWillUnmount() {
    this._intersectionObserver && this._intersectionObserver.disconnect();
  }

  // 图片曝光
  imageExposure = () => {
    const {
      data: { floorIndex, buriedPointVo, items },
    } = this.props;
    items &&
      items.length > 0 &&
      items.map((item, i) => {
        const targetDom = `#floor-img-${floorIndex}-${i}`;
        this._intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        this._intersectionObserver
          .relativeToViewport({ left: 0, right: 0, top: 50, bottom: 50 })
          .observe(targetDom, () => {
            if (!this[targetDom]) {
              //曝光埋点
              if (buriedPointVo) {
                const expAction = {
                  target: 3,
                  index: i + 1,
                  imageUrl: item.image,
                  floorIndex,
                };
                commonLogExposure({
                  action: expAction, // 曝光动作参数
                  buriedPointVo: buriedPointVo,
                });
                this[targetDom] = true;
              }
            }
          });
      });
  };

  componentDidShow() {
    this.setState(
      {
        current: this.itemClicked ? this.state.current : 0,
      },
      () => {
        this.setState({
          autoplay: true,
        });
      }
    );

    this.itemClicked = false;
  }

  componentDidHide() {
    this.setState({
      autoplay: false,
    });
  }

  changeIndex(ev) {
    this.setState({
      current: ev.currentTarget.current,
    });
  }

  clickItem(action, ev) {
    ev.stopPropagation();
    this.props.onGoToUrl(action);
    this.itemClicked = true;
  }
  render() {
    const { data, windowWidth } = this.props;
    const { items, image = '', pictureAspect, floorIndex } = data;
    const { current, autoplay } = this.state;
    const h = (windowWidth - 28) / pictureAspect;
    return (
      <View
        className='swiper-img-wrap'
        style={{ backgroundImage: image ? `url(${image})` : '' }}
      >
        <Swiper
          style={{ height: h + 'px' }}
          interval={2500}
          duration={200}
          autoplay={autoplay}
          circular
          current={current}
          indicatorDots={!!(items.length > 1)}
          indicatorColor='rgba(255,255,255,0.3)'
          indicatorActiveColor='rgba(255,255,255,1)'
          onChange={this.changeIndex.bind(this)}
        >
          {items &&
            items.map((val, i) => {
              // 埋点增加字段,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
              const imageAction = {
                ...val.action,
                target: 10,
                index: i + 1,
                imageUrl: val.image,
              };
              return (
                <SwiperItem
                  key={String(i)}
                  className='swiper-item lazy-load-img'
                  taroKey={String(i)}
                  onClick={this.clickItem.bind(this, imageAction)}
                >
                  <Image
                    id={`floor-img-${floorIndex}-${i}`}
                    src={filterImg(val.image)}
                    className='img'
                    style={{
                      height: h + 'px',
                      width: windowWidth - 28 + 'px',
                      marginLeft: 14 + 'px',
                    }}
                    key={i}
                    lazyLoad
                  />
                  {val.dynamicLabels &&
                    val.dynamicLabels.length > 0 &&
                    val.dynamicLabels.map((v, k) => {
                      const btnStyle = {
                        minWidth: (v.endX - v.startX) * windowWidth + 'px',
                        minHeight: (v.endY - v.startY) * h + 'px',
                        left: v.startX * windowWidth + 'px',
                        top: v.startY * h + 'px',
                        backgroundColor: v.backgroundColor,
                        color: v.textColor,
                        fontSize: v.font + 'px',
                        borderRadius:
                          Math.max((v.endY - v.startY) * h, v.font) +
                          4 / 2 +
                          'px',
                        padding: '2px 7px',
                      };
                      return (
                        <View
                          className='floor-notice-dynamic-area'
                          style={btnStyle}
                          key={k}
                        >
                          {v.text}
                        </View>
                      );
                    })}
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    );
  }
}
