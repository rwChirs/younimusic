import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
// import { getExposure } from '../../../../utils/common/exportPoint';
import './index.scss';

export default class SubscribeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = info => {
    this.props.onClick(info);
  };

  onClose = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  render() {
    const { type, show, isIphoneX } = this.props;

    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' />
        <View
          className='info-modal-content'
          style={{
            top: isIphoneX
              ? type === 1
                ? '120px'
                : '220px'
              : type === 1
              ? '80px'
              : '150px',
            left: 0,
          }}
        >
          {type === 1 && (
            <View className='remind'>
              <Image
                className='remind-pic'
                src='https://m.360buyimg.com/img/jfs/t1/155946/40/5403/123243/5ffbc250E7d8e27b2/690b588c62c276e9.png'
                alt=''
              />
            </View>
          )}

          {type === 2 && (
            <View className='restart' onClick={this.onClose.bind(this)}>
              <View className='title'>开启失败</View>
              <Image
                className='restart-pic'
                src='https://m.360buyimg.com/img/jfs/t1/156504/3/5388/98666/5ffbd41eE7c2df09b/1a5796a5ad5fae5b.png'
                alt=''
              />
              <View className='notice'>
                您未勾选“
                <Text className='always'>总保持以上选择，不再询问</Text>”
              </View>
              <View className='restart-but'>重新开启</View>
            </View>
          )}
        </View>
      </View>
    ) : null;
  }
}
