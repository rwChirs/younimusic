import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Button } from '@tarojs/components';
import RecommendInfo from '../recommend-info';
import { px2vw } from '../../../../utils/common/utils';
import './index.css';

export default class SeatShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onShare = e => {
    e.stopPropagation();
    if (this.props.openType !== 'share') {
      this.props.onShare();
    }
  };

  onClose = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  onTextChange = e => {
    this.props.onTextChange(e);
  };

  render() {
    const { btnName, show, shareInfo, openType, name } = this.props;

    return show ? (
      <View className='modal' style={{ zIndex: 999 }}>
        <View className='main' style={{ height: px2vw(864) }}>
          <View className='header'>
            <View className='text'>{name}</View>
            <View className='img' onClick={this.onClose} />
          </View>
          <View className='content'>
            <RecommendInfo
              onTextChange={this.onTextChange}
              shareInfo={shareInfo}
            />
          </View>
          <View className='footer' style={{ zIndex: 2 }}>
            <Button
              className='info-share-btn'
              openType={openType}
              dataInfo=''
              onClick={this.onShare}
              style={{ border: 0 }}
            >
              {openType ? btnName : '保存'}
            </Button>
          </View>
        </View>
      </View>
    ) : null;
  }
}
