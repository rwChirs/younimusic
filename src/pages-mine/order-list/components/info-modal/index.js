import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class InfoModal extends Component {
  render() {
    const { show, img, onClose, qrCodeText } = this.props;
    const close =
      'https://m.360buyimg.com/img/jfs/t1/31101/30/2130/3801/5c669c1fE98231e9e/191a2768868a76b6.png';

    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' />
        <View className='info-modal-content'>
          <View className='info-modal-wx'>
            <View className='info-modal-wx-sub-title'>{qrCodeText}</View>
            <Image
              className='info-modal-wx-img'
              src={img}
              mode='aspectFit'
              lazy-load
            />
          </View>
          <View className='close-btn'>
            <Image
              className='img'
              src={close}
              onClick={onClose}
              mode='aspectFit'
              lazy-load
            />
          </View>
        </View>
      </View>
    ) : null;
  }
}
