import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class delConfirmModal extends Component {
  delNotes = () => {
    const { onDelNotes } = this.props;
    onDelNotes && typeof onDelNotes === 'function' && onDelNotes();
  };

  closeDelNotesModal = () => {
    const { onClose } = this.props;
    onClose && typeof onClose === 'function' && onClose();
  };

  render() {
    return (
      <View>
        <View
          className='del-confirm-layer'
          onClick={this.closeDelNotesModal.bind(this)}
        />
        <View className='del-confirm-modal'>
          <View className='del-confirm-modal-txt'>是否确定删除？</View>
          <View className='del-confirm-modal-btns'>
            <View
              className='cancel-btn'
              onClick={this.closeDelNotesModal.bind(this)}
            >
              取消
            </View>
            <View className='sure-btn' onClick={this.delNotes.bind(this)}>
              确定
            </View>
          </View>
        </View>
      </View>
    );
  }
}
