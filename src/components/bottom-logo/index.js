import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class FreshBottomLogo extends Component {
  render() {
    return(
      <View className='bottom-logo-component'>
        <View className='bottom-logo-img'>
          <Image
            mode='aspectFit'
            className='image'
            src='https://m.360buyimg.com/img/jfs/t1/145675/20/9185/5362/5f6c1226E6313dedf/289be20ac1ae4fe1.png'
            lazyLoad
          />
        </View>
      </View>
    )
  }
}
