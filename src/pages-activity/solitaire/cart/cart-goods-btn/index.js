import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text } from '@tarojs/components'
import { Component } from 'react'
import './index.scss'

export default class FreshCartGoodsButton extends Component {
  constructor() {
    super(...arguments)
    if (process.env.NODE_ENV === 'test') {
      Taro.initPxTransform({ designWidth: 750 })
    }
  }

  onAllChecked() {
    this.props.onAllChecked()
  }

  onSubmit() {
    this.props.onSubmit()
  }

  render() {
    const {
      realCount,
      allCheckBool,
      iPhoneX,
      isBottomSub,
      reduceTotalPrice,
      discountTotalPrice,
      baseTotalPrice,
      isCheckAll,
      isCheck,
      count
    } = this.props
    const checkBool = allCheckBool ? 'checked' : 'no-check'
    const check = realCount === 0 ? 'no-check' : checkBool
    return (
      <View
        className={`cart-button-component ${check}`}
        style={{
          bottom: iPhoneX ? `${Taro.pxTransform(parseInt(68))}` : 0,
          display: isBottomSub ? 'block' : 'none'
        }}
      >
        <View className='cart-button-content'>
          <View className='left-part' onClick={this.onAllChecked.bind(this)}>
            <View className='left-set'>
              <View
                className={
                  isCheckAll ? 'check checked' : 'check no-check'
                }
              ></View>
              <View className='check-txt'>全选</View>
            </View>
          </View>
          <View className='bottom-sub-main'>
            <View
              className={`bottom-sub-main-top ${
                reduceTotalPrice > 0 ? '' : 'mt20'
              }`}
            >
              <Text>合计:</Text>
              <View>¥</View>
              <View className='discountTotalPrice'>{discountTotalPrice}</View>
            </View>
            <View
              className='bottom-sub-main-bottom'
              style={{
                display: `${reduceTotalPrice > 0 ? 'block' : 'none'}`
              }}
            >
              <View>总额:</View>
              <View>¥</View>
              <View className='baseTotalPrice'>{baseTotalPrice}</View>
              <View className='discounts-txt'>优惠:</View>
              <View>¥</View>
              <View className='reduceTotalPrice'>{reduceTotalPrice}</View>
            </View>
          </View>
          <View className='right-part' onClick={this.onSubmit.bind(this)}>
            <View
              className={`sub-btn ${isCheckAll || isCheck ? '' : 'disabled'}`}
            >
              <Text className='txt-34'>去结算({count})</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

FreshCartGoodsButton.defaultProps = {
  data: false
}

FreshCartGoodsButton.propTypes = {
  data: PropTypes.bool
}
