import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

// pxTransform px2vw FreshComponent

export default class FreshPromoteItemForHere extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeRenderType = () => {
    const { promoteListInfo, showCouponLabels } = this.props;
    let type = 2;
    const promoteListInfoLength =
      promoteListInfo && promoteListInfo.length ? promoteListInfo.length : 0;
    const showCouponLabelsLength =
      showCouponLabels && showCouponLabels.length ? showCouponLabels.length : 0;
    // 仅有一个促销标
    if (promoteListInfoLength === 1 && showCouponLabelsLength === 0) {
      type = 1;
    }
    // 多个促销或优惠券
    if (promoteListInfoLength + showCouponLabelsLength > 1) {
      type = 2;
    }
    return type;
  };

  onCanPromoteCoupon = e => {
    e && e.stopPropagation();
    const { onCanPromoteCoupon } = this.props;
    onCanPromoteCoupon();
  };

  render() {
    const { promoteListInfo, showCouponLabels } = this.props;
    return (
      <View className='promote-content' onClick={this.onCanPromoteCoupon}>
        <View className='get-promote'>
          <View className='get-promote-title'>优惠</View>
          <View
            className='promote-list'
            style={{
              display: this.changeRenderType() === 1 ? 'flex' : 'inline-block',
            }}
          >
            {this.changeRenderType() === 1 &&
              promoteListInfo
                .filter(item => item.promotionName)
                .map((res, key) => {
                  return (
                    <View className='promote-item' key={key.toString()}>
                      <View className='promote-title-icon'>
                        {res.promotionName}
                      </View>
                      <View className='promote-desc'>
                        {res.showTexts &&
                          res.showTexts.length !== 0 &&
                          res.showTexts.map((item, index) => {
                            return (
                              <View key={index.toString()}>
                                {`${
                                  res.limitBuyText ? `${res.limitBuyText},` : ``
                                }`}
                                {item.showMsg}
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
            {this.changeRenderType() === 2 && (
              <View>
                {promoteListInfo
                  .filter(item => item.promotionName)
                  .map((res, key) => {
                    return (
                      <View className='promote-title-icon' key={key.toString()}>
                        {res.promotionName}
                      </View>
                    );
                  })}
                {showCouponLabels.map((res, key) => {
                  return (
                    <View className='promote-title-coupon' key={key.toString()}>
                      <View>{res.couponName}</View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
        <View className='icon' />
      </View>
    );
  }
}

FreshPromoteItemForHere.defaultProps = {
  promoteListInfo: [],
  onCanPromoteCoupon: () => {},
  showCouponLabels: [],
};

FreshPromoteItemForHere.propTypes = {
  promoteListInfo: PropTypes.array,
  onCanPromoteCoupon: PropTypes.func,
  showCouponLabels: PropTypes.array,
};
