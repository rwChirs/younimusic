import Taro from '@tarojs/taro'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text } from '@tarojs/components'
import FreshSolitaireHeaderImgs from '../solitaire-header-images'
import FreshSolitaireCurrentProduct from '../solitaire-current-product'
import { filterImg } from '../../../../utils/common/utils'
import './index.scss'
const defaultHeaderImage =
  'https://m.360buyimg.com/img/jfs/t1/35289/25/5188/1823/5cbeaa0fE6180696f/279a35c50de38bcb.png'
const userDefaultPicture =
  'https://m.360buyimg.com/img/jfs/t1/10065/34/12931/8777/5c7cbf75Eddd77610/7ec4236bc8f4b67a.png'
const solitaireUserDefaultPicture =
  'https://m.360buyimg.com/img/jfs/t10939/102/2899523522/2218/fc33dbce/5cdbabe9Nd6d9f5ad.png'
const dotPicture =
  'https://m.360buyimg.com/img/jfs/t1/79995/21/1179/1038/5cf5deb8Ed21ef714/46d0d4741e7433dc.png'

export default class FreshSolitaireProductItem extends Component {
  onClick = () => {
    this.props.onClick()
  }

  onAddCart = (info, e) => {
    e.stopPropagation()
    this.props.onAddCart(info)
  }

  validImgUrl = url => {
    const imgReg = /^(http:|https:)?\/\//i
    if (url && imgReg.test(url)) {
      return url
    }
    return ''
  }

  render() {
    const { skuDetail, teamName, canLeader } = this.props
    const detailLeftIcon =
      '//m.360buyimg.com/img/jfs/t1/17897/1/4604/1111/5c332235Ee374a1b0/0d94a100af2b79f8.png'
    const dot = canLeader ? dotPicture : detailLeftIcon
    const icon =
      skuDetail && skuDetail.commanderInfo && skuDetail.commanderInfo.icon
        ? skuDetail.commanderInfo.icon
        : solitaireUserDefaultPicture
    return (
      <View
        className='solitaireProductItemContent'
        onClick={this.onClick.bind(this)}
      >
        {skuDetail && skuDetail.commanderInfo && (
          <View className='solitaireProductItem'>
            <View className='solitaireProductItemHeader'>
              <View className='commanderHeaderContent'>
                <Image
                  className='commanderHeaderImg'
                  src={filterImg(icon, 'solitaire')}
                  mode='aspectFit'
                  lazyLoad
                />
              </View>
              <Text className='commanderTitle'>
                {teamName || skuDetail.commanderInfo.pin}
                {skuDetail.commanderInfo.oneWord ? ':' : ''}
              </Text>
              <Text className='commandereRcommend'>
                {skuDetail.commanderInfo.oneWord
                  ? skuDetail.commanderInfo.oneWord
                  : ''}
              </Text>
            </View>
            {/* 头像群   接龙件数 */}
            {skuDetail && skuDetail.skuSalesInfo && skuDetail.joinImgUrls && (
              <View className='curSolitaireInfo'>
                <FreshSolitaireHeaderImgs
                  list={skuDetail.joinImgUrls}
                  defaultHeaderImage={defaultHeaderImage}
                  userDefaultPicture={userDefaultPicture}
                  background='#f6f6f6'
                />
                <Text className='solitaireInfoCount'>
                  接龙{skuDetail.skuSalesInfo.historyCount}
                  {skuDetail.skuSalesInfo.salesDesc}
                </Text>
              </View>
            )}
            <View className='solitaireRecommendation'>
              <Image
                className='solitaireRecommendationImg'
                src={this.validImgUrl(dot)}
                mode='aspectFit'
                lazyLoad
              />
              {skuDetail &&
                skuDetail.commanderInfo &&
                skuDetail.commanderInfo.recommendation && (
                <Text
                  className='solitaireRecommendationInfo'
                  style={
                    canLeader
                      ? 'color:rgb(137,137,137)'
                      : 'color:rgb(186, 77, 44)'
                  }
                >
                  {skuDetail &&
                      skuDetail.commanderInfo &&
                      skuDetail.commanderInfo.recommendation}
                </Text>
              )}
            </View>
            <View className='solitaireProductInfo'>
              <FreshSolitaireCurrentProduct
                skuDetail={skuDetail}
                canLeader={canLeader}
                onClick={this.onClick.bind(this)}
                onAddCart={this.onAddCart.bind(this)}
              />
            </View>
          </View>
        )}
      </View>
    )
  }
}
FreshSolitaireProductItem.defaultProps = {
  skuDetail: {}
}

FreshSolitaireProductItem.propTypes = {
  skuDetail: PropTypes.object
}
