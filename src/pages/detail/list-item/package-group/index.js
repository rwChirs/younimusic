import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Image, Text } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';

import './index.scss';

export default class PackageGroup extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    showPrice: false,
    data: [],
  };

  onChange = id => {
    this.props.onChange(id);
  };

  render() {
    const { data, showPrice } = this.props;
    return (
      <View className='package-group'>
        {data.map((item, index) => (
          <View
            className='package'
            key={index}
            onClick={this.onChange.bind(this, item.id)}
          >
            <View
              className='product'
              style={data.length === index + 1 ? `border-right-width: 0` : ``}
            >
              {item &&
                item.poolList &&
                item.poolList.map((pro, k) => {
                  return (
                    <Image
                      key={k}
                      className='image'
                      src={
                        pro.imageUrl
                          ? filterImg(pro.imageUrl)
                          : pro &&
                            pro.imageInfoList &&
                            pro.imageInfoList.length > 0 &&
                            pro.imageInfoList[0].imageUrl
                      }
                    />
                  );
                })}
              <Text className='total'>{item.showText}</Text>
            </View>
            {showPrice && (
              <View className='price'>
                <Text className='jd-price'>{`￥${item.jdPrice}`}</Text>
                <Text className='unit'>{item.buyUnit}</Text>
                {item.baseSuitDiscount && item.baseSuitDiscount > 0 && (
                  <Text className='save'>{`省${item.baseSuitDiscount}元`}</Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }
}
