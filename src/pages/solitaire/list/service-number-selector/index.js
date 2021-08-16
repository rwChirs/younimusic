import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class FreshServiceNumSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: this.props.startValue
    }
  }

  changeNumber(type) {
    const { startValue, upperLimit, step, status } = this.props
    if (!status) {
      return
    }

    if (type === 'plus') {
      if (this.state.number + step > upperLimit) {
        return
      }
      this.setState(
        {
          number: this.state.number + step
        },
        () => {
          this.props.onChangeNumber(this.state.number)
          if (this.state.number > this.props.remainNum) {
            Taro.showToast({
              title: '购买数量超过最大可接龙数量',
              icon: 'none',
              duration: 2000
            })
          }
        }
      )
    }

    if (type === 'minus') {
      if (this.state.number - step < startValue) {
        return
      }
      this.setState(
        {
          number: this.state.number - step
        },
        () => {
          this.props.onChangeNumber(this.state.number)
        }
      )
    }
  }

  render() {
    const { startValue, upperLimit, unit } = this.props
    return (
      <View className='num-selector'>
        <Text
          className={
            this.state.number <= startValue
              ? 'num-selector-less-disabled num-selector-less'
              : 'num-selector-less'
          }
          onClick={this.changeNumber.bind(this, 'minus')}
        />
        <Text className='num-selector-num'>
          {this.state.number}
          {unit || ''}
        </Text>
        <Text
          className={
            this.state.number >= upperLimit
              ? 'num-selector-plus-disabled num-selector-plus'
              : 'num-selector-plus'
          }
          onClick={this.changeNumber.bind(this, 'plus')}
        />
      </View>
    )
  }
}
FreshServiceNumSelector.defaultProps = {
  startValue: 0,
  upperLimit: 0,
  unit: ''
}
FreshServiceNumSelector.propTypes = {
  startValue: PropTypes.number,
  upperLimit: PropTypes.number,
  unit: PropTypes.string
}
