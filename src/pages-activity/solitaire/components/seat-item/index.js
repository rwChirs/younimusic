import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class FreshSeatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name, time, piece, info, type, width } = this.props;
    return (
      <View
        className='seatItem'
        style={{
          width,
        }}
      >
        {name && <View className='name'>{name}</View>}
        {time && <View className='time'>{time}</View>}
        <View
          className='info'
          style={{
            width,
            backgroundColor:
              type === 'default'
                ? 'rgb(243, 244, 247)'
                : 'rgba(254, 227, 188, 0.5)',
            marginTop: name || time ? `${Taro.pxTransform(parseInt(10))}` : 0,
          }}
        >
          {piece > 0 && <View className='piece'>跟{piece}件</View>}
          <View
            className='text'
            style={{
              color:
                type === 'default' ? 'rgb(37, 37, 37)' : 'rgb(186, 77, 44)',
              marginLeft: piece > 0 ? `${Taro.pxTransform(parseInt(30))}` : 0,
            }}
          >
            <Text className='textText'>“ {info} ”</Text>
          </View>
        </View>
      </View>
    );
  }
}
