import { Component } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import './index.scss';
import { px2vw } from '../../../../utils/common/utils';

export default class Service extends Component {
  static defaultProps = {
    info: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      serviceTagId: props.info.serviceTagId,
      buyNum: +props.info.startBuyUnitNum,
      remarks: props.info.attrInfoList,
      cartHeight: px2vw(wx.getSystemInfoSync().windowHeight),
    };
  }

  getTagTime = (serviceTags, serviceTagId) => {
    if (!serviceTags || !serviceTags.length) return '';
    let name = '';
    serviceTags.some((val) => {
      if (val.serviceTagId === serviceTagId) {
        name = val.servicetagTime;
        return;
      }
    });
    return name;
  };
  changeServerTagId = (serviceTagId) => {
    this.setState({
      serviceTagId,
    });
  };
  minus = (stepBuyUnitNum, startBuyUnitNum) => {
    this.setState({
      buyNum:
        this.state.buyNum - stepBuyUnitNum > startBuyUnitNum
          ? this.state.buyNum - stepBuyUnitNum
          : startBuyUnitNum,
    });
  };
  add = (stepBuyUnitNum, maxBuyUnitNum) => {
    this.setState({
      buyNum:
        this.state.buyNum + stepBuyUnitNum < maxBuyUnitNum
          ? this.state.buyNum + stepBuyUnitNum
          : maxBuyUnitNum,
    });
  };
  addCart = () => {
    const { skuId } = this.props.info;
    const { serviceTagId, buyNum, remarks } = this.state;
    let selectedTasteInfoIds = {};
    remarks &&
      remarks.forEach((item1) => {
        let id = [];
        item1.attrItemList.forEach((item2) => {
          if (item2.selected) {
            id.push(item2.id);
          }
        });
        if (id.length > 0) {
          selectedTasteInfoIds[item1.tplId] = id;
        }
      });
    this.props.onServiceAddCart({
      skuId,
      buyNum,
      serviceTagId,
      selectedTasteInfoIds,
      source: 1,
    });
  };
  filterImg = (img, str) => {
    const userDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/26929/4/4756/5639/5c344af6Ebe5f3e0e/fa5459e8c7c28ac1.png';
    const productDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/10366/26/8278/700/5c3455c6E7713217b/bf369c461fca9fd9.png';
    let value = '';
    if (str === 'user') {
      value = img ? img : userDefaultPicture;
    } else {
      value = img ? img : productDefaultPicture;
    }
    if (value) {
      if (value.indexOf('http') <= -1) {
        return 'https:' + value;
      } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
        let str1 = value.split('http:')[1];
        return 'https:' + str1;
      } else if (value.indexOf('webp') > -1) {
        let str2 = value.replace('.webp', '');
        return str2;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  /**
   * 切换口味备注
   */
  onRemarkClick = (current) => {
    const { remarks } = this.state;
    if (current.tplId) {
      remarks.forEach((item) => {
        if (current.tplId === item.tplId) {
          if (item.checkbox) {
            item.attrItemList.forEach((item2) => {
              if (item2.id === current.id) {
                item2.selected = !item2.selected;
              }
            });
          } else {
            item.attrItemList.forEach((item2) => {
              if (item2.id === current.id) {
                item2.selected = true;
              } else {
                item2.selected = false;
              }
            });
          }
        }
      });
    }
    this.setState({
      remarks,
    });
  };
  render() {
    const { info, onClose } = this.props;
    const {
      imageUrl,
      jdPrice,
      buyUnit,
      saleSpecDesc,
      serviceTags,
      stepBuyUnitNum,
      startBuyUnitNum,
      maxBuyUnitNum,
      attrInfoList,
    } = info;
    const { buyNum, serviceTagId, cartHeight } = this.state;
    return (
      <View className='service' catchtouchmove='return'>
        <View className='top'>
          <View className='close-btn' onClick={onClose} />
          <Image className='img' src={this.filterImg(imageUrl)} />
          <View className='img-left'>
            <View className='price-wrap'>
              <Text className='sale-unit'>¥</Text>
              <Text className='price'>{jdPrice}</Text>
              <Text className='unit'>{buyUnit}</Text>
            </View>
            <View className='pick-amount'>已选：{buyNum}</View>
          </View>
        </View>
        <ScrollView
          className='cart-height'
          style={{ maxHeight: cartHeight }}
          scroll-y
        >
          {saleSpecDesc && (
            <View className='spec'>
              <View className='title'>规格</View>
              <View className='spec-txt'>{saleSpecDesc}</View>
            </View>
          )}
          {serviceTags && serviceTagId && (
            <View className='process'>
              <View className='title'>加工</View>
              <View className='process-des'>
                {this.getTagTime(serviceTags, serviceTagId) && (
                  <View className='process-txt'>
                    {this.getTagTime(serviceTags, serviceTagId)}
                  </View>
                )}
                <View className='process-list'>
                  {serviceTags &&
                    serviceTags.length > 0 &&
                    serviceTags.map((val, i) => {
                      return (
                        <View
                          className={`process-item ${
                            val.serviceTagId === serviceTagId
                              ? 'process-item-active'
                              : ''
                          }`}
                          key={i}
                          onClick={this.changeServerTagId.bind(
                            this,
                            val.serviceTagId
                          )}
                        >
                          {val.servicetagName}
                        </View>
                      );
                    })}
                </View>
              </View>
            </View>
          )}
          <View className='process-list'>
            {attrInfoList &&
              attrInfoList.length > 0 &&
              attrInfoList.map((item, key) => {
                return (
                  <View key={key.toString()} className='remark_item'>
                    <Text className='label'>{item.tplName}</Text>
                    <View className='value'>
                      {item &&
                        item.attrItemList &&
                        item.attrItemList.length > 0 &&
                        item.attrItemList.map((tag, index) => {
                          const current = { ...tag, tplId: item.tplId };
                          return (
                            <View
                              key={index}
                              onClick={this.onRemarkClick.bind(this, current)}
                              className={tag.selected ? `btn active` : `btn`}
                            >
                              {tag.name}
                              <View
                                className={
                                  tag.selected && item.checkbox ? `icon` : ``
                                }
                              />
                            </View>
                          );
                        })}
                    </View>
                  </View>
                );
              })}
          </View>
          <View className='amount'>
            <View className='amount-txt'>选择数量</View>
            <View className='change-amount'>
              <View
                className='minus-wrap'
                onClick={this.minus.bind(
                  this,
                  Number(stepBuyUnitNum),
                  Number(startBuyUnitNum)
                )}
              >
                <View className='minus' />
              </View>
              <View className='txt'>{buyNum ? buyNum : 0}</View>
              <View
                className='add-wrap'
                onClick={this.add.bind(
                  this,
                  Number(stepBuyUnitNum),
                  Number(maxBuyUnitNum)
                )}
              >
                <View className='add' />
              </View>
            </View>
          </View>
        </ScrollView>

        <View className='add-cart-btn' onClick={this.addCart}>
          加入购物车
        </View>
      </View>
    );
  }
}
