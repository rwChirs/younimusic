import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { px2vw, filterDescription } from '../../utils/common/utils';
import { getComponentExposure } from '../../utils/common/exportPoint';
import './index.scss';

export default class BackProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };
  componentDidMount() {
    console.log('为你推荐');
    getComponentExposure({
      obj: this,
      eid: 'Payment_completion_0001',
      id: `payment-item-x`,
      product: this.props.data,
    });
  }

  render() {
    const { productDescription, alreadyCount, type, data = {} } = this.props;
    const { imageUrl, skuName, skuId, jdPrice, marketPrice, buyUnit } = data;
    const litterDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/18972/30/4602/568/5c3455d8Eb7e87e8d/30db16c8c5087841.png';
    return (
      <View
        className='back-product'
        style={{ width: type === 'litter' ? px2vw(654) : px2vw(690) }}
        id={`payment-item-x-${skuId}`}
        onClick={this.onClick}
      >
        <View className='back-product-picture'>
          <Image
            className='back-product-img'
            src={imageUrl ? imageUrl : litterDefaultPicture}
            mode='aspectFit'
            lazyLoad
          />
        </View>
        <View
          className='back-product-right'
          style={{ width: type === 'litter' ? px2vw(434) : px2vw(450) }}
        >
          <View className='back-product-title'>
            {skuName ? skuName : '商品标题'}
          </View>
          <View className='back-product-description'>
            <Text className='back-product-dot-l'>“</Text>
            {filterDescription(
              productDescription
                ? productDescription
                : '这个人有点懒，没有给商品添加描述',
              21
            )}
            <Text className='back-product-dot-r'>”</Text>
          </View>
          <View
            className='back-product-bottom'
            style={{ width: type === 'litter' ? px2vw(434) : px2vw(450) }}
          >
            <View className='back-product-price'>
              <Text className='product-i'>¥</Text>
              <Text className='product-current-price'>
                {jdPrice ? jdPrice : 0.0}
              </Text>
              {buyUnit && <Text className='product-unit'>{buyUnit}</Text>}
              <Text className='product-base-price'>
                ¥{marketPrice ? marketPrice : 0.0}
              </Text>
            </View>
            <View className='product-count'>{alreadyCount}</View>
          </View>
        </View>
      </View>
    );
  }
}
