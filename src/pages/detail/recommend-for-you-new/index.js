// 无货为你推荐
import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, ScrollView } from '@tarojs/components';
import { getExposure } from '../../../utils/common/exportPoint';
import ProductItem from './product-item';
import './index.scss';

export default class RecommendForYouNew extends Component {
  static defaultProps = {
    data: {
      pictureAspect: 1,
      image: '',
      items: [],
      horizontalScrollIndicator: 1,
      moreAction: {},
      action: {},
    },
  };

  componentDidMount() {
    this.skuExposure();
  }

  // 商品曝光
  skuExposure = () => {
    const { recommendList, skuId } = this.props;
    recommendList &&
      recommendList.length > 0 &&
      recommendList.map((item, i) => {
        const targetDom = `#detail-similar-pro-${i}`;
        const intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        intersectionObserver
          .relativeTo('#detail-similar-pro-box', { right: 0 })
          .observe(targetDom, () => {
            const params = {
              router: this.$router,
              eid: 'Product_details_0010',
              eparam: {
                main_sku: skuId,
                skuId: item.skuId,
                broker_info: item.brokerInfo,
                page: item.page,
                page_index: item.pageIndex || i + 1,
              },
            };
            getExposure(params);
            intersectionObserver.disconnect();
          });
      });
  };

  /**
   * 添加购物车
   * @param {Number}} skuId 商品id
   * @param {Number} serviceTagId 服务Id
   */
  addCart = data => {
    const { skuId, buyNum, serviceTagId } = data;
    this.props.onAddCart({
      skuId,
      buyNum,
      serviceTagId,
      from: 'similar',
      data: data,
    });
  };

  /**
   * 去详情页
   */
  gotoDetail = data => {
    this.props.onGotoDetail({
      skuId: data.skuId,
      type: 'similar',
      event: '',
      data,
    });
  };

  onCloseRecommendLayer = () => {
    this.props.onCloseRecommendLayer();
  };

  render() {
    const { recommendList } = this.props;
    return (
      <View className='RecommendForYouNew-container'>
        <View className='RecommendForYouNew-main'>
          <View className='product-title'>
            <Text>商品抢光啦，为您推荐以下商品</Text>
            <View
              className='close-layer'
              onClick={this.onCloseRecommendLayer.bind(this)}
            />
          </View>
          <View className='RecommendForYouNew-list' id='detail-similar-pro-box'>
            <ScrollView scrollX scrollWithAnimation>
              <View className='items-wrap'>
                {recommendList &&
                  recommendList.length > 0 &&
                  recommendList.map((val, i) => {
                    const productInfo = { ...val, index: i + 1 };
                    return (
                      <View
                        id={`detail-similar-pro-${i}`}
                        key={`similar-pro${i}`}
                      >
                        <ProductItem
                          type={3}
                          data={productInfo}
                          onGoDetail={this.gotoDetail.bind(this, productInfo)}
                          onAddCart={this.addCart}
                        />
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
