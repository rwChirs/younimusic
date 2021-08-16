//我的订单里面的小icon miao 2018-09-03

import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { Button } from '@tarojs/components';
import './index.scss';

export default class OrderBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    type: '',
    message: '',
    borderColor: '',
    color: '',
    info: {},
  };

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  btnStyle = () => {
    let color = this.props.borderColor ? this.props.borderColor : '#B5B5B5';
    let btnCss = {
      borderColor: color,
      height: '64rpx',
      lineHeight: '64rpx',
      fontSize: '26rpx',
      color: this.props.color ? this.props.color : '#252525',
      background: '#fff',
      paddingLeft: '43rpx',
      paddingRight: '43rpx',
      display: 'inline-block',
    };
    return btnCss;
  };

  render() {
    return (
      <Button
        openType={this.props.type ? `share` : ``}
        className='bd-all-1px'
        style={this.btnStyle()}
        dataInfo={this.props.info}
        onClick={this.onClick}
      >
        {this.props.message}
      </Button>
    );
  }
}
