import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class cancelConfirmModal extends Component {
  onSureBack = () => {
    const { onSureBack } = this.props;
    onSureBack && typeof onSureBack === 'function' && onSureBack();
  };

  closeModal = () => {
    const { onCloseModal } = this.props;
    onCloseModal && typeof onCloseModal === 'function' && onCloseModal();
  };

  render() {
    return (
      <View>
        <View className='confirm-layer' onClick={this.closeModal.bind(this)} />
        <View className='confirm-modal'>
          <View className='confirm-modal-txt'>
            <View className='confirm-modal-main-txt'>确定退出发布吗</View>
            <View className='confirm-modal-ext-txt'>退出后内容将不被保存</View>
          </View>
          <View className='confirm-modal-btns'>
            <View className='cancel-btn' onClick={this.closeModal.bind(this)}>
              取消
            </View>
            <View className='sure-btn' onClick={this.onSureBack.bind(this)}>
              退出
            </View>
          </View>
        </View>
      </View>
    );
  }
}
