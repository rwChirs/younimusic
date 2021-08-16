import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render(){
    const {
      title,
      isHaveIcon,
      margin,
      color,
      lineWidth,
      fontSize
    } = this.props;
    return(
      <View className="fight-title">
        <View className="leftLine" style={{width:lineWidth+'px'}}>
          {isHaveIcon && <View className="line-circle-l" />}
        </View>
        <View className="content" style={{marginLeft:margin+'px',marginRight:margin+'px',color:color,fontSize:fontSize+"px"}}>{title}</View>
        <View className="rightLine" style={{width:lineWidth+'px'}}>
          {isHaveIcon && <View className="line-circle-r" />}
        </View>
     </View>
    )
  }
}
