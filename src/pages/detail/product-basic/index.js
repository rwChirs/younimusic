import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Image } from '@tarojs/components';
import FreshWarmPrompt from '../FreshWarmPrompt';
import PreBargains from '../pre-bargains';
import BargainsForSeconds from '../bargains-for-seconds';

import './index.scss';
import { filterImg } from '../../../utils/common/utils';

export default class ProductBasic extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: {},
  };

  onQuestion = () => {
    this.props.onPopup();
  };

  render() {
    const { data, preSaleInfo, wareQualityAttrList } = this.props;

    let isShow =
      data &&
      !data.isPeriod &&
      preSaleInfo &&
      preSaleInfo.type === 2 &&
      preSaleInfo.status !== null
        ? true
        : false;

    return (
      <View style='backgrond: #fff'>
        {data.seckillInfo &&
          data.seckillInfo.started &&
          data.seckillInfo.restseckillTime && (
            <BargainsForSeconds
              data={data}
              onPopup={this.onQuestion.bind(this)}
            />
          )}
        <View className='product-basic'>
          <View className='product-price'>
            {!data.seckillInfo && (
              <View className='jd-price'>
                {!isShow && !!data.jdPrice && (
                  <View className='price text'>
                    ￥
                    <Text className='price-num'>{data.jdPrice.toFixed(2)}</Text>
                  </View>
                )}
                {!isShow && !data.jdPrice && (
                  <View className='price text'>暂无报价</View>
                )}
                {!isShow && !!data.buyUnit && (
                  <View className='unit text'>{data.buyUnit}</View>
                )}
                {!isShow && !data.seckillInfo && !!data.marketPrice && (
                  <View className='product-detail-spent-money text'>
                    <Text>¥ {data.marketPrice.toFixed(2)}</Text>
                  </View>
                )}
                {!!data.buyLimitDesc && (
                  <View className='buyLimitDesc text'>{data.buyLimitDesc}</View>
                )}
                {!isShow && data.startBuyUnitNum && data.maxBuyUnitNum && (
                  <View className='desc'>
                    {data.toasts && (
                      <View className='question' onClick={this.onQuestion} />
                    )}
                  </View>
                )}
              </View>
            )}
            {data.saleNumDesc && (
              <View className='sale-num-desc'>{data.saleNumDesc}</View>
            )}
          </View>
          {/* 健康7系列打标 */}
          <View>
            {data.skuLabelList &&
              data.skuLabelList.length > 0 &&
              data.skuLabelList.map((item, i) => {
                return item.type === 5 &&
                  item.labelItem &&
                  item.labelItem.imgUrl &&
                  item.labelItem.text ? (
                  <View className='health-tag-box' key={i.toString()}>
                    <Image
                      className='health-tag'
                      alt='鲜系列打标'
                      src={filterImg(item.labelItem.imgUrl)}
                    />
                    <Text>{item.labelItem.text}</Text>
                  </View>
                ) : null;
              })}
          </View>
          {/* 商品名称 */}
          <View className='product-name'>
            {data.skuLabelList &&
              data.skuLabelList.length > 0 &&
              data.skuLabelList.map(item => {
                return item.type === 4 ? (
                  <Image
                    className='newSku'
                    src={item.labelItem.imgUrl}
                    alt='新品标'
                  />
                ) : (
                  ''
                );
              })}
            {data.skuName}
          </View>

          {!!data.av && (
            <View className='product-selling-point'>
              <Text>{data.av}</Text>
            </View>
          )}

          {data.warmPrompt && (
            <FreshWarmPrompt
              message={data.warmPrompt}
              tipStyle='padding: 5px 0 10px'
            />
          )}

          {/* TODO:新增属性标签 */}
          {wareQualityAttrList && wareQualityAttrList.length > 1 && (
            <View className='fix-scoll'>
              <View className='product-detail-tag'>
                {wareQualityAttrList.map((tag, ind) => {
                  return (
                    <View className='tag-box' key={ind}>
                      {tag.imageUrl ? (
                        <Image
                          className='tag-icon'
                          src={filterImg(tag.imageUrl)}
                        />
                      ) : (
                        ''
                      )}
                      <Text className='tag-text'>{tag.attrValNames}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {data.seckillInfo && data.seckillInfo.startTime && (
            <PreBargains data={data} />
          )}
        </View>
      </View>
    );
  }
}
