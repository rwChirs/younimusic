import Taro,{getCurrentInstance} from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import {
  getClubUserCenter,
  getClubUserContentList,
  changeClubCollect,
  getConfigService,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import NavBar from '../../../components/nav-bar';
import { filterImg, isLogined } from '../../../utils/common/utils';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import utils from '../../../pages/login/util';
import './index.scss';
import Item from './item/index';
import { images, get7clubPath, switchNum, logClick } from '../utils';
import { onGoToMine } from '../common/common';
import TabList from '../components/tab-list';

export default class ClubMine extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: {}, //所有tab数据集合
      isShowTip: false,
      terminalType: 2, //7freshApp-1 7fresh小程序-2 7freshH5-3
      tabIndex:
        getCurrentInstance().router.params && getCurrentInstance().router.params.source === 'mine' ? 2 : 1, //从个人中心'我的收藏'点进来 直接先展示收藏列表
      authorNickName: '',
      author: '',
      avatar: '',
      likeCount: '',
      collectCount: '',
      isReachBottom: {}, //每个tab是否触底
      msg: '',
      suportNavCustom: true,
      // top: '',
      fixClass: false,
      intersectionRatio: '',
    };
  }
  plugin = Taro.requirePlugin('loginPlugin');
  page = {
    page1: 1,
    page2: 1,
  };
  totalPage = {
    totalPage1: 0,
    totalPage2: 0,
  };
  scrollTop = {
    scrollTop1: 0,
    scrollTop2: 0,
  };
  pageSize = 20;

  componentWillMount() {
    console.log('componentWillMount', getCurrentInstance().router.params);
    let params = getCurrentInstance().router.params;
    Taro.getSystemInfo({
      success: res => {
        this.setState(
          {
            suportNavCustom: res.version.split('.')[0] >= 7,
            authorNickName: (params && params.authorNickName) || '',
            author: (params && params.author) || '',
            avatar: (params && params.avatar) || '',
          },
          () => {
            this.getStoreId();
            if (params.source === 'mine') {
              this.getConfigService();
            } else {
              this.initData();
            }
          }
        );
      },
    });
  }

  getConfigService = () => {
    getConfigService().then(res => {
      if (res) {
        console.log('res.userInfo=', res.userInfo);
        const userInfo = res.userInfo;
        const author = userInfo && userInfo.pin;
        const avatar = userInfo && userInfo.yunSmaImageUrl;
        this.setState(
          {
            author,
            avatar,
          },
          () => {
            this.initData();
          }
        );
      }
    });
  };

  getStoreId = () => {
    let addressInfo = Taro.getStorageSync('addressInfo') || {};
    if (typeof addressInfo === 'string' && addressInfo) {
      addressInfo = JSON.parse(addressInfo);
    }

    let { storeId = '' } = getCurrentInstance().router.params;
    if (addressInfo && addressInfo.storeId) {
      storeId = addressInfo.storeId;
    }

    //三公里定位
    getUserStoreInfo(storeId, '', '', '', 3)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId || 131229,
          },
          () => {}
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  onPullDownRefresh = () => {
    this.page = {
      page1: 1,
      page2: 1,
    };
    this.totalPage = {
      totalPage1: 0,
      totalPage2: 0,
    };
    this.scrollTop = {
      scrollTop1: 0,
      scrollTop2: 0,
    };
    const { tabIndex } = this.state;
    if (tabIndex === 1) {
      this.initData();
    } else {
      this.getContentList();
    }
    Taro.stopPullDownRefresh();
  };

  /**
   * 右上角转发事件
   */
  onShareAppMessage() {
    const { avatar, author, authorNickName } = this.state;
    const url = `/pages-activity/7club/club-mine/index?avatar=${
      avatar ? avatar : images.userDefaultPicture
    }&author=${author}&authorNickName=${authorNickName}`;
    return {
      title: '快来我的主页逛逛吧',
      desc: '',
      imageUrl: filterImg(avatar ? avatar : images.userDefaultPicture),
      path: url,
    };
  }

  onPageScroll = e => {
    this.scrollTop['scrollTop' + this.state.tabIndex] = e.scrollTop;
    // console.log('onPageScroll', this.scrollTop);
  };

  //初始化数据
  initData = () => {
    const { terminalType, author, list, tabIndex } = this.state;
    getClubUserCenter({ terminalType, author })
      .then(res => {
        this.setState(
          {
            list:
              getCurrentInstance().router.params && getCurrentInstance().router.params.source === 'mine'
                ? []
                : { ...list, ['list' + tabIndex]: res.categoryInfoList },
            likeCount: res.likeCount,
            collectCount: res.collectCount,
            msg: res.msg,
            isShowTip: res.msg ? true : false,
          },
          () => {
            if (getCurrentInstance().router.params && getCurrentInstance().router.params.source === 'mine') {
              this.getContentList();
            } else {
              this.totalPage.totalPage1 = res.totalPage;
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  //分页加载数据
  getContentList = () => {
    let {
      author,
      tabIndex,
      terminalType,
      fixClass,
      intersectionRatio,
      top,
      list,
    } = this.state;
    if (!author) {
      return;
    }
    // console.log(
    //   this.page['page' + tabIndex],
    //   this.totalPage['totalPage' + tabIndex]
    // );
    if (
      this.page['page' + tabIndex] > this.totalPage['totalPage' + tabIndex] &&
      this.totalPage['totalPage' + tabIndex] > 0
    ) {
      Taro.pageScrollTo({
        scrollTop: this.scrollTop['scrollTop' + tabIndex],
        duration: 0,
      });
      return;
    }
    getClubUserContentList({
      terminalType,
      page: (this.page && this.page['page' + tabIndex]) || 1,
      pageSize: this.pageSize,
      userContentListType: tabIndex,
      author: author,
    })
      .then(res => {
        // console.log(9999, res);
        this.setState(
          {
            list: {
              ...list,
              ['list' + tabIndex]:
                this.page['page' + tabIndex] === 1
                  ? res.categoryInfoList
                  : this.state.list['list' + tabIndex].concat(
                      res.categoryInfoList
                    ),
            },
            // likeCount: res.likeCount,
            // collectCount: res.collectCount,
            isReachBottom: {
              ...this.state.isReachBottom,
              ['isReachBottom' + tabIndex]:
                res.categoryInfoList &&
                res.categoryInfoList.length < this.pageSize
                  ? true
                  : false,
            },
          },
          () => {
            this.totalPage['totalPage' + tabIndex] = res.totalPage;
            if (this.page['page' + tabIndex] === 1) {
              if (fixClass && intersectionRatio === 0 && top > 100) {
                Taro.pageScrollTo({
                  scrollTop: top,
                  duration: 0,
                });
              }
            } else {
              if (this.page['page' + tabIndex] > 0) {
                Taro.pageScrollTo({
                  scrollTop: this.scrollTop['scrollTop' + tabIndex],
                  duration: 0,
                });
              }
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
        if (this['page' + tabIndex] === 1) {
          this.setState({
            list: {
              ...list,
              ['list' + tabIndex]: [],
            },
          });
        }
      });
  };

  //加载更多
  onReachBottom = () => {
    const { tabIndex } = this.state;
    if (this.page['page' + tabIndex] < this.totalPage['totalPage' + tabIndex]) {
      this.setState(
        {
          isReachBottom: {
            ...this.state.isReachBottom,
            ['isReachBottom' + tabIndex]: false,
          },
        },
        () => {
          this.page['page' + tabIndex] += 1;
          this.getContentList();
        }
      );
    } else {
      this.setState({
        isReachBottom: {
          ...this.state.isReachBottom,
          ['isReachBottom' + tabIndex]: true,
        },
      });
    }
  };

  //关闭提示
  closeTip = () => {
    this.setState({
      isShowTip: false,
    });
  };

  /**
   * 切换tab
   */
  switchTab = index => {
    if (this.state.tabIndex === index) return;
    // const { fixClass, intersectionRatio, top } = this.state;
    // console.log(
    //   999999,
    //   'fixClass=',
    //   fixClass,
    //   'intersectionRatio=',
    //   intersectionRatio,
    //   'top===',
    //   top
    // );
    this.setState(
      {
        tabIndex: index,
      },
      () => {
        this.getContentList();
      }
    );
  };
  /**
   * 跳转详情
   */
  goNotesDetail = data => {
    logClick({ eid: '7FRESH_miniapp_2_1578553760939|37' });
    if (data && data.contentType === 3) {
      Taro.showToast({
        title: '小程序暂不支持视频播发',
        icon: 'none',
      });
      return;
    }
    if (data && data.toastText) {
      Taro.showToast({
        title: data.toastText,
        icon: 'none',
      });
      return;
    }
    let url = get7clubPath(data);
    Taro.navigateTo({
      url: url,
    });
  };

  // 改变收藏状态
  triggerClubCollect = (option, index) => {
    const { author, avatar, storeId, tabIndex, authorNickName } = this.state;
    if (!isLogined()) {
      utils.redirectToLogin(
        `/pages-activity/7club/club-mine/index?authorNickName=${authorNickName}&author=${author}&avatar=${avatar}`
      );
      return;
    }
    if (this.changeCollecting) return;
    const params = {
      contentId: option.contentId,
      contentType: option.contentType,
      //操作类型 SEE(1, "浏览"),SHARE(2, "分享"),COLLECT(3, "收藏"),LIKE(4, "点赞"),CANCEL_COLLECT(5, "取消收藏"),CANCEL_LIKE(6, "取消点赞");
      opType: option.ifLike ? 6 : 4,
    };
    this.changeCollecting = true;
    changeClubCollect(storeId, params)
      .then(res => {
        this.changeCollecting = false;
        if (res.success) {
          Taro.showToast({
            title: option.ifLike ? '已取消点赞' : '点赞成功',
            icon: 'none',
          });
          let list = this.state.list;
          list['list' + tabIndex][index].ifLike = !option.ifLike;
          list['list' + tabIndex][index].random = !option.ifLike
            ? Math.ceil(Math.random() * 100)
            : -1;
          list['list' + tabIndex][index].likeCount = res.collectSum;
          this.setState({
            list,
          });
        }
      })
      .catch(err => {
        this.changeCollecting = false;
        console.log('7club收藏-err', err);
      });
  };

  onErrItemImg = index => {
    const { tabIndex } = this.state;
    let list = this.state.list;
    list['list' + tabIndex][index].coverImg =
      'https://m.360buyimg.com/img/jfs/t1/114436/34/8905/6346/5ed50f2aE4c9dfd75/73ad43256da7afe5.jpg';
    this.setState({
      list,
    });
  };

  onErrHeadIcon = index => {
    const { tabIndex } = this.state;
    let list = this.state.list;
    list['list' + tabIndex][index].author.headIcon =
      'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png';
    this.setState({
      list,
    });
  };

  onGoToMine = (author, ev) => {
    ev.stopPropagation();
    if (author.author === this.state.author) {
      return;
    }
    onGoToMine(author);
  };

  gotoTopicList = () => {
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-list/index`,
    });
  };

  handleBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      Taro.switchTab({
        url: '/pages/center-tab-page/index',
      });
    }
  };

  onGetFixClass = (fixClass, intersectionRatio) => {
    this.setState({
      fixClass,
      intersectionRatio,
    });
  };

  onGetFixScrollTop = top => {
    this.setState({
      top,
    });
  };

  render() {
    const {
      isShowTip,
      tabIndex,
      authorNickName,
      author,
      avatar,
      likeCount,
      collectCount,
      isReachBottom,
      msg,
      suportNavCustom,
      list,
    } = this.state;
    return (
      <View className='container'>
        {suportNavCustom && (
          <View className='top-cover'>
            <NavBar skin='white' showBack onBack={this.handleBack} />
          </View>
        )}
        <View className='userinfo-box'>
          <Image
            className='avatar'
            src={
              avatar && avatar != null
                ? filterImg(avatar)
                : images.userDefaultPicture
            }
          />
          <View className='nickname'>{authorNickName || author}</View>
          <View className='praise'>
            <View className='value'>{switchNum(likeCount)}</View>
            <View className='txt'>获赞</View>
          </View>
          <View className='line' />
          <View className='collection'>
            <View className='value'>{switchNum(collectCount)}</View>
            <View className='txt'>获收藏</View>
          </View>
        </View>

        <TabList
          clubTopicInfo={{ topicName: authorNickName }}
          tabList={[
            { type: 1, tabName: '动态' },
            { type: 2, tabName: '收藏' },
          ]}
          fromPage='club-mine'
          onBack={this.handleBack}
          suportNavCustom={suportNavCustom}
          onChangeClubNotesList={this.switchTab}
          topicListType={tabIndex}
          onGetFixClass={this.onGetFixClass}
          onGetFixScrollTop={this.onGetFixScrollTop}
        />

        {isShowTip && msg && (
          <View className='tip-container'>
            <View className='tip-icon' />
            <View className='tip-txt'>{msg}</View>
            <View className='tip-close' onClick={this.closeTip.bind(this)} />
          </View>
        )}
        {list && JSON.stringify(list) !== '{}' && list['list' + tabIndex] ? (
          <View className='list-wrap'>
            <View className='list-wrap-main'>
              {list &&
                list['list' + tabIndex] &&
                list['list' + tabIndex].length > 0 && (
                  <View className='items-list'>
                    {list['list' + tabIndex]
                      .filter((v, i) => i % 2 === 0)
                      .map((val, k) => {
                        return (
                          <View key={k.toString()}>
                            <Item
                              key={k.toString()}
                              data={val}
                              onGoNotesDetail={this.goNotesDetail}
                              onClubCollect={this.triggerClubCollect.bind(
                                this,
                                val,
                                2 * k
                              )}
                              onGoToMine={this.onGoToMine}
                              onErrItemImg={this.onErrItemImg.bind(this, 2 * k)}
                              onErrHeadIcon={this.onErrHeadIcon.bind(
                                this,
                                2 * k
                              )}
                            />
                          </View>
                        );
                      })}
                  </View>
                )}

              {list &&
                list['list' + tabIndex] &&
                list['list' + tabIndex].length > 0 && (
                  <View className='items-list'>
                    {list['list' + tabIndex]
                      .filter((v, i) => i % 2 !== 0)
                      .map((val, k) => {
                        return (
                          <View key={'key' + k.toString()}>
                            <Item
                              data={val}
                              onGoNotesDetail={this.goNotesDetail}
                              onClubCollect={this.triggerClubCollect.bind(
                                this,
                                val,
                                2 * k + 1
                              )}
                              onGoToMine={this.onGoToMine}
                              onErrItemImg={this.onErrItemImg.bind(
                                this,
                                2 * k + 1
                              )}
                              onErrHeadIcon={this.onErrHeadIcon.bind(
                                this,
                                2 * k + 1
                              )}
                            />
                          </View>
                        );
                      })}
                  </View>
                )}
            </View>
            {list &&
              list['list' + tabIndex] &&
              isReachBottom['isReachBottom' + tabIndex] && (
                <View className='no-more'>没有更多啦~</View>
              )}
          </View>
        ) : (
          <View className='none-page'>
            <View className='none-img' />
            <Text className='none-txt'>
              {encodeURIComponent(
                this.plugin.getStorageSync('jdlogin_pt_pin')
              ) === author
                ? '您'
                : 'TA'}
              还没有{tabIndex === 1 ? '发表' : '收藏'}过笔记呦~
            </Text>
            {/*{tabIndex === 1 && (*/}
            {/*<View*/}
            {/*className='to-topic-list-btn'*/}
            {/*onClick={this.gotoTopicList.bind(this)}*/}
            {/*>*/}
            {/*立即参与*/}
            {/*</View>*/}
            {/*)}*/}
          </View>
        )}
      </View>
    );
  }
}
