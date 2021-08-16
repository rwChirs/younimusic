import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../utils/common/utils';
import './index.scss';

export default class NewPersonCoupon extends Component {
  constructor(props) {
    super(props);
  }

  renderCouponImage = channelType => {
    const couponImage =
      'm.360buyimg.com/img/jfs/t1/150492/36/5377/4793/5fa2425dEbf1714ee/765f9330d06d67af.png';
    const downImage =
      'm.360buyimg.com/img/jfs/t1/135497/26/16389/1721/5fb4bf04E38f7a2ce/cfa30fa7a672603d.png';
    const upImage =
      'm.360buyimg.com/img/jfs/t1/137351/23/16323/6538/5fb4bf13Ea84e5caa/218d0f3034cabc7f.png';
    if (channelType === 3) {
      //线下
      return filterImg(downImage);
    } else if (channelType === 2) {
      //线上
      return filterImg(upImage);
    } else {
      //通用
      return filterImg(couponImage);
    }
  };

  renderColor = channelType => {
    if (channelType === 3) {
      //线下
      return '#FF4C39';
    } else if (channelType === 2) {
      //线上
      return '#ffffff';
    } else {
      //通用
      return '#C46F59';
    }
  };

  render() {
    const { data, couponBag } = this.props;

    return !couponBag ? (
      <View className='list smallHeight'>
        <View className='item'>
          {/* 左侧 */}
          {data.couponInfoWeb && (
            <View
              className='info-left'
              style={{
                backgroundImage: `url(${this.renderCouponImage(
                  data.couponInfoWeb && data.couponInfoWeb.channelType
                )})`,
                color: this.renderColor(
                  data.couponInfoWeb && data.couponInfoWeb.channelType
                ),
              }}
            >
              {data.couponInfoWeb.couponMode &&
              data.couponInfoWeb.couponMode === 1 ? (
                <View className='coupon-content'>
                  <Text>￥</Text>
                  <Text className='b-s'>{data.couponInfoWeb.amountDesc}</Text>
                </View>
              ) : (
                <View className='coupon-content'>
                  <Text className='b-s'>{data.couponInfoWeb.discount}</Text>
                  <Text>折</Text>
                </View>
              )}
              <View className='p-s'>{data.couponInfoWeb.channelTypeName}</View>
            </View>
          )}

          {/* 中间 */}
          <View className='coupon-desc'>
            <View
              className='coupon-div'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <View className='coupon-desc-tenant-name'>{data.taskName}</View>
            </View>
            <View className='coupon-title-main'>{data.awardText}</View>
            <View className='coupon-desc-time'>
              {data.taskOrderPrice || data.awardLadderText}
            </View>
            {/* 背景标 */}
            {data.taskStatus && data.taskStatus === 3 && (
              <Image
                className='icon'
                alt='七鲜'
                src='http://m.360buyimg.com/img/jfs/t1/153905/9/4423/10182/5f9f76ddE9345cdba/bc5575e0b7f3893a.png'
              />
            )}
          </View>
        </View>
      </View>
    ) : (
      <View className='package-outer'>
        <View
          className='coupon-package'
          style={{
            backgroundImage: `url(${filterImg(
              (couponBag && couponBag.couponImg) || ''
            )})`,
          }}
        ></View>
        {couponBag.couponBagType !== 1 && (
          <View className='content-box'>
            <View className='content-inner'>
              <View>
                {couponBag.amountDesc ? (
                  <View>
                    <Text className='tag'>￥</Text>
                    <Text className='amount'>{couponBag.amountDesc}</Text>
                    {couponBag.couponName && (
                      <Text className='couponImg'>{couponBag.couponName}</Text>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text className='amount'>
                      {data.couponInfoWeb.discount || couponBag.discount}
                    </Text>
                    <Text className='tag'>折</Text>
                    {couponBag.couponName && (
                      <Text className='couponImg'>{couponBag.couponName}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
            {couponBag.ruleDescSimple && (
              <View className='manjian'>{couponBag.ruleDescSimple}</View>
            )}
          </View>
        )}
      </View>
    );
  }
}
