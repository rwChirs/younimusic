import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class FreshSolitaireMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { commissionText, commission } = this.props;
    return (
      commission &&
      commission !== '￥0' &&
      commission !== '0.0' && (
        <View className='solitaire-make-money'>
          <View className='text'>{commissionText}</View>
          <View className='num'>{commission}</View>
        </View>
      )
    );
  }
}
