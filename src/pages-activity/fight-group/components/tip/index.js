import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

export default class FightTip extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render(){
    const {
      title,
    } = this.props;
    return(
      <View className="tip-page">
        {title}
     </View>
    )
  }
}
