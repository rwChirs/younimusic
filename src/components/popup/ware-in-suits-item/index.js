import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../utils/common/utils';
import './index.scss';

export default class WareInSuitsItem extends Component {
  constructor(props) {
    super(props);
  }

  addCart = e => {
    e.stopPropagation();
    if (this.props.product.addCart) {
      this.props.onAddCart();
    }
  };

  onClick = e => {
    e.stopPropagation();
    this.props.onProductClick();
  };

  render() {
    const { product } = this.props;
    return (
      <View className='product-item' onClick={this.onClick}>
        <View className='image-container'>
          {product &&
            product.poolList &&
            product.poolList.map((item, index) => (
              <Image
                className='image'
                key={index}
                src={filterImg(item.imageUrl)}
              />
            ))}
        </View>
        <View className='content'>
          <View className='name'>{product.name}</View>
          <View className='price'>
            <View className='left'>
              <Text className='jd-price'>{`￥${product.jdPrice}`}</Text>
              <Text className='unit'>{product.buyUnit}</Text>
              {product.baseSuitDiscount > 0 && (
                <Text className='save'>{`省${product.baseSuitDiscount}元`}</Text>
              )}
            </View>
            <View
              className={product.addCart ? `add-cart` : `add-cart disabled`}
              onClick={this.addCart}
            />
          </View>
        </View>
      </View>
    );
  }
}
