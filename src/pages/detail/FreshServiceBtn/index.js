import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View, Image } from "@tarojs/components";
import "./index.scss";

export default class FreshServiceBtn extends Component {
  constructor(props) {
    super(props);
  }

  onGoCart() {
    this.props.onGoCart() && this.props.onGoCart(...arguments);
  }

  onSubmit() {
    if (this.props.isDisabled) return;
    this.props.onSubmit() && this.props.onSubmit(...arguments);
  }

  onPrepareCart() {
    this.props.onPrepareCart() && this.props.onPrepareCart(...arguments);
  }

  onAddCart() {
    this.props.onAddCart() && this.props.onAddCart(...arguments);
  }

  render() {
    const {
      name,
      type,
      jdPrice,
      defaultPrice,
      imgUrl,
      desc,
      isDisabled,
      isEmpty,
      isNoPrepare,
      cartNum,
      customStyle,
    } = this.props;
    return (
      <View className="service-btn-component">
        {!type && (
          <View
            className="service-btn-default"
            style={customStyle}
            onClick={this.onSubmit.bind(this)}
          >
            {name}
          </View>
        )}
        {type === "bottom-double" && (
          <View className="service-double-btn">
            <View className="left-cart" onClick={this.onGoCart.bind(this)}>
              {cartNum && (
                <View className="cart-num">
                  {cartNum > 99 ? "99+" : cartNum}
                </View>
              )}
              <Image src={imgUrl} className="cart-icon" alt="7FRESH" />
            </View>
            <View className="right-box">
              <View
                className="right-btn"
                style={{
                  // eslint-disable-next-line no-nested-ternary
                  color: isDisabled
                    ? "rgba(255, 255, 255, 1)"
                    : isNoPrepare
                    ? "#95969f"
                    : "rgba(255, 255, 255, 1)",
                  background: isNoPrepare ? "#E5E5E5" : "rgba(255, 186, 8, 1)",
                }}
                onClick={this.onPrepareCart.bind(this)}
              >
                <View className="price">{jdPrice}</View>
                <View className="name">{isNoPrepare ? "已抢光" : name}</View>
              </View>
              {defaultPrice && !isEmpty && (
                <View
                  className="right-cart"
                  onClick={this.onAddCart.bind(this)}
                >
                  <View className="price">{defaultPrice}</View>
                  <View className="name">{desc}</View>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}
