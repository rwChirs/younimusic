import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from '@tarojs/components';
import { theme } from '../../../common/theme';

import './index.scss';
// import RpxLine from '../../../components/rpx-line';

export default class ShoppingCart extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: {},
    num: 0,
    isCanAddCart: true,
    isCanPreSale: false,
  };

  gotoCart = e => {
    e.stopPropagation();
    this.props.onGotoCart();
  };

  addCart = e => {
    e.stopPropagation();
    if (this.props.data.status === 2 && this.props.isCanAddCart) {
      this.props.onAddCart();
    }
  };

  addOrder = e => {
    e.stopPropagation();
    this.props.onAddOrder();
  };

  render() {
    const { status, msg, text } = this.props.data;
    const { preparePrice, jdPrice, notJumpCart } = this.props;
    const preStatus = this.props.preSaleInfo && this.props.preSaleInfo.status;
    const type = this.props.preSaleInfo && this.props.preSaleInfo.type;
    const stockNum = this.props.preSaleInfo && this.props.preSaleInfo.stockNum;
    return (
      <View className='shopping-cart-container'>
        {status !== 2 && (
          <View className='alert'>
            <Text>{msg}</Text>
          </View>
        )}
        {/* <RpxLine /> */}
        <View className='shopping-cart'>
          {!notJumpCart && (
            <View className='cart' onClick={this.gotoCart}>
              {this.props.num > 0 && (
                <Text className='cart-num'>
                  {this.props.num > 99 ? '99+' : this.props.num}
                </Text>
              )}
            </View>
          )}

          <View
            className={`cart-action-box ${notJumpCart ? 'not-jump-cart' : ''}`}
          >
            {this.props.isCanPreSale && preStatus !== null && (
              <View
                className={`cart-action pre-sale ${
                  parseInt(stockNum) === 0 ? 'disable' : ''
                }`}
                onClick={this.addOrder}
              >
                <Text className='add-price'>
                  {preparePrice ? '￥' + preparePrice : '￥0.00'}
                </Text>
                <Text className='add-cart'>
                  {parseInt(stockNum) === 0 ? '已抢光' : '立即预订'}
                </Text>
              </View>
            )}
            {(this.props.isCanAddCart || !this.props.isCanPreSale) && (
              <View
                className={`cart-action ${
                  !this.props.isCanAddCart ? 'disable' : ''
                } ${
                  type && parseInt(type) === 1 && preStatus !== null
                    ? 'small'
                    : ''
                }`}
                onClick={this.addCart}
                style={{
                  background:
                    status !== 2 && this.props.isCanAddCart
                      ? 'rgba(255, 186, 8, 1)'
                      : !this.props.isCanAddCart
                      ? '#e5e5e5'
                      : theme.btnColor,
                }}
              >
                {type && parseInt(type) === 1 && preStatus !== null && (
                  <Text className='add-price'>
                    {jdPrice ? '￥' + jdPrice : '￥0.00'}
                  </Text>
                )}
                <Text
                  className='add-cart'
                  // style={{
                  //   lineHeight:
                  //     preparePrice && preStatus !== null ? '34rpx' : '88rpx',
                  // }}
                >
                  {!this.props.isCanAddCart
                    ? '今日售罄'
                    : notJumpCart
                    ? '立即购买'
                    : text
                    ? text
                    : '加入购物车'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
