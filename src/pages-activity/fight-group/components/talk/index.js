import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
import { userDefaultPicture } from '../../utils/images';
// import { transformTime } from '../../utils/filter';
import './index.scss';
//大家都在讲
export default class AllTalk extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    grouponingInfo: {},
  };

  onClick = info => {
    this.props.onClick(info);
  };

  render() {
    const { info } = this.props;

    return (
      <View className='talk-page'>
        <Image
          src={
            info.grouponingInfo.memberInfo.avatar
              ? info.grouponingInfo.memberInfo.avatar
              : userDefaultPicture
          }
          mode='aspectFit'
          className='user-img'
        />
        <View className='right-content'>
          <View className='info'>
            <Text className='user-name'>
              {info.grouponingInfo.memberInfo.nickname}
            </Text>
            <Text className='time'>
              {info &&
                info.grouponingInfo &&
                info.grouponingInfo.startTimeString}
            </Text>
          </View>
          <View className='card-content'>
            <View className='top'>
              <Text className='left'>我在开团</Text>
              <View className='right'>
                还差<Text className='red'>{info.grouponingInfo.needNum}</Text>
                人成团
              </View>
            </View>
            <View className='bottom'>
              <Image
                src={info.skuInfoWeb.imageUrl}
                mode='aspectFit'
                className='product-img'
              />
              <View className='content'>
                <View className='title'>
                  {info.skuInfoWeb.skuName ? info.skuInfoWeb.skuName : ''}
                </View>
                <View className='desc'>
                  {info.skuInfoWeb.saleSpecDesc
                    ? info.skuInfoWeb.saleSpecDesc
                    : ''}
                </View>
                <View className='red'>
                  <Text className='litter'>
                    {info.grouponingInfo.grouponNum
                      ? info.grouponingInfo.grouponNum
                      : 0}
                    人团¥
                  </Text>
                  <Text className='big'>
                    {info.skuInfoWeb.grouponPrice
                      ? info.skuInfoWeb.grouponPrice
                      : 0.0}
                  </Text>
                </View>
                <View className='grey-price'>
                  单买价
                  <Text className='through'>
                    ¥
                    {info.skuInfoWeb.basePrice
                      ? info.skuInfoWeb.basePrice
                      : 0.0}
                  </Text>
                </View>
                <View className='btn' onClick={this.onClick.bind(this, info)}>
                  去参团
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
