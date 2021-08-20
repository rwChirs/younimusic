import Taro from "@tarojs/taro";
import { Component } from "react";
import { View } from "@tarojs/components";
import { AtTabBar } from "taro-ui";

import "taro-ui/dist/style/components/icon.scss"; // 字体图标
import "taro-ui/dist/style/components/tabs.scss"; // 标签tab
import "./index.scss";

export default class CustomTabBar extends Component<
  { selected: number },
  {
    pageCurrent: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      pageCurrent: props.selected
    };
  }

  pageList = [
    {
      title: "动态发布",
      iconType: "home",
      // selectedIconType: "home",
      text: "new",
      path: "/pages/index/index"
    },
    {
      title: "往期回顾",
      iconType: "bullet-list",
      // selectedIconType: "bullet-list",
      path: "/pages/category/index"
    },
    {
      title: "关于我们",
      iconType: "user",
      // selectedIconType: "user",
      path: "/pages/my/index"
    }
  ];

  pageClick = value => {
    this.setState(
      {
        pageCurrent: value
      },
      () => {
        Taro.switchTab({
          url: this.pageList[value].path
        });
      }
    );
  };

  render() {
    return (
      <View className="index">
        <AtTabBar
          tabList={this.pageList}
          fixed="true"
          onClick={this.pageClick.bind(this)}
          current={this.state.pageCurrent}
        />
      </View>
    );
  }
}
