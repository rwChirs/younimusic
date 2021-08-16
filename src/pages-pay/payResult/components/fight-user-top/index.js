import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
// import FreshComponent from '../../common/component'
import './index.scss'

export default class FreshFightUserTop extends Component {
  render() {
    const { list, type, resource } = this.props
    const fightMember = type && type > 0 ? type : 0
    const defaultList = []
    if (fightMember > 0) {
      for (let i = 0; i < fightMember; i++) {
        defaultList.push(i)
      }
    }
    const userDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/10065/34/12931/8777/5c7cbf75Eddd77610/7ec4236bc8f4b67a.png'
    const noneDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/125145/13/8634/5895/5f28bcb7E426b0ff4/85cfeb5679c94a89.png'
    return (
      <View
        className={
          list && list.length + fightMember > 4
            ? 'user-top-page'
            : 'user-top-page user-top-center'
        }
        style={{ marginBottom: type === 4 || type === 5 ? '16px' : 0 }}
      >
        {type > 0 && resource !== 'result' && (
          <View
            className='user-tip'
            style={{
              top:
                (list && list.length > 1) ||
                (list && list.length > 0 && fightMember > 1)
                  ? '-56rpx'
                  : '20rpx'
            }}
          >
            快上车，一起拼
          </View>
        )}
        {list &&
          list.length > 0 &&
          list.map((info, index) => (
            <View className='user-top' key={`${index}`}>
              <Image
                src={info.avatar ? info.avatar : userDefaultPicture}
                className='img'
              />
              <Text
                className='name'
                style={{
                  background:
                    info.memberType === 1
                      ? 'linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))'
                      : 'linear-gradient(to right, rgb(251,148,71), rgb(245,177,53))'
                }}
              >
                {info.memberType === 1 ? '团长' : '沙发'}
              </Text>
            </View>
          ))}
        {defaultList.length > 0 &&
          defaultList.map((item, k) => (
            <View className='user-top' key={`${k}`}>
              <Image src={noneDefaultPicture} className='img' />
            </View>
          ))}
      </View>
    )
  }
}

FreshFightUserTop.defaultProps = {
  list: [],
  type: 0,
  resource: ''
}

FreshFightUserTop.propTypes = {
  list: PropTypes.array,
  type: PropTypes.number,
  resource: PropTypes.string
}
