import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from '@tarojs/components';

import './index.scss';

export default class JoinString extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    string: '',
    joiner: '/',
  };

  render() {
    const strArr = this.props.string
      .split('')
      .join(this.props.joiner)
      .split('');
    const renderTitleList = strArr.map((item, index) => {
      let className = index % 2 ? 'dash' : 'txt';
      return (
        <Text key={index} className={className}>
          {item}
        </Text>
      );
    });
    return <View className='title-wrap'>{renderTitleList}</View>;
  }
}
