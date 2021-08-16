import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API

import { View } from "@tarojs/components";
import { getProductDetailImgApi } from "@7fresh/api";
import ListItem from "../list-item";

import "./index.scss";
import RpxLine from "../../../components/rpx-line";
import RenderHtml from "../../../components/render-html";

export default class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: "",
    };
  }

  static defaultProps = {
    storeId: 0,
    skuId: 0,
    specs: [],
  };

  componentWillMount() {
    this.getProductDetail();
  }

  getProductDetail = () => {
    const { storeId, skuId } = this.props;
    getProductDetailImgApi({ storeId, skuId })
      .then((res) => {
        if (res && res.bigFiled) {
          this.setState({
            nodes: res.bigFiled,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <View className="product-detail">
        <View className="list">
          <ListItem label="商品详情" type="text" data="" />
          <RpxLine />
          {this.props.specs.map((spec, index) => {
            return (
              <View key={index}>
                <ListItem label={spec.name} type="text" data={spec.value} />
                {this.props.specs.length !== index + 1 && <RpxLine />}
              </View>
            );
          })}
        </View>
        <RenderHtml nodes={this.state.nodes} />
      </View>
    );
  }
}
