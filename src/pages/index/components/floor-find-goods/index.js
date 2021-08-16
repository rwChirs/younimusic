// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

class FloorFindGoods extends Component {
  onToRecommendDetail = (info, index) => {
    this.props.onToRecommendDetail(info, index);
  };

  render() {
    const { data } = this.props;
    return (
      <View className='floor-find-goods'>
        <View className='floor-find-goods-top'>
          <Image
            className='icon'
            src={filterImg(
              '//m.360buyimg.com/img/jfs/t1/169171/11/11941/2563/6049ecc5E9b68a44b/13390a670021a7e1.png'
            )}
            lazyLoad
          />
          <Text className='title'>相似推荐</Text>
        </View>
        <View className='floor-find-goods-content'>
          <View className='poster-list'>
            {data && data.length > 0 && (
              <View className='poster-list-content'>
                {data.map((info, index) => (
                  <View
                    className='list'
                    key={index.toString()}
                    onClick={this.onToRecommendDetail.bind(this, info, index)}
                  >
                    <Image
                      key={index.toString()}
                      className='poster-img'
                      src={filterImg(info.imageUrl)}
                      mode='aspectFit'
                      lazyLoad
                    />
                    <View className='sku-name'>
                      <Text className='name'>{info.skuName}</Text>
                      <Text className='right-icon' />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default FloorFindGoods;
