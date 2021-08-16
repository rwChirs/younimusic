/* eslint-disable react/react-in-jsx-scope */
import Taro from "@tarojs/taro";
import {Component} from 'react';
import { View, Image, Text } from '@tarojs/components';
import { exportPoint } from '../../../utils/common/exportPointLuck';
import './index.scss';

export default class RedItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    redEnvelope: {},
  };

  render() {
    const { redEnvelope } = this.props;
    return (
      <View className='red-item'>
        <View className='left'>
          <Image
            className='avatar'
            src={
              redEnvelope.avatarUrl
                ? redEnvelope.avatarUrl.indexOf('http') > -1
                  ? redEnvelope.avatarUrl
                  : `http:${redEnvelope.avatarUrl}`
                : 'https://m.360buyimg.com/img/jfs/t1/24453/26/991/2942/5c0e42a9E7ea3ea56/fe69d8676d8af8ba.png'
            }
          />
        </View>
        <View className='center'>
          <View className='top'>
            <View className='name'>
              {redEnvelope.nickName
                ? redEnvelope.nickName
                : redEnvelope.userPin}
            </View>
            <Text className='date'>{redEnvelope.sendTime}</Text>
          </View>
          <View className='bottom'>
            <View className='copywriting'>{redEnvelope.luckText}</View>
          </View>
        </View>
        <View className='right'>
          <View className='price'>
            <Text className='unit'>&yen;</Text>
            {redEnvelope.amount}
          </View>
          {redEnvelope.bestType === 1 && (
            <View className='label'>最佳手气</View>
          )}
        </View>
      </View>
    );
  }
}
