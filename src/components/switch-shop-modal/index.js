import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import FreshProductButton from '../product-button';
import { px2vw } from '../../utils/common/utils';
import { theme } from '../../common/theme';
import './index.scss';

export default class SwitchShopModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.currentIndex || -1,
    };
  }

  onSwitch(index) {
    this.setState({
      current: index,
    });
  }

  onClose() {
    const { shopList } = this.props;
    let { current } = this.state;
    if (current === -1) {
      Taro.showToast({
        title: '请勾选一家门店哦~',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    current = current || 0;
    const curInfo = (shopList && shopList[current]) || {};
    this.props.onClose(curInfo, current);
  }

  render() {
    const { name, shopList, show } = this.props;
    const { current } = this.state;

    return (
      <View>
        {show ? (
          <View className='switch-shop-modal' style={{ zIndex: 999 }}>
            <View className='main' style={{ height: px2vw(338) }}>
              <View className='shop-content'>
                {name && <View className='title'>{name}</View>}
                <View className='shop-list'>
                  {shopList &&
                    shopList.map((info, index) => {
                      return (
                        <View
                          className='info'
                          key={index.toString()}
                          onClick={this.onSwitch.bind(this, index)}
                        >
                          <View className='left'>
                            <Text className='title'>
                              {/* {info.tenantInfo.tenantName}-{info.storeName} */}
                              {info.storeName}
                            </Text>
                            <Text className='address'>{info.storeAddress}</Text>
                            {info.tenantDesc && (
                              <Text className='desc'>{info.tenantDesc}</Text>
                            )}
                          </View>
                          <View className='right'>
                            {current === index ? (
                              <Image
                                src={theme.selectBtn}
                                alt='7FRESH'
                                className='img'
                              />
                            ) : (
                              <Image
                                src='//m.360buyimg.com/img/jfs/t1/86559/9/6002/1478/5df0b890E46141a3d/265b5de14737ee5d.png'
                                alt='七鲜'
                                className='img'
                              />
                            )}
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
              <View className='shop-footer'>
                <FreshProductButton
                  name='确认门店'
                  borderRadius={['44rpx', '44rpx', '44rpx', '44rpx']}
                  color='#fff'
                  width='400'
                  height='80'
                  disabled={false}
                  background={theme.btnColor}
                  fontWeight='normal'
                  onClick={this.onClose.bind(this)}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
