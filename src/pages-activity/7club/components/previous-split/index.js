import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class PreviousSplit extends Component {
  render() {
    return (
      <View className='index'>
        <Text className='line left' />
        <Text class='text'>往期回顾</Text>
        <Text className='line right' />
      </View>
    );
  }
}
