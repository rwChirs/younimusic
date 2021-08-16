// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import ProductItem from '../../../../components/product-item';
import ProductMore from '../product-more';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorThemeProduct extends Component {
  static defaultProps = {
    data: {
      pictureAspect: 0,
      image: '',
      items: [],
      moreAction: [],
      horizontalScrollIndicator: 1,
      action: {},
    },
  };
  render() {
    const { onGoDetail, onAddCart, onGoToUrl, data, windowWidth } = this.props;
    const {
      pictureAspect,
      image,
      items,
      moreAction,
      horizontalScrollIndicator,
      action,
      dynamicLabels,
    } = data;
    const h = windowWidth / pictureAspect;
    const imgStyle = {
      height: h + 'px',
    };

    return (
      <View className='floor-theme-product lazy-load-img'>
        <Image
          src={filterImg(image)}
          style={imgStyle}
          className='floor-theme-img'
          onClick={onGoToUrl.bind(this, action)}
          lazyLoad
        />
        {dynamicLabels &&
          dynamicLabels.length > 0 &&
          dynamicLabels.map((v, k) => {
            const btnStyle = {
              minWidth: (v.endX - v.startX) * windowWidth + 'px',
              minHeight: (v.endY - v.startY) * h + 'px',
              left: v.startX * windowWidth + 'px',
              top: v.startY * h + 'px',
              backgroundColor: v.backgroundColor,
              color: v.textColor,
              fontSize: v.font + 'px',
              borderRadius:
                Math.max((v.endY - v.startY) * h, v.font) + 4 / 2 + 'px',
              padding: '2px 7px',
            };
            return (
              <View
                className='floor-notice-dynamic-area'
                style={btnStyle}
                key={k}
              >
                {v.text}
              </View>
            );
          })}
        <View
          className='floor-theme-goods'
          style={{
            marginTop: horizontalScrollIndicator === 1 ? '-30rpx' : '0rpx',
          }}
        >
          {horizontalScrollIndicator === 1 ? (
            <ScrollView
              scrollX
              scrollWithAnimation
              onScrollToLower={onGoToUrl.bind(this, moreAction)}
              lowerThreshold={20}
              className='type-one-wrap'
            >
              <View className='floor-theme-type-one'>
                {items.map((val, i) => {
                  return (
                    <View className='product-item-wrap' key={i}>
                      <ProductItem
                        windowWidth={windowWidth}
                        taroKey={String(i)}
                        type={3}
                        data={val}
                        onGoDetail={onGoDetail}
                        onAddCart={onAddCart}
                        itemStyle={{
                          borderRadius: i !== 0 ? 0 : '8px',
                          paddingTop: '10rpx',
                          paddingBottom: '10rpx',
                        }}
                      />
                    </View>
                  );
                })}
                {!!Number(moreAction && moreAction.urlType) && (
                  <ProductMore onClick={onGoToUrl.bind(this, moreAction)} />
                )}
              </View>
            </ScrollView>
          ) : (
            <View className='floor-theme-type-two'>
              {items.map((val, i) => {
                return (
                  <ProductItem
                    windowWidth={windowWidth}
                    key={i}
                    type={3}
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
