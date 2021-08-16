import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class FreshNewBornZone extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidShow() {
    this.setState({});
  }

  getCoupon = ev => {
    ev.stopPropagation();
    const { data, onGetCoupon } = this.props;
    if (!data.alreadyGetCoupon) {
      onGetCoupon();
    }
  };
  onGoHome = () => {
    const { onGoHome } = this.props;
    onGoHome();
  };

  render() {
    const { data } = this.props;
    const usedImg =
      'https://m.360buyimg.com/img/jfs/t1/122041/40/19053/25606/5fbe00d4Ed106fb1e/0fb8c6be7552f9e7.png';
    const couponList =
      data &&
      data.coupons &&
      data.coupons !== undefined &&
      data.coupons.length > 0
        ? data.coupons
        : [];
    return (
      <View>
        {data && (
          <View className='zone-warp bg'>
            <View
              className={
                !data.alreadyGetCoupon ? 'coupon-box bg' : 'coupon-box'
              }
            >
              <View className='coupon-box-title'>
                <View className='left' />
                {data.alreadyGetCoupon && (
                  <View className='right is-get' onClick={this.onGoHome}>
                    已领取，去七鲜首页逛逛 ＞
                  </View>
                )}
                {!data.alreadyGetCoupon && (
                  <View className='right' onClick={this.getCoupon}>
                    一键领¥{data.totalAmount}礼包
                  </View>
                )}
              </View>
              <View className='coupon-box-list'>
                <View className='list'>
                  {couponList &&
                    couponList.map((info, i) => {
                      return (
                        <View className='info' key={i.toString()}>
                          <View className='info-left'>
                            <View
                              className={`${info.channelType} === 1
                                  ? 'info-left-icon'
                                  : ${info.channelType} === 2
                                    ? 'info-left-icon blue'
                                    : 'info-left-icon yellow'
                              `}
                            >
                              {info.channelType === 1 && '线上&门店劵'}
                              {info.channelType === 2 && '线上劵'}
                              {info.channelType !== 1 &&
                                info.channelType !== 2 &&
                                '门店劵'}
                            </View>
                            <View className='info-left'>
                              {info.couponMode === 1 && (
                                <View className='info-left-price'>
                                  {info.amountDesc || 0}
                                </View>
                              )}
                              {info.couponMode === 2 && (
                                <View className='info-left-discount'>
                                  {info.discount || 0}折
                                </View>
                              )}
                            </View>
                          </View>
                          <View className='info-right'>
                            {data.alreadyGetCoupon && (
                              <Image
                                className='info-right-img'
                                src={usedImg}
                              ></Image>
                            )}
                            <View className='info-right-fir'>
                              {info.ruleDescSimple || ''}
                            </View>
                            <View className='info-right-sec'>
                              {info.couponName || ''}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
              <View className='list-shadow'></View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
