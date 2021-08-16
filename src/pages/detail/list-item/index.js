import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, ScrollView, Image } from '@tarojs/components';
import { px2vw } from '../../../utils/common/utils';
import ButtonGroup from './button-group';
// import CouponGroup from './coupon-group';
// import PromotionGroup from './promotion-group';
import PackageGroup from './package-group';
import FreeServiceGroup from './free-service-group';

import './index.scss';
import DeliveryGroup from './delivery-group';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    label: '',
    current: 1,
    type: '',
    data: [],
    canPopup: false,
    showPrice: false,
    pid: '',
  };

  onPopup = () => {
    const { onPopup, onClick, type } = this.props;
    if (type !== 'text') {
      onPopup();
    } else {
      if (onClick && typeof onClick === 'function') {
        const { resData } = this.props;
        const url = resData && resData.jumpUrl;
        onClick(url);
      }
    }
  };

  onChange = id => {
    this.props.onButtonChange(id);
  };

  render() {
    const { label, data, current, type, canPopup, pid, textIcon } = this.props;
    const { preSaleInfo } = this.props;
    const isWareInSuits = pid === 'wareInSuits';
    const isButtons = type === 'buttons';
    const isText = type === 'text';
    // const isCoupon = type === 'coupon';
    // const isPromotion = type === 'promotion';
    const isPackage = type === 'package';
    const isDelivery = type === 'delivery';
    const isService = type === 'service';
    const isFreeService = type === 'freeservice';
    const iconPic =
      data.detailSmallIcon ||
      'https://m.360buyimg.com/img/jfs/t1/170807/38/1983/862/5ffaf180Ee8354a96/1a9062ee2fce15da.png';
    return (
      <View className='product-property' onClick={this.onPopup}>
        {!isDelivery && (
          <View
            className='label'
            style={{
              lineHeight:
                label === '服务' || label === '榜单' ? 'unset' : px2vw(74),
            }}
          >
            <Text>{label}</Text>
          </View>
        )}
        <ScrollView
          scrollX
          className='contents'
          style={{
            padding:
              isText || isService || isDelivery || isFreeService ? 0 : '',
            lineHeight: isText ? px2vw(74) : '',
          }}
          enableFlex
        >
          {isButtons && (
            <ButtonGroup
              current={current}
              data={data}
              onChange={this.onChange}
            />
          )}
          {isText && (
            <View className='text'>
              {/* 只有内容榜单有图标，算法榜单没有小图标 */}
              {(data.rankingType === 0 || data.rankingType === 1) && (
                <View
                  className='text-icon'
                  style={{ backgroundImage: `url(${iconPic})` }}
                ></View>
              )}
              {textIcon && (
                <View
                  className='text-icon'
                  style={{ backgroundImage: `url(${textIcon})` }}
                ></View>
              )}
              {/* 有rankingType就是榜单，没有就是普通listItem */}
              <Text className='bank-name'>
                {data && (data.rankingType === 0 || data.rankingType === 1)
                  ? data.title
                  : data}
              </Text>
              {data &&
                data.rankingType === 1 &&
                data.rankingTypeSub !== 1 &&
                data.sortId > 0 && (
                  <Text className='sort'>
                    <Text>第</Text>
                    <Text className='red'>{data.sortId}</Text>
                    <Text>名</Text>
                  </Text>
                )}
            </View>
          )}
          {isService && <Text className='service'>{data}</Text>}
          {/* {isCoupon && <CouponGroup data={data} />} */}
          {/* {isPromotion && <PromotionGroup data={data} />} */}
          {isPackage && !isWareInSuits && <PackageGroup data={data} />}
          {isWareInSuits && <PackageGroup data={data.packList} showPrice />}

          {isFreeService && <FreeServiceGroup data={data} label={label} />}
          {isDelivery && (
            <DeliveryGroup
              preSaleInfo={preSaleInfo}
              data={data}
              label={label}
            />
          )}
        </ScrollView>
        {canPopup && (
          <Image
            className='popup'
            src={
              isText
                ? 'https://m.360buyimg.com/img/jfs/t1/157901/26/4836/458/600e331cE779cc306/b426a71e18028fba.png'
                : 'https://m.360buyimg.com/img/jfs/t1/169791/30/4158/414/600e2f50Efe063d0c/5e0bcde89cdf4a89.png'
            }
            style={{
              width: isText
                ? `${Taro.pxTransform(parseInt(20))}`
                : `${Taro.pxTransform(parseInt(30))}`,
              height: isText
                ? `${Taro.pxTransform(parseInt(20))}`
                : `${Taro.pxTransform(parseInt(30))}`,
              top:
                label === '榜单' ? px2vw(26) : label === '服务' ? 0 : px2vw(20),
            }}
            alt='七鲜'
          />
        )}
      </View>
    );
  }
}
