import React, { Component } from 'react';
import { View } from '@tarojs/components';

import './index.scss';

export default class Tag extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.text ? (
      <View className={`goods-item-tag goods-item-tag-${this.props.type}`}>
        {this.props.text}
      </View>
    ) : null;
  }
}
