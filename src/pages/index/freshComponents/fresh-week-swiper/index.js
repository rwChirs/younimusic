// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FreshWeekSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      flag: true,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    // if (this.timerId) {
    //   clearInterval(this.timerId)
    // }
  }

  onGoDetail(info) {
    this.props.onGoDetail(info) && this.props.onGoDetail(...arguments, info);
  }

  onAddCart(ev, info) {
    this.props.onAddCart(ev, info) &&
      this.props.onAddCart(...arguments, ev, info);
  }

  init() {
    const { data } = this.props;
    const length = data && data.length;
    const arr = [];
    let count = 0;
    for (let a = 1; a < length; a++) {
      arr.push(a);
    }
    // clearInterval(this.timerId)
    const timerId = setInterval(() => {
      const key = arr[Math.floor(Math.random() * arr.length)];
      this.setState(
        {
          index: key,
        },
        () => {
          count += 1;
          for (let m = 0; m < arr.length; m++) {
            if (arr[m] === key) {
              arr.splice(m, 1);
            }
          }
          if (count > length - 1) {
            this.setState({
              flag: false,
            });
            clearInterval(timerId);
          }
        }
      );
    }, 3000);
  }

  render() {
    const { data, isSwiper } = this.props;
    const { index, flag } = this.state;
    return (
      <View className='floor-week-list'>
        <View className='floor-week-goods'>
          {data.map((val, key) => {
            let advertisement = [];
            if (isSwiper) {
              advertisement = [val.advertisement, val.advertisement];
            } else {
              advertisement = val.advertisement;
            }
            return (
              <View className='fresh-goods' key={`floor-week-${key}`}>
                {val.discountInfo && (
                  <View className='fresh-discount'>{val.discountInfo}</View>
                )}
                <Image
                  className='fresh-image'
                  alt={val.skuName}
                  src={filterImg(val.imageUrl)}
                  onClick={this.onGoDetail.bind(this, val)}
                />
                <View className='fresh-swiper'>
                  {advertisement &&
                    advertisement.length > 0 &&
                    flag &&
                    isSwiper && (
                      <Swiper
                        style={{
                          width: '320rpx',
                          height: '60rpx',
                        }}
                        vertical
                        duration={2000}
                        interval={3000}
                        circular
                        autoplay
                      >
                        {advertisement.map((item, idx) => (
                          <SwiperItem key={idx} className='fresh-info'>
                            <View className='fresh-info'>
                              {index === key ? item : ''}
                            </View>
                          </SwiperItem>
                        ))}
                      </Swiper>
                    )}
                  {!isSwiper && flag && (
                    <View className='fresh-info'>
                      {index === key ? advertisement : ''}
                    </View>
                  )}
                </View>

                <View className='fresh-bottom'>
                  <View className='fresh-jd-price'>
                    <Text className='fresh-jd-num'>
                      ¥{val.jdPrice ? val.jdPrice : '0.00'}
                    </Text>
                    {!val.prepayCardType && (
                      <Image
                        src='https://m.360buyimg.com/img/jfs/t1/117343/29/17688/2389/5f608000E46128747/5ef88878a709fffa.png'
                        className='fresh-add-btn'
                        mode='aspectFit'
                        onClick={this.onAddCart.bind(this, val)}
                      />
                    )}
                  </View>

                  {val.marketPrice && (
                    <View className='fresh-old-price'>¥{val.marketPrice}</View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
