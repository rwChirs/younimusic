// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';

export default class FloorCouponTip extends Component {
  static defaultProps = {
    onGoToUrl: '',
    data: {
      firstTitle: '',
      image: '',
      action: '',
    },
  };

  getArr = (firstTitle) => {
    let arr = [];
    if (firstTitle) {
      for (let i = 0; i < firstTitle.length; i++) {
        arr[i] = firstTitle[i];
      }
    }
    return arr;
  };

  render() {
    const { onGoToUrl } = this.props;
    const { firstTitle, action, image } = this.props.data;
    const reg = /[0-9]/;
    const textArr = this.getArr(firstTitle);

    return (
      <View
        className='Coupon-tip'
        style={{
          backgroundImage: `url(${image ? filterImg(image) : 'unset'})`,
        }}
      >
        <View
          className='Coupon-tip-container'
          onClick={onGoToUrl.bind(this, action)}
        >
          <View className='Coupon-tip-title-container'>
            <View className='Coupon-tip-title'>
              <View className='Coupon-tip-title-left'>
                <Text className='Coupon-tip-title-left-main'>
                  {textArr &&
                    textArr.length > 0 &&
                    textArr.map((val, i) => {
                      return (
                        <Text
                          className={`${reg.test(val) ? 'coupon-num' : ''}`}
                          key={i}
                        >
                          {val}
                        </Text>
                      );
                    })}
                </Text>
              </View>
              <View className='Coupon-tip-title-right'>
                <Text>查看</Text>
                <View className='more-icon'></View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
