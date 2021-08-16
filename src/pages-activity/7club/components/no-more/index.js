import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class NoMore extends Component {

  render() {
    const { height } = this.props;
    return (
      <View
        className='index'
        style={{ minHeight: height ? `${height}px` : '' }}
      >
        没有更多啦～
      </View>
    );
  }
}
