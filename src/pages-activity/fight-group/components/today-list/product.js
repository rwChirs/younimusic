import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image } from '@tarojs/components';
import { productDefaultPicture } from '../../utils/images';
import { filterImg, filterDescription } from '../../../../utils/common/utils';
import './index.scss';
//详情页-今日拼团列表
export default class TodayProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    info: {},
  };

  render() {
    const { info } = this.props;
    let grouponSign = '',
      title = '';
    if (
      (info && info.grouponSign && info.grouponSign === 1) ||
      info.grouponSign === 4
    ) {
      grouponSign = '邀新团';
    }
    if (info && info.grouponTitle && info.grouponTitle.indexOf('】') > -1) {
      title = info.grouponTitle.split('】')[1];
    } else {
      title = info.grouponTitle;
    }
    return (
      <View className='today-product-page'>
        <Image
          src={info.image ? filterImg(info.image) : productDefaultPicture}
          mode='aspectFit'
          className='img'
        />
        <View className='today-title'>
          {grouponSign && <View className='litter-tip'>{grouponSign}</View>}
          {filterDescription(title, 9)}
        </View>
        <View className='price'>
          <Text className='litter'>{info.memberCount}人团</Text>
          <Text className='big'>
            <Text className='unit'>¥</Text>
            {info.grouponPrice}
          </Text>
        </View>
        <View className='desc'>
          单买价<Text className='grey'>¥{info.basePrice}</Text>
        </View>
      </View>
    );
  }
}
