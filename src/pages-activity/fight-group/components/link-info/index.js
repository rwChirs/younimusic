import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text } from '@tarojs/components';
import LazyLoadImage from '../../../../components/render-html/lazy-load-image';
import { filterDescription } from '../../../../utils/common/utils';
import './index.scss';

export default class LinkInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    list: [],
  };

  onClick = info => {
    this.props.onClick(info);
  };

  render() {
    const { list } = this.props;
    return (
      <View className='fight-link-page'>
        {list &&
          list.map((info, index) => {
            let grouponSign = '';
            if (
              (info && info.grouponSign && info.grouponSign === 1) ||
              info.grouponSign === 4
            ) {
              grouponSign = '邀新团';
            }
            let title = '';
            if (
              info &&
              info.grouponTitle &&
              info.grouponTitle.indexOf('】') > -1
            ) {
              title = info.grouponTitle.split('】')[1];
            } else {
              title = info.grouponTitle;
            }
            return (
              <View
                className='fight-link-product'
                id={`fight-like-product-${index}`}
                onClick={this.onClick.bind(this, info)}
                key={index}
              >
                <View className='fight-img'>
                  <LazyLoadImage width={153} src={info.image} />
                </View>
                <View className='fight-right'>
                  <View className='fight-title-a'>
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
                    {filterDescription(title, 12)}
                  </View>
                  {info.skuIntroduce && (
                    <View className='fight-desc'>{info.skuIntroduce}</View>
                  )}
                  <View className='fight-bottom'>
                    <View className='left-price'>
                      <View className='left-base'>
                        单买价
                        <Text className='txt'>
                          ¥{info.basePrice ? info.basePrice : 0.0}
                        </Text>
                      </View>
                      <View className='top'>
                        <Text className='fight-user'>
                          {info.memberCount ? info.memberCount : 0}人团
                        </Text>
                        <Text className='icon'>¥</Text>
                        <Text className='red'>
                          {info.grouponPrice ? info.grouponPrice : 0.0}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    );
  }
}
