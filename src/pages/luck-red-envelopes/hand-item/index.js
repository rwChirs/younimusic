import Taro from "@tarojs/taro";
import {Component} from 'react';
import {
  View,
  Image,
  // Text
} from '@tarojs/components';

import './index.scss';

export default class HandItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    redEnvelope: {},
  };

  render() {
    const { redEnvelope } = this.props;
    return (
      <View className='handItem'>
        <View className='handItem-avatar'>
          <Image
            className='handItemImg'
            src={
              redEnvelope.avatarUrl
                ? redEnvelope.avatarUrl.indexOf('http') > -1
                  ? redEnvelope.avatarUrl
                  : `http:${redEnvelope.avatarUrl}`
                : 'https://m.360buyimg.com/img/jfs/t1/24453/26/991/2942/5c0e42a9E7ea3ea56/fe69d8676d8af8ba.png'
            }
          />
        </View>
        <View className='handmiddle'>
          <View className='handmiddle-top'>
            {redEnvelope.nickName ? redEnvelope.nickName : redEnvelope.userPin}
            {/* <View className='name'>
              {redEnvelope.nickName
                ? redEnvelope.nickName
                : redEnvelope.userPin}
            </View> */}
            {/* <View className='time'>{redEnvelope.sendTime}</View> */}
          </View>
          <View className='handmiddle-bottom'>
            {redEnvelope.sendTime}
            {/* {redEnvelope.luckText} */}
          </View>
        </View>
        <View className='hand-price'>
          <View className='hand-price-item'>
            <View className='hand-price-item-sol'>&yen;</View>
            <View className='hand-price-item-amount'>{redEnvelope.amount}</View>
          </View>
          {redEnvelope.bestType === 1 && (
            <View className='hand-price-great'>手气最佳</View>
          )}
        </View>
      </View>
    );
  }
}
