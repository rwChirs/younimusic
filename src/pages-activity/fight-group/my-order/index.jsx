import Taro from "@tarojs/taro";
import React from "react";
import { View, Image, ScrollView } from "@tarojs/components";
import CommonPageComponent from "../../../utils/common/CommonPageComponent";
import MyOrderPanel from "./order-panel";
import { listUsingPOST } from "../utils/api";
import { listNone } from "../utils/images";
import Loading from "../../../components/loading";
import Tab from "./tab";
import "./index.scss";
import { goToLogin } from "../utils/filter";
import FightGoTop from "../components/go-top";
import { exportPoint } from "../../../utils/common/exportPoint";

export default class MyOrder extends CommonPageComponent {
  config = {
    navigationBarTitleText: "拼团订单",
  };

  constructor(props) {
    super(props);

    this.state = {
      // systemInfo: {},
      scrollHeight: 0,
      orderListTab: 0,
      pageIndex: 1,
      pageSize: 20,
      totalElements: 0,
      list: [],
      loadFlag: true,
      noneData: false,
      tabFlag: false,
      isBottom: false,
      userName: "",
      scrollTop: 0,
      pageTop: 0,
      tabSelected: 0,
    };
  }

  componentWillMount() {
    exportPoint(this.$router);
    Taro.hideShareMenu();
    Taro.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.setState({
          // systemInfo: res,
          scrollHeight: res.windowHeight - 44 + "px",
        });
      },
    });
    Taro.getUserInfo().then((res) => {
      this.setState({
        userName: res.userInfo.nickName,
      });
    });
  }
  componentDidMount() {
    this.loadList();
  }

  loadList = (i) => {
    let pageIndex = i ? this.state.pageIndex : 1;
    let { orderListTab, pageSize } = this.state;
    listUsingPOST({
      status: orderListTab,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
      .then((res) => {
        this.setState({
          list: res.pageList
            ? this.state.list.concat(res.pageList)
            : this.state.list,
          totalElements: res.totalCount,
          tabFlag: false,
          loadFlag: false,
        });
        //如果没有数据就直接显示拖底图
        setTimeout(() => {
          this.setState({
            isBottom:
              this.state.list && this.state.list.length === 0 ? true : false,
          });
        }, 500);
      })
      .catch((err) => {
        if (err.code === "3") {
          goToLogin("/pages-activity/fight-group/my-order/index");
        } else {
          this.setState({
            list: [],
            loadFlag: false,
            isBottom: true,
          });
          Taro.showToast({
            title: err ? err.msg : "接口请求失败",
            icon: "none",
            duration: 2000,
          });
          return;
        }
      });
  };

  //滑动到底部触发
  scrollToLower = (e) => {
    if (!this.state.tabFlag) {
      e.stopPropagation();
      console.log("scrollToLower");
      if (this.state.list.length < this.state.totalElements) {
        this.setState(
          {
            loadFlag: true,
            pageIndex: this.state.pageIndex + 1,
          },
          () => {
            this.loadList(this.state.pageIndex);
          }
        );
      } else {
        this.setState({
          noneData: true,
        });
      }
    }
  };

  onTab = (index) => {
    let num = 0;
    if (index == 1) {
      num = 3;
    } else if (index == 2) {
      num = 1;
    } else if (index == 3) {
      num = 2;
    } else {
      num = 0;
    }

    this.setState({
      tabSelected: index,
      orderListTab: num,
      list: [],
      pageIndex: 1,
      loadFlag: true,
      totalElements: 0,
      tabFlag: true,
      noneData: false,
    });
    setTimeout(() => {
      this.loadList();
    }, 10);
  };

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  //页面滚动
  onScroll = (e) => {
    this.setState({
      scrollTop: e.detail.scrollTop,
      pageTop: "",
    });
  };

  //返回顶部
  goTop = () => {
    this.setState({
      pageTop: 0,
    });
  };

  render() {
    let {
      list,
      scrollHeight,
      noneData,
      loadFlag,
      scrollTop,
      pageTop,
      tabSelected,
      isBottom,
    } = this.state;
    return (
      <View className="groupon-home">
        <Tab selected={tabSelected} onClick={this.onTab} />
        <ScrollView
          className="scrollview"
          scrollY
          scrollWithAnimation="true"
          onScrolltolower={this.scrollToLower}
          style={{ height: scrollHeight }}
          onScroll={this.onScroll}
          scroll-top={pageTop}
        >
          <View className="my-order-page">
            {!!list && list !== null && list.length > 0 && (
              <View>
                {this.state.list.map((info, index) => (
                  <MyOrderPanel list={info} key={index} />
                ))}
              </View>
            )}
            {isBottom && (
              <View className="none">
                <Image src={listNone} mode="aspectFit" lazy-load />
                <View className="desc">暂无数据</View>
              </View>
            )}
          </View>
          {noneData && <View className="none-data">没有更多内容了</View>}
        </ScrollView>
        {/* loading动画 */}
        {/* {loadFlag && (
          <View className="loading">
            <View className="bg" />
            <Image
              src={loading}
              mode={"aspectFit"}
              lazy-load={true}
            />
          </View>
        )} */}

        {loadFlag && (
          <Loading
            width={wx.getSystemInfoSync().windowWidth}
            height={wx.getSystemInfoSync().windowHeight}
            tip="加载中..."
          />
        )}

        {/* 置顶 */}
        {scrollTop > 100 && (
          <View
            className="go-top"
            style={{ position: "fixed", right: "15px", bottom: "50px" }}
          >
            <FightGoTop type="goTop" onClick={this.goTop.bind(this)} />
          </View>
        )}
      </View>
    );
  }
}
