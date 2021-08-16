import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { detailLeftIcon } from './image';
import './index.css';

export default class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text, type } = this.props;
    return (
      <View className='recommendation'>
        {!type || type === 'default' ? (
          <View>
            <View className='icon' />
            <View className='text'>{text ? text : '暂无推荐语'}</View>
          </View>
        ) : (
          <View className='recommendation-easy'>
            <Image
              src={detailLeftIcon}
              className='rec-left-dot'
              mode='aspectFit'
              lazyLoad
            />
            <View className='rec-word'>{text}</View>
            <Image
              src={detailLeftIcon}
              className='rec-right-dot'
              mode='aspectFit'
              lazyLoad
            />
          </View>
        )}
      </View>
    );
  }
}
