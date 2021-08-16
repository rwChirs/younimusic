import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import {
  View,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
  Button,
} from '@tarojs/components';
import { filterImg } from '../../../utils/common/utils';
import { structureLogClick } from '../../../utils/common/logReport';

import './index.scss';

export default class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      scrollLeft: 0,
      contentId: 0,
    };
  }

  static defaultProps = {
    storeId: 0,
    recipeList: [],
  };

  getTabTitle = title => {
    let txt = title;
    if (txt && txt.length > 6) {
      txt = `${txt.substring(0, 6)}...`;
    }
    return txt;
  };

  isLoad = false;
  changeTab = index => {
    if (!this.isLoad) {
      this.isLoad = true;
      setTimeout(() => {
        this.setState(
          {
            index,
            scrollLeft: index === 0 ? 0 : 70 * index,
          },
          () => {
            this.isLoad = false;
          }
        );
      }, 300);
    }
  };

  onGoDetail = val => {
    const { onGotoDetail } = this.props;
    onGotoDetail({ skuId: val.skuId, type: '', event: '', data: val });
  };

  onAddCart = (data, e) => {
    e && e.stopPropagation();
    const { onAddCart, recipeList } = this.props;
    const skuId = data && data.skuId;
    const buyNum = (data && data.startBuyUnitNum) || 1;
    const serviceTagId = (data && data.serviceTagId) || 0;
    const tabInfo = recipeList.filter((item, i) => {
      return i === this.state.index;
    });
    onAddCart({
      skuId,
      buyNum,
      serviceTagId: serviceTagId || 0,
      from: 'menu',
      data: {
        ...data,
        skuName: (data && data.skuName) || '',
        index: (data && data.index) || 0,
        itemTabId: (tabInfo && tabInfo[0] && tabInfo[0].contentId) || 0,
        itemTabName: (tabInfo && tabInfo[0] && tabInfo[0].title) || '',
        itemTabIndex: Number(this.state.index) + 1,
      },
    });
  };

  gotoInfo = (data, e) => {
    let { evaluationJumpSwitch, skuDetail, buriedExplabel } = this.props;
    structureLogClick({
      eventId: '7FERSH_APP_8_1590127250769|58',
      pageParam: {
        skuId: skuDetail && skuDetail.skuId,
        contentId: data && data.contentId,
        touchstone_expids: buriedExplabel,
        skipFlag: evaluationJumpSwitch,
      },
      jsonParam: {
        skuId: skuDetail && skuDetail.skuId,
        contentId: data && data.contentId,
        touchstone_expids: buriedExplabel,
        skipFlag: evaluationJumpSwitch,
      },
      eparam: {
        touchstone_expids: buriedExplabel,
      },
    });
    if (Taro.getStorageSync('scene') === 1036 && evaluationJumpSwitch) {
      this.setState({
        contentId: data && data.contentId,
      });
    } else {
      e && e.stopPropagation();
      //TODO页面跳转
      const contentId = data && data.contentId;
      Taro.navigateTo({
        url: `/pages/bill/bill-detail/index?storeId=${this.props.storeId}&contentId=${contentId}`,
      });
    }
  };

  scrollChange = ev => {
    const index = ev && ev.detail && ev.detail.current;
    this.setState({
      index,
      scrollLeft: index === 0 ? 0 : 70 * index,
    });
  };

  getOpenAppUrl = contentId => {
    const { storeId, skuDetail } = this.props;
    // console.log(skuDetail, 'skuDetail');
    let url = `{"category":"jump","des":"menuDetail","supportVersion":"3.2.6","eventId": "detail_menu_alertjump","jsonParams":{"tenantName":"${
      skuDetail.tenantName
    }","storeId":"${storeId}","pageId":"0014","pageName":"小程序商品详情页","clickId":"detail_menu_alertjump"},"params":{"contentId":"${
      contentId ? contentId : this.state.contentId
    }","storeId":"${storeId}"},"storeId":"${storeId}","changeAddressWithStoreID":true,"compareStoreId":true,"lat":"${
      skuDetail.lat
    }","lon":"${skuDetail.lon}","tenantName":"${
      skuDetail.tenantName
    }","bigLogo":"${encodeURIComponent(
      skuDetail.bigLogo
    )}","smallLogo":"${encodeURIComponent(
      skuDetail.smallLogo
    )}","circleLogo":"${encodeURIComponent(
      skuDetail.circleLogo
    )}","storeAddress":"${
      skuDetail.address
    }","backProtocol":"${encodeURIComponent(
      `openapp.sevenfresh://virtual?params={"category":"jump","des":"detail","skuId":${skuDetail.skuId},"storeId":${storeId},"changeAddressWithStoreID":true,"params":{"changeAddressWithStoreID": true,"storeId":${storeId}}}`
    )}"}`;
    url = `openapp.sevenfresh://virtual?params=${encodeURIComponent(url)}`;
    return url;
  };

  launchAppError = e => {
    e.stopPropagation(); // 阻止事件冒泡
    const { onErrorLauch } = this.props;
    let imgUrl =
      'https://m.360buyimg.com/img/jfs/t1/127665/28/18819/6213/5fb4e241E70db03c9/3dba11eae269a34d.png';
    onErrorLauch(imgUrl);
    // Taro.getSystemInfo().then(res => {
    //   if (res.platform === 'ios') {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往App Store搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   } else {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往应用商店搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   }
    // });
    return;
  };

  getBuryingPrint = () => {
    // logClick({ e, eid: '7FRESH_miniapp_2_1578553760939|12' });
  };

  render() {
    const { recipeList, evaluationJumpSwitch } = this.props;
    const { index, scrollLeft } = this.state;
    // console.log(skuDetail, 'skuDetail');
    return (
      <View className='recipe'>
        <View className='title'>
          <View className='left'>相关菜谱</View>
        </View>

        {recipeList && recipeList.length > 0 && (
          <View className='tabs-new'>
            <ScrollView scrollX scrollWithAnimation scrollLeft={scrollLeft}>
              <View className='tab-list'>
                {recipeList.map((val, k) => {
                  return (
                    <View
                      className={`tab ${k === index ? 'cur' : ''}`}
                      key={k.toString()}
                      onClick={this.changeTab.bind(this, k)}
                    >
                      {this.getTabTitle(val.title)}
                      {k === index && <View className='line' />}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
        <View className='items-container'>
          <Swiper
            className='swiper'
            current={index}
            autoplay={false}
            duration={500}
            onChange={this.scrollChange.bind(this)}
          >
            {recipeList &&
              recipeList.length > 0 &&
              recipeList.map((cookBook, k) => {
                // console.log(cookBook, 'cookBook');
                return (
                  <SwiperItem key={k.toString()} className='swiper-item'>
                    <ScrollView scrollX scrollWithAnimation>
                      <View className='items-list'>
                        <Button
                          className='items menu'
                          onClick={this.gotoInfo.bind(this, cookBook)}
                          openType={`${
                            evaluationJumpSwitch ? 'launchApp' : ''
                          }`}
                          appParameter={this.getOpenAppUrl(cookBook.contentId)}
                          onError={this.launchAppError}
                          hover-class='none'
                        >
                          <View className='items-img'>
                            <Image
                              className='menu-img'
                              src={filterImg(cookBook && cookBook.coverImg)}
                              alt=''
                            />
                          </View>
                          <View className='items-info'>
                            <View className='items-name'>
                              {cookBook && cookBook.title}
                            </View>
                            <View className='items-bottom'>
                              <View className='items-bottom-left'>
                                {cookBook && cookBook.skuCountDesc}
                              </View>
                              <View className='items-bottom-right'>
                                <View className='star' />
                                {cookBook &&
                                  cookBook.collectCount > 0 &&
                                  cookBook.collectCountDesc && (
                                    <View className='star-num'>
                                      {cookBook.collectCountDesc}
                                    </View>
                                  )}
                              </View>
                            </View>
                          </View>
                        </Button>

                        {cookBook &&
                          cookBook.wareInfoList &&
                          cookBook.wareInfoList.length > 0 &&
                          cookBook.wareInfoList.map((val, i) => {
                            const productInfo = { ...val, index: i + 1 };
                            return (
                              <View
                                className='items'
                                key={i.toString()}
                                onClick={this.onGoDetail.bind(
                                  this,
                                  productInfo
                                )}
                              >
                                <View className='item'>
                                  <View className='item-img'>
                                    <Image
                                      className='goods-img'
                                      src={filterImg(val.imageUrl)}
                                      alt=''
                                    />
                                  </View>
                                  <View className='item-name'>
                                    {val.skuName}
                                  </View>

                                  <View className='item-labels'>
                                    {val.promotionTypes &&
                                      val.promotionTypes[0] &&
                                      val.promotionTypes[0].promotionName && (
                                        <View className='item-label'>
                                          {val.promotionTypes[0].promotionName}
                                        </View>
                                      )}
                                  </View>
                                  <View className='item-price'>
                                    <View className='price-jd'>
                                      ¥{val.jdPrice}
                                    </View>
                                    <View className='price-unit'>
                                      {val.buyUnit}
                                    </View>
                                  </View>
                                  <View
                                    className={`add-cart ${
                                      val.status !== 2 ? 'disable' : ''
                                    }`}
                                    onClick={this.onAddCart.bind(
                                      this,
                                      productInfo
                                    )}
                                  ></View>
                                </View>
                              </View>
                            );
                          })}
                      </View>
                    </ScrollView>
                  </SwiperItem>
                );
              })}
          </Swiper>
        </View>
      </View>
    );
  }
}
