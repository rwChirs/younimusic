import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

export default class FreshFloatBtn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      goHome:
        'https://m.360buyimg.com/img/jfs/t1/29552/24/14337/4135/5ca56cedE042ca4eb/d1d4a1ee25cc3ad7.png'
    }
  }

  onClick = e => {
    e.stopPropagation()
    this.props.onClick()
  }

  render() {
    const { title, type, imageUrl, color, borderColor, imgStyle } = this.props
    return (
      <View
        className='float-btn-components'
        style={`border:1px solid ${borderColor};${imgStyle}`}
        onClick={this.onClick}
      >
        {type === 'top' && (
          <View className='float-btn-content'>
            <Text
              className='float-btn-top'
              style={`border-top: 2px solid ${color};border-right: 2px solid ${color}`}
            />
            {title && (
              <Text className='float-btn-title' style={`color:${color}`}>
                {title}
              </Text>
            )}
          </View>
        )}
        {type === 'home' && (
          <Image className='float-btn-icon' style={imgStyle} src={imageUrl} />
        )}

        {type === 'normal' && <Text className='float-only-title'>{title}</Text>}
      </View>
    )
  }
}