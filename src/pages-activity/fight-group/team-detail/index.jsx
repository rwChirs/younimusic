import Taro, { getCurrentInstance } from "@tarojs/taro";
import React from "react";
import { View, Image, Text } from "@tarojs/components";
import {
  getNewUserQueryWelfare,
  getGroupListService,
  getUserIsExtensionNew,
  getNewUserApplyWelfare,
  getCheckUserTypeService,
  getGroupSquareService,
  getGroupShareService,
  getQueryTemplate,
  getSaveTemplate,
  getLoginStatus,
} from "@7fresh/api";
import { structureLogClick } from "../../../utils/common/logReport";
import getOpenId from '../../../utils/openId';
import CommonPageComponent from "../../../utils/common/CommonPageComponent";
import ListProduct from "../components/list-product";
import Info from "../components/info";
import LinkInfo from "../components/link-info";
import GoTeam from "../components/go-team";
import CodeModal from "../components/code-modal";
import { checkCircle, like } from "../utils/images";
import Title from "../components/title";
import utils from "../../../pages/login/util";
import ProductScroll from "../components/product-scroll";
import Loading from "../../../components/loading";
import FreshNewBornZone from "../components/floor-new-born-zone";
import { logClick } from "../../../utils/common/logReport";
import {
  fightDetailPost,
  // fightSquarePost,
  getRealUrl,
} from "../utils/api";
import { h5Url } from "../../../utils/common/utils";
import "./index.scss";
import { guessLike } from "../utils/reportPoints";
import getUserStoreInfo from "../../../utils/common/getUserStoreInfo";
import { exportPoint, getExposure } from "../../../utils/common/exportPoint";

export default class TeamDetail extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      logined: false,
      activityId: "",
      storeId: "",
      skuId: "",
      grouponId: "",
      userName: "",
      grouponDetail: null,
      list: [],
      totalElements: 0,
      pageSize: 4,
      pageIndex: 1,
      openType: "",
      grouponList: [],
      isLoad: true,
      shareInfo: {},
      services: ["精选", "低价", "免运费"],
      addressData: null,
      welfareData: {},
      infoFlag: false,
      tenantId: "1",
      remindFlag: false,
      restartFlag: false,
      remindNum: 0,
      tmplIds: "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw",
      subscriptionType: 1,
    };
  }

  alreadyGet = false;

  componentDidMount() {
    //埋点上报
    exportPoint(getCurrentInstance().router);
    // 单点曝光
    getLoginStatus()
      .then((data) => {
        if (Taro.getStorageSync("loginMark")) {
          this.actPoint(data.isNewUser);
        }
        Taro.removeStorageSync("loginMark");
      })
      .catch(() => {
        Taro.setStorageSync("loginMark", 1);
      });

    this.getUserInfo();

    let {
      activityId = "",
      storeId = "",
      skuId = "",
      sID = "",
      grouponId = "",
      scene = "",
    } = getCurrentInstance().router.params;
    skuId = skuId || sID;
    grouponId =
      grouponId === "null" || grouponId === "undefined" || !grouponId
        ? ""
        : grouponId;

    scene = decodeURIComponent(scene);
    console.log("router", getCurrentInstance().router.params, scene);
    if (scene) {
      getRealUrl(scene)
        .then((res) => {
          console.log("scene：", decodeURIComponent(res.code));
          const code = decodeURIComponent(res.code);
          let str = "";
          if (code.indexOf("?") > -1) {
            str = code.split("?")[1];
          } else {
            str = code;
          }
          const data = this.getURLParameter(str);
          console.log("data0000:", data);
          if (data) {
            this.setState(
              {
                activityId: data.activityId,
                storeId: data.storeId,
                skuId: data.skuId,
                grouponId: data && data.grouponId ? data.grouponId : "",
              },
              () => {
                this.pageInit(
                  this.state.activityId,
                  this.state.storeId,
                  this.state.skuId,
                  this.state.grouponId
                );
              }
            );
          } else {
            Taro.showToast({
              title: "网络异常",
              icon: "none",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.pageInit(activityId, storeId, skuId, grouponId);
    }
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getURLParameter = (url) => {
    let theRequest = new Object();
    let strs = url ? url.split("&") : "";
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    // 之前这个方法一直没有返回值
    return theRequest;
  };

  pageInit = (activityId, storeId, skuId, grouponId) => {
    this.getStoreInfo(storeId, "", "", "", 3).then((res) => {
      console.log("getStoreInfo", res);
      this.setState(
        {
          storeId: res && res.storeId ? res.storeId : storeId,
          tenantId: res && res.tenantId ? res.tenantId : this.state.tenantId,
          addressData: res,
        },
        () => {
          this.setState(
            {
              activityId: activityId,
              storeId: this.state.storeId,
              skuId: skuId,
              grouponId: grouponId,
            },
            () => {
              console.log("入参", this.state);
              getUserIsExtensionNew()
                .then((result) => {
                  console.log("333333333", result);
                  this.setState(
                    {
                      logined: result.success,
                    },
                    () => {
                      if (result.success) {
                        this.getGrouponDetail();
                        this.queryStranger();
                        this.getGroupListInfo();
                        this.queryDetailShare();
                        if (result.isNewUser) {
                          this.queryWelfare();
                        }
                        this.getOpenIdFun();
                      } else {
                        this.gotoLogin();
                      }
                    }
                  );
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          );
        }
      );
    });
  };

  // 获取uuid
  getOpenIdFun() {
    getOpenId().then((toUserId) => {
      console.log('toUserId',toUserId)
      this.setState({
        toUserId: toUserId,
      });
    }).catch(err=>{
      console.log(err)
    });
  }

  getUserInfo = () => {
    Taro.getUserInfo()
      .then((res) => {
        this.setState({
          userName: res.userInfo.nickName,
          openType: "share",
          // openType: res.userInfo.nickName ? "share" : "getUserInfo",
        });
      })
      .catch((err) => {
        this.setState({
          // openType: "getUserInfo",
          openType: "share",
        });
        console.log(err);
      });
  };

  getStoreInfo = (storeId, lon, lat, acId, type) => {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then((res) => {
      return res;
    });
  };

  queryDetailShare = () => {
    const { activityId, skuId, storeId, grouponId } = this.state;
    console.log("team-detailShare", activityId, skuId);
    const groupId = grouponId;
    if (!skuId || skuId === "undefined") return;
    const args = {
      activityId,
      skuId,
      storeId,
      groupId,
    };
    getGroupShareService(args)
      .then((res) => {
        if (res) {
          this.setState({
            shareInfo: res,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onShareAppMessage() {
    const { shareInfo, grouponDetail } = this.state;
    let detailUrl = encodeURIComponent(`${shareInfo.appletUrl}`);
    const url = `/pages/index/index?returnUrl=${detailUrl}`;
    const memberLength =
      grouponDetail.grouponMembers && grouponDetail.grouponMembers.length
        ? grouponDetail.grouponMembers.length
        : 0;
    const fightMember = grouponDetail.grouponScale - memberLength;
    const skuInfoWeb = grouponDetail && grouponDetail.skuInfoWeb;
    const title = `【还差${fightMember}人成团 拼团价${
      skuInfoWeb && skuInfoWeb.grouponPrice
    }元 原价${skuInfoWeb && skuInfoWeb.basePrice}元 ${
      skuInfoWeb && skuInfoWeb.skuName
    }`;
    return {
      // title: `${
      //   this.state.userName ? this.state.userName : ""
      // }邀请您参加拼团，${shareInfo.shareTitle}，快来一起参与吧～`,
      // title: shareInfo.shareTitle,
      title: title,
      // desc: shareInfo.shareDesc,
      desc: "",
      imageUrl: shareInfo.appletImageUrl,
      path: url,
    };
  }

  /**
   * 获取拼团产品详情
   * @param {Number} activityId 活动Id
   * @param {Number} storeId 地址Id
   * @param {Number} skuId 商品Id
   * @param {Number} grouponId 拼团Id
   */
  getGrouponDetail = () => {
    const { activityId, storeId, skuId, grouponId } = this.state;

    fightDetailPost({
      activityId,
      storeId,
      skuId,
      grouponId,
    })
      .then((res) => {
        console.log("grouponDetail", res);
        if (res) {
          this.setState({
            grouponDetail: res ? res : {},
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.setState({
      isLoad: false,
    });
  };

  //去登陆页
  gotoLogin = () => {
    let { activityId, skuId, storeId, grouponId } = this.state;
    const returnPage = `/pages-activity/fight-group/team-detail/index?storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}&activityId=${activityId}`;
    utils.gotoLogin(returnPage, "redirectTo");
  };

  /**
   * 查询拼团广场
   * @param {Number} activityId 活动Id
   * @param {Number} storeId 地址Id
   * @param {Number} skuId 商品Id
   */
  queryStranger = () => {
    const { activityId, storeId, skuId } = this.state;
    const args = { activityId, storeId, skuId };
    getGroupSquareService(args)
      .then((res) => {
        let content =
          res && res.grouponingInfoList ? res.grouponingInfoList : [];
        this.setState({
          grouponList: content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*
   * 请求拼团列表数据
   * 有storeId优先请求，没有就请求经纬度
   * */

  getGroupListInfo = (i) => {
    console.log(i);
    // let pageNo = i ? this.state.pageIndex : 1;

    let { storeId, pageIndex, pageSize } = this.state;
    const params = {
      storeId,
      grouponType: 1,
      pageIndex,
      pageSize,
    };
    getGroupListService(params)
      .then((res) => {
        if (res && res.success) {
          this.setState({
            list: res.skuInfoWebs,
            totalElements: res.totalElements,
          });
        } else {
          this.setState({
            list: [],
          });
          Taro.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkUser = (joinType, activityId) => {
    const args = {
      joinType,
      activityId,
    };
    return getCheckUserTypeService(args)
      .then((res) => {
        if (res.status !== 0) {
          Taro.showToast({
            title: res && res.desc,
            icon: "none",
          });
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //进入详情
  goToDetail = (info, e) => {
    let { activityId, storeId, skuId } = this.state;
    if (info.activityId && info.skuId) {
      activityId = info.activityId;
      skuId = info.skuId;
      logClick({ e, eid: guessLike, eparam: { skuId } });
    }
    if (this.alreadyGet) {
      this.subscribe();
    }
    Taro.navigateTo({
      url: `/pages-activity/fight-group/detail/index?activityId=${activityId}&storeId=${storeId}&skuId=${skuId}`,
    });
  };

  /**
   * 进入结算页
   */
  goToCart = (info, desc) => {
    // console.log('info:', info);
    if (desc === "share") {
      //邀请好友
      this.getUserInfo();
    } else {
      //提单
      console.log("*****************goToCart*****************");
      if (this.alreadyGet) {
        this.subscribe();
      }
      this.loadSubmit(info);
    }
  };

  // 订阅
  subscribe() {
    const _this = this;
    Taro.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log("res.subscriptionsSetting", res.subscriptionsSetting);
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          // 状态1 订阅消息总开关是开的
          console.log("状态1 订阅消息总开关是开的");
          _this.setState({
            remindFlag: true,
          });
          if (res.subscriptionsSetting.itemSettings) {
            if (
              res.subscriptionsSetting.itemSettings[
                "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"
              ] == "accept"
            ) {
              // 状态4 勾选了“不再询问”并且选项是允许
              console.log("状态4 勾选了“不再询问”并且选项是允许");
              _this.setState({
                remindFlag: false,
              });
              wx.requestSubscribeMessage({
                tmplIds: ["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"],
                success: function (data) {
                  console.log("44444", data);
                  if (
                    data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                    "accept"
                  ) {
                    _this.setState({
                      subscriptionType: 3,
                    });
                    _this.getQueryTemplateFunc();
                  }
                },
                fail(data) {
                  console.log("fail", data);
                },
              });
            } else if (
              res.subscriptionsSetting.itemSettings[
                "6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"
              ] == "reject"
            ) {
              // 状态5 勾选了“不再询问”并且选项是取消
              console.log("状态5 勾选了“不再询问”并且选项是取消");
              _this.setState({
                remindFlag: false,
                subscriptionType: 1,
              });
            }
          } else {
            // 状态3 没有勾选“不再询问”  单次
            console.log("状态3 没有勾选“不再询问”");
            console.log(_this.state.welfareData);
            // if(_this.state.welfareData && _this.state.welfareData.couponCodes){
            wx.requestSubscribeMessage({
              tmplIds: ["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"],
              success: function (data) {
                console.log("33333", data);
                _this.setState({
                  remindFlag: false,
                });
                if (
                  data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                  "reject"
                ) {
                  _this.alreadyGet = false;
                }
                if (
                  data["6jUyr8cI4dKRa0ISf6TuRYP0X3P1RoCVZEuPQXPSPbw"] ==
                  "accept"
                ) {
                  // 第一次弹框  第二次不弹框
                  _this.setState(
                    {
                      remindNum: _this.state.remindNum + 1,
                      subscriptionType: 2,
                    },
                    () => {
                      console.log("44444", _this.state.remindNum);
                      if (_this.state.remindNum < 2) {
                        _this.setState({
                          restartFlag: true,
                        });
                      } else {
                        _this.alreadyGet = false;
                      }
                      _this.getQueryTemplateFunc();
                    }
                  );
                }
              },
              fail(data) {
                _this.setState({
                  remindFlag: false,
                });
                console.log("333fail", data);
              },
            });
            // }else {
            // _this.setState({
            //   remindFlag: false,
            // })
            // }
          }
        } else {
          // 状态2 订阅消息总开关是关的
          console.log("状态2 订阅消息总开关是关的");
          Taro.openSetting();
        }
      },
    });
  }

  // 查询用户的订阅类型
  getQueryTemplateFunc = () => {
    const { tmplIds, toUserId } = this.state;
    const params = {
      templateId: tmplIds,
      toUser: toUserId,
    };
    getQueryTemplate(params)
      .then((res) => {
        console.log("getQueryTemplate", res.data);
        this.getSaveTemplate();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 用户订阅模版内容
  getSaveTemplate = () => {
    const { tmplIds, toUserId, welfareData, subscriptionType } = this.state;
    const args = {
      templateId: tmplIds,
      subscriptionType: subscriptionType,
      notifyChannel: 1,
      toUser: toUserId,
      businessIds: welfareData.couponCodes,
    };
    getSaveTemplate(args)
      .then((res) => {
        console.log("getSaveTemplate", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //我也要开团
  onOpenTeam = () => {
    const { activityId, storeId, skuId } = this.state;
    const url =
      "/pages-activity/fight-group/detail/index?activityId=" +
      activityId +
      "&storeId=" +
      storeId +
      "&skuId=" +
      skuId +
      "&grouponId=";
    Taro.navigateTo({
      url: url,
    });
  };

  loadSubmit = (info) => {
    console.log("**", info);
    const { activityId } = this.state;

    if (info && info.grouponId) {
      //拼团广场提单
      this.checkUser(2, activityId).then((res) => {
        console.log("参团", res);
        if (res) {
          return;
        } else {
          this.submitData(info);
        }
      });
    } else {
      this.checkUser(1, activityId).then((res) => {
        console.log("开团", res);
        if (res) {
          return;
        } else {
          this.submitData();
        }
      });
    }
  };

  submitData = (info) => {
    let grouponId = this.state.grouponId;
    let joinType = 1;
    const { logined, storeId, skuId, activityId, grouponDetail } = this.state;
    if (info && info.grouponId) {
      grouponId = info.grouponId;
      joinType = 2;
    }
    if (!logined) {
      utils.gotoLogin(
        `/pages-activity/fight-group/team-detail/index?activityId=${activityId}&storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}`,
        "redirectTo"
      );
      return;
    }
    const params = {
      wareInfos: [
        {
          storeId: storeId,
          skuId: skuId,
          buyNum: grouponDetail.grouponNumber,
          activityId: activityId,
          jdPrice: "",
          marketPrice: "",
        },
      ],
      fightGroupInfo: {
        groupId: grouponId,
        activityId: activityId,
        grouponType: 1,
        joinType: joinType,
      },
      groupRequest: {
        groupId: grouponId,
        activityId: activityId,
        grouponType: 1,
        joinType: joinType,
      },
    };

    console.log(params);

    const orderUrl = `${h5Url}/order.html?storeId=${storeId}&nowBuy=9&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=miniapp&newResource=fightGroup`;
    utils.navigateToH5({ page: orderUrl });
  };

  // 单点曝光
  actPoint = (isNewUser) => {
    this.expPoint(isNewUser);
  };
  expPoint = (isNewUser) => {
    const params = {
      router: getCurrentInstance().router,
      eid: "LoginSource",
      eparam: {
        pageId: "0096",
        pageName: "拼团详情页",
        pentrance: "003",
        pentranceName: "拼团",
        pextra: getCurrentInstance().router.params,
        isNewUser,
        plant: "miniapp",
        eventId: "LoginSource",
      },
    };
    console.log("单点曝光", params);
    getExposure(params);
  };

  // 返回七鲜首页
  goHome = () => {
    /*
     * https://cf.jd.com/pages/viewpage.action?pageId=351653625
     * 20201203 zmh
     */
    structureLogClick({
      eventId: "group_NewGiftBag_assembly",
      eventName: "拼团-新人礼包组件",
      jsonParam: {
        clickType: "-1",
        pageId: "0096",
        pageName: "小程序拼团详情页",
        tenantId: `${this.state.tenantId}`,
        storeId: `${this.state.storeId}`,
        platformId: "1",
        clickId: "group_NewGiftBag_assembly",
      },
    });
    Taro.switchTab({
      url: "/pages/index/index?teamFlag=newUser",
    });
  };

  //查询新人礼包详情
  queryWelfare() {
    const params = {};
    let storeId = this.state.storeId || 131229; // 默认大族 避免页面空白

    getNewUserQueryWelfare(params, storeId)
      .then((data) => {
        if (data) {
          this.setState(
            {
              welfareData: data,
              infoFlag:
                data && (data.totalAmount == null || data.alreadyGetCoupon)
                  ? false
                  : true,
            },
            () => {
              this.newBornZoneExposure();
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  newBornZoneExposure = () => {
    const params = {
      eid: "7FRESH_APP_9_20200811_1597153579446|78",
    };
    getExposure(params);
  };

  // 领取新人专区优惠券
  getCoupon = () => {
    if (this.state.logined) {
      getNewUserApplyWelfare({}).then((res) => {
        /*
         * https://cf.jd.com/pages/viewpage.action?pageId=351653625
         * 20201203 zmh
         */
        structureLogClick({
          eventId: "group_NewGiftBag_Receive",
          eventName: "拼团-新人礼包弹窗",
          jsonParam: {
            clickType: "-1",
            pageId: "0096",
            pageName: "小程序拼团详情页",
            tenantId: `${this.state.tenantId}`,
            storeId: `${this.state.storeId}`,
            platformId: "1",
            clickId: "group_NewGiftBag_Receive",
          },
        });
        if (res) {
          const msg = res.msg || "";
          if (res.success) {
            this.setState(
              {
                infoFlag: false,
                welfareData: res,
              },
              () => {
                Taro.showToast({
                  title: msg || "恭喜，领取成功",
                  icon: "none",
                  duration: 2000,
                });
              }
            );
          } else {
            Taro.showToast({
              title: msg || "领取失败，请重试",
              icon: "none",
              duration: 2000,
            });
          }
        }
      });
    } else {
      utils.gotoLogin("/pages/index/index", "redirectTo");
    }
  };

  onGetCouponClose = () => {
    // this.getCoupon();
    if (this.state.logined) {
      this.alreadyGet = true;
      getNewUserApplyWelfare({}).then((res) => {
        /*
         * https://cf.jd.com/pages/viewpage.action?pageId=351653625
         * 20201203 zmh
         */
        structureLogClick({
          eventId: "group_NewGiftBag_Receive",
          eventName: "拼团-新人礼包弹窗",
          jsonParam: {
            clickType: "-1",
            pageId: "0096",
            pageName: "小程序拼团详情页",
            tenantId: `${this.state.tenantId}`,
            storeId: `${this.state.storeId}`,
            platformId: "1",
            clickId: "group_NewGiftBag_Receive",
          },
        });
        if (res) {
          const msg = res.msg || "";
          if (res.success) {
            this.setState(
              {
                infoFlag: false,
                welfareData: res,
              },
              () => {
                Taro.showToast({
                  title: msg || "恭喜，领取成功",
                  icon: "none",
                  duration: 1000,
                });
              }
            );
            console.log("this.alreadyGet", this.alreadyGet);
            if (this.alreadyGet) {
              this.subscribe();
            }
          } else {
            Taro.showToast({
              title: msg || "领取失败，请重试",
              icon: "none",
              duration: 2000,
            });
          }
        }
      });
    } else {
      utils.gotoLogin("/pages/index/index", "redirectTo");
    }
  };

  onClose = () => {
    this.setState({
      restartFlag: false,
      remindFlag: true,
    });
    this.subscribe();
  };

  render() {
    let {
      grouponDetail,
      list,
      grouponList,
      isLoad,
      services,
      openType,
      welfareData,
      infoFlag,
      remindFlag,
      restartFlag,
    } = this.state;

    return (
      <View className="team-detail-page">
        {isLoad && (
          <Loading
            width={wx.getSystemInfoSync().windowWidth}
            height={wx.getSystemInfoSync().windowHeight}
            tip="加载中..."
          />
        )}
        {grouponDetail && grouponDetail.skuInfoWeb && (
          <View className="team-detail-bg" />
        )}
        <View
          className="team-detail-main"
          style={{
            marginTop:
              grouponDetail && grouponDetail.skuInfoWeb ? null : "0rpx",
          }}
        >
          {grouponDetail && grouponDetail.skuInfoWeb && (
            <View className="team-detail-top-card">
              <ListProduct
                resource="detail"
                info={grouponDetail}
                openType={openType}
                onGoDetail={this.goToDetail.bind(this)}
                onClick={this.goToDetail.bind(this)}
              />
              <View className="team-detail-top-desc">
                {services.map((info, index) => {
                  return (
                    <View className="rule" key={index}>
                      <Image className="icon" src={checkCircle} />
                      <Text className="word">{info}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {grouponDetail && (
            <Info
              openType={openType}
              info={grouponDetail}
              resource="team-detail"
              onClick={this.goToCart.bind(this)}
              onOpenTeam={this.onOpenTeam.bind(this)}
            />
          )}

          {/** 和别人一起拼 */}
          {grouponList &&
            grouponList.length > 0 &&
            grouponDetail &&
            grouponDetail.grouponMembers &&
            grouponDetail.grouponScale - grouponDetail.grouponMembers.length ===
              0 && (
              <View className="go-to-fight">
                <View className="title">
                  <Title
                    title="和别人一起拼"
                    isHaveIcon
                    margin={26.5}
                    color="#252525"
                    lineWidth={37}
                    fontSize={15}
                  />
                </View>

                {/* 少于4个不滚动 */}
                {grouponList.length <= 4 ? (
                  grouponList.map((item, index) => {
                    return (
                      <View className="go-team-modal" key={index}>
                        <GoTeam
                          info={item}
                          onClick={this.goToCart.bind(this)}
                        />
                      </View>
                    );
                  })
                ) : (
                  <ProductScroll
                    type="team-detail"
                    list={grouponList}
                    onClick={this.goToCart.bind(this)}
                  />
                )}
              </View>
            )}

          {/* 新人红包楼层 */}
          {welfareData &&
            welfareData.coupons &&
            welfareData.coupons.length > 0 && (
              <View className="new-born-zone-con">
                <FreshNewBornZone
                  data={welfareData}
                  onGetCoupon={this.getCoupon}
                  onGoHome={this.goHome}
                />
              </View>
            )}

          {/* 邀新团弹框 */}
          <CodeModal
            type={5}
            show={infoFlag}
            openType=""
            totalAmount={welfareData.totalAmount}
            onClick={this.onGetCouponClose.bind(this)}
          />

          <CodeModal type={6} show={remindFlag} />
          <CodeModal
            type={7}
            show={restartFlag}
            openType=""
            onClose={this.onClose.bind(this)}
          />

          {/** 猜你喜欢 */}
          <View className="team-detail-link">
            <Image src={like} className="fight-link" />
            <LinkInfo list={list} onClick={this.goToDetail.bind(this)} />
            <View className="fight-list-bottom">没有更多了~</View>
          </View>
        </View>
      </View>
    );
  }
}
