import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button } from '@tarojs/components';
import './index.scss';
//详情页底部按钮
export default class FightDetailBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    button: {},
  };

  onClick = e => {
    e.stopPropagation();
    const {
      button: { cancelType },
      deliveryStatus,
    } = this.props;
    if (!cancelType && !deliveryStatus) return;
    this.props.onClick();
  };

  onGetUserInfo = e => {
    this.props.onGetUserInfo(e);
  };

  render() {
    const { button, btnType, openType, deliveryStatus } = this.props;
    let btnTxt = button.buttonText;
    const cancelType = button.cancelType;

    if (button.option === 3) {
      btnTxt = '邀请好友';
    } else {
      btnTxt = '我来开团';
    }
    return cancelType !== 3 ? (
      <View className='fight-detail-btn'>
        <View className='share-cont'>
          <Button
            className='share-btn'
            openType={openType}
            onClick={this.onGetUserInfo}
          >
            <View className='word'>分享</View>
          </Button>
        </View>
        {btnType === 2 ? (
          <Button
            className='btn'
            openType={openType}
            style={{
              background: cancelType
                ? 'rgb(221,221,221)'
                : 'linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))',
            }}
            onClick={this.onClick}
          >
            {btnTxt}
          </Button>
        ) : (
          <View
            className='btn'
            style={{
              background:
                cancelType || (!cancelType && !deliveryStatus)
                  ? 'rgb(221,221,221)'
                  : 'linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))',
            }}
            onClick={this.onClick}
          >
            {btnTxt}
          </View>
        )}
      </View>
    ) : (
      <View className='fight-detail-btn fight-detail-disabled'>
        <View className='btn-txt'>{btnTxt}</View>
      </View>
    );
  }
}
