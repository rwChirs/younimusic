import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import { paySuccess, payError } from './images'
// import FreshComponent from '../../common/component'
import './index.scss'

export default class FreshPayResult extends Component {
  render() {
    const { price, status } = this.props
    return (
      <View>
        {(status === 4 || status === 2) && (
          <View className='pay-success'>
            <Image className='pay-success-ok-icon' src={paySuccess} />
            <View className='pay-price'>
              <Text className='unit'>¥</Text>
              {price || 0.0}
            </View>
          </View>
        )}
        {status === 5 && (
          <View className='pay-success'>
            <Image className='pay-success-fail-icon' src={payError} />
            <View className='pay-status'>支付失败</View>
          </View>
        )}
      </View>
    )
  }
}
FreshPayResult.defaultProps = {
  price: 0,
  status: 5
}

FreshPayResult.propTypes = {
  price: PropTypes.number,
  status: PropTypes.number
}
