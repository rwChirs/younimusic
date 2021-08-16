import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class PriceDesc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {};
  render() {
    const { data } = this.props;
    return (
      <View className='price-desc'>
        <View className='title'>价格说明</View>
        <View className='content'>
          {data.map((item, k) => {
            return (
              <View className='item' key={k}>
                <Text className='item-line' />
                <Text className='item-title'>{`${item.title}：`}</Text>
                <Text className='item-desc'>{item.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
