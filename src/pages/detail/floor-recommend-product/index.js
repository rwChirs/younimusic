import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API

import { View, ScrollView } from "@tarojs/components";
import ProductItem from "../product-item";
import { getExposure } from "../../../utils/common/exportPoint";
import PropTypes from 'prop-types';
import "./index.scss";

export default class FloorRecommendProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.skuExposure();
    }, 1000);
  }

  // 商品曝光
  skuExposure = () => {
    const { data, strategyABTest, touchstone_expids } = this.props;
    data &&
      data.length > 0 &&
      data.map((item, i) => {
        const targetDom = `#goods-item-kk-${i}`;
        const intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        intersectionObserver
          .relativeToViewport({ bottom: 0 })
          .observe(targetDom, () => {
            const params = {
              router: this.$router,
              eid: "Product_details_Middle_recommend",
              eparam: {
                skuId: item.skuId,
                skuName: item && item.skuName,
                skuSequenceNum: i + 1,
                strategyABTest: strategyABTest,
                touchstone_expids: touchstone_expids,
              },
            };
            getExposure(params);
            intersectionObserver.disconnect();
          });
      });
  };

  addCart = (data) => {
    const { onAddCart } = this.props;
    onAddCart({ ...data, from: "middleRecommend" });
  };

  render() {
    const { onGoDetail, data } = this.props;
    console.log("data", data);
    return (
      <View className="floor-theme-product lazy-load-img middle-recommend">
        <View className="recommend-title">看了又看</View>
        <View className="floor-theme-goods" id="goods-item-z-box">
          <ScrollView
            scrollX
            scrollWithAnimation
            lowerThreshold={20}
            className="type-one-wrap"
          >
            <View className="floor-theme-type-two">
              {data.map((val, i) => {
                return (
                  <View className="users" key={i.toString()} id={`goods-item-kk-${i}`}>
                    <ProductItem
                      type={4}
                      data={val}
                      onGoDetail={onGoDetail}
                      onAddCart={this.addCart.bind(this)}
                      itemStyle={{
                        marginRight: 14 + "px",
                        marginBottom: 14 + "px",
                        border: "1px solid #f3f3f3",
                      }}
                      ind={i + 1}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

FloorRecommendProduct.defaultProps = {
  data: [],
    strategyABTest: "",
}
FloorRecommendProduct.propTypes = {
  data: PropTypes.object,
  strategyABTest: PropTypes.string,
}