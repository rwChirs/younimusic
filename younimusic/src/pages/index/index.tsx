import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Image } from "@tarojs/components";

import "taro-ui/dist/style/components/icon.scss"; // 字体图标
import { filterImg, px2vw } from "../utils/index";
import CustomTabBar from "../components/custom-tab-bar";
import "./index.scss";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "动态发布",
      path: "/pages/index/index"
    };
  }

  render() {
    let defaultImage =
      "//m.360buyimg.com/img/jfs/t1/193412/29/19111/130126/611fc7b7E3aa1c999/917b5e41c40cde25.png";
    let bgImage =
      "//m.360buyimg.com/img/jfs/t1/201095/6/2658/430381/611ff15fE6576f144/957a8ffdb11a64b6.png";
    return (
      <View className="index">
        <Image
          className="index-image"
          style={{
            height: "88vh"
          }}
          src={filterImg(defaultImage)}
        />
        <Image
          className="index-gif"
          src={
            "//m.360buyimg.com/img/jfs/t1/180356/3/20013/2906117/611ff291E6fd16bca/ba0311873f285f7c.gif"
          }
        />
        <View style={{ height: "12vh" }} />

        <CustomTabBar selected={0} />
      </View>
    );
  }
}
