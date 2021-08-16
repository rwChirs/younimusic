import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View } from "@tarojs/components";
import "./index.scss";

export default class FreshWarmPrompt extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tipStyle, message } = this.props

    return (
      <View className='prompt-component' style={tipStyle}>
        <View className='prompt-message'>{message}</View>
      </View>
    )
  }
}
