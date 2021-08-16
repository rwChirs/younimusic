import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { Component } from 'react'
import './index.scss'

export default class FreshSeatTitle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img1:
        'https://m.360buyimg.com/img/jfs/t1/18123/37/4705/2019/5c3497b0E0cf99e5b/025f3241b0be767e.png',
      img2:
        'https://m.360buyimg.com/img/jfs/t1/8194/31/12416/1759/5c349845Eff5a54cc/2f6a4d5054ff9e9b.png'
    }
  }

  render() {
    const { title, isHaveFlower, subtitle, split } = this.props
    return (
      <View className='seat-title'>
        <View className='title-box'>
          <View className={split ? 'litter-linear1' : 'linear1'} />
          {isHaveFlower && (
            <Image
              className='imageLeft'
              src={this.state.img1}
              style={{ marginLeft: split ? 0 : `${Taro.pxTransform(32)}` }}
            />
          )}
          <View className='title'>{title}</View>
          {isHaveFlower && (
            <Image
              className='imageRight'
              src={this.state.img2}
              style={{ marginRight: split ? 0 : `${Taro.pxTransform(32)}` }}
            />
          )}
          <View className={split ? 'litter-linear2' : 'linear2'} />
        </View>
        {subtitle && <View className='subtitle'>{subtitle}</View>}
      </View>
    )
  }
}
FreshSeatTitle.defaultProps = {
  title: '',
  isHaveFlower: true,
  subtitle: '',
  split: true
}

FreshSeatTitle.propTypes = {
  title: PropTypes.string,
  isHaveFlower: PropTypes.bool,
  subtitle: PropTypes.string,
  split: PropTypes.bool
}
