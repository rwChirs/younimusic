import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { topPicture1, topPicture2, topPicture3 } from './images';
import './index.scss';

export default class FreshSeatAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text, type, img } = this.props;
    let borderColor, topIcon, backgroundColor, textColor;
    if (type === 0) {
      borderColor = 'rgb(241, 193, 124)';
      topIcon = topPicture1;
      backgroundColor = 'rgb(255, 198, 120)';
      textColor = 'rgb(186, 90, 59)';
    } else if (type === 1) {
      borderColor = 'rgb(200, 206, 213)';
      topIcon = topPicture2;
      backgroundColor = 'rgb(177, 187, 198)';
      textColor = 'rgb(99, 103, 111)';
    } else if (type === 2) {
      borderColor = 'rgb(164, 104, 72)';
      topIcon = topPicture3;
      backgroundColor = 'rgb(164, 104, 72)';
      textColor = 'rgb(86, 42, 28)';
    } else {
      borderColor = 'rgb(255, 255, 255)';
      topIcon = '';
      backgroundColor = 'rgb(232, 232, 232)';
      textColor = 'rgb(134, 134, 134)';
    }
    return (
      <View className='seatAvatar'>
        {topIcon ? (
          <View className='topIcon'>
            <Image
              className='img'
              src={topIcon}
              width={`${Taro.pxTransform(parseInt(32))}`}
              height={`${Taro.pxTransform(parseInt(26))}`}
              mode='aspectFit'
              lazyLoad
            />
          </View>
        ) : (
          ''
        )}
        <Image
          className='seatbgc'
          src={
            img ||
            'https://m.360buyimg.com/img/jfs/t1/11638/30/6396/3388/5c3dc4abEfdee8ef1/18f5b25f6d58ec74.png'
          }
          width={`${Taro.pxTransform(parseInt(72))}`}
          height={`${Taro.pxTransform(parseInt(72))}`}
          style={{
            borderColor,
          }}
          mode='aspectFit'
          lazyLoad
        />

        <View
          className='nameIcon'
          style={{
            backgroundColor,
            color: textColor,
          }}
        >
          <Text className='userName'>{text}</Text>
        </View>
      </View>
    );
  }
}
