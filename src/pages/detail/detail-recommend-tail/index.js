import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, ScrollView, Image } from '@tarojs/components';
import { structureLogClick } from '../../../utils/common/logReport';
import ProductItem from '../product-item';
import { getExposure } from '../../../utils/common/exportPoint';
import { filterImg, px2vw } from '../../../utils/common/utils';

import './index.scss';

export default class DetailRecommendTail extends Component {
  static defaultProps = {
    data: [],
    strategyABTest: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isGuideClick: false,
      isLargeStyle: false,
      height: 460,
      pulling: false,
      pullingText: '下拉收起',
    };
  }

  componentDidMount() {
    this.showGuideClick();
    setTimeout(() => {
      this.skuExposure();
    }, 1000);
  }

  // 商品曝光
  skuExposure = () => {
    const { data, options } = this.props;
    data &&
      data.length > 0 &&
      data.map((item, i) => {
        const targetDom = `#goods-item-tail-${i}`;
        const intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        intersectionObserver
          .relativeToViewport({ bottom: 0 })
          .observe(targetDom, () => {
            const params = {
              router: this.$router,
              eid: 'Product_details_matchLayer',
              eparam: {
                lastSkuId: options && options.skuId,
                lastSkuName: options && options.skuName,
                skuId: item.skuId,
                skuName: item && item.skuName,
                skuSequenceNum: i + 1,
                CartAddCartSpaceNum: options && options.AddCartUserConfigValue,
                touchstone_expids: options && options.AddCartBuriedExpLabel,
              },
            };
            getExposure(params);
            intersectionObserver.disconnect();
          });
      });
  };

  // 滑动埋点
  slideAction = direction => {
    const { options } = this.props;
    structureLogClick({
      eventId:
        direction === 'up'
          ? 'commodityDetailPage_matchLayer_slipUp'
          : 'commodityDetailPage_matchLayer_slipDown',
      eventName:
        direction === 'up'
          ? '商详页-加购搭配弹框-向上滑动'
          : '商详页-加购搭配弹框-向下滑动',
      jsonParam: {
        lastSkuId: options.skuId,
        lastSkuName: options.skuName,
        CartAddCartSpaceNum: options.AddCartUserConfigValue,
      },
      extColumns: {
        touchstone_expids: options.AddCartBuriedExpLabel,
      },
    });
  };

  showGuideClick = () => {
    const isGuideClick = Taro.getStorageSync('isGuideClick') || {};
    if (JSON.stringify(isGuideClick) === '{}') {
      Taro.setStorageSync('isGuideClick', 1);
      this.setState({
        isGuideClick: true,
      });
    }
  };

  onGuideClick = () => {
    this.setState({
      isGuideClick: false,
    });
  };

  addCart = data => {
    const { onAddCart } = this.props;
    onAddCart({ ...data, from: 'tail' });
  };

  onGoDetail = data => {
    const { onGoDetail } = this.props;
    onGoDetail({ ...data, type: 'tail' });
  };

  onScrollEvent = e => {
    // e.stopPropagation()
    const { isLargeStyle } = this.state;

    // console.log(e.target.deltaY);
    if (e.target.deltaY < 0 && !isLargeStyle) {
      this.slideAction('up');
      this.setState({
        isLargeStyle: true,
        height: 770,
      });
    }
  };

  onRefresherRefresh = () => {
    const { onClose } = this.props;
    this.slideAction('down');
    onClose();
  };

  onRefresherPulling = e => {
    console.log(e);
    const { pulling } = this.state;
    if (!pulling) {
      this.setState({
        pulling: true,
      });
    }
    if (e.detail.dy > 30) {
      this.setState({
        pullingText: '即将收起',
      });
    } else if (e.detail.dy <= 1) {
      this.setState({
        pulling: false,
      });
    } else {
      this.setState({
        pullingText: '下拉收起',
      });
    }
  };

  onRefresherAbort = () => {
    this.setState({
      pulling: false,
      pullingText: '下拉收起',
    });
  };

  /**
   * 阻止滚动
   */
  onTouchMove = e => {
    e && e.stopPropagation();
  };

  render() {
    const { data, windowWidth, onClose } = this.props;
    const { height, isGuideClick, pulling, pullingText } = this.state;
    const successImg =
      'm.360buyimg.com/img/jfs/t1/155589/26/4070/2007/5ff2b2dfE61d4c3be/d8c932104e79ddcc.png';
    const down =
      '//m.360buyimg.com/img/jfs/t1/167522/2/1053/5713/5ff437cdEf3d929bd/9eb44495088f9bc0.png';
    const up =
      '//m.360buyimg.com/img/jfs/t1/170483/12/1043/6761/5ff437bdEba24ef9f/7d9f5f4584a9c328.png';
    return (
      <View onTouchMove={this.onTouchMove}>
        <View className='recommend-tail'>
          <View className='recommend-tail-title'>
            <Image
              className='success-img'
              src={filterImg(successImg)}
              alt='七鲜'
            />
            加入购物车成功
            <View className='close' onClick={onClose}></View>
          </View>
          <View className='recommend-subTitle'>
            <View className='left-line'></View>
            买了再逛逛
            <View className='right-line'></View>
          </View>
          <View className='floor-theme-goods' id='goods-item-z-box'>
            {isGuideClick && (
              <View className='guide' onClick={this.onGuideClick}>
                <Image
                  className='guide-img-up'
                  src={filterImg(up)}
                  alt='七鲜'
                />
                <Image
                  className='guide-img-down'
                  src={filterImg(down)}
                  alt='七鲜'
                />
              </View>
            )}
            <ScrollView
              className='items-list'
              scrollY
              scrollWithAnimation
              lowerThreshold={200}
              style={{
                height: px2vw(height),
              }}
              refresherEnabled
              refresherDefaultStyle='none'
              onRefresherRefresh={this.onRefresherRefresh}
              onScroll={this.onScrollEvent}
              onRefresherPulling={this.onRefresherPulling}
              onRefresherAbort={this.onRefresherAbort}
            >
              <View
                className='refresh-text'
                style={{ display: `${pulling ? 'block' : 'none'}` }}
              >
                {pullingText}
              </View>
              <View className='floor-theme-type-tail'>
                {data.map((val, i) => {
                  return (
                    <View className='users' key={i} id={`goods-item-tail-${i}`}>
                      <ProductItem
                        type={3}
                        data={val}
                        onGoDetail={this.onGoDetail.bind(this)}
                        windowWidth={windowWidth}
                        onAddCart={this.addCart.bind(this)}
                        itemStyle={{
                          marginRight: px2vw(14),
                          marginBottom: px2vw(14),
                          border: '1px solid #f3f3f3',
                        }}
                        ind={i + 1}
                        options={{ modal: 'tail' }}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
        <View
          className='tail'
          onClick={onClose}
          onTouchMove={this.onTouchMove}
        ></View>
      </View>
    );
  }
}
