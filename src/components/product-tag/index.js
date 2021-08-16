import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Component } from 'react'
import './index.scss'

export default class FreshProductTag extends Component {
  render() {
    const { text, twoText, fontFamily, styleType } = this.props
    return text ? (
      <View
        className={`product-tag ${styleType === 2 ? 'product-tag-red' : ''}`}
        style={{
          fontFamily
        }}
      >
        <Text className='right'>{text}</Text>
        {twoText && <Text className='left'>{twoText}</Text>}
      </View>
    ) : null
  }
}
