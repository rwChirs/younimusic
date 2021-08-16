import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../utils';

export default class VideoTop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onGoBack = e => {
    e.stopPropagation();
  };
  onGoCart = e => {
    e.stopPropagation();
  };
  render() {
    return (
      <View className='video-top'>
        <View className='left' onClick={this.onGoBack}>
          <Image
            className='img'
            src={filterImg(
              'https://m.360buyimg.com/img/jfs/t1/38607/23/15711/574/5d666d6eE62c92a58/470439bccb744ca2.png!q70.dpg'
            )}
          />
        </View>
        <View className='right' onClick={this.onGoCart}>
          人人人
        </View>
      </View>
    );
  }
}
