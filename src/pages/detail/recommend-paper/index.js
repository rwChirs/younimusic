import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from "@tarojs/components";

import "./index.scss";
import Joiner from "../../../components/joiner";

export default class RecommendPaper extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    attrs: []
  };

  componentWillMount() {}


  render() {
    return (
      <View>
        {this.props.attrs.length > 0 && (
          <View className="recommend-paper">
            {this.props.attrs.map(attr => {
              return (
                <View className="recommend-paper-item" key={attr.attrId}>
                  <View className="head">
                    <View className="logo" />
                    <Joiner />
                    <Text className="title">
                      {attr.attrName.replace("7FRESH", "")}
                    </Text>
                  </View>
                  <View className="contents">
                    <Text className="text">{attr.attrValNames.join("")}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
}
