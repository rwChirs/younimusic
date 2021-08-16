import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';

import './index.scss';

export default class Coupon extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.onReceiveCoupon();
  };

  render() {
    return (
      <View className={`coupon ${this.props.type}`}>
        <View className='limit'>
          <Text>{this.props.limit}</Text>
        </View>
        <View>
          {this.props.price && (
            <View className='price'>
              <Text className='unit'>￥</Text>
              {this.props.price}
            </View>
          )}
          <View className='rule-desc-simple'>{this.props.ruleDescSimple}</View>
        </View>
        <View className='content'>
          <View className='name'>{this.props.name}</View>
          <View className='expiration'>{this.props.validate}</View>
        </View>
        <View
          className={this.props.isReceived ? `apply disabled` : `apply`}
          onClick={this.onClick}
        >
          {this.props.isReceived ? '去使用' : '领取'}
        </View>
      </View>
    );
  }
}
