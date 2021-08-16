import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
import { leftIcon } from '../../utils/images';
import './index.scss';

export default class OrderPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  getMyDate = str => {
    let oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime =
        oYear +
        '-' +
        this.addZero(oMonth) +
        '-' +
        this.addZero(oDay) +
        ' ' +
        this.addZero(oHour) +
        ':' +
        this.addZero(oMin) +
        ':' +
        this.addZero(oSen);
    return oTime;
  };

  addZero = num => {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  };

  render() {
    let { orderData, payDate } = this.props;
    let time = '';
    if (payDate > 0) {
      time = this.getMyDate(parseInt(payDate));
    }
    return (
      <View className='order-panel-page'>
        <View className='top' onClick={this.onClick}>
          <Text className='title'>订单信息</Text>
          <View className='search'>
            订单详情
            <Image src={leftIcon} className='left-icon' />
          </View>
        </View>
        <View className='list'>
          <Text className='name'>支付方式：</Text>
          <Text className='value'>{orderData.payChannelDesc}</Text>
        </View>
        <View className='list'>
          <Text className='name'>支付时间：</Text>
          <Text className='value'>{time}</Text>
        </View>
        {orderData.price && (
          <View className='list'>
            <Text className='name'>支付金额：</Text>
            <Text className='value'>¥{orderData.payAmount}</Text>
          </View>
        )}
      </View>
    );
  }
}
