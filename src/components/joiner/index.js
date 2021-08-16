import React, { Component } from 'react';
import { View } from "@tarojs/components";

export default class Joiner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height, color, margin } = { ...this.props };
    return (
      <View
        style={`width: ${width}rpx; height: ${height}rpx; background: ${color}; margin: 0 ${margin}rpx;`}
      />
    );
  }
}
