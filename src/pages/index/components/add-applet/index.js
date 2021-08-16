// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class AddApplet extends Component {
  static defaultProps = {};

  handelCloseApplet = () => {};

  render() {
    const {
      isShowAddApplet,
      onAddApplet,
      onCancelAddApplet,
      onCancelApplet,
      top,
    } = this.props;
    return (
      <View className='applet'>
        <View className='applet-content'>
          <View className='applet-text'>
            {/* <Text>点击右上角</Text>
            <View className='image' />
            <Text>添加至我的小程序</Text> */}
            <Text>添加到我的小程序，下次购物更便捷</Text>
            <View className='add-btn' onClick={onAddApplet}>
              添加
            </View>
            <View className='close' onClick={onCancelApplet} />
          </View>
        </View>
        {isShowAddApplet && (
          <View
            className='guide'
            onClick={onCancelAddApplet}
            style={{
              top: top,
            }}
          >
            <View className='guide-img' />
          </View>
        )}
      </View>
    );
  }
}
