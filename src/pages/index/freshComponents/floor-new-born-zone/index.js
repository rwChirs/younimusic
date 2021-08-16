// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import { filterImg, px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorNewBornZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowing: false,
    };
  }
  componentDidShow() {
    this.setState({
      isShowing: false,
    });
  }
  onShowAll = (ev) => {
    ev.stopPropagation();
    const { data, onGoToSecondaryPage } = this.props;
    if (!this.state.isShowing) {
      this.setState(
        {
          isShowing: true,
        },
        () => {
          onGoToSecondaryPage({
            ...data,
            action: { ...data.action, target: 5 },
          });
        }
      );
    }
  };

  goToSecondaryPage = (target, ev) => {
    const { data, onGoToSecondaryPage } = this.props;
    ev.stopPropagation();
    onGoToSecondaryPage({
      ...data,
      action: {
        ...data.action,
        target: target === 5 ? 5 : 1,
        fromPage: 'home',
      },
    });
  };

  addCart = (info, i, ev) => {
    const { data, onAddCart } = this.props;
    ev.stopPropagation();
    onAddCart(
      {
        ...info,
        action: {
          ...data.action,
          skuId: info.skuId,
          target: 4,
          index: i + 1,
        },
      },
      ev
    );
  };

  getCoupon = (ev) => {
    ev.stopPropagation();
    const { data, onGetCoupon } = this.props;
    if (!data.haveReceived) {
      onGetCoupon();
    }
  };

  render() {
    const { data } = this.props;
    const hasItems = data && data.items && data.items.length > 2;

    return (
      <View>
        {data && (
          <View
            className={
              data.hasNewPersonCoupon && hasItems ? 'zone-warp bg' : 'zone-warp'
            }
            onClick={this.goToSecondaryPage.bind(this, 1)}
          >
            {data.hasNewPersonCoupon && (
              <View
                className={
                  !(data.newCustomerGoods && hasItems)
                    ? 'coupon-box bg'
                    : 'coupon-box'
                }
              >
                <View className='coupon-box-title'>
                  <View className='left' />
                  <View
                    className={data.haveReceived ? 'right is-get' : 'right'}
                    onClick={this.getCoupon}
                  >
                    {data.haveReceived
                      ? ''
                      : `一键领¥${data.availableCouponAmount}礼包`}
                  </View>
                </View>
                <View className='coupon-box-list'>
                  <View className='list'>
                    {data.couponInfoWebs &&
                      data.couponInfoWebs.length > 0 &&
                      data.couponInfoWebs.map((info, i) => {
                        return (
                          <View className='info' key={i.toString()}>
                            <View className='info-left'>
                              <View
                                className={
                                  info.channelType === 1
                                    ? 'info-left-icon'
                                    : info.channelType === 2
                                    ? 'info-left-icon blue'
                                    : 'info-left-icon yellow'
                                }
                              >
                                {info.channelType === 1
                                  ? '线上&门店劵'
                                  : info.channelType === 2
                                  ? '线上劵'
                                  : '门店劵'}
                              </View>
                              <View className='info-left'>
                                {info.couponMode === 1 && (
                                  <View className='info-left-price'>
                                    {info.amountDesc || 0}
                                  </View>
                                )}
                                {info.couponMode === 2 && (
                                  <View className='info-left-discount'>
                                    {info.discount || 0}折
                                  </View>
                                )}
                              </View>
                            </View>
                            <View className='info-right'>
                              <View className='info-right-fir'>
                                {info.needMoneyDesc || ''}
                              </View>
                              <View className='info-right-sec'>
                                {info.couponName || ''}
                              </View>
                            </View>
                          </View>
                        );
                      })}
                  </View>
                </View>
                <View className='list-shadow'></View>
              </View>
            )}
            {hasItems && data.newCustomerGoods && (
              <View
                className={
                  !data.hasNewPersonCoupon ? 'goods-box bg' : 'goods-box'
                }
              >
                <View className='goods-box-title'>
                  <View className='left'>
                    <Text className='tit' />
                    <Text className='tips'>每个商品限购1件</Text>
                  </View>
                  {/* <View className='right'>
                    <Text className='right-txt'>线上购</Text>
                    <Text className='right-txt'>到店购</Text>
                  </View> */}
                </View>
                <ScrollView
                  scrollX
                  scrollWithAnimation
                  onScrollToLower={this.onShowAll.bind(this)}
                  lowerThreshold={20}
                  className='scroll-wrap'
                >
                  <View
                    className='goods-box-list'
                    style={{
                      paddingLeft: data.items.length > 3 ? '' : px2vw(60),
                      boxSizing: 'border-box',
                    }}
                  >
                    {data.items &&
                      data.items.length > 0 &&
                      data.items.map((info, i) => {
                        return (
                          <View className='goods-info' key={i.toString()}>
                            <Image
                              className='goods-info-img'
                              alt=''
                              mode='aspectFill'
                              src={filterImg(info.imageUrl)}
                            />
                            <View className='goods-info-con'>
                              <Text className='con-price'>
                                {info.jdPrice ? `¥${info.jdPrice}` : '暂无报价'}
                              </Text>
                              <Text className='con-price-gray'>
                                {info.marketPrice
                                  ? `¥${info.marketPrice}`
                                  : '暂无报价'}
                              </Text>
                              <View
                                className={
                                  info.addCart ? 'add-cart' : 'add-cart disable'
                                }
                                onClick={this.addCart.bind(this, info, i)}
                              />
                            </View>
                          </View>
                        );
                      })}
                    {data.items.length > 4 && (
                      <View
                        className='see-all'
                        onClick={this.goToSecondaryPage.bind(this, 5)}
                      >
                        查看更多
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

FloorNewBornZone.defaultProps = {
  data: {},
};

FloorNewBornZone.propTypes = {
  data: PropTypes.object,
};
