
import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API
import { View, Image } from '@tarojs/components';

import { filterImg } from '../../../utils/common/utils';
import { theme } from '../../../common/theme';
import utils from '../../login/util';
import './index.scss';

// import * as api from '../api';

export default class StallInfo extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    storeId: 0,
    skuId: 0,
    stallInfo: {
      items: [],
    },
    onAddCart: () => {},
    onGotoDetail: () => {},
  };

  goStallInfo = stallUrl => {
    console.log('-------------------------------------', stallUrl);

    const url = stallUrl;
    utils.navigateToH5({ page: url });
  };

  addCart = data => {
    const { skuId, buyNum, serviceTagId } = data;
    this.props.onAddCart({ skuId, buyNum, serviceTagId, from: 'stall', data });
  };

  goDetail = data => {
    this.props.onGotoDetail({ skuId: data.skuId, data });
  };

  render() {
    const { stallInfo } = this.props;
    const {
      items,
      slogan,
      stallAboutImgUrl,
      stallDetailUrl,
      // stallId,
      stallName,
    } = stallInfo;
    return (
      <View className='floors-stallInfo'>
        {!!stallInfo && (
          <View className='stallInfo'>
            <View className='stallInfo-header'>
              <View
                className='stallInfo-header-image'
                style={{
                  backgroundImage: `url(${filterImg(stallAboutImgUrl)})`,
                }}
              ></View>
              <View className='stallInfo-header-text'>
                <View className='stallInfo-header-title'>{stallName}</View>
                <View className='stallInfo-header-des'>{slogan}</View>
              </View>
              <View className='stallInfo-header-button'>
                <View
                  className='button'
                  onClick={this.goStallInfo.bind(this, stallDetailUrl)}
                >
                  进入档口
                </View>
              </View>
            </View>
            <View className='stallInfo-items'>
              {items &&
                items.length > 0 &&
                items.map((value, index) => {
                  const productInfo = { ...value, index: index + 1 };
                  return (
                    <View className='stallInfo-item' key={index}>
                      <Image
                        className='stallInfo-item-image'
                        src={filterImg(value.imageUrl)}
                        onClick={this.goDetail.bind(this, productInfo)}
                      />
                      <View className='stallInfo-item-name'>
                        {value.skuName}
                      </View>
                      <View className='stallInfo-item-price'>
                        ¥{value.jdPrice}
                      </View>
                      <View
                        className='stallInfo-item-addcart'
                        style={{
                          backgroundImage:
                            value.addCart === true
                              ? `url(${theme.addCartBtn})`
                              : `url(${theme.addDisableBtn})`,
                        }}
                        onClick={this.addCart.bind(this, productInfo)}
                      ></View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
    );
  }
}
