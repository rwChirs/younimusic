import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import FreshServiceNumSelector from '../service-num-selector'
import { filterImg, px2vw } from '../../utils/common/utils';
import './index.scss';

export default class FloorAddCart extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      serviceTagId: data && data.serviceTagId,
      servicetagTime: '免费',
      startBuyUnitNum: data && data.startBuyUnitNum,
      remarks: data && data.attrInfoList,
      cartHeight: px2vw(wx.getSystemInfoSync().windowHeight),
    };
  }

  /**
   * 切换加工服务
   */
  changeService = params => {
    this.setState({
      serviceTagId: params.serviceTagId,
      servicetagTime: params.servicetagTime,
    });
  };

  /**
   * 切换口味备注
   */
  onRemarkClick = current => {
    const { remarks } = this.state;
    if (current.tplId) {
      remarks.forEach(item => {
        if (current.tplId === item.tplId) {
          if (item.checkbox) {
            item.attrItemList.forEach(item2 => {
              if (item2.id === current.id) {
                item2.selected = !item2.selected;
              }
            });
          } else {
            item.attrItemList.forEach(item2 => {
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

  /**
   * 加车
   */
  addCart = () => {
    const { onAddCart, data } = this.props;
    const { serviceTagId, startBuyUnitNum, remarks } = this.state;
    let selectedTasteInfoIds = {};
    remarks &&
      remarks.forEach(item1 => {
        let id = [];
        item1.attrItemList.forEach(item2 => {
          if (item2.selected) {
            id.push(item2.id);
          }
        });
        if (id.length > 0) {
          selectedTasteInfoIds[item1.tplId] = id;
        }
      });
    onAddCart({
      ...data,
      serviceTagId: serviceTagId,
      startBuyUnitNum: startBuyUnitNum,
      selectedTasteInfoIds,
    });
  };

  changeNumber = startBuyUnitNum => {
    const { data } = this.props;
    this.setState(
      {
        startBuyUnitNum,
      },
      () => {
        if (startBuyUnitNum > data.maxBuyUnitNum - data.stepBuyUnitNum) {
          Taro.showToast({ title: '超过最大可购买数量', icon: 'none' });
        }
      }
    );
  };

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    let { data,show } = this.props;
    let {
      serviceTagId,
      servicetagTime,
      startBuyUnitNum,
      cartHeight,
    } = this.state;

    return (
      <View>
        {
          show && (
            <View className='seckill-add-cart-server' catchtouchmove='return'>
              <View
                className='brayBg'
                onClick={this.onClose.bind(this)}
                catchtouchmove='return'
              />
              <View className='add-cart'>
                <View className='con'>
                  <View className='info lazy-load-img'>
                    <Image className='img' src={filterImg(data.imageUrl)} lazyLoad />
                    <View className='price-con'>
                      <View className='price-info'>
                        <Text className='price-info-text'>¥</Text>
                        <Text className='price'>{data.jdPrice}</Text>
                        <Text className='price-info-em'>{data.buyUnit}</Text>
                        {data.marketPrice && (
                          <Text className='price-info-i'>
                            ¥&nbsp;{data.marketPrice}
                          </Text>
                        )}
                      </View>
                      <View className='sel-count'>已选：{startBuyUnitNum}</View>
                    </View>
                  </View>
                  <ScrollView
                    className='cart-height'
                    style={{ maxHeight: cartHeight }}
                    scroll-y
                  >
                    <View className='specs'>
                      <Text className='specs-text'>规格</Text>
                      <View className='text'>{data.saleSpecDesc}</View>
                    </View>
                    {data.serviceTags && data.serviceTags.length > 0 && (
                      <View className='cost'>
                        <Text className='cost-text'>加工</Text>
                        <View className='text'>{servicetagTime}</View>
                      </View>
                    )}
                    {data.serviceTags && data.serviceTags.length > 0 && (
                      <View className='service'>
                        {data.serviceTags.map((info, i) => {
                          return (
                            <Text
                              servicetagid='0'
                              key={i}
                              className={`service-em ${
                                serviceTagId == info.serviceTagId ? 'cur' : ''
                              }`}
                              onClick={this.changeService.bind(this, info)}
                            >
                              {info.servicetagName}
                            </Text>
                          );
                        })}
                      </View>
                    )}
                    {data.attrInfoList && data.attrInfoList.length > 0 && (
                      <View>
                        {data.attrInfoList.map((item, key) => {
                          return (
                            <View key={key.toString()} className='remark_item'>
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
                    )}
                    <View className='count'>
                      <Text className='text'>数量</Text>
                      <View className='operate'>
                        <FreshServiceNumSelector
                          status
                          number={Number(data.startBuyUnitNum)}
                          step={Number(data.stepBuyUnitNum)}
                          upperLimit={Number(data.maxBuyUnitNum)}
                          startValue={Number(data.startBuyUnitNum)}
                          onChangeNumber={this.changeNumber}
                          remainNum={Number(data.maxBuyUnitNum)}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
                <View
                  className='add-cart-btn'
                  onClick={this.addCart.bind(this, data)}
                >
                  <Text>加入购物车</Text>
                </View>
              </View>
            </View>
          )
        }
       </View> 
      );
  }
}
