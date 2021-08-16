import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import {
  View,
  Text
} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class FreshFloorCouponGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data, onClick } = this.props
    const { launchCouponInfo, couponInfoWebList } = data
    const expiredUnit = ['天', '小时', '分钟']
    return data && launchCouponInfo && couponInfoWebList ? (
      <View
        className={
          couponInfoWebList.length > 2
            ? 'floor-coupon-group big'
            : 'floor-coupon-group'
        }
      >
        <View className='tilte'>{launchCouponInfo.title}</View>
        <View className='coupon-content'>
          <View
            className={
              couponInfoWebList.length > 3 ? 'content' : 'content center'
            }
          >
            {couponInfoWebList.length === 1 &&
              couponInfoWebList.map((item, i) => (
                <View
                  className={
                    item.couponStatus === 102 ? 'list-one gray' : 'list-one'
                  }
                  key={i.toString()}
                >
                  <View className='left'>
                    <Text className={item.couponMode === 2 ? 'count' : 'num'}>
                      <Text className='icon'>
                        {item.couponMode === 2 ? '折' : '¥'}
                      </Text>
                      {item.couponMode === 2 ? item.discount : item.amountDesc}
                    </Text>
                  </View>
                  <View className='right'>
                    <View className='desc'>{item.couponName}</View>
                    <View className='rule'>{item.needMoneyDesc}</View>
                  </View>
                  {(item.couponStatus === 102 || item.couponStatus === 103) && (
                    <View
                      className={
                        item.couponStatus === 103 ? 'gotten' : 'gotten no-more'
                      }
                    ></View>
                  )}
                </View>
              ))}
            {couponInfoWebList && couponInfoWebList.length === 2 && (
              <View className='list-two'>
                {couponInfoWebList.map((item, i) => (
                  <View
                    className={
                      item.couponStatus === 102 ? 'two-info gray' : 'two-info'
                    }
                    key={i.toString()}
                  >
                    <View className='left'>
                      <Text className={item.couponMode === 2 ? 'count' : 'num'}>
                        <Text className='icon'>
                          {item.couponMode === 2 ? '折' : '¥'}
                        </Text>
                        {item.couponMode === 2
                          ? item.discount
                          : item.amountDesc}
                      </Text>
                    </View>
                    <View className='right'>
                      <View className='desc'>{item.couponName}</View>
                      <View className='rule'>{item.needMoneyDesc}</View>
                    </View>
                    {(item.couponStatus === 102 ||
                      item.couponStatus === 103) && (
                      <View
                        className={
                          item.couponStatus === 103
                            ? 'gotten'
                            : 'gotten no-more'
                        }
                      ></View>
                    )}
                  </View>
                ))}
              </View>
            )}
            {couponInfoWebList.length > 2 && (
              <View
                className={
                  couponInfoWebList.length > 3
                    ? 'list-three scroll'
                    : 'list-three'
                }
              >
                {couponInfoWebList.map((item, i) => (
                  <View
                    className={[
                      'three-info',
                      i > 2 && i === couponInfoWebList.length - 1 ? 'mr20' : '',
                      item.couponStatus === 102 ? 'gray' : ''
                    ].join(' ')}
                    key={i.toString()}
                  >
                    <View className='line-one'>
                      <Text className={item.couponMode === 2 ? 'count' : 'num'}>
                        <Text className='icon'>
                          {item.couponMode === 2 ? '折' : '¥'}
                        </Text>
                        {item.couponMode === 2
                          ? item.discount
                          : item.amountDesc}
                      </Text>
                    </View>
                    <View className='line-two'>
                      <View className='desc'>{item.couponName}</View>
                      <View className='rule'>{item.needMoneyDesc}</View>
                    </View>
                    {(item.couponStatus === 102 ||
                      item.couponStatus === 103) && (
                      <View
                        className={
                          item.couponStatus === 103
                            ? 'gotten'
                            : 'gotten no-more'
                        }
                      ></View>
                    )}
                  </View>
                ))}
              </View>
            )}
            {couponInfoWebList && couponInfoWebList.length > 3 && (
              <View className='mask'></View>
            )}
          </View>
        </View>
        <View className='bottom'>
          {launchCouponInfo.buttonType !== 3 && (
            <View
              className={
                launchCouponInfo.buttonType === 1 ? 'button' : 'button get'
              }
              onClick={onClick.bind(
                this,
                launchCouponInfo.buttonType,
                data.floorUuid
              )}
            >
              {launchCouponInfo.buttonText}
            </View>
          )}
          {launchCouponInfo.buttonType === 3 && (
            <View className='no-more-tips'>啊哦，优惠劵全部领光了~</View>
          )}
          {// launchCouponInfo.couponOverdueInfo ? (
          //   <View className='tips'>{launchCouponInfo.couponOverdueInfo}</View>
          // ) : (
            launchCouponInfo.buttonType !== 3 &&
            launchCouponInfo.expiredCount > 0 && (
              <View className='tips'>
                领取成功，{launchCouponInfo.expiredCount || 0}张劵在
                <Text className='day'>
                  {launchCouponInfo.expired || 0}
                  {expiredUnit[launchCouponInfo.expiredUnit - 1]}
                </Text>
                后过期
              </View>
              // )
            )}
        </View>
      </View>
    ) : null
  }
}

FreshFloorCouponGroup.defaultProps = {
  data: {
    couponInfoWebList: []
  }
}

FreshFloorCouponGroup.propTypes = {
  data: PropTypes.object
}
