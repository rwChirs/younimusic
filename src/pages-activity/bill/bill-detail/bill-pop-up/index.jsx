import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import BillProductItem from '../bill-product-item';
import ShoppingCart from '../shopping-cart';
import { px2vw } from '../../../../utils/common/utils';

import './index.scss';

export default class BillPopup extends Component {
  static defaultProps = {
    show: false,
    title: '',
    height: 200,
    data: [],
    failData: [],
    type: '',
    selected: '',
    icon: '',
    keyVal: '',
  };

  constructor(props) {
    super(props);
  }

  close = (e) => {
    e && e.stopPropagation();
    this.props.onClose(this.props);
    return false;
  };

  touchMove = (e) => {
    e && e.stopPropagation();
  };

  onAddCart = (num, type, billproductitem, data) => {
    this.props.onAddCart(num, type, billproductitem, data);
  };

  onClick = (current, e) => {
    e && e.stopPropagation();
    this.props.onPopupClick(current);
  };

  onProductClick = (current, e) => {
    e && e.stopPropagation();
    this.props.onPopupClick(current);
  };

  onGotoCart = (e) => {
    e && e.stopPropagation();
    this.props.onGotoCart();
  };
  onGoDetail = (data, e, billproductitem) => {
    e && e.stopPropagation();
    this.props.onGoDetail(data, e, billproductitem);
  };
  onAllAddCart = (e) => {
    e && e.stopPropagation();
    this.props.onAllAddCart();
  };

  findSimiler = (item) => {
    // e && e.stopPropagation();
    this.props.onFindSimiler(item, 'modal');
  };

  render() {
    const { title, height, show, data, type, num, isUseable } = this.props;
    const isBillIngredients = type === 'ingredients';
    const len = (data && data.length) || 0;
    return (
      <View>
        <View
          className={
            show ? `popup-mask popup-mask-show popup-mask-anim` : `popup-mask`
          }
          onClick={this.close}
          onTouchMove={this.touchMove}
        />

        {isBillIngredients && (
          <View
            className={
              show
                ? `popup-container popup-container-anim popup-container-show`
                : `popup-container popup-container-anim`
            }
            // style={len > 3 ? `height: ${height}px` : `height: ${height}px`}
            style={{ height: len > 2 ? `${height}px` : px2vw(238 * (len + 1)) }}
          >
            <View className='popup-header' onTouchMove={this.touchMove}>
              <View>
                <Text className='popup-type'>{title}</Text>
                <Text className='popup-unit'>共{data.length}个</Text>
              </View>
              <View className='popup-close' onClick={this.close} />
            </View>

            <View
              className='popup-contents bill-popup-contents'
              // style={`height: ${height - 100}px`}
              style={{
                height:
                  len > 2 ? `${height - 100}px` : px2vw(238 * (len + 1) - 100),
              }}
            >
              {data &&
                data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <View className='bill-content' key={index}>
                      <BillProductItem
                        data={item}
                        onGoDetail={this.onGoDetail.bind(
                          this,
                          item,
                          '',
                          'billproductitem'
                        )}
                        onAddCart={this.onAddCart.bind(
                          this,
                          num,
                          type,
                          'billproductitem',
                          item
                        )}
                        onFindSimiler={this.findSimiler}
                      />
                    </View>
                  );
                })}
              <View className='bill-block'></View>
            </View>
            <View className='popup-cart'>
              <ShoppingCart
                clickType={2}
                num={num}
                isUseable={isUseable}
                onGotoCart={this.onGotoCart}
                onAllAddCart={this.onAllAddCart}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}
