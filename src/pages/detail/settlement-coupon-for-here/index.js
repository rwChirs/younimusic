import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import CouponListNew from '../coupon-list-new';
import './index.scss';

export default class SettlementCouponForHere extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose() {
    const { onClose } = this.props;
    onClose();
  }

  onCouponChange(data) {
    const { onCouponChange } = this.props;
    onCouponChange(data);
  }

  onScrollToLower() {
    const { onScrollToLower } = this.props;
    onScrollToLower();
  }

  onGoSearch(data) {
    const { onGoSearch } = this.props;
    onGoSearch(data);
  }

  render() {
    const { data, showCouponModal } = this.props;
    const canCollect =
      data && data.filter(item => !item.received || item.received === 'temp');
    const notCollect = data && data.filter(item => item.received);
    return (
      showCouponModal && (
        <View>
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
              <View className='content'>
                {canCollect && canCollect.length !== 0 && (
                  <View>
                    <View className='title'>领券</View>
                    <View className='list'>
                      {data &&
                        data
                          .filter(
                            item => !item.received || item.received === 'temp'
                          )
                          .map((res, index) => {
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <View className='coupon-list'>
                                <CouponListNew
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
                      {data &&
                        data
                          .filter(
                            item => item.received && item.received !== 'temp'
                          )
                          .map((res, index) => {
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <View className='coupon-list'>
                                <CouponListNew
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
                                />
                              </View>
                            );
                          })}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )
    );
  }
}

SettlementCouponForHere.defaultProps = {
  data: [],
  showCouponModal: false,
  onClose: () => {},
  collectCoupon: () => {},
};

SettlementCouponForHere.propTypes = {
  data: PropTypes.array,
  showCouponModal: PropTypes.bool,
  onClose: PropTypes.func,
  collectCoupon: PropTypes.func,
};
