// import Taro, { Component } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class SkeletionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [1, 2, 3, 4, 5],
    };
  }

  render() {
    return (
      // 骨架
      <View className='skeletion'>
        <View className='bgMasker swiper'></View>
        <View className='bgMasker announcement'></View>
        <View className='tabs'>
          {this.state.tabs.map((index) => {
            return (
              <View className='tabLoad icon' key={index.toString()}></View>
            );
          })}
        </View>
        <View className='tabs'>
          {this.state.tabs.map((index) => {
            return (
              <View className='tabLoad icon' key={index.toString()}></View>
            );
          })}
        </View>
        <View className='bgMasker announcement'></View>
        <View className='bgMasker activityModel'></View>
        <View className='bgMasker announcement'></View>
        <View className='bgMasker activityModel'></View>
      </View>
    );
  }
}
