import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { filterImg } from '../../../../utils/common/utils'
import FreshCartNumberSelect from '../cart-number-select'
import './index.scss'

export default class FreshCartGoodsList extends Component {
  constructor() {
    super(...arguments)
    if (process.env.NODE_ENV === 'test') {
      Taro.initPxTransform({ designWidth: 750 })
    }
    this.state = {
      startBuyUnitNum: 1
    }
  }

  // 去凑单
  onOther() {
    this.props.onOther()
  }

  // 找相似
  onFindSimilar() {
    this.props.onFindSimilar()
  }

  // 进入详情页
  onGoDetail(info) {
    this.props.onGoDetail(info)
  }

  // 单选
  onChoose(info, index) {
    const { wareInfos } = this.state.data
    if (wareInfos && wareInfos[index].check !== 1) {
      wareInfos[index].check = 1
    } else {
      wareInfos[index].check = 0
    }
    this.setState({
      data: {
        ...this.state.data,
        wareInfos
      }
    })
    this.props.onChoose(info, index)
  }

  // 点击问号弹层
  onQuestion(toast, e) {
    e.stopPropagation()
    this.props.onQuestion(toast)
  }

  onTip() {
    this.props.onTip()
  }

  // 加
  onPlus(info) {
    this.props.onPlus(info)
  }

  // 减
  onMinus(info) {
    this.props.onMinus(info)
  }

  onChangeNumber(val, startBuyUnitNum) {
    this.setState(
      {
        startBuyUnitNum
      },
      () => {
        if (startBuyUnitNum > val.maxBuyUnitNum - val.stepBuyUnitNum) {
          Taro.showToast({
            title: '超过最大可购买数量',
            icon: 'none'
          })
        }
        this.props.onChangeNumber(startBuyUnitNum, val)
      }
    )
  }

  render() {
    const { isHasBorder, type, data } = this.props
    const showTexts = data.showTexts ? 'promotion' : ''
    const cn = data.addMoneySkuInfo
      ? 'addMoneySkuInfo-jiajiagou-order'
      : showTexts
    const ic = isHasBorder ? 'invalid-cont' : ''
    return (
      <View
        className={`filter-item ${cn} ${ic}`}
        style={{
          boxShadow: isHasBorder ? 'none' : '0 30px 70px rgba(0, 0, 0, 0.03)'
        }}
      >
        {data.showTexts && (
          <View className='top-part'>
            <View className='explain'>
              <View className='explain-left'>
                {data.showTexts[0] && (
                  <View className='promotion-icon'>
                    {data.showTexts[0].showTag}
                  </View>
                )}
                {data.showTexts[0] && (
                  <View className='promotion-txt'>
                    {data.showTexts[0].showMsg}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        {data.fullPromoResultInfo &&
          data.fullPromoResultInfo.giftInfos &&
          data.fullPromoResultInfo.giftInfos.length > 0 &&
          data.promotionSubType !== 304 &&
          data.promotionSubType !== 305 &&
          data.promotionSubType !== 1001 &&
          data.fullPromoResultInfo.giftInfos.map((value, index) => {
            return (
              <View
                className='zengpin-list'
                key={`zeng-pin-${index}`}
                style={{ paddingLeft: 0 }}
              >
                <View
                  className='zengpin-detail-part'
                  onClick={this.onGoDetail.bind(this, value)}
                >
                  <View className='zengpin-detail'>
                    {/* 赠品图 */}
                    <View className='zengpin-img'>
                      <Image
                        className='zp-image'
                        src={filterImg(value.imageUrl)}
                        mode='aspectFit'
                      />
                    </View>
                    {/* 赠品信息 */}
                    <View className='zengpin-info' onClick={this.onDetail}>
                      <View className='zengpin-name'>
                        <View className='promotion-info-flag'>赠品</View>
                        <View className='promotion-goods-name-txt'>
                          {value.skuName}
                        </View>
                      </View>

                      <View className='zengpin-specification'>
                        {value.saleSpecDesc && (
                          <View>
                            <Text>规格:</Text>
                            <Text>{value.saleSpecDesc}</Text>
                          </View>
                        )}
                        <View className='zengpin-num'>
                          <Text>数量:</Text>
                          <Text>{value.buyNum}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        {data.wareInfos &&
          data.wareInfos.length > 0 &&
          data.wareInfos.map((val, i) => {
            return (
              <View className='cart-items' key={'cart' - i}>
                <View className='bottom-part'>
                  {Number(val.status) !== 1 &&
                    Number(val.status) !== 5 &&
                    Number(val.status) !== 11 && (
                    <View
                      className='left-part'
                      onClick={this.onChoose.bind(this, val, i)}
                    >
                      <View className='label'>
                        <Text
                          className={`check ${
                            val.check === 1 ? 'checked' : ''
                          } `}
                        />
                      </View>
                    </View>
                  )}
                  {(Number(val.status) === 1 ||
                    Number(val.status) === 5 ||
                    Number(val.status) === 11) && (
                    <View className='left-part-icon'>
                      {Number(val.status) === 1 && <Text>下架</Text>}
                      {Number(val.status) === 5 && <Text>无货</Text>}
                      {Number(val.status) === 11 && <Text>限购</Text>}
                    </View>
                  )}
                  <View className='right-part'>
                    <View className='items-info'>
                      {/* 图片 */}
                      <View
                        className={`items-img ${
                          Number(val.status) === 1 ||
                          Number(val.status) === 5 ||
                          Number(val.status) === 11
                            ? 'opacity-img'
                            : ''
                        } `}
                        onClick={this.onGoDetail.bind(this, val)}
                      >
                        {Number(val.status) === 11 && (
                          <Text className='purchase-flag'>限购</Text>
                        )}
                        <Image
                          className='image'
                          src={filterImg(val.imageUrl)}
                          mode='aspectFit'
                        />
                        {Number(val.status) === 1 && (
                          <View className='sold-out-icon sold-out'>下架</View>
                        )}
                        {Number(val.status) === 5 && val.preSale && (
                          <View className='pre-sale-icon'></View>
                        )}
                        {/* {Number(val.status) === 11 && (
                          <View className='sold-out-icon sold-out'>限购</View>
                        )} */}
                        {Number(val.status) === 5 && (
                          <View className='disable-icon no-stock'>
                            今日售完
                          </View>
                        )}
                      </View>
                      {/* 详情 */}
                      <View className='items-detail'>
                        <View
                          className='items-detail-top'
                          onClick={this.onGoDetail.bind(this, val)}
                        >
                          {/* 商品名 */}
                          <View className='goods-name'>
                            <Text
                              className={
                                Number(val.status) === 1 ||
                                Number(val.status) === 5 ||
                                Number(val.status) === 11
                                  ? 'disabled'
                                  : ''
                              }
                            >
                              {val.skuName || ''}
                            </Text>
                          </View>
                          <View className='goods-specification'>
                            {val.saleSpecDesc && (
                              <View className='goods-s-d'>
                                <Text
                                  className={
                                    Number(val.status) === 1 ||
                                    Number(val.status) === 5 ||
                                    Number(val.status) === 11
                                      ? 'disabled'
                                      : ''
                                  }
                                >
                                  规格:
                                  {val.saleSpecDesc}
                                </Text>
                                {val.salemode === 2 && (
                                  <Text
                                    className='icon-question'
                                    onClick={this.onQuestion.bind(
                                      this,
                                      val && val.toasts
                                    )}
                                  />
                                )}
                              </View>
                            )}

                            {val.serviceTag && (
                              <View className='goods-jg'>
                                <Text>加工:</Text>
                                <Text className='em'>{val.serviceTag}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View className='item-opera'>
                          <View
                            className={`items-detail-midden ${
                              val.weightSku ? 'weightSku' : ''
                            }`}
                            onClick={this.onGoDetail.bind(this, val)}
                          >
                            {val.jdBuyInfo && (
                              <View className='promotion-flag'>
                                <Text className='overnight-delivery'>
                                  {val.jdBuyInfo}
                                </Text>
                              </View>
                            )}
                            {val.fullSpeed && (
                              <View className='promotion-flag'>
                                <Text className='overnight-delivery'>
                                  {val.fullSpeed}
                                </Text>
                              </View>
                            )}
                            {val.marketPrice && (
                              <View className='original-price'>
                                <Text>¥{val.marketPrice}</Text>
                              </View>
                            )}
                            <View className='grey'>
                              <Text
                                className={`${
                                  Number(val.status) === 1 ||
                                  Number(val.status) === 5 ||
                                  Number(val.status) === 11
                                    ? 'red disabled'
                                    : 'red'
                                } `}
                              >
                                ¥{val.jdPrice || ''}
                              </Text>

                              {val.buyUnit && (
                                <Text
                                  className={`${
                                    Number(val.status) === 1 ||
                                    Number(val.status) === 5 ||
                                    Number(val.status) === 11
                                      ? 'disabled'
                                      : ''
                                  } `}
                                >
                                  /{val.buyUnit}
                                </Text>
                              )}
                            </View>
                          </View>
                          {Number(val.status) !== 1 &&
                            Number(val.status) !== 5 &&
                            Number(val.status) !== 11 && (
                            <FreshCartNumberSelect
                              startValue={Number(val.buyNum)}
                              unit={
                                val.buyUnitInCart ? val.buyUnitInCart : ''
                              }
                              step={Number(val.stepBuyUnitNum)}
                              status={Number(val.status)}
                              upperLimit={Number(val.maxBuyUnitNum)}
                              onChangeNumber={this.onChangeNumber.bind(
                                this,
                                val
                              )}
                              onPlus={this.onPlus.bind(this, val)}
                              onMinus={this.onMinus.bind(this, val)}
                              remainNum={Number(val.maxBuyUnitNum)}
                            />
                          )}
                        </View>

                        {(val.weightSku ||
                          (val.tips && val.tips.length > 0)) && (
                          <View className='items-detail-bottom'>
                            {Number(val.status) !== 1 && (
                              <View
                                className={`notes-price ${
                                  Number(val.status) === 5 ||
                                  Number(val.status) === 11
                                    ? 'disabled'
                                    : ''
                                } `}
                              >
                                <Text>小计:</Text>
                                <Text className='em'>¥{val.totalPrice}</Text>
                              </View>
                            )}
                            {val.tips && val.tips.length > 0 && (
                              <View
                                className='limit-count'
                                tips={val.tips[1] ? val.tips[1] : ''}
                              >
                                {val.tips[0]}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                {data.groupType === 3 && (
                  <View className='suit-detail-btn'>
                    <Text>{data.groupText}</Text>
                    <Text className='suit-detail-flag' />
                  </View>
                )}
                {/* 赠品 */}
                {val.wareGiftInfos && val.wareGiftInfos.length > 0 && (
                  <View className='zengpin-list' style='padding:10px 0 0'>
                    {val.wareGiftInfos.map((value, index) => {
                      return (
                        <View
                          className={`zengpin-detail-part ${
                            value.status === 1 ||
                            value.status === 5 ||
                            value.status === 11
                              ? 'invalid'
                              : ''
                          }`}
                          key={'zeng-pin' - index}
                          onClick={this.onGoDetail.bind(this, value)}
                        >
                          <View className='zengpin-img'>
                            {value.status === 1 &&
                              value.status === 5 &&
                              value.status === 11 && (
                              <View className='disable-icon no-stock'>
                                  今日售完
                              </View>
                            )}
                            <Image
                              className='zp-image'
                              src={filterImg(value.imageUrl)}
                              mode='aspectFit'
                            />
                          </View>
                          <View
                            className={`zengpin-info ${
                              data.promotionSubType !== 304 &&
                              data.promotionSubType !== 305 &&
                              data.promotionSubType !== 1001
                                ? 'jiajiagou-zengpin'
                                : ''
                            }`}
                          >
                            <View className='jjg-zengpin-name'>
                              {data.groupType !== 3 && (
                                <View className='promotion-info-flag'>
                                  赠品
                                </View>
                              )}
                              <View className='promotion-goods-name-txt'>
                                {value.skuName}
                              </View>
                            </View>
                            <View className='zengpin-specification'>
                              {value.saleSpecDesc && (
                                <View>
                                  <Text className='text'>规格:</Text>
                                  <Text className='em'>
                                    {value.saleSpecDesc}
                                  </Text>
                                </View>
                              )}
                              <View className='zengpin-num'>
                                <Text className='text'>数量:</Text>
                                <Text className='text'>{value.buyNum}</Text>
                              </View>
                            </View>
                            {data.promotionSubType === 304 ||
                              data.promotionSubType === 305 ||
                              (data.promotionSubType === 1001 && (
                                <View
                                  className='del-jiajiagou'
                                  style={{ display: 'none' }}
                                  clstag='7FRESH_APP_search_201712264|73'
                                >
                                  删除
                                </View>
                              ))}
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            )
          })}

        {/* 失效商品 */}
        {type === 'invalid' && (
          <View className='cart-items' onClick={this.onTip.bind(this)}>
            <View className='bottom-part'>
              {isHasBorder ? (
                <View className='left-part-icon'>
                  {Number(data.status) === 1 && <Text>下架</Text>}
                  {Number(data.status) === 5 && <Text>今日售完</Text>}
                  {Number(data.status) === 11 && <Text>限购</Text>}
                </View>
              ) : (
                <View className='left-part-icon'>
                  <Text
                    style={{
                      border: isHasBorder
                        ? '1px solid rgba(137, 137, 137, 0.6)'
                        : 'none'
                    }}
                  >
                    失效{' '}
                  </Text>
                </View>
              )}

              <View className='right-part'>
                <View className='items-info'>
                  <View className='items-img opacity-img'>
                    <Image
                      className='image'
                      src={filterImg(data.imageUrl)}
                      mode='aspectFit'
                    />
                  </View>
                  <View className='items-detail'>
                    <View className='items-detail-top'>
                      <View className='goods-name'>
                        <Text className='disabled'>{data.skuName || ''}</Text>
                      </View>
                      <View className='goods-specification'>
                        {data.saleSpecDesc && (
                          <View className='goods-s-d'>
                            <Text
                              className={
                                Number(data.status) === 1 ||
                                Number(data.status) === 5 ||
                                Number(data.status) === 11
                                  ? 'disabled'
                                  : ''
                              }
                            >
                              规格:
                              {data.saleSpecDesc}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

FreshCartGoodsList.defaultProps = {
  data: {},
  onGoDetail: () => {},
  onChoose: () => {},
  onPlus: () => {},
  onMinus: () => {},
  onQuestion: () => {},
  onFindSimilar: () => {},
  onOther: () => {},
  onTip: () => {}
}

FreshCartGoodsList.propTypes = {
  data: PropTypes.object
}
