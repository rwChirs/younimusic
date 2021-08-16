import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../utils/common/utils';
import './index.scss';

const EmptyImage = {
  address:
    'https://m.360buyimg.com/img/jfs/t1/156439/30/4417/57826/5ff518baE8ca99969/48dfe94738e456fe.png', // 地址为空
  goods:
    'https://m.360buyimg.com/img/jfs/t1/156108/16/4500/47875/5ff51992E0240c48b/d50c70ae1035f0b2.png', // 商品为空
  cart:
    'https://m.360buyimg.com/img/jfs/t1/156422/38/4393/47740/5ff519b2Ed1048719/7c841b2259f9aedd.png', // 购物车为空
  search:
    'https://m.360buyimg.com/img/jfs/t1/165613/34/1157/47048/5ff519fdE7ecd9f3f/9873288f6ca0de16.png', // 搜索结果为空
  coupon:
    'https://m.360buyimg.com/img/jfs/t1/161905/23/1187/46084/5ff51a3dEcb974b4b/a13e9ebe548927e5.png', // 优惠券为空
  content:
    'https://m.360buyimg.com/img/jfs/t1/151952/26/13565/41997/5ff51a73E2a3c1000/c32cbd8eca580ced.png', // 内容为空
  error:
    'https://m.360buyimg.com/img/jfs/t1/170320/30/1206/48004/5ff518f7Ec1c5caca/5028a86de4e7b3af.png', // 系统故障
};

export default class EmptyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onRefresh,
      style,
      showButton,
      imageUrl,
      imageStyle,
      EmptyPageTxt,
      EmptyBtnTxt,
      imgContainerStyle,
      type,
    } = this.props;
    const emptyImage = imageUrl || EmptyImage[type] || EmptyImage.error;
    return (
      <View className='empty-page' style={style}>
        <View
          className='empty-page-img-container lazy-load-img'
          style={imgContainerStyle}
        >
          <Image
            className='empty-page-img'
            lazyLoad
            style={imageStyle}
            alt='暂无数据'
            src={filterImg(emptyImage)}
          />
        </View>
        <View className='empty-page-txt'>{EmptyPageTxt || '暂无数据'}</View>
        {showButton !== false && (
          <View className='empty-page-btn' onClick={onRefresh.bind(this)}>
            {EmptyBtnTxt || '点击重试'}
          </View>
        )}
      </View>
    );
  }
}
