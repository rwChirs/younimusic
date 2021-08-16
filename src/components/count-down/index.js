import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _seconds: this.props.seconds,
    };
  }

  componentDidMount() {
    this.setState(
      {
        _seconds: this.props.seconds,
      },
      () => {
        this.startCountDown();
      }
    );
  }

  startCountDown() {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      const _seconds = this.state._seconds;
      if (_seconds === 0) {
        clearInterval(this.timerId);
        this.props.onTimeEnd();
      } else {
        this.setState({
          _seconds: _seconds - 1,
        });
      }
    }, 1000);
  }

  transformTime(seconds) {
    if (seconds > 0) {
      const day = Math.floor(seconds / 3600 / 24);
      const hour = Math.floor((seconds - day * 24 * 3600) / 3600);
      const minute = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60);
      const second = Math.floor(
        seconds - day * 24 * 3600 - hour * 3600 - minute * 60
      );
      return {
        day: day < 10 ? `${day}` : day,
        hour: hour < 10 ? `0${hour}` : hour,
        minute: minute < 10 ? `0${minute}` : minute,
        second: second < 10 ? `0${second}` : second,
      };
    }
    return '';
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const time = this.transformTime(this.state._seconds);
    const {
      background = '#fff',
      color = '#000',
      fontSize = '',
      width = 50,
      height = 50,
      splitColor = '#ddd',
      type = '',
      splitSpace = '',
      borderRadius = '',
      left = false,
      marginLeft = 0,
      boxShadow = '',
    } = this.props;
    const style = {
      background: background,
      color: color,
      fontSize: fontSize,
      width: width,
      height: height,
      lineHeight: height,
      borderRadius: borderRadius,
      boxShadow: boxShadow,
    };
    const splitStyle = {
      color: splitColor,
      fontSize: fontSize,
      marginLeft: splitSpace,
      marginRight: splitSpace,
      boxShadow: boxShadow,
    };
    const defaultStyle = {
      color,
      fontSize: fontSize,
    };

    return (
      <View
        className='count-down-main'
        style={{
          display: type === 'default' ? 'inline-block' : 'block',
          marginLeft: marginLeft ? marginLeft : '16rpx',
        }}
      >
        {type === 'default' ? (
          <View style={defaultStyle} className='default-style'>
            {time.day > 0 && <Text>{time.day}天</Text>}
            {time.hour}:{time.minute}:{time.second}
          </View>
        ) : (
          <View className='count-down'>
            {time.day > 0 && (
              <View className='value' style={style}>
                {time.day}
              </View>
            )}
            {time.day > 0 && (
              <View className='unit' style={splitStyle}>
                天
              </View>
            )}
            {left && time.day <= 0 && <View className='left'/>}
            <View className='value' style={style}>
              {time.hour}
            </View>
            <View className='split' style={splitStyle}>
              :
            </View>
            <View className='value' style={style}>
              {time.minute}
            </View>
            <View className='split' style={splitStyle}>
              :
            </View>
            <View className='value' style={style}>
              {time.second}
            </View>
          </View>
        )}
      </View>
    );
  }
}
