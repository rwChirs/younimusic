import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text,Button } from '@tarojs/components';
import LazyLoadImage from '../../../../components/render-html/lazy-load-image';
import { filterDescription } from '../../../../utils/common/utils';
import './index.scss';
export default class ThreeGroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    info: {},
  };

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  onGoDetail = e => {
    e.stopPropagation();
    this.props.onGoDetail();
  };

  render() {
    const { info, resource, openType } = this.props;
    let image,
      grouponTitle,
      skuIntroduce,
      memberCount,
      saleNum,
      grouponPrice,
      basePrice,
      buttonOption,
      buttonText,
      grouponSign;
    if (info) {
      if (resource === 'detail' && info.skuInfoWeb) {
        image = info.skuInfoWeb.imageUrl;
        grouponTitle = info.skuInfoWeb.skuName;
        skuIntroduce = info.skuInfoWeb.skuIntroduce;
        memberCount = info.grouponScale;
        saleNum = info.skuInfoWeb.saleNum;
        grouponPrice = info.skuInfoWeb.grouponPrice;
        basePrice = info.skuInfoWeb.basePrice;
      } else {
        image = info.image;
        grouponTitle = info.grouponTitle;
        skuIntroduce = info.skuIntroduce;
        memberCount = info.memberCount;
        saleNum = info.saleNum;
        grouponPrice = info.grouponPrice;
        basePrice = info.basePrice;
        buttonOption = info.buttonOption;
        buttonText = info.buttonText;
      }
      if (
        (info && info.grouponSign && info.grouponSign === 1) ||
        info.grouponSign === 4
      ) {
        grouponSign = '邀新团';
      }
    }

    return (
      <View className='fight-list-product'>
        <View className='img' onClick={this.onGoDetail}>
          <LazyLoadImage width={108.5} src={image} />
        </View>
        <View className='right'>
          <View onClick={this.onGoDetail} className='top'>
            <View className='title'>
              {grouponSign && <Text className='new'>{grouponSign}</Text>}
              <Text className='name'>
                {filterDescription(grouponTitle, 28)}
              </Text>
            </View>

            {skuIntroduce && <View className='desc'>{skuIntroduce}</View>}
          </View>
          <View className='bottom'>
            <View className='left-price'>
              <View className='top'>
                {resource === 'detail' && (
                  <Text className='user'>
                    {memberCount ? memberCount : 0}人团
                  </Text>
                )}
                <Text className='icon'>¥</Text>
                <Text className='red'>{grouponPrice ? grouponPrice : 0.0}</Text>
              </View>
              <View className='left-base'>
                单买价
                <Text className='txt'>¥{basePrice ? basePrice : 0.0}</Text>
              </View>
            </View>
            {resource !== 'detail' && (
              <Button
                onClick={this.onClick}
                openType={buttonOption === 3 ? openType : ''}
                dataInfo={info}
                className={
                  buttonOption === 5
                    ? 'button disabled'
                    : buttonOption === 3
                    ? 'button visited'
                    : 'button ok'
                }
              >
                {buttonText
                  ? buttonText === '立即开团'
                    ? '去拼团'
                    : buttonText
                  : '去拼团'}
              </Button>
            )}
          </View>
        </View>
      </View>
    );
  }
}
