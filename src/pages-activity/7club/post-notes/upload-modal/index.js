import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class FreshUploadModal extends Component {
  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  onPrompt = e => {
    e.stopPropagation();
    this.props.onPrompt();
  };

  render() {
    const { type, show, title, desc, hasHandle } = this.props;
    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' />
        <View className='info-modal-content'>
          {type === 7 && (
            <View className='info-modal-upload'>
              <View className='title'>{title}</View>
              <View className='desc'>{desc}</View>
              <View className='btn' onClick={this.onClick}>
                我知道了
              </View>
              <View onClick={this.onPrompt}>
                <View className={`icon ${hasHandle ? 'icon-img' : ''}`}></View>
                <View className='inner-text'>以后不再提醒</View>
              </View>
            </View>
          )}
        </View>
      </View>
    ) : null;
  }
}
