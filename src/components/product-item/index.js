import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Component } from 'react';
import FreshProductTag from '../product-tag';
import FreshAddCartBtn from '../add-cart-btn';
import FreshProductItemBtn from '../product-item-btn';
import { filterImg } from '../../utils/common/utils';
import './index.scss';

const SaleUnit = '¥';
const tagImage = {
  zhouqisong:
    '//m.360buyimg.com/img/jfs/t1/70238/2/3429/4000/5d1b0640E06292e0f/02957cfb15d703b8.png',
  yushou:
    '//m.360buyimg.com/img/jfs/t1/66797/16/3455/2961/5d1b0670E3b1b5d8d/944dd62f49f3533d.png',
  fresh:
    '//m.360buyimg.com/img/jfs/t1/108892/6/6641/8463/5e4f7e0eE8fc7642f/5c8b37ce90ca0373.png',
};

const handleType = (type) => {
  switch (type) {
    case 1:
      return 'type-one';
    case 2:
      return 'type-two';
    case 3:
      return 'type-three';
    case 3.5:
      return 'type-small';
    default:
      return 'type-three';
  }
};

export default class FreshProductItem extends Component {
  onGoDetail = (e) => {
    e.stopPropagation();
    const { data } = this.props;
    this.props.onGoDetail(data.skuId, data.storeId, data.prepayCardType);
  };

  onGoCardOrder = (e) => {
    e.stopPropagation();
    const { data } = this.props;
    this.props.onGoCardOrder(data);
  };

  onAddCart = (e) => {
    const { data } = this.props;
    this.props.onAddCart(e, data);
  };

  render() {
    const {
      type,
      addType,
      isCustomizeAddCart,
      addCartStyle,
      data,
      style,
      imgStyle,
      isShowSkuName,
      priceUnitStyle,
      isShowImgIcon,
      imgIcon,
      SaleUnitFontSize,
      priceFontWeight,
      productItemBtnStyle,
      tagListStyle,
      itemTitleStyle,
      isShowUnit,
      isShowItemAd,
      ItemAdStyle,
      isShowMarketPrice,
      adStyle,
      forHere,
      isShowCouponFlag,
      productItemDescStyle,
      // isShowDailyFresh,
      isShowPromotionTag,
      marketPriceIsOneLine,
      highLightAd,
      isFromPage,
      resourceType,
      index,
      rankIcon, // 排序icon图片
    } = this.props;
    const bankData = data && data.smartAV;
    const isShowAv =
      (type === 1 || type === 2) && (data.advertisement || data.av);
    const isShowBankData =
      (type === 1 || type === 2) &&
      bankData &&
      bankData.content &&
      bankData.content.length > 0;

    const skuLabelList =
      data &&
      data.skuLabelList &&
      data.skuLabelList !== undefined &&
      data.skuLabelList.length > 0
        ? data.skuLabelList
        : [];
    const FreshProductTagLen = type === 1 ? 2 : 1;
    const { jdBuyInfo, overWeightInfo, fullSpeed, isPeriod } = data;
    const skuLabelEnum = [
      'store-prop-tag',
      'health-tag',
      'action-tag',
      'season-tag',
      'pre-title-tag',
    ];

    return (
      data && (
        <View
          role='FreshProductItemBtn'
          className={`product-item-taro3 product-item-${handleType(type)}`}
          style={style}
          onClick={this.onGoDetail}
          onKeyPress={this.onGoDetail}
          tabIndex='0'
          // ref={this.actionRef}
        >
          {data.flagImage && (
            <View className='flagImage-container'>
              <Image
                className='flagImage'
                alt='排行榜'
                src={filterImg(data.flagImage)}
                mode='aspectFit'
                lazyLoad
              />
            </View>
          )}

          <View
            className='product-item-figture'
            style={{
              width: imgStyle ? imgStyle.width : '',
              height: imgStyle ? imgStyle.height : '',
              marginLeft: imgStyle
                ? imgStyle.marginLeft
                : `${Taro.pxTransform(20)}`,
              opacity:
                (data.status === 5 && !data.preSale) || data.status === 1
                  ? '0.6'
                  : '1',
            }}
          >
            <Image
              className='product-item-image'
              style={imgStyle}
              alt={data.skuName}
              src={filterImg(data.imageUrl)}
            />
            {/* 主图坑位打标 */}
            {/* 1-"温层"(左上) 2-"健康7"(下) 3-"买过"(右上) 4-"节令"(右上) 5-"商品标题前" */}
            {(type === 1 || type === 2) &&
              skuLabelList.map((item, i) =>
                Number(item.type) !== 5 ? (
                  <Image
                    key={i.toString()}
                    className={skuLabelEnum[Number(item.type) - 1]}
                    alt={item.name || '标题前打标'}
                    src={filterImg(item.labelItem && item.labelItem.imgUrl)}
                  />
                ) : null
              )}

            {((data.status === 5 && !data.preSale) || data.status === 1) && (
              <View className='product-status-icon'>
                {data.status === 5 ? '今日售罄' : '已下架'}
              </View>
            )}

            {data.discountInfo && (
              <View className='discount'>
                <FreshProductTag text={data.discountInfo} colorType='red' />
              </View>
            )}

            {resourceType === 'rank' && index > 0 && (
              <View
                className='rank-icon'
                style={{
                  backgroundImage: `url(${
                    rankIcon ||
                    '//m.360buyimg.com/img/jfs/t1/133974/5/6389/2383/5f2d1646E6aa70fde/9ab5a277352e69ca.png'
                  })`,
                }}
              >
                {index}
              </View>
            )}

            {isShowImgIcon === true && (
              <View
                className='product-item-image-icon'
                style={{ backgroundImage: `url(${imgIcon})` }}
              />
            )}
            {isShowItemAd === true && (data.advertisement || data.av) && (
              <View className='product-item-advertisement' style={adStyle}>
                {data.advertisement || data.av}
              </View>
            )}
          </View>
          <View className='product-item-desc' style={productItemDescStyle}>
            <View className='product-item-desc-inner'>
              {isShowSkuName !== false && (
                <View
                  className='product-item-title'
                  style={{ WebkitBoxOrient: 'vertical', ...itemTitleStyle }}
                >
                  {data.isPeriod &&
                    !data.preSale &&
                    resourceType !== 'rank' && (
                      <Image
                        className='product-item-title-tag'
                        src={tagImage.zhouqisong}
                        alt='周期送'
                        mode='aspectFit'
                        lazyLoad
                      />
                    )}
                  {data.preSale && !data.isPeriod && data.status === 5 && (
                    <Image
                      className='product-item-title-tag'
                      alt='预售'
                      src={tagImage.yushou}
                      mode='aspectFit'
                      lazyLoad
                    />
                  )}
                  {/* 标题前打标 */}
                  {(type === 1 || type === 2) &&
                    skuLabelList.map((item, i) =>
                      Number(item.type) === 5 ? (
                        <Image
                          key={i.toString()}
                          className={skuLabelEnum[Number(item.type) - 1]}
                          alt={item.name || '标题前打标'}
                          src={filterImg(
                            item.labelItem && item.labelItem.imgUrl
                          )}
                        />
                      ) : null
                    )}

                  {data.skuShortName && !forHere
                    ? data.skuShortName
                    : data.skuName}
                </View>
              )}
              {isShowAv && (
                <View className='product-item-ad-wrap'>
                  <View
                    className='product-item-ad'
                    style={
                      highLightAd
                        ? {
                            background:
                              (data.advertisement || data.av) &&
                              (data.advertisement.length > 0 ||
                                data.av.length > 0)
                                ? 'rgba(255,102,76,1)'
                                : '',
                            borderRadius: '3px 11px 3px 11px',
                            boxSizing: 'content-box',
                            padding: '2px 8px',
                            transformOrigin: 'left center',
                            transform: 'scale(0.83)',
                            fontSize: '12px',
                            color: '#fff',
                          }
                        : { WebkitBoxOrient: 'vertical', ...ItemAdStyle }
                    }
                  >
                    {data.advertisement ? data.advertisement : data.av}
                  </View>
                </View>
              )}

              {/* 榜单排名 */}
              {isShowBankData && (
                <View className='bank-show'>
                  {bankData && bankData.iconUrl && (
                    <Image
                      src={filterImg(bankData.iconUrl)}
                      className='bank-icon'
                      alt='七鲜'
                    />
                  )}
                  {bankData && bankData.content && (
                    <View
                      className='bank-content'
                      style={{
                        fontSize:
                          (bankData.style.size &&
                            Taro.pxTransform(bankData.style.size * 2)) ||
                          Taro.pxTransform(24),
                        fontFamily:
                          bankData.style &&
                          bankData.style &&
                          bankData.style.type === 1
                            ? 'PingFangSC-Regular'
                            : 'PingFangSC-Medium',
                        fontWeight:
                          bankData.style && bankData.style.type === 3
                            ? '600'
                            : 'normal',
                        color: bankData.style.textColor || '#95969F',
                      }}
                    >
                      {bankData && bankData.content.length > 10 && type === 2
                        ? `...${bankData.content.slice(
                            -10,
                            bankData.content.length
                          )}`
                        : bankData.content}
                    </View>
                  )}
                </View>
              )}
              {isShowPromotionTag && (
                <View className='tag-list' style={tagListStyle}>
                  {/* 分类页打标规则：24小时发货>促销>优惠券 并且当3个标同时存在时，因小屏手机排不开，所以不显示优惠券的标 - 0514版本优化 */}
                  {isFromPage === 'category' ? (
                    <View>
                      {jdBuyInfo && (
                        <FreshProductTag text={jdBuyInfo} colorType='gray' />
                      )}
                      {overWeightInfo && (
                        <FreshProductTag
                          text={overWeightInfo}
                          colorType='gray'
                        />
                      )}
                      {fullSpeed && (
                        <FreshProductTag text={fullSpeed} colorType='green' />
                      )}
                      {data &&
                        data.promotionTypes &&
                        data.promotionTypes !== undefined &&
                        data.promotionTypes.length > 0 &&
                        data.promotionTypes.map((val, i) => {
                          if (
                            (jdBuyInfo ||
                              overWeightInfo ||
                              fullSpeed ||
                              isPeriod) &&
                            isShowCouponFlag &&
                            i >= 1
                          ) {
                            return false;
                          }
                          if (
                            FreshProductTagLen &&
                            FreshProductTagLen > 0 &&
                            i >= FreshProductTagLen
                          ) {
                            return false;
                          }
                          return (
                            <FreshProductTag
                              key={`${String(i)}${val.promotionName}`}
                              text={val.promotionName}
                            />
                          );
                        })}
                      {isShowCouponFlag &&
                        isShowCouponFlag === true &&
                        !(
                          (jdBuyInfo || overWeightInfo) &&
                          data &&
                          data.promotionTypes &&
                          data.promotionTypes.length > 0
                        ) && <View className='coupon-flag'>券</View>}
                    </View>
                  ) : (
                    <View className='jd-tag'>
                      {isShowCouponFlag && isShowCouponFlag === true && (
                        <View className='coupon-flag'>券</View>
                      )}
                      {jdBuyInfo && (
                        <FreshProductTag text={jdBuyInfo} colorType='gray' />
                      )}
                      {overWeightInfo && (
                        <FreshProductTag
                          text={overWeightInfo}
                          colorType='gray'
                        />
                      )}
                      {fullSpeed && (
                        <FreshProductTag text={fullSpeed} colorType='green' />
                      )}
                      {data &&
                        data.promotionTypes &&
                        data.promotionTypes !== undefined &&
                        data.promotionTypes.length > 0 && (
                          <View className='tag-name'>
                            {data.promotionTypes.map((val, i) => {
                              if (
                                FreshProductTagLen &&
                                FreshProductTagLen > 0 &&
                                i >= FreshProductTagLen
                              ) {
                                return false;
                              }
                              return (
                                <FreshProductTag
                                  key={`${String(i)}${val.promotionName}`}
                                  text={val.promotionName}
                                />
                              );
                            })}
                          </View>
                        )}
                    </View>
                  )}
                </View>
              )}

              {/* 空节点占位 */}
              {!isShowAv && (type === 1 || type === 2) && (
                <View className='product-item-ad-wrap'>
                  <View className='product-item-ad'></View>
                </View>
              )}
              {!isShowBankData && (type === 1 || type === 2) && (
                <View className='bank-show'></View>
              )}

              <View className='price-unit' style={priceUnitStyle}>
                <View className='price-unit-inner'>
                  <Text className='price'>
                    <Text
                      style={{
                        fontWeight: priceFontWeight,
                        fontSize: `${Taro.pxTransform(SaleUnitFontSize)}`,
                      }}
                    >
                      {SaleUnit}
                    </Text>
                    <Text style={{ fontWeight: priceFontWeight }}>
                      {data.jdPrice || '暂无报价'}
                    </Text>
                  </Text>
                  {isShowUnit !== false && data.jdPrice && (
                    <Text className='unit'>{data.buyUnit}</Text>
                  )}
                  {isShowMarketPrice === true && data.marketPrice && (
                    <Text
                      className='three-market-price'
                      style={{
                        display: marketPriceIsOneLine ? 'block' : 'inline',
                      }}
                    >
                      {SaleUnit}
                      {data.marketPrice}
                    </Text>
                  )}
                </View>
                {type === 1 && Number(data.marketPrice) > Number(data.jdPrice) && (
                  <View className='product-item-market-price'>
                    {SaleUnit}
                    {data.marketPrice}
                  </View>
                )}
                <View className='product-item-btn' style={productItemBtnStyle}>
                  {addType !== 2 && (
                    <FreshAddCartBtn
                      disabled={data.status === 5 || !data.addCart}
                      size={type !== 3 ? 'big' : 'small'}
                      onClick={
                        // addCartAction(ev, data, this.actionRef)
                        this.onAddCart
                      }
                      isCustomize={isCustomizeAddCart}
                      style={addCartStyle}
                      onGoCardOrder={this.onGoCardOrder}
                      type={type}
                      dataInfo={data}
                    />
                  )}
                  {addType === 2 && (
                    <FreshProductItemBtn
                      width={124}
                      height={46}
                      name='下单'
                      fontSize={24}
                      desc=''
                      color='#fff'
                      background={
                        data.addCart
                          ? 'linear-gradient(rgb(213, 47, 68), rgb(247, 84, 93))'
                          : 'rgb(204, 204, 204)'
                      }
                      boxShadow=''
                      borderRadius={[23, 23, 23, 23]}
                      disabled={false}
                      onClick={
                        // addCartAction(ev, data, this.actionRef)
                        this.onAddCart
                      }
                      isShowDeacIcon
                      descIcon='//m.360buyimg.com/img/jfs/t1/14154/9/8882/767/5c7a3308E6e59f51d/85d87e021fcadd80.png'
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    );
  }
}
