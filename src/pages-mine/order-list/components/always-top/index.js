import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class AlwaysTop extends Component {
  onGoAlways = () => {
    this.props.onGoAlways();
  };
  render() {
    const { title, desc, frequentPurchaseUrlList } = this.props;
    return (
      <View className='always' onClick={this.onGoAlways.bind(this)}>
        <Image
          className='rightIcon'
          src='https://m.360buyimg.com/img/jfs/t23101/167/1262572410/474/dece38f7/5b586a96Ndcea2b6d.png'
          mode='aspectFit'
          lazy-load
        />
        <View className='txtL'>{title}</View>
        <View className='txtS'>{desc}</View>
        {frequentPurchaseUrlList && frequentPurchaseUrlList.length > 0 && (
          <View className='sku-box'>
            {frequentPurchaseUrlList.map((item, i) => {
              return (
                item.skuImageUrl &&
                i < 4 && (
                  <Image
                    key={`${item.skuId}${i}`}
                    className='sku-img'
                    src={filterImg(item.skuImageUrl)}
                    mode='aspectFit'
                    lazy-load
                  />
                )
              );
            })}
          </View>
        )}
      </View>
    );
  }
}
