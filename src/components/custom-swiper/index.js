import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './index.scss';

export default class CustomSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  filterImg(img) {
    const productDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/10366/26/8278/700/5c3455c6E7713217b/bf369c461fca9fd9.png';
    let value = img ? img : productDefaultPicture;
    if (value) {
      if (value.indexOf('http') <= -1) {
        return 'https:' + value;
      } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
        let str = value.split('http:')[1];
        return 'https:' + str;
      } else if (value.indexOf('webp') > -1) {
        let str = value.replace('.webp', '');
        return str;
      } else {
        return value;
      }
    } else {
      return value;
    }
  }

  toggleFullscreen = () => {
    Taro.previewImage({
      current: this.state.current,
      urls:
        this.state.contents &&
        this.state.contents.map((content) =>
          content.imageUrl
            ? this.filterImg(content.imageUrl)
            : this.filterImg(content)
        ),
    });
  };

  onChange = (e) => {
    const { onSwiperChange } = this.props;
    if (onSwiperChange) {
      onSwiperChange(this.state.current, e.detail.current);
    }
    this.setState({
      current: e.detail.current,
    });
  };

  render() {
    const {
      indicatorDots,
      autoplay,
      circular,
      vertical,
      duration,
      prevMargin,
      nextMargin,
      contents,
      height,
    } = { ...this.props };
    return (
      <View className='custom-swiper'>
        <Swiper
          indicatorDots={indicatorDots}
          autoplay={autoplay}
          circular={circular}
          vertical={vertical}
          duration={duration}
          previousMargin={`${prevMargin}px`}
          nextMargin={`${nextMargin}px`}
          onChange={this.onChange}
          style={`height: ${height}px`}
        >
          {contents &&
            contents.map((content, index) => {
              return (
                <SwiperItem key={content.id ? content.id : index}>
                  <Image
                    src={
                      content.imageUrl
                        ? this.filterImg(content.imageUrl)
                        : this.filterImg(content)
                    }
                    mode='aspectFit'
                    lazy-load
                    onClick={this.toggleFullscreen}
                  />
                </SwiperItem>
              );
            })}
        </Swiper>
        <View className='indicator-dots'>
          {`${
            contents && contents.length && contents.length > 0
              ? this.state.current + 1
              : 0
          }/${contents && contents.length}`}
        </View>
      </View>
    );
  }
}
