import Taro from '@tarojs/taro';
import { Component } from 'react';
import {
  View,
  Image,
  Swiper,
  SwiperItem,
  ScrollView,
} from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';
import { px2vw } from '../../../../utils/utils';

export default class SwiperImg extends Component {

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          windowWidth: res.windowWidth,
        });
      },
    });

    let { data } = this.props;
    if (data.length === 1) {
      this.setState({
        nextMargin: 0,
      });
    }
  }

  scrollChange = ev => {
    this.setState(
      {
        activeIndex: ev && ev.detail && ev.detail.current,
      },
      () => {
        this.setState({
          nextMargin:
            this.state.activeIndex === this.props.data.length - 1
              ? ''
              : '110rpx',
          previousMargin:
            this.state.activeIndex === this.props.data.length - 1
              ? '104rpx'
              : '',
        });
      }
    );
  };
  itemClick = (action, ev) => {
    ev.stopPropagation();
    this.props.onGoToUrl(action);
  };
  state = {
    activeIndex: 0,
    nextMargin: '110rpx',
    previousMargin: '',
    windowWidth: 2,
  };

  scrollLeft = 0;

  handlerPadding = (index, length) => {
    let pixelRatio = this.state.windowWidth / 375;
    if (index > 3 && length - index > 1) {
      this.scrollLeft = Math.round((index - 3) * 8 * pixelRatio);
    }
    if (index < 3) {
      this.scrollLeft = 0;
    }
    return this.scrollLeft;
  };

  render() {
    let { data, radio } = this.props;
    const { activeIndex, nextMargin, previousMargin } = this.state;
    if (!data || !data.length) return null;
    radio = radio ? radio : 1.33;
    return (
      <View className='swiper-img'>
        <View
          className='swiper-box'
          style={{
            height: data.length === 1 ? px2vw(690 / radio) : px2vw(600 / radio),
          }}
        >
          <Swiper
            interval={2500}
            duration={1000}
            // circular
            onChange={this.scrollChange}
            className='swiper-img-box'
            nextMargin={nextMargin}
            previousMargin={previousMargin}
            // ref={this.swiperRef}
          >
            {data &&
              data.map((val, i) => {
                return val ? (
                  <SwiperItem
                    key={val}
                    className={`swiper-img-slider ${
                      i === activeIndex ? 'current-item ' : ''
                    }`}
                    taroKey={String(i)}
                  >
                    <Image
                      src={filterImg(val)}
                      className='swiper-img-img'
                      style={{
                        width: data.length === 1 ? px2vw(690) : px2vw(600),
                        height:
                          data.length === 1
                            ? px2vw(690 / radio)
                            : px2vw(600 / radio),
                      }}
                    />
                  </SwiperItem>
                ) : (
                  ''
                );
              })}
          </Swiper>
        </View>

        {data && data.length > 1 && (
          <ScrollView
            className='dot-list'
            scrollX
            scrollLeft={this.handlerPadding(activeIndex, data.length)}
            scrollWithAnimation
            enableFlex
            style={{ width: '70rpx' }}
          >
            {data.map((info, i) => {
              return (
                <View
                  className={activeIndex == i ? 'dot sel' : 'dot'}
                  key={info}
                  style={{
                    width: '8rpx',
                    marginRight: '8rpx',
                  }}
                ></View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }
}
