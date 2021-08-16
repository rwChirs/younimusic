import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FreshPosterSwiper extends Component {
  onClick = () => {
    const { data } = this.props;
    this.props.onClick(data);
  };
  render() {
    const { data, itemStyle } = this.props;
    const { swiperItems } = data;
    let aList = [];
    let bList = [];
    let cList = [];
    let dList = [];
    let List = [];
    let allList = [];
    let show = true;
    let second = false;
    // 4的倍数
    if (swiperItems && swiperItems.length > 0) {
      if (swiperItems.length < 4) {
        show = false;
      } else if (swiperItems.length === 4) {
        List = swiperItems;
      } else if (swiperItems.length > 4 && swiperItems.length < 8) {
        List = swiperItems.slice(0, 4);
      } else if (swiperItems.length > 7) {
        second = true;
        aList = [swiperItems[0].imageUrl, swiperItems[4].imageUrl];
        bList = [swiperItems[1].imageUrl, swiperItems[5].imageUrl];
        cList = [swiperItems[2].imageUrl, swiperItems[6].imageUrl];
        dList = [swiperItems[3].imageUrl, swiperItems[7].imageUrl];
        allList = [aList, bList, cList, dList];
      }
    } else {
      show = false;
    }
    return (
      show && (
        <View
          className='poster-swiper-component'
          onClick={this.onClick}
          style={itemStyle}
        >
          <View className='header'>
            <View className='top'>
              <View className='left'>
                <View className='title'>{data.title}</View>
                <View className='desc'>{data.subTitle}</View>
              </View>
              <View className='dot' />
            </View>
            <View className='line' />
          </View>

          {/* 一屏 */}
          {!second && (
            <View className='swiper'>
              <View className='poster-list'>
                {List.map((info, index) => (
                  <Image
                    key={index}
                    className='poster-img'
                    src={filterImg(info.imageUrl)}
                    mode='aspectFit'
                    lazyLoad
                  />
                ))}
              </View>
            </View>
          )}
          {/* 两屏 */}
          {second && (
            <View className='swiper'>
              <View className='mask' />
              {allList &&
                allList.map((info, index) => (
                  <View className='poster-list' key={`${index}`}>
                    <Swiper
                      isHorizontal={false}
                      style={{
                        width: `${Taro.pxTransform(parseInt(144))}`,
                        height: `${Taro.pxTransform(parseInt(144))}`,
                      }}
                      interval={3000}
                      duration={150}
                      autoplay
                      circular
                      vertical
                    >
                      {info &&
                        info.map((item, k) => (
                          <SwiperItem key={`${k}`}>
                            <Image
                              className='poster-img'
                              src={filterImg(item)}
                              mode='aspectFit'
                              lazyLoad
                            />
                          </SwiperItem>
                        ))}
                    </Swiper>
                  </View>
                ))}
            </View>
          )}
        </View>
      )
    );
  }
}
