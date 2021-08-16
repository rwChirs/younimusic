import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class FormalTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  render() {
    const { text, fontSize, fontWeight, padding } = this.props;
    return (
      <View
        class='formal-title'
        style={{
          fontSize: `${fontSize || 40}rpx`,
          fontWeight: fontWeight || 500,
          padding: padding,
        }}
      >
        <View className='color' />
        <View>{text}</View>
      </View>
    );
  }
}
