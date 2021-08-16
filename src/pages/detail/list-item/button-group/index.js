import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View } from "@tarojs/components";

import "./index.scss";

export default class ButtonGroup extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    current: 1,
    data: []
  };

  onChange = id => {
    this.props.onChange(id);
  };

  render() {
    const { data, current } = this.props;
    return (
      <View className="button-group">
        {data.map(item => (
          <View
            className={`button ${current === item.id ? "active" : ""}`}
            key={item.id}
            onClick={this.onChange.bind(this, item.id)}
          >
            {item.name}
          </View>
        ))}
      </View>
    );
  }
}
