import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Tag from '../goods-tag';
import { getComponentExposure } from '../../utils/common/exportPoint';
import './index.scss';

export default class GoodsItemX extends Component {
  constructor(props) {
    super(props);
  }

  addtoCart = e => {
    e.stopPropagation();
    this.props.onAddtoCart();
  };
  gotoInfo = e => {
    e.stopPropagation();
    this.props.onGotoInfo();
  };

  componentDidMount() {
    console.log('为你推荐');
    const { data, currentSkuId } = this.props;
    getComponentExposure({
      obj: this,
      eid: 'Product_details_0008',
      id: `goods-item-x`,
      product: data,
      eparam: {
        recommendSkuId: data && data.skuId,
        commodityState: data && data.status,
        currentSkuId: currentSkuId, // 商详主商品id
        pos: data && data.index, // 推荐商品下标
      },
    });
  }

  render() {
    const { data, isFromPage } = this.props;
    const {
      skuName,
      skuId,
      jdPrice,
      buyUnit,
      promotionTypes = [],
      imageUrl,
      storeProp,
    } = data;
    return (
      <View
        className='goods-item-x'
        onClick={this.gotoInfo}
        id={`goods-item-x-${skuId}`}
      >
        <View className='img-wrap'>
          <Image src={imageUrl} className='img' />
          {!storeProp && isFromPage === 'recommend' && (
            <View
              className='product-warm-tag'
              style={{
                background: `url(${storeProp}) no-repeat`,
                backgroundSize: '100% 100%',
              }}
            />
          )}
        </View>
        <View className='title-wrap'>
          <Text className='title'>{skuName}</Text>
        </View>
        <View className='price-wrap'>
          <View className='txt'>
            <Text className='price'>¥{jdPrice}</Text>
            <Text className='unit'>{buyUnit}</Text>
          </View>
          <View className='btn' onClick={this.addtoCart} />
        </View>
        <View className='tags-wrap'>
          {promotionTypes.map((tag, index) => {
            return (
              <Tag
                key={index}
                text={
                  tag.promotionName
                    ? tag.promotionName
                    : tag.promotionInfoText[0]
                }
                type='primary'
              />
            );
          })}
        </View>
      </View>
    );
  }
}
