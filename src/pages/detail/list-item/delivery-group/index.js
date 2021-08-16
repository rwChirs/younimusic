import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Image } from '@tarojs/components';

import './index.scss';

export default class DeliveryGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressInfo: Taro.getStorageSync('addressInfo') || {},
    };
  }

  static defaultProps = {
    label: '配送',
    data: {},
  };

  onChange = id => {
    this.props.onChange(id);
  };

  componentWillReceiveProps() {
    this.setState({
      addressInfo: Taro.getStorageSync('addressInfo') || {},
    });
  }

  render() {
    const { addressInfo } = this.state;
    let {
      address,
      deliveryTime,
      status,
      preSale,
      reserveContentInfo,
      shipmentInfo,

      fullSpeed,
      overWeightInfo,
      fareInfo,
      specialInstruction,
    } = this.props.data;
    const { preSaleInfo } = this.props;
    let { label } = this.props.label;
    if (address && address.indexOf('null') > -1) {
      address = address.split('null')[1];
    }
    return (
      <View className='delivery-group'>
        <View className='address-detail'>
          <View className='label'>
            <Text>{label}</Text>
          </View>
          <View className='address-info'>
            <View className='tenant-detail'>
              <View className='tenant-logo'>
                {/* <image src="https://m.360buyimg.com/img/jfs/t1/57554/13/5982/3233/5d397a6dE02b52e77/944cd0f10669d5df.png" /> */}
                {/* {托底7fresh大族店} */}
                <Image
                  src={
                    addressInfo &&
                    addressInfo.tenantInfo &&
                    addressInfo.tenantInfo.circleLogo
                      ? addressInfo.tenantInfo.circleLogo
                      : 'https://storage.jd.com/tenant-image/1/circleLogo.png'
                  }
                />
              </View>
              <View className='tenant-name'>
                {/* {addressInfo &&
            addressInfo.tenantInfo &&
            addressInfo.tenantInfo.tenantName
              ? addressInfo.tenantInfo.tenantName
              : '七鲜'} */}
                {addressInfo && addressInfo.storeName
                  ? addressInfo.storeName
                  : '大族广场店'}
              </View>
              {/* <View className="tenant-shop">大族广场店</View> */}
            </View>
            <View className='name'>
              <Text decode className='address'>
                {address
                  ? address
                  : addressInfo && addressInfo.storeName
                  ? addressInfo.storeName
                  : (addressInfo.tenantShopInfo &&
                      addressInfo.tenantShopInfo[0] &&
                      addressInfo.tenantShopInfo[0].storeAddress) ||
                    '荣华南路2号大族广场购物中心1F'}
              </Text>
            </View>
            <View className='description'>
              {/* 极速达 */}
              {fullSpeed && <Text className='fullSpeed-tag'>{fullSpeed}</Text>}
              {/* 定日达 */}
              {overWeightInfo && (
                <Text className='tomorrow'>{overWeightInfo}</Text>
              )}

              <Text className={status === 2 ? `text` : `text error`}>
                {shipmentInfo.symbol === 1 && (
                  <Text className='symbol'>{shipmentInfo.inventoryInfo}，</Text>
                )}
                {deliveryTime}
              </Text>
              {preSale && reserveContentInfo && (
                <Text className='text error'>{reserveContentInfo}</Text>
              )}
              {preSaleInfo && preSaleInfo.preSaleDeliveryNote && (
                <Text className='text'>{preSaleInfo.preSaleDeliveryNote}</Text>
              )}

              {/* 运费信息 */}
              {fareInfo && <View className='fareInfo'>{fareInfo}</View>}
              {/* 特殊说明 */}
              {specialInstruction && (
                <View className='specialInstruction'>{specialInstruction}</View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
