import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';

import './index.scss';

export default class FreeBuyDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { freeItem } = this.props;
    return (
      <View className='free-buy-detail'>
        <View className='giftCard-content'>
          <View className='singal-service'>
            <View className='service-top'>
              <Image className='service-img' src={freeItem.smallImage} alt='' />
              <View className='service-name'>{freeItem.name}</View>
            </View>
            <View className='service-desc'>
              {freeItem.easyBuyDetailList[0].secondDesc}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
