import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import FormalTitle from '../formal-title/index';
// import FloorSingleItems from '../../../../pages/index/floor-single-items';

export default class AboutProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //一键加车
  handleAddCartAll = () => {
    console.log('一键加车');
    const { data, onAddCart } = this.props;
    let wareInfoList = [];
    data &&
      data.length > 0 &&
      data.map(val => {
        if (val.addCart) {
          let selectedTasteInfoIds = {};
          val.attrInfoList &&
            val.attrInfoList.forEach(item1 => {
              let id = [];
              item1.attrItemList.forEach(item2 => {
                if (item2.selected) {
                  id.push(item2.id);
                }
              });
              if (id.length > 0) {
                selectedTasteInfoIds[item1.tplId] = id;
              }
            });
          wareInfoList.push({
            skuId: val.skuId,
            skuName: val.skuName,
            serviceTagId: 0,
            buyNum: 1,
            selectedTasteInfoIds,
          });
        }
      });
    onAddCart(wareInfoList);
  };

  render() {
    const { onAddCart, onGoDetail, data } = this.props;
    const canAddCartList =
      Array.isArray(data) && data.filter(val => val.addCart === true);
    return (
      <View className='about-products'>
        <View className='title-box'>
          <FormalTitle
            text='提到的商品'
            fontSize={32}
            fontWeight={400}
            padding='30rpx 0 34rpx 0'
          />
          {canAddCartList && canAddCartList.length > 0 && (
            <View className='add-all_btn' onClick={this.handleAddCartAll}>
              一键买齐
            </View>
          )}
        </View>
        {/* <FloorSingleItems
          data={{
            items: data,
          }}
          onAddCart={onAddCart}
          onGoDetail={onGoDetail}
        /> */}
      </View>
    );
  }
}
