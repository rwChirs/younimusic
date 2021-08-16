import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image } from '@tarojs/components';
import { goTop, home } from '../../utils/images';
import './index.scss';

export default class FightGoTop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    const { type } = this.props;
    return type === 'goTop' ? (
      <View className='fight-top-page' onClick={this.onClick}>
        <Image src={goTop} mode='aspectFit' className='img' />
      </View>
    ) : (
      <View className='fight-top-page' onClick={this.onClick}>
        <Image src={home} mode='aspectFit' className='img' />
      </View>
    );
  }
}
