import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class RecommendDesc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, text } = this.props;
    return (
      <View className='recommend-desc'>
        <View className='head'>
          <View className='logo' />
          <View className='split-line' />
          <Text className='title'>{title}</Text>
        </View>
        <View className='contents'>{text}</View>
      </View>
    );
  }
}
