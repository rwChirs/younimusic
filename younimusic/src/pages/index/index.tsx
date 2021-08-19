import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton, AtTabBar } from "taro-ui";

import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/icon.scss"; // 字体图标

import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.scss";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = value => {
    this.setState({
      current: value
    });
  };

  render() {
    return (
      <View className="index">
        <Text>Hello world!</Text>
        <AtButton type="primary">I need Taro UI</AtButton>
        <Text>Taro UI 支持 Vue 了吗？</Text>
        <AtButton type="primary" circle={true}>
          支持
        </AtButton>
        <AtButton type="secondary" circle={true}>
          来
        </AtButton>
        {/* <View className="index-bottom"> */}
        <AtTabBar
          tabList={[
            { title: "首页", iconType: "home", text: "new" },
            { title: "分类", iconType: "bullet-list" },
            { title: "关于我们", iconType: "user" }
          ]}
          fixed="true"
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
        {/* </View> */}
      </View>
    );
  }
}
