import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { filterImg } from '../../../../../../utils/common/utils';
import './index.scss';

export default class RecommendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  handleGoProDetail = e => {
    e.stopPropagation();
    const { onGoToProDetail, data } = this.props;
    onGoToProDetail(data.skuId);
  };

  handleAddCart = e => {
    e.stopPropagation();
    const { onAddCart, data } = this.props;
    onAddCart(data);
  };

  findSimiler = (data, e) => {
    e.stopPropagation();
    const { onFindSimiler } = this.props;
    onFindSimiler(data);
  };

  render() {
    const { data, isLast, hasSimiler } = this.props;
    return (
      <View
        className='recommend-item'
        style={{
          marginRight: isLast ? '30rpx' : '20rpx',
        }}
        onClick={this.handleGoProDetail.bind(this)}
      >
        <View className='img-box'>
          {data.status !== 2 && <View className='img-shadow'>无货</View>}
          <Image
            className={data.status !== 2 ? 'img img-none' : 'img'}
            src={filterImg(data.imageUrl)}
          />
        </View>
        <View className='text'>
          <Text className='name'>{data.skuShortName || data.skuName}</Text>
          {data.jdPrice ? (
            <Text className='price'>{`¥ ${data.jdPrice}`}</Text>
          ) : (
            <Text className='no-price'>暂无报价</Text>
          )}
        </View>
        {(data.status === 2 || !hasSimiler) && (
          <View className='cart-box'>
            <View
              className={data.addCart ? 'cart' : 'cart disable'}
              onClick={this.handleAddCart.bind(this)}
            />
          </View>
        )}
        {data.status !== 2 && hasSimiler && (
          <View className='similer-box'>
            <View
              className='find-similer'
              onClick={this.findSimiler.bind(this, data)}
            >
              找相似
            </View>
          </View>
        )}
      </View>
    );
  }
}
