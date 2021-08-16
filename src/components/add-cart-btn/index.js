import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import {Component} from 'react'
import './index.scss'

export default class FreshAddCartBtn extends Component {
  onClick(ev) {
    ev.stopPropagation()
    if (!this.props.disabled) {
      this.props.onClick(ev)
    }
  }
  // 预付卡去H5结算页
  onGoCardOrder = ev => {
    const { dataInfo } = this.props
    ev.stopPropagation()
    this.props.onGoCardOrder(dataInfo)
  }

  render() {
    const { size, disabled, isCustomize, style, type, dataInfo } = this.props
    const addStyle = isCustomize
      ? {
        ...style
      }
      : {}
    return (
      <View>
        {/* eslint-disable-next-line */}
        {dataInfo && dataInfo.prepayCardType ? (
          type === 1 || type === 2 ? (
            <View className='buy-now' onClick={this.goCardOrder}>
              购卡
            </View>
          ) : (
            ''
          )
        ) : (
          <View
            className={`add-cart-btn-component ${
              disabled ? 'disabled' : ''
            } add-cart-btn-${size}`}
            style={addStyle}
            onClick={this.onClick.bind(this)}
          />
        )}
      </View>
    )
  }
}
