import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
// import FreshComponent from '../../common/component'
import './index.scss'

export default class FreshPayTitle extends Component {
  render() {
    const { title, isHaveIcon, margin, color, lineWidth, fontSize } = this.props
    return (
      <View className='fight-title'>
        <View className='leftLine' style={{ width: `${lineWidth}px` }}>
          {isHaveIcon && <View className='line-circle-l' />}
        </View>
        <View
          className='content'
          style={{
            marginLeft: `${margin}px`,
            marginRight: `${margin}px`,
            color,
            fontSize: `${fontSize}px`
          }}
        >
          {title}
        </View>
        <View className='rightLine' style={{ width: `${lineWidth}px` }}>
          {isHaveIcon && <View className='line-circle-r' />}
        </View>
      </View>
    )
  }
}

FreshPayTitle.defaultProps = {
  title: '',
  isHaveIcon: false,
  margin: 0,
  color: '',
  lineWidth: 0,
  fontSize: 0
}

FreshPayTitle.propTypes = {
  title: PropTypes.string,
  isHaveIcon: PropTypes.bool,
  margin: PropTypes.number,
  color: PropTypes.string,
  lineWidth: PropTypes.number,
  fontSize: PropTypes.number
}
