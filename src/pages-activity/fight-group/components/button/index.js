import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button } from '@tarojs/components';
import './index.scss';

export default class FightBigButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = (desc, e) => {
    this.props.onClick(desc, e);
  };

  render() {
    let { resource, btnTxt, openType } = this.props;
    return openType ? (
      <Button
        openType={openType}
        style={{
          fontSize: resource === 'result' ? '18px' : '14px',
          fontFamily:
            resource === 'result' ? 'PingFangSC-Regular' : 'PingFangSC-Medium',
        }}
        className='fight-big-btn'
        onClick={this.onClick.bind(this, 'share')}
      >
        {btnTxt}
      </Button>
    ) : (
      <View
        style={{
          fontSize: resource === 'result' ? '18px' : '14px',
          fontFamily:
            resource === 'result' ? 'PingFangSC-Regular' : 'PingFangSC-Medium',
        }}
        className='fight-big-btn'
        onClick={this.onClick}
      >
        {btnTxt}
      </View>
    );
  }
}
