import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import {
  getDeliveryWareTip,
  getSkuDetailAddressService,
  getUserDefaultAddressService,
  getChangeAddressService,
  getTenantShopService,
  getLimitMaxNum,
  getCheckUserTypeService,
  getUserIsExtensionNew,
  getGroupListService,
  getDetailButtonService,
  getGroupSquareService,
  getGroupShareService,
  getLoginStatus,
} from '@7fresh/api';
import FreshWarmPrompt from '../../../components/FreshWarmPrompt';
import { structureLogClick } from '../../../utils/common/logReport';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import CustomSwiper from '../../../components/custom-swiper';
import CountDown from '../../../components/count-down';
import FightTip from '../components/tip';
import CellTitle from '../components/cell-title';
import GoTeamEasy from '../components/go-team-easy';
import SendTo from '../../components/send-to';
import FightDetailBtn from '../components/fight-detail-btn';
import TodayList from '../components/today-list';
import BottomTip from '../components/bottom-tip';
import CodeModal from '../components/code-modal';
import GoTop from '../../../components/go-top';
import ProductScroll from '../components/product-scroll';
import Loading from '../../../components/loading';
import utils from '../../../pages/login/util';
import ProductDetail from '../../../components/product-detail';
import SwitchShopModal from '../../../components/switch-shop-modal';
import SwitchAddressModal from '../../../components/switch-address-modal';
import {
  redTip,
  circle,
  productDefaultPicture,
  listNone,
  defaultLogo,
} from '../utils/images';
import './index.scss';
import {
  fightDetailPost,
  // fightSquarePost,
  getSkuDetail,
  getRealUrl,
} from '../utils/api';
import {
  h5Url,
  getReadlyAddressList,
  getURLParameter,
} from '../../../utils/common/utils';
import { leftBottomShare, question, goFight } from '../utils/reportPoints';
import AddressSelectModal from '../components/address-select-modal';
import getUserStoreInfo, {
  saveAddrInfo,
} from '../../../utils/common/getUserStoreInfo';
import { exportPoint, getExposure } from '../../../utils/common/exportPoint';
import { logClick } from '../../../utils/common/logReport';

export default class Detail extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      //集合变量
      systemInfo: {},
      grouponDetail: {},
      grouponList: [],
      list: [], //今日列表
      button: {},
      addressList: [],
      failAddressList: [],
      shareInfo: {},
      detail: {},
      tenantData: {}, //当前租户信息
      tenantShopInfo: [], //租户列表
      pageStyle: {
        position: 'auto',
        height: 'auto',
        overflow: 'auto',
      },

      //状态变量
      logined: false,
      infoFlag: false,
      squareFlag: false,
      popup: {
        show: false,
        height: 400,
      },
      forbidScrollFlag: false,
      overFlag: false,
      isLoad: true,
      addressModelShow: false,
      isAddrFlag: false,

      //普通变量
      endTime: 0,
      scrollHeight: 0,
      pageIndex: 1,
      pageSize: 20,
      currentStep: 1,
      totalElements: 0,
      cancelType: 0,
      backTop: false,
      modalScrollTop: 0,
      activityId: '',
      skuId: '',
      storeId: '',
      grouponId: '',
      openType: '',
      services: ['精选', '低价', '优质'],
      userName: '',
      address: {
        //SendTo页面地址栏显示信息
        addressId: '',
        lat: '',
        lon: '',
        fullAddress: '请选择地址',
      },
      statusDesc: '拼团已结束',
      isFirstShow: true,
      deliveryStatusTip: '', // 配送状态提醒
      deliveryStatus: true, // 配送产能和自提产能均满的情况下为false，用来判断开团按钮是否置灰
      lbsData: Taro.getStorageSync('addressInfo') || {},
      localAddress: '',
      tenantId: '1',
      source: '',
      beforeFilterAddressNum: '', //过滤前总地址数量（现有地址数量）
      baseAddressNum: '',
      todayGroupFlag: true,
    };
  }

  scrollTop = 0;

  getStoreInfo(storeId, lon, lat, acId, type) {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then((res) => {
      return res;
    });
  }

  componentDidShow() {
    console.log('componentDidShow');
    if (!this.state.isFirstShow) {
      this.init();
    } else {
      this.setState({
        isFirstShow: false,
      });
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    // 单点曝光
    getLoginStatus()
      .then((data) => {
        if (Taro.getStorageSync('loginMark')) {
          this.actPoint(data.isNewUser);
        }
        Taro.removeStorageSync('loginMark');
      })
      .catch(() => {
        Taro.setStorageSync('loginMark', 1);
      });

    Taro.hideShareMenu();
    this.getUserInfo();
    this.init();
  }

  init = () => {
    let {
      activityId = '',
      storeId = '',
      skuId = '',
      sID = '',
      grouponId = '',
      scene = '',
      source = '',
    } = getCurrentInstance().router.params;
    if (grouponId === 'undefined' || grouponId === 'null') {
      grouponId = '';
    }
    //scene:3.cn/l6GjPs2
    skuId = skuId || sID;
    scene = decodeURIComponent(scene);
    console.log('router', getCurrentInstance().router.params);
    if (scene) {
      getRealUrl(scene)
        .then((res) => {
          console.log('scene：', decodeURIComponent(res.code));
          const code = decodeURIComponent(res.code);
          let str = '';
          if (code.indexOf('?') > -1) {
            str = code.split('?')[1];
          } else {
            str = code;
          }
          const data = getURLParameter(str);
          console.log('data:', data);
          if (data) {
            this.setState(
              {
                activityId: data.activityId,
                storeId: data.storeId,
                skuId: data.skuId,
                grouponId: data.groupId ? data.groupId : '',
              },
              () => {
                console.log(this.state);
                this.pageInit();
              }
            );
          } else {
            Taro.showToast({
              title: '网络异常',
              icon: 'none',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState(
        {
          activityId,
          storeId,
          skuId,
          grouponId,
          source,
        },
        () => {
          this.pageInit();
        }
      );
    }
  };

  getUserInfo = () => {
    Taro.getUserInfo()
      .then((res) => {
        this.setState({
          userName: res.userInfo.nickName,
          openType: 'share',
          // openType: res.userInfo.nickName ? "share" : "getUserInfo",
        });
      })
      .catch((err) => {
        this.setState({
          // openType: "getUserInfo",
          openType: 'share',
        });
        console.log(err);
      });
  };

  pageInit = () => {
    /** 判断从新建地址回来更新门店id和经纬度 start */
    let {
      lat = '',
      lon = '',
      storeId = '',
    } = getCurrentInstance().router.params;
    let createAddress = Taro.getStorageSync('createAddress');
    if (createAddress === 1) {
      Taro.setStorageSync('createAddress', '');
      let addressInfo = Taro.getStorageSync('addressInfo') || {};
      lon = (addressInfo && addressInfo.lng) || '';
      lat = (addressInfo && addressInfo.lat) || '';
      storeId = addressInfo && addressInfo.storeId;
    }
    //没有走三公里定位
    this.getStoreInfo(storeId, lon, lat, '', 3).then((res) => {
      console.log('getStoreInfo', res);
      this.setState(
        {
          storeId: res.storeId ? res.storeId : storeId,
          tenantData: (res && res.tenantInfo) || {},
          tenantShopInfo: (res && res.tenantShopInfo) || [],
        },
        () => {
          if (res.addressExt) {
            // 已登录，且默认地址storeId，与小程序和APP的url中storeId不匹配
            if (this.state.storeId.toString() === res.storeId.toString()) {
              const addressInfo = {
                lon: res.lon,
                lat: res.lat,
                fullAddress:
                  (res.addressSummary || '') +
                  (res.addressExt || '') +
                  (res.where || ''),
                addressId: res.addressId,
              };

              this.setState(
                {
                  address: addressInfo,
                },
                () => {
                  this.handInit();
                }
              );
            }
          } else {
            this.getUserDefaultAddress();
          }
        }
      );
    });
  };

  handInit = () => {
    getUserIsExtensionNew()
      .then((res) => {
        this.setState(
          {
            logined: res.success,
          },
          () => {
            this.loadInit();
          }
        );
      })
      .catch(() => {
        this.setState({
          logined: false,
        });
      });
  };

  // 单点曝光
  actPoint = (isNewUser) => {
    this.expPoint(isNewUser);
  };
  expPoint = (isNewUser) => {
    const params = {
      router: getCurrentInstance().router,
      eid: 'LoginSource',
      eparam: {
        pageId: '0095',
        pageName: '拼团商品详情',
        pentrance: '003',
        pentranceName: '拼团',
        pextra: getCurrentInstance().router.params,
        isNewUser,
        plant: 'miniapp',
        eventId: 'LoginSource',
      },
    };
    console.log('单点曝光', params);
    getExposure(params);
  };

  //获取租户信息
  getTenantShop = () => {
    const { storeId, lbsData } = this.state;
    getTenantShopService({
      storeId,
      tenantId: lbsData.tenantId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({
            tenantData: res.tenantShopInfo,
          });
        } else {
          Taro.showToast({
            title: res.msg || '接口请求错误',
            icon: 'none',
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //渲染页面
  loadInit = () => {
    let { activityId = null, storeId = null, skuId = null } = this.state;

    this.getGrouponDetail();
    this.getGroupListInfo(1);
    this.getSkuDetail();
    this.queryStranger(activityId, storeId, skuId);
    this.queryDetailShare();
    this.getDeliveryWareTip(skuId); // 获取配送状态提醒
    this.checkGrouponButton();
    this.getTenantShop();
    this.getUserAddress(storeId, skuId, activityId);
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          systemInfo: res,
          scrollHeight: res.windowHeight,
        });
      },
    });
  };

  onShareAppMessage() {
    const { shareInfo, grouponDetail, button } = this.state;

    //商品详情url
    if (shareInfo.appletProductDetailUrl.indexOf('?') !== -1) {
      shareInfo.appletProductDetailUrl =
        shareInfo.appletProductDetailUrl +
        `&from=miniapp&entrancedetail=009_${this.state.storeId}_20191219006`;
    } else {
      shareInfo.appletProductDetailUrl =
        shareInfo.appletProductDetailUrl +
        `?from=miniapp&entrancedetail=009_${this.state.storeId}_20191219006`;
    }
    let detailUrl = encodeURIComponent(`${shareInfo.appletProductDetailUrl}`);
    const url = `/pages-activity/fight-group/list/index?returnUrl=${detailUrl}`;
    let fightMember = 1;
    const memberLength =
      grouponDetail.grouponMembers && grouponDetail.grouponMembers.length
        ? grouponDetail.grouponMembers.length
        : 0;
    const skuInfoWeb = grouponDetail && grouponDetail.skuInfoWeb;
    if (button.option === 1) {
      //开团
      fightMember = grouponDetail.grouponScale;
    } else {
      fightMember = grouponDetail.grouponScale - memberLength;
    }
    const title = `【还差${fightMember}人成团】拼团价${
      skuInfoWeb && skuInfoWeb.grouponPrice
    }元 原价${skuInfoWeb && skuInfoWeb.basePrice}元 ${
      skuInfoWeb && skuInfoWeb.skuName
    }`;
    return {
      // title: `${
      //   this.state.userName ? this.state.userName : ""
      // }邀请您参加拼团，${
      //   shareInfo.shareTitle ? `${shareInfo.shareTitle}，` : ""
      // }快来一起参与吧～`,
      // title: shareInfo.shareTitle,
      title: title,
      // desc: shareInfo.shareDesc,
      desc: '',
      imageUrl: shareInfo.appletImageUrl,
      path: url,
    };
  }

  /**
   * 获取商品图文详情
   */
  getSkuDetail = () => {
    getSkuDetail(this.state.skuId, this.state.storeId).then((res) => {
      this.setState({
        detail: res,
      });
    });
  };

  queryDetailShare = () => {
    const { activityId, skuId, storeId, grouponId } = this.state;
    console.log('detail-detailShare', activityId, skuId);
    const groupId =
      grouponId === 'null' || grouponId === 'undefined' ? '' : grouponId;
    if (!skuId || skuId === 'undefined') return;
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

  /**
   * 获取用户地址
   * @param {Number} storeId 店铺Id
   */
  getUserDefaultAddress = () => {
    getUserDefaultAddressService()
      .then((res) => {
        if (res && res.success) {
          console.log('进入获取默认地址逻辑', res);
          const defaultAddress = res.defaultAddress;
          const { lbsData } = this.state;
          if (lbsData && lbsData.storeId !== defaultAddress.storeId) {
            this.setState({
              address: {
                ...this.state.address,
                addressId: lbsData.addressId,
                lat: lbsData.lat,
                lon: lbsData.lon,
                fullAddress: lbsData.sendTo,
              },
            });
          } else {
            this.setState({
              address: {
                ...this.state.address,
                addressId: defaultAddress.addressId,
                fullAddress:
                  (defaultAddress.addressSummary
                    ? defaultAddress.addressSummary
                    : '') +
                  (defaultAddress.addressExt ? defaultAddress.addressExt : '') +
                  (defaultAddress.where ? defaultAddress.where : ''),
                lat: defaultAddress.lat,
                lon: defaultAddress.lon,
              },
            });
          }
        }
        this.loadInit();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * 获取拼团产品详情
   * @param {Number} activityId 活动Id
   * @param {Number} storeId 地址Id
   * @param {Number} skuId 商品Id
   * @param {Number} grouponId 拼团Id
   */
  getGrouponDetail = () => {
    let { activityId, storeId, skuId, grouponId } = this.state;
    grouponId =
      grouponId === 'null' || grouponId === 'undefined' ? '' : grouponId;
    console.log('state', this.state);
    fightDetailPost({
      activityId,
      storeId,
      skuId,
      grouponId,
    })
      .then((res) => {
        console.log('detail', res);
        Taro.showShareMenu();
        if (res == null) {
          this.setState({
            overFlag: true, //活动已结束 code 9996
            isLoad: false,
          });
        } else {
          this.setState({
            grouponDetail: res ? res : {},
            endTime: res.endTime,
            isLoad: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          overFlag: true,
          isLoad: false,
        });
      });
  };

  checkUser = (joinType, activityId) => {
    const args = {
      joinType,
      activityId,
    };
    return getCheckUserTypeService(args).then((res) => {
      console.log('checkUser', res);
      if (res.status !== 0) {
        Taro.showToast({
          title: res && res.desc ? res && res.desc : '网络请求错误',
          icon: 'none',
        });
        return true;
      } else {
        return false;
      }
    });
  };

  /**
   * 查询拼团广场
   * @param {Number} activityId 活动Id
   * @param {Number} storeId 地址Id
   * @param {Number} skuId 商品Id
   */
  queryStranger = (activityId, storeId, skuId) => {
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

  /**
   * 检查按钮状态
   * @param {Number} activityId 活动Id
   * @param {Number} skuId 商品Id
   * @param {Number} grouponId 拼团Id
   */
  checkGrouponButton = () => {
    let { activityId, storeId, skuId, grouponId } = this.state;
    grouponId =
      grouponId === 'null' || grouponId === 'undefined' ? '' : grouponId;
    let params = {};
    if (grouponId) {
      params = {
        activityId: activityId,
        storeId: storeId,
        skuId: skuId,
        grouponId: grouponId,
      };
    } else {
      params = {
        activityId: activityId,
        storeId: storeId,
        skuId: skuId,
      };
    }
    getDetailButtonService(params).then((res) => {
      console.log('button', res);
      if (res) {
        let currentStep = 1,
          statusDesc = '';
        if (res.option == 1 || res.option == 2) {
          //开团和参团状态
          currentStep = 1;
        } else if (res.option == 3) {
          //邀请好友
          currentStep = 2;
        } else if (res.option == 5) {
          currentStep = 3;
        }
        // const { grouponScale, grouponMembers } = this.state.grouponDetail;
        // if (grouponMembers && grouponScale - grouponMembers.length == 0) {
        //   //判断人员
        //   currentStep = 3;
        // }
        this.setState({
          button: res ? res : {},
          currentStep: currentStep,
          cancelType: res.cancelType,
        });

        if (res.cancelType === 2) {
          statusDesc = '商品已抢光';
        } else if (res.cancelType === 3) {
          statusDesc = '活动已结束';
        } else if (res.cancelType === 4) {
          statusDesc = '商品已下架';
        }
        this.setState({
          statusDesc: statusDesc,
        });

        // this.getGrouponDetail();
      }
    });
  };

  /**
   * 获取用户地址
   * @param {Number} storeId 店铺id
   */
  getUserAddress = (storeId, skuId, activityId) => {
    getSkuDetailAddressService({
      storeId: storeId,
      skuIds: [skuId],
      activityId: activityId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({
            addressList: getReadlyAddressList(res.addressInfos).aList,
            failAddressList: getReadlyAddressList(res.addressInfos).bList,
            beforeFilterAddressNum:
              res && res.beforeFilterAddressNum
                ? res.beforeFilterAddressNum
                : '',
            baseAddressNum: res && res.baseAddressNum ? res.baseAddressNum : '',
          });
        } else {
          console.log(res.msg);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * 获取配送状态提醒
   * @param {*} skuId
   */
  getDeliveryWareTip = (skuId) => {
    if (!skuId) return;
    getDeliveryWareTip({
      skuId: skuId,
    })
      .then((res) => {
        if (res && res.success) {
          this.setState({
            deliveryStatusTip: res.tip || '',
            deliveryStatus: res.canSubmit === false ? false : true,
          });
        }
      })
      .catch(() => {});
  };

  /**
   * 获取当前滚动条高度
   */
  getRectTop = () => {
    const query = Taro.createSelectorQuery();
    return new Promise((resolve) => {
      query
        .selectViewport()
        .scrollOffset((res) => {
          resolve(res.scrollTop);
        })
        .exec();
    });
  };

  /**
   * popup弹出层
   * @param {String} id 弹出层id
   */
  onPopup = (e) => {
    logClick({ e, eid: question });
    this.setState({
      modalScrollTop: this.scrollTop,
      infoFlag: true,
    });
  };

  /**
   * 地址弹层点击事件
   * @param {Object} address 当前点击item
   * @param {Number} skuId 商品Id
   */
  changeAddress = (address) => {
    console.log('当前地址', address);
    const { skuId, activityId, storeId } = this.state;

    getChangeAddressService({
      skuIds: [skuId],
      nowBuy: 9,
      addressId: address.addressId,
      lat: address.lat,
      lon: address.lon,
      activityId: activityId,
    }).then((res) => {
      if (res && !res.valid) {
        Taro.showToast({
          title:
            res && res.invalidTip
              ? res.invalidTip
              : '当前商品在该地址不支持拼团活动',
          icon: 'none',
        });
        return;
      }
      this.getDeliveryWareTip(this.state.skuId); // 获取配送状态提醒

      const tenantShopInfo = res.tenantShopInfo; //局布地址列表参数
      if (tenantShopInfo.length === 1) {
        //如果当前storeId在租户列表里，还用当前的storeId信息，如果不在弹切门店框
        if (storeId.toString() === tenantShopInfo[0].storeId.toString()) {
          this.setAddressAndTenantInfo(address, tenantShopInfo, 0);
        } else {
          this.setState(
            {
              tenantShopInfo,
            },
            () => {
              //弹多租户切换弹框
              this.setState(
                {
                  isAddrFlag: true,
                  localAddress: address,
                },
                () => {
                  this.preventBodyScrool();
                }
              );
            }
          );
        }
      } else if (tenantShopInfo.length > 1) {
        //有多个切对应的那个门店
        let isExist = false;
        for (let i in tenantShopInfo) {
          if (storeId.toString() === tenantShopInfo[i].storeId.toString()) {
            isExist = true;
            this.setAddressAndTenantInfo(address, tenantShopInfo, i);
          }
        }
        if (isExist === false) {
          //弹多租户切换弹框
          this.setState(
            {
              tenantShopInfo,
            },
            () => {
              //弹多租户切换弹框
              this.setState(
                {
                  switchShopFlag: true,
                  localAddress: address,
                },
                () => {
                  this.preventBodyScrool();
                }
              );
            }
          );
        }
      }
    });
  };

  //阻止页面滚动
  preventBodyScrool = () => {
    this.setState({
      pageStyle: {
        position: 'fixed',
        height: '100%',
        overflow: 'hidden',
      },
    });
  };

  //保存地址更新缓存
  setAddressAndTenantInfo = (address, tenantShopInfo, index) => {
    //更改缓存
    this.setState(
      {
        index, //当前租户索引
        tenantShopInfo,
        tenantData: tenantShopInfo[index], //租户信息
      },
      () => {
        console.log(
          '======切换后当前租户信息tenantData=======',
          this.state.tenantData
        );
        this.setAddrInfo(address, this.state.tenantShopInfo);
      }
    );
  };

  //关闭门店选择框，保存地址信息
  onShopClose = (tenantData) => {
    const { tenantShopInfo, localAddress } = this.state;
    this.setState(
      {
        switchShopFlag: false,
        isAddrFlag: false,
        tenantData: {
          ...tenantData,
          addressId: localAddress.addressId,
        },
        storeId: tenantData.storeId,
      },
      () => {
        this.bodyScrool();
        this.setAddrInfo(localAddress, tenantShopInfo);
      }
    );
  };

  //关闭租户弹框
  onAddrClose = () => {
    this.setState(
      {
        isAddrFlag: false,
      },
      () => {
        this.bodyScrool();
      }
    );
  };

  //解除阻止页面滚动
  bodyScrool = () => {
    this.setState({
      pageStyle: {
        position: 'auto',
        height: 'auto',
        overflow: 'auto',
      },
    });
  };

  /**
   * 去新建地址
   */
  onCreate = () => {
    let { activityId, skuId, storeId, beforeFilterAddressNum, baseAddressNum } =
      this.state;
    if (beforeFilterAddressNum < baseAddressNum) {
      let grouponId = null;
      if (this.state.grouponId !== 'null') {
        grouponId = this.state.grouponId;
      }
      const returnPage = `/pages-activity/fight-group/detail/index?storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}&activityId=${activityId}`;

      Taro.navigateTo({
        url: `/pages/address/new/index?type=new&from=solitaireDetail&storeId=${storeId}&skuId=${skuId}&activityId=${activityId}&returnPage=${encodeURIComponent(
          returnPage
        )}`,
      });
      this.setState({
        addressModelShow: false,
      });
    } else {
      this.getLimitMaxNumFunc();
    }
  };
  /**
   * 获取地址限制最大条数和文案
   */
  getLimitMaxNumFunc = () => {
    const { beforeFilterAddressNum } = this.state;
    getLimitMaxNum().then((res) => {
      console.log(res);
      if (
        res &&
        res.limitMaxAddressNum &&
        beforeFilterAddressNum >= res.limitMaxAddressNum
      ) {
        Taro.showToast({
          title: res.overMaxRemind,
          icon: 'none',
        });
      }
    });
  };

  //拼团广场 查看更多
  onSearchMore = () => {
    console.log('onSearchMore');
    this.setState({
      squareFlag: true,
      modalScrollTop: this.scrollTop,
    });
  };

  // 跳拼团列表
  onGoGroupHome = () => {
    const { storeId, tenantId } = this.state;
    /*
     * https://cf.jd.com/pages/viewpage.action?pageId=351653625
     * 20201203 zmh
     */
    structureLogClick({
      eventId: 'GroupDetails_TodayGroup_SeeMore',
      eventName: '拼团商详-查看更多',
      jsonParam: {
        clickType: '-1',
        pageId: '0095',
        pageName: '小程序拼团商品详情页',
        tenantId: `${tenantId}`,
        storeId: `${storeId}`,
        platformId: '1',
        clickId: 'GroupDetails_TodayGroup_SeeMore',
      },
    });
    Taro.navigateTo({
      url: `/pages-activity/fight-group/list/index?storeId=${storeId}&tenantId=${tenantId}`,
    });
  };

  //关闭二维码
  onInfoModalClose = () => {
    this.setState({
      infoFlag: false,
    });
  };

  //打开拼团广场
  onSquareModalClose = () => {
    this.setState({
      squareFlag: false,
    });
  };
  //跟TA拼
  onSquareModalOnclick = (info) => {
    console.log('跟TA拼');
    this.goToCart(info);
  };

  //返回订单页
  // goToHome = () => {
  //   Taro.navigateBack();
  // };

  //返回顶部
  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  //页面滚动
  onPageScroll = (e) => {
    this.scrollTop = e.scrollTop;
    if (e.scrollTop > this.state.scrollHeight / 3 && !this.state.backTop) {
      this.setState({
        backTop: true,
      });
    }
    if (e.scrollTop <= this.state.scrollHeight / 3 && this.state.backTop) {
      this.setState({
        backTop: false,
      });
    }
  };

  /*
   * 请求拼团列表数据
   * 有storeId优先请求，没有就请求经纬度
   * */

  getGroupListInfo = (i) => {
    let pageNo = i ? this.state.pageIndex : 1;

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
          if (pageNo === 1) {
            this.setState({
              list: res.skuInfoWebs,
              totalElements: res.totalElements,
            });
          } else {
            this.setState({
              list: this.state.list.concat(res.skuInfoWebs),
              totalElements: res.totalElements,
            });
          }
        } else {
          this.setState({
            list: [],
          });
          Taro.showToast({
            title: res && res.message ? res.message : '网络请求错误',
            icon: 'none',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //滑动到底部触发
  scrollToLower = () => {
    if (this.state.list.length < this.state.totalElements) {
      this.setState(
        {
          pageIndex: this.state.pageIndex + 1,
        },
        () => {
          this.getGroupListInfo(this.state.pageIndex);
        }
      );
    }
  };

  /**
   * 底部跟TA拼
   */
  goToFight = (info, e) => {
    logClick({ e, eid: goFight });
    this.goToCart(info);
  };

  /**
   * 进入结算页
   */
  goToCart = (info) => {
    const { logined, storeId, skuId, activityId, grouponId } = this.state;
    if (!logined) {
      utils.gotoLogin(
        `/pages-activity/fight-group/detail/index?activityId=${activityId}&storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}`,
        'redirectTo'
      );
    } else {
      this.loadSubmit(info);
    }
  };

  loadSubmit = (info) => {
    const { button, activityId } = this.state;
    let grouponId = null;

    if (info && info.grouponId) {
      //拼团广场提单
      grouponId = info.grouponId;
      this.checkUser(2, activityId).then((res) => {
        if (res) {
          return;
        } else {
          this.submitData(grouponId);
        }
      });
    } else {
      grouponId = this.state.grouponId;
      if (button.option === 3) {
        this.getUserInfo();
        return;
      } else if (button.cancelType || button.option === 5) {
        Taro.showToast({
          title: button.message,
          icon: 'none',
        });
        return;
      }
      this.checkUser(1, activityId).then((res) => {
        if (res) {
          return;
        } else {
          this.submitData(grouponId);
        }
      });
    }
  };

  submitData = (grouponId) => {
    console.log('submitData');
    const {
      logined,
      storeId,
      skuId,
      activityId,
      address,
      grouponDetail,
      endTime,
    } = this.state;
    if (!logined) {
      utils.gotoLogin(
        `/pages-activity/fight-group/detail/index?activityId=${activityId}&storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}`,
        'redirectTo'
      );
      return;
    }

    if (address && address.fullAddress === '请选择地址') {
      Taro.showToast({
        title: '请先新建一个地址',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    let fightGroupInfo;
    if (grouponId) {
      fightGroupInfo = {
        groupId: grouponId,
        activityId: activityId,
        grouponType: 1,
        joinType: grouponId ? 2 : 1,
        referenceTime: endTime,
      };
    } else {
      fightGroupInfo = {
        activityId: activityId,
        grouponType: 1,
        joinType: grouponId ? 2 : 1,
        referenceTime: endTime,
      };
    }

    const params = {
      wareInfos: [
        {
          storeId: storeId,
          skuId: skuId,
          buyNum: grouponDetail.grouponNumber,
          jdPrice: grouponDetail.skuInfoWeb.grouponPrice,
          marketPrice: grouponDetail.skuInfoWeb.basePrice,
        },
      ],
      fightGroupInfo: fightGroupInfo,
      groupRequest: fightGroupInfo,
    };

    const orderUrl = `${h5Url}/order.html?storeId=${storeId}&nowBuy=9&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=miniapp&newResource=fightGroup`;
    utils.navigateToH5({ page: orderUrl });
  };

  //地址弹框
  closeAddressModal = () => {
    this.setState({
      addressModelShow: false,
    });
  };

  //打开地址弹框
  selectAddress = () => {
    this.setState({
      modalScrollTop: this.scrollTop,
    });
    const { activityId, storeId, skuId, grouponId, logined } = this.state;
    if (logined) {
      this.setState({
        addressModelShow: true,
      });
    } else {
      utils.gotoLogin(
        `/pages-activity/fight-group/detail/index?activityId=${activityId}&storeId=${storeId}&skuId=${skuId}&grouponId=${grouponId}`,
        'redirectTo'
      );
    }
  };

  onGetUserInfo = (e) => {
    logClick({ e, eid: leftBottomShare });
    this.getUserInfo();
  };

  onTimeEnd = () => {
    this.getGrouponDetail();
    this.checkGrouponButton();
    this.getDeliveryWareTip(this.state.skuId); // 获取配送状态提醒
  };

  //设置缓存
  setAddrInfo = (store, tenantShopInfo) => {
    if (!store) return;
    const { tenantData, skuId, activityId } = this.state;
    const address = `${store.addressSummary ? store.addressSummary : ''}${
      store.addressExt ? store.addressExt : ''
    } ${store.where ? store.where : ''}`;
    const _storeId = tenantData
      ? parseInt(tenantData.storeId)
      : parseInt(this.state.storeId);
    const addrInfo = {
      coord: [store.lat, store.lon],
      lat: store.lat,
      lon: store.lon,
      addressSummary: store.addressSummary ? store.addressSummary : '',
      addressExt: store.addressExt ? store.addressExt : '',
      where: store.where ? store.where : '',
      fullAddress: address,
      addressId: store.addressId,
      storeId: _storeId,
      isDefault: true,
      tenantId:
        this.state.tenantData &&
        this.state.tenantData.tenantInfo &&
        this.state.tenantData.tenantInfo.tenantId,
    };
    saveAddrInfo(addrInfo, tenantShopInfo);
    this.updateAddress(store, _storeId);
    this.getUserAddress(_storeId, skuId, activityId);
  };

  //更新地址信息
  updateAddress = (address, _storeId) => {
    //更新地址描述
    this.setState(
      {
        addressModelShow: false,
        address: {
          addressId: address.addressId || '',
          fullAddress: `${
            address.addressSummary ? address.addressSummary : ''
          }${address.addressExt ? address.addressExt : ''} ${
            address.where ? address.where : ''
          }`,
          lon: address.lon,
          lat: address.lat,
        },
        storeId: _storeId,
      },
      () => {
        this.getGrouponDetail();
        this.getDeliveryWareTip(this.state.skuId); // 获取配送状态提醒
        this.checkGrouponButton();
      }
    );
  };

  render() {
    let {
      grouponDetail,
      systemInfo,
      endTime,
      grouponList,
      infoFlag,
      squareFlag,
      isLoad,
      backTop,
      list,
      button,
      currentStep,
      address,
      addressModelShow,
      statusDesc,
      modalScrollTop,
      openType,
      detail,
      failAddressList,
      tenantShopInfo,
      tenantData,
      services,
      overFlag,
      addressList,
      deliveryStatusTip,
      deliveryStatus,
      switchShopFlag,
      pageStyle,
      isAddrFlag,
      todayGroupFlag,
    } = this.state;
    const skuInfoWeb = grouponDetail.skuInfoWeb;
    const grouponActivityType = button.cancelType
      ? button.cancelType === 2 ||
        button.cancelType === 3 ||
        button.cancelType === 4
      : false;

    let grouponSign = '';
    if (
      (grouponDetail &&
        grouponDetail.grouponSign &&
        grouponDetail.grouponSign === 1) ||
      grouponDetail.grouponSign === 4
    ) {
      grouponSign = '邀新团';
    }

    let message = '';
    if (button.cancelType) {
      if (button.cancelType === 2) {
        message = '抱歉，商品已抢光';
      } else if (button.cancelType === 3) {
        message = '抱歉，拼团已结束';
      } else if (button.cancelType === 4) {
        message = '抱歉，商品已下架';
      } else if (button.cancelType === 5) {
        message = '抱歉，当前地址不在门店配送范围内';
      }
    }

    return (
      <View
        className={
          squareFlag || infoFlag
            ? 'fight-detail-page noscroll'
            : 'fight-detail-page'
        }
        style={pageStyle}
        onPageScroll={this.onPageScroll}
      >
        {grouponDetail && skuInfoWeb && (
          <View
            className=''
            style={{
              position: squareFlag || infoFlag ? 'fixed' : 'relative',
              top: squareFlag || infoFlag ? -modalScrollTop - 100 + 'rpx' : '',
              left: squareFlag || infoFlag ? 0 : '',
              overflow: 'hidden',
            }}
          >
            <View className='fight-swiper'>
              {/* 轮播图 */}
              <CustomSwiper
                height={systemInfo.windowWidth}
                contents={
                  skuInfoWeb.imageInfoList
                    ? skuInfoWeb.imageInfoList
                    : [productDefaultPicture]
                }
              />
            </View>
            {/* 价钱和时间 */}
            <View
              className='price-time'
              style={{ opacity: grouponActivityType ? 0.6 : 1 }}
            >
              <View className='price-time'>
                <View
                  className='price-cont'
                  style={{
                    background: grouponActivityType
                      ? `linear-gradient(to right,rgb(241, 173, 173),rgb(238, 177, 177))`
                      : `linear-gradient(to right,rgb(255, 109, 109),rgb(253, 50, 50))`,
                  }}
                >
                  <View className='top'>
                    <Text className='current'>
                      <Text className='litter'>¥</Text>
                      <Text className='price'>{skuInfoWeb.grouponPrice}</Text>
                      <Text className='unit'>{skuInfoWeb.buyUnit}</Text>
                    </Text>
                    <Text className='base'>
                      ¥{skuInfoWeb.basePrice}
                      {skuInfoWeb.buyUnit}
                    </Text>
                  </View>
                  <View className='bottom'>
                    <Text className='count'>
                      {grouponDetail.grouponScale}人团
                    </Text>
                    <Text className='sale'>
                      已拼{skuInfoWeb.saleNum || 0}件
                    </Text>
                  </View>
                </View>
                <View
                  className='time-cont'
                  style={{
                    background: grouponActivityType
                      ? `#f2c0bc`
                      : `linear-gradient(
                      to bottom,
                      rgb(254, 240, 223),
                      rgb(252, 216, 209),
                      rgb(251, 226, 214)
                    )`,
                  }}
                >
                  {grouponActivityType ? (
                    <View className='desc'>{statusDesc}</View>
                  ) : (
                    <View>
                      <View className='top'>距拼团结束剩余</View>
                      <View className='bottom'>
                        <CountDown
                          seconds={(endTime - new Date()) / 1000}
                          width='50rpx'
                          height='52rpx'
                          fontSize='26rpx'
                          background='linear-gradient(to bottom, rgb(254,72,83), rgb(255,117,71))'
                          splitColor='#F13E2A'
                          splitSpace='8rpx'
                          borderRadius='4rpx'
                          marginLeft='16rpx'
                          color='#fff'
                          left
                          onTimeEnd={this.onTimeEnd.bind(this)}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className='product-info'>
              <View className='product-title'>
                {grouponSign && <FightTip title={grouponSign} />}
                <Text className='fight-black'>
                  {skuInfoWeb.skuName.toString()}
                </Text>
              </View>
              <View className='product-desc'>
                {skuInfoWeb.skuIntroduce
                  ? skuInfoWeb.skuIntroduce.toString()
                  : ''}
              </View>
              {skuInfoWeb.warmPrompt && (
                <FreshWarmPrompt
                  message={skuInfoWeb.warmPrompt}
                  tipStyle='padding: 5px 0 10px'
                />
              )}
              <View className='product-red'>
                {grouponDetail && grouponDetail.grouponNumber > 1 && (
                  <Text>{grouponDetail.grouponNumber}件起购</Text>
                )}
                {grouponDetail &&
                  grouponDetail.grouponNumber > 1 &&
                  grouponSign === '邀新团' && <View className='split-line' />}
                {grouponSign === '邀新团' && (
                  <View
                    className='product-groupon-sign'
                    onClick={this.onPopup.bind(this)}
                  >
                    <Text>仅可新人参团</Text>
                    <Image src={redTip} className='red-tip' />
                  </View>
                )}
              </View>
            </View>
            {/* 拼团广场 */}
            {grouponList &&
              grouponList.length > 0 &&
              button.cancelType !== 2 &&
              button.cancelType !== 3 &&
              button.cancelType !== 4 && <View className='grey-10' />}
            {grouponList &&
              grouponList.length > 0 &&
              button.cancelType !== 2 &&
              button.cancelType !== 3 &&
              button.cancelType !== 4 && (
                <View className='fight-square'>
                  <View className='title'>
                    <CellTitle
                      // imgUrl={square2}
                      title='拼团广场'
                      more={grouponList.length > 0 ? true : false}
                      onClick={this.onSearchMore.bind(this)}
                    />
                  </View>
                  {/* 少于4个不滚动 */}
                  {grouponList.length <= 4 ? (
                    grouponList.map((info, index) => {
                      return (
                        <View className='go-team-modal' key={index}>
                          <GoTeamEasy
                            info={info}
                            onClick={this.goToCart.bind(this)}
                          />
                        </View>
                      );
                    })
                  ) : (
                    <ProductScroll
                      list={grouponList}
                      onClick={this.goToCart.bind(this)}
                      resource='detail'
                    />
                  )}
                </View>
              )}
            <View className='grey-10' />
            {/* 地址 */}
            <View className='fight-send-to'>
              <View className='shopInfo'>
                <Image
                  src={
                    tenantData &&
                    tenantData.tenantInfo &&
                    tenantData.tenantInfo.circleLogo
                      ? tenantData.tenantInfo.circleLogo
                      : defaultLogo
                  }
                  alt='7FRESH'
                  mode='aspectFit'
                  className='shopLogo'
                />
                <Text className='shopName'>
                  {/* {tenantData &&
                  tenantData.tenantInfo &&
                  tenantData.tenantInfo.tenantName
                    ? tenantData.tenantInfo.tenantName
                    : '7FRESH'} */}
                  {(tenantData && tenantData.storeName) || ''}
                </Text>
              </View>
              <SendTo
                text={address && address.fullAddress}
                onClick={this.selectAddress.bind(this)}
              />
              <View className='line' />
              <View className='groupon-detail-send-mark'>
                {services.map((info, index) => {
                  return (
                    <View className='send-mark-item' key={index}>
                      <Image src={circle} mode='aspectFit' className='img' />
                      <Text>{info}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View className='grey-10' />
            <View className='today-fight'>
              <View className='title'>
                <CellTitle
                  // imgUrl={todayFight}
                  title='今日拼团'
                  more={todayGroupFlag}
                  resource='today'
                  onClick={this.onGoGroupHome.bind(this)}
                />
              </View>
              <View className='today-list'>
                <TodayList
                  list={list}
                  onScrollToLower={this.scrollToLower.bind(this)}
                />
              </View>
            </View>
            <View className='grey-10' />
            {/* 商品详情 */}
            <View className='fight-detail'>
              <View
                className='title'
                style={{
                  borderBottom:
                    detail && detail.recommendDesc
                      ? '1px solid rgba(0, 0, 0, 0.1)'
                      : 0,
                }}
              >
                商品详情
              </View>
              <ProductDetail
                detail={detail.detailImageUrl}
                specs={detail.skuSpec}
                priceDesc={
                  detail.skuPriceDescList ? detail.skuPriceDescList : []
                }
                recommendDesc={detail.recommendDesc ? detail.recommendDesc : ''}
              />
            </View>
            {/* 底部提示栏 1红色开团，2黄色提示 */}
            <View className='bottom-tip'>
              {button && backTop && (
                <BottomTip
                  list={grouponList}
                  onClick={this.goToFight.bind(this)}
                  desc={button}
                />
              )}
              {button && button.cancelType && (
                <View className='bottom-tip-yellow1'>{message}</View>
              )}

              {/* 配送状态提醒 */}
              {button && !button.cancelType && deliveryStatusTip && (
                <View className='bottom-tip-yellow1'>{deliveryStatusTip}</View>
              )}
            </View>
            {/* 按钮 1正常开团按钮 2 置灰 3 正常开团按钮置灰*/}
            <View className='detail-btn'>
              <FightDetailBtn
                button={button}
                btnType={currentStep}
                openType={openType}
                deliveryStatus={deliveryStatus}
                onGetUserInfo={this.onGetUserInfo}
                onClick={this.goToCart.bind(this)}
              />
            </View>
            {/* 置顶和返回首页 */}
            {backTop && (
              <View className='go-top'>
                <GoTop type='top' onClick={this.goTop.bind(this)} />
              </View>
            )}
            {/* 20201208版本去掉 */}
            {/* <View className='go-home'>
              <GoTop
                type=''
                title='拼团首页'
                onClick={this.goToHome.bind(this)}
              />
            </View> */}
          </View>
        )}

        {overFlag && (
          <View className='none'>
            <Image src={listNone} mode='aspectFit' lazy-load />
          </View>
        )}

        {isLoad && (
          <Loading
            width={wx.getSystemInfoSync().windowWidth}
            height={wx.getSystemInfoSync().windowHeight}
            tip='加载中...'
          />
        )}

        {/* 邀新团弹框 */}
        <CodeModal
          type={3}
          show={infoFlag}
          openType=''
          // desc={"该商品所有用户均可开团，仅限未在7FRESH购物过的新用户参团。开团后请快快邀请7FRESH新用户参团吧！br每名用户仅能使用一个7FRESH账户参与活动，微信号、京东账号、7FRESH账号、手机号码、收货地址等任一信息一致或指向同一用户的，视为同一用户，则第一个参与本活动的账号参与结果有效，其余账号参团均视为无效。"}
          desc={grouponDetail && grouponDetail.visitedTeamDesc}
          onClose={this.onInfoModalClose.bind(this)}
          onClick={this.onInfoModalClose.bind(this)}
        />

        {/* 拼团广场 */}
        <CodeModal
          type={4}
          show={squareFlag}
          list={grouponList}
          onClose={this.onSquareModalClose.bind(this)}
          onClick={this.onSquareModalOnclick.bind(this)}
        />

        {addressModelShow && (
          <AddressSelectModal
            onClose={this.closeAddressModal.bind(this)}
            onChange={this.changeAddress.bind(this)}
            list={addressList}
            failList={failAddressList}
            show={addressModelShow}
            onCreate={this.onCreate.bind(this)}
          />
        )}

        {/* 切多个门店 */}
        <SwitchShopModal
          name='当前地址有多个门店可选'
          shopList={tenantShopInfo}
          show={switchShopFlag}
          onClose={this.onShopClose.bind(this)}
        />

        {/* 切租户 */}
        <SwitchAddressModal
          data={tenantShopInfo && tenantShopInfo[0]}
          name='当前操作需切换门店至'
          show={isAddrFlag}
          onSwitch={this.onShopClose.bind(this)}
          onClose={this.onAddrClose.bind(this)}
        />
      </View>
    );
  }
}
