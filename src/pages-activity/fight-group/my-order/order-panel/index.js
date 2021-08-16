import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
// import TeamIcon from '../team-icon';
// import OrderBtn from '../order-btn';
import {
  orderStatusSuccess,
  //  orderStatusError
} from '../../utils/images';
import { filterImg } from '../../utils/filter';
import './index.scss';

export default class MyOrderPanel extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    skuImg: '',
    skuName: '',
    memberCount: 0,
    grouponPrice: 0.0,
    attrName: '',
    status: '',
    list: [],
  };

  //去拼团详情页
  goToTeamDetail = info => {
    let url = '';
    if (info.groupId) {
      url =
        '/pages-a/fight-group/team-detail/index?activityId=' +
        info.activityId +
        '&skuId=' +
        info.skuId +
        '&storeId=' +
        info.storeId +
        '&grouponId=' +
        info.groupId +
        '&orderId=' +
        info.orderId;
    } else {
      url =
        '/pages-a/fight-group/team-detail/index?activityId=' +
        info.activityId +
        '&skuId=' +
        info.skuId +
        '&storeId=' +
        info.storeId +
        '&orderId=' +
        info.orderId;
    }
    Taro.navigateTo({
      url: url,
    });
  };

  getOrderStatus = info => {
    switch (info.grouponStat) {
      case 1:
        return orderStatusSuccess;
      case 2:
        // return orderStatusError;
        return '';
      default:
        return '';
    }
  };

  render() {
    const info = this.props.list;
    return (
      info &&
      info.orderId &&
      info.skuName && (
        <View
          className='my-order-panel'
          onClick={this.goToTeamDetail.bind(this, info)}
        >
          {info.grouponStat === 1 && (
            <Image
              className='my-order-status'
              mode='aspectFit'
              src={orderStatusSuccess}
            />
          )}
          <View className='top'>
            <View className='orderId'>订单号：{info.orderId}</View>
            <View className='status'>
              {info.grouponStat === 1 ? (
                <View></View>
              ) : info.grouponStat === 2 ? (
                <View className='black'>拼团失败</View>
              ) : (
                <View className='red'>
                  拼团中还差{info.shortMemberCount}人成团
                </View>
              )}
            </View>
          </View>
          <View className='product-info'>
            <Image
              className='img'
              mode='aspectFit'
              lazy-load
              src={filterImg(info.imageUrl)}
            />
            <View className='info'>
              <View className='info-left'>
                <View className='info-top'>
                  {info.skuName ? info.skuName : '商品标题'}
                </View>
                {info.saleSpecDesc && (
                  <View className='info-bottom'>规格：{info.saleSpecDesc}</View>
                )}
              </View>
              <View className='info-right'>x1</View>
            </View>
          </View>
          <View className='price'>
            <Text className='desc'>实付款</Text>
            <Text className='unit'>¥</Text>
            <Text className='current'>{info.groupPrice}</Text>
          </View>
        </View>
      )
    );
  }
}
