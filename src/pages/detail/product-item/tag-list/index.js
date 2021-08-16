import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text } from '@tarojs/components';
import './index.scss';

export default class TagList extends Component {
  render() {
    const { data, styleType, isFromPage } = this.props;
    if (!data) return null;
    return (
      <View className='tag-list'>
        {data.map((val, i) => {
          return !!val.promotionName ? (
            <View style={{ display: 'inline-block' }}>
              {isFromPage === 'recommend' ? (
                i < 2 ? (
                  <Text
                    className={`product-tag ${
                      styleType === 2 ? 'product-tag-old' : ''
                    }`}
                    style={{
                      marginRight: i === data.length - 1 ? 0 : 5 + 'px',
                    }}
                    taroKey={String(i)}
                  >
                    {val.promotionName}
                  </Text>
                ) : null
              ) : (
                <Text
                  className={`product-tag ${
                    styleType === 2 ? 'product-tag-old' : ''
                  }`}
                  style={{ marginRight: i === data.length - 1 ? 0 : 5 + 'px' }}
                  taroKey={String(i)}
                >
                  {val.promotionName}
                </Text>
              )}
            </View>
          ) : null;
        })}
      </View>
    );
  }
}
