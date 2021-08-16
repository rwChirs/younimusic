import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Image } from '@tarojs/components';
import TagList from './tag-list';
import './index.scss';
import { filterImg, px2vw } from '../../../utils/common/utils';

const SaleUnit = '¥';
const tagImage = {
  dingqisong:
    '//m.360buyimg.com/img/jfs/t1/169760/4/13284/6709/6052c232Eefee422e/10725d7c82c983d4.png',
  yushou:
    '//m.360buyimg.com/img/jfs/t1/159189/39/14066/5903/6052c250E38690633/1db0b449980aed6d.png',
  fresh:
    '//m.360buyimg.com/img/jfs/t1/108892/6/6641/8463/5e4f7e0eE8fc7642f/5c8b37ce90ca0373.png',
};

const handleType = type => {
  switch (type) {
    case 1:
      return 'type-one';
    case 2:
      return 'type-two';
    case 3:
      return 'type-three';
    case 4:
      return 'type-small'; //商详腰部推荐
    case 5:
      return 'type-small'; //商详搭配购
    default:
      return 'type-three';
  }
};
class ProductItem extends Component {
  static defaultProps = {
    itemStyle: {},
    data: {
      status: -1,
    },
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  goDetail = ev => {
    const { data, onGoDetail, ind } = this.props;
    ev.stopPropagation();
    onGoDetail({
      skuId: data.skuId,
      type: 'middleRecommend',
      data: data,
      skuSequenceNum: ind,
    });
  };
  addCart = ev => {
    const { data, onAddCart, ind } = this.props;
    ev.stopPropagation();
    onAddCart({
      skuId: data.skuId,
      type: 'middleRecommend',
      data: data,
      skuSequenceNum: ind,
    });
  };

  // 预付卡去H5结算页
  goCardOrder = ev => {
    const { data, onGoCardOrder } = this.props;
    ev.stopPropagation();
    onGoCardOrder(data);
  };

  render() {
    const {
      type,
      data,
      windowWidth,
      itemStyle,
      imgStyle,
      // tagListStyle,
      priceUnitStyle,
      isShowUnit,
      isShowItemAd,
      isShowMarketPrice,
      adStyle,
      // isShowDailyFresh,
      isCart,
      isFromPage,
      options,
    } = this.props;
    const bankData = data && data.smartAV;
    let itemWidth = 'auto';

    if (!itemStyle.width && windowWidth && type) {
      itemWidth =
        (Number(windowWidth) - 14 * (Number(type) + 1)) / Number(type);
      itemStyle.width = itemWidth + 'px';
    }
    const isHaveTags =
      data.jdBuyInfo ||
      data.overWeightInfo ||
      data.fullSpeed ||
      data.isPeriod ||
      (data.promotionTypes && data.promotionTypes.length > 0);
    const skuLabelEnum = [
      'store-prop-tag',
      'health-tag',
      'action-tag',
      'season-tag',
      'pre-title-tag',
    ];
    return (
      <View
        className={`product-item-detail product-item-${handleType(
          type
        )} customize-${options && options.modal}`}
        style={itemStyle}
        onClick={this.goDetail}
      >
        {data.flagImage && type === 3 && (
          <View className='flagImage-container lazy-load-img'>
            <Image
              className='flag-image'
              src={filterImg(data.flagImage)}
              lazyLoad
            />
          </View>
        )}
        <View
          className='product-item-figture lazy-load-img'
          style={{
            opacity:
              (data.status == 5 && !data.preSale) || data.status == 1 ? 0.6 : 1,
            ...imgStyle,
            position: 'relative',
          }}
        >
          {((data.status == 5 && !data.preSale) || data.status == 1) && (
            <View className='product-status-icon'>
              {data.status == 5 ? '今日售罄' : '已下架'}
            </View>
          )}
          {/* 主图坑位打标 */}
          {(type === 1 || type === 2) &&
            data.skuLabelList &&
            data.skuLabelList.length > 0 && (
              <View>
                {data.skuLabelList.map((item, i) => {
                  return (
                    // 1-"温层"(左上) 2-"健康7"(下) 3-"买过"(右上) 4-"节令"(右上) 5-"商品标题前"
                    <View key={i.toString()}>
                      {Number(item.type !== 5) ? (
                        <Image
                          key={i.toString()}
                          className={skuLabelEnum[item.type - 1]}
                          alt='主图打标'
                          src={filterImg(
                            item.labelItem && item.labelItem.imgUrl
                          )}
                        />
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}

          <Image
            className='product-item-image'
            style={imgStyle}
            id={`product-image-${data.skuId}`}
            src={filterImg(data.imageUrl)}
            lazyLoad
          />

          {/* {type === 3 && (
            <View className='tag-list-wrap' style={tagListStyle}>
              <TagList data={data.promotionTypes} styleType={2} />
            </View>
          )} */}
          {isShowItemAd === true && (data.advertisement || data.av) && (
            <View style={adStyle} className='product-item-advertisement'>
              {data.advertisement || data.av}
            </View>
          )}
        </View>
        <View className='product-item-desc'>
          <View
            className={
              (isFromPage === 'recommend' &&
                !isHaveTags &&
                !(data.advertisement || data.av)) ||
              type === 4
                ? `product-item-title lazy-load-img two-line`
                : `product-item-title lazy-load-img`
            }
          >
            {data.isPeriod && !data.preSale && (
              <Image
                mode='aspectFit'
                className='product-item-title-tag dingqisong'
                src={filterImg(tagImage.dingqisong)}
                lazyLoad
              />
            )}
            {data.preSale && !data.isPeriod && data.status === 5 && (
              <Image
                mode='aspectFit'
                className='product-item-title-tag yushou'
                src={filterImg(tagImage.yushou)}
                lazyLoad
              />
            )}
            {/* 标题前打标 */}
            {(type === 1 || type === 2) &&
              data &&
              data.skuLabelList &&
              data.skuLabelList.length > 0 &&
              data.skuLabelList.map((item, i) => {
                return (
                  <View key={i.toString()}>
                    {/* 1-"温层"(左上) 2-"健康7"(下) 3-"买过"(右上) 4-"节令"(右上) 5-"商品标题前" */}
                    {Number(item.type) === 5 ? (
                      <Image
                        className={skuLabelEnum[Number(item.type) - 1]}
                        alt={item.name || '标题前打标'}
                        src={filterImg(item.labelItem && item.labelItem.imgUrl)}
                      />
                    ) : null}
                  </View>
                );
              })}
            {data.skuShortName ? data.skuShortName : data.skuName}
          </View>

          {type !== 3 && type !== 4 && !bankData ? (
            <View className='product-item-ad'>
              {data.advertisement || data.av || ''}
            </View>
          ) : null}
          {/* 榜单排名 */}
          {bankData &&
            bankData.content &&
            bankData.content !== null &&
            (type === 1 || type === 2) && (
              <View className='bank-show'>
                {bankData && bankData.iconUrl && (
                  <Image
                    src={filterImg(bankData.iconUrl)}
                    className='bank-icon'
                    alt='七鲜'
                  />
                )}
                <View
                  className='bank-content'
                  style={{
                    fontSize:
                      (bankData.style.size && px2vw(bankData.style.size * 2)) ||
                      px2vw(24),
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
              </View>
            )}

          {type !== 3 && type !== 4 && (
            <View>
              {isFromPage === 'recommend' && isHaveTags && (
                <View className='tag-list-wrap'>
                  <TagList data={data.promotionTypes} isFromPage={isFromPage} />
                </View>
              )}
            </View>
          )}

          <View className='price-wrap' style={priceUnitStyle}>
            {data.jdPrice ? (
              <Text className='price'>
                {SaleUnit}
                {data.jdPrice}
              </Text>
            ) : (
              <Text className='no-price'>暂无报价</Text>
            )}
            {isShowUnit !== false && (
              <Text className='unit'>{data.buyUnit}</Text>
            )}
            {isShowMarketPrice === true && data.marketPrice && (
              <Text className='three-market-price'>
                {SaleUnit}
                {data.marketPrice}
              </Text>
            )}
          </View>
          {/* 预付卡的处理 */}
          {!isCart && data.prepayCardType && (type === 1 || type === 2) && (
            <View className='buy-now' onClick={this.goCardOrder}>
              购卡
            </View>
          )}

          {!isCart && !data.prepayCardType && (
            <View className='product-item-btn' onClick={this.addCart}>
              <View
                className={`product-item-btn-bg ${
                  data.addCart ? '' : 'disabled'
                }`}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default ProductItem;
