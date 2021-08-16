import Taro from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
// import FreshComponent from '../../common/component'
import './index.scss'

export default class FreshPayResultDetail extends Component {
  static defaultProps = {
    list: []
  }

  render() {
    const { list } = this.props

    return (
      <View className='pay-detail-box-wrapper'>
        <View className='pay-detail-box'>
          {list &&
            list.length > 0 &&
            list.map((item, index) => (
              <View className='pay-detail-item' key={index}>
                <Text className='title'>{item.name}</Text>
                <Text className='content'>{item.value}</Text>
              </View>
            ))}
        </View>
      </View>
    )
  }
}

FreshPayResultDetail.defaultProps = {
  list: []
}

FreshPayResultDetail.propTypes = {
  list: PropTypes.array
}
