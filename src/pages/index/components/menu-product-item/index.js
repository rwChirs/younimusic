// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class MenuProductItem extends Component {
  static defaultProps = {
    itemStyle: {},
    data: {},
  };
  goDetail = (ev) => {
    ev.stopPropagation();
    const { data, onGoDetail } = this.props;
    onGoDetail(data);
  };
  bindCollection = (ev) => {
    ev.stopPropagation();
    const { data, onCollect, index, type } = this.props;
    // if (!data.addCart) return;  //20201103去掉  问了腾龙是无用拦截
    onCollect({
      data,
      index: index,
      type,
    });
  };
  render() {
    const { data, itemStyle } = this.props;
    return (
      <View className='product-item' style={itemStyle} onClick={this.goDetail}>
        <View className='product-item-figture lazy-load-img'>
          <Image
            className='product-item-image'
            src={filterImg(data.image ? data.image : data.coverImg)}
            lazyLoad
            mode='aspectFill'
          />
        </View>
        <View className='product-item-desc'>
          <View className='product-item-title'>{data.title}</View>
          <View className='product-item-bottom'>
            <View className='product-item-bottom-left'>
              <Text className='clock-icon' />
              <Text className='unit'>{data.cookTime}</Text>
            </View>
            <View className='product-item-btn' onClick={this.bindCollection}>
              <View
                className={`collection-icon ${
                  data.ifCollect ? 'collected' : ''
                }`}
              />
              {data && data.collectCount && <Text>{data.collectCount}</Text>}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
