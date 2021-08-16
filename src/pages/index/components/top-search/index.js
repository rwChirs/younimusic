// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import './index.scss';
import { getH5PageUrl, px2vw } from '../../../../utils/common/utils';
import AddApplet from '../add-applet';

export default class TopSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.storeId !== this.props.storeId) {
      this.setState({
        activeIndex: 0,
      });
    }
  }

  isShowBusinessesList = (bool) => {
    const { addrInfo, onHandelBusinessesList } = this.props;
    const tenantShopInfoList =
      addrInfo && addrInfo.tenantShopInfoList
        ? addrInfo.tenantShopInfoList
        : addrInfo && addrInfo.tenantShopInfo
        ? addrInfo.tenantShopInfo
        : '';
    if (tenantShopInfoList && tenantShopInfoList.length > 1) {
      onHandelBusinessesList(bool);
    }
  };

  isShowPageIndexTools = (bool) => {
    const { onHandelPageIndexTools } = this.props;
    onHandelPageIndexTools(bool);
  };

  scrollChange(ev) {
    this.setState({
      activeIndex: ev && ev.detail && ev.detail.current,
    });
  }

  onSearch() {
    const { onGoToUrl, storeId, tenantId, platformId } = this.props;
    const { activeIndex } = this.state;
    let { defaultKeyword } = this.props;
    if (defaultKeyword && defaultKeyword.length > 0) {
      defaultKeyword =
        defaultKeyword[activeIndex] && defaultKeyword[activeIndex].keyword;
    } else {
      defaultKeyword = '搜索七鲜美食';
    }
    onGoToUrl({
      urlType: 'search',
      toUrl: getH5PageUrl(
        `search/?defaultKeyWord=${defaultKeyword}&from=miniapp`,
        storeId,
        tenantId,
        platformId
      ),
    });
  }

  gotoPayCode() {
    const { onGotoPayCode } = this.props;
    onGotoPayCode();
  }

  gotoScan() {
    const { onGotoScan } = this.props;
    onGotoScan();
  }

  gotoFoodCategory() {
    const { onGotoFoodCategory } = this.props;
    onGotoFoodCategory();
  }

  render() {
    const {
      addressExt,
      bgImage,
      isShowTopAddr,
      // showBusinessesList,
      // showPageIndexTools,
      // addrInfo,
      isShowApplet,
      isShowAddApplet,
      onAddApplet,
      onCancelAddApplet,
      onCancelApplet,
      defaultKeyword,
      canteenEntrance,
      navHeight,
      windowWidth,
      fix,
    } = this.props;
    console.log('1111', addressExt);
    const openImg =
        'http://m.360buyimg.com/img/jfs/t1/166342/26/1421/1748/5ff6b145Eac9e2cda/acea05295ca4cb93.png',
      closeImg =
        'http://m.360buyimg.com/img/jfs/t1/150950/39/14679/1710/5ff6d2caE409ad6af/5aa4d04d4db39ba9.png';
    return (
      <View
        className='top-search'
        style={{
          top: `${(navHeight / windowWidth) * 375}rpx`,
          paddingTop: '20rpx',
        }}
      >
        {isShowApplet && (
          <AddApplet
            isShowAddApplet={isShowAddApplet}
            top={`${(navHeight / windowWidth) * 375}rpx`}
            onAddApplet={onAddApplet}
            onCancelAddApplet={onCancelAddApplet}
            onCancelApplet={onCancelApplet}
          />
        )}

        <View
          className='top-search-content'
          style={{
            background: bgImage ? `url(${bgImage}) bottom center` : 'none',
            backgroundSize: '100%',
          }}
        >
          <View
            className='location-part'
            onClick={this.props.onGotoAddressPage}
          >
            <View className='location-part-icon' />
          </View>

          <View className='search-part' onClick={this.onSearch.bind(this)}>
            <Swiper
              className='search-word-swiper'
              interval={3000}
              duration={1000}
              autoplay
              circular
              vertical
              onChange={this.scrollChange.bind(this)}
            >
              {defaultKeyword &&
                defaultKeyword.length > 0 &&
                defaultKeyword.map((val, i) => {
                  return (
                    <SwiperItem
                      className='floor-news-item lazy-load-img'
                      key={i.toString()}
                    >
                      <Text className='item-txt'>{val.keyword}</Text>
                    </SwiperItem>
                  );
                })}
            </Swiper>

            <View className='search-icon' />
          </View>

          {/* 付款码 */}
          <View
            className='tools-btn lazy-load-img'
            onClick={this.gotoPayCode.bind(this)}
          >
            <Image
              lazyLoad
              className='tools-btn-icon'
              src='https://m.360buyimg.com/img/jfs/t1/165089/9/1430/1301/5ff6b0f7Ef73271d4/99f7c37ae4f9cbd4.png'
            />
            <Text className='left-part-txt'>付款</Text>
          </View>

          {/* 扫一扫 */}
          <View
            className='tools-btn lazy-load-img'
            onClick={this.gotoScan.bind(this)}
          >
            <Image
              lazyLoad
              className='tools-btn-icon'
              src='https://m.360buyimg.com/img/jfs/t1/166715/14/1359/1315/5ff6b225E91114c40/673e1e39b5cd47e6.png'
            />
            <Text className='left-part-txt'>扫码</Text>
          </View>
          {/* 堂食点餐 */}
          {canteenEntrance.show && (
            <View
              className='tools-btn lazy-load-img'
              onClick={this.gotoFoodCategory.bind(this)}
            >
              <Image
                lazyLoad
                className='tools-btn-icon'
                src={canteenEntrance.close ? closeImg : openImg}
              />
              <Text
                className={
                  canteenEntrance.close
                    ? 'left-part-txt close'
                    : 'left-part-txt'
                }
              >
                点餐
              </Text>
            </View>
          )}

          {addressExt && isShowTopAddr && (
            <View
              className='location-info'
              style={{ top: isShowApplet ? px2vw(166 + 20) : px2vw(80 + 20) }}
              onClick={this.props.onChooseAdsErr}
            >
              <Text className='address'>
                {fix ? `地址定位存在误差，请校验 >` : `送至：${addressExt}`}
              </Text>
              <View className='tri' />
            </View>
          )}
        </View>
      </View>
    );
  }
}
