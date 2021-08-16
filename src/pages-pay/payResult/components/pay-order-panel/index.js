import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
// import FreshComponent from '../../common/component'
import './index.scss'

export default class FreshPayOrderPanel extends Component {
  leftIcon =
    'https://m.360buyimg.com/img/jfs/t1/15409/15/8142/296/5c73e69fE678f6381/7fe120d903c8a1e0.png'

  onClick = e => {
    e.stopPropagation()
    this.props.onClick()
  }

  getMyDate(str) {
    // eslint-disable-next-line one-var
    const oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = `${oYear}-${this.addZero(oMonth)}-${this.addZero(
        oDay
      )} ${this.addZero(oHour)}:${this.addZero(oMin)}:${this.addZero(oSen)}`
    return oTime
  }

  addZero(num) {
    if (parseInt(num) < 10) {
      num = `0${num}`
    }
    return num
  }

  render() {
    const {
      orderData
      // payDate
    } = this.props
    // let time = ''
    // if (payDate > 0) {
    //   time = this.getMyDate(parseInt(payDate))
    // }

    return (
      <View className='order-panel-page'>
        <View className='order-panel-top' onClick={this.onClick}>
          <Text className='title'>订单信息</Text>
          <View className='search-detail'>
            订单详情
            <Image src={this.leftIcon} className='left-icon' />
          </View>
        </View>
        {/* <View className='list'>
          <Text className='name'>支付方式：</Text>
          <Text className='value'>{orderData.payChannelDesc}</Text>
        </View>
        <View className='list'>
          <Text className='name'>支付时间：</Text>
          <Text className='value'>{time}</Text>
        </View> */}
        {orderData &&
          orderData.amountItemList &&
          orderData.amountItemList.length > 0 &&
          orderData.amountItemList.map((item, index) => (
            <View className='list' key={index}>
              <Text className='name'>{item.name}：</Text>
              <Text className='value'>-{item.value}</Text>
            </View>
          ))}
        {orderData.payAmount && (
          <View className='list'>
            <Text className='name'>支付金额：</Text>
            <Text className='value'>¥{orderData.payAmount}</Text>
          </View>
        )}
      </View>
    )
  }
}

FreshPayOrderPanel.defaultProps = {
  orderData: {},
  payDate: ''
}

FreshPayOrderPanel.propTypes = {
  orderData: PropTypes.object,
  payDate: PropTypes.string
}
