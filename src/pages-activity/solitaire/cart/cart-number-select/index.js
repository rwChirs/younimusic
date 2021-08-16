import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class FreshCartNumberSelect extends Component {
  constructor() {
    super(...arguments)
    if (process.env.NODE_ENV === 'test') {
      Taro.initPxTransform({ designWidth: 750 })
    }
    const { startValue } = this.props

    this.state = {
      number: startValue
    }
  }

  changeNumber(type, e) {
    e.preventDefault()
    const {
      upperLimit,
      step,
      status,
      remainNum,
      onChangeNumber,
      onPlus,
      onMinus
    } = this.props
    const { number } = this.props.startValue
    if (Number(status) === 1 || Number(status) === 5 || Number(status) === 11) {
      return
    }

    if (type === 'plus') {
      let bigNum = 0
      if (upperLimit > remainNum) {
        bigNum = remainNum
      } else {
        bigNum = upperLimit
      }
      if (number + step > bigNum) {
        Taro.showToast({
          title: '购买数量超过最大限制',
          icon: 'none'
        })
        return
      }
      this.setState(
        {
          number: number + step
        },
        () => {
          onChangeNumber(number + step)
          onPlus(number + step)
        }
      )
    }

    if (type === 'minus') {
      if (number - step < 0) {
        return
      }

      this.setState(
        {
          number: number - step
        },
        () => {
          onChangeNumber(number - step)
          onMinus(number - step)
        }
      )
    }
  }

  render() {
    const { unit, startValue, step, upperLimit, remainNum } = this.props
    const { number } = this.state

    return (
      <View className='cart-selector'>
        <Text
          className='num-selector-less'
          onClick={this.changeNumber.bind(this, 'minus')}
        />
        <Text className='num-selector-num'>
          {startValue}
          {unit || ''}
        </Text>
        <Text
          className={`num-selector-plus ${
            number + step > upperLimit || number + step > remainNum
              ? 'disabled'
              : ''
          }`}
          onClick={this.changeNumber.bind(this, 'plus')}
        />
      </View>
    )
  }
}

FreshCartNumberSelect.defaultProps = {
  step: 1,
  startValue: 1,
  upperLimit: 10000,
  status: 2,
  remainNum: 10000,
  onPlus: () => {},
  onMinus: () => {},
  onChangeNumber: () => {},
  unit: ''
}

FreshCartNumberSelect.propTypes = {
  startValue: PropTypes.number,
  upperLimit: PropTypes.number,
  step: PropTypes.number,
  status: PropTypes.number,
  remainNum: PropTypes.number,
  onPlus: PropTypes.func,
  onMinus: PropTypes.func,
  onChangeNumber: PropTypes.func,
  unit: PropTypes.string
}
