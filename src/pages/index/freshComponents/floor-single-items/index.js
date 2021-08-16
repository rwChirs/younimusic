// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import ProductItem from '../../../../components/product-item';
import './index.scss';

export default class FloorSingleItems extends Component {
  static defaultProps = {
    data: {
      backGroudColor: '#fff',
      items: [],
    },
  };

  onGoCardOrder = (val, index) => {
    const { onGoCardOrder } = this.props;
    onGoCardOrder &&
      onGoCardOrder({
        ...val,
        action: {
          target: 14,
          urlType: 'goCardOrder',
          skuId: val.skuId,
          index,
        },
      });
  };

  render() {
    const { onAddCart, onGoDetail, data, windowWidth } = this.props;
    const { backGroudColor, items } = data;
    return (
      <View className='FloorSingleItems'>
        <View
          className='FloorSingleItems-container'
          style={{
            backgroundColor: `${backGroudColor}`,
          }}
        >
          {items &&
            items.length > 0 &&
            items.map((val, i) => {
              return (
                <View
                  key={i}
                  className={`product-item-wrap ${i > 0 ? 'border' : ''}`}
                  taroKey={String(i)}
                >
                  <ProductItem
                    windowWidth={windowWidth}
                    type={1}
                    data={val}
                    onAddCart={onAddCart}
                    onGoDetail={onGoDetail}
                    onGoCardOrder={this.onGoCardOrder.bind(this, val, i + 1)}
                    style={{ marginRight: 7 + 'px', marginBottom: 7 + 'px' }}
                  />
                </View>
              );
            })}
        </View>
      </View>
    );
  }
}
