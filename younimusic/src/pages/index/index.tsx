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
    return (
      <View className="index">
        <Image
          className="index-image"
          style={{
            height: px2vw(1050)
          }}
          src={filterImg(
            "//m.360buyimg.com/img/jfs/t1/193412/29/19111/130126/611fc7b7E3aa1c999/917b5e41c40cde25.png"
          )}
        />
        {/* <View style={{ height: px2vw(150) }} /> */}

        <CustomTabBar selected={0} />
      </View>
    );
  }
}
