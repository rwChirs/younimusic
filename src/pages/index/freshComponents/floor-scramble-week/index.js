import Taro from '@tarojs/taro';
import { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  Text,
  Swiper,
  SwiperItem,
} from '@tarojs/components';
import FreshWeekSwiper from '../fresh-week-swiper';
import { filterImg } from '../../../../utils/common/utils';
import { addCart } from '../../../../common/images';
import './index.scss';

export default class FreshFloorScrambleToday extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onGoDetail() {
    this.props.onGoDetail && this.props.onGoDetail(...arguments);
  }

  onAddCart() {
    this.props.onAddCart && this.props.onAddCart(...arguments);
  }

  onSearchMore() {
    this.props.onSearchMore && this.props.onSearchMore(...arguments);
  }

  render() {
    const { data, theme, isSwiper } = this.props;
    const { backgroundImage, items, backGroudColor } = data;

    return (
      <View className='floor-scramble-today-wrap'>
        <View
          className='floor-scramble-today'
          style={{
            backgroundColor: backGroudColor || '#fff',
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : 'none',
          }}
        >
          <View className='fresh-title'>
            <View className='fresh-title-left'>
              <Text className='name'>{data.firstTitle || '今日值得抢'}</Text>
              <Text className='desc'>{data.secondTitle || '明星爆款直降'}</Text>
            </View>
            <View className='fresh-more' onClick={this.onSearchMore.bind(this)}>
              更多
              <Text className='i' />
            </View>
          </View>
          {theme === 'default' && (
            <View className='floor-scramble-today-goods'>
              <ScrollView
                scrollX
                scrollWithAnimation
                lowerThreshold={0}
                className='scroll-wrap'
              >
                <View className='floor-scramble-today-list'>
                  <View className='floor-week-list'>
                    <View className='floor-week-goods'>
                      {items &&
                        items.length > 0 &&
                        items.map((val, index) => {
                          return (
                            <View className='goods' key={`goods-list-${index}`}>
                              <View className='discount'>5.8折</View>
                              <Image
                                className='image'
                                alt={val.skuName}
                                src={filterImg(val.imageUrl)}
                                onClick={this.onGoDetail.bind(this)}
                                lazyload
                              />
                              <Swiper
                                isHorizontal={false}
                                style={{
                                  width: `${Taro.pxTransform(parseInt(200))}`,
                                  height: `${Taro.pxTransform(parseInt(30))}`,
                                }}
                                interval={2500}
                                duration={1000}
                                autoplay
                                circular
                                vertical
                              >
                                <SwiperItem>
                                  <View className='info'>1人已下单</View>
                                </SwiperItem>
                                <SwiperItem>
                                  <View className='info'>2人已下单</View>
                                </SwiperItem>
                                <SwiperItem>
                                  <View className='info'>3人已下单</View>
                                </SwiperItem>
                              </Swiper>

                              {val.jdPrice && (
                                <View className='jd-price'>¥{val.jdPrice}</View>
                              )}
                              <Image
                                className='add-btn'
                                src={addCart}
                                alt='7FRESH'
                                onClick={this.onAddCart.bind(this)}
                                lazyload
                              />
                              {val.marketPrice && (
                                <View className='old-price'>
                                  ¥{val.marketPrice}
                                </View>
                              )}
                            </View>
                          );
                        })}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
          {theme === 'week' && (
            <FreshWeekSwiper
              data={data.items}
              isSwiper={isSwiper}
              onAddCart={this.onAddCart.bind(this)}
              onGoDetail={this.onGoDetail.bind(this)}
            />
          )}
        </View>
      </View>
    );
  }
}
