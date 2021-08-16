import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API


import { View, Text } from '@tarojs/components';

import './index.scss';

export default class PriceDesc extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {};

  onClick = () => {
    Taro.navigateTo({
      url: '/pages/price-desc/index',
    });
  };

  render() {
    return (
      <View className='price-desc'>
        <View className='title'>价格说明</View>
        <View className='fresh-price price'>
          <View className='icon' />
          <Text className='title'>七鲜销售价：</Text>
          <Text>
            七鲜销售价为商品的销售价，是您最终决定是否购买商品的依据。
          </Text>
        </View>
        <View className='fresh-price price'>
          <View className='icon' />
          <Text className='title'>七鲜价：</Text>
          <Text>
            对于商品页面上已标明为“七鲜价”的商品执行该价格，且对标有“七鲜价”商品实行买贵包赔政策，具体可查阅《七鲜关于七鲜价商品“买贵包赔”政策》。
          </Text>
        </View>
        <View className='underline-price price'>
          <View className='icon' />
          <Text className='title'>划线价：</Text>
          <Text>
            商品展示的划横线价格为参考价，并非原价，该价格可能是品牌专柜标价、商品吊牌价或由品牌供应商提供的正品零售价（如厂商指导价、建议零售价等）或该商品在七鲜APP上、实体门店曾经展示过的销售价；由于地区、时间的差异性和市场行情波动，品牌专柜标价、商品吊牌价等可能会与您购物时展示的不一致，该价格仅供您参考。
          </Text>
        </View>
        <View className='btn' onClick={this.onClick}>
          查看全部
        </View>
      </View>
    );
  }
}
