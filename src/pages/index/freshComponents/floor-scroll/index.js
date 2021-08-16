import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import { commonLogExposure } from '../../../../utils/common/logReport';
import './index.scss';

export default class FloorScroll extends Component {
  state = {
    activeIndex: 0,
  };

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
    items.length > 0 &&
      items.map((item, i) => {
        const targetDom = `#floor-scroll-${floorIndex}-${i}`;
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

  scrollChange(ev) {
    this.setState({
      activeIndex: ev && ev.detail && ev.detail.current,
    });
  }

  itemClick(action, ev) {
    ev.stopPropagation();
    const { onGoToUrl } = this.props;
    onGoToUrl(action);
  }

  render() {
    const { onGoToUrl, data, windowWidth, borderRadius, autoplay } = this.props;
    const { pictureAspect, items, image = '', action, floorIndex } = data;
    const { activeIndex } = this.state;
    if (!items || !items.length) return null;
    const h = windowWidth / pictureAspect;
    const imgWidth = items.length > 1 ? 670 : 694;
    return (
      <View
        className='floor-scroll'
        style={{
          height: h + 'px',
          backgroundImage: image ? `url(${image})` : 'none',
        }}
        onClick={onGoToUrl.bind(this, action)}
      >
        <Swiper
          interval={2500}
          duration={200}
          circular
          autoplay={autoplay}
          // displayMultipleItems={items.length > 1 ? 1.2 : 1}
          nextMargin='80rpx'
          style={{ height: h + 'px' }}
          onChange={this.scrollChange.bind(this)}
          className='floor-scroll-swiper'
        >
          {items &&
            items.map((val, i) => {
              // 埋点增加字段,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
              const imageAction = {
                ...val.action,
                target: 3,
                index: i + 1,
                imageUrl: val.image,
              };
              return (
                <SwiperItem
                  key={i}
                  className={`floor-scroll-slider lazy-load-img ${
                    i === activeIndex ? 'current-item ' : ''
                  }`}
                  taroKey={String(i)}
                >
                  <Image
                    id={`floor-scroll-${floorIndex}-${i}`}
                    lazyLoad
                    src={filterImg(val.image)}
                    className='floor-scroll-img'
                    style={{
                      width: imgWidth + 'rpx',
                      height: imgWidth / pictureAspect + 'rpx',
                      borderRadius: borderRadius + 'rpx',
                    }}
                    onClick={this.itemClick.bind(this, imageAction)}
                  />
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    );
  }
}
