import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { Component } from 'react'
import './index.scss'

export default class FreshSolitaireTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onClick = () => {
    this.props.onClick()
  }

  render() {
    const { title, list } = this.props
    const picture =
      'https://m.360buyimg.com/img/jfs/t1/31868/30/14537/1777/5cbec5a1E0748de4c/91a0cb7aebb8c5e4.png'
    const nextPicture =
      'https://m.360buyimg.com/img/jfs/t1/34361/27/5537/5141/5cbff5e7Ee33d8997/f23cd1027c9750d3.png'
    return (
      <View className='solitaire-team'>
        <View className='title' onClick={this.onClick.bind(this)}>
          <Text className='name'>{title}</Text>
          <Image className='dotted' src={picture} mode='aspectFit' lazyLoad />
        </View>
        <View className='step'>
          {list &&
            list.map((info, index) => {
              return (
                <View className='step-number' key={index}>
                  <Text>
                    {index + 1} . {info}
                  </Text>
                  {index !== list.length - 1 && (
                    <Image
                      className='next'
                      src={nextPicture}
                      mode='aspectFit'
                      lazyLoad
                    />
                  )}
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}
FreshSolitaireTeam.defaultProps = {
  title: '',
  list: []
}

FreshSolitaireTeam.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.array
}
