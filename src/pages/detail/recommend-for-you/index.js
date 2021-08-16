// 底部为你推荐
import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API

import { View } from "@tarojs/components";
import { getExposure } from "../../../utils/common/exportPoint";
import FreshProductItem from "../../../components/product-item";
import "./index.scss";
import JoinString from "../join-string";

export default class RecommendForYou extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    storeId: 0,
    skuId: 0,
    recommendList: [],
  };

  componentDidMount() {
    setTimeout(() => {
      this.skuExposure();
    }, 1000);
  }

  // 商品曝光
  skuExposure = () => {
    const { recommendList, skuId, strategyABTest } = this.props;
    recommendList &&
      recommendList.length > 0 &&
      recommendList.map((item, i) => {
        const targetDom = `#detail-recommend-pro-${i}`;
        const intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        intersectionObserver
          .relativeToViewport({ bottom: -50 })
          .observe(targetDom, () => {
            const params = {
              router: this.$router,
              eid: "Product_details_0008",
              eparam: {
                main_sku: skuId,
                skuId: item.skuId,
                broker_info: item.brokerInfo,
                page: item.page,
                page_index: item.pageIndex || i + 1,
                strategyABTest: strategyABTest,
                skuSequenceNum: i + 1,
                skuName: item && item.skuName,
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
  addCart = (data) => {
    this.props.onAddCart({
      skuId: data.skuId,
      buyNum: data.startBuyUnitNum,
      serviceTagId: data.serviceTagId,
      from: "recommend",
      data,
    });
  };

  /**
   * 去详情页
   */
  gotoDetail = (data) => {
    this.props.onGotoDetail({
      skuId: data.skuId,
      type: "recommend",
      event: "",
      data,
    });
  };

  render() {
    const { recommendList } = this.props;
    return (
      <View className="recommends">
        {recommendList && recommendList.length > 0 && (
          <View>
            <JoinString string="为你推荐" />
            <View className="product-list">
              {recommendList.map((pro, i) => {
                const productInfo = { ...pro, index: i + 1 };
                return (
                  <View
                    className="product-item"
                    key={i.toString()}
                    id={`detail-recommend-pro-${i}`}
                  >
                    <FreshProductItem
                      type={2}
                      imgStyle={{}}
                      tagNumber={1}
                      addType={1}
                      index={i + 1}
                      data={productInfo}
                      isFromPage="recommend"
                      onGoDetail={this.gotoDetail.bind(this, productInfo)}
                      onAddCart={this.addCart.bind(this, productInfo)}
                      isShowMarketPrice
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  }
}
