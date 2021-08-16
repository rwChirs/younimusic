/* eslint-disable react/react-in-jsx-scope */
import Taro, {getCurrentInstance} from "@tarojs/taro";
import {Component} from 'react';
import {
  View,
  // Image, Text
} from '@tarojs/components';
import { exportPoint } from '../../../utils/common/exportPointLuck';
import './index.scss';

export default class RedEnvelope extends Component {
  constructor(props) {
    super(props);
  }


  static defaultProps = {
    coupon: {},
  };

  render() {
    const { coupon } = this.props;
    return (
      <View className='red-envelope'>
        <View className='left'>
          <View className='top'>
            <View className='unit'>&yen;</View>
            <View className='price'>{coupon.amountDesc}</View>
          </View>
          <View className='bottom'>
            <View className='limit'>{coupon.ruleDescSimple}</View>
          </View>
        </View>
        <View className='right'>
          <View className='label'>{coupon.channelTypeName}</View>
          <View className='name'>{coupon.couponName}</View>
          <View className='use-time'>{coupon.validateTime}</View>
        </View>
      </View>
    );
  }
}
