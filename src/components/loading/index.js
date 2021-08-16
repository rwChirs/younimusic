import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.css';

export default class Loading extends Component {
  render() {
    return (
      <View className='loading-common-component'>
        <View className='circle-loading' />
      </View>
    );
  }
}
