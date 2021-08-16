import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image } from '@tarojs/components';
import { leftIcon } from '../../utils/images';
import './index.scss';

export default class CellTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    const {
      // imgUrl,
      title,
      more,
      // resource
    } = this.props;
    return (
      <View className='fight-cell-title'>
        {/* <Image src={imgUrl} className="title" style={{height:resource==='today'?'36rpx':'32rpx'}}/> */}
        <Text className='name'>{title}</Text>
        {more && (
          <View onClick={this.onClick}>
            <Text className='more'>查看更多</Text>
            <Image src={leftIcon} className='left-icon' />
          </View>
        )}
      </View>
    );
  }
}
