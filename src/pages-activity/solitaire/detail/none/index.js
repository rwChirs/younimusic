import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Image } from '@tarojs/components'
import { Component } from 'react'
import './index.scss'

export default class FreshNone extends Component {
  render () {
    const { imgUrl, desc, button, size } = this.props
    const sizeStyle = {
      width: size ? `${Taro.pxTransform(parseInt(size))}` : '',
      height: size ? `${Taro.pxTransform(parseInt(size))}` : ''
    }

    return (
      <View className='none-component'>
        {imgUrl && (
          <Image
            src={imgUrl}
            className='none-component-pic'
            mode='aspectFit'
            style={sizeStyle}
          />
        )}
        {desc && <View className='none-component-desc'>{desc}</View>}
        {button && (
          <View className='none-component-btn'>
            <View className='btn'>{button}</View>
          </View>
        )}
      </View>
    )
  }
}

FreshNone.defaultProps = {
  size: 0,
  imgUrl: '',
  desc: '暂无任务',
  button: ''
}

FreshNone.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imgUrl: PropTypes.string,
  desc: PropTypes.string,
  button: PropTypes.string
}
