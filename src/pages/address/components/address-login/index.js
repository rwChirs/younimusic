// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.css';

export default class AddressLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    this.props.onClick();
  };

  render() {
    return (
      <View className='yellow-tip'>
        <Text className='tip'>登录后使用常用收货地址</Text>
        <View className='desc' onClick={this.onClick.bind(this)}>
          登录
        </View>
      </View>
    );
  }
}
