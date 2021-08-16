import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View,Image } from "@tarojs/components";
import "./index.scss";

export default class WeChatImg extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render(){
    return(
      <View className="wechat-img">
        <Image className="wechat-img-src" src="https://m.360buyimg.com/img/jfs/t1/15704/22/14049/50493/5ca46f90E4f8dcd4b/d4e16acddabf2bcc.png" />
      </View>
    )
  }
}
