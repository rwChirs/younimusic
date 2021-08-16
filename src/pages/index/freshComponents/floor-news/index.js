// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';

export default class FloorNews extends Component {
  static defaultProps = {
    data: {
      leftImage: '',
      items: [],
    },
  };

  state = {
    defaultLeftImage:
      '//m.360buyimg.com/img/jfs/t1/77683/37/1629/4241/5cff161aE05cc2f48/8c87dada590d93eb.png',
  };

  render() {
    const { data, onGoToUrl } = this.props;
    const {
      leftImage,
      items,
      contentbackGroudColor,
      backGroudColor,
      image = '',
      pictureAspect,
    } = data;
    return (
      <View
        className='floor-news-wrap'
        style={{
          backgroundColor: backGroudColor || '#ffffff',
          backgroundImage: image ? `url(${image})` : 'unset',
        }}
      >
        <View
          className='floor-news'
          style={{ backgroundColor: contentbackGroudColor || '#ffffff' }}
        >
          <View className='floor-news-title lazy-load-img'>
            <Image
              style={{
                width: pictureAspect ? 32 * pictureAspect + 'rpx' : '136rpx',
              }}
              src={leftImage || this.state.defaultLeftImage}
              className='floor-news-img'
              mode='aspectFit'
              lazyLoad
            />
          </View>
          <Swiper
            className='floors-news-swiper'
            interval={2500}
            duration={1000}
            autoplay
            circular
            vertical
          >
            {items &&
              items.length &&
              items.map((val, i) => {
                return (
                  <SwiperItem
                    className='floor-news-item lazy-load-img'
                    taroKey={String(i)}
                    onClick={onGoToUrl.bind(this, val.action)}
                    key={i.toString()}
                  >
                    {val.image && (
                      <Image
                        src={filterImg(val.image)}
                        className='item-image'
                        lazyLoad
                      />
                    )}
                    <Text className='item-txt'>{val.title}</Text>
                  </SwiperItem>
                );
              })}
          </Swiper>
        </View>
      </View>
    );
  }
}
