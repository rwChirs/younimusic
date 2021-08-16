import Taro, { getCurrentInstance } from '@tarojs/taro';
import React from 'react';
import { View, Image, ScrollView, Text } from '@tarojs/components';
import { getUserIsExtensionNew, getThreeListService } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { greenAddress, greenMore, listNone } from '../utils/images';
import ThreeGroupItem from '../components/three-group-item';
import Loading from '../../../components/loading';
import LazyLoadImage from '../../../components/render-html/lazy-load-image';
import { getUserDefaultAddress, getThreeGroupShare } from '../utils/api';
import { logClick } from '../../../utils/common/logReport';
import FightGoTop from '../components/go-top';
import WeChatImg from '../components/wechat-img';
import './index.scss';
import utils from '../../../pages/login/util';
import { gotoList } from '../utils/reportPoints';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { exportPoint } from '../../../utils/common/exportPoint';

export default class ThreeGroup extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      shareInfo: {},
      pageIndex: 1,
      pageSize: 10,
      windowWidth: 375,
      scrollHeight: 0,
      totalElements: 0,
      scrollTop: 0,
      pageTop: '',
      openType: 'share',
      imageUrl: '',
      imageToUrl: '',
      noneFlag: false,
      isLoad: true,
      noneData: false,
      logined: true,
      isShowWeChatImg: false,
    };
  }

  static defaultProps = {
    list: [],
  };

  getStoreInfo = (storeId, lon, lat, acId, type) => {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then((res) => {
      return res;
    });
  };

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    const option = getCurrentInstance().router.params;
    /**
     * 解决分享页面跳转先打开今天吃啥首页，后打开分享页面；
     * 如果retureUrl存在，则跳转到指定分享页面；
     */
    if (option.returnUrl) {
      wx.navigateTo({
        url: decodeURIComponent(option.returnUrl),
      });
    }
    Taro.getUserInfo().then((res) => {
      this.setState({
        userName: res.userInfo.nickName,
        openType: res.userInfo.nickName ? 'share' : 'getUserInfo',
      });
    });
  }

  componentDidMount() {}

  componentDidShow() {
    //解决退出后重新登录进来展示列表页问题

    getUserIsExtensionNew().then((result) => {
      this.setState(
        {
          logined: result.success,
        },
        () => {
          let {
            storeId = '',
            lat = '',
            lon = '',
          } = getCurrentInstance().router.params;
          storeId = Array.isArray(storeId)
            ? storeId[storeId.length - 1]
            : storeId;
          this.getStoreInfo(storeId, lon, lat, '', 3).then((res) => {
            this.setState(
              {
                storeId: res.storeId ? res.storeId : storeId,
              },
              () => {
                console.log(this.state.storeId, '========');
                if (this.state.logined) {
                  this.getUserDefaultAddress(this.state.storeId);
                } else {
                  this.loadInit();
                }
              }
            );
          });
        }
      );
    });
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  loadInit = () => {
    const storeId = this.state.storeId;

    Taro.getSystemInfo({
      success: (res) => {
        this.setState(
          {
            windowWidth: res.windowWidth,
            scrollHeight: res.windowHeight + 'px',
            storeId,
            pageIndex: 1,
            noneData: false,
          },
          () => {
            this.getGroupListInfo();
            this.getListShare();
          }
        );
      },
    });
  };

  getListShare = () => {
    getThreeGroupShare()
      .then((res) => {
        console.log(res);
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

  /*
   * 请求拼团列表数据
   * 有storeId优先请求，没有就请求经纬度
   * */

  getGroupListInfo = (i) => {
    let pageNo = i ? this.state.pageIndex : 1;

    let [storeId, grouponType, pageIndex, pageSize, activityId] = [
      this.state.storeId,
      1,
      pageNo,
      this.state.pageSize,
      getCurrentInstance().router.params.activityId,
    ];
    const args = {
      storeId,
      grouponType,
      pageIndex,
      pageSize,
      activityId,
    };
    getThreeListService(args)
      .then((res) => {
        Taro.showShareMenu();
        this.setState({
          isLoad: false,
          list: [],
        });
        if (res && res.success) {
          if (pageNo === 1) {
            this.setState({
              imageToUrl: res.imageToUrl,
              imageUrl: res.imageUrl,
              list: res.skuInfoWebs,
              totalElements: res.totalElements,
              isShowWeChatImg: true,
            });
          } else {
            this.setState({
              list: this.state.list.concat(res.skuInfoWebs),
              totalElements: res.totalElements,
              isShowWeChatImg: true,
            });
          }
        } else {
          this.setState({
            list: [],
            noneFlag: true,
            isShowWeChatImg: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoad: false,
          noneFlag: true,
          isShowWeChatImg: true,
        });
      });
  };

  /**
   * 获取用户地址
   * @param {Number} storeId 店铺Id
   */
  getUserDefaultAddress = () => {
    getUserDefaultAddress()
      .then((res) => {
        if (res.addressId && res.storeId) {
          const { storeId } = this.state;
          if (storeId === res.storeId) {
            this.setState(
              {
                storeId: res.storeId,
              },
              () => {
                this.loadInit();
              }
            );
          } else {
            this.setState(
              {
                storeId: storeId,
              },
              () => {
                this.loadInit();
              }
            );
          }
        } else {
          this.loadInit();
        }
      })
      .catch(() => {
        this.setState({
          list: [],
        });
      });
  };

  // 监听用户下拉刷新事件
  onPullDownRefresh() {
    console.log('监听用户下拉刷新事件');
    this.setState(
      {
        list: [],
        pageIndex: 1,
        totalElements: 0,
        isLoad: true,
      },
      () => {
        this.getGroupListInfo();
        Taro.stopPullDownRefresh();
      }
    );
  }

  //滑动到底部触发
  scrollToLower = () => {
    if (this.state.list.length < this.state.totalElements) {
      this.setState(
        {
          isLoad: true,
          pageIndex: this.state.pageIndex + 1,
        },
        () => {
          this.getGroupListInfo(this.state.pageIndex);
        }
      );
    } else {
      this.setState({
        noneData: true,
      });
    }
  };

  onClickHanlder = () => {
    let skuId = '';
    if (this.state.logined) {
      Taro.navigateTo({
        url: `/pages/address/list/index?from=fightGroupskuId=${skuId}`,
      });
    } else {
      utils.gotoLogin(
        `/pages/address/list/index?from=fightGroup&skuId=${skuId}`,
        'redirectTo'
      );
    }
  };

  onShareAppMessage(option) {
    console.log(option);
    if (option.from === 'button') {
      let {
        shareInfoWeb,
        activityId,
        grouponId,
        storeId,
        skuId,
        image,
        shareTitle,
        skuIntroduce,
      } = option.target.dataset.info;
      console.log(option.target.dataset.info);

      return {
        title: `${
          this.state.userName ? this.state.userName : ''
        }邀请您参加三人拼，${
          shareInfoWeb ? `${shareInfoWeb.shareTitle}，` : shareTitle
        }快来一起参与吧～`,
        desc: shareInfoWeb ? shareInfoWeb.shareDesc : skuIntroduce,
        imageUrl: shareInfoWeb ? shareInfoWeb.appletImageUrl : image,
        path: shareInfoWeb
          ? shareInfoWeb.appletUrl
          : `/pages-activity/fight-group/team-detail/index?storeId=${storeId}&skuId=${skuId}&activityId=${activityId}&grouponId=${grouponId}`,
      };
    } else {
      const { shareInfo } = this.state;
      return {
        title: shareInfo.title,
        // desc:shareInfo.note,
        imageUrl: shareInfo.bigImageUrl ? shareInfo.bigImageUrl : null,
        path: shareInfo.appletListUrl,
      };
    }
  }

  //页面滚动
  onScroll = (e) => {
    this.setState({
      scrollTop: e.detail.scrollTop,
      pageTop: '',
    });
    if (e.detail.scrollTop > 0) {
      Taro.setNavigationBarTitle({
        title: '三人拼',
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '',
      });
    }
  };

  goToDetail = (info, e) => {
    console.log('goToDetail');
    logClick({ e, eid: gotoList });
    //进入详情
    Taro.navigateTo({
      url:
        '/pages-activity/fight-group/detail/index?activityId=' +
        info.activityId +
        '&storeId=' +
        info.storeId +
        '&skuId=' +
        info.skuId +
        '&grouponId=' +
        info.grouponId,
    });
  };

  goToAd = (url) => {
    console.log(
      'goToDetail',
      `/pages-activity/fight-group/detail/index?${url
        .split('?')[1]
        .replace('sID', 'skuId')}`
    );
    //进入详情
    Taro.navigateTo({
      url: `/pages-activity/fight-group/detail/index?${url
        .split('?')[1]
        .replace('sID', 'skuId')}`,
    });
  };

  onClickedList = (info, e) => {
    //开团和参团
    if (info.buttonOption === 1 || info.buttonOption === 2) {
      logClick({ e, eid: gotoList });
      Taro.navigateTo({
        url:
          '/pages-activity/fight-group/detail/index?activityId=' +
          info.activityId +
          '&storeId=' +
          info.storeId +
          '&skuId=' +
          info.skuId +
          '&grouponId=' +
          info.grouponId,
      });
    } else if (info.buttonOption === 3) {
      //邀请好友
    }
  };

  //返回顶部
  goTop = () => {
    this.setState({
      pageTop: 0,
    });
  };

  onTimeEnd = () => {
    this.getGroupListInfo();
  };

  render() {
    let {
      list,
      noneData,
      isLoad,
      scrollHeight,
      pageTop,
      scrollTop,
      openType,
      noneFlag,
      imageUrl,
      windowWidth,
      imageToUrl,
      isShowWeChatImg,
    } = this.state;

    return (
      <View className='fight-list-page'>
        {list && (
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation={true}
            lowerThreshold={100}
            onScrolltolower={this.scrollToLower}
            style={{ height: scrollHeight }}
            onScroll={this.onScroll}
            scrollTop={pageTop}
          >
            <View
              className='fight-list-top'
              onClick={this.goToAd.bind(this, imageToUrl)}
            >
              {imageUrl && <LazyLoadImage width={windowWidth} src={imageUrl} />}
            </View>

            {list.length > 0 && (
              <View className='fight-list'>
                {list.map((info, index) => {
                  return (
                    <ThreeGroupItem
                      key={index}
                      info={info}
                      openType={openType}
                      onGoDetail={this.goToDetail.bind(this, info)}
                      onClick={this.onClickedList.bind(this, info)}
                    />
                  );
                })}
              </View>
            )}
            {noneFlag && (
              <View className='none'>
                <View className='none-tip' onClick={this.onClickHanlder}>
                  <Image
                    src={greenAddress}
                    mode='aspectFit'
                    lazyLoad
                    className='green-address'
                  />
                  <Text className='none-description'>
                    当前定位位置不在门店覆盖范围内，更换收货地址
                  </Text>
                  <Image
                    src={greenMore}
                    mode='aspectFit'
                    lazyLoad
                    className='green-right-more'
                  />
                </View>
                <Image src={listNone} mode='aspectFit' lazyLoad />
                <Text className='none-txt'>抱歉，目前没有拼团活动</Text>
              </View>
            )}
            {noneData && <View className='fight-list-bottom'>没有更多了~</View>}

            {isShowWeChatImg === true && <WeChatImg />}
          </ScrollView>
        )}

        {isLoad && (
          <Loading
            width={wx.getSystemInfoSync().windowWidth}
            height={wx.getSystemInfoSync().windowHeight}
            tip='加载中...'
          />
        )}

        {/* 置顶 */}
        {scrollTop > 100 && (
          <View className='go-top'>
            <FightGoTop type='goTop' onClick={this.goTop.bind(this)} />
          </View>
        )}
      </View>
    );
  }
}
