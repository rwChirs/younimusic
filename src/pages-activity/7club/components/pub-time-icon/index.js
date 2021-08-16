import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class PubTimeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  render() {
    const { text } = this.props;
    return (
      <View className='pubtime-icon'>
        <Text>{text}</Text>
      </View>
    );
  }
}
