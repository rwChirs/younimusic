import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Component } from 'react'
import './index.scss'

export default class FreshProductItemBtn extends Component {
  onClick = event => {
    event.stopPropagation()
    if (!this.props.disabled) this.props.onClick(event)
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
      fontFamily,
      fontSize,
      desc,
      name,
      disabled,
      isShowDeacIcon,
      descIcon,
      border,
      paddingLeft,
      margin,
      fontIcon,
      transform,
      minWidth,
      maxWidth,
      textDirection,
      position,
      display
    } = this.props
    const getWidth = () => {
      if (width) {
        return String(Number(width)) !== 'NaN'
          ? `${Taro.pxTransform(Number(width))}`
          : width
      }
      return `${Taro.pxTransform(410)}`
    }

    return (
      <View
        className={`${disabled ? 'disabled' : ''} button ${
          textDirection === 1 ? 'textDirection' : ''
        }`}
        style={{
          width: getWidth(),
          minWidth: minWidth ? `${Taro.pxTransform(minWidth)}` : '',
          maxWidth: maxWidth ? `${Taro.pxTransform(maxWidth)}` : '',
          height: height
            ? `${Taro.pxTransform(height)}`
            : `${Taro.pxTransform(88)}`,
          lineHeight: height
            ? `${Taro.pxTransform(height)}`
            : `${Taro.pxTransform(88)}`,
          background,
          boxShadow,
          borderRadius: borderRadius
            ? `${Taro.pxTransform(borderRadius[0])} ${Taro.pxTransform(
              borderRadius[1]
            )} ${Taro.pxTransform(borderRadius[2])} ${Taro.pxTransform(
              borderRadius[3]
            )}`
            : 0,
          margin: margin
            ? `${Taro.pxTransform(margin[0])} ${Taro.pxTransform(
              margin[1]
            )} ${Taro.pxTransform(margin[2])} ${Taro.pxTransform(margin[3])}`
            : 0,
          color,
          border,
          fontWeight,
          fontFamily,
          position,
          display
        }}
        onClick={this.onClick}
      >
        {isShowDeacIcon === true && descIcon && (
          <Text
            className='desc-icon'
            style={{
              backgroundImage: `url(${descIcon})`
            }}
          />
        )}
        <Text className='desc'>{desc}</Text>
        {desc && <Text className='split' />}
        {textDirection && textDirection === 1 ? ( // 等于1时文字是竖向排版
          <View
            className='verticalName'
            style={{
              fontWeight,
              paddingLeft: `${Taro.pxTransform(paddingLeft)}`,
              fontSize: `${Taro.pxTransform(fontSize)}`
            }}
          >
            {name}
          </View>
        ) : (
          <Text
            className='name'
            style={{
              fontWeight,
              paddingLeft: `${Taro.pxTransform(paddingLeft)}`,
              fontSize: `${Taro.pxTransform(fontSize)}`
            }}
          >
            {name}
          </Text>
        )}
        {fontIcon && (
          <Text
            className='font-icon'
            style={{
              color,
              transform
            }}
          />
        )}
      </View>
    )
  }
}

