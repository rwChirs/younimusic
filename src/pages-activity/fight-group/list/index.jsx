import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Image, ScrollView, Text } from '@tarojs/components';
import FreshFloatBtn from '../../../components/float-btn';
import { getGroupListService, getQueryListShareService } from '@7fresh/api';
import { greenAddress, greenMore, listNone, listShare } from '../utils/images';
import { logClick } from '../../../utils/common/logReport';
import { gotoList } from '../utils/reportPoints';
import { exportPoint } from '../../../utils/common/exportPoint';
import { userLogin } from '../../../utils/common/utils';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import utils from '../../../pages/login/util';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import ListProduct from '../components/list-product';
import Loading from '../../../components/loading';
import CountDown from '../../../components/count-down';
import './index.scss';

export default class List extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      scrollHeight: 0,
      totalElements: 0,
      totalPage: 0,
      timeStatus: 0,
      scrollTop: 0,
      pageTop: '',
      openType: '',
      endTime: '',
      imageUrl: '',
      sp: '',
      list: [],
      shareInfo: {},
      isLoad: true,
      noneData: false,
      logined: true,
      noneFlag: false,
      storeId: '',
      tenantId: '',
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
      Taro.navigateTo({
        url: decodeURIComponent(option.returnUrl),
      });
    }
    this.getUserInfo();
    this.userLogin();
  }

  getUserInfo = () => {
    Taro.getUserInfo()
      .then((res) => {
        this.setState({
          userName: res.userInfo.nickName,
          openType: res.userInfo.nickName ? 'share' : 'getUserInfo',
        });
      })
      .catch((err) => {
        this.setState({
          openType: 'getUserInfo',
        });
        console.log(err);
      });
  };

  userLogin = () => {
    userLogin()
      .then((res) => {
        this.setState(
          {
            sp: res.sp,
            logined: res.success,
          },
          () => {
            console.log('是否登录', res.success);
          }
        );
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    const {
      storeId = '',
      lat = '',
      lon = '',
      tenantId = '',
    } = getCurrentInstance().router.params;
    if (!storeId) {
      //走三公里定位
      this.getStoreInfo(storeId, lon, lat, '', 3).then((res) => {
        this.setState(
          {
            storeId: res.storeId ? res.storeId : storeId,
            tenantId: res.tenantId ? res.tenantId : tenantId,
          },
          () => {
            this.loadInit();
          }
        );
      });
    } else {
      this.setState(
        {
          storeId: storeId,
          tenantId: tenantId,
        },
        () => {
          this.loadInit();
        }
      );
    }

    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  //页面渲染初始化
  loadInit = () => {
    const storeId = this.state.storeId;
    Taro.getSystemInfo({
      success: (res) => {
        this.setState(
          {
            scrollHeight: res.windowHeight + 'px',
            storeId,
            pageIndex: 1,
            noneData: false,
          },
          () => {
            const fightShare = Taro.getStorageSync('fightGroup-list-share')
              ? JSON.parse(Taro.getStorageSync('fightGroup-list-share'))
              : null;
            if (fightShare) {
              this.setState({
                shareInfo: fightShare,
              });
            }
            //渲染列表接口
            this.getGroupListInfo();
            //渲染列表分享接口
            this.getListShare();
          }
        );
      },
    });
  };

  //列表页分享
  getListShare = () => {
    const { storeId } = this.state;
    const args = {
      storeId,
    };
    getQueryListShareService(args)
      .then((res) => {
        if (res) {
          //添加缓存
          this.setState(
            {
              shareInfo: res,
            },
            () => {
              Taro.setStorageSync(
                'fightGroup-list-share',
                JSON.stringify(this.state.shareInfo)
              );
            }
          );
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

    let [storeId, grouponType, pageIndex, pageSize] = [
      this.state.storeId,
      1,
      pageNo,
      this.state.pageSize,
    ];
    const args = {
      storeId,
      grouponType,
      pageIndex,
      pageSize,
    };
    getGroupListService(args)
      .then((res) => {
        Taro.showShareMenu();
        this.setState({
          isLoad: false,
          list: [],
        });
        if (res && res.success) {
          // Taro.setStorageSync("fightGroup-list", JSON.stringify(res));
          this.onSetSession(res, pageNo);
        } else {
          this.setState({
            list: [],
            noneFlag: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // this.setState({
        //   isLoad: false,
        //   noneFlag: true,
        // });
      });
  };

  //添加列表缓存
  onSetSession = (res, pageIndex) => {
    this.setState(
      {
        imageUrl: res.imageUrl,
        list:
          pageIndex === 1
            ? res.skuInfoWebs
            : res.skuInfoWebs
            ? this.state.list.concat(res.skuInfoWebs)
            : this.state.list,
        totalElements: res.totalElements,
        totalPage:
          res.totalElements > 0
            ? Math.ceil(res.totalElements / this.state.pageSize)
            : 1,
        endTime: res.endTime,
        timeStatus: res.timeStatus, //0-显示结束剩余时间  1-不显示结束剩余时间
      },
      () => {
        if (!res.skuInfoWebs) {
          this.setState({
            noneFlag: true,
          });
        }
        if (pageIndex >= this.state.totalPage) {
          this.setState({
            noneData: true,
          });
        }
      }
    );
  };

  // 监听用户下拉刷新事件
  onPullDownRefresh = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1,
        totalElements: 0,
        totalPage: 0,
        isLoad: true,
      },
      () => {
        this.getGroupListInfo();
        Taro.stopPullDownRefresh();
      }
    );
  };

  //滑动到底部触发
  scrollToLower = () => {
    if (this.state.pageIndex < this.state.totalPage) {
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

  //页面没有storeId的时候，提示用户去选择门店时候的点击事件
  onClickHanlder = () => {
    let skuId = '';
    if (this.state.logined) {
      Taro.navigateTo({
        url: `/pages/address/list/index?from=fightGroup&skuId=${skuId}`,
      });
    } else {
      utils.gotoLogin(
        `/pages/address/list/index?from=fightGroup&skuId=${skuId}`,
        'redirectTo'
      );
    }
  };

  //小程序分享
  onShareAppMessage(option) {
    const { shareInfo, storeId, sp } = this.state;
    if (option.from === 'button') {
      let shareInfoWeb = option.target.dataset.info;
      const { grouponPrice, memberCount, basePrice, grouponTitle } =
        shareInfoWeb;
      const number =
        shareInfoWeb.buttonOption === 1 ? memberCount : memberCount - 1; //buttonOption 1是开团
      const title = `【还差${number}人成团 拼团价${grouponPrice}元 原价${basePrice}元 ${grouponTitle}`;
      return {
        // title: `${
        //   this.state.userName ? this.state.userName : ''
        // }邀请您参加拼团，${shareInfoWeb.shareTitle}，快来一起参与吧～`,
        title: title,
        // desc: shareInfoWeb.shareDesc,
        desc: '',
        imageUrl: shareInfoWeb.shareInfoWeb.appletImageUrl,
        path: sp
          ? `${shareInfoWeb.appletUrl}&from=miniapp&entrancedetail=009_${storeId}_20191219002&sp=${sp}`
          : `${shareInfoWeb.appletUrl}&from=miniapp&entrancedetail=009_${storeId}_20191219002`,
      };
    } else {
      console.log(
        shareInfo,
        `${shareInfo.appletListUrl}&from=miniapp&entrancedetail=009_${storeId}_20191219002&sp=${sp}`,
        'shareInfo'
      );
      return {
        title: shareInfo.title,
        imageUrl: shareInfo.imageUrl ? shareInfo.imageUrl : listShare,
        path: sp
          ? `${shareInfo.appletListUrl}&from=miniapp&entrancedetail=009_${storeId}_20191219002&sp=${sp}`
          : `${shareInfo.appletListUrl}&from=miniapp&entrancedetail=009_${storeId}_20191219002`,
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
        title: '好物拼团',
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '',
      });
    }
  };

  //进入详情
  goToDetail = (info, e) => {
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
  };

  //列表按钮点击事件
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
      this.getUserInfo();
    }
  };

  //返回顶部
  goTop = () => {
    this.setState({
      pageTop: 0,
    });
  };

  // 返回首页
  gohome = () => {
    Taro.switchTab({
      url: `/pages/index/index?storeId=${this.state.storeId}&tenantId=${this.state.tenantId}`,
    });
  };

  //倒计时结束后，重新渲染
  onTimeEnd = () => {
    this.getGroupListInfo();
  };

  render() {
    let {
      list,
      endTime,
      noneData,
      isLoad,
      scrollHeight,
      timeStatus,
      pageTop,
      scrollTop,
      openType,
      noneFlag,
      imageUrl,
    } = this.state;

    return (
      <View className='fight-list-page'>
        {list && (
          <ScrollView
            className='fight-scrollview'
            scrollY
            scrollWithAnimation
            lowerThreshold={100}
            onScrolltolower={this.scrollToLower}
            //style={{ height: scrollHeight }}
            onScroll={this.onScroll}
            scrollTop={pageTop}
          >
            {list.length !== 0 && (
              <View
                className='fight-list-top'
                style={{
                  background: `url(${imageUrl})`,
                  backgroundSize: '100% 256rpx',
                  backgroundPosition: '0 5px',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '270rpx',
                  marginBottom: endTime ? 0 : '32rpx',
                }}
              >
                {/* <View className="title">7FRESH 拼团</View>
                <View className="description">
                  <Image className="dot" src={leftDot} />
                  <Text className="dotDesc">好生活 拼出来</Text>
                  <Image className="dot" src={rightDot} />
                </View> */}
              </View>
            )}

            <View className='fight-list-count'>
              {list.length !== 0 && timeStatus === 0 && (
                <View className='main'>
                  <Text className='text'>本期距结束剩余</Text>
                  <CountDown
                    seconds={endTime / 1000}
                    width='50rpx'
                    height='52rpx'
                    fontSize='26rpx'
                    background='linear-gradient(to bottom, rgb(254,72,83), rgb(255,117,71))'
                    splitColor='#F13E2A'
                    splitSpace='8rpx'
                    borderRadius='6rpx'
                    color='#fff'
                    onTimeEnd={this.onTimeEnd.bind(this)}
                  />
                </View>
              )}
            </View>

            {list.length > 0 && (
              <View
                className='fight-list'
                style={{ top: timeStatus === 0 ? '-20rpx' : '-44rpx' }}
              >
                {list.map((info, index) => {
                  return (
                    <ListProduct
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
            <FreshFloatBtn
              type='top'
              title='顶部'
              color='rgb(94, 100, 109)'
              onClick={this.goTop.bind(this)}
            />
          </View>
        )}
        <View className='gohome'>
          <FreshFloatBtn
            // imageUrl='//m.360buyimg.com/img/jfs/t1/29552/24/14337/4135/5ca56cedE042ca4eb/d1d4a1ee25cc3ad7.png'
            // imageUrl='//m.360buyimg.com/img/jfs/t1/149516/32/15719/13927/5fbe309dEba313a1e/214f7e398f4d0c7b.png'
            imageUrl='//m.360buyimg.com/img/jfs/t1/129255/40/19850/13927/5fbe373fE0281d574/8e866c30069174ab.png'
            type='home'
            imgStyle='width:57px;height:57px;box-shadow:none;background:none;'
            onClick={this.gohome.bind(this)}
          />
        </View>
      </View>
    );
  }
}
