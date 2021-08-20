import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";

import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/icon.scss"; // 字体图标
import "taro-ui/dist/style/components/tabs.scss"; // 标签tab
import { filterImg } from "../utils/index";
import CustomTabBar from "../components/custom-tab-bar";
import "./index.scss";

export default class Index extends Component<
  {},
  { tabCurrent: number; imageData: any }
> {
  constructor(props) {
    super(props);
    this.state = {
      tabCurrent: 0,
      imageData: {
        actImageList: [
          "//m.360buyimg.com/img/jfs/t1/194238/16/19040/49222/611fafc2E3693fa40/cc03c82a82013dc1.jpg",
          "//m.360buyimg.com/img/jfs/t1/187585/38/19255/47886/611fb9cdE591cd3cf/d0102fc79c9c4277.jpg",
          "//m.360buyimg.com/img/jfs/t1/191034/17/19291/44913/611fba87E3182c364/df0beaff6c966421.jpg",
          "//m.360buyimg.com/img/jfs/t1/187935/19/19352/59774/611fbd13E9847f17c/9981e919063a4980.png",
          "//m.360buyimg.com/img/jfs/t1/77802/22/16811/145897/611fbd3cE6ab9d49e/37826890f2b1e80c.png",
          "//m.360buyimg.com/img/jfs/t1/200243/16/4085/93667/611fbd4dE4162620d/25229ee81d682843.jpg",
          "//m.360buyimg.com/img/jfs/t1/199460/33/4141/234708/611fbd59E03405e22/03c358dfb87144a7.jpg",
          "//m.360buyimg.com/img/jfs/t1/193458/29/19278/76688/611fbd69Eb7a5a50a/f71dd147e68c5ea6.jpg",
          "//m.360buyimg.com/img/jfs/t1/192357/40/19302/105160/611fbd76E867f1184/d33cdcea1223ac97.jpg"
        ],
        Moment: [
          "//m.360buyimg.com/img/jfs/t1/193583/34/19336/74687/611fbc33Ecb44f227/9184e3c9211ad550.jpg",
          "//m.360buyimg.com/img/jfs/t1/179321/33/20419/141361/611fbc4aE6537b7ae/c2b2dba6ce039c6c.jpg"
        ]
      }
    };
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
      title: "往期回顾",
      path: "/pages/category/index"
    };
  }

  tabClick = value => {
    this.setState({
      tabCurrent: value
    });
  };

  render() {
    const { imageData } = this.state;
    const tabList = [
      { title: "婚礼现场" },
      { title: "活动集锦" },
      { title: "精彩瞬间" }
    ];
    return (
      <View className="category">
        <AtTabs
          current={this.state.tabCurrent}
          // scroll
          tabList={tabList}
          onClick={this.tabClick.bind(this)}
        >
          <AtTabsPane current={this.state.tabCurrent} index={0}>
            <View className="tab-item"></View>
          </AtTabsPane>
          <AtTabsPane current={this.state.tabCurrent} index={1}>
            <View className="tab-item">
              {imageData.actImageList.map(value => {
                return (
                  <Image
                    className="index-image"
                    src={filterImg(value, "")}
                    mode="aspectFit"
                    lazyLoad
                  />
                );
              })}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.tabCurrent} index={2}>
            <View className="tab-item">
              {imageData.Moment.map(value => {
                return (
                  <Image
                    className="index-image"
                    src={filterImg(value, "")}
                    mode="aspectFit"
                    lazyLoad
                  />
                );
              })}
            </View>
          </AtTabsPane>
        </AtTabs>

        <CustomTabBar selected={1} />
      </View>
    );
  }
}
