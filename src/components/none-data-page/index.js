import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

const image = {
  white:
    'https://m.360buyimg.com/img/jfs/t1/20824/13/11575/38431/5c91b0e4E2c239a18/4f7ffc5c87c2258c.png',
  black:
    'https://m.360buyimg.com/img/jfs/t1/59122/35/11710/9074/5d8c3e65Ebb3a2dec/7a0ade1141b81f96.png',
};
export default class NoneDataPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  handleRefresh = () => {
    this.props.onRefresh();
  };
  render() {
    const { skin, showRefresh, tip, styleObj } = this.props;
    return (
      <View className={`none-modal-page ${skin}`} style={{ ...styleObj }}>
        <Image
          className='lazyload'
          mode='aspectFit'
          src={image[skin]}
          alt='暂无数据'
        />
        <View className='none-word'>{tip || '暂无数据'}</View>
        {showRefresh && (
          <View className='refresh-btn' onClick={this.handleRefresh}>
            刷新试试
          </View>
        )}
      </View>
    );
  }
}
