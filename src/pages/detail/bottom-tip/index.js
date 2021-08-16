import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View } from '@tarojs/components';
import './index.scss';

export default class BottomTip extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {};

  render() {
    const { text } = this.props;
    return <View className='bottom-tip'>{text}</View>;
  }
}
