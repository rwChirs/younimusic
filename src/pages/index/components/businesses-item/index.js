import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class BusinessesItem extends Component {
  static defaultProps = {
    tenantShopInfo: {
      tenantInfo: {},
    },
  };

  onChangeBusinesses = () => {
    const { tenantShopInfo, onHandelChangeBusinesses, index } = this.props;
    onHandelChangeBusinesses(tenantShopInfo, index);
  };

  render() {
    const { tenantShopInfo } = this.props;
    const { tenantInfo } = tenantShopInfo;
    return (
      <View
        className={`businesses-item ${
          tenantShopInfo && tenantShopInfo.isSelected ? 'cur' : ''
        }`}
      >
        <View
          className='businesses-container'
          style={{
            height:
              tenantShopInfo && tenantShopInfo.tenantDesc
                ? Taro.pxTransform(212)
                : Taro.pxTransform(180),
          }}
          onClick={this.onChangeBusinesses}
        >
          <View className='businesses-container-left lazy-load-img'>
            {tenantInfo && tenantInfo.smallLogo && (
              <Image
                className='businesses-img'
                src={filterImg(tenantInfo.bigLogo)}
                lazyLoad
              />
            )}
          </View>

          <View className='businesses-container-middle'>
            <View className='businesses-name'>{tenantShopInfo.storeName}</View>
            <View className='businesses-time-range'>
              {tenantShopInfo.promiseInfo && (
                <Text>{tenantShopInfo.promiseInfo}</Text>
              )}
            </View>
            {tenantShopInfo && tenantShopInfo.businessInfo && (
              <View className='businesses-delivery'>
                {tenantShopInfo.businessInfo}
              </View>
            )}
            {tenantShopInfo && tenantShopInfo.tenantDesc && (
              <View className='businesses-desc'>
                {tenantShopInfo.tenantDesc}
              </View>
            )}
          </View>

          {tenantShopInfo && tenantShopInfo.isSelected && (
            <View className='businesses-container-right'>
              <View className='businesses-selected-icon'></View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
