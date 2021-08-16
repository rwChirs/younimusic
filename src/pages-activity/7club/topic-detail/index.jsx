import Taro,{getCurrentInstance} from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import {
  getClubTopicDetail,
  getClubNotesList,
  changeClubCollect,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import NavBar from '../../../components/nav-bar';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { isLogined, filterImg, px2vw } from '../../../utils/common/utils';
import utils from '../../../pages/login/util';
import List from './list/index';
import TabList from '../components/tab-list';
import './index.scss';
import { logClick, exportPoint } from '../utils';

export default class TopicDetail extends CommonPageComponent {

  constructor(props) {
    super(props);
    this.state = {
      pageStyle: {},
      isShowDescribeLayer: false,
      describeLineCount: 1,
      suportNavCustom: true,
      clubTopicInfo: '',
      hotClubNotesList: [{}],
      newClubNotesList: [{}],
      topicListType: 1,
      isShowJoinTopicLayer: false,
      scrollTop: 0,
      iShowJoinTopicContainer: true,
    };
  }

  isShowHotNoMore = false;
  isShowNewNoMore = false;
  hotScrollTop = 0;
  newScrollTop = 0;
  hotTotalPage = 1;
  newTotalPage = 1;
  hotPage = 0;
  newPage = 0;
  pageSize = 20;

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.windowHeight = res.windowHeight;
        this.windowWidth = res.windowWidth;
        this.setState({
          suportNavCustom: res.version.split('.')[0] >= 7,
        });
      },
    });
  }

  componentDidShow() {
    const isOpenedTopicDetail = Taro.getStorageSync('isOpenedTopicDetail');
    if (isOpenedTopicDetail === true) {
      this.setState({
        isShowJoinTopicLayer: false,
      });
    }
    this.getStoreId();
  }

  onPullDownRefresh = () => {
    this.getStoreId();
    Taro.stopPullDownRefresh();
  };

  /**
   * 右上角转发事件
   */
  onShareAppMessage() {
    logClick('7FRESH_miniapp_2_1578553760939|23');
    const { clubTopicInfo } = this.state;
    const url = `/pages-activity/7club/topic-detail/index?topicId=${clubTopicInfo.topicId}`;
    return {
      title: clubTopicInfo && clubTopicInfo.topicName,
      desc: clubTopicInfo && clubTopicInfo.topicDesc,
      imageUrl: filterImg(clubTopicInfo.imgUrl),
      path: `/pages/center-tab-page/index?returnUrl=${encodeURIComponent(url)}`,
    };
  }

  onPageScroll = e => {
    // console.log(1111, e);
    if (this.state.topicListType === 1) {
      this.hotScrollTop = e.scrollTop;
    } else {
      this.newScrollTop = e.scrollTop;
    }

    // 参与话题（向上滑隐藏，向下滑或停留出现）
    if (e.scrollTop > this.state.scrollTop) {
      this.setState({
        scrollTop: e.scrollTop,
        iShowJoinTopicContainer: false,
      });
    } else {
      this.setState({
        scrollTop: e.scrollTop,
        iShowJoinTopicContainer: true,
      });
    }
    let timer = setTimeout(() => {
      if (this.state.scrollTop === e.scrollTop) {
        this.setState({
          scrollTop: e.scrollTop,
          iShowJoinTopicContainer: true,
        });
        console.log('滚动结束');
        clearTimeout(timer);
      }
    }, 300);
  };

  getClubTopicDetailFun = () => {
    const params = getCurrentInstance().router.params;
    const args = {
      terminalType: 2,
      topicId: params && params.topicId,
    };
    getClubTopicDetail(args).then(res => {
      let clubTopicInfo = '';
      if (res && res.clubTopicInfo) {
        clubTopicInfo = res.clubTopicInfo;
      }
      this.setState(
        {
          clubTopicInfo: clubTopicInfo,
        },
        () => {
          this.getDescribeLineCount();
          this.getClubNotesListFun();
        }
      );
    });
  };

  onReachBottom() {
    this.getClubNotesListFun();
  }

  getClubNotesListFun = () => {
    const {
      hotClubNotesList,
      newClubNotesList,
      topicListType,
      fixClass,
    } = this.state;
    if (topicListType === 1) {
      if (this.hotTotalPage <= this.hotPage) {
        if (this.hotScrollTop > 0 && this.hotPage > 1 && fixClass) {
          Taro.pageScrollTo({
            scrollTop: this.hotScrollTop,
            duration: 0,
          });
        }
        return;
      }
      const params = getCurrentInstance().router.params;
      this.hotPage++;
      const args = {
        terminalType: 2,
        page: this.hotPage,
        pageSize: this.pageSize,
        topicId: (params && params.topicId) || 10028833,
        // topicId: (params && params.topicId) || 10024017,
        topicListType: 1, //话题列表类型 1：最热 2：最新
      };
      getClubNotesList(args)
        .then(res => {
          let _clubNotesList = [];
          if (res) {
            if (this.hotPage === 1 && res.totalPage) {
              this.hotTotalPage = res.totalPage;
            }
            if (res.categoryInfoList) {
              _clubNotesList =
                this.hotPage === 1
                  ? res.categoryInfoList
                  : [...hotClubNotesList, ...res.categoryInfoList];
            }
          }
          this.setState(
            {
              hotClubNotesList: _clubNotesList,
            },
            () => {
              if (_clubNotesList && _clubNotesList.length > 0) {
                const isOpenedTopicDetail = Taro.getStorageSync(
                  'isOpenedTopicDetail'
                );
                if (isOpenedTopicDetail === true) {
                  this.setState(
                    {
                      isShowJoinTopicLayer: false,
                    },
                    () => {
                      this.bodyScrool();
                    }
                  );
                } else {
                  this.setState(
                    {
                      isShowJoinTopicLayer: true,
                    },
                    () => {
                      this.preventBodyScrool();
                      Taro.setStorageSync('isOpenedTopicDetail', true);
                    }
                  );
                }
              }
              if (this.hotScrollTop > 0 && fixClass) {
                Taro.pageScrollTo({
                  scrollTop: this.hotScrollTop,
                  duration: 0,
                });
              }
            }
          );
          if (this.hotPage > 0 && this.hotPage >= this.hotTotalPage) {
            this.isShowHotNoMore = true;
          }
        })
        .catch(() => {
          if (this.hotPage === 1) {
            this.setState({
              hotClubNotesList: [],
            });
          }
        });
    } else {
      const { intersectionRatio, top } = this.state;
      if (this.newTotalPage <= this.newPage) {
        if (this.newScrollTop > 0 && this.newPage > 1 && fixClass) {
          Taro.pageScrollTo({
            scrollTop: this.newScrollTop,
            duration: 0,
          });
        }
        return;
      }
      const params = getCurrentInstance().router.params;
      this.newPage++;
      const args = {
        terminalType: 2,
        page: this.newPage,
        pageSize: this.pageSize,
        topicId: params && params.topicId,
        // topicId: (params && params.topicId) || 10024017,
        topicListType: 2, //话题列表类型 1：最热 2：最新
      };
      getClubNotesList(args)
        .then(res => {
          let _clubNotesList = [];

          if (res) {
            if (this.newPage === 1 && res.totalPage) {
              this.newTotalPage = res.totalPage;
            }
            if (res.categoryInfoList) {
              _clubNotesList =
                this.newPage === 1
                  ? res.categoryInfoList
                  : [...newClubNotesList, ...res.categoryInfoList];
            }
          }
          this.setState(
            {
              newClubNotesList: _clubNotesList,
            },
            () => {
              if (this.newPage === 1) {
                if (fixClass && intersectionRatio === 0 && top > 100) {
                  console.log('top=====', top);
                  Taro.pageScrollTo({
                    scrollTop: top,
                    duration: 0,
                  });
                }
              } else {
                if (this.newScrollTop > 0 && fixClass) {
                  Taro.pageScrollTo({
                    scrollTop: this.newScrollTop,
                    duration: 0,
                  });
                }
              }
            }
          );
          if (this.newPage > 0 && this.newPage >= this.newTotalPage) {
            this.isShowNewNoMore = true;
          }
        })
        .catch(() => {
          if (this.newPage === 1) {
            this.setState({
              newClubNotesList: [],
            });
          }
        });
    }
  };

  changeClubNotesList = topicListType => {
    // this.page = 0;
    // this.totalPage = 1;
    const { fixClass, intersectionRatio, top } = this.state;
    console.log(
      'fixClass=',
      fixClass,
      'intersectionRatio=',
      intersectionRatio,
      'top===',
      top
    );
    this.setState(
      {
        topicListType: topicListType,
      },
      () => {
        this.getClubNotesListFun();
      }
    );
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

  //改变点赞状态
  onPartake = (args, index) => {
    console.log('args=', args, 'index=', index);
    const {
      storeId,
      hotClubNotesList,
      newClubNotesList,
      topicListType,
      clubTopicInfo,
    } = this.state;
    let clubNotesList =
      topicListType === 1 ? hotClubNotesList : newClubNotesList;
    if (!isLogined()) {
      utils.redirectToLogin(
        `/pages-activity/7club/topic-detail/index?topicId=${clubTopicInfo.topicId}`,
        'redirectTo'
      );
      return;
    }
    const opType = args.ifLike ? 6 : 4;
    const params = {
      contentId: args && args.contentId,
      contentType: args && args.contentType,
      opType: opType,
    };
    changeClubCollect(storeId, params)
      .then(res => {
        if (res.success) {
          Taro.showToast({
            title: opType === 4 ? '点赞成功' : '已取消点赞',
            icon: 'none',
          });
        } else {
          Taro.showToast({
            title: opType === 4 ? '点赞失败' : '取消点赞失败',
            icon: 'none',
          });
        }
        args.ifLike = !args.ifLike;
        args.random = args.ifLike ? Math.ceil(Math.random() * 100) : -1;
        args.likeCount = res.collectSum || 0;
        const _clubNotesList = clubNotesList;
        _clubNotesList[index] = args;
        if (topicListType === 1) {
          this.setState({
            hotClubNotesList: _clubNotesList,
          });
        } else {
          this.setState({
            newClubNotesList: _clubNotesList,
          });
        }
      })
      .catch(() => {
        Taro.showToast({
          title: opType === 4 ? '点赞失败' : '取消点赞失败',
          icon: 'none',
        });
      });
    this.setState({
      isShowJoinTopicLayer: false,
    });
  };

  onErrImg = (args, index) => {
    const { clubNotesList } = this.state;
    if (args && args.author) {
      args.author.headIcon =
        'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png';
    }
    clubNotesList[index] = args;
    this.setState({
      clubNotesList,
    });
  };

  onErrItemsImg = (args, index) => {
    const { clubNotesList } = this.state;
    args.coverImg =
      '//m.360buyimg.com/img/jfs/t1/114436/34/8905/6346/5ed50f2aE4c9dfd75/73ad43256da7afe5.jpg';
    clubNotesList[index] = args;
    this.setState({
      clubNotesList,
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
          () => {
            this.getClubTopicDetailFun();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  getDescribeLineCount = () => {
    const { clubTopicInfo } = this.state;
    this.setState({
      describeLineCount: Math.ceil(
        (clubTopicInfo && clubTopicInfo.topicDesc.length * 28) / 650
      ),
    });
  };

  getDescribeTxt = () => {
    const { clubTopicInfo } = this.state;
    let topicDesc = clubTopicInfo && clubTopicInfo.topicDesc;
    const topicDescLength = topicDesc.length;
    const describeLineCount = Math.ceil((topicDescLength * 28) / 650);

    if (topicDesc && describeLineCount > 3) {
      const topicDescMaxLength = parseInt((650 * 182) / (38 * 38));
      if (topicDescLength > topicDescMaxLength) {
        topicDesc = topicDesc && topicDesc.substr(0, topicDescMaxLength);
        topicDesc = topicDesc + '...';
      }
    }
    return topicDesc;
  };

  showDescribe = () => {
    this.setState(
      {
        isShowDescribeLayer: true,
      },
      () => {
        this.preventBodyScrool();
        logClick('7FRESH_miniapp_2_1578553760939|24');
      }
    );
  };

  closeDescribe = () => {
    this.setState(
      {
        isShowDescribeLayer: false,
      },
      () => {
        this.bodyScrool();
      }
    );
  };

  handleBack = () => {
    const params = getCurrentInstance().router.params;
    if (
      Taro.getCurrentPages().length > 1 &&
      params &&
      params.source !== 'post'
    ) {
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      Taro.switchTab({
        url: '/pages/center-tab-page/index',
      });
    }
  };

  closeJoinTopicLayer = () => {
    this.setState(
      {
        isShowJoinTopicLayer: false,
      },
      () => {
        this.bodyScrool();
      }
    );
  };

  //跳转发布
  gotoPostNotes = () => {
    this.bodyScrool();
    logClick('7FRESH_miniapp_2_1578553760939|25');
    const { clubTopicInfo } = this.state;
    const url = `/pages-activity/7club/post-notes/index?topicId=${clubTopicInfo.topicId}`;
    if (!isLogined()) {
      utils.redirectToLogin(url, 'redirectTo');
    } else {
      Taro.navigateTo({
        url: url,
      });
    }
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

  //解除阻止页面滚动
  bodyScrool = () => {
    this.setState({
      pageStyle: {},
    });
  };

  render() {
    const {
      isShowDescribeLayer,
      describeLineCount,
      suportNavCustom,
      pageStyle,
      clubTopicInfo,
      hotClubNotesList,
      newClubNotesList,
      topicListType,
      isShowJoinTopicLayer,
      iShowJoinTopicContainer,
      fixClass,
    } = this.state;
    const clubNotesList =
      topicListType === 1 ? hotClubNotesList : newClubNotesList;
    return (
      <View className='container' style={pageStyle}>
        {suportNavCustom && (
          <View className='top-cover'>
            <NavBar
              skin='black'
              showBack
              onBack={this.handleBack}
              clubTopicInfo={clubTopicInfo}
            />
          </View>
        )}

        <View className='main'>
          <View
            className='top-container'
            style={{
              height: describeLineCount > 4 ? px2vw(545) : px2vw(530),
            }}
          >
            <View className='top-layer' />
            <View
              className='top'
              style={{
                backgroundImage: `url(${clubTopicInfo &&
                  filterImg(clubTopicInfo.imgUrl)})`,
              }}
            ></View>
            <View className='top-title'>
              <View className='title'>
                <View className='title-icon' />
                <View className='title-txt'>
                  {clubTopicInfo && clubTopicInfo.topicName}
                </View>
              </View>
              <View className='ext'>
                <Text className='ext-info'>
                  {(clubTopicInfo && clubTopicInfo.browseNum) || 0}人浏览
                </Text>
                <View className='ext-line' />
                <Text className='ext-info'>
                  {(clubTopicInfo && clubTopicInfo.partakeNum) || 0}人参与
                </Text>
              </View>
            </View>
            <View className='describe'>
              <View className='describe-txt'>{this.getDescribeTxt()}</View>
              {/*<View className='describe-txt'>{clubTopicInfo.topicDesc}</View>*/}
              {describeLineCount > 4 && (
                <View
                  className='describe-all-btn'
                  onClick={this.showDescribe.bind(this)}
                >
                  {/*<View>...</View>*/}
                  <View className='describe-all-txt'>查看全部</View>
                </View>
              )}
            </View>
          </View>

          <TabList
            tabList={[
              { type: 1, tabName: '最热' },
              { type: 2, tabName: '最新' },
            ]}
            clubTopicInfo={clubTopicInfo}
            onBack={this.handleBack}
            suportNavCustom={suportNavCustom}
            onChangeClubNotesList={this.changeClubNotesList}
            topicListType={topicListType}
            onGetFixClass={this.onGetFixClass}
            onGetFixScrollTop={this.onGetFixScrollTop}
            fromPage='topic-detail'
          />

          {/*<View id='tab-list-space'></View>*/}
          {/*<View className={`${fixClass}`}>*/}
          {/*<View className='tab-list'>*/}
          {/*<View className='tab left'>*/}
          {/*<View className='tab-name cur'>*/}
          {/*最热*/}
          {/*<View className='line'></View>*/}
          {/*</View>*/}
          {/*</View>*/}
          {/*<View className='tab right'>*/}
          {/*<View className='tab-name'>最新</View>*/}
          {/*</View>*/}
          {/*</View>*/}
          {/*</View>*/}
        </View>

        {clubNotesList && clubNotesList.length > 0 && (
          <View
            style={{ minHeight: fixClass ? this.windowHeight + 'px' : 'auto' }}
          >
            <List
              clubNotesList={clubNotesList}
              onPartake={this.onPartake}
              onErrImg={this.onErrImg}
              onErrItemsImg={this.onErrItemsImg}
              isShowLayer={isShowJoinTopicLayer}
              onBodyScroll={this.bodyScrool}
            />
            {((topicListType === 1 && this.isShowHotNoMore) ||
              (topicListType === 2 && this.isShowNewNoMore)) && (
              <View className='no-more'>没有更多内容了</View>
            )}
          </View>
        )}
        {(!clubNotesList || clubNotesList.length === 0) && (
          <View className='empty'>
            <Image
              className='empty-img'
              src='https://m.360buyimg.com/img/jfs/t1/111487/36/7692/15086/5ec52b3dEe535c5de/a5da8579d4022e4d.png'
            />
            <View className='empty-txt'>暂未有人参与话题，快抢沙发吧~</View>
          </View>
        )}

        {isShowJoinTopicLayer === true && (
          <View
            className='join-topic-layer'
            onClick={this.closeJoinTopicLayer.bind(this)}
          />
        )}
        {iShowJoinTopicContainer && (
          <View
            className='join-topic-container'
            style={{
              height: isShowJoinTopicLayer === true ? '238rpx' : '0',
            }}
          >
            {isShowJoinTopicLayer === true && (
              <View className='join-topic-flag' />
            )}
            <View
              className='join-topic'
              onClick={this.gotoPostNotes.bind(this)}
            >
              <View className='join-topic-icon' />
              <View className='join-topic-txt'>参与话题</View>
            </View>
          </View>
        )}
        {isShowDescribeLayer && (
          <View>
            <View
              className='describe-layer'
              onClick={this.closeDescribe.bind(this)}
            />
            <View className='describe-all'>
              <View className='describe-layer-title'>
                <View className='describe-layer-title-main'>
                  <View className='describe-layer-title-icon' />
                  <View className='describe-layer-title-txt'>
                    {clubTopicInfo.topicName}
                  </View>
                </View>
                <View
                  className='close'
                  onClick={this.closeDescribe.bind(this)}
                />
              </View>

              <View className='describe-container'>
                <View className='content'>
                  <Text>{clubTopicInfo && clubTopicInfo.topicDesc}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
