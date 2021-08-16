import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import FreshProductButton from '../../../../components/product-button'
import { filterImg } from '../../../../utils/common/utils'
import FreshServiceNumSelector from '../service-number-selector'
import './index.scss'

export default class FreshSolitaireAddCart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      serviceTagId: 0,
      startBuyUnitNum:
        props.data && props.data.skuInfo && props.data.skuInfo.startBuyUnitNum
          ? props.data.skuInfo.startBuyUnitNum
          : 1
    }
  }

  onClick() {
    this.props.onClick()
  }

  onClose() {
    this.props.onClose()
  }

  /**
   * 切换加工服务
   */
  changeService = params => {
    this.setState({
      serviceTagId: params.serviceTagId
    })
  }

  /**
   * 加车
   */
  addCart = () => {
    this.props.onClick({
      ...this.props.data.skuInfo,
      startBuyUnitNum: this.state.startBuyUnitNum,
      serviceTagId: this.state.serviceTagId
    })
  }

  onChangeNumber = startBuyUnitNum => {
    const data = this.props.data
    this.setState(
      {
        startBuyUnitNum
      },
      () => {
        if (
          data &&
          data.skuInfo &&
          startBuyUnitNum >
            data.skuInfo.maxBuyUnitNum - data.skuInfo.stepBuyUnitNum
        ) {
          Taro.showToast({
            title: '超过最大可购买数量',
            icon: 'none'
          })
        }
      }
    )
  }

  render() {
    const { data } = this.props
    const { serviceTagId } = this.state
    const productDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/10366/26/8278/700/5c3455c6E7713217b/bf369c461fca9fd9.png'
    return (
      <View>
        {data && data.skuInfoWeb && (
          <View className='solitaire-add-cart'>
            <View className='brayBg' onTouchStart={this.onClose.bind(this)} />
            <View className='promotion-add-cart'>
              <View className='info'>
                <Image
                  className='img'
                  src={filterImg(
                    data && data.skuInfoWeb.imageUrl
                      ? data.skuInfoWeb.imageUrl
                      : productDefaultPicture
                  )}
                  mode='aspectFit'
                  lazyLoad
                />
                <View className='con'>
                  <View className='title'>{data.skuInfoWeb.skuName}</View>
                  <View className='price-info'>
                    <Text className='jd-price'>
                      接龙价：￥{data.skuInfoWeb.jdPrice}
                    </Text>
                    <Text className='mk-price'>
                      原价：￥{data.skuInfoWeb.marketPrice}
                    </Text>
                  </View>
                </View>
                <Text className='close' onClick={this.onClose.bind(this)} />
              </View>
              {data &&
                data.skuInfoWeb &&
                data.skuInfoWeb.serviceTags &&
                data.skuInfoWeb.serviceTags.length > 0 && (
                <View className='add-cart-service'>
                  <View className='add-cart-service-title'>加工</View>
                  <View className='add-cart-service-list'>
                    {data.skuInfoWeb.serviceTags.map(info => (
                      <View
                        servicetagid='0'
                        key={info.serviceTagId}
                        className={
                          serviceTagId === info.serviceTagId ? 'em cur' : 'em'
                        }
                        onClick={this.changeService.bind(this, info)}
                      >
                        {info.servicetagName}
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {!data.isNumHide && (
                <View className='add-cart-num'>
                  <View className='add-cart-num-title'>数量</View>
                  {data && data.skuInfoWeb && data.skuInfoWeb.startBuyUnitNum && (
                    <View className='operate-cart'>
                      {data.skuInfoWeb.startBuyUnitNum > 1 && (
                        <Text className='operate-cart-em'>
                          {data.skuInfoWeb.startBuyUnitNum}
                          {data.skuInfoWeb.weightSku
                            ? data.skuInfoWeb.weightUnit
                            : '件'}
                          起购
                        </Text>
                      )}
                      <View className='num'>
                        <FreshServiceNumSelector
                          status
                          number={Number(data.skuInfoWeb.startBuyUnitNum)}
                          step={Number(data.skuInfoWeb.stepBuyUnitNum)}
                          upperLimit={Number(
                            data &&
                              data.skuInfoWeb &&
                              data.skuInfoWeb.maxBuyUnitNum
                          )}
                          startValue={Number(data.skuInfoWeb.startBuyUnitNum)}
                          onChangeNumber={this.onChangeNumber.bind(this)}
                          remainNum={Number(
                            data &&
                              data.skuInfoWeb &&
                              data.skuInfoWeb.maxBuyUnitNum
                          )}
                          unit={data.skuInfoWeb.weightUnit}
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
              <View className='add-cart-btn'>
                <FreshProductButton
                  width='100%'
                  height={82}
                  name={data.btnText ? data.btnText : '加入购物车'}
                  desc=''
                  color={data.color ? data.color : 'rgb(121, 47, 37)'}
                  background={
                    data.background
                      ? data.background
                      : 'linear-gradient(to right, rgb(255, 220, 124), rgb(255, 183, 102))'
                  }
                  boxShadow=''
                  borderRadius={['46rpx', '46rpx', '46rpx', '46rpx']}
                  fontSize={30}
                  disabled={false}
                  onClick={this.addCart}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
FreshSolitaireAddCart.defaultProps = {
  data: {}
}
FreshSolitaireAddCart.propTypes = {
  data: PropTypes.object
}
