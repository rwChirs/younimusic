import Taro from "@tarojs/taro";
import {Component} from 'react';
import {
  View,
  // Image, Text
} from '@tarojs/components';
import { exportPoint } from '../../../utils/common/exportPointLuck';
import './index.scss';

export default class RedInfo extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    redInfo: {},
  };

  render() {
    const { redInfo, userInfo } = this.props;
    return (
      <View>
        <View className='couponheader'>
          <View className='category'>{redInfo.couponName}</View>
          {/* <View className='channel'>{redInfo.channelTypeName}</View> */}
        </View>

        <View className='price'>
          <View className='priceIcon'>&yen;</View>
          <View className='amount'>{redInfo.amountDesc}</View>
          <View className='channelType'>
            <View className='channelTypeName'>{redInfo.channelTypeName}</View>
          </View>
        </View>

        <View className='couponbottom'>
          <View className='fullreduction'>{redInfo.ruleDescSimple}</View>
          <View className='couponbottom-line'></View>
          <View className='aging'>{redInfo.lastTimeDesc}</View>
        </View>

        <View className='user'>
          已放入账号：
          {userInfo.mobile
            ? userInfo.mobile
            : userInfo.nickname
            ? userInfo.nickname
            : ''}
        </View>
      </View>
    );
  }
}
