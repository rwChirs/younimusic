import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class FreshProductButton extends Component {
  onClick = e => {
    e.stopPropagation()
    this.props.onClick()
  }

  render() {
    const {
      width,
      height,
      background,
      boxShadow,
      borderRadius,
      color,
      fontWeight,
      desc,
      name,
      disabled,
      border,
      borderType
    } = this.props
    let _width = 0
    if (width === '100%') {
      _width = '100%'
    } else if (width) {
      _width = `${width}rpx`
    } else {
      _width = `${410}rpx`
    }
    let _borderRadius
    if (borderType !== 'circle') {
      if (borderRadius) {
        _borderRadius = `${borderRadius[0]} ${borderRadius[1]} ${borderRadius[2]} ${borderRadius[3]}`
      } else {
        _borderRadius = 0
      }
    } else {
      _borderRadius = '40rpx'
    }
    return (
      <View
        className={`${disabled ? 'disabled' : ''} button`}
        style={{
          width: _width,
          height: height ? `${height}rpx` : `${88}rpx`,
          lineHeight: height ? `${height}rpx` : `${88}rpx`,
          background,
          boxShadow,
          borderRadius: _borderRadius,
          color,
          border
        }}
        onClick={this.onClick}
      >
        <Text className='desc'>{desc || ''}</Text>
        {desc && <Text className='split' />}
        <Text
          className='name'
          style={{
            fontWeight
          }}
        >
          {name}
        </Text>
      </View>
    )
  }
}