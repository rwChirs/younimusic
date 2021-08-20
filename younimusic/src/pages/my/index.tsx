import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtIndexes, AtSearchBar } from "taro-ui";

import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/icon.scss"; // 字体图标
import "taro-ui/dist/style/components/tabs.scss"; // 标签tab

// 名单列表
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/indexes.scss";
import "taro-ui/dist/style/components/list.scss";

// 搜索栏
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";

import { filterImg } from "../utils/index";
import personData from "./personneData.json";
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
        ownerImageList: [
          "//m.360buyimg.com/img/jfs/t1/188430/39/19339/311791/611fc7b6Eadb94701/9ad29c78effc45d5.png",
          "//m.360buyimg.com/img/jfs/t1/183236/4/20158/223009/611fbeefE8ec2e916/5a2edac375fd8d62.png",
          "//m.360buyimg.com/img/jfs/t1/181343/19/20113/274392/611fbeefEcd4b88ac/9ba60b775c1197d2.png",
          "//m.360buyimg.com/img/jfs/t1/184738/12/20362/266558/611fbeefEcbd00f5a/a00fdc22af7804bc.png",
          "//m.360buyimg.com/img/jfs/t1/190726/2/18671/325508/611fbeefE602ae675/4324b51d1541472f.png",
          "//m.360buyimg.com/img/jfs/t1/192101/22/18770/304826/611fbeefEf4eed5a8/33e4be1af440ad19.png",
          "//m.360buyimg.com/img/jfs/t1/184062/25/20279/297590/611fbeefEa3046acb/df907fd529a991b8.png"
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
      title: "关于我们",
      path: "/pages/my/index"
    };
  }

  tabClick = value => {
    this.setState({
      tabCurrent: value
    });
  };

  handleActionClick = () => {
    this.scrollIntoView && this.scrollIntoView(key);
  };

  render() {
    const { imageData } = this.state;
    const tabList = [
      { title: "成员名单" },
      { title: "管理团队名单" },
      { title: "舞团简介" }
    ];
    return (
      <View className="my">
        <AtTabs
          current={this.state.tabCurrent}
          // scroll
          tabList={tabList}
          onClick={this.tabClick.bind(this)}
        >
          <AtTabsPane current={this.state.tabCurrent} index={0}>
            <View className="tab-item">
              <View style="height:80vh">
                <AtIndexes
                  list={personData.personnelist}
                  animation={true}
                  onScrollIntoView={fn => {
                    this.scrollIntoView = fn;
                  }}
                >
                  <View className="custom-area">
                    {/* 用户自定义内容 */}
                    <AtSearchBar
                      placeholder="跳转到指定Key"
                      onActionClick={this.handleActionClick.bind(this)}
                    />
                  </View>
                </AtIndexes>
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.tabCurrent} index={1}>
            <View className="tab-item">
              {imageData.ownerImageList.map(value => {
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
              <Text className="tab-item-text">
                舞团建于2020年初，团内已有上百位优秀歌手之多。舞团承接各种婚庆仪式、生日宴会、舞团活动、家族庆典等一系列集体活动，其内容包括优秀的男女主持、现场美妙动人的歌手演唱、以及优秀的助威团等等。
              </Text>
              <Text className="tab-item-text">
                由你音乐舞团对外承接各种活动，同时招收主持、歌手、场控等各种人才。
              </Text>
              <Text className="tab-item-text">
                音乐彰显个性魅力，由你谱写精彩未来！{" "}
              </Text>
              <Text className="tab-item-text">——因为由你，因为有你！——</Text>
            </View>
          </AtTabsPane>
        </AtTabs>

        <CustomTabBar selected={2} />
      </View>
    );
  }
}
