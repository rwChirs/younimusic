/* 我的订单里面的小icon
 * 可传入参数 borderColor background color fontSize
 */
import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text } from '@tarojs/components';

export default class TeamIcon extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    borderColor: '',
    background: '',
    fontSize: '',
    color: '',
    message: '',
  };

  IconStyle = () => {
    let color = this.props.borderColor ? this.props.borderColor : '#00B50F';
    let bd = '1rpx solid ' + color;
    let iconCss = {
      display: 'inline-block',
      paddingTop: '8rpx',
      paddingBottom: '8rpx',
      paddingLeft: '10rpx',
      paddingRight: '10rpx',
      lineHeight: '26rpx',
      borderRadius: '4rpx',
      border: bd,
      background: this.props.background ? this.props.background : '#fff',
    };
    return iconCss;
  };

  txtStyle = e => {
    console.log(e);
    let txtCss = {
      color: this.props.color ? this.props.color : '#00B50F',
      fontSize: this.props.fontSize ? this.props.fontSize : '13px',
      fontFamily: 'PingFangSC-Regular',
      display: 'inline-block',
    };
    return txtCss;
  };

  render() {
    return (
      <View>
        <View style={this.IconStyle()}>
          <Text style={this.txtStyle()}>{this.props.message}人团</Text>
        </View>
      </View>
    );
  }
}
