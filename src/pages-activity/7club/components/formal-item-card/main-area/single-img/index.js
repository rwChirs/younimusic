import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg, images, px2vw } from '../../../../utils';

export default class SingleImg extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;
    let radio = data && data.radio ? data.radio : 1.33;
    return (
      <View className='pic-text'>
        <Image
          className='img'
          src={filterImg(
            (data && data.coverImg) ||
              (data && data.images && data.images[0]) ||
              images.default7clubImg
          )}
          style={{
            height:
              data && data.contentSubType === 1 ? px2vw(690 / radio) : '370rpx',
          }}
          mode='aspectFill'
        />
      </View>
    );
  }
}
