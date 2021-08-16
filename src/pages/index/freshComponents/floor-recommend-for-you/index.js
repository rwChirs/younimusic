import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import FreshPosterSwiper from '../../components/poster-swiper';
// import ProductItem from '../../../../components/product-item';
import ProductItem from '../product-item';
import MenuProductItem from '../../components/menu-product-item';
import ImageProductItem from '../../components/image-product-item';
import RecommendSearch from '../../components/recommend-search';
import CommonTab from '../../components/common-tab';
import EmptyPage from '../../../../components/empty-page';
import FloorFindGoods from '../../components/floor-find-goods';

import {
  logClick,
  commonLogExposure,
} from '../../../../utils/common/logReport';
import { h5Url, px2vw } from '../../../../utils/common/utils';
import { getExposure } from '../../../../utils/common/exportPoint';
import Loading from '../../../../components/loading';
import './index.scss';

const expActionTarget = {
  1: 2, // 商品
  2: 8, // 菜谱
  3: 3, // 图片
  4: 11, // 热搜词查询
  5: 10, // 广告轮播
  6: 12, // 视频
};

export default class FloorRecommendForYou extends Component {
  static defaultProps = {
    leftItems: [],
    rightItems: [],
    data: {
      floorStyle: 1,
      firstTitle: '猜你喜欢',
      secondTitle: '',
    },
    recommendForYouProps: {
      fixedNav: false,
      tabIndex: 0,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isNone: false,
      fixedNav: false,
      loadPicture:
        'https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png',
    };

    this.recommendTop = null;
    this.headerHeight = 86;
    this.windowHeight = 700;
    this.windowWidth = 375;
    this.tabSelectFlug = true;
    this.leftHeight = 0;
    this.rightHeight = 0;
  }

  componentWillMount() {
    this.setState({
      isNone: false,
    });
    Taro.getSystemInfo({
      success: (res) => {
        console.log('getSystemInfo', res);
        this.windowHeight = res.windowHeight;
        this.windowWidth = res.windowWidth;
      },
    });
  }

  componentDidMount() {
    this.getRecommendGroupTop();
    this.pageExposure({
      items: this.props.leftItems,
      isRight: false,
      index: 0,
    });
    this.pageExposure({
      items: this.props.rightItems,
      isRight: true,
      index: 0,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.leftItems.length > this.props.leftItems.length ||
      nextProps.rightItems.length > this.props.rightItems.length
    ) {
      this.pageExposure({
        items: nextProps.leftItems.slice(this.props.leftItems.length),
        isRight: false,
        index: this.props.leftItems.length,
      });
      this.pageExposure({
        items: nextProps.rightItems.slice(this.props.rightItems.length),
        isRight: true,
        index: this.props.rightItems.length,
      });
      return true;
    }

    if (
      nextProps.leftItems.length <= this.props.leftItems.length ||
      nextProps.rightItems.length <= this.props.rightItems.length
    ) {
      this._intersectionObserver && this._intersectionObserver.disconnect();
      this.pageExposure({
        items: nextProps.leftItems,
        isRight: false,
        index: 0,
      });
      this.pageExposure({
        items: nextProps.rightItems,
        isRight: true,
        index: 0,
      });
      return true;
    }
    return true;
  }

  componentWillUnmount() {
    this._intersectionObserver && this._intersectionObserver.disconnect();
    const { data } = this.props;
    const { tab } = data;
    if (tab && tab.length > 0) {
      for (let i in tab) {
        Taro.removeStorageSync(`recommendforYouList${i}`);
        Taro.removeStorageSync(`recommendforYouList${i}-max`);
        Taro.removeStorageSync(`recommendforYouList${i}-page`);
      }
    }
  }

  // tab 吸顶
  getRecommendGroupTop() {
    // 可视区域上边界
    const bottomNum = -(this.windowHeight - this.getRealValue(90)); // 可视区域下边界
    const targetDom = '#floorRecommendForYou'; // 目标元素
    // 获取 tab 的位置
    const query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select(targetDom).boundingClientRect();

    try {
      this._intersectionObserver = wx.createIntersectionObserver();
      this._intersectionObserver
        .relativeToViewport({ bottom: bottomNum })
        .observe(targetDom, (res = {}) => {
          console.log(
            'tab 吸顶',
            bottomNum,
            res.intersectionRatio,
            res.intersectionRect.top
          );
          const fixedNav = res.intersectionRatio > 0;
          if (!fixedNav) {
            const { data } = this.props;
            const { tab } = data;
            if (tab && tab.length > 0) {
              for (let i in tab) {
                Taro.removeStorageSync(`recommend${i}Top`);
              }
            }
          }

          this.props.onFixedTop(fixedNav);

          this.setState({ fixedNav });
          // 取得 tab 位置
          query.exec((res1 = []) => {
            if (res1[0] && res1[1]) {
              console.log(
                '取得 tab 位置',
                res1,
                res1[0].scrollTop + res1[1].top
              );
              if (this.recommendTop === null) {
                this.recommendTop = res1[0].scrollTop + res1[1].top;
              }
            }
          });
        });
    } catch (err) {
      console.warn('版本过低不支持吸顶特性', err);
    }
  }

  //不同屏幕数值运算得出真实数值
  getRealValue(value) {
    return (value * this.windowWidth) / 750;
  }

  // 获取公共埋点参数
  getCommonLogParam = ({ item = {}, type, index }) => {
    const { recommendForYouProps, data = {} } = this.props;
    const { tabIndex = 0 } = recommendForYouProps;
    const { tab, floorIndex } = data;
    const tabName = (tab && tab[tabIndex] && tab[tabIndex].title) || '全部';
    const tabSourceBuriedPoint =
      tab && tab[tabIndex] && tab[tabIndex].tabSourceBuriedPoint;
    const itemIndex = type === 'left' ? index * 2 : index * 2 + 1;
    return {
      from: 'recommend',
      tabIndex: tabIndex + 1,
      tabName: tabName,
      tabSourceBuriedPoint,
      ...tabSourceBuriedPoint,
      index: itemIndex + 1,
      skuId: item && item.skuId,
      skuName: item && item.skuName,
      floorIndex,
      broker_info: item && item.brokerInfo,
      page: item && item.page,
      page_index: item && item.pageIndex,
    };
  };

  pageExposure = ({ items = [], index = 0, isRight = false }) => {
    const { recommendForYouProps, data } = this.props;
    const { tabIndex = 0 } = recommendForYouProps;
    const { tab, floorIndex } = data;
    items &&
      items.length > 0 &&
      items.map((item, i) => {
        const tabName = (tab && tab[tabIndex] && tab[tabIndex].title) || '全部';
        const tabSourceBuriedPoint =
          tab && tab[tabIndex] && tab[tabIndex].tabSourceBuriedPoint;
        const itemIndex = isRight ? i * 2 + 1 + index : i * 2 + index;
        const clsTag =
          `${this.getClstag(item)}-${tabName}-${itemIndex}-${this.getClsTagExt(
            item
          )}` || '';
        const id = `floor-recommend-items-${itemIndex}-`;
        const targetDom = `#${id}${tabIndex}`;
        this._intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        this._intersectionObserver
          .relativeToViewport({ bottom: -50 })
          .observe(targetDom, () => {
            if (!this[`${id}${tabIndex}`]) {
              //曝光埋点
              const params = {
                router: this.$router,
                eid: clsTag || `${id}${tabIndex}`,
              };
              getExposure(params);
              this[`${id}${tabIndex}`] = true;
              // 鲜橙新埋点
              if (data && data.buriedPointVo) {
                const expAction = {
                  target: expActionTarget[item && item.style],
                  index: itemIndex + 1,
                  tabIndex: tabIndex + 1,
                  tabName: tabName,
                  tabSourceBuriedPoint,
                  ...tabSourceBuriedPoint,
                  floorIndex,
                  broker_info: item && item.brokerInfo,
                  page: item && item.page,
                  page_index: item && item.pageIndex,
                };
                if (item && item.style === 1) {
                  expAction.skuId = item.skuId;
                }
                if (item && item.style === 2) {
                  expAction.contentId = item && item.contentId;
                }
                commonLogExposure({
                  action: expAction, // 曝光动作参数
                  buriedPointVo: data.buriedPointVo,
                });
              }
            }
          });
      });
  };

  getClstag = (val) => {
    let clstag = '7FERSH_APP_8_1590127250769|28';
    if (val) {
      if (val.style === 5) {
        clstag = '7FERSH_APP_8_1590127250769|32';
      } else if (val.style === 4) {
        clstag = '7FERSH_APP_8_1590127250769|33';
      } else if (val.style === 3) {
        clstag = '7FERSH_APP_8_1590127250769|31';
      } else if (val.style === 2) {
        clstag = '7FERSH_APP_8_1590127250769|29';
      }
    }
    return clstag;
  };

  getClsTagExt = (val) => {
    let clstagExt = '';
    if (val) {
      if (val.style === 5) {
        clstagExt = `${val.title}-${val.acPageUrl}`;
      } else if (val.style === 3) {
        const { data } = this.props;
        const buriedPointVo = data && data.buriedPointVo;
        const imageMap = buriedPointVo && buriedPointVo.imageMap;
        const imageName =
          imageMap &&
          typeof imageMap === 'object' &&
          imageMap[val.image] &&
          imageMap[val.image].imageName;
        clstagExt = `${imageName || val.image}-${
          (val.action && val.action.toUrl) || ''
        }`;
      } else if (val.style === 2) {
        clstagExt = `${val.contentId}`;
      } else if (val.style === 1) {
        clstagExt = `${val.skuId}`;
      }
    }
    return clstagExt;
  };

  onTabSelect(index) {
    const { data } = this.props;
    const { tab } = data;
    const tabSourceBuriedPoint = tab[index] && tab[index].tabSourceBuriedPoint;
    this.setState({
      isNone: false,
    });
    // 鲜橙新埋点
    this.props.onGoToUrl({
      urlType: '0',
      target: 7,
      tabName: tab[index] && tab[index].title,
      index: index + 1,
      tabIndex: index + 1,
      tabSourceBuriedPoint,
      ...tabSourceBuriedPoint,
    });

    if (tab && tab.length > 0 && tab[index] && tab[index].clsTag) {
      //老埋点
      logClick({ eid: tab[index].clsTag });
      //为你推荐特殊埋点0716版本开发
      logClick({
        eid: '7FERSH_APP_8_1590127250769|27',
        eparam: {
          tabName: tab[index].title,
        },
      });
      logClick({ eid: tab[index].clsTag }); // 老埋点
    }

    this.props.onTabSelect(index, this.state.fixedNav, this.recommendTop);
    //2s后还没有数据就展示拖底
    setTimeout(() => {
      const { leftItems, rightItems } = this.props;
      if (
        !(
          leftItems &&
          leftItems.length > 0 &&
          rightItems &&
          rightItems.length > 0
        )
      ) {
        this.setState({
          isNone: true,
        });
      }
    }, 1000);
  }

  onGoToUrl = (item, index, type) => {
    const { data } = this.props;
    const imageMap = data && data.buriedPointVo && data.buriedPointVo.imageMap;
    const imageName =
      imageMap &&
      typeof imageMap === 'object' &&
      imageMap[item.image] &&
      imageMap[item.image].imageName;
    const commonLogParam = this.getCommonLogParam({ item, index, type });

    logClick({
      eid: '7FERSH_APP_8_1590127250769|19',
      eparam: {
        tabName: commonLogParam.tabName,
        imageName: imageName || item.image,
        url: item && item.action && item.action.toUrl,
      },
    });
    this.props.onGoToUrl({
      ...item.action,
      target: 3,
      imageUrl: item.image,
      ...commonLogParam,
    });
  };

  onGoBillDetail = (item, index, type) => {
    const commonLogParam = this.getCommonLogParam({ item, index, type });
    this.props.onGoToUrl({
      urlType: '220',
      toUrl: `contentId=${item.contentId}&planDate=${item.planDate}`,
      index: type === 'left' ? 2 * index : 2 * index + 1,
      target: 8,
      contentId: item.contentId,
      ...commonLogParam,
    });
  };

  onGoSearch = (info, index, type, args) => {
    const commonLogParam = this.getCommonLogParam({ item: info, index, type });
    const url = (args && args.url) || '';
    const keyword = args && args.hotWord;
    let toUrl = url;
    if (!toUrl) {
      toUrl = `${h5Url}/search/list?from=miniapp&keyword=${keyword}`;
    }
    logClick({
      eid: '7FERSH_APP_8_1590127250769|21',
      eparam: {
        tabName: commonLogParam.tabName,
        keyword: keyword,
      },
    });
    this.props.onGoToUrl({
      urlType: '3',
      toUrl: toUrl,
      target: 11,
      ...commonLogParam,
    });
  };

  onGoDetail = (item, index, type) => {
    const commonLogParam = this.getCommonLogParam({ item, index, type });
    if (type === 'left') {
      this.props.onGoToUrl({
        urlType: '1',
        toUrl: `skuId=${item.skuId}`,
        index: type === 'left' ? 2 * index : 2 * index + 1,
        target: 2,
        productItem: item,
        position: type, // 左边还是右边
        positionIndex: index + 1,
        ...commonLogParam,
      });
    } else {
      this.props.onGoToUrl({
        urlType: '1',
        toUrl: `skuId=${item.skuId}`,
        index: type === 'left' ? 2 * index : 2 * index + 1,
        target: 2,
        productItem: item,
        position: type, // 左边还是右边
        positionIndex: index + 1,
        ...commonLogParam,
      });
    }
  };

  onGoActivity = (info, index, type) => {
    const url = (info && info.acPageUrl) || '';
    const commonLogParam = this.getCommonLogParam({ item: info, index, type });
    logClick({
      eid: '7FERSH_APP_8_1590127250769|20',
      eparam: {
        tabName: commonLogParam.tabName,
        title: info && info.title,
        url: url,
      },
    });
    // utils.navigateToH5({ page: url });
    this.props.onGoToUrl({
      urlType: '3',
      toUrl: url,
      target: 10,
      ...commonLogParam,
    });
  };

  onScrollToLower() {
    this.props.onScrollToLower();
  }

  onAddCartSever = (val, index, type) => {
    const { onAddCart } = this.props;
    const commonLogParam = this.getCommonLogParam({ item: val, index, type });
    onAddCart &&
      onAddCart({
        ...val,
        index: commonLogParam.index,
        action: {
          target: 4,
          ...commonLogParam,
        },
      });
  };

  onCollect = (val, index, type, option) => {
    const { onCollect } = this.props;
    const commonLogParam = this.getCommonLogParam({ item: val, index, type });
    // 为了埋点
    this.props.onGoToUrl({
      urlType: '0',
      target: 9,
      contentId: val.contentId,
      ...commonLogParam,
    });
    onCollect && onCollect(option);
  };

  // 预付卡去
  onGoCardOrder = (val, index, type, option) => {
    const { onGoCardOrder } = this.props;
    const commonLogParam = this.getCommonLogParam({ item: val, index, type });
    onGoCardOrder &&
      onGoCardOrder({
        ...option,
        index: commonLogParam.index,
        action: {
          target: 14,
          urlType: 'goCardOrder',
          ...commonLogParam,
        },
      });
  };

  render() {
    const { fixedNav, loadPicture, isNone } = this.state;
    const {
      windowWidth,
      data,
      recommendForYouProps,
      leftItems,
      rightItems,
      onRefresh,
      isRecommedLoad,
      navHeight,
      isShowApplet,
      onToRecommendDetail,
    } = this.props;

    const { tab, show } = data;

    const bankData = data && data.smartAV;

    return (
      <View className='floor-recommend'>
        <CommonTab
          navHeight={navHeight}
          isShowApplet={isShowApplet}
          windowWidth={windowWidth}
          data={tab}
          isFixed={fixedNav}
          isShowSecondTitle={!fixedNav}
          isShowBottomLine={fixedNav}
          containerStyle={{
            backgroundColor: fixedNav ? '#fff' : '',
            zIndex: fixedNav ? 10 : 'none',
          }}
          index={recommendForYouProps.tabIndex}
          onSelect={this.onTabSelect.bind(this)}
        />
        <View
          className='items-list-main'
          style={{
            marginTop: fixedNav ? px2vw(100) : px2vw(20),
          }}
        >
          {isRecommedLoad && <Loading tip='加载中...' />}

          {leftItems && leftItems.length > 0 && (
            <View className='floor-recommend-con ml floor-recommend-left'>
              {leftItems.map((val, i) => {
                return (
                  <View
                    key={`floor-recommend-items-${i * 2}-${
                      recommendForYouProps.tabIndex
                    }`}
                    id={`floor-recommend-items-${i * 2}-${
                      recommendForYouProps.tabIndex
                    }`}
                  >
                    {val && val.style === 5 ? (
                      <FreshPosterSwiper
                        data={val}
                        onClick={this.onGoActivity.bind(this, val, i, 'left')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                      />
                    ) : val && val.style === 4 ? (
                      <RecommendSearch
                        data={val.hotWordLocalList}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        onGoSearch={this.onGoSearch.bind(this, val, i, 'left')}
                      />
                    ) : val && val.style === 3 ? (
                      <ImageProductItem
                        data={val}
                        onGoToUrl={this.onGoToUrl.bind(this, val, i, 'left')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                      />
                    ) : val && val.style === 2 ? (
                      <MenuProductItem
                        show={show}
                        data={val}
                        index={i}
                        onGoDetail={this.onGoBillDetail.bind(
                          this,
                          val,
                          i,
                          'left'
                        )}
                        onCollect={this.onCollect.bind(this, val, i, 'left')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        type='left'
                      />
                    ) : val && val.style === 1 ? (
                      <ProductItem
                        windowWidth={windowWidth}
                        type={2}
                        data={val}
                        onGoCardOrder={this.onGoCardOrder.bind(
                          this,
                          val,
                          i,
                          'left'
                        )}
                        onGoDetail={this.onGoDetail.bind(this, val, i, 'left')}
                        onAddCart={this.onAddCartSever.bind(
                          this,
                          val,
                          i,
                          'left'
                        )}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        isFromPage='recommend'
                        bankData={bankData}
                        isShowMarketPrice
                      />
                    ) : val &&
                      val.style === 100 &&
                      val.wareInfos &&
                      val.wareInfos.length >= 4 ? (
                      <FloorFindGoods
                        data={val.wareInfos}
                        onToRecommendDetail={onToRecommendDetail}
                      />
                    ) : (
                      ''
                    )}
                  </View>
                );
              })}
            </View>
          )}
          {rightItems && rightItems.length > 0 && (
            <View className='floor-recommend-con floor-recommend-right'>
              {rightItems.map((val, i) => {
                return (
                  <View
                    key={`floor-recommend-items-${i * 2 + 1}-${
                      recommendForYouProps.tabIndex
                    }`}
                    id={`floor-recommend-items-${i * 2 + 1}-${
                      recommendForYouProps.tabIndex
                    }`}
                  >
                    {val && val.style === 5 ? (
                      <FreshPosterSwiper
                        data={val}
                        onClick={this.onGoActivity.bind(this, val, i, 'right')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                      />
                    ) : val && val.style === 4 ? (
                      <RecommendSearch
                        data={val.hotWordLocalList}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        onGoSearch={this.onGoSearch.bind(this, val, i, 'left')}
                      />
                    ) : val && val.style === 3 ? (
                      <ImageProductItem
                        data={val}
                        onGoToUrl={this.onGoToUrl.bind(this, val, i, 'right')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                      />
                    ) : val && val.style === 2 ? (
                      <MenuProductItem
                        show={show}
                        data={val}
                        index={i}
                        onGoDetail={this.onGoBillDetail.bind(
                          this,
                          val,
                          i,
                          'right'
                        )}
                        onCollect={this.onCollect.bind(this, val, i, 'right')}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        type='right'
                      />
                    ) : val && val.style === 1 ? (
                      <ProductItem
                        windowWidth={windowWidth}
                        type={2}
                        data={val}
                        onGoCardOrder={this.onGoCardOrder.bind(
                          this,
                          val,
                          i,
                          'right'
                        )}
                        onGoDetail={this.onGoDetail.bind(this, val, i, 'right')}
                        onAddCart={this.onAddCartSever.bind(
                          this,
                          val,
                          i,
                          'right'
                        )}
                        itemStyle={{
                          marginBottom: px2vw(15),
                        }}
                        isFromPage='recommend'
                        isShowMarketPrice
                      />
                    ) : val &&
                      val.style === 100 &&
                      val.wareInfos &&
                      val.wareInfos.length >= 4 ? (
                      <FloorFindGoods
                        data={val.wareInfos}
                        onToRecommendDetail={onToRecommendDetail}
                      />
                    ) : (
                      ''
                    )}
                  </View>
                );
              })}
            </View>
          )}
          {isNone && leftItems.length === 0 && (
            <View className='recommend-none'>
              <EmptyPage
                onRefresh={onRefresh}
                showButton
                style={{
                  height: px2vw(this.windowHeight * 2 - 200),
                  width: px2vw(690),
                }}
              />
            </View>
          )}
        </View>

        {recommendForYouProps.showLoading && (
          <View className='floor-recommend-load-cont lazy-load-img'>
            <Image className='load-img' src={loadPicture} lazyLoad />
          </View>
        )}
      </View>
    );
  }
}
