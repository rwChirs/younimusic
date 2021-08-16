import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { filterImg, px2vw } from '../../../utils/common/utils';
import { theme } from '../../../common/theme';
import './index.scss';

export default class CouponListNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFlag: false,
    };
  }

  onClick(info) {
    const { onClick } = this.props;
    onClick(info);
  }

  onOpen() {
    const { openFlag } = this.state;
    this.setState({
      openFlag: !openFlag,
    });
  }

  // 领取优惠券
  onCouponChange(data) {
    const { onCouponChange } = this.props;
    onCouponChange(data);
  }

  // 去使用
  onGoSearch(data) {
    const { onGoSearch } = this.props;
    onGoSearch(data);
  }

  render() {
    const {
      data,
      status,
      isRule,
      isOpen,
      isGetCouponSuccess,
      ruleTxt,
      isGetBtn,
      imgList,
      isWareInfos,
    } = this.props;
    const { openFlag } = this.state;

    // status 1未使用 3已使用 5已过期
    // 门店类型颜色
    let limitStyle = {};
    // 优惠券名称的颜色
    let fontColor = { color: '#1D1F2B' };
    // 优惠券价格的颜色
    let priceColor = {
      color: '#FF4B25',
      fontSize:
        (data.discount && data.discount.length > 3) ||
        (data.amountDesc && data.amountDesc.length > 3)
          ? px2vw(48)
          : px2vw(60),
    };
    let unitColor = {
      color: '#FF4B25',
    };
    let btnBg = {};

    let circleLogo = data && data.tenantInfo && data.tenantInfo.circleLogo;
    if (status === 1) {
      if (data.channelType === 2) {
        // 线上购物
        limitStyle = {
          background: 'rgba(68,157,255,0.0754)',
          color: '#449DFF',
        };
      }
      if (data.channelType === 3) {
        // 线下购物
        limitStyle = {
          background: 'rgba(255,153,64,0.0754)',
          color: '#FF9940',
        };
      }
      if (data.channelType === 1) {
        // 线上及门店
        limitStyle = {
          background: 'rgba(2,181,14,0.0754)',
          color: '#02B50E',
        };
      }
      btnBg = {
        background: '#fff',
        color: 'rgba(225,37,27,1)',
        border: '1px solid rgba(225,37,27,1)',
      };
    } else {
      limitStyle = {
        background: 'rgba(29,31,43,0.0754)',
        color: '#95969F',
      };
      fontColor = { color: '#95969F' };
      priceColor = {
        color: '#95969F',
        fontSize:
          (data.discount && data.discount.length > 3) ||
          (data.amountDesc && data.amountDesc.length > 3)
            ? px2vw(48)
            : px2vw(60),
      };
      unitColor = {
        color: '#95969F',
      };
      btnBg = {
        background: 'rgba(246,246,246,1)',
        color: '#95969F',
        border: 'none',
      };
    }
    // 处理金额的显示
    let amountDesc = (data && data.amount) || (data && data.amountDesc);
    if (data && data.amountDesc && data.amountDesc.indexOf('¥') > -1) {
      amountDesc =
        data.couponMode !== 2
          ? data.amountDesc.substr(1)
          : Math.floor(
              data.amountDesc.substr(0, data.amountDesc.length - 1) * 100
            ) / 100;
    }

    const tenantName = data && data.tenantInfo && data.tenantInfo.tenantName;
    const componentHeight =
      data && data.couponName && data.couponName.length > 13
        ? px2vw(240)
        : px2vw(190);

    return (
      <View className='coupon-list-new-component'>
        <View
          className='coupon-list-new-content'
          style={{ height: componentHeight }}
        >
          <View className='shop-and-time' style={{ height: componentHeight }}>
            <View
              className='tenant-shop'
              style={{ marginTop: !isOpen ? px2vw(20) : 0 }}
            >
              {circleLogo && (
                <View className='tenant-logo'>
                  <Image
                    className='img'
                    src={filterImg(circleLogo)}
                    alt='七鲜'
                    mode='aspectFit'
                    lazy-load
                  />
                </View>
              )}
              {tenantName && (
                <View className='tenant-name'>{tenantName || ''}</View>
              )}
              {data.subCouponTypeDesc && (
                <View
                  className='staff-name'
                  style={{ opacity: status === 1 ? 1 : '0.4' }}
                >
                  {data.subCouponTypeDesc}
                </View>
              )}
              <View className='channel-name' style={limitStyle}>
                {data.channelTypeName}
              </View>
            </View>
            <View className='coupon-name' style={fontColor}>
              {data.couponName}
            </View>
            <View className='coupon-time'>{data.validateTime}</View>
            {isOpen && (
              <View className='coupon-rule' onClick={this.onOpen.bind(this)}>
                {ruleTxt}
                <Image
                  className='coupon-rule-arrow'
                  src={theme.toDownGreyArrow}
                  style={{
                    transform: openFlag ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                  mode='aspectFit'
                  lazy-load
                />
              </View>
            )}
          </View>
          <View className='price-and-btn' style={{ height: componentHeight }}>
            <View className='line' style={{ height: componentHeight }}>
              <Image
                className='line-icon'
                src='https://m.360buyimg.com/img/jfs/t1/165312/29/5/604/5fec1b40Efdcbcfdd/db2aa150625c2d5c.png'
                style={{ height: componentHeight }}
                mode='aspectFit'
                lazy-load
              />
            </View>
            {status === 1 && data.tagType === 2 && (
              <View className='icon-new-status'>
                <Image
                  src='https://m.360buyimg.com/img/jfs/t1/142874/31/19900/4531/5fe2dbc3E9376d2fc/68967523ddd23f15.png'
                  className='img'
                  mode='aspectFit'
                  lazy-load
                />
              </View>
            )}

            {status === 1 && data.tagType === 3 && (
              <View className='icon-only-status'>
                <Image
                  src='https://m.360buyimg.com/img/jfs/t1/151757/12/11197/4870/5fe2d901E3f980919/9eb3d028d5cf1299.png'
                  className='img'
                  mode='aspectFit'
                  lazy-load
                />
              </View>
            )}
            {status === 1 && isGetCouponSuccess && (
              <Image
                src={filterImg(theme.getCouponSuccess)}
                mode='aspectFit'
                lazy-load
                className='get-coupon-status'
              />
            )}
            {data.couponMode === 1 && (
              <View className='coupon-show-price'>
                <View className='coupon-unit' style={unitColor}>
                  ¥
                </View>
                <View className='coupon-price' style={priceColor}>
                  {amountDesc || '0.00'}
                </View>
              </View>
            )}
            {data.couponMode === 2 && (
              <View className='coupon-show-price'>
                <View className='coupon-price' style={priceColor}>
                  {data.discount}
                </View>
                <View className='coupon-discount' style={unitColor}>
                  折
                </View>
              </View>
            )}
            {data.ruleDescSimple && (
              <View className='desc'>{data.ruleDescSimple}</View>
            )}
            {isGetBtn ? (
              <View
                className='getbtn'
                onClick={this.onCouponChange.bind(this, data)}
              >
                立即领取
              </View>
            ) : (
              <View
                className='btn'
                style={btnBg}
                onClick={this.onGoSearch.bind(this, data)}
              >
                去使用
              </View>
            )}
          </View>
        </View>
        {/* 隐藏的详细信息 */}
        {openFlag && isRule && (
          <View className='detail-info'>{data.ruleDescDetail}</View>
        )}
        {/* 可用商品列表 */}
        {openFlag && isWareInfos && (
          <View className='discount-item'>
            <View className='disounts-item-list'>
              {imgList &&
                imgList.map((info, index) => {
                  return (
                    <View className='disounts-item-li' key={index.toString()}>
                      <Image
                        src={filterImg(info.imageUrl)}
                        mode='aspectFit'
                        lazy-load
                        className='discounts-img'
                      />
                      <View className='discounts-price'>
                        ¥ {info.jdPrice || 0}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
    );
  }
}

CouponListNew.defaultProps = {
  data: {},
  status: 0,
  onClick: () => {},
};
CouponListNew.propTypes = {
  data: PropTypes.object,
  status: PropTypes.number,
  onClick: PropTypes.func,
};
