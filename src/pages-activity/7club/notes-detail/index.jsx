import Taro,{getCurrentInstance} from '@tarojs/taro';
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Image,
  ScrollView,
} from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { filterImg, h5Url, isLogined } from '../../../utils/common/utils';
import utils from '../../../pages/login/util';
import NavBar from '../../../components/nav-bar';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import {
  switchNum,
  logClick,
  structureLogClick,
  exportPoint,
} from '../utils';
import {
  changeClubCollect,
  addCart,
  getClubContentDetail,
  clubDeleteNotes,
  getConfigService,
} from '@7fresh/api';
import './index.scss';
import ItemsModal from './items-modal';
import RelationItems from './relation-items';
import RecommendList from './recommend-list';
import CustomNavBar from './custom-nav-bar';
// import delNotesModal from './del-notes-modal';
// import delConfirmModal from './del-confirm-modal';
import { onGoToMine } from '../common/common';
import { images, px2vw } from '../utils';

export default class NotesDetail extends CommonPageComponent {

  constructor(props) {
    super(props);
    this.state = {
      isShowItemsModal: false,
      pageStyle: {},
      current: 0,
      suportNavCustom: true,
      statusHeight: '',
      navHeight: '',
      clubDetailInfo: {},
      topicList: '',
      wareInfoList: '',
      isShowDelNotesModal: false,
      windowWidth: '',
    };
  }
  isLogin = isLogined();

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.setState(
          {
            suportNavCustom: res.version.split('.')[0] >= 7,
            statusHeight: res.statusBarHeight,
            navHeight: res.statusBarHeight + 44,
            windowWidth: res.windowWidth,
          },
          () => {
            this.getStoreId();
            this.getConfigServiceFun();
          }
        );
      },
    });
  }

  /**
   * 右上角转发事件
   */
  onShareAppMessage() {
    const { clubDetailInfo } = this.state;
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|31',
      eparam: { contentId: clubDetailInfo && clubDetailInfo.contentId },
    });
    const imgUrl =
      clubDetailInfo &&
      clubDetailInfo.images &&
      clubDetailInfo.images.length > 0 &&
      clubDetailInfo.images[0];
    const url = `/pages-activity/7club/notes-detail/index?contentId=${clubDetailInfo.contentId}&contentType=${clubDetailInfo.contentType}`;
    return {
      title: clubDetailInfo && clubDetailInfo.title,
      desc: clubDetailInfo && clubDetailInfo.title,
      imageUrl: filterImg(imgUrl),
      path: `/pages/center-tab-page/index?returnUrl=${encodeURIComponent(url)}`,
    };
  }

  getClubNotesDetailFun = () => {
    const params = getCurrentInstance().router.params;
    console.log('params=', params);
    const { storeId } = this.state;
    const args = {
      contentType: (params && params.contentType) || 1,
      contentId: (params && params.contentId) || 21312908,
    };
    getClubContentDetail(storeId, args)
      .then(res => {
        let clubDetailInfo = '';
        let topicList = '';
        let wareInfoList = '';
        if (res && res.clubDetailInfo) {
          clubDetailInfo = res.clubDetailInfo;
        }
        if (res && res.topicList) {
          topicList = res.topicList;
        }
        if (res && res.wareInfoList) {
          wareInfoList = res.wareInfoList;
        }
        this.setState({
          clubDetailInfo: clubDetailInfo,
          topicList: topicList,
          wareInfoList: wareInfoList,
        });
      })
      .catch(() => {
        this.setState({
          clubDetailInfo: '',
          topicList: [],
          wareInfoList: [],
        });
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
            this.getClubNotesDetailFun();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  //改变收藏状态
  onCollection = () => {
    this.isOnCollection = true;
    const { storeId, clubDetailInfo } = this.state;
    if (!this.isLogin) {
      utils.redirectToLogin(
        `/pages-activity/7club/notes-detail/index?contentId=${clubDetailInfo.contentId}&contentType=${clubDetailInfo.contentType}`,
        'redirectTo'
      );
      return;
    }
    const opType = clubDetailInfo.collect ? 5 : 3;
    logClick({
      eid:
        opType === 5
          ? '7FERSH_APP_8_1590127250769|26'
          : '7FERSH_APP_8_1590127250769|25',
      eparam: { contentId: clubDetailInfo && clubDetailInfo.contentId },
    });
    const params = {
      contentId: clubDetailInfo && clubDetailInfo.contentId,
      contentType: clubDetailInfo && clubDetailInfo.contentType,
      opType: opType,
    };
    changeClubCollect(storeId, params)
      .then(res => {
        console.log('7club收藏', res);
        if (res.success) {
          Taro.showToast({
            title: this.getClubCollectToastTitle(opType) + '成功',
            icon: 'none',
          });
        } else {
          Taro.showToast({
            title: this.getClubCollectToastTitle(opType) + '失败',
            icon: 'none',
          });
        }
        clubDetailInfo.collect = clubDetailInfo.collect ? false : true;
        clubDetailInfo.collectCount = res.collectSum || 0;
        this.setState(
          {
            clubDetailInfo: clubDetailInfo,
          },
          () => {
            this.isOnCollection = false;
          }
        );
      })
      .catch(() => {
        Taro.showToast({
          title: this.getClubCollectToastTitle(opType) + '失败',
          icon: 'none',
        });
        this.isOnCollection = false;
      });
  };

  //去购物车
  gotoCart = () => {
    let uuid = '';
    const wxUserInfo = Taro.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const lbsData = Taro.getStorageSync('addressInfo') || '';
    const url = `${h5Url}/cart.html?storeId=${lbsData.storeId}&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`;
    utils.navigateToH5({ page: url });
  };

  //跳转话题详情
  gotoTopicDetail = args => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|29',
      eparam: { topicId: args && args.topicId },
    });
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-detail/index?topicId=${(args && args.topicId) ||
        ''}`,
    });
  };

  onLogClick = eid => {
    logClick({ eid: eid });
  };

  //改变点赞状态
  onPartake = () => {
    this.isOnPartake = true;
    const { storeId, clubDetailInfo } = this.state;
    console.log(
      'clubDetailInfo=',
      clubDetailInfo,
      `/pages-activity/7club/notes-detail/index?contentId=${clubDetailInfo.contentId}&contentType=${clubDetailInfo.contentType}`
    );
    if (!this.isLogin) {
      utils.redirectToLogin(
        `/pages-activity/7club/notes-detail/index?contentId=${clubDetailInfo.contentId}&contentType=${clubDetailInfo.contentType}`,
        'redirectTo'
      );
      return;
    }
    const opType = clubDetailInfo.ifLike ? 6 : 4;
    logClick({
      eid:
        opType === 6
          ? '7FERSH_APP_8_1590127250769|24'
          : '7FERSH_APP_8_1590127250769|23',
      eparam: { contentId: clubDetailInfo && clubDetailInfo.contentId },
    });
    const params = {
      contentId: clubDetailInfo && clubDetailInfo.contentId,
      contentType: clubDetailInfo && clubDetailInfo.contentType,
      opType: opType,
    };
    changeClubCollect(storeId, params)
      .then(res => {
        if (res.success) {
          Taro.showToast({
            title: this.getClubCollectToastTitle(opType) + '成功',
            icon: 'none',
          });
        } else {
          Taro.showToast({
            title: this.getClubCollectToastTitle(opType) + '失败',
            icon: 'none',
          });
        }
        clubDetailInfo.ifLike = clubDetailInfo.ifLike ? false : true;
        clubDetailInfo.likeCount = res.collectSum || 0;
        this.setState(
          {
            clubDetailInfo: clubDetailInfo,
          },
          () => {
            this.isOnPartake = false;
          }
        );
      })
      .catch(() => {
        Taro.showToast({
          title: this.getClubCollectToastTitle(opType) + '失败',
          icon: 'none',
        });
        this.isOnPartake = false;
      });
  };

  getClubCollectToastTitle = opType => {
    let clubCollectToastTitle = '';
    if (opType === 3) {
      clubCollectToastTitle = '收藏';
    } else if (opType === 4) {
      clubCollectToastTitle = '点赞';
    } else if (opType === 5) {
      clubCollectToastTitle = '取消收藏';
    } else if (opType === 6) {
      clubCollectToastTitle = '取消点赞';
    }
    return clubCollectToastTitle;
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

  showItemsModal = () => {
    this.setState(
      {
        isShowItemsModal: true,
      },
      () => {
        this.preventBodyScrool();
      }
    );
  };
  handleCloseItemsModal = () => {
    this.setState(
      {
        isShowItemsModal: false,
      },
      () => {
        this.bodyScrool();
      }
    );
  };

  //跳转商详
  gotoItemsDetail = (skuId, e) => {
    if (e && e.stopPropagation) {
      // 防止冒泡
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    const { storeId } = this.state;
    Taro.navigateTo({
      url: `/pages/detail/index?storeId=${storeId}&skuId=${skuId}`,
    });
  };

  //添加购物车
  addCart = (args, e) => {
    e && e.stopPropagation();
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|28',
      eparam: { skuId: args && args.skuId },
    });
    const { isShowItemsModal } = this.state;
    try {
      // 加车统一结构埋点
      structureLogClick({
        eventId: isShowItemsModal
          ? 'noteDetailPage_mention_addCart'
          : 'noteDetailPage_relation_addCart',
        jsonParam: {
          firstModuleId: isShowItemsModal ? 'mentionModule' : 'relationModule',
          firstModuleName: isShowItemsModal ? '提到的商品' : '关联商品',
          clickType: 1,
          skuName: args && args.skuName,
          skuId: args && args.skuId,
        },
      });
    } catch (error) {
      console.log('埋点报错');
    }
    const { storeId } = this.state;
    const params = {
      wareInfos: {
        skuId: args.skuId,
        buyNum: args.startBuyUnitNum || 1,
        serviceTagId: args.serviceTagId || 0,
      },
      storeId: storeId,
    };
    addCart({
      data: params,
    }).then(res => {
      let msg = '';
      if (res.success) {
        msg = res.msg || '添加成功！';
      } else {
        msg = res.msg || '添加失败！';
      }
      Taro.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
      });
    });
  };

  //一键全部添加购物车
  addCartAll = (args, e) => {
    e && e.stopPropagation();
    const { storeId } = this.state;

    let wareInfos = [];
    for (let i = 0; i < args.length; i++) {
      if (Number(args[i].status) === 2) {
        let json = {
          skuId: args[i].skuId,
          skuName: args[i].skuName,
          buyNum: args[i].startBuyUnitNum || 1,
          serviceTagId: args[i].serviceTagId || 0,
        };
        wareInfos.push(json);
      }
    }
    const params = {
      wareInfos: wareInfos,
      storeId: storeId,
    };
    try {
      // 加车统一结构埋点
      structureLogClick({
        eventId: 'noteDetailPage_mention_oneKeyBuy_addCart',
        jsonParam: {
          firstModuleId: 'mentionModule',
          firstModuleName: '提到的商品',
          secondModuleId: 'oneKeyBuyModule',
          secondModuleName: '一键全部加购',
          clickType: 10,
          skuName: wareInfos.map(item => item.skuName).join('+'),
          skuId: wareInfos.map(item => item.skuId).join('+'),
        },
      });
    } catch (error) {
      console.log('埋点报错');
    }
    addCart({
      data: params,
    }).then(res => {
      let msg = '';
      if (res.success) {
        msg = res.msg || '添加成功！';
      } else {
        msg = res.msg || '添加失败！';
      }
      Taro.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
      });
      // this.setState({
      //   isShowItemsModal:false
      // })
    });
  };

  // changeIndex = ev => {
  //   this.setState({
  //     current: ev.currentTarget.current,
  //   });
  // };

  getConfigServiceFun = () => {
    getConfigService().then(res => {
      if (res) {
        console.log('res========', res);
        this.setState({
          userInfo: res.userInfo,
        });
      }
    });
  };

  deleteNotes = () => {
    const { clubDetailInfo, storeId, userInfo } = this.state;
    const params = {
      contentId: clubDetailInfo && clubDetailInfo.contentId,
    };

    if (
      clubDetailInfo &&
      clubDetailInfo.author &&
      clubDetailInfo.author.author &&
      userInfo &&
      userInfo.pin &&
      userInfo.pin === clubDetailInfo.author.author
    ) {
      clubDeleteNotes(storeId, params)
        .then(res => {
          if (res) {
            console.log('res===', res);
            if (res.success) {
              Taro.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000,
              }).then(() => {
                this.handleBack();
              });
            }
          } else {
            Taro.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000,
            });
          }
        })
        .catch(() => {
          Taro.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000,
          });
        });
    }
  };

  showDelNotesModal = () => {
    this.setState(
      {
        isShowDelNotesModal: true,
      },
      () => {
        this.preventBodyScrool();
      }
    );
  };

  closeDelNotesModal = () => {
    this.setState(
      {
        isShowDelNotesModal: false,
      },
      () => {
        this.bodyScrool();
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

  //解除阻止页面滚动
  bodyScrool = () => {
    this.setState({
      pageStyle: {},
    });
  };

  goToMine = author => {
    onGoToMine(author);
  };

  reFresh = () => {
    this.getStoreId();
  };

  scrollChange = ev => {
    this.setState({
      current: ev && ev.detail && ev.detail.current,
    });
  };
  handlerPadding = (index, length) => {
    let pixelRatio = this.state.windowWidth / 375;
    if (index > 3 && length - index > 1) {
      this.scrollLeft = Math.round((index - 3) * 8 * pixelRatio);
    }
    if (index < 3) {
      this.scrollLeft = 0;
    }
    return this.scrollLeft;
  };
  render() {
    const {
      isShowItemsModal,
      pageStyle,
      current,
      suportNavCustom,
      statusHeight,
      navHeight,
      clubDetailInfo,
      wareInfoList,
      topicList,
      isShowDelNotesModal,
      userInfo,
    } = this.state;
    const {
      author,
      createTime,
      title,
      collect,
      collectCount,
      ifLike,
      likeCount,
      contentDetail,
    } = clubDetailInfo;
    const imgList = (clubDetailInfo && clubDetailInfo.images) || [];

    return (
      <View>
        <View className='container' style={pageStyle}>
          {suportNavCustom && (
            <View className='top-cover'>
              {clubDetailInfo && JSON.stringify(clubDetailInfo) !== '{}' && (
                <CustomNavBar
                  showBack
                  onBack={this.handleBack}
                  statusHeight={statusHeight}
                  navHeight={navHeight}
                  author={author}
                  onGotoCart={this.gotoCart}
                  onGoToMine={this.goToMine}
                  onShow={this.showDelNotesModal}
                  isLogin={this.isLogin}
                  clubDetailInfo={clubDetailInfo}
                  userInfo={userInfo}
                  onLogClick={this.onLogClick}
                />
              )}
              {(!clubDetailInfo || JSON.stringify(clubDetailInfo) === '{}') && (
                <NavBar skin='white' showBack onBack={this.handleBack} />
              )}
            </View>
          )}

          {clubDetailInfo && JSON.stringify(clubDetailInfo) !== '{}' && (
            <View
              className='main'
              style={{ marginTop: suportNavCustom ? `${navHeight}px` : 0 }}
            >
              <View className='sw'>
                <Swiper
                  style={{
                    height: clubDetailInfo.radio
                      ? px2vw(750 / clubDetailInfo.radio)
                      : px2vw(562),
                  }}
                  interval={2500}
                  duration={1000}
                  autoplay={false}
                  current={0}
                  onChange={this.scrollChange}
                >
                  {imgList &&
                    imgList.length > 0 &&
                    imgList.map((val, i) => {
                      return (
                        <SwiperItem key={i.toString()} className='swiper-item'>
                          <Image
                            src={filterImg(val)}
                            className='img'
                            mode='aspectFill'
                          />
                        </SwiperItem>
                      );
                    })}
                </Swiper>
              </View>

              {imgList && imgList.length > 1 && (
                <ScrollView
                  className='dot-list'
                  scrollX
                  scrollLeft={this.handlerPadding(current, imgList.length)}
                  scrollWithAnimation
                  enableFlex
                  style={{ width: '70rpx' }}
                >
                  {imgList.map((info, i) => {
                    return (
                      <View
                        className={current == i ? 'dot sel' : 'dot'}
                        key={info}
                        style={{
                          width: '8rpx',
                          marginRight: '8rpx',
                        }}
                      />
                    );
                  })}
                </ScrollView>
              )}
              {(!imgList || imgList.length <= 1) && (
                <View className='clear-line' />
              )}

              {wareInfoList && wareInfoList.length > 0 && (
                <RelationItems
                  wareInfoList={wareInfoList}
                  onGoDetail={this.gotoItemsDetail}
                  onAddCart={this.addCart}
                />
              )}

              <View
                className='describe'
                style={{
                  marginTop:
                    wareInfoList && wareInfoList.length > 0 ? '30rpx' : '',
                }}
              >
                <View className='describe-title'>{title}</View>
                <Text className='describe-info'>
                  {contentDetail &&
                    JSON.parse(contentDetail) &&
                    JSON.parse(contentDetail).dataList &&
                    JSON.parse(contentDetail).dataList.length > 0 &&
                    JSON.parse(contentDetail).dataList[0].stepDesc}
                </Text>

                {clubDetailInfo &&
                  clubDetailInfo.topicInfoList &&
                  clubDetailInfo.topicInfoList.length > 0 && (
                    <View className='topic-name-container'>
                      {clubDetailInfo.topicInfoList.map((val, i) => {
                        return (
                          <View
                            className='topic-name'
                            key={i.toString()}
                            onClick={this.gotoTopicDetail.bind(this, val)}
                          >
                            <View className='topic-name-icon' />
                            <View className='topic-name-txt'>
                              {val.topicName}
                            </View>
                          </View>
                        );
                      })}
                      {/*<View className='topic-name'>*/}
                      {/*<View className='topic-name-icon' />*/}
                      {/*<View className='topic-name-txt'>测试测试测试测试</View>*/}
                      {/*</View>*/}
                    </View>
                  )}

                <View className='date'>{createTime}</View>
              </View>

              <RecommendList topicList={topicList} />
            </View>
          )}

          {clubDetailInfo && JSON.stringify(clubDetailInfo) !== '{}' && (
            <View className='bottom-btns'>
              <View
                className='collection'
                onClick={this.onCollection.bind(this)}
              >
                <View
                  className='btn'
                  style={{
                    backgroundSize: collect
                      ? this.isOnCollection
                        ? '100%'
                        : '60%'
                      : '60%',
                    backgroundImage: collect
                      ? this.isOnCollection
                        ? `url(${images.collectSelectedGif}?t=${Math.ceil(
                            Math.random() * 1000
                          )})`
                        : `url(${images.collectSelectedImg})`
                      : `url(${images.collectDefaultImg})`,
                  }}
                />
                <View className='txt'>
                  {collectCount ? switchNum(collectCount) : '收藏'}
                </View>
              </View>
              <View className='praise' onClick={this.onPartake.bind(this)}>
                <View
                  className='btn'
                  style={{
                    backgroundSize: ifLike
                      ? this.isOnPartake
                        ? '100%'
                        : '60%'
                      : '60%',
                    backgroundImage: ifLike
                      ? this.isOnPartake
                        ? `url(${images.praiseSelectedGif}?t=${Math.ceil(
                            Math.random() * 100
                          )})`
                        : `url(${images.praiseSelectedImg})`
                      : `url(${images.praiseDefaultImg})`,
                  }}
                />
                <View className='txt'>
                  {likeCount ? switchNum(likeCount) : '点赞'}
                </View>
              </View>
              {wareInfoList && wareInfoList.length > 0 && (
                <View
                  className='items'
                  onClick={this.showItemsModal.bind(this)}
                >
                  <View className='items-btn'>
                    商品({wareInfoList && wareInfoList.length})
                  </View>
                </View>
              )}
            </View>
          )}

          {isShowItemsModal && wareInfoList && wareInfoList.length > 0 && (
            <ItemsModal
              wareInfoList={wareInfoList}
              onClose={this.handleCloseItemsModal}
              onGoDetail={this.gotoItemsDetail}
              onAddCart={this.addCart}
              onAddCartAll={this.addCartAll}
            />
          )}
          {/*{isShowDelNotesModal === true && (*/}
          {/*<delNotesModal*/}
          {/*onDelNotes={this.deleteNotes}*/}
          {/*onClose={this.closeDelNotesModal}*/}
          {/*/>*/}
          {/*)}*/}

          {isShowDelNotesModal === true && (
            <delConfirmModal
              onDelNotes={this.deleteNotes}
              onClose={this.closeDelNotesModal}
            />
          )}
        </View>

        {!clubDetailInfo && (
          <View className='empty'>
            <View className='empty-img'></View>
            <View className='empty-txt'>抱歉，没有相关的结果</View>
            <View className='empty-btn' onClick={this.reFresh.bind(this)}>
              刷新试试
            </View>
          </View>
        )}
      </View>
    );
  }
}
