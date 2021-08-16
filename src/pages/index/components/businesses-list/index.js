// import Taro, { Component } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import BusinessesItem from '../businesses-item';
import './index.scss';

export default class BusinessesList extends Component {
  static defaultProps = {
    tenantShopInfoList: [],
  };

  isShowBusinessesList = () => {
    const { onHandelBusinessesList } = this.props;
    onHandelBusinessesList(false);
  };

  render() {
    const {
      tenantShopInfoList,
      addressExt,
      onHandelChangeBusinesses,
      navHeight,
      windowWidth,
    } = this.props;
    console.log('tenantShopInfoList=', tenantShopInfoList);
    return (
      <View>
        {tenantShopInfoList && tenantShopInfoList.length > 0 && (
          <View>
            <View
              className='brayBg-layer'
              catchtouchmove='true'
              onClick={this.isShowBusinessesList}
            />
            <View
              className='businesses-list-main'
              style={{
                top: `${(navHeight / windowWidth) * 375 + 20}rpx`,
              }}
            >
              <View className='businesses-list'>
                <View className='businesses-list-icon'></View>
                {addressExt && (
                  <View className='businesses-list-title'>
                    附近{tenantShopInfoList.length}个商家可配送至：{addressExt}
                  </View>
                )}
                <View className='businesses-list-container'>
                  {tenantShopInfoList.map((val, i) => {
                    return (
                      <View className='businesses-list-item' key={i}>
                        <BusinessesItem
                          tenantShopInfo={val}
                          index={i}
                          onHandelChangeBusinesses={onHandelChangeBusinesses}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
