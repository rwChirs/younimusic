import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from '@tarojs/components';
import Tag from '../../../../components/goods-tag';

import './index.scss';

export default class PromotionGroup extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: [],
  };

  render() {
    const { data } = this.props;
    return (
      <View className='promotion-group'>
        {data.map((item, index) => (
          <View className='promotion' key={index}>
            <View className='tag'>
              <Tag text={item.promotionName} type='red' />
            </View>
            <Text className='name'>{item.showTexts[0].showMsg}</Text>
          </View>
        ))}
      </View>
    );
  }
}
