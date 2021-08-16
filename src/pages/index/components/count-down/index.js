// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class CountDown extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      _seconds: 10000,
    };
    this.timerId = null;
  }

  componentWillMount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.initData(this.props.seconds);
  }

  componentWillUnmount() {
    this.timerId && clearInterval(this.timerId);
  }

  initData(seconds) {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.setState(
      {
        _seconds: seconds,
      },
      () => {
        this.startCountDown();
      }
    );
  }
  startCountDown() {
    this.timerId = setInterval(() => {
      const _seconds = this.state._seconds;
      if (_seconds - 1 === 0) {
        clearInterval(this.timerId);
        this.props.onChange(_seconds - 1);
        this.props.onFinishedCount();
      } else {
        this.setState(
          {
            _seconds: _seconds - 1,
          },
          () => {
            this.props.onChange(_seconds - 1);
          }
        );
      }
    }, 1000);
  }

  transformTime(seconds) {
    const day = Math.floor(seconds / 3600 / 24);
    const hour = Math.floor((seconds - day * 24 * 3600) / 3600);
    const minute = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60);
    const second = Math.floor(
      seconds - day * 24 * 3600 - hour * 3600 - minute * 60
    );

    return {
      day: day < 10 ? `0${day}` : day,
      hour: hour < 10 ? `0${hour}` : hour,
      minute: minute < 10 ? `0${minute}` : minute,
      second: second < 10 ? `0${second}` : second,
    };
  }

  render() {
    const time = this.transformTime(this.state._seconds);
    const {
      background,
      color,
      fontSize,
      width,
      height,
      fontWeight,
      boxShadow,
      splitColor,
      type,
      splitSpace,
      radius,
      splitFontSize,
    } = this.props;
    const style = {
      background,
      color,
      fontWeight,
      boxShadow,
      fontSize: fontSize + 'rpx',
      width: width + 'rpx',
      height: height + 'rpx',
      lineHeight: height + 'rpx',
      borderRadius: radius + 'rpx',
    };
    const splitStyle = {
      color: splitColor,
      fontSize: splitFontSize ? splitFontSize + 'rpx' : height + 'rpx',
      marginLeft: splitSpace + 'rpx',
      marginRight: splitSpace + 'rpx',
    };
    const defaultStyle = {
      color,
      fontSize: fontSize + 'rpx',
    };
    return (
      <View style={{ display: type === 'default' ? 'inline-block' : 'block' }}>
        {type === 'default' ? (
          <View style={defaultStyle}>
            {time.day > 0 && <Text>{time.day}</Text>}
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
              <View className='split' style={splitStyle}>
                :
              </View>
            )}
            <View className=' value' style={style}>
              {time.hour}
            </View>
            <View className='split' style={splitStyle}>
              :
            </View>
            <View className=' value' style={style}>
              {time.minute}
            </View>
            <View className='split' style={splitStyle}>
              :
            </View>
            <View className=' value' style={style}>
              {time.second}
            </View>
          </View>
        )}
      </View>
    );
  }
}
