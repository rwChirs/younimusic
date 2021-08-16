import React, { Component } from 'react';
import { View, Button } from '@tarojs/components';
import './index.scss';

export default class Modal extends Component {
  constructor(props) {
    super(props);
  }

  onSetting = () => {
    this.props.onSetting();
  };

  onGetUserInfo = e => {
    this.props.onSetting(e);
  };

  render() {
    const { content, show } = { ...this.props };
    return show ? (
      <View className='modal'>
        <View className='modal-content'>
          <View className='title'>提醒</View>
          <View className='content'>{content}</View>
          <View className='footer'>
            {this.props.type === 'userLocation' && (
              <Button plain='true' className='btn' onClick={this.onSetting}>
                去设置
              </Button>
            )}
            {this.props.type === 'userInfo' && (
              <Button
                plain='true'
                openType='getUserInfo'
                className='btn'
                onGetUserInfo={this.onGetUserInfo}
              >
                允许
              </Button>
            )}
          </View>
        </View>
      </View>
    ) : (
      <View />
    );
  }
}
