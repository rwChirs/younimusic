import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {
  getClubQueryUserInfo,
  getClubCategoryListV2,
  getClubIndexV2,
  getCartNum,
  addCart,
  changeClubCollect,
} from '@7fresh/api';
import { isLogined, h5Url } from '../../../utils/common/utils';
import { logClick, structureLogClick } from '../../../utils/common/logReport';
import Loading from '../../../components/loading';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import NoneDataPage from '../../../components/none-data-page';
import MasterCard from '../components/master-card';
import FloorScroll from '../../../pages/index/freshComponents/floor-scroll';
import FormalTitle from '../components/formal-title';
import LargePicture from '../components/large-picture';
import FloorSeeding from './floor-seeding';
import AlertDialog from '../components/alert-dialog';
import FloorAddCart from '../../../components/floor-add-cart';
import FreshFloatBtn from '../../../components/float-btn';
import Topic from '../components/topic';
import { onGoToMine } from '../common/common';
import {
  BANNER,
  MASTER_MORE,
  HOT_INFO,
  HOT_LIKE,
  HOT_PRO,
} from '../reportPoints';
import {
  getUserStoreInfo,
  utils,
  goProDetail,
  get7clubPath,
  goToPage,
  goBillDetail,
  goCart,
  exportPoint,
  getShareImage,
} from '../utils';
import goPage from '../../../pages/index/goPage';
import './index.scss';

const app = Taro.getApp().$app;

export default class ClubHome extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 375,
      windowHeight: 667,
      storeId: '',
      imgList: [],
      isShow: false,
      showLargePicture: false,
      current: 0,
      floors: [],
      clubTab: [], // tab数据
      categoryListObj: {}, //整个瀑布流数据集,每个tab的数据
      categoryListData: {
        categoryIds: [],
        refinement: '',
        hasMore: {},
        current: 0,
      },
      alertDialogData: {},
      isLoading: true,
      cartNum: 0,
      fixStatus: '',
      isFirstShow: true,
      clubPositions: [], //坑位数据
      userInfo: {},
      tabId: 0, //当前选中tab标识
      oldTabIndex: 0, //点击切换完前一个tab
      noneData: false,
      loadingData: false,
      tabLoading: false,
      targetAreaTop: 0, //瀑布流节点距顶部的高度
      targetAreaScrollTop: 0, // 瀑布流节点滚动的高度
      isFixed: true,
    };
  }

  totalPage = {};
  page = {};
  pageSize = 20;
  changeCollecting = false;
  scrollTop = {};

  componentWillMount() {
    //先隐藏转发功能
    Taro.hideShareMenu();
    Taro.getSystemInfo({
      success: (res) => {
        this.setState({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        });
      },
    });
    this.getStoreId();
    Taro.eventCenter.on('show7clubLargePic', this.showLargePic);
    Taro.eventCenter.on('close7clubLargePic', this.closeLargePic);
  }

  componentDidShow() {
    const { data } = this.props;
    //本组件当页面使用时
    if (!(data && data.data && data.data.length > 1)) {
      exportPoint(getCurrentInstance().router);
    }
    if (!this.state.isFirstShow) {
      this.getStoreId();
    }

    this.onPageShow();
    this.getCartNum();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentWillUnmount() {
    Taro.eventCenter.off('show7clubLargePic', this.showLargePic);
    Taro.eventCenter.off('close7clubLargePic', this.closeLargePic);
  }

  /**
   * 下拉刷新页面
   */
  onPullDownRefresh = () => {
    for (let key in this.page) {
      this.page[key] = 1;
    }
    for (let key in this.totalPage) {
      this.totalPage[key] = 1;
    }
    for (let key in this.scrollTop) {
      this.scrollTop[key] = 0;
    }

    this.changeCollecting = false;
    this.getListing = false;
    this.initData(false);
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 300);
  };

  //绑定子组件
  onRef = (ref) => {
    this.refAlertDialog = ref;
  };

  //关闭查看大图模式
  closeLargePic = () => {
    this.setState({
      showLargePicture: false,
    });
  };

  //打开查看大图模式
  showLargePic = (imgList, current, data) => {
    this.setState({
      imgList,
      isShow: true,
      showLargePicture: true,
      current,
      alertDialogData: data,
    });
  };

  getStoreId = () => {
    const {
      storeId = '',
      lat = '',
      lon = '',
    } = getCurrentInstance().router.params;
    const addressInfo = Taro.getStorageSync('addressInfo') || {};
    //三公里定位
    getUserStoreInfo(
      storeId || addressInfo.storeId || '',
      lon || addressInfo.lon || '',
      lat || addressInfo.lat || '',
      '',
      3
    )
      .then((res) => {
        if (
          this.state.storeId &&
          Number(res.storeId) === Number(this.state.storeId)
        ) {
          return;
        }
        this.setState(
          {
            storeId: res.storeId || 131229,
          },
          () => {
            this.initData(true);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * 检查是否登录
   */
  checkIsLogin = () => {
    return isLogined();
  };

  //获取个人信息数据
  getClubQueryUserInfo = () => {
    getClubQueryUserInfo().then((res) => {
      this.setState({
        userInfo: res.userInfo,
      });
    });
  };

  initData = (showLoading) => {
    const { data } = this.props;
    //如果本组件是当作组件使用
    if (data && data.data && data.data.length > 1 && showLoading) {
      if (this.state.isFirstShow) {
        this.initIndexData(data.data);
        this.setState({
          isFirstShow: false,
        });
      } else {
        this.getIndexData(false);
      }
    } else {
      //如果本组件是当作页面使用
      this.getIndexData(showLoading);
    }
    this.getCartNum();
  };

  // 7club首页数据
  getIndexData = (showLoading) => {
    this.setState(
      {
        isLoading: showLoading,
      },
      () => {
        getClubIndexV2(this.state.storeId)
          .then((res) => {
            this.setState({
              isLoading: false,
            });
            if (res.success && res.floors && res.floors.length > 0) {
              this.initIndexData(res.floors);
            } else {
              Taro.showToast({
                title: res.msg || '请求失败',
                icon: 'none',
              });
            }
          })
          .catch((err) => {
            console.log('获取7club展示数据-错误', err);
            this.setState({
              isLoading: false,
            });
          });
      }
    );
  };

  //格式化首页数据
  initIndexData = (floors) => {
    let categoryListObj = {};
    let categoryListData = {
      list: {},
      categoryIds: [],
      refinement: false,
      hasMore: {},
      current: 0,
    };

    if (floors && floors.length > 0) {
      const floorSeedingData =
        (floors && floors.filter((val) => val.floorType === 66)[0]) || {};
      const clubTab = (floorSeedingData && floorSeedingData.clubTab) || [];

      //存储坑位全部信息
      let clubPositions = {};
      clubTab &&
        clubTab.length > 0 &&
        clubTab.map((item) => {
          let positionMap = [];
          if (item.positions && item.positions.length > 0) {
            item.positions.map((info) => {
              positionMap[info.position] = info;
            });
          }
          clubPositions[item.tabId] = positionMap;
        });

      this.setState(
        {
          clubTab,
          clubPositions,
          tabId: clubTab && clubTab.length > 0 && clubTab[0].tabId,
          oldTabIndex: clubTab && clubTab.length > 0 && clubTab[0].tabId,
        },
        () => {
          //处理坑位数据
          if (clubTab && clubTab.length > 0) {
            let listData = (clubTab[0] && clubTab[0].clubDataInfoList) || [];
            let tabId = clubTab[0] && clubTab[0].tabId;
            let listTmp = this.handlerPositions(listData, tabId);

            this.page['page' + tabId] = floorSeedingData.clubTab[0].page;
            this.totalPage['totalPage' + tabId] =
              floorSeedingData.clubTab[0].totalPage;
            categoryListObj = {
              ...categoryListObj,
              ['list' + tabId]: listTmp,
            };
            categoryListData = {
              ...categoryListData,
              categoryIds: floorSeedingData.clubTab[0].tabIds,
              refinement: !!floorSeedingData.clubTab[0].refinement,
              tabPositionKey: floorSeedingData.clubTab[0].tabPositionKey,
              hasMore: {
                ...categoryListData.hasMore,
                ['hasMore' + tabId]:
                  this.page['page' + tabId] <
                  this.totalPage['totalPage' + tabId],
              },
              current: 0,
            };
          }
          this.setState(
            {
              floors: floors,
              categoryListObj,
              categoryListData,
              isLoading: false,
              noneData: floors && floors.length ? false : true,
            },
            () => {
              //页面加载完记录瀑布流距顶部的高度，即tab吸顶后切换tab时滚动的高度
              if (this.state.targetAreaTop < 1) {
                const query = wx.createSelectorQuery().in(this.$scope);
                query
                  .select('#targetArea')
                  .boundingClientRect((res) => {
                    if (res && res.top) {
                      this.setState({
                        targetAreaTop: res.top - 20,
                      });
                    }
                  })
                  .exec();
              }
              //预加载每个tab下的第一页数据，优化切换tab请求太慢问题
              clubTab.map((item, i) => {
                if (i > 0) {
                  this.page['page' + item.tabId] =
                    this.page['page' + item.tabId] || 1;
                  this.totalPage['totalPage' + item.tabId] =
                    this.totalPage['totalPage' + item.tabId] || 1;
                  this.getClubCategoryListBeforehand(item.tabId);
                }
              });
            }
          );
        }
      );
    }
  };

  //插入坑位数据
  handlerPositions = (listData, tabId) => {
    if (!listData) {
      return [];
    }
    let listDataMap = [];
    if (listData && listData.length > 0) {
      listData.map((info) => {
        listDataMap[info.sort] = info;
      });
    }
    let positions = this.state.clubPositions[tabId];
    let listTmp = [];

    //处理坑位为0的情况
    if (listData && listData.length > 0 && Number(listData[0].sort) === 1) {
      listTmp.push(positions[0]);
    }

    if (listData && listData.length > 0) {
      for (
        let i = listData[0].sort;
        i <= listData[listData.length - 1].sort;
        i++
      ) {
        if (listDataMap[i]) {
          listTmp.push(listDataMap[i]);
        } else if (positions[i]) {
          listTmp.push(positions[i]);
        }
      }
    }
    return listTmp;
  };

  //获取购物车数量
  getCartNum = () => {
    getCartNum().then((res) => {
      this.setState({
        cartNum: (res && res.allCartWaresNumber) || 0,
      });
      app.globalData.cartNum = (res && res.allCartWaresNumber) || 0;
      console.log('app.globalData.cartNum', app.globalData.cartNum);
      app.globalData = {
        ...app.globalData,
      };
    });
  };

  onReachBottom() {
    if (this.getListing) return;
    const { tabId } = this.state;

    if (this.page['page' + tabId] <= this.totalPage['totalPage' + tabId]) {
      this.page['page' + tabId] += 1;
      this.setState(
        {
          loadingData: true,
        },
        () => {
          this.getClubCategoryList();
        }
      );
    }
  }

  //获取tab列表数据
  getClubCategoryList = () => {
    let { categoryListData, categoryListObj, storeId, tabId } = this.state;
    if (this.page['page' + tabId] > this.totalPage['totalPage' + tabId]) {
      this.setState({
        loadingData: false,
        tabLoading: false,
      });
      return;
    }

    if (this.getListing) return;
    this.getListing = true;
    const params = {
      storeId,
      page: this.page['page' + tabId] || 1,
      pageSize: this.pageSize,
      categoryIds: categoryListData.categoryIds,
      refinement: categoryListData.refinement,
      tabPositionKey: categoryListData.tabPositionKey,
      pageIndex:
        categoryListObj &&
        categoryListObj['list' + tabId] &&
        categoryListObj['list' + tabId].length,
    };
    getClubCategoryListV2(storeId, params)
      .then((res) => {
        this.getListing = false;
        console.log(this.getListing, 'getClubCategoryListV2');
        if (res.success) {
          this.totalPage['totalPage' + tabId] = res.totalPage;
          let listTmp = this.handlerPositions(res.dataInfoList, tabId);
          categoryListObj['list' + tabId] =
            categoryListObj['list' + tabId] || [];
          categoryListObj['list' + tabId] =
            this.page['page' + tabId] === 1
              ? listTmp
              : categoryListObj['list' + tabId].concat(listTmp);

          categoryListData.hasMore['hasMore' + tabId] =
            this.page['page' + tabId] < this.totalPage['totalPage' + tabId];
          this.setState(
            {
              loadingData: false,
              categoryListData,
              categoryListObj,
              tabLoading: false,
            },
            () => {
              this.getListing = false;
            }
          );
        } else {
          this.page['page' + tabId] =
            this.page['page' + tabId] > 1 ? this.page['page' + tabId] - 1 : 1;
          this.totalPage['totalPage' + tabId] =
            this.totalPage['totalPage' + tabId] > 0
              ? this.totalPage['totalPage' + tabId] - 1
              : 0;
          this.setState({
            loadingData: false,
            tabLoading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loadingData: false,
          tabLoading: false,
        });
        this.getListing = false;
        console.log('获取7club tab数据-错误', err);
      });
  };

  //预加载瀑布流其他tab数据
  getClubCategoryListBeforehand = (tabId) => {
    let { categoryListData, categoryListObj, storeId } = this.state;
    const params = {
      storeId,
      page: this.page['page' + tabId] || 1,
      pageSize: this.pageSize,
      categoryIds: [tabId],
      refinement: categoryListData.refinement,
      tabPositionKey: categoryListData.tabPositionKey,
      pageIndex:
        categoryListObj &&
        categoryListObj['list' + tabId] &&
        categoryListObj['list' + tabId].length,
    };
    getClubCategoryListV2(storeId, params)
      .then((res) => {
        if (res.success) {
          this.totalPage['totalPage' + tabId] = res.totalPage;
          let listTmp = this.handlerPositions(res.dataInfoList, tabId);
          categoryListObj['list' + tabId] =
            categoryListObj['list' + tabId] || [];
          categoryListObj['list' + tabId] =
            this.page['page' + tabId] === 1
              ? listTmp
              : categoryListObj['list' + tabId].concat(listTmp);

          categoryListData.hasMore['hasMore' + tabId] =
            this.page['page' + tabId] < this.totalPage['totalPage' + tabId];
          this.setState({
            categoryListData,
            categoryListObj,
          });
        }
      })
      .catch((err) => {
        console.log('获取7club tab数据-错误', err);
      });
  };

  //切换tab，回到初始吸顶位置
  onTabChange = (option) => {
    const { categoryListData, tabId, targetAreaTop, targetAreaScrollTop } =
      this.state;

    //记录当前切换完，前一个tab值
    let currentOldTabIndex = JSON.parse(JSON.stringify(tabId));
    if (currentOldTabIndex !== option.tabId) {
      //防止初始化没有默认值报错
      this.page['page' + option.tabId] = this.page['page' + option.tabId] || 1;
      this.totalPage['totalPage' + option.tabId] =
        this.totalPage['totalPage' + option.tabId] || 1;
      this.scrollTop['scrollTop' + currentOldTabIndex] =
        this.props.data && this.props.data.scrollTop;

      this.setState(
        {
          oldTabIndex: currentOldTabIndex,
          tabId: option.tabId,
          categoryListData: {
            ...categoryListData,
            categoryIds: option.tabIds,
            refinement: option.priorityShow,
            tabPositionKey: option.tabPositionKey,
            current: option.index,
            hasMore: {
              ...categoryListData.hasMore,
              ['hasMore' + option.tabId]:
                this.page['page' + option.tabId] <
                this.totalPage['totalPage' + option.tabId],
            },
          },
        },
        () => {
          let currentScroll = this.scrollTop['scrollTop' + option.tabId] || 0;
          if (targetAreaScrollTop > targetAreaTop) {
            // 当前page为第一页时，判断是否吸顶，然后在滚动滚动位置
            if (this.page['page' + option.tabId] === 1) {
              currentScroll =
                currentScroll > targetAreaScrollTop
                  ? currentScroll
                  : targetAreaTop;
            }
            Taro.pageScrollTo({
              scrollTop: currentScroll,
              duration: 0,
            });
          }
        }
      );
    }
  };

  onGetFixClass(fixClass, intersectionRatio) {
    this.setState({
      fixClass,
      intersectionRatio,
      isFixed: true,
    });
  }

  //tab吸顶后，获取tab滚动的高度
  onGetFixScrollTop(top) {
    this.setState({
      targetAreaScrollTop: top,
    });
  }

  // 改变收藏状态
  triggerClubCollect = (option) => {
    if (!this.checkIsLogin()) {
      utils.redirectToLogin('/pages/center-tab-page/index', 'switchTab');
      return;
    }
    if (this.changeCollecting) return;
    let { tabId, storeId } = this.state;
    const params = {
      contentId: option.contentId,
      contentType: option.contentType,
      //操作类型 SEE(1, "浏览"),SHARE(2, "分享"),COLLECT(3, "收藏"),LIKE(4, "点赞"),CANCEL_COLLECT(5, "取消收藏"),CANCEL_LIKE(6, "取消点赞");
      opType:
        option.handlerType === 'collect'
          ? option.collect
            ? 5
            : 3
          : option.ifLike
          ? 6
          : 4,
    };
    if (option.handlerType === 'collect') {
      logClick({ eid: HOT_LIKE });
    } else {
      logClick({ eid: '7FRESH_miniapp_2_1578553760939|19' });
    }
    this.changeCollecting = true;
    changeClubCollect(storeId, params)
      .then((res) => {
        this.changeCollecting = false;
        console.log('7club收藏/点赞', res);
        if (res.success) {
          let txt =
            option.handlerType === 'collect'
              ? option.collect
                ? '取消收藏成功'
                : '收藏成功'
              : option.ifLike
              ? '取消点赞'
              : '谢谢你的赞~';
          Taro.showToast({
            title: txt,
            icon: 'none',
          });
          let categoryListObj = this.state.categoryListObj;
          if (option.handlerType === 'collect') {
            categoryListObj['list' + tabId][option.index].extData.collect =
              !option.collect;
            categoryListObj['list' + tabId][
              option.index
            ].extData.collectRandom = !option.collect
              ? Math.ceil(Math.random() * 100)
              : -1;
            categoryListObj['list' + tabId][option.index].extData.collectCount =
              res.collectSum;
          } else {
            categoryListObj['list' + tabId][option.index].extData.ifLike =
              !option.ifLike;
            categoryListObj['list' + tabId][option.index].extData.likeRandom =
              !option.ifLike ? Math.ceil(Math.random() * 100) : -1;
            categoryListObj['list' + tabId][option.index].extData.likeCount =
              res.collectSum;
          }
          this.setState({
            categoryListObj,
          });
        }
      })
      .catch((err) => {
        this.changeCollecting = false;
        console.log('7club收藏-err', err);
      });
  };

  goCart = () => {
    goCart();
  };

  //跳转大咖列表页
  goMaster = (option) => {
    // master list
    logClick({
      eid: MASTER_MORE,
    });
    Taro.navigateTo({
      url: `/pages-activity/7club/master/index?storeId=${
        this.state.storeId
      }&categoryIds=${JSON.stringify(option.categoryIds)}&name=${
        option.name || ''
      }&refinement=${option.refinement || ''}`,
    });
  };

  //跳转到商品详情
  onDetail = (skuId, storeId) => {
    Taro.navigateTo({
      url: `/pages/detail/index?storeId=${storeId}&skuId=${skuId}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
    });
  };

  //跳转7club详情
  goDetail = (option) => {
    logClick({ eid: HOT_INFO, eparam: { contentId: option.contentId } });
    if (!option.contentId) return;
    if (option.contentType === 3) {
      Taro.showModal({
        title: '提示',
        content: '小程序暂不支持视频播放',
      });
      return;
    }
    if (option.contentType === 6) {
      // 加车统一结构埋点
      structureLogClick({
        eventId: 'sevenClub_rankingDetail',
        jsonParam: {
          contentId: option.contentId,
          contentName: option.title,
        },
      });
    }

    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  goMasterDetail = (option) => {
    logClick({ eid: MASTER_MORE });
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  //根据urlType进行页面跳转
  goToUrl = (action) => {
    goToPage(action, this.state.storeId);
    // 点击banner埋点
    logClick({ e: action, eid: BANNER });
  };

  //跳转推荐商品详情
  onGoToProDetail = (option) => {
    goProDetail(option);
    logClick({ eid: HOT_PRO });
  };

  //加车 是否弹框/直接加车
  onAddCart = (option) => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|21',
      eparam: { skuId: option.skuId },
    });
    try {
      const { categoryListData, clubTab } = this.state;
      const currentTab = clubTab[categoryListData.current];
      // 加车统一结构埋点
      structureLogClick({
        eventId: '7clubHomePage_recommend_addCart',
        jsonParam: {
          firstModuleId: 'recommendModule',
          firstModuleName: '为你推荐',
          secondModuleId: currentTab.tabId,
          secondModuleName: currentTab.title,
          thirdModuleId: option.content_id,
          thirdModuleName: option.content_name,
          clickType: 1,
          skuName: option.skuName,
          skuId: option.skuId,
        },
      });
    } catch (error) {
      console.log('埋点报错');
    }

    if (!option.addCart) {
      return;
    }
    if (option.isPop === true) {
      this.setState({
        addCartPopData: option,
      });
    } else {
      this._addCart(option);
    }
  };

  //加车
  _addCart = (params) => {
    addCart({
      data: {
        wareInfos: {
          skuId: params.skuId,
          buyNum: params.startBuyUnitNum,
          startBuyUnitNum: params.startBuyUnitNum,
          serviceTagId: params.serviceTagId || 0,
          selectedTasteInfoIds: params.selectedTasteInfoIds || {},
        },
        storeId: this.state.storeId,
      },
    })
      .then((res) => {
        Taro.showToast({
          title: res.msg || '加车失败',
          icon: 'success',
          duration: 2000,
        });
        this.setState({
          addCartPopData: '',
        });
        this.getCartNum();
      })
      .catch((err) => console.log(err));
  };

  /**
   * 称重商品取消加车
   */
  onCloseAddCartPop = (e) => {
    if (e && e.stopPropagation) {
      // 防止冒泡
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    this.setState({
      addCartPopData: '',
    });
  };

  //跳转商详
  onGoProDetail = (option) => {
    goProDetail(option);
  };

  //跳转菜谱详情
  onGoBillDetail = (option) => {
    goBillDetail(option);
  };

  //跳转7club详情
  onGo7clubDetail = (option) => {
    if (!option.contentId) return;
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  //展示推荐弹窗
  showDialog = () => {
    this.refAlertDialog.showDialog();
  };

  //关闭推荐弹窗
  closeDialog = () => {
    this.refAlertDialog.closeDialog();
  };

  /**
   * 分享转发事件
   */
  onShareAppMessage(option) {
    console.log('7club转发事件', option);
    if (option.from === 'button' && option.target.dataset.shareInfo) {
      let shareInfo = option.target.dataset.shareInfo || {};
      console.log('get7clubPath', shareInfo);
      return {
        title: shareInfo.title,
        imageUrl:
          shareInfo.contentType === 6
            ? 'https://m.360buyimg.com/img/jfs/t1/153966/7/14487/231970/5ffeb780E995a33f8/1d4bd7496acce6f1.png'
            : getShareImage(shareInfo),
        path: get7clubPath(shareInfo),
      };
    } else {
      return {
        title: this.state.centerTabBar === 0 ? '今天吃啥' : '7CLUB',
        path: `/pages/center-tab-page/index`,
      };
    }
  }

  //跳转话题列表页
  goToTopicList = (id) => {
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-list/index?primaryCnl=${id}`,
    });
  };

  //跳转话题详情页
  onGoToTopicDetail = (info) => {
    console.log(info);
    let topicId = '';
    if (info.secondaryCnl) {
      logClick({
        eid: info.clsTag,
        eparam: { topicId: info.secondaryCnl },
      });
      topicId = info.secondaryCnl;
    } else {
      topicId = info.topicId;
    }

    Taro.navigateTo({
      url: `/pages-activity/7club/topic-detail/index?topicId=${topicId}`,
    });
  };

  /**
   * 跳转7club个人中心
   */
  onGoToMine = (author, ev) => {
    ev.stopPropagation();
    onGoToMine(author);
  };

  //根据urlType进行页面跳转
  onGoToPosition = (action, ev) => {
    if (ev) {
      ev.stopPropagation();
    }
    goPage({
      action,
      storeId: this.state.storeId,
      coords: this.coords,
      tenantId: this.state.tenantId,
      platformId: this.state.platformId,
    });
  };

  //榜单查看更多
  onSearchDetail = (contentId) => {
    const url = `${h5Url}/club-rank-detail?terminalType=2&contentId=${contentId}`;
    utils.navigateToH5({ page: url });
  };

  /**
   * 返回顶部
   */
  goTop = () => {
    this.setState(
      {
        isFixed: false,
      },
      () => {
        Taro.pageScrollTo({
          scrollTop: 0,
          duration: 0,
        });
      }
    );
  };

  // 找相似 0316版本增加
  findSimiler = (data) => {
    structureLogClick({
      eventId: '7clubHomePage_recommend_clickSimilarityButton',
      eventName: '7CLUB列表页商品找相似',
      jsonParam: {
        firstModuleId: 'recommend',
        firstModuleName: '找相似',
        skuId: data && data.skuId,
        skuName: data && data.skuName,
        clickType: 3,
      },
    });
    const { storeId } = this.state;
    const url = `${h5Url}/similargoods?storeId=${storeId}&skuId=${
      data && data.skuId
    }&from=miniapp`;
    console.log('url:', url, data);
    utils.navigateToH5({ page: url });
  };

  render() {
    const {
      windowWidth,
      imgList,
      isShow,
      showLargePicture,
      current,
      floors,
      categoryListData,
      categoryListObj,
      isLoading,
      alertDialogData,
      addCartPopData,
      cartNum,
      tabId,
      noneData,
      loadingData,
      tabLoading,
      isFixed,
    } = this.state;
    return (
      <View className='seven-club'>
        {isLoading && <Loading tip='加载中...' />}
        {!isLoading && floors && floors.length > 0 ? (
          floors.map((val, i) => {
            return (
              <View key={i}>
                {(val.floorType === 1 ||
                  val.floorType === 22 ||
                  val.floorType === 35 ||
                  val.floorType === 44) && (
                  <FloorScroll
                    data={val}
                    windowWidth={windowWidth}
                    onGoToUrl={this.goToUrl}
                    borderRadius={16}
                    autoplay
                  />
                )}
                {val.floorType === 82 && val.topicList.length > 0 && (
                  <Topic
                    data={val.topicList}
                    onShowAll={this.goToTopicList.bind(
                      this,
                      val.morePrimaryCnl
                    )}
                    isShowAll={val.morePrimaryCnl}
                    onGoToDetail={this.onGoToTopicDetail}
                  />
                )}
                {val.floorType === 65 && (
                  <View>
                    <FormalTitle
                      text={val.name || '大咖亲临'}
                      padding='40rpx 0 20rpx'
                    />
                    <MasterCard
                      data={{
                        categoryIds: val.categoryIds,
                        categoryId: val.categoryId,
                        name: val.name,
                        bgImage: val.bgImage,
                        // ...val.clubCategoryInfo,
                        ...val.clubDataInfo,
                      }}
                      showBg
                      showMore={val.moreStarInfo}
                      showFooter={false}
                      showPro={false}
                      isCurrent
                      onClick={this.goMasterDetail}
                      onMoreClick={this.goMaster}
                      onGoToMine={this.onGoToMine}
                      fromHomePage
                    />
                  </View>
                )}
                {val.floorType === 66 && (
                  <View id='targetArea'>
                    <FloorSeeding
                      data={val}
                      listData={categoryListObj}
                      listInfo={categoryListData}
                      currentIndex={categoryListData.current}
                      onGoDetail={this.goDetail}
                      onDetail={this.onDetail}
                      onGoToMine={this.onGoToMine}
                      onGoToPosition={this.onGoToPosition}
                      onGoToProDetail={this.onGoToProDetail}
                      onGoToTopicDetail={this.onGoToTopicDetail}
                      onAddCart={this.onAddCart}
                      onTabChange={this.onTabChange}
                      onChangeCollect={this.triggerClubCollect}
                      // onSetFixstatus={this.onSetFixstatus}
                      // fixStatus={this.state.fixStatus}
                      tabId={tabId}
                      onGetFixClass={this.onGetFixClass}
                      onGetFixScrollTop={this.onGetFixScrollTop}
                      isFixed={isFixed}
                      loadingData={loadingData}
                      tabLoading={tabLoading}
                      onSearchDetail={this.onSearchDetail}
                      onFindSimiler={this.findSimiler}
                      hasSimiler
                    />
                  </View>
                )}
              </View>
            );
          })
        ) : noneData ? (
          <NoneDataPage />
        ) : (
          ''
        )}
        {showLargePicture ? (
          <LargePicture
            data={{
              items: imgList,
              pictureAspect: 1 / 1,
              isShow: isShow,
              current,
            }}
            onGoCart={this.goCart}
            cartNum={cartNum}
            onShowDialog={this.showDialog}
            onCloseDialog={this.closeDialog}
          />
        ) : null}
        <AlertDialog
          data={alertDialogData}
          onGoProDetail={this.onGoProDetail}
          onAddCart={this.onAddCart}
          onGoBillDetail={this.onGoBillDetail}
          onGo7clubDetail={this.onGo7clubDetail}
          ref={this.onRef}
        />
        <FloorAddCart
          show={addCartPopData ? true : false}
          data={addCartPopData}
          onAddCart={this._addCart}
          onClose={this.onCloseAddCartPop}
        />
        {/* 返回顶部按钮 */}
        <View className='go-top'>
          <FreshFloatBtn
            type='top'
            title='顶部'
            color='rgb(94, 100, 109)'
            onClick={this.goTop.bind(this)}
          />
        </View>
      </View>
    );
  }
}
