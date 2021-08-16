import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
// import { FreshWarmPrompt, FreshSpecification } from '@7fresh/new-ui';
import './index.scss';

export default class FreshSolitaireDetailPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      productTitle,
      list,
      currentPrice,
      basePrice,
      unit,
      isShowPrice,
      warmPrompt,
    } = this.props;
    return (
      <View className='detail-picture-page'>
        <View className='detail-product-title'>{productTitle || ''}</View>
        {/* <FreshSpecification list={list} /> */}
        {isShowPrice && (
          <View className='detail-product-bottom'>
            <Text className='product-i'>¥</Text>
            <Text className='product-current-price'>{currentPrice || 0.0}</Text>
            {unit && <Text className='product-unit'>{unit}</Text>}
            <Text className='product-base-price'>¥{basePrice || 0.0}</Text>
          </View>
        )}
        {/* {warmPrompt && (
          <FreshWarmPrompt message={warmPrompt} tipStyle='padding:16px 0 4px' />
        )} */}
      </View>
    );
  }
}
