import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
// import FreshComponent from '../../common/component'
import FreshCouponListNew from '../coupon-list-new';
import './index.scss';

export default class FreshSettlementCouponPopupForHere extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClickPromote = (item, res) => {
    const { onClickPromote } = this.props;
    if (onClickPromote && typeof onClickPromote === 'function') {
      onClickPromote(item, res);
    }
  };

  onClose() {
    const { onClose } = this.props;
    onClose();
  }

  onScrollToLower() {
    const { onScrollToLower } = this.props;
    onScrollToLower();
  }

  onCouponChange(data) {
    const { onCouponChange } = this.props;
    onCouponChange(data);
  }

  onGoSearch(data) {
    const { onGoSearch } = this.props;
    onGoSearch(data);
  }

  render() {
    const {
      showPromoteCouponModal,
      promoteListInfo,
      couponInfoWeb,
    } = this.props;
    const canCollect =
      couponInfoWeb &&
      couponInfoWeb.filter(item => !item.received || item.received === 'temp');
    const notCollect =
      couponInfoWeb && couponInfoWeb.filter(item => item.received);

    const promoteListCollect =
      promoteListInfo &&
      promoteListInfo.filter(
        item =>
          (item.showTexts && item.showTexts.length > 0) || !!item.limitBuyText
      );
    return (
      showPromoteCouponModal && (
        <View className='settlement-coupon'>
          <View className='mask' onClick={this.onClose.bind(this, null)} />
          <View className='coupon-modal'>
            <View className='coupon-modal-header'>
              <View className='coupon-modal-title'>优惠</View>
              <View
                className='coupon-modal-close'
                onClick={this.onClose.bind(this, null)}
              />
            </View>

            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              onScrollToLower={this.onScrollToLower.bind(this)}
            >
              <View className='discount-box'>
                {promoteListCollect && promoteListCollect.length !== 0 && (
                  <View className='promote-content'>
                    <View className='title'>促销</View>
                    <View className='promote-list'>
                      {promoteListCollect &&
                        promoteListCollect.map((res, key) => {
                          return (
                            <View className='promote-item' key={key.toString()}>
                              <View className='promote-title'>
                                {res.promotionName}
                              </View>
                              <View className='promote-desc'>
                                {res && res.limitBuyText && (
                                  <View
                                    style={{
                                      marginBottom: `${Taro.pxTransform(
                                        parseInt(10)
                                      )}`,
                                    }}
                                  >
                                    {res.limitBuyText}
                                  </View>
                                )}
                                {res.showTexts &&
                                  res.showTexts.length !== 0 &&
                                  res.showTexts.map((item, index) => {
                                    return (
                                      <View
                                        key={index.toString()}
                                        onClick={this.onClickPromote.bind(
                                          this,
                                          item,
                                          res
                                        )}
                                      >
                                        <View>{item.showMsg}</View>
                                        {(item.showSkipFlag
                                          ? item.forward
                                          : res.forward) === true && (
                                          <View className='icon' />
                                        )}
                                      </View>
                                    );
                                  })}
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  </View>
                )}
                <View
                  className='content'
                  style={{
                    paddingTop:
                      promoteListCollect && promoteListCollect.length !== 0
                        ? `${Taro.pxTransform(parseInt(28))}`
                        : 0,
                  }}
                >
                  {canCollect && canCollect.length !== 0 && (
                    <View>
                      <View className='title'>领券</View>
                      <View className='list'>
                        {couponInfoWeb &&
                          couponInfoWeb
                            .filter(
                              item => !item.received || item.received === 'temp'
                            )
                            .map((res, index) => {
                              return (
                                <View
                                  className='coupon-list'
                                  key={index.toString()}
                                >
                                  <FreshCouponListNew
                                    data={res}
                                    status={1}
                                    key={index.toString()}
                                    isRule={false} // 不显示规则说明
                                    isGetCouponSuccess={res.receivedSuccess} // 领取后打标
                                    isUsed={res.receivedSuccess}
                                    isGetBtn={!res.receivedSuccess} // 立即领取
                                    onCouponChange={this.onCouponChange.bind(
                                      this,
                                      res
                                    )}
                                    onGoSearch={this.onGoSearch.bind(this, res)}
                                  />
                                </View>
                              );
                            })}
                      </View>
                    </View>
                  )}
                  {notCollect && notCollect.length !== 0 && (
                    <View>
                      <View className='title'>已领取</View>
                      <View className='list'>
                        {couponInfoWeb &&
                          couponInfoWeb
                            .filter(
                              item => item.received && item.received !== 'temp'
                            )
                            .map((res, index) => {
                              return (
                                <View
                                  className='coupon-list'
                                  key={index.toString()}
                                >
                                  <FreshCouponListNew
                                    data={res}
                                    status={1}
                                    key={index.toString()}
                                    isRule={false} // 不显示规则说明
                                    isGetCouponSuccess // 显示领取成功的标
                                    onCouponChange={this.onCouponChange.bind(
                                      this,
                                      res
                                    )}
                                    onGoSearch={this.onGoSearch.bind(this, res)}
                                    // isUsed
                                  />
                                </View>
                              );
                            })}
                      </View>
                    </View>
                  )}
                </View>
                <View
                  style={{ height: `${Taro.pxTransform(parseInt(200))}` }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      )
    );
  }
}

FreshSettlementCouponPopupForHere.defaultProps = {
  promoteListInfo: [],
  couponInfoWeb: [],
  showPromoteCouponModal: false,
  onClose: () => {},
  onCouponChange: () => {},
  onScrollToLower: () => {},
  onGoSearch: () => {},
};

FreshSettlementCouponPopupForHere.propTypes = {
  promoteListInfo: PropTypes.array,
  couponInfoWeb: PropTypes.array,
  showPromoteCouponModal: PropTypes.bool,
  onClose: PropTypes.func,
  onCouponChange: PropTypes.func,
  onScrollToLower: PropTypes.func,
  onGoSearch: PropTypes.func,
};
