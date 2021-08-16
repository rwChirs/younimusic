import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { filterImg } from '../../../../utils/common/utils'
import './index.scss'

export default class FreshSolitaireHeaderImgs extends Component {
  render() {
    const { list } = this.props
    return (
      <View className='solitaireHeaderImgs'>
        {list &&
          list.map((info, index) => {
            return (
              <View style={{ zIndex: 10 - index }} key={`${index}`}>
                <Image
                  className='solitaireImg'
                  src={filterImg(info, 'solitaire')}
                  style={{ zIndex: 10 - index }}
                  mode='aspectFit'
                  lazyLoad
                />
              </View>
            )
          })}
      </View>
    )
  }
}
FreshSolitaireHeaderImgs.defaultProps = {
  list: []
}

FreshSolitaireHeaderImgs.propTypes = {
  list: PropTypes.array
}
