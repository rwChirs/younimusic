import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View, Image } from "@tarojs/components";
import "./index.scss";

export default class FreshBottomLogo extends Component {
  render() {
    const { type } = this.props
    return type === 'solitaire' ? (
      <View className='bottom-main'>
        <Image
          className='bottom-picture'
          src='https://m.360buyimg.com/img/jfs/t1/116226/15/18420/15017/5f69d368E535133c4/faba651954f11ef9.png'
          mode='aspectFit'
          lazyLoad
        />
      </View>
    ) : (
      <View className='bottom-logo-component'>
        <View className='bottom-logo-img'>
          <Image
            mode='aspectFit'
            className='image'
            src='https://m.360buyimg.com/img/jfs/t1/145675/20/9185/5362/5f6c1226E6313dedf/289be20ac1ae4fe1.png'
            lazyLoad
          />
        </View>
      </View>
    )
  }
}
