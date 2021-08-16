import Taro from '@tarojs/taro';
import {
  View,
  Image,
  ScrollView,
  // Swiper,
  // SwiperItem,
  Input,
} from '@tarojs/components';
import {
  getSearchNewDefaultKeyWord,
  categoryV2GetFirstCategory,
  getShopInfoPageListService,
  getCartNum,
} from '@7fresh/api';
import { filterImg, px2vw } from '../../utils/common/utils';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import FloorEntrance from '../index/floor-entrance';
import goPage from '../index/goPage';
import CustomTabBar from '../../components/custom-tab-bar';
import CidColumn from '../../components/cid-column';

import utils from '../login/util';
import { exportPoint } from '../../utils/common/exportPoint';
import { structureLogClick } from '../../utils/common/logReport';

import './index.scss';


const app = Taro.getApp().$app;

export default class Category extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeId: '',
      allCategoryList: [],
      isNewShop: false,
      bannerList: '',
      page: 1,
      floor: {},

      cid1: '',
      cid1Index: 0,
      leftPageTop: 0,
      rightPageTop: 0,
      bottomShow: false,

      defaultKeyword: '搜索七鲜美食', // 搜索关键词
    };
  }
  coords = {};
  emptyShow = false;

  componentDidShow() {
    this.initData();
    this.onPageShow();
    this.getCartNum();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentDidMount() {
    Taro.hideShareMenu()
    this.initData();
    exportPoint(this.$router);

    Taro.createSelectorQuery()
      .select('.category-page')
      .boundingClientRect(rect => {
        if (rect) {
          console.log(rect, rect.height, rect.width);
          this.setState({
            windowWidth: rect.width,
            windowHeight: rect.height,
          });
        }
      })
      .exec();

  }

  onPullDownRefresh = () => {
    this.initData();
    Taro.stopPullDownRefresh();
  };

  onReachBottom = () => {
    console.log('=========触底=======');
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.dragBottom(this.state.page);
      }
    );
  };

  onShareAppMessage = () => {
    let title, imageUrl, bigImageUrl, miniProUrl;

    title = '七鲜分类';
    imageUrl =
      'http://m.360buyimg.com/img/jfs/t1/142737/3/8995/189663/5f69d1ffE464efebb/ead5eaf4a618d75d.png';
    bigImageUrl =
      'http://m.360buyimg.com/img/jfs/t1/142737/3/8995/189663/5f69d1ffE464efebb/ead5eaf4a618d75d.png';
    miniProUrl = `/pages/category/index?storeId=${this.state.storeId}`;
    return {
      title: title,
      imageUrl: bigImageUrl ? bigImageUrl : imageUrl,
      path: miniProUrl,
      success: function () { },
    };
  };

  initData = store => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeId = store ? store : addressInfo ? addressInfo.storeId : 0;
    const lat = addressInfo ? addressInfo.lat : '';
    const lon = addressInfo ? addressInfo.lon : '';
    getUserStoreInfo(storeId, lon, lat, '', 3).then(res => {
      console.log(res.storeId, this.state.cid1);
      if (res.storeId) {
        this.coords = {
          lng: res.lon,
          lat: res.lat,
        };
        this.setState(
          {
            storeId: res.storeId || '',
          },
          () => {
            //同步公共数据
            if (app.globalData) {
              app.globalData.storeId = res.storeId;
              app.globalData.coords = [res.lon, res.lat];
            }

            // 获取默认搜索词
            this.getSearchDefaultKeyWord();
            this.categoryGetall();
          }
        );
      } else {
        this.dragBottom(this.state.page);
      }
    });
  };

  dragBottom = page => {
    getShopInfoPageListService({
      page: page,
      pageSize: 10,
    }).then(res => {
      if (
        res &&
        res.shopInfoList &&
        this.state.floor &&
        this.state.floor.shopInfoList &&
        this.state.floor.shopInfoList.pageSize
      ) {
        let newArr = [
          ...this.state.floor.shopInfoList.pageList,
          ...res.shopInfoList.pageList,
        ];
        res.shopInfoList.pageList = newArr;
      }
      this.setState(
        {
          floor: res,
        },
        () => {
          console.log(this.state.floor);
        }
      );
    });
  };

  // 主逻辑接口
  categoryGetall = index => {
    const { cid1 } = this.state;
    categoryV2GetFirstCategory({ source: 3, cid1 })
      .then(data => {
        console.log('【7fresh_categoryV2_getFirstCategory】:', data);
        if (data && data.success) {
          const allCategoryList = (data && data.allCategoryList) || [];
          let cid1Index = 0;
          let cid1Name = 0;
          let childCategoryList = {};
          if (allCategoryList.length > 0) {
            allCategoryList.forEach((val, i) => {
              if (val.id === data.cid) {
                cid1Index = i;
                cid1Name = val.name;
                childCategoryList = val.childCategoryList;
                if (val.childCategoryList && val.childCategoryList.length < 1) {
                  this.emptyShow = true;
                }
              }
            });
          } else {
            this.emptyShow = true;
          }
          this.setState(
            {
              allCategoryList,
              cid1Index,
              cid1Name,
              childCategoryList,
              cid1: data.cid,

              isNewShop: (data && data.isNewShop) || false,
              bannerList: (data && data.bannerList) || [],
              bottomShow: true,
            },
            () => {
              this.cid1Scroll(index);
            }
          );
        } else {
          this.emptyShow = true;
        }
      })
      .catch(() => {
        this.emptyShow = true;
      });
  };
  /**
   * 获取默认搜索暗纹词
   */
  getSearchDefaultKeyWord() {
    getSearchNewDefaultKeyWord().then(res => {
      let defaultKeyWord = [{ keyword: '搜索七鲜美食商品' }];
      if (res && res.keyWordItemList && res.keyWordItemList.length > 0) {
        defaultKeyWord = res.keyWordItemList;
      }
      this.setState({
        defaultKeyword: defaultKeyWord,
      });
    });
  }
  /**
   * 获取购物车数量接口
   */
  getCartNum() {
    const { storeId } = this.state;
    getCartNum(storeId).then(res => {
      app.globalData.cartNum = res && res.allCartWaresNumber;
    });
  }

  // 点击一级分类
  changeCid = (params, index) => {
    /**
     * https://cf.jd.com/pages/viewpage.action?pageId=475651815
     */
    try {
      // 加车统一结构埋点
      structureLogClick({
        eventId: 'categoryMainPage_firstCategoryClick',
        jsonParam: {
          firstModuleId: params.id,
          firstModuleName: params.name,
          clickType: '-1',
          clickId: 'categoryMainPage_firstCategoryClick',
        },
      });
    } catch (error) {
      console.log('埋点报错');
    }

    if (params.id === this.state.cid1) {
      return;
    }

    this.emptyShow = false;
    this.setState({ cid1: params.id, bottomShow: false }, () => {
      this.categoryGetall(index);
    });
  };

  // 一级分类滑动
  cid1Scroll = (index = '') => {
    let itemHeight = 104;
    let leftPageTop = 0;
    if (index > 4) {
      leftPageTop = (index + 1 - 5) * itemHeight;
    } else {
      leftPageTop = 0;
    }
    this.setState(
      {
        leftPageTop: '',
        rightPageTop: '',
      },
      () => {
        this.setState({
          leftPageTop,
          rightPageTop: 0,
        });
      }
    );
  };

  //滑动到底部触发
  scrollToLower = () => {
    const { cid1, cid1Index, allCategoryList } = this.state;
    if (cid1Index + 1 > allCategoryList.length - 1) return;
    allCategoryList &&
      allCategoryList.length > 0 &&
      allCategoryList.forEach((val, i) => {
        if (val.id === cid1 && i + 1 <= allCategoryList.length) {
          this.setState(
            {
              cid1:
                allCategoryList[i + 1] && allCategoryList[i + 1].id
                  ? allCategoryList[i + 1].id
                  : cid1,
            },
            () => {
              this.categoryGetall(i + 1);
            }
          );
        }
      });
  };

  category2 = (val, i) => {
    console.log(val, i);
    const { cid1, cid1Name } = this.state;
    try {
      // 加车统一结构埋点
      structureLogClick({
        eventId: 'categoryMainPage_secondCategoryClick',
        jsonParam: {
          firstModuleId: cid1,
          firstModuleName: cid1Name,
          secondModuleId: val.link,
          secondModuleName: val.name,
          clickType: '-1',
          clickId: 'categoryMainPage_secondCategoryClick',
        },
      });
    } catch (error) {
      console.log('埋点报错');
    }
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeId = addressInfo ? addressInfo.storeId : '';
    const lat = addressInfo ? addressInfo.lat : '';
    const lon = addressInfo ? addressInfo.lon : '';
    const tenantId = addressInfo ? addressInfo.tenantId : 1;

    let url = `${app.h5RequestHost}/category2.html?from=miniapp&iconSource=2&cid=${cid1}&cid2=${val.link}&name=${cid1Name}&storeId=${storeId}&lat=${lat}&lng=${lon}&tenantId=${tenantId}`;
    utils.navigateToH5({
      page: url,
    });
  };

  searchPage = keyword => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeId = addressInfo ? addressInfo.storeId : '';
    const lat = addressInfo ? addressInfo.lat : '';
    const lon = addressInfo ? addressInfo.lon : '';
    const tenantId = addressInfo ? addressInfo.tenantId : 1;

    let url = `${app.h5RequestHost}/search/?defaultKeyWord=${keyword}&from=miniapp&storeId=${storeId}&lat=${lat}&lng=${lon}&tenantId=${tenantId}`;
    utils.navigateToH5({
      page: url,
    });
  };
  //根据urlType进行页面跳转
  goToUrl = (action, ev) => {
    console.log(action, ev, this.state.storeId, this.coords);
    ev.stopPropagation();
    goPage({
      action,
      storeId: this.state.storeId,
      coords: this.coords,
    });
  };

  changeStore = action => {
    console.log(action.storeId);
    if (action && action.storeId && action.storeId > 0) {
      this.setState(
        {
          storeId: action.storeId,
        },
        () => {
          app.globalData.storeId = action.storeId;
          this.initData(action.storeId);
          Taro.pageScrollTo({
            scrollTop: 0,
            duration: 300,
          });
        }
      );
    }
  };

  // 保证全屏的内容高度监控
  monitoringHeight = () => {
    const { windowWidth, windowHeight } = this.state;
    return `${((windowHeight -
      (windowWidth / 375) * (46 + 50 + (app.globalData && app.globalData.isIphoneX ? 18 : 0))) /
      windowHeight) *
      100}vh`;
  };

  bottomTxt = () => {
    const { cid1Index, allCategoryList, childCategoryList } = this.state;
    let text = '';
    if (cid1Index + 1 <= allCategoryList.length - 1) {
      if (childCategoryList && childCategoryList.length >= 10) {
        text = `上滑继续浏览 ${allCategoryList[cid1Index + 1] &&
          allCategoryList[cid1Index + 1].name}`;
      } else {
        text = `已经到底啦～`;
      }
    } else {
      text = `已经到底啦～`;
    }
    return text;
  };


  render() {
    const {
      allCategoryList = [],
      childCategoryList = [],
      // bannerList,
      floor,
      defaultKeyword,
      leftPageTop,
      rightPageTop,
    } = this.state;
    return (
      <View className='category-page'>
        {this.state.storeId ? (
          <View className='category-container'>
            <View className='seize-a-seat' />
            <View
              className='search-header'
              onClick={this.searchPage.bind(this, defaultKeyword[0].keyword)}
            >
              <View className='input-container'>
                <View className='search-icon' />
                <Input
                  type='search'
                  placeholder={defaultKeyword[0].keyword}
                  disabled
                />
                <View className='clear-input hide' />
              </View>
            </View>

            {/* {bannerList && bannerList.length > 1 && (
              <Swiper
                className='cate-banner-container'
                autoplay
                interval={2000}
                duration={1000}
                circular
                vertical={false}
                indicatorDots
                indicatorColor='rgba(255,255,255,0.3)'
                indicatorActiveColor='rgba(255,255,255,1)'
              >
                {bannerList &&
                  bannerList.length &&
                  bannerList.map((val, i) => {
                    return (
                      <SwiperItem
                        className='swiper-slide'
                        key={i}
                        onClick={this.goToUrl.bind(this, val.action)}
                      >
                        <Image src={val.image} className='img-banner' />
                      </SwiperItem>
                    );
                  })}
              </Swiper>
            )}
            {bannerList && bannerList.length == 1 && (
              <View className='cate-banner-container'>
                {bannerList[0] && (
                  <View
                    className='swiper-slide'
                    onClick={this.goToUrl.bind(this, bannerList[0].action)}
                  >
                    <Image src={bannerList[0].image} className='img-banner' />
                  </View>
                )}
              </View>
            )} */}
            <View
              className='category1-container'
              style={{
                opacity: this.state.isNewShop ? 0.5 : 1,
                height: this.monitoringHeight(),
              }}
            >
              <ScrollView
                className='cate-left-container'
                scrollY
                scrollWithAnimation
                style={{
                  height: this.monitoringHeight(),
                }}
                scroll-top={leftPageTop}
              >
                {allCategoryList &&
                  allCategoryList.length > 0 &&
                  allCategoryList.map((val, i) => {
                    return (
                      <CidColumn
                        source='category1'
                        val={val}
                        i={i}
                        key={i.toString()}
                        cid={this.state.cid1}
                        cidIndex={this.state.cid1Index}
                        cidList={allCategoryList}
                        onChangeCid={this.changeCid}
                      />
                    );
                  })}
              </ScrollView>

              <ScrollView
                className='cate-right-container'
                scrollY
                scrollWithAnimation
                style={{
                  height: this.monitoringHeight(),
                }}
                scroll-top={rightPageTop}
                onScrolltolower={this.scrollToLower}
              // onScroll={this.onScroll}
              >
                <View style={{ padding: `${px2vw(26)} 0` }}>
                  {childCategoryList && childCategoryList.length > 0 ? (
                    <View>
                      {childCategoryList.map((val, i) => {
                        return (
                          <View
                            className='cid2-card'
                            key={i.toString()}
                            onClick={this.category2.bind(this, val, i)}
                          >
                            <Image
                              className='cid2-card-img'
                              src={filterImg(
                                val.imageUrl ||
                                '//m.360buyimg.com/img/jfs/t1/186509/27/639/4390/608a8720Eadb32d4c/e42bba1880b4101d.png'
                              )}
                              alt='七鲜'
                            />
                            <View className='cid2-card-text'>{val.name}</View>
                          </View>
                        );
                      })}

                      {this.state.bottomShow && (
                        <View className='bottom-content'>
                          {childCategoryList &&
                            childCategoryList.length >= 10 && (
                              <View className='bottom-img'></View>
                            )}
                          <View className='bottom-text'>
                            {this.bottomTxt()}
                          </View>
                        </View>
                      )}

                      <View style={{ height: px2vw(144) }}></View>
                    </View>
                  ) : (
                    <View>
                      {this.emptyShow && (
                        <View className='none-content'>
                          <View className='none-img' />
                          <View className='none-txt'>
                            内容加载异常，请稍后再试
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </ScrollView>
              {/* <View className='table-wrapper'>
                {allCategoryList &&
                  allCategoryList.map((val, i) => {
                    return (
                      <View
                        className='item'
                        key={i}
                        onClick={this.category2.bind(this, val.id, val.name)}
                      >
                        <Image
                          className='item-image'
                          src={
                            val.imageUrl
                              ? val.imageUrl.indexOf('png') != -1 ||
                                val.imageUrl.indexOf('jpg') != -1
                                ? val.imageUrl
                                : '//m.360buyimg.com/img/jfs/t19441/112/313663715/2520/62673ba4/5a6b10c1N2be31512.png'
                              : '//m.360buyimg.com/img/jfs/t19441/112/313663715/2520/62673ba4/5a6b10c1N2be31512.png'
                          }
                        />
                        <View class='cate1-text'>{val.name}</View>
                      </View>
                    );
                  })}
              </View> */}
            </View>
          </View>
        ) : (
          <View>
            <View
              style={{
                background: '#efe',
                fontSize: '12px',
                padding: '10px 20px',
              }}
            >
              获取门店失败，请选择离您最近的门店
            </View>
            <FloorEntrance
              data={floor}
              onGoToUrl={this.changeStore.bind(this)}
            />
          </View>
        )}
        <CustomTabBar selected={1} />
      </View>
    );
  }
}
