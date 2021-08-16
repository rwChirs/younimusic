import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import { Component } from 'react'
import './index.scss'

export default class FreshModal extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      show,
      width,
      height,
      title,
      desc,
      subDesc,
      subDescStyle,
      descStyle,
      type,
      confirmTxt,
      cancelTxt,
      onConfirm,
      onCancel,
      borderRadius,
      rBtnStyle,
      lBtnStyle
    } = this.props
    return show ? (
      <View className='com-modal' style={{ zIndex: 999 }}>
        <View
          className='main'
          style={{
            minHeight: `${Taro.pxTransform(parseInt(height))}`,
            width: width
              ? `${Taro.pxTransform(parseInt(width))}`
              : `${Taro.pxTransform(parseInt(670))}`,
            borderRadius
          }}
        >
          {title && <View className='header'>{title}</View>}

          <View className='contain'>
            <View className='desc' style={descStyle}>
              {desc}
            </View>
            {subDesc && (
              <View className='subDesc' style={subDescStyle}>
                {subDesc}
              </View>
            )}
          </View>
          <View className='footer' style={{ zIndex: 2 }}>
            {type === 1 ? (
              <View className='one-btn'>
                <View onClick={onConfirm}>{confirmTxt}</View>
              </View>
            ) : (
              <View className='two-btn'>
                <View
                  className='btn-txt left-btn'
                  style={lBtnStyle}
                  onClick={onCancel}
                >
                  {cancelTxt}
                </View>
                <View
                  className='btn-txt right-btn'
                  style={rBtnStyle}
                  onClick={onConfirm}
                >
                  {confirmTxt}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    ) : null
  }
}

FreshModal.defaultProps = {
  show: false,
  width: 670,
  height: 300,
  title: '',
  desc: '',
  type: 1,
  confirmTxt: '确定',
  cancelTxt: '取消',
  onConfirm: () => {},
  onCancel: () => {}
}

FreshModal.PropTypes = {
  show: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string,
  desc: PropTypes.string,
  type: PropTypes.number,
  confirmTxt: '确定',
  cancelTxt: '取消',
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
}
