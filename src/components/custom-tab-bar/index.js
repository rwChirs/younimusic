import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { structureLogClick } from "../../utils/common/logReport";
import { px2vw } from "../../utils/common/utils";
import utils from "../../pages/login/util";
import "./index.scss";

const app = Taro.getApp().$app;
export default class CustomTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      random1: -1,
      random2: 1,
      isIpx: app.globalData.isIphoneX,
      canUse: app.globalData.canUseCustomTabBar,
    };
  }
  tabList = [
    // {
    //   name: '到店',
    //   // selectedIconPic:
    //   //   'https://m.360buyimg.com/img/jfs/t1/131659/37/4504/13575/5f0ec02cE56c2a8e8/7ca4b8786cd84f4f.gif',
    //   selectedIcon:
    //     'https://m.360buyimg.com/img/jfs/t1/150315/20/9421/3670/5f7072e0E0a0c56be/595e62b82ebcf562.png',
    //   iconPath:
    //     'https://m.360buyimg.com/img/jfs/t1/153761/40/919/1822/5f7072c3Eb8403e04/2100990a8c42b5a7.png',
    //   path: '/pages/arrivedStore/arrivedStore',
    // },
    {
      name: "",
      selectedName: "首页",
      // selectedIconPic:
      //   'https://m.360buyimg.com/img/jfs/t1/130646/31/3795/25035/5f04092eE307de680/3425946119a97dc1.gif',
      selectedIcon:
        "https://m.360buyimg.com/img/jfs/t1/130913/4/10622/15109/5f6aa9d8Ea18b6dc7/cf4aaad9ed9d8069.png",
      iconPath:
        "https://m.360buyimg.com/img/jfs/t1/128813/17/13279/1157/5f6aaa2cE5a72c552/b9168e8f99188f2d.png",
      path: "/pages/index/index",
    },
    {
      name: "分类",
      selectedName: "分类",
      // selectedIconPic:
      //   'https://m.360buyimg.com/img/jfs/t1/119643/36/16902/12782/5f6a0436Eee981331/d548af4e1609006d.gif',
      selectedIcon:
        "https://m.360buyimg.com/img/jfs/t1/130210/9/10709/3974/5f6aab13Ebe2691dd/7680ad175a95d32b.png",
      iconPath:
        "https://m.360buyimg.com/img/jfs/t1/136128/19/10652/1439/5f6aab1fE6d64cc6c/f6947167e8ed9c2d.png",
      path: "/pages/category/index",
    },
    {
      name: "7CLUB",
      selectedName: "7CLUB",
      // selectedIconPic:
      //   'https://m.360buyimg.com/img/jfs/t1/148994/25/9387/12782/5f707257E8b7b68b5/5d1864ccd459ccdf.gif',
      selectedIcon:
        "https://m.360buyimg.com/img/jfs/t1/128699/38/13269/6861/5f6b057fE2eca7027/24bf506598ff4bac.png",
      iconPath:
        "https://m.360buyimg.com/img/jfs/t1/114226/4/18484/6657/5f6b0568E70514cd3/df6f7b0a315166c6.png",
      path: "/pages/center-tab-page/index",
    },
    {
      name: "购物车",
      selectedName: "购物车",
      selectedIcon:
        "https://m.360buyimg.com/img/jfs/t1/137696/22/9093/4086/5f6aaaf0E8b1a7267/cbf8b9bf6379c121.png",
      iconPath:
        "https://m.360buyimg.com/img/jfs/t1/137477/5/10558/2323/5f6aaaddE4b7dfa33/c9ba1f9528b0d69e.png",
      path: Taro.getApp().$app.h5RequestHost + `/cart.html?from=miniapp`,
    },
    {
      name: "个人中心",
      selectedName: "个人中心",
      // selectedIconPic:
      //   'https://m.360buyimg.com/img/jfs/t1/145072/24/9436/11693/5f707246Eb329b571/b9e7ced3c06e9bf2.gif',
      selectedIcon:
        "https://m.360buyimg.com/img/jfs/t1/120568/13/13342/4724/5f6aab83Efa84eaf1/1769bec77bbe329a.png",
      iconPath:
        "https://m.360buyimg.com/img/jfs/t1/145751/39/9043/2933/5f6aab77Ef00d9c60/7b1b405f7b1dffad.png",
      path: "/pages/my/index",
    },
  ];
  loadPic =
    "https://m.360buyimg.com/img/jfs/t1/129535/3/13648/93859/5f70726bE741a43bc/a8a3210f13288c6c.gif";
  load =
    "https://m.360buyimg.com/img/jfs/t1/143051/4/2464/15141/5f0565c5E4982a37d/76d523cd10586fce.png";

  componentWillMount() {}

  onSwitchTab(index) {
    const { onFlag, current } = this.props;
    let eventId, eventName;
    if (index === 0) {
      if (current) {
        this.props.onSwitchTab();
        if (onFlag) {
          this.setState({
            random2: Math.ceil(Math.random() * 400),
          });
        } else {
          this.setState({
            random1: Math.ceil(Math.random() * 300),
          });
        }
      } else {
        Taro.setStorageSync("clickIndexTab", true);
        Taro.switchTab({
          url: this.tabList[index].path,
        });
        this.setState({
          random1: Math.ceil(Math.random() * 200),
        });
        /*
         * https://cf.jd.com/pages/viewpage.action?pageId=379942859
         */
        eventId = "MiniAPP_BottomNavigation_HomePage";
        eventName = "小程序首页底部导航首页按钮";
        structureLogClick({
          eventId: eventId,
          eventName: eventName,
          owner: "zmh",
          jsonParam: {
            clickType: "-1",
            pageId: "0001",
            pageName: "首页",
            clickId: eventId,
          },
        });
      }
    } else if (index === 3 && this.state.canUse) {
      this.goCart();
    } else {
      Taro.switchTab({
        url: this.tabList[index].path,
      });
      this.setState({
        random1: Math.ceil(Math.random() * 100),
      });
    }
  }

  /**
   * 去购物车
   */
  goCart = () => {
    let uuid = "";
    const exportPoint2 = Taro.getStorageSync("exportPoint");
    if (
      exportPoint2 &&
      typeof exportPoint2 === "string" &&
      exportPoint2 !== "{}"
    ) {
      uuid = JSON.parse(exportPoint2).openid;
    }
    const lbsData = Taro.getStorageSync("addressInfo") || {};

    utils.navigateToH5({
      page:
        Taro.getApp().h5RequestHost +
        `/cart.html?from=miniapp&source=index&storeId=${
          this.state.storeId
        }&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${
          lbsData && lbsData.tenantId
        }`,
    });

    /*
     * https://cf.jd.com/pages/viewpage.action?pageId=379942859
     */
    structureLogClick({
      eventId: "MiniAPP_BottomNavigation_ShoppingCart",
      eventName: "小程序首页底部导航购物车按钮",
      owner: "zmh",
      jsonParam: {
        clickType: "-1",
        pageId: "0001",
        pageName: "首页",
        clickId: "MiniAPP_BottomNavigation_ShoppingCart",
      },
    });
  };

  render() {
    const { onFlag, selected } = this.props;
    const { random1, random2, isIpx, canUse } = this.state;
    return (
      canUse && (
        <View>
          <View
            className="custom-tab-bar"
            style={{ paddingBottom: isIpx ? px2vw(34) : 0 }}
          >
            {this.tabList &&
              this.tabList.map((item, index) => {
                let src = "",
                  name = "";
                if (selected === index) {
                  if (onFlag && index === 0) {
                    //load
                    src = `${this.loadPic}?t=${random2}`;
                  } else {
                    // src = `${item.selectedIconPic}?t=${random1})`;
                    src = `${item.selectedIcon}?t=${random1})`;
                  }
                  name = item.name;
                } else {
                  src = item.iconPath;
                  name = item.selectedName;
                }
                return (
                  <View
                    className="tabList"
                    key={`${index}`}
                    onClick={this.onSwitchTab.bind(this, index)}
                  >
                    <Image
                      style={{
                        width:
                          index === 0 && name == "" ? px2vw(70) : px2vw(50),
                        height:
                          index === 0 && name == "" ? px2vw(70) : px2vw(50),
                      }}
                      src={src}
                      className="pic"
                      mode="aspectFit"
                      lazyLoad
                    />
                    {name != "" && <Text className="name">{name}</Text>}
                    {!!app.globalData.cartNum && index === 3 && (
                      <View className="tab-cart-num">
                        {app.globalData.cartNum < 100
                          ? app.globalData.cartNum
                          : "99+"}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
          <View className="custom-tab-block"></View>
        </View>
      )
    );
  }
}
