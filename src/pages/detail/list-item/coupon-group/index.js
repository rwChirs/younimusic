import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View } from '@tarojs/components';

import './index.scss';

export default class CouponGroup extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: [],
  };

  onChange = id => {
    this.props.onChange(id);
  };

  render() {
    const { data } = { ...this.props };
    return (
      <View className='coupon-group'>
        {data.map((item, index) => (
          <View
            className={`coupon-total ${
              item.channelType === 1
                ? `all`
                : item.channelType === 2
                ? `online`
                : `offline`
            }`}
            key={index}
            onClick={this.onChange.bind(this, item.batchId)}
          >
            <View className='coupon-tag'>¥</View>
            {/* {item.couponLabelName} */}
            <View className='coupon'>{item.ruleDescSimple}</View>
          </View>
        ))}
      </View>
    );
  }
}
