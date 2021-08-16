// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import ProductItem from '../../../../components/product-item';
import ProductMore from '../product-more';
import './index.scss';

export default class FloorWrapProduct extends Component {
  static defaultProps = {
    data: {
      pictureAspect: 1,
      image: '',
      items: [],
      horizontalScrollIndicator: 1,
      moreAction: {},
      action: {},
    },
  };
  render() {
    const { data, onGoDetail, onAddCart, onGoToUrl, windowWidth } = this.props;
    const {
      pictureAspect,
      image,
      items,
      horizontalScrollIndicator,
      moreAction,
      action,
    } = data;
    const wrapStyle = {
      backgroundImage: `url(${image})`,
      height: windowWidth / pictureAspect + 'px',
    };
    if (horizontalScrollIndicator === 2 && items.length < 4) return null;
    if (horizontalScrollIndicator === 2) wrapStyle.paddingTop = '175px';
    return (
      <View
        className='floor-wrap-product'
        onClick={onGoToUrl.bind(this, action)}
        style={wrapStyle}
      >
        <View className='floor-wrap-bg' style={wrapStyle} />
        <View className='floor-wrap-goods'>
          {horizontalScrollIndicator === 1 ? (
            <View
              className='floor-wrap-type-one'
              style={{ width: windowWidth - 28 + 'px', marginLeft: '14px' }}
            >
              <ScrollView className='scroll-wrap' scrollX scrollWithAnimation>
                <View className='items-wrap'>
                  {items.map((val, i) => {
                    return (
                      <View key={i} className='product-item-wrap'>
                        <ProductItem
                          windowWidth={windowWidth}
                          taroKey={String(i)}
                          type={3}
                          data={val}
                          onGoDetail={onGoDetail}
                          onAddCart={onAddCart}
                        />
                      </View>
                    );
                  })}
                  {!!Number(moreAction.urlType) && (
                    <ProductMore onClick={onGoToUrl.bind(this, moreAction)} />
                  )}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View className='floor-wrap-type-two'>
              {items &&
                items
                  .filter((val, i) => {
                    return i < 4;
                  })
                  .map((val, i) => {
                    return (
                      <ProductItem
                        windowWidth={windowWidth}
                        key={i}
                        type={2}
                        data={val}
                        onGoDetail={onGoDetail}
                        onAddCart={onAddCart}
                        itemStyle={{
                          marginRight: 14 + 'px',
                          marginBottom: 14 + 'px',
                        }}
                      />
                    );
                  })}
            </View>
          )}
        </View>
      </View>
    );
  }
}
