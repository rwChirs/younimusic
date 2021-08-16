import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import FreshProductButton from '../../../../components/product-button'
import FreshSolitaireMoney from '../solitaire-make-money'
import { filterImg } from '../../../../utils/common/utils'
import './index.scss'

export default class FreshSolitaireCurrentProduct extends Component {
  onClick = () => {
    this.props.onClick()
  }

  onAddCart = (info, e) => {
    e.stopPropagation()
    this.props.onAddCart(info)
  }

  render() {
    const { skuDetail, canLeader } = this.props
    const { skuInfo, commissionInfo } = skuDetail
    return (
      <View className='solitaireCurProduct'>
        <View className='solitaireCurProductImgBorder'>
          <Image
            className='solitaireCurProductImg'
            src={filterImg(skuInfo && skuInfo.imageUrl, 'solitaire')}
            mode='aspectFit'
            lazyLoad
          />
          {skuInfo && skuInfo.storeProp && (
            <View
              className='product-warm-tag'
              style={{
                background: `url(${filterImg(skuInfo.storeProp)}) no-repeat`,
                backgroundSize: '100% 100%'
              }}
            />
          )}
          {/* 已售罄 */}
          {skuInfo.statusDesc && skuInfo.status !== 2 && (
            <View className='solitaireCurProductImgCover'>
              <View className='solitaireCurProductStatus'>
                <Text className='line1' />
                <Text className='txt'>{skuInfo.statusDesc}</Text>
                <Text className='line2' />
              </View>
            </View>
          )}
        </View>
        <View
          className={`solitaireCurProductInfo ${canLeader ? 'tuanzhang' : ''}`}
        >
          <Text className='productTitle'>{skuInfo.skuName}</Text>
          {skuInfo.skuPropertyWebList &&
            skuInfo.skuPropertyWebList.map((info, index) => (
              <Text className='productDescription' key={index}>
                {info.key ? info.key : '无'} : {info.value ? info.value : '无'}
              </Text>
            ))}
          {canLeader ? (
            <View className='solitaire-share-price'>
             <FreshSolitaireMoney
                commissionText={
                  commissionInfo && commissionInfo.commissionText
                    ? commissionInfo.commissionText
                    : '约赚'
                }
                commission={
                  commissionInfo && commissionInfo.commission
                    ? `${commissionInfo.commission}`
                    : '0.0'
                }
              />
            </View>
          ) : (
            <Text className='linePrice'>￥{skuInfo.marketPrice}</Text>
          )}
          <View className='solitairePriceInfo'>
            <Text
              className='solitairePrice'
              style={
                canLeader ? 'color:rgb(15,21,53' : 'color:rgb(223, 71, 76)'
              }
            >
              ￥{skuInfo.jdPrice}
            </Text>
            <Text className='unit'>{skuInfo.buyUnit}</Text>
            <View className='followBtn'>
              {/* 接龙活动状态  0:进行中 1：未开始 2：已结束 */}
              {/* 接龙商品状态 2已上架 */}
              {canLeader ? (
                <FreshProductButton
                  name={skuInfo.status === 2 ? '分享赚' : skuInfo.statusDesc}
                  background={
                    skuInfo.status === 2
                      ? 'linear-gradient(to right, rgb(255, 220, 124), rgb(255, 183, 102))'
                      : 'rgb(216, 216, 216)'
                  }
                  color={
                    skuInfo.status === 2 ? '#7B3F2E' : 'rgba(63, 67, 77,0.5)'
                  }
                  borderRadius={[40, 0, 40, 40]}
                  width='160'
                  height={60}
                  fontWeight='normal'
                  fontFamily='PingFangSC-Medium'
                  fontSize={30}
                  disabled={skuInfo.status !== 2}
                  onClick={this.onClick.bind(this)}
                />
              ) : (
                <View
                  className='product-item-btn'
                  onClick={this.onAddCart.bind(this, skuDetail)}
                >
                  <View
                    className={`product-item-btn-bg ${
                      skuInfo.status === 2 ? '' : 'disabled'
                    }`}
                  />
                </View>
              )}
            </View>
          </View>
          {canLeader && (
            <View className='original-price'>￥{skuInfo.marketPrice}</View>
          )}
        </View>
      </View>
    )
  }
}

FreshSolitaireCurrentProduct.defaultProps = {
  skuDetail: {},
  canLeader: false,
  commissionInfo: {}
}

FreshSolitaireCurrentProduct.propTypes = {
  skuDetail: PropTypes.object,
  canLeader: PropTypes.bool,
  commissionInfo: PropTypes.object
}
