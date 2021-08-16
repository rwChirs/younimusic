import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { getIsNewIphone } from '../../utils/common/utils';
import './index.scss';
import AddressSelectItem from './address-select-item';
// import Tag from '../goods-tag';
// import Coupon from '../coupon';
import ProductItem from './product-item';
import ServicePopup from './service-popup';
import WareInSuitsItem from './ware-in-suits-item';
import RpxLine from '../rpx-line';
import FreeBuyDetail from './free-buy-detail';

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewIphone: false,
      infoPic:
        'https://m.360buyimg.com/img/jfs/t1/80554/12/5898/1418/5d417369Ecdcab63f/d0ab262d4b3261cd.png',
    };
  }

  componentWillMount() {
    this.setState({
      isNewIphone: getIsNewIphone(),
    });
  }

  close = e => {
    e && e.stopPropagation();
    this.props.onClose(this.props);
    return false;
  };

  touchMove = e => {
    e && e.stopPropagation();
  };

  onAddCart = (num, type) => {
    this.props.onAddCart(num, type);
  };

  onClick = (current, e) => {
    e && e.stopPropagation();
    this.props.onPopupClick(current);
  };

  onProductClick = (current, e) => {
    e && e.stopPropagation();
    this.props.onPopupClick(current);
  };

  onGotoCart = e => {
    e && e.stopPropagation();
    this.props.onGotoCart();
  };
  onGoDetail = (data, e) => {
    e && e.stopPropagation();
    this.props.onGoDetail(data, e);
  };
  onAllAddCart = e => {
    e && e.stopPropagation();
    this.props.onAllAddCart();
  };

  render() {
    const {
      title,
      height,
      show,
      data,
      failData,
      type,
      selected,
      icon,
      keyVal,
    } = this.props;
    const { infoPic, isNewIphone } = this.state;
    const isTextArr = type === 'textArr';
    const isAddress = type === 'address';
    // const isTagSelectList = type === 'tagSelectList';
    // const isCoupon = type === 'coupon';
    const isProduct = type === 'product';
    const isCustom = title === 'custom';
    const isService = isCustom && type === 'service';
    const isPrepare = type === 'prepare';
    const isRemark = type === 'service';
    const isWareInSuits = type === 'wareInSuits';
    const isStall = type === 'stall';
    const isPriceTips = type === 'priceTips';
    const isFreeService = type === 'freeservice';
    const rightGreyArrow =
      '//m.360buyimg.com/img/jfs/t1/124243/29/13496/492/5f6d5c17Ed9e420f7/4ad78f192bd6e34c.png';
    return (
      <View>
        <View
          className={
            show ? `popup-mask popup-mask-show popup-mask-anim` : `popup-mask`
          }
          onClick={this.close}
          onTouchMove={this.touchMove}
        />
        {!isCustom && (
          <View
            className={
              show
                ? `popup-container popup-container-anim popup-container-show`
                : `popup-container popup-container-anim`
            }
            style={`height: ${height}px`}
          >
            <View className='popup-title' onTouchMove={this.touchMove}>
              <Text>{title}</Text>
              <View className='popup-close' onClick={this.close} />
            </View>
            <RpxLine />
            <View className='popup-contents' style={`height: ${height - 44}px`}>
              {isTextArr && (
                <View className='text-arr'>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <View key={index} style='margin-bottom: 20rpx;'>
                          <Text>{item}</Text>
                        </View>
                      );
                    })}
                </View>
              )}
              {isAddress && (
                <View>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <View
                          onClick={this.onClick.bind(this, item)}
                          key={index}
                        >
                          <AddressSelectItem
                            name={`${item.addressSummary ||
                              ''}${item.addressExt || ''}${item.where || ''}`}
                            icon={icon}
                            active={selected === item[keyVal]}
                          />
                          <RpxLine />
                        </View>
                      );
                    })}
                  {failData.length > 0 && (
                    <View className='fail-address-list'>
                      <View className='header'>
                        <Text className='f-title'>超配送地址</Text>
                        <Image
                          src={infoPic}
                          alt='七鲜'
                          style='width:30rpx;height:30rpx;margin-right:20rpx'
                          mode='aspectFit'
                          lazy-load
                        />
                      </View>
                    </View>
                  )}

                  {failData &&
                    failData.length > 0 &&
                    failData.map((item, index) => {
                      return (
                        <View key={index}>
                          <AddressSelectItem
                            name={`${item.addressSummary ||
                              ''}${item.addressExt || ''}${item.where || ''}`}
                            icon={icon}
                            disable
                            active={selected === item[keyVal]}
                          />
                          <RpxLine />
                        </View>
                      );
                    })}
                  {data.length < 1 && failData.length < 1 && (
                    <View
                      className='no-address-all'
                      onClick={this.onClick.bind(this, null)}
                    >
                      <Text>您还没有收货地址哦~</Text>
                      <Text className='btn'>新建地址</Text>
                    </View>
                  )}
                </View>
              )}
              {/* {isTagSelectList && (
                <View>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <View key={index}>
                          <View
                            className='tag-select-item'
                            onClick={this.onClick.bind(this, item)}
                          >
                            <Tag
                              className='item-tag'
                              text={item.promotionName}
                              type='red'
                            />
                            <View className='name'>
                              {item.showTexts[0].showMsg}
                            </View>
                            {item.forward && <View className='right-arrow' />}
                          </View>
                          <RpxLine />
                        </View>
                      );
                    })}
                </View>
              )}
              {isCoupon && (
                <View>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <Coupon
                          key={index}
                          isReceived={item.received}
                          limit={item.channelTypeName}
                          name={item.couponName}
                          ruleDescSimple={item.ruleDescSimple}
                          price={item.amountDesc}
                          validate={item.validateTime}
                          onReceiveCoupon={this.onClick.bind(this, item)}
                          type={
                            item.channelType === 1
                              ? `all`
                              : item.channelType === 2
                              ? `online`
                              : `offline`
                          }
                        />
                      );
                    })}
                </View>
              )} */}
              {isProduct && (
                <View>
                  {data &&
                    data.length > 0 &&
                    data[0] &&
                    data[0].poolList &&
                    data[0].poolList.length > 0 &&
                    data[0].poolList.map((item, index) => {
                      return (
                        <View
                          key={index}
                          onClick={this.onClick.bind(this, item)}
                        >
                          <ProductItem product={item} />
                          <RpxLine />
                        </View>
                      );
                    })}
                </View>
              )}
              {isWareInSuits && (
                <View>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      const clickItem = { ...item, type: 'detail' };
                      return (
                        <View key={index}>
                          <WareInSuitsItem
                            product={item}
                            onAddCart={this.onClick}
                            onProductClick={this.onProductClick.bind(
                              this,
                              clickItem
                            )}
                          />
                          <RpxLine />
                        </View>
                      );
                    })}
                </View>
              )}
              {isPriceTips && (
                <View className='price-box'>
                  {data.type === 1 && (
                    <View className='con-txt'>
                      {data.moneyRemarkInfo.content}
                    </View>
                  )}
                  {data.type === 2 &&
                    data.moneyRemarkInfo.remarkDetailInfoList &&
                    data.moneyRemarkInfo.remarkDetailInfoList.length > 0 && (
                      <View className='list-box'>
                        {data.moneyRemarkInfo.remarkDetailInfoList.map(
                          (info, i) => {
                            return (
                              <View className='list' key={i.toString()}>
                                <View>{info.name}</View>
                                <View>{info.content}</View>
                              </View>
                            );
                          }
                        )}
                      </View>
                    )}
                </View>
              )}
              {isFreeService && (
                <View>
                  <View className='cardNumber'>
                    <Image
                      className='kaImg'
                      src={
                        data && data.easyBuyPopUpImageUrl
                          ? data.easyBuyPopUpImageUrl
                          : 'https://m.360buyimg.com/img/jfs/t1/155543/36/16852/5929/6018e7c2Ef8acaa0c/b1ef55ff28c853f0.png'
                      }
                      alt=''
                    />
                    <View
                      className='learn-more'
                      onClick={this.onClick.bind(this, null)}
                    >
                      了解详情
                      <Image
                        className='right-img'
                        src={rightGreyArrow}
                        alt=''
                      />
                    </View>
                  </View>
                  {data.easyBuyLabelList &&
                    data.easyBuyLabelList.length > 0 &&
                    data.easyBuyLabelList.map((item, index) => {
                      return (
                        <View key={index}>
                          <FreeBuyDetail freeItem={item} />
                        </View>
                      );
                    })}
                </View>
              )}
            </View>
            {isAddress && (data.length > 0 || failData.length > 0) && (
              <View
                className='no-address'
                onClick={this.onClick.bind(this, null)}
              >
                <Text className='btn'>新建地址</Text>
              </View>
            )}
          </View>
        )}

        {isRemark && (
          <View
            className={
              show
                ? `service-popup-container service-popup-container-show service-popup-container-anim`
                : `service-popup-container`
            }
            style={{ paddingBottom: isNewIphone ? '34rpx' : 0 }}
          >
            <ServicePopup
              data={data[0] ? data[0] : {}}
              onNumChange={this.onClick}
              onRemarkChange={this.onClick}
              onAddCart={this.onAddCart}
              onServiceChange={this.onClick}
            />
          </View>
        )}

        {isService && (
          <View
            className={
              show
                ? `service-popup-container service-popup-container-show service-popup-container-anim`
                : `service-popup-container`
            }
            style={{ paddingBottom: isNewIphone ? '34rpx' : 0 }}
          >
            <ServicePopup
              data={data[0] ? data[0] : {}}
              onNumChange={this.onClick}
              onServiceChange={this.onClick}
              onAddCart={this.onAddCart}
              onRemarkChange={this.onClick}
            />
          </View>
        )}

        {isPrepare && (
          <View
            className={
              show
                ? `service-popup-container service-popup-container-show service-popup-container-anim`
                : `service-popup-container`
            }
            style={{ paddingBottom: isNewIphone ? '34rpx' : 0 }}
          >
            <ServicePopup
              data={data[0] ? data[0] : {}}
              type='prepare'
              onNumChange={this.onClick}
              onServiceChange={this.onClick}
              onAddCart={this.onAddCart}
            />
          </View>
        )}
        {isStall && (
          <View
            className={
              show
                ? `service-popup-container service-popup-container-show service-popup-container-anim`
                : `service-popup-container`
            }
            style={{ paddingBottom: isNewIphone ? '34rpx' : 0 }}
          >
            <ServicePopup
              data={data[0] ? data[0] : {}}
              type='stall'
              onNumChange={this.onClick}
              onServiceChange={this.onClick}
              onAddCart={this.onAddCart}
            />
          </View>
        )}
      </View>
    );
  }
}
