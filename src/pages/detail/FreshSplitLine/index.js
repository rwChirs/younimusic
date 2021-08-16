import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View } from "@tarojs/components";
import "./index.scss";

export default class FreshSplitLine extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { width, height, color, opacity } = this.props;
    return (
      <View
        className="split-line"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          background: color,
          opacity,
        }}
      />
    );
  }
}
