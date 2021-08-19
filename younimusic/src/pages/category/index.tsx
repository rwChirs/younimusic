import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtButton, AtTabBar, AtTabs, AtTabsPane } from "taro-ui";

import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/icon.scss"; // 字体图标
import "taro-ui/dist/style/components/tabs.scss"; // 标签tab
import "taro-ui/dist/style/components/button.scss"; // 按钮
import "./index.scss";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCurrent: 1,
      tabCurrent: 0
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

  pageClick = value => {
    this.setState(
      {
        pageCurrent: value
      },
      () => {
        if (value === 0) {
          Taro.navigateTo({ url: "/pages/index/index" });
        } else if (value === 1) {
          Taro.navigateTo({ url: "/pages/category/index" });
        } else if (value === 2) {
          Taro.navigateTo({ url: "/pages/my/index" });
        }
      }
    );
  };

  tabClick = value => {
    this.setState({
      tabCurrent: value
    });
  };

  render() {
    const tabList = [
      { title: "婚礼现场" },
      { title: "活动集锦" },
      { title: "精彩瞬间" }
    ];
    return (
      <View className="index">
        <AtTabs
          current={this.state.tabCurrent}
          // scroll
          tabList={tabList}
          onClick={this.tabClick.bind(this)}
        >
          <AtTabsPane current={this.state.tabCurrent} index={0}>
            <View className="tab-item">标签页一的内容</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.tabCurrent} index={1}>
            <View className="tab-item">标签页二的内容</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.tabCurrent} index={2}>
            <View className="tab-item">标签页三的内容</View>
          </AtTabsPane>
        </AtTabs>
        {/* <Image
          className="index-image"
          src="http://m.qpic.cn/psc?/V52Y80us2CqO3j0smwyw3SzevE21vJxr/ruAMsa53pVQWN7FLK88i5h*MehgkvxmZiuG5Mgkjh79GP8m4UzCgJz5.NUGo4sJuriXX6BS8uCWig9J49lCJBql9g3mwPhdxCalnGsZtVrc!/mnull&bo=0AIABQAAAAABB*c!&rf=photolist&t=5"
        /> */}
        <AtTabBar
          tabList={[
            { title: "动态发布", iconType: "home", text: "new" },
            { title: "往期回顾", iconType: "bullet-list" },
            { title: "关于我们", iconType: "user" }
          ]}
          fixed="true"
          onClick={this.pageClick.bind(this)}
          current={this.state.pageCurrent}
        />
      </View>
    );
  }
}
