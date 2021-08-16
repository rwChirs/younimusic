import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import {
  addSolitaireCartService,
  numSolitaireCartService,
  getDeliveryWareTip,
  getChangeAddressService,
  getSolitaireListShareService,
  getTenantShopService,
  getLimitMaxNum,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import utils from '../../../pages/login/util';
import {
  h5Url,
  getReadlyAddressList,
  filterDescription,
  filterImg,
  px2vw,
  getURLParameter,
} from '../../../utils/common/utils';
import getUserStoreInfo, {
  saveAddrInfo,
} from '../../../utils/common/getUserStoreInfo';
import {
  getSolitaireDetail,
  getSolitaireTodayList,
  getUserAddress,
  getSolitaireOrderList,
  getSkuDetail,
  getUserDefaultAddress,
  getSolitaireShare,
  getRealUrl,
  onSolitaireActivity,
} from './api';
import {
  userDefaultPicture,
  sendIcon,
  greyDefaultPic,
  brownDefaultPic,
  defaultHeaderImage,
  defaultLogoPicture,
} from '../utils/images';
import FreshNone from './none';
import FreshFloatBtn from '../../../components/float-btn';
import SwitchShopModal from '../../../components/switch-shop-modal';
import Recommendation from '../components/recommendation';
import SendTo from '../../components/send-to';
import BackProduct from '../../../components/back-product';
import ProductDetail from '../../../components/product-detail';
import SeatShareModal from '../components/seat-share-modal';
import SeatModal from '../components/seat-modal';
import Loading from '../../../components/loading';
import AddressSelectModal from '../components/address-select-modal';
import SwitchAddressModal from '../../../components/switch-address-modal';
import FreshSolitaireDetailPicture from '../components/solitaire-detail-picture';
import FreshSolitaireBtn from '../components/solitaire-btn';
import FreshSeatItem from '../components/seat-item';
import FreshSeatAvatar from '../components/seat-avatar';
import FreshSolitaireMoney from '../components/solitaire-money';
import FreshPriceDescGroudon from '../components/price-desc-groudon';
import FreshSolitaireInfoModal from '../components/solitaire-modal';
import FreshCarousel from '../components/carousel';
import FreshSeatTitle from '../components/seat-title';
import FreshSolitaireHeaderImgs from '../../../pages/solitaire/list/solitaire-header-images'
import FreshSolitaireAddCart from '../../../pages/solitaire/list/solitaire-add-cart'
import FreshSolitaireTeam from './solitaire-team'
import { logClick } from '../../../utils/common/logReport'; //埋点
import {
  detailShare,
  detailPictureClicked,
  detailSearchAll,
} from '../utils/reportPoints';
import { exportPoint } from '../../../utils/common/exportPoint';
import './index.scss';

export default class SolitaireDetail extends CommonPageComponent {
  constructor(props) {
    super(props);

    let {
      storeId,
      handonId,
      lat,
      lon,
      commanderPin,
      skuId,
      activityId,
    } = getCurrentInstance().router.params;

    let hId = '';
    if (
      handonId === 'undefined' ||
      handonId === '<Undefined>' ||
      handonId === undefined ||
      handonId === null
    ) {
      hId = '';
    } else {
      hId = handonId;
    }

    lat =
      lat === 'null' ||
      lat === 'Undefined' ||
      lat === 'undefined' ||
      lat === '<Undefined>' ||
      lat === undefined
        ? null
        : lat;
    lon =
      lon === 'null' ||
      lon === 'Undefined' ||
      lon === 'undefined' ||
      lon === '<Undefined>' ||
      lon === undefined
        ? null
        : lon;
    commanderPin =
      commanderPin === 'null' ||
      commanderPin === 'undefined' ||
      commanderPin === '<Undefined>' ||
      commanderPin === undefined ||
      commanderPin === ''
        ? null
        : commanderPin;
    skuId =
      skuId === 'null' ||
      skuId === 'undefined' ||
      skuId === '<Undefined>' ||
      skuId === undefined ||
      skuId === ''
        ? null
        : skuId;

    this.state = {
      storeId: storeId ? storeId : '',
      handonId: hId,
      activityId: activityId,
      skuId: skuId,
      promotionId: '',
      noneProductTip: false,
      isShowAllGoodList: false,
      scrollHeight: 0,
      totalCount: 0,
      pageIndex: 1,
      scrollTop: 0,
      number: 1,
      openType: '',
      shareInfo: '',
      recommend: '',
      data: {
        skuId: skuId,
        commanderPin: commanderPin,
        activityId: 54545,
        storeId: 131215,
        slogan: '买，就对了',
        myIcon: userDefaultPicture, //我的头像，开团时填推荐语时使用
        canGroupon: false,
        shareText: '分享即可成为团长',
        commanderInfo: null,
        skuInfoWeb: null,
        solitaireOrderWebList: [],
        koiRemainNum: 1, //剩余锦鲤数量
        solitaireText: '锦鲤位置等你抢占哦~',
        showAllBtn: true, //是否显示 全部按钮  （>7 条）
        skuActivityInfo: {
          skuId: 1212,
          activityId: 23232,
          status: 0, //0:进行中 1：未开始 2：已结束
          remainNum: 12,
          startTime: '2019-02-01',
          endTime: '',
          endRemainTime: 8200000,
          startRemainTime: 100000,
          showStatus: 1,
          startShowStatus: 2,
        },
        bigFieldUrl: '',
        deliverText: '京东配送',
        promise: '不在配送范围内',
      },
      isLoginedFlag: true,
      address: {
        addressId: '',
        lat: lat,
        lon: lon,
        fullAddress: '请选择地址',
      },
      addressList: [],
      failAddressList: [],
      detail: {},
      seatOrderInfo: {},
      tenantData: {}, //当前租户信息
      tenantShopInfo: [], //租户列表
      goodList: [],
      seatList: [],
      addressModelShow: false,
      seatModalShow: false,
      isLoad: true,
      redFlag: true,
      teamState: true,
      isAddCart: false,
      joinFlag: true,
      serviceTagId: '',
      teamModalFlag: false,
      canLeader: false,
      isFirstShow: true,
      switchShopFlag: false,
      opType: 1, //1是运营团长 0是普通团长
      lbsData: Taro.getStorageSync('addressInfo') || {},
      cartNum: 0,
      commanderPin: '',
      defaultShareInfo: {},
      deliveryStatusTip: '', // 配送状态提醒
      collectionUserInfo: {},
      localAddress: {},
      isAddrFlag: false,
      tenantId:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').tenantId) ||
        1,
      beforeFilterAddressNum: '', //过滤前总地址数量（现有地址数量）
      baseAddressNum: '', //基础地址数量，当现有地址数量小于基础地址数量时候， 无需过滤直接创建
    };
  }
  config = {
    navigationBarTitleText: '商品详情',
    enablePullDownRefresh: false,
  };

  componentWillMount() {
    //先隐藏转发功能
    Taro.hideShareMenu();
    exportPoint(getCurrentInstance().router);

    Taro.getSystemInfo({
      success: res => {
        this.setState({
          scrollHeight: res.windowHeight,
        });
      },
    });
    this.init();
  }

  init = () => {
    let { storeId, scene = '', commanderPin = '' } = getCurrentInstance().router.params;
    scene = decodeURIComponent(scene);
    commanderPin =
      commanderPin === 'null' ||
      commanderPin === 'undefined' ||
      commanderPin === '<Undefined>' ||
      commanderPin === undefined ||
      commanderPin === ''
        ? null
        : commanderPin;
    this.setState({
      commanderPin,
    });

    //菊花码解码
    if (scene) {
      getRealUrl(scene)
        .then(res => {
          if (res && res.code) {
            const code = decodeURIComponent(res.code);
            let str = '';
            if (code && code.indexOf('?') > -1) {
              str = code.split('?')[1];
            } else {
              str = code;
            }
            const data = getURLParameter(str);
            if (data) {
              this.setState(
                {
                  handonId: data.handonId,
                  storeId: data.storeId,
                },
                () => {
                  this.pageInit(this.state.storeId, this.state.handonId);
                }
              );
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.pageInit(storeId, this.state.handonId);
    }
  };

  //获取活动ID
  getActivityId = str => {
    const { storeId, tenantId } = this.state;
    const params = {
      storeId,
      tenantId,
    };
    onSolitaireActivity(params).then(res => {
      this.setState(
        {
          activityId: res,
        },
        () => {
          this.getDetail(str);
          this.onShareInfo();
        }
      );
    });
  };

  //接龙购物车数量
  getCartNum = () => {
    const { storeId, tenantId, lat, lon } = this.state;
    const params = {
      storeId,
      tenantId,
      platformId: 1,
      lat,
      lon,
    };
    numSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.setState({
            cartNum: res.cartNum,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidShow() {
    this.getCartNum();

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

  pageInit = () => {
    let { storeId, lat, lon } = this.state;

    /** 判断从新建地址回来更新门店id和经纬度 start */
    let createAddress = Taro.getStorageSync('createAddress');

    if (createAddress === 1) {
      Taro.setStorageSync('createAddress', '');
      let addressInfo = Taro.getStorageSync('addressInfo') || {};
      lon = (addressInfo && addressInfo.lng) || '';
      lat = (addressInfo && addressInfo.lat) || '';
      storeId = (addressInfo && addressInfo.storeId) || '';
    }
    /** 判断从新建地址回来更新门店id和经纬度 end */
    this.getStoreInfo(storeId, lon, lat, '', 4)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId ? res.storeId : storeId,
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
                    this.getActivityId();
                    //这三个接口请求一遍就可以，切地址也不需要变更
                    this.getTenantShop();
                  }
                );
              }
            } else {
              this.getDefaultAddress();
            }
          }
        );
      })
      .catch(() => {
        this.setState({
          isLoad: false,
        });
      });
  };

  //三公里定位
  getStoreInfo = (storeId, lon, lat, acId, type) => {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then(res => {
      return res;
    });
  };

  //获取默认地址
  getDefaultAddress = () => {
    getUserDefaultAddress()
      .then(res => {
        if (res && res.success && res.defaultAddress) {
          this.setState({
            address: {
              addressId: res.defaultAddress.addressId,
              fullAddress:
                (res.defaultAddress.addressSummary || '') +
                (res.defaultAddress.addressExt || '') +
                (res.defaultAddress.where || ''),
              lon: res.defaultAddress.lon || '',
              lat: res.defaultAddress.lat || '',
            },
          });
        } else {
          // 已登录，且不存在默认地址
          const address = Taro.getStorageSync('selectedAddress');
          this.setState(
            {
              address: {
                ...this.state.address,
                addressId: address.addressId,
                lon: address.lon,
                lat: address.lat,
                id: address.addressId,
                fullAddress: '请选择地址',
              },
            },
            () => {
              this.getActivityId();
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //分享
  onShareInfo = () => {
    const { handonId, activityId, skuId, commanderPin, storeId } = this.state;
    getSolitaireListShareService({
      handonId,
      activityId,
      skuId,
      commanderPin,
      storeId,
    }).then(res => {
      if (res && res.success) {
        this.setState({
          defaultShareInfo: res.shareTextWeb,
        });
      } else if (res && res.msg) {
        Taro.showToast({
          title: res && res.msg,
          icon: 'none',
        });
        return;
      }
    });
  };

  //小程序分享功能s
  onShareAppMessage = e => {
    const {
      collectionUserInfo,
      skuId,
      storeId,
      commanderPin,
      canLeader,
      opType,
    } = this.state;
    const {
      title,
      bigImageUrl,
      url,
      content,
      miniProUrl,
    } = this.state.defaultShareInfo;
    //当前登录用户的pin
    const uPin = miniProUrl
      ? miniProUrl.split('commanderPin=')[1].split('&')[0]
      : '';
    const pin = (collectionUserInfo && collectionUserInfo.pin) || uPin;
    //团长的pin
    const TeamPin = canLeader ? pin : commanderPin;

    if (!this.state.isLoginedFlag) {
      this.goToLogin();
      return;
    }

    logClick({ e, eid: detailShare, eparam: { pin, skuId } });
    this.setState({
      shareFlag: false,
      teamState: false, //团长状态置为false
    });

    let miniUrl = miniProUrl;
    if (miniUrl && miniUrl.indexOf('?') !== -1) {
      miniUrl =
        miniUrl +
        `&from=miniapp&entrancedetail=009_${this.state.storeId}_20191219004`;
    } else {
      miniUrl =
        miniUrl +
        `?from=miniapp&entrancedetail=009_${this.state.storeId}_20191219004`;
    }

    let detailUrl = encodeURIComponent(`${miniUrl}`);
    const path = `/pages/solitaire/list/index?returnUrl=${detailUrl}&commanderPin=${TeamPin}&opType=${0}&storeId=${storeId}`;
    return {
      title: title,
      imageUrl: bigImageUrl ? bigImageUrl : url,
      path: path,
      desc: content,
    };
  };

  //开团
  openShare = () => {
    const { skuId, storeId, activityId, data, collectionUserInfo } = this.state;
    if (!this.state.isLoginedFlag) {
      const commanderPin = data.commanderInfo && data.commanderInfo.pin;
      utils.gotoLogin(
        `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}`,
        'redirectTo'
      );
      return;
    }

    if (data && data.skuActivityInfo && data.skuActivityInfo.status === 2) {
      Taro.showToast({ title: '活动已结束！', icon: 'none', duration: 2000 });
      return;
    }

    //如果是接龙集单&&团长storeId和团员当前storeId一致可以开团
    if (data && data.canGroupon) {
      if (
        !collectionUserInfo.collection ||
        (collectionUserInfo.collection &&
          collectionUserInfo.storeId === storeId)
      ) {
        this.setState({
          shareFlag: true,
        });
      } else {
        Taro.showToast({
          title:
            collectionUserInfo.notOpenNote ||
            '请切换至您的集单地址后再进行分享',
          icon: 'none',
        });
        return;
      }
    } else {
      this.setState({
        openType: 'share',
      });
    }
  };

  //填写开团弹框信息
  onShare = () => {
    let recommend =
      this.state.recommend && this.state.recommend.info
        ? this.state.recommend.info
        : this.state.shareInfo && this.state.shareInfo.recommendation;
    let tagList = [];
    let flag = true;
    if (recommend && recommend.info === '') {
      flag = false;
      Taro.showToast({ title: '请输入推荐语', icon: 'none', duration: 2000 });
      return;
    }
    let tagNewList =
      this.state.recommend && this.state.recommend.tags
        ? this.state.recommend.tags
        : this.state.shareInfo && this.state.shareInfo.tags;
    if (tagNewList.length === 0) {
      flag = false;
      Taro.showToast({
        title: '请至少输入1个关键字',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    tagNewList.map((tag, i) => {
      if (tag == '' && i === 0) {
        flag = false;
        Taro.showToast({
          title: '请至少输入1个关键字',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      if (tag !== '' && tag.length < 2) {
        flag = false;
        Taro.showToast({
          title: '请输入2-4个关键字',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      tagList.push(tag == '' ? '' : tag);
    });

    if (!flag) return;

    let params = {
      handonId: this.state.handonId,
      canGroupon: true,
      recommendText: recommend,
      labelList: tagList,
    };
    getSolitaireShare({
      storeId: this.state.storeId,
      data: params,
    })
      .then(shareParams => {
        if (shareParams && shareParams.success) {
          this.setState(
            {
              // shareInfo: shareParams,
              redFlag: false,
              openType: 'share',
              defaultShareInfo: shareParams,
            },
            () => {
              Taro.showToast({
                title: '保存成功，快分享给其他小伙伴吧～',
                icon: 'none',
                duration: 2000,
              });
              return;
            }
          );
        } else {
          Taro.showToast({
            title: shareParams.msg,
            icon: 'none',
            duration: 2000,
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
        return;
      });
  };

  /**
   * 获取商品图文详情
   */
  getSkuDetail = () => {
    getSkuDetail(this.state.skuId, this.state.storeId).then(res => {
      this.setState({
        detail: res,
      });
    });
  };

  /**
   * 获取商详
   */
  getDetail = str => {
    const {
      handonId,
      storeId,
      address,
      commanderPin,
      activityId,
      skuId,
    } = this.state;

    let params = {};
    params = {
      storeId,
      commanderPin,
      activityId,
      skuId: skuId,
      lon: address.lon,
      lat: address.lat,
    };

    //切地址以activityId为准，不切以handonId为准
    if (str !== 'changeAddress') {
      params.handonId = handonId;
    }
    getSolitaireDetail(params)
      .then(res => {
        console.log('getDetail', JSON.stringify(res));
        this.onSetDetailInfo(res);
      })
      .catch(err => {
        this.setState(
          {
            isLoad: false,
          },
          () => {
            console.log(err);
            setTimeout(() => {
              this.setState({
                isSuccess: true,
                data: null,
              });
            }, 800);
            return;
          }
        );
      });
  };

  onSetDetailInfo = res => {
    if (res && res.skuActivityInfo && res.skuActivityInfo.status !== 0) {
      this.queryTodayList();
    }

    this.setState(
      {
        data: res, //接龙详情对象
        activityId: res.activityId,
        promotionId: res.promotionActivityId,
        number: res && res.skuInfoWeb ? res.skuInfoWeb.startBuyUnitNum : 1,
        // btnStatus:
        //   res &&
        //   res.skuInfoWeb &&
        //   res.skuInfoWeb.status !== 2 &&
        //   res.skuInfoWeb.status !== 4, //1：下架，2：上架, 3：售罄 4:不在配送范围内 5：无效商品
        noneProductTip: res && res.skuInfoWeb && res.skuInfoWeb.status !== 2,
        // slogan: res.slogan,
        isSuccess: false,
        isLoad: false,
        skuId: res.skuId,
        canLeader: res.canLeader,
        shareDesc: res.shareDesc,
        handonId: res.handonId,
        opType: res.opType,
        shareInfo: res.commanderInfo,
        collectionUserInfo: res && res.collectionUserInfo,
        commanderPin: res && res.commanderInfo && res.commanderInfo.pin,
      },
      () => {
        //活动结束后禁用分享
        const data = this.state.data;
        if (data && data.skuActivityInfo && data.skuActivityInfo.status === 2) {
          Taro.hideShareMenu();
          this.setState({
            openType: '',
          });
        }
        this.getDeliveryWareTip(this.state.skuId); // 获取配送状态提醒
        this.getUserInfo();
        this.getUserAddressList(this.state.storeId, this.state.skuId);
        this.getSkuDetail();
      }
    );
  };

  getUserInfo = () => {
    let type = '';
    const { data, teamState, isLoginedFlag } = this.state;
    if (data && data.canGroupon && teamState) {
      type = '';
    } else {
      type = 'share';
    }

    if (data && data.skuActivityInfo && data.skuActivityInfo.status === 2) {
      Taro.hideShareMenu();
      this.setState({
        openType: '',
      });
    } else {
      this.setState({
        openType: isLoginedFlag ? type : '',
      });
    }
  };

  /**
   * 获取配送状态提醒
   * @param {*} skuId
   */
  getDeliveryWareTip = skuId => {
    getDeliveryWareTip({
      skuId: skuId,
    })
      .then(res => {
        if (res && res.success) {
          this.setState({ deliveryStatusTip: res.tip || '' });
        }
      })
      .catch(() => {});
  };

  /**
   * 获取席位列表
   */
  getSolitaireOrderList = i => {
    let pageNo = i ? this.state.pageIndex : 1;
    const { storeId, handonId, skuId, activityId } = this.state;
    getSolitaireOrderList({
      storeId,
      handonId,
      skuId: skuId,
      activityId,
      page: pageNo,
      pageSize: 50,
    }).then(res => {
      if (pageNo === 1) {
        this.setState({
          seatOrderInfo: res,
          seatList: res.solitaireOrderPageInfo.pageList,
          totalCount: res.solitaireOrderPageInfo.totalCount,
        });
      } else {
        this.setState({
          seatList: this.state.seatList.concat(
            res.solitaireOrderPageInfo.pageList
          ),
          totalCount: res.solitaireOrderPageInfo.totalCount,
        });
      }
    });
  };

  //打开地址弹框
  selectAddress = () => {
    if (this.state.isLoginedFlag) {
      this.setState({
        addressModelShow: true,
      });
      return;
    } else {
      this.goToLogin();
      return;
    }
  };

  /**
   * 打开席位弹框
   */
  openSeatModel = e => {
    logClick({ e, eid: detailSearchAll });
    this.setState({
      seatModalShow: true,
    });
    this.getSolitaireOrderList();
  };

  //处理数据后进入结算页
  goToCartPre = params => {
    this.setState(
      {
        number: params.startBuyUnitNum,
        serviceTagId: params.serviceTagId,
      },
      () => {
        //接龙购物车加车
        this.addCart();
      }
    );
  };

  /**
   * 进入结算页
   */
  goToCart = () => {
    const {
      isLoginedFlag,
      data,
      activityId,
      skuId,
      handonId,
      storeId,
      promotionId,
      number,
      serviceTagId,
      commanderPin,
    } = this.state;

    if (
      !(
        this.state.data.skuInfoWeb.status === 2 &&
        this.state.data.skuActivityInfo &&
        this.state.data.skuActivityInfo.status === 0
      )
    ) {
      return;
    }

    if (!isLoginedFlag) {
      utils.gotoLogin(
        `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}`,
        'redirectTo'
      );
      return;
    }

    if (this.state.address.fullAddress === '请选择地址') {
      Taro.showToast({
        title: '请先新建一个地址',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    const remainNum =
      this.state.data &&
      this.state.data.skuActivityInfo &&
      this.state.data.skuActivityInfo.remainNum
        ? this.state.data.skuActivityInfo.remainNum
        : 0;
    //判断购买数量不能超过库存
    if (this.state.number > remainNum) {
      Taro.showToast({
        title: '购买数量超过最大可接龙数量',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    const params = {
      wareInfos: [
        {
          storeId: storeId,
          skuId: skuId,
          buyNum: number,
          promotionId: promotionId,
          handonId: handonId,
          activityId: activityId,
          jdPrice: data.skuInfoWeb.jdPrice,
          marketPrice: data.skuInfoWeb.marketPrice, //市场价   优惠前的价格
          remarks: serviceTagId ? serviceTagId : '',
        },
      ],
      solitaireWareInfo: {
        skuId: skuId, // 商品id
        buyNum: number, // 购买数量
        jdPrice: data.skuInfoWeb.jdPrice, // 购买的价格  优惠后的价格
        remarks: serviceTagId ? serviceTagId : '', //备注 加工服务 等
        features: '', // 前端需要传入 商品 特殊标记
        marketPrice: data.skuInfoWeb.marketPrice, //市场价   优惠前的价格
      },
      solitaireRequest: {
        activityId: activityId,
        handonId: handonId,
        promotionActivityId: promotionId,
      },
    };

    const orderUrl = `${h5Url}/order.html?storeId=${storeId}&nowBuy=15&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}&from=miniapp&newResource=solitaire`;
    utils.navigateToH5({ page: orderUrl });
  };

  /**
   * 接龙推荐
   */
  queryTodayList = () => {
    const { storeId } = this.state;
    getSolitaireTodayList({
      storeId,
    }).then(res => {
      this.setState({
        goodList: res ? res : [],
      });
    });
  };

  //获取租户信息
  getTenantShop = () => {
    const { storeId, tenantId } = this.state;
    getTenantShopService({
      storeId,
      tenantId,
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            tenantData: res.tenantShopInfo,
          });
        } else if (res && res.msg) {
          Taro.showToast({
            title: res && res.msg,
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //预览
  onPreview = (index, e) => {
    logClick({ e, eid: detailPictureClicked, eparam: { index } });
    const imgList = this.state.data.skuInfoWeb.imageInfoList;
    Taro.previewImage({
      current: imgList[index],
      urls: imgList,
    });
  };

  //进入详情页
  goDetail = () => {
    const { activityId, skuId, storeId, commanderPin } = this.state;
    Taro.redirectTo({
      url: `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}`,
    });
  };

  //查看全部
  searchAll = () => {
    this.setState({
      isShowAllGoodList: true,
    });
  };

  //团长列表
  goToList = e => {
    const { commanderPin } = this.state;
    logClick({
      e,
      eid: '7FRESH_miniapp_2_1551092070962|97',
      eparam: { commanderPin },
    });
    Taro.navigateTo({
      url: `/pages/solitaire/list/index?storeId=${this.state.storeId}&commanderPin=${commanderPin}&opType=${this.state.opType}`,
    });
  };

  goToChangeNumber = number => {
    this.setState({
      number,
    });
  };

  //创建地址
  goToCreateAddress = () => {
    const {
      activityId,
      skuId,
      storeId,
      handonId,
      commanderPin,
      beforeFilterAddressNum,
      baseAddressNum,
    } = this.state;
    if (beforeFilterAddressNum < baseAddressNum) {
      const returnPage = `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}&handonId=${handonId}`;
      Taro.navigateTo({
        url: `/pages/address/new/index?type=new&storeId=${
          this.state.storeId
        }&skuId=${
          this.state.skuId
        }&from=solitaireDetail&returnPage=${encodeURIComponent(returnPage)}`,
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
    getLimitMaxNum().then(res => {
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

  //置顶
  goTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
    this.setState({
      scrollTop: 0,
    });
  };

  //席位弹框的
  closeSeatModal = () => {
    this.setState({
      seatModalShow: false,
    });
  };

  //地址弹框
  closeAddressModal = () => {
    this.setState({
      addressModelShow: false,
    });
  };

  //页面滚动
  onPageScroll = e => {
    if (e.scrollTop > 640 && this.state.joinFlag) {
      this.setState({
        joinFlag: false,
      });
    } else if (e.scrollTop <= 640 && !this.state.joinFlag) {
      this.setState({
        joinFlag: true,
      });
    }

    this.setState({
      scrollTop: e.scrollTop,
    });
  };

  onClose = () => {
    this.setState(
      {
        shareFlag: false,
      },
      () => {
        if (!this.state.redFlag) {
          this.getDetail();
        }
      }
    );
  };

  onTextChange = e => {
    this.setState({
      recommend: e,
    });
  };

  //滑动到底部触发
  onScrollToLower = () => {
    const { seatList, totalCount } = this.state;
    if (seatList && seatList.length < totalCount) {
      this.setState(
        {
          pageIndex: this.state.pageIndex + 1,
        },
        () => {
          this.getSolitaireOrderList(this.state.pageIndex);
        }
      );
    }
  };

  //跳转到普通商品详情
  onNormalDetail = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?skuId=${this.state.data.skuId}&storeId=${this.state.storeId}&showNavigationBar=1`,
    });
  };

  //单独买
  openSetProduct = () => {
    let {
      isLoginedFlag,
      storeId,
      data,
      skuId,
      activityId,
      commanderPin,
    } = this.state;

    if (!isLoginedFlag) {
      utils.gotoLogin(
        `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}`,
        'redirectTo'
      );
      return;
    }
    if (
      (data.skuInfoWeb.serviceTagWebs &&
        data.skuInfoWeb.serviceTagWebs.length > 0) ||
      data.skuInfoWeb.weightSku
    ) {
      this.setState({
        isAddCart: true,
      });
    } else {
      this.addCart();
    }
  };

  //加车
  addCart = e => {
    const {
      activityId,
      storeId,
      tenantId,
      lbsData,
      skuId,
      data,
      number,
      commanderPin,
    } = this.state;

    const params = {
      storeId,
      tenantId,
      lat: lbsData.lat,
      lon: lbsData.lon,
      skuId: skuId,
      skuNum: number,
      commanderPin,
      activityId: data.activityId,
    };
    const icon =
      data && data.skuInfoWeb && data.skuInfoWeb.status === 4
        ? 'none'
        : 'success';

    logClick({
      e,
      eid: '7FRESH_miniapp_2_1551092070962|99',
      eparam: { skuId: skuId },
    });
    addSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.setState(
            {
              isAddCart: false,
            },
            () => {
              this.getCartNum();
              if (res && res.msg) {
                Taro.showToast({
                  title: res.msg,
                  icon: icon,
                });
              }
            }
          );
          return;
        } else {
          const url = `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}`;
          if (res.code === 3) {
            utils.gotoLogin(url, 'redirectTo');
            return;
          }
          if (res && res.msg) {
            Taro.showToast({
              title: res.msg,
              icon: 'none',
            });
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //关闭加车弹层
  closeAddCart = () => {
    this.setState({
      isAddCart: false,
    });
  };

  //倒计时结束后刷新页面
  onTimeEnd = () => {
    this.getDetail();
  };

  //跳转到席位弹框
  onGoToSeat = () => {
    Taro.pageScrollTo({
      scrollTop: 640,
      duration: 300,
    });
  };

  //关闭团长框
  onTeamClose = () => {
    this.setState({
      teamModalFlag: false,
    });
  };

  //打开团长框
  onTeamOpen = () => {
    this.setState({
      teamModalFlag: true,
    });
  };

  /**
   * 跳转购物车
   */
  onGoCart = e => {
    const { commanderPin } = this.state;
    if (this.state.isLoginedFlag) {
      logClick({
        e,
        eid: '7FRESH_miniapp_2_1551092070962|98',
      });
      Taro.navigateTo({
        url: `/pages-activity/solitaire/cart/index?commanderPin=${commanderPin}&opType=${this.state.opType}`,
      });
      return;
    } else {
      this.goToLogin();
    }
  };

  //跳转到登录页
  goToLogin = () => {
    const { activityId, storeId, skuId, handonId, commanderPin } = this.state;
    utils.gotoLogin(
      `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${skuId}&storeId=${storeId}&handonId=${handonId}`,
      'redirectTo'
    );
  };

  /**
   * 获取用户地址列表
   */
  getUserAddressList = () => {
    const { skuId, storeId, data, isLoginedFlag } = this.state;
    let params = {
      skuIds: [skuId],
      storeId: storeId,
    };
    getUserAddress(params)
      .then(res => {
        if (res && res.success) {
          const addressInfos = res.addressInfos;
          this.setState({
            addressList: getReadlyAddressList(addressInfos).aList,
            failAddressList: getReadlyAddressList(addressInfos).bList,
            beforeFilterAddressNum: res.beforeFilterAddressNum
              ? res.beforeFilterAddressNum
              : '',
            baseAddressNum: res.baseAddressNum ? res.baseAddressNum : '',
          });
          if (!data.canGroupon && isLoginedFlag) {
            //不是团长的可以分享，因为团长分享需要弹框，但是按钮还没放开
            Taro.showShareMenu();
          }
        } else {
          if (res.code === 3) {
            this.setState({
              isLoginedFlag: false,
            });
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //切换地址
  changeAddress = address => {
    const { shareInfo, storeId, lbsData } = this.state;
    let params = {
      skuIds: [this.state.skuId],
      nowBuy: 15,
      addressId: address.addressId,
      lat: address.lat,
      lon: address.lon,
      collectSolitaire: shareInfo.collection,
      commanderStoreId: shareInfo.collectionStoreId,
    };

    getChangeAddressService(params).then(res => {
      if (res && !res.valid) {
        Taro.showToast({
          title: res.invalidTip || res.msg,
          icon: 'none',
        });
        return;
      } else {
        let tenant = res && res.tenantShopInfo ? res.tenantShopInfo : '';
        if (tenant.length > 1) {
          //有多个切对应的那个门店
          let isExist = false;
          for (let i in tenant) {
            if (tenant[i].storeId.toString() === storeId.toString()) {
              isExist = true;
              this.setAddressAndTenantInfo(address, tenant, i);
            }
          }
          if (isExist === false) {
            //弹多租户切换弹框
            this.setState(
              {
                tenantShopInfo: tenant,
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
        } else {
          //如果当前storeId在租户列表里，还用当前的storeId信息，如果不在弹切门店框
          if (tenant[0].tenantInfo.tenantId === lbsData.tenantId) {
            this.setAddressAndTenantInfo(address, tenant, 0);
          } else {
            this.setState(
              {
                tenantShopInfo: tenant,
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
        }
      }
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
        this.setAddrInfo(address, this.state.tenantShopInfo);
      }
    );
  };

  //设置缓存
  setAddrInfo = (store, tenantShopInfo) => {
    if (!store) return;
    const { tenantData, skuId } = this.state;
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
        (this.state.tenantData &&
          this.state.tenantData.tenantInfo &&
          this.state.tenantData.tenantInfo.tenantId) ||
        1,
    };
    saveAddrInfo(addrInfo, tenantShopInfo);
    this.updateAddress(store, _storeId);
    this.getUserAddressList(_storeId, skuId);
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
        this.getActivityId('changeAddress');
      }
    );
  };

  //关闭门店选择框，保存地址信息
  onShopClose = tenantData => {
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

  render() {
    const {
      addressList,
      addressModelShow,
      noneProductTip,
      goodList,
      isShowAllGoodList,
      address,
      detail,
      seatModalShow,
      seatOrderInfo,
      isLoad,
      isSuccess,
      isLoginedFlag,
      shareInfo,
      openType,
      shareFlag,
      seatList,
      totalCount,
      scrollTop,
      scrollHeight,
      isAddCart,
      joinFlag,
      teamModalFlag,
      canLeader,
      shareDesc,
      failAddressList,
      tenantShopInfo,
      cartNum,
      deliveryStatusTip,
      tenantData,
      switchShopFlag,
      isAddrFlag,
    } = this.state;

    let data = this.state.data;
    if (data && data.skuInfoWeb && data.skuInfoWeb.serviceTagWebs) {
      data.skuInfoWeb.serviceTags = data.skuInfoWeb.serviceTagWebs;
    }

    let skuSpec =
      detail && detail.skuSpec
        ? detail.skuSpec.filter(spec => !!spec.value)
        : [];
    return (
      <View>
        {isSuccess ? (
          <FreshNone
            imgUrl='https://m.360buyimg.com/img/jfs/t1/18413/19/6241/33729/5c492b98E2261dbb6/b6b771989ec93240.png'
            desc='暂无数据'
            size={200}
          />
        ) : (
          <View
            className={
              addressModelShow || seatModalShow || shareFlag
                ? 'groupon-detail noscroll'
                : 'groupon-detail'
            }
            onPageScroll={this.onPageScroll}
          >
            <View className='box-shadow' />
            {/** loading */}
            {isLoad && (
              <Loading
                // width={window.screen.availWidth}
                // height={window.screen.availHeight}
                tip='加载中...'
              />
            )}
            {/** 商品详细信息 */}
            <View className='groupon-detail-model'>
              {data && data.commanderInfo && (
                <View className='groupon-user'>
                  <Image
                    className='image'
                    src={filterImg(
                      data && data.commanderInfo && data.commanderInfo.icon
                        ? data.commanderInfo.icon
                        : userDefaultPicture,
                      'solitaire'
                    )}
                    mode='aspectFit'
                    lazyLoad
                  />
                  <Text className='groupon-user-name'>
                    {data.commanderInfo.title
                      ? data.commanderInfo.title
                      : 'C位'}
                    说：
                  </Text>
                  {data.commanderInfo.tags &&
                    data.commanderInfo.tags
                      .filter(tag => !!tag)
                      .map((info, index) => {
                        return (
                          <Text key={index} className='groupon-user-tag'>
                            {info}
                          </Text>
                        );
                      })}
                </View>
              )}

              {data && data.commanderInfo && (
                <View style={{ margin: '0 12px' }}>
                  <Recommendation
                    text={data.commanderInfo.recommendation}
                    type='default'
                  />
                </View>
              )}

              <View className='detail-product-model'>
                {data.skuInfoWeb && data.skuInfoWeb.imageInfoList && (
                  <FreshCarousel
                    imgList={data.skuInfoWeb.imageInfoList}
                    onPreview={this.onPreview.bind(this)}
                  />
                )}

                {data &&
                  data.skuActivityInfo &&
                  (data.skuActivityInfo.showStatus === 1 ||
                    data.skuActivityInfo.showStatus === 2) &&
                  data.skuInfoWeb && (
                    <View className='detail-price'>
                      <FreshPriceDescGroudon
                        stock={
                          data.skuActivityInfo.showStatus === 2 &&
                          data.skuActivityInfo.remainNum <= 10
                            ? data.skuActivityInfo.remainNum
                            : null
                        }
                        dateTime={
                          data.skuActivityInfo.showStatus === 1
                            ? data.skuActivityInfo.endRemainTime
                            : null
                        }
                        onTimeEnd={this.onTimeEnd.bind(this)}
                        jdPrice={data.skuInfoWeb.jdPrice}
                        marketPrice={data.skuInfoWeb.marketPrice}
                        buyUnit={data.skuInfoWeb.buyUnit}
                        count={
                          data.skuActivityInfo &&
                          data.skuActivityInfo.skuSalesInfo &&
                          data.skuActivityInfo.skuSalesInfo.historyCount
                        }
                        salesDesc={
                          data.skuActivityInfo &&
                          data.skuActivityInfo.skuSalesInfo &&
                          data.skuActivityInfo.skuSalesInfo.salesDesc
                        }
                        canLeader={canLeader}
                        commissionInfo={
                          data &&
                          data.skuInfoWeb &&
                          data.skuInfoWeb.commissionInfo
                        }
                      />
                    </View>
                  )}
                {data &&
                  data.skuActivityInfo &&
                  !(
                    data.skuActivityInfo.showStatus === 1 ||
                    data.skuActivityInfo.showStatus === 2
                  ) &&
                  data.skuInfoWeb && (
                    <View>
                      <View className='detail-price-normal'>
                        <View className='price'>
                          <View className='money'>
                            <View className='price-m'>￥</View>
                            <View className='price-num'>
                              {data.skuInfoWeb.jdPrice}
                            </View>
                            <View className='price-buyUnit'>
                              {data.skuInfoWeb.buyUnit}
                            </View>
                          </View>
                          {canLeader ? (
                            <View className='solitaire-money'>
                              <FreshSolitaireMoney
                                commissionText={
                                  data.skuInfoWeb.commissionInfo.commissionText
                                    ? data.skuInfoWeb.commissionInfo
                                        .commissionText
                                    : '约赚'
                                }
                                commission={
                                  data.skuInfoWeb.commissionInfo.commission
                                    ? data.skuInfoWeb.commissionInfo.commission
                                    : 0.0
                                }
                              />
                            </View>
                          ) : (
                            <View className='price-line'>
                              ￥{data.skuInfoWeb.marketPrice}
                            </View>
                          )}
                        </View>
                        <View className='count'>
                          已接龙
                          {data.skuActivityInfo.skuSalesInfo &&
                            data.skuActivityInfo.skuSalesInfo.historyCount}
                          {data.skuActivityInfo.skuSalesInfo &&
                            data.skuActivityInfo.skuSalesInfo.salesDesc}
                        </View>
                      </View>
                      <View>
                        {canLeader && (
                          <View className='original-price'>
                            ￥{data.skuInfoWeb.marketPrice}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                {
                  data && data.skuInfoWeb && (
                    <FreshSolitaireDetailPicture
                      productTitle={data.skuInfoWeb.skuName}
                      list={data.skuInfoWeb.skuPropertyWebList}
                      currentPrice={data.skuInfoWeb.jdPrice}
                      basePrice={data.skuInfoWeb.marketPrice}
                      unit={data.skuInfoWeb.buyUnit}
                      warmPrompt={data.skuInfoWeb.warmPrompt}
                      isShowPrice={false}
                    />
                  )
                }
              </View>

              {data &&
                data.skuActivityInfo &&
                !(
                  data.skuActivityInfo.showStatus === 1 ||
                  data.skuActivityInfo.showStatus === 2
                ) &&
                canLeader && (
                  <View className='team-modal'>
                    <FreshSolitaireTeam
                      title='七鲜接龙·团长端'
                      list={['分享商品', '邀人下单', '赚取佣金']}
                      onClick={this.onTeamOpen.bind(this)}
                    />
                    <FreshSolitaireInfoModal
                      type={4}
                      show={teamModalFlag}
                      title='七鲜接龙·团长端'
                      desc={shareDesc ? shareDesc : ''}
                      onClick={this.onTeamClose.bind(this)}
                    />
                  </View>
                )}

              {data &&
                data.skuActivityInfo &&
                data.skuActivityInfo.status !== 2 &&
                !isLoad && (
                  <View className='address-modal'>
                    <View className='shopInfo'>
                      <Image
                        src={
                          tenantData &&
                          tenantData.tenantInfo &&
                          tenantData.tenantInfo.circleLogo
                            ? tenantData.tenantInfo.circleLogo
                            : defaultLogoPicture
                        }
                        alt='7FRESH'
                        mode='aspectFit'
                        className='shopLogo'
                      />
                      <Text className='shopName'>
                        {(tenantData && tenantData.storeName) || ''}
                      </Text>
                    </View>
                    <View style={{ margin: '0 15px' }}>
                      <SendTo
                        text={address && address.fullAddress}
                        onClick={this.selectAddress.bind(this)}
                        type='solitaire'
                      />
                    </View>
                    {data &&
                      data.skuActivityInfo &&
                      data.skuActivityInfo.status !== 1 &&
                      data.promise && (
                        <View>
                          <View className='line' />
                          <View className='groupon-detail-send-mark'>
                            {[data.promise]
                              .filter(item => !!item)
                              .map((info, index) => {
                                return (
                                  <View key={index} className='send-mark-item'>
                                    <Image
                                      alt=''
                                      src={sendIcon}
                                      className='img'
                                    />
                                    <Text>{info}</Text>
                                  </View>
                                );
                              })}
                          </View>
                        </View>
                      )}
                  </View>
                )}

              <View className='groupon-detail-seat-model'>
                {data && data.koiTitleText && (
                  <View className='groupon-detail-seat-title'>
                    <FreshSeatTitle title={data.koiTitleText} isHaveFlower />
                  </View>
                )}

                <View className='groupon-detail-seat-list'>
                  {data &&
                    data.solitaireOrderWebList &&
                    data.solitaireOrderWebList.map((item, index) => {
                      return (
                        <View className='groupon-detail-seat-main' key={index}>
                          <View className='groupon-header'>
                            <FreshSeatAvatar
                              text={item.title}
                              type={index}
                              img={
                                item.avatarUrl
                                  ? filterImg(item.avatarUrl, 'solitaire')
                                  : index === 1
                                  ? greyDefaultPic
                                  : brownDefaultPic
                              }
                            />
                          </View>
                          <View className='groupon-description'>
                            <FreshSeatItem
                              name={index === 0 ? item.title : item.hidePin}
                              time={item.orderTime}
                              piece={
                                index !== 0 && item.orderNum ? item.orderNum : 0
                              }
                              info={
                                index === 0
                                  ? filterDescription(item.recommendText, 36)
                                  : filterDescription(item.recommendText, 20)
                              }
                              width={px2vw(548)}
                              type={index < 3 ? 'important' : 'default'}
                            />
                          </View>
                        </View>
                      );
                    })}

                  {data &&
                    data.koiTextList &&
                    data.koiTextList.map((info, index) => {
                      return (
                        <View key={index}>
                          {((data &&
                            data.solitaireOrderWebList.length === 2 &&
                            index === 0) ||
                            (data.solitaireOrderWebList.length === 1 &&
                              index < 2)) && (
                            <View className='seat-none-item'>
                              <FreshSeatAvatar
                                text={info.title ? info.title : '锦鲤'}
                                type={
                                  index === 0 &&
                                  data.solitaireOrderWebList.length === 2
                                    ? 2
                                    : index + 1
                                }
                                img={
                                  index === 0 &&
                                  data.solitaireOrderWebList.length === 1
                                    ? greyDefaultPic
                                    : index === 0 &&
                                      data.solitaireOrderWebList.length === 2
                                    ? brownDefaultPic
                                    : greyDefaultPic
                                }
                              />
                              <View className='seat-none-item-tip'>{info}</View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                </View>
                {data &&
                  data.solitaireOrderWebList &&
                  data.solitaireOrderWebList.length >= 7 && (
                    <View className='groupon-back-all'>
                       <View className='search-all' onClick={this.openSeatModel.bind(this)}>
                          <View className='search-word'>查看全部</View>
                          <Image
                            className='search-icon'
                            src='https://m.360buyimg.com/img/jfs/t1/23602/36/4601/1718/5c34564cE490b8c18/7035e3b7a41c1f33.png'
                            mode='aspectFit'
                            lazyLoad
                          />
                      </View>
                    </View>
                  )}
              </View>
            </View>
            {/**接龙推荐 只有进行中的时候不显示*/}
            {data && data.skuActivityInfo && data.skuActivityInfo.status !== 0 && (
              <View className='groupon-recommend'>
                <View className='groupon-title'>
                  <FreshSeatTitle title='接龙推荐' />
                </View>
                {goodList.length > 2 && isShowAllGoodList
                  ? goodList.map((item, k) => {
                      return (
                        <View key={k} className='groupon-back-card'>
                          <BackProduct
                            data={item.skuInfo}
                            productDescription={
                              item.commanderInfo.recommendation
                            }
                            alreadyCount={`已接龙${item.skuSalesInfo.historyCount}件`}
                            type='litter'
                            onClick={this.goDetail.bind(this, item)}
                          />
                        </View>
                      );
                    })
                  : goodList.slice(0, 2).map((item, k) => {
                      return (
                        <View key={k} className='groupon-back-card'>
                          <BackProduct
                            data={item.skuInfo}
                            productDescription={
                              item.commanderInfo.recommendation
                            }
                            alreadyCount={`已接龙${item.skuSalesInfo.historyCount}件`}
                            type='litter'
                            onClick={this.goDetail.bind(this, item)}
                          />
                        </View>
                      );
                    })}
                {!isShowAllGoodList && goodList.length > 2 && (
                  <View className='groupon-back-all-t'>
                     <View className='search-all' onClick={this.searchAll.bind(this)}>
                        <View className='search-word'>查看全部</View>
                        <Image
                          className='search-icon'
                          src='https://m.360buyimg.com/img/jfs/t1/23602/36/4601/1718/5c34564cE490b8c18/7035e3b7a41c1f33.png'
                          mode='aspectFit'
                          lazyLoad
                        />
                    </View>
                  </View>
                )}
              </View>
            )}

            {data &&
              data.skuActivityInfo &&
              data.skuActivityInfo.status !== 0 && <View className='grey-10' />}
            {/** 商品详情 */}
            {!isLoad && (
              <View className='groupon-detail-seat-title'>
                <View className='groupon-mb40'>
                  <FreshSeatTitle title='商品详情' />
                </View>
                <ProductDetail
                  detail={
                    detail &&
                    detail.detailImageUrl &&
                    detail.detailImageUrl.map(item => {
                      return filterImg(item, 'product', 'no');
                    })
                  }
                  specs={skuSpec}
                  priceDesc={
                    detail.skuPriceDescList ? detail.skuPriceDescList : []
                  }
                  recommendDesc={
                    detail.recommendDesc ? detail.recommendDesc : ''
                  }
                />
              </View>
            )}

            {!isLoad && (
              <View className='groupon-detail-bottom'>
                <View className='bottom-main'>
                  <Image
                    className='bottom-picture'
                    src='https://m.360buyimg.com/img/jfs/t1/116226/15/18420/15017/5f69d368E535133c4/faba651954f11ef9.png'
                    mode='aspectFit'
                    lazyLoad
                  />
                </View>
              </View>
            )}

            {/* 配送状态提醒 */}
            {data &&
              data.skuInfoWeb &&
              parseInt(data.skuActivityInfo.status) === 2 &&
              parseInt(data.skuInfoWeb.status) === 2 &&
              deliveryStatusTip && (
                <View
                  className='groupon-none-product-tip'
                  style={{ textAlign: 'center' }}
                >
                  <Text className='txt'>{deliveryStatusTip}</Text>
                </View>
              )}

            {/**缺货提示 */}
            {noneProductTip &&
            isLoginedFlag &&
            data &&
            data.skuInfoWeb &&
            data.skuInfoWeb.status !== 0 &&
            !isSuccess ? (
              <View className='groupon-none-product-tip'>
                {address.fullAddress === '请选择地址'
                  ? '请新建地址'
                  : data.skuInfoWeb.statusText
                  ? data.skuInfoWeb.statusText
                  : ''}
                <Text className='link' onClick={this.goToList.bind(this)}>
                  继续接龙
                </Text>
              </View>
            ) : (
              data &&
              joinFlag &&
              data.joinImgUrls &&
              data.joinImgUrls.length > 0 && (
                <View
                  className='groupon-none-product-tip'
                  onClick={this.onGoToSeat.bind(this)}
                >
                  <View className='imgList'>
                    <FreshSolitaireHeaderImgs
                      list={
                        data &&
                        data.joinImgUrls.map(img => {
                          return img ? img : defaultHeaderImage;
                        })
                      }
                      defaultHeaderImage={defaultHeaderImage}
                    />
                  </View>
                  <Text className='txt'>{data.hasJoinText}</Text>
                </View>
              )
            )}

            {data && data.skuInfoWeb && !isSuccess && data.skuActivityInfo && (
              <View className='groupon-detail-cart'>
                {data.skuInfoWeb.status !== 2 && (
                  <View className='groupon-detail-mask' />
                )}
                <FreshSolitaireBtn
                  cartNum={cartNum}
                  status={
                    data.skuInfoWeb.status === 4
                      ? 0
                      : data.skuActivityInfo.status !== 2
                      ? data.skuInfoWeb.status !== 2
                        ? 2
                        : data.skuActivityInfo.status
                      : data.skuActivityInfo.status
                  } //0进行中 1预告 2已结束
                  startShowStatus={data.skuActivityInfo.startShowStatus}
                  buttonText={
                    data &&
                    data.skuActivityInfo &&
                    data.skuActivityInfo.status === 2
                      ? '接龙已结束'
                      : data.skuInfoWeb.statusDesc
                  }
                  currentPrice={data.skuInfoWeb.jdPrice}
                  basePrice={
                    data.skuInfoWeb.normalPrice
                      ? data.skuInfoWeb.normalPrice
                      : data.skuInfoWeb.marketPrice
                  }
                  name='接龙首页'
                  dateTime={
                    data.skuActivityInfo.startShowStatus === 1
                      ? data.skuActivityInfo.startRemainTime
                      : data.skuActivityInfo.startTime
                  }
                  personStatus={data && data.canLeader ? data.canLeader : false}
                  money={
                    data.skuInfoWeb.commissionInfo.commission
                      ? data.skuInfoWeb.commissionInfo.commission
                      : '¥0.00'
                  }
                  onTimeEnd={this.onTimeEnd.bind(this)}
                  onGoSolitaireList={this.goToList.bind(this)}
                  onNormalDetail={this.onNormalDetail.bind(this)}
                  onGoOrder={this.openSetProduct.bind(this)}
                  onShare={this.openShare.bind(this)}
                  onOpenShare={this.openShare.bind(this)}
                  openType={openType}
                  onGoCart={this.onGoCart.bind(this)}
                />
                {isAddCart && data && data.skuInfoWeb && (
                  <View>
                    <FreshSolitaireAddCart
                      data={data}
                      onClick={this.goToCartPre.bind(this)}
                      onClose={this.closeAddCart.bind(this)}
                    />
                  </View>
                )}
              </View>
            )}

            {/** 返回首页& 返回顶部 */}
            {scrollTop !== 0 && scrollTop > scrollHeight / 2 && (
              <View className='goTop'>
                <FreshFloatBtn
                  type='top'
                  title='顶部'
                  color='rgb(121,47,37)'
                  borderColor='rgba(121,47,37,0.3)'
                  onClick={this.goTop.bind(this)}
                />
              </View>
            )}

            {shareInfo && (
              <SeatShareModal
                name='给商品添句推荐语吧'
                btnName='分享'
                show={shareFlag}
                shareInfo={shareInfo}
                openType={openType}
                onShare={this.onShare.bind(this)}
                onClose={this.onClose.bind(this)}
                onTextChange={this.onTextChange}
              />
            )}

            {data && data.skuActivityInfo && (
              <SeatModal
                title={
                  data.skuActivityInfo.status === 2
                    ? '活动已结束'
                    : '席位抢占中'
                }
                list={seatList ? seatList : []}
                current={
                  seatOrderInfo && seatOrderInfo.mySolitaireOrderWeb
                    ? seatOrderInfo.mySolitaireOrderWeb
                    : null
                }
                total={totalCount}
                show={seatModalShow}
                onClose={this.closeSeatModal.bind(this)}
                onScrollToLower={this.onScrollToLower.bind(this)}
              />
            )}

            {addressModelShow && (
              <AddressSelectModal
                onClose={this.closeAddressModal.bind(this)}
                onChange={this.changeAddress.bind(this)}
                list={addressList}
                failList={failAddressList}
                show={addressModelShow}
                onCreate={this.goToCreateAddress.bind(this)}
              />
            )}

            {!canLeader && !isLoad && isLoginedFlag && (
              <View className='share-fix-btn'>
                <Button openType='share' className='detail-share-pic' />
              </View>
            )}

            {!canLeader && !isLoad && !isLoginedFlag && (
              <View className='share-fix-btn'>
                <Button
                  className='detail-share-pic'
                  onClick={this.goToLogin.bind(this)}
                />
              </View>
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
        )}
      </View>
    );
  }
}
