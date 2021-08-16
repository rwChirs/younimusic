import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import  FreshProductButton  from '../product-button';
import { px2vw } from '../../utils/common/utils';
import { theme } from '../../common/theme';
import './index.scss';

export default class SwitchAddressModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSwitch(info) {
    this.props.onSwitch(info);
  }

  onClose(info) {
    this.props.onClose(info);
  }

  render() {
    let { name, data, show } = this.props;

    return (
      <View>
        {show ? (
          <View className='switch-modal' style={{ zIndex: 999 }}>
            <View className='main' style={{ height: px2vw(338) }}>
              <View className='s-content'>
                {name && <View className='switch-title'>{name}</View>}
                <View className='switch-name'>
                  {/* {data && data.tenantInfo && (
                    <Text>{data.tenantInfo.tenantName}</Text>
                  )} */}
                  {data && <Text>{data.storeName}</Text>}
                </View>
              </View>
              <View className='s-footer' style={{ zIndex: 2 }}>
                <FreshProductButton
                  name='不切换'
                  borderRadius={['44rpx', '44rpx', '44rpx', '44rpx']}
                  color='#252525'
                  width='280'
                  height='80'
                  background='#fff'
                  borderType='circle'
                  border='1px solid rgba(151,151,151,0.5)'
                  fontWeight='normal'
                  disabled={false}
                  onClick={this.onClose.bind(this, data)}
                />
                <FreshProductButton
                  name='切换'
                  borderType='circle'
                  borderRadius={['44rpx', '44rpx', '44rpx', '44rpx']}
                  color='#fff'
                  width='280'
                  height='80'
                  background={theme.btnColor}
                  fontWeight='normal'
                  disabled={false}
                  onClick={this.onSwitch.bind(this, data)}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
