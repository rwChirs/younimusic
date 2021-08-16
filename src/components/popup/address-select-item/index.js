import Taro from "@tarojs/taro";
import { Component } from 'react';
import { View } from "@tarojs/components";

import "./index.scss";

export default class AddressSelectItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        className={this.props.active ? `select-item active` : `select-item`}
      >
        <View className={`icon ${this.props.icon}`} />
        <Text
          className="name"
          style={{
            color: this.props.disable ? "rgb(194, 194, 194)" : "#252525",
          }}
        >
          {this.props.name}
        </Text>
        <View className="selected" />
      </View>
    );
  }
}
