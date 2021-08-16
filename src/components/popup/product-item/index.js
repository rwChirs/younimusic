import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { filterImg } from '../../../utils/common/utils';

import './index.scss';

export default class ProductItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { product } = this.props;
    return (
      <View className='product-item'>
        <View className='image-container'>
          <Image
            className='image'
            src={
              product.imageUrl
                ? filterImg(product.imageUrl)
                : product &&
                  product.imageInfoList &&
                  product.imageInfoList.length > 0 &&
                  product.imageInfoList[0].imageUrl
            }
          />
        </View>
        <View className='content'>
          <View className='name'>{product.skuName}</View>
          {product.saleSpecDesc ? (
            <View className='specs'>
              <View className='desc'>{`规格：${product.saleSpecDesc}`}</View>
              <Text className='num'>{`x${product.buyNum}`}</Text>
            </View>
          ) : (
            <Text className='saleStyle'>{`x${product.buyNum}`}</Text>
          )}
        </View>
      </View>
    );
  }
}
