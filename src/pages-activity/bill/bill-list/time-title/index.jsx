import { Component } from 'react';
import { View, Text } from '@tarojs/components';

import './index.scss';

export default class TimeTitle extends Component {
  static defaultProps = {
    data: {
      week: '星期三',
      monthDate: 'Dec 25',
      title: '三菜一汤',
      subTitle1: '宜轻食',
      subTitle2: '用最少的悔恨面对过去',
    },
  };
  render() {
    const { week, monthDate, title, subTitle1, subTitle2, todayMenu } =
      this.props;
    return (
      <View className='time-title'>
        <View className='time'>
          {!todayMenu && <View className='dot' />}
          {todayMenu && <View className='dot-active' />}
          <View className='week'>{todayMenu ? '今天' : week}</View>
          <View className='date'>{monthDate || ''}</View>
        </View>
        <View className='split-line' />
        <View className='txt'>
          <View className='title'>{title}</View>
          <View className='tips'>
            {!!subTitle1 && <Text>{subTitle1}</Text>}
            {!!subTitle1 && !!subTitle2 && <Text className='line'>|</Text>}
            {!!subTitle2 && <Text>{subTitle2}</Text>}
          </View>
        </View>
      </View>
    );
  }
}
