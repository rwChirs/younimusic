import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { filterImg, px2vw } from '../../../utils/common/utils';
import { accAdd, accMul } from './utils';
import './index.scss';
import RpxLine from '../../rpx-line';

export default class ServicePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1,
      contentHeight: px2vw(wx.getSystemInfoSync().windowHeight),
    };
  }

  componentWillMount() {
    this.setState({
      number: this.props.data.startBuyUnitNum || 1,
      servicetagTime:
        (this.props.data.serviceTags &&
          this.props.data.serviceTags[0] &&
          this.props.data.serviceTags[0].servicetagTime) ||
        '',
    });
  }

  // componentWillReceiveProps() {
  //   this.setState({
  //     number: this.props.data.startBuyUnitNum || 1,
  //   });
  // }

  onServiceClick = (current, e) => {
    e && e.stopPropagation();
    this.setState({ servicetagTime: current && current.servicetagTime });
    this.props.onServiceChange(current);
  };

  onRemarkClick(current, e) {
    e && e.stopPropagation();
    this.props.onRemarkChange(current);
  }

  onNumClick(num, e) {
    e && e.stopPropagation();
    const { preSaleInfo } = this.props;
    const {
      isCanPreSale,
      maxBuyUnitNum,
      stepBuyUnitNum,
      type,
    } = this.props.data;
    const { number } = this.state;
    const selfNumber = parseFloat(number);

    //预售自提
    if (
      preSaleInfo &&
      preSaleInfo.stockNum !== null &&
      selfNumber + stepBuyUnitNum > preSaleInfo.stockNum &&
      num > 0 &&
      type === 'prepare'
    ) {
      return;
    }
    //老预定
    if (
      preSaleInfo &&
      preSaleInfo.stockNum !== null &&
      selfNumber + stepBuyUnitNum > preSaleInfo.stockNum &&
      num > 0 &&
      isCanPreSale &&
      type === 'order'
    ) {
      return;
    }
    //普通
    if (
      selfNumber + stepBuyUnitNum > maxBuyUnitNum &&
      num > 0 &&
      type === 'cart'
    ) {
      return;
    }

    if (selfNumber + num > 0) {
      let totalNum = 0;
      if (num > 0) {
        totalNum = accAdd(selfNumber, stepBuyUnitNum);
      } else {
        totalNum = accMul(selfNumber, stepBuyUnitNum);
      }
      this.setState(
        {
          number: totalNum,
        },
        () => {
          console.log(num, selfNumber);
        }
      );
      // this.props.onNumClick(num);
    }
  }

  onAddCart = e => {
    e && e.stopPropagation();
    this.props.onAddCart(this.state.number, this.props.data.type);
  };

  /**
   * 阻止底层UI滚动
   */
  onTouchMove = e => {
    e && e.stopPropagation();
  };

  render() {
    const {
      jdPrice,
      buyUnit,
      saleSpecDesc,
      serviceTags = [],
      remarks = [],
      serviceTagId,
      isCanPreSale,
      isCanAddCart,
      type,
      status,
      imageUrl,
      reserveContentInfo,
      preSale,
      preSaleInfo,
      stepBuyUnitNum,
      tips,
      notJumpCart,
    } = this.props.data;

    const { contentHeight, servicetagTime } = this.state;
    return (
      <View className='service-popup' onTouchMove={this.onTouchMove}>
        <View className='title'>
          <View className='image-container'>
            <Image className='image' src={filterImg(imageUrl)} />
          </View>
          <View className='price-con'>
            <View className='name'>
              {type === 'prepare' ? (
                <Text className='price'>
                  {preSaleInfo.price ? '¥' + preSaleInfo.price : '暂无价格'}
                </Text>
              ) : (
                <Text className='price'>
                  {jdPrice ? `￥${jdPrice}` : `暂无价格`}
                </Text>
              )}
              <Text className='unit'>{buyUnit}</Text>
            </View>
            <View className='sel-count'>已选：{this.state.number}</View>
          </View>
        </View>
        <RpxLine />
        <View
          className='content'
          style={{ maxHeight: contentHeight, overflow: 'scroll' }}
        >
          {saleSpecDesc && (
            <View className='spec item'>
              <Text className='label'>规格</Text>
              <Text className='value'>{saleSpecDesc}</Text>
            </View>
          )}
          {serviceTags && serviceTags.length > 0 && (
            <View className='service item'>
              <Text className='label'>加工</Text>
              <View>
                <View className='service-text'>{servicetagTime}</View>
                <View className='value'>
                  {serviceTags.map((tag, index) => {
                    return (
                      <View
                        key={index}
                        onClick={this.onServiceClick.bind(this, tag)}
                        className={
                          tag.serviceTagId === serviceTagId
                            ? `btn active`
                            : `btn`
                        }
                      >
                        {tag.servicetagName}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
          {remarks && remarks.length > 0 && (
            <View>
              {remarks.map((item, key) => {
                return (
                  <View key={key.toString()} className='service item'>
                    <Text className='label'>{item.tplName}</Text>
                    <View className='value'>
                      {item.attrItemList.map((tag, index) => {
                        const current = { ...tag, tplId: item.tplId };
                        return (
                          <View
                            key={index}
                            onClick={this.onRemarkClick.bind(this, current)}
                            className={tag.selected ? `btn active` : `btn`}
                          >
                            {tag.name}
                            {tag.selected && item.checkbox && (
                              <View className='icon' />
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <View className='num item'>
            <Text className='label'>数量</Text>
            <View className='value'>
              <View
                className='minus'
                onClick={this.onNumClick.bind(this, -stepBuyUnitNum)}
              />
              <View className='val'>{this.state.number}</View>
              <View
                className='plus'
                onClick={this.onNumClick.bind(this, stepBuyUnitNum)}
              />
            </View>
            {tips && <View className='tips'>{tips}</View>}
          </View>
        </View>
        <View className='footer'>
          {preSale && reserveContentInfo && (
            <View className='alert'>{reserveContentInfo}</View>
          )}
          {type !== `order` && type !== `prepare` && (
            <View
              className={
                isCanAddCart && status === 2
                  ? `add-cart`
                  : !isCanAddCart
                  ? `add-cart disabled`
                  : `add-cart yellow`
              }
              onClick={this.onAddCart}
            >
              {notJumpCart ? '立即购买' : '加入购物车'}
            </View>
          )}
          {isCanPreSale && type === `order` && (
            <View className='add-order' onClick={this.onAddCart}>
              <View className='prepare-msg'>立即预订 </View>
            </View>
          )}
          {type === 'prepare' && (
            <View
              className='add-order add-prepare-order'
              onClick={this.onAddCart}
            >
              预约抢购
            </View>
          )}
        </View>
      </View>
    );
  }
}
