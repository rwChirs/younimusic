import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import { Component } from 'react'
import './index.scss'

export default class FreshSolitaireMoney extends Component {
  render() {
    const { commissionText, commission } = this.props
    return (
      commission &&
      commission !== '￥0' &&
      commission !== '0.0' && (
        <View className='solitaire-make-money'>
          <View className='text'>{commissionText}</View>
          <View className='num'>{commission}</View>
        </View>
      )
    )
  }
}

FreshSolitaireMoney.defaultProps = {
  commissionText: '',
  commission: ''
}

FreshSolitaireMoney.propTypes = {
  commissionText: PropTypes.string,
  commission: PropTypes.string
}
