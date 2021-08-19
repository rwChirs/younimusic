import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Image } from "@tarojs/components";

import "taro-ui/dist/style/components/icon.scss"; // 字体图标
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
          src="http://m.qpic.cn/psc?/V52Y80us2CqO3j0smwyw3SzevE21vJxr/ruAMsa53pVQWN7FLK88i5h*MehgkvxmZiuG5Mgkjh79GP8m4UzCgJz5.NUGo4sJuriXX6BS8uCWig9J49lCJBql9g3mwPhdxCalnGsZtVrc!/mnull&bo=0AIABQAAAAABB*c!&rf=photolist&t=5"
        />

        <CustomTabBar selected={0} />
      </View>
    );
  }
}
