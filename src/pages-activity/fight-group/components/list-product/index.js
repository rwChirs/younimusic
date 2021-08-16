import Taro from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import LazyLoadImage from '../../../../components/render-html/lazy-load-image';
import './index.scss';
import {
  px2vw,
  filterDescription,
  filterImg,
} from '../../../../utils/common/utils';

export default class ListProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    info: {},
  };

  onClick = (e) => {
    e.stopPropagation();
    this.props.onClick();
  };

  onGoDetail = (info) => {
    this.props.onGoDetail(info);
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
      buttonText;
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
    }
    let title = '';
    if (grouponTitle && grouponTitle.indexOf('】') > -1) {
      title = grouponTitle.split('】')[1];
    } else {
      title = grouponTitle;
    }

    return (
      <View
        className='fight-list-product'
        style={{
          marginBottom: resource === 'detail' ? 0 : '20rpx',
          height: resource === 'detail' ? 'auto' : px2vw(260),
        }}
        onClick={this.onGoDetail.bind(this, info)}
      >
        <View className='img'>
          <LazyLoadImage width={108.5} src={filterImg(image)} />
          {info.storeProp && (
            <View
              className='product-warm-tag'
              style={{
                background: `url(${filterImg(info.storeProp)}) no-repeat`,
                backgroundSize: '100% 100%',
              }}
            />
          )}
        </View>
        <View className='right'>
          <View>
            <View className='title'>
              {info.grouponSignDesc && (
                <Text
                  className='new'
                  style={{
                    background:
                      info.grouponSign === 1 || info.grouponSign === 4
                        ? 'linear-gradient(90deg, #ff6d6d, #fd3232)'
                        : 'linear-gradient(118.57deg, rgba(255,154,0,1) 0%,rgba(255,197,63,1) 100%)',
                  }}
                >
                  {info.grouponSignDesc}
                </Text>
              )}
              <Text className='name'>{filterDescription(title, 28)}</Text>
            </View>

            {skuIntroduce && <View className='desc'>{skuIntroduce}</View>}
            {resource !== 'detail' && (
              <View className='team'>
                <Text className='fight-user'>
                  {memberCount ? memberCount : 0}人团
                </Text>
                <Text className='alreadyNum'>
                  已拼{saleNum ? saleNum : 0}件
                </Text>
              </View>
            )}
          </View>
          <View className='bottom'>
            <View className='left-price'>
              <View className='top'>
                {resource === 'detail' && (
                  <Text className='fight-user'>
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
