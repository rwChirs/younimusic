import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import TagList from './tag-list';
import './index.scss';

const SaleUnit = '¥';

// const handleType = type => {
//   return 'type-three';
// };

class ProductItem extends Component {
  static defaultProps = {
    itemStyle: {},
    data: {
      status: -1,
    },
  };
  goDetail = ev => {
    const { data, onGoDetail } = this.props;
    ev.stopPropagation();
    onGoDetail(data.skuId);
  };
  addCart = ev => {
    const { data, onAddCart } = this.props;
    if (!data.addCart) return;
    ev.stopPropagation();
    onAddCart(data);
  };
  render() {
    const { data, isFromPage } = this.props;
    return (
      <View
        className='product-item product-item-type-three}'
        onClick={this.goDetail}
      >
        <View
          className='product-item-figture'
          style={{
            opacity: data.status == 5 || data.status == 1 ? 0.6 : 1,
          }}
        >
          {(data.status == 5 || data.status == 1) && (
            <View className='product-status-icon'>
              {data.status == 5 ? '今日售罄' : '已下架'}
            </View>
          )}
          {!data.storeProp && isFromPage === 'recommend' && (
            <View
              className='product-warm-tag'
              style={{
                background: `url(${data.storeProp}) no-repeat`,
                backgroundSize: '100% 100%',
              }}
            />
          )}
          <Image
            className='product-item-image'
            src={filterImg(data.imageUrl)}
            lazyLoad
          />
          <View className='tag-list-wrap'>
            <TagList data={data.promotionTypes} />
          </View>
        </View>
        <View className='product-item-desc'>
          <View className='product-item-title'>{data.skuName}</View>
          <View className='price-wrap'>
            <Text className='price'>
              {SaleUnit}
              {data.jdPrice}
            </Text>
            <Text className='unit'>{data.buyUnit}</Text>
          </View>
          <View className='product-item-btn' onClick={this.addCart}>
            <View
              className={`product-item-btn-bg ${
                data.addCart ? '' : 'disabled'
              }`}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default ProductItem;
