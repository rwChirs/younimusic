import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class delNotesModal extends Component {
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
          className='del-notes-modal-layer'
          onClick={this.closeDelNotesModal}
        />
        <View className='del-notes-modal-container'>
          <View className='title'>删除</View>
          <View className='main'>
            <View className='top' />
            <View className='bottom'>
              <View className='bottom-main'>
                <View className='del-container' onClick={this.delNotes}>
                  <View className='del-icon' />
                  <View className='del-txt'>删除</View>
                </View>
              </View>
            </View>
          </View>
          <View className='btn' onClick={this.closeDelNotesModal}>
            取消
          </View>
        </View>
      </View>
    );
  }
}
