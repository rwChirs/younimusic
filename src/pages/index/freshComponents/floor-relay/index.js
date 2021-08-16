import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import { logClick } from '../../../../utils/common/logReport';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorRelay extends Component {
  static defaultProps = {
    onGoToUrl: () => {},
    data: {
      items: [],
      firstTitle: '',
      secondTitle: '',
      action: {},
    },
    storeId: '',
    tenantId: '',
    platformId: '',
    onCoords: {
      lng: '',
      lat: '',
    },
  };
  state = {
    current: 0,
  };
  componentDidShow() {
    this.itemClicked = false;
  }
  componentDidHide() {
    if (!this.itemClicked) {
      this.setState({
        current: 0,
      });
    }
  }
  goRelayList(action) {
    logClick({ eid: action.clsTag });
    Taro.removeStorageSync('solitaire-list-top');
    Taro.navigateTo({
      url: `/pages/solitaire/list/index?storeId=${this.props.storeId}&lng=${this.props.onCoords.lng}&lat=${this.props.onCoords.lat}&tenantId=${this.props.tenantId}&platformId=${this.props.platformId}`,
    });
  }
  goRelayDetail(action) {
    logClick({ eid: action.clsTag });
    const params = action.params;
    const handonId = params[2].value || '';
    this.itemClicked = true;
    Taro.removeStorageSync('solitaire-list-top');
    Taro.navigateTo({
      url: `/pages-a/solitaire/detail/index?storeId=${this.props.storeId}&handonId=${handonId}&lng=${this.props.onCoords.lng}&lat=${this.props.onCoords.lat}&tenantId=${this.props.tenantId}&platformId=${this.props.platformId}`,
    });
  }
  changeIndex(ev) {
    this.setState({
      current: ev.currentTarget.current,
    });
  }
  render() {
    const { data } = this.props;
    const { items, action, firstTitle, secondTitle, image } = data;
    const { current } = this.state;
    return items && items.length > 0 ? (
      <View className='home-relay'>
        <View className='home-relay-header'>
          <View className='title-wrap'>
            <Text className='title'>{firstTitle}</Text>
            <Text className='sub-title'>{secondTitle}</Text>
          </View>
          <View className='more' onClick={this.goRelayList.bind(this, action)}>
            <Text className='more-text'>更多</Text>
            <Text className='icon more-icon' />
          </View>
        </View>
        <Swiper
          interval={2500}
          duration={1000}
          circular
          current={current}
          displayMultipleItems={items.length > 1 ? 1.1 : 1}
          style='height: 164px'
          onChange={this.changeIndex}
        >
          {items &&
            items.map((val, i) => {
              return (
                <SwiperItem
                  key={i}
                  className='home-relay-slider'
                  taroKey={String(i)}
                  onClick={this.goRelayDetail.bind(this, val.action)}
                >
                  <View
                    className='relay-slider-desc lazy-load-img'
                    style={{
                      height: 164 + 'px',
                      backgroundImage: `url(${filterImg(image)})`,
                    }}
                  >
                    <View className='relay-slider-txt'>
                      <View className='relay-slider-title'>
                        {val.skuShortName ? val.skuShortName : val.skuName}
                      </View>
                      <View className='relay-slider-character'>
                        <Text className='icon icon-character' />
                        <Text className='relay-slider-character-text'>
                          团长说
                        </Text>
                        <Text className='icon icon-quote' />
                      </View>
                      <View className='relay-slider-introduce'>
                        {val.introduce}
                      </View>
                      <View className='relay-slider-btn'>
                        <View className='price-unit'>
                          <Text className='spec-price'>¥{val.jdPrice}</Text>
                          <Text className='spec-unit'>{val.buyUnit}</Text>
                        </View>
                        {val.purchasePersonNum && <Text className='split' />}
                        {val.purchasePersonNum && (
                          <View className='amount'>
                            {val.purchasePersonNum}
                          </View>
                        )}
                      </View>
                    </View>
                    <Image
                      src={filterImg(val.image)}
                      className='relay-slider-img'
                      lazyLoad
                    />
                  </View>
                  <View className='relay-swiper-dot'>
                    <Text className='relay-swiper-active'>{i + 1}</Text>
                    <Text className='relay-swiper-max'>/{items.length}</Text>
                  </View>
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    ) : null;
  }
}
