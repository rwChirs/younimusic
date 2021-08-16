import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class RelationItems extends Component {
  goDetail = (args, ev) => {
    ev && ev.stopPropagation();
    const { onGoDetail } = this.props;
    onGoDetail(args);
  };
  addCart = (args, ev) => {
    ev && ev.stopPropagation();
    if (args.status !== 2) {
      return;
    }
    const { onAddCart } = this.props;
    onAddCart(args);
  };

  render() {
    const { wareInfoList } = this.props;
    return (
      <View className='goods-container'>
        <ScrollView className='scroll-wrap' scrollX scrollWithAnimation>
          <View className='goods-list'>
            {wareInfoList &&
              wareInfoList.length > 0 &&
              wareInfoList.map((val, i) => {
                return (
                  <View
                    key={i.toString()}
                    className='goods-wrap'
                    onClick={this.goDetail.bind(this, val.skuId)}
                  >
                    <View className='img-container'>
                      <Image
                        className={`img ${
                          val.status !== 2 ? 'status-icon' : ''
                        }`}
                        style={{
                          opacity: val.status !== 2 ? '0.6' : '1',
                        }}
                        src={filterImg(val.imageUrl)}
                        alt={val.skuShortName}
                      />
                      {val.status !== 2 && (
                        <View className='status-icon'>无货</View>
                      )}
                    </View>
                    <View className='goods-info'>
                      <View className='goods-name'>{val.skuShortName}</View>
                      <View className='goods-price'>
                        ¥{val.jdPrice || '暂无报价'}
                      </View>
                    </View>
                    <View
                      className='goods-button'
                      onClick={this.addCart.bind(this, val)}
                    >
                      <View
                        className={`button ${
                          val.status !== 2 ? 'disable' : ''
                        }`}
                      />
                    </View>
                  </View>
                );
              })}
            {/*<View className='goods-wrap'>*/}
            {/*<Image className='img' src='' alt='' />*/}
            {/*<View className='goods-info'>*/}
            {/*<View className='goods-name'>商品名称商品名称</View>*/}
            {/*<View className='goods-price'>¥9.8</View>*/}
            {/*</View>*/}
            {/*<View className='goods-button'>*/}
            {/*<View className='button'></View>*/}
            {/*</View>*/}
            {/*</View>*/}
          </View>
        </ScrollView>
      </View>
    );
  }
}
