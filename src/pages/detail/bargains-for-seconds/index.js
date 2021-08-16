import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API
import { View, Text } from '@tarojs/components';

import './index.scss';

export default class BargainsForSeconds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: null,
    };
  }

  static defaultProps = {
    data: {},
  };

  onQuestion = () => {
    this.props.onPopup();
  };

  startCountDown = (seconds = 0) => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const _seconds = this.state.seconds ? this.state.seconds : seconds;
      if (_seconds === 0) {
        clearInterval(this.timer);
      } else {
        this.setState({
          seconds: _seconds - 1,
        });
      }
    }, 1000);
  };

  transformTime = (seconds, type) => {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds - hour * 3600) / 60);
    const second = Math.floor(seconds - hour * 3600 - minute * 60);
    if (type === 'hour') {
      return hour < 10 ? `0${hour}` : hour;
    } else if (type === 'minute') {
      return minute < 10 ? `0${minute}` : minute;
    } else {
      return second < 10 ? `0${second}` : second;
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { data } = this.props;
    const { seconds } = this.state;
    this.startCountDown(
      data.seckillInfo ? data.seckillInfo.restseckillTime / 1000 : 0
    );
    return (
      <View className='bargains-for-seconds'>
        <View className='left'>
          <View className='jd-price'>
            <Text className='yen'>￥</Text>
            <Text className='price'>{data.jdPrice}</Text>
            <Text className='unit'>{data.buyUnit}</Text>
            {data.marketPrice && (
              <Text className='market-price'>￥ {data.marketPrice}</Text>
            )}
            {data && data.toasts && (
              <View className='question' onClick={this.onQuestion} />
            )}
          </View>
          <View className='seckill-icon-box'>
            <View className='seckill-icon'>
              •<View className='icon'>秒杀</View>
            </View>
          </View>
        </View>
        <View className='right'>
          <Text className='title'>距离结束剩余</Text>
          <View className='count-down'>
            <View className='hour'>{this.transformTime(seconds, 'hour')}</View>
            <View className='split'>:</View>
            <View className='minute'>
              {this.transformTime(seconds, 'minute')}
            </View>
            <View className='split'>:</View>
            <View className='second'>
              {this.transformTime(seconds, 'second')}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
