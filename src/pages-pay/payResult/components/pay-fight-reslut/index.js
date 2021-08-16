import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
// import FreshComponent from '../../common/component'
import { paySuccess, payError } from './image'
import FreshFightUserTop from '../fight-user-top'
import './index.scss'

// 支付结果
export default class FreshPayFightResult extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onSearchOrder = e => {
    e.stopPropagation()
    this.props.onSearchOrder()
  }

  onGoHome = e => {
    e.stopPropagation()
    this.props.onGoHome()
  }

  onPay = e => {
    e.stopPropagation()
    this.props.onPay()
  }

  render() {
    const { payStatus, payOrderInfo, resource } = this.props

    return (
      <View className='pay-result-page'>
        {payStatus !== 5 ? (
          <View className='pay-success'>
            <Image className='icon' src={paySuccess} />
            <View className='pay-status'>恭喜您拼团成功！</View>
            <View className='pay-user-top'>
              <FreshFightUserTop
                list={payOrderInfo.groupInfoWeb.grouponMemberInfos}
                type={0}
                resource={resource}
              />
            </View>
            <View className='pay-btn'>
              <Text className='right-btn' onClick={this.onGoHome}>
                首页逛逛
              </Text>
              <Text className='left-btn' onClick={this.onSearchOrder}>
                查看订单
              </Text>
            </View>
          </View>
        ) : (
          <View className='pay-fail'>
            <Image className='icon' src={payError} />
            <View className='pay-status'>订单支付失败</View>
            <View className='pay-way'>
              <Text className='grey'>支付方式：</Text>
              <Text className='black'>微信支付</Text>
            </View>
            <View className='pay-btn'>
              <Text className='left-btn' onClick={this.onSearchOrder}>
                查看订单
              </Text>
              <Text className='right-btn' onClick={this.onPay}>
                重新支付
              </Text>
            </View>
          </View>
        )}
      </View>
    )
  }
}

FreshPayFightResult.defaultProps = {
  payStatus: 0,
  payOrderInfo: {},
  resource: ''
}

FreshPayFightResult.propTypes = {
  payStatus: PropTypes.number,
  payOrderInfo: PropTypes.object,
  resource: PropTypes.string
}
