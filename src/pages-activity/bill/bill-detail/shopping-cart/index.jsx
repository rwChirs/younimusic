import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../../../common/theme';

import './index.scss';
import RpxLine from '../../../../components/rpx-line';

export default class ShoppingCart extends Component {
  static defaultProps = {
    data: {},
    num: 0,
    isCanAddCart: true,
    isCanPreSale: false,
  };

  constructor(props) {
    super(props);
  }

  gotoCart = (e) => {
    e.stopPropagation();
    this.props.onGotoCart();
  };

  addOrder = (e) => {
    e.stopPropagation();
    this.props.onAddOrder();
  };

  onclickBill = (e) => {
    e.stopPropagation();
    const { clickType } = this.props;
    if (clickType === 1) {
      this.props.onPopup();
    } else {
      this.props.onAllAddCart();
    }
  };

  render() {
    const { status, msg, text } = this.props.data;
    const { preparePrice, clickType, isUseable } = this.props;
    const preStatus = this.props.preSaleInfo && this.props.preSaleInfo.status;
    // const stockNum = this.props.preSaleInfo && this.props.preSaleInfo.stockNum;
    return (
      <View className='shopping-cart-container'>
        {status !== 2 && (
          <View className='alert'>
            <Text>{msg}</Text>
          </View>
        )}
        <RpxLine />
        <View className='shopping-cart'>
          <View className='cart' onClick={this.gotoCart}>
            {this.props.num > 0 && (
              <Text className='cart-num'>
                {this.props.num > 99 ? '99+' : this.props.num}
              </Text>
            )}
          </View>
          {!isUseable && (
            <View
              className='cart-action cart-action-box'
              style={{
                background: 'rgba(229, 229, 229, 1)',
              }}
            >
              <Text
                className='add-cart'
                style={{
                  lineHeight:
                    preparePrice && preStatus !== null ? '34rpx' : '88rpx',
                }}
              >
                购买食材
              </Text>
            </View>
          )}
          {isUseable && (
            <View
              className='cart-action cart-action-box'
              onClick={this.onclickBill}
              style={{
                background: theme.btnColor,
              }}
            >
              <Text
                className='add-cart'
                style={{
                  lineHeight:
                    preparePrice && preStatus !== null ? '34rpx' : '88rpx',
                }}
              >
                {text ? text : clickType === 1 ? '购买食材' : '一键加购'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
