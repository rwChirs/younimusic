import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from "@tarojs/components";

import "./index.scss";

export default class PreBargains extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: {}
  };

  render() {
    const { data } = this.props;
    return (
      <View className="pre-bargains">
        <View className="icon">秒杀</View>
        <View className="desc">{`￥${data.miaoShaPrice}${data.buyUnit}，${
          data.seckillInfo ? data.seckillInfo.startTime : ""
        }`}</View>
      </View>
    );
  }
}
