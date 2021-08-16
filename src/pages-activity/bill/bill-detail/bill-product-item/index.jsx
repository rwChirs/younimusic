import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

const SaleUnit = '¥';

class BillProductItem extends Component {
  static defaultProps = {
    data: {},
    className: '',
  };
  goDetail = (ev) => {
    const { data, onGoDetail } = this.props;
    ev.stopPropagation();
    onGoDetail(data);
  };
  addCart = (ev) => {
    const { data, onAddCart } = this.props;
    if (!data.addCart) return;
    ev.stopPropagation();
    onAddCart('', ev, '', data);
  };

  findSimiler = (data, e) => {
    e && e.stopPropagation();
    const { onFindSimiler } = this.props;
    onFindSimiler(data, 'product');
  };

  handlePromotion = (list) => {
    if (!list) return;
    const len = list.length;
    let i = 0;
    while (i < len) {
      if (list[i].promotionName) return list[i].promotionName;
      i++;
    }
    return false;
  };
  handlePromotionTypes = (list) => {
    if (list && list.promotionTypes) {
      // console.log(list.promotionTypes)

      let promotionTypesArr = [];
      list &&
        list.promotionTypes &&
        list.promotionTypes.length > 0 &&
        list.promotionTypes.map((val, i) => {
          console.log(i);
          if (val.promotionName && promotionTypesArr.length < 2) {
            promotionTypesArr.push(val.promotionName);
          }
        });
      // console.log(promotionTypesArr)
      return promotionTypesArr;
    }
  };
  render() {
    const { data, className } = this.props;
    const skuLabelEnum = [
      'store-prop-tag',
      'health-tag',
      'action-tag',
      'season-tag',
      'pre_title',
    ];
    return (
      <View className={`product-item ${className}`} onClick={this.goDetail}>
        <View
          className='product-item-figture'
          style={{
            opacity:
              (data.status == 5 && data.showPreIcon == false) ||
              data.status == 1
                ? 0.6
                : 1,
          }}
        >
          {/* 主图坑位打标 */}
          {data.skuLabelList && data.skuLabelList.length > 0 && (
            <View>
              {data.skuLabelList.map((item, index) => {
                return Number(item.type) !== 5 ? (
                  // 1-"温层"(左上) 2-"健康7"(下) 3-"买过"(右上) 4-"节令"(右上) 5-"商品标题前"
                  <Image
                    key={index.toString()}
                    className={skuLabelEnum[item.type - 1]}
                    alt='主图打标'
                    src={filterImg(item.labelItem && item.labelItem.imgUrl)}
                  />
                ) : null;
              })}
            </View>
          )}
          {((data.status == 5 && data.showPreIcon == false) ||
            data.status == 1) && (
            <View className='product-status-icon'>
              {data.status == 5 ? '今日售罄' : '已下架'}
            </View>
          )}
          {/* 预售标 */}
          {data.showPreIcon && <View className='presale-icon'></View>}

          {/* {this.handlePromotion(data.promotionTypes) && (
            <View className="product-tag">
              {" "}
              {this.handlePromotion(data.promotionTypes)}
            </View>
          )} */}
          <Image
            className='product-item-image'
            src={filterImg(data.imageUrl, 'product')}
            mode='aspectFill'
            lazyLoad
          />
        </View>
        <View className='product-item-desc'>
          <View className='product-item-title'>{data.skuName}</View>
          {data.av && <View className='product-item-ad'>{data.av}</View>}
          <View className='icon'>
            {data.materials && <View className='materials'>主材</View>}

            {this.handlePromotionTypes(data) &&
              this.handlePromotionTypes(data).map((val, i) => {
                return (
                  <View className='promotionalLabel' key={i}>
                    {val}
                  </View>
                );
              })}
          </View>

          <View className='bottom'>
            <View className='price-wrap'>
              <Text className='sale-unit'>{SaleUnit}</Text>
              <Text className='price'>{data.jdPrice || '暂无报价'}</Text>
              <Text className='unit'>{data.buyUnit}</Text>
            </View>
            {data.marketPrice && (
              <View className='product-item-market-price'>
                {data.marketPrice && (
                  <Text>
                    {SaleUnit}
                    {data.marketPrice}
                    {/* {data.buyUnit} */}
                  </Text>
                )}
              </View>
            )}

            {data.addCart ? (
              <View className='product-item-btn' onClick={this.addCart}>
                <View
                  className={`product-item-btn-bg ${
                    data.addCart ? '' : 'disabled'
                  }`}
                />
              </View>
            ) : (
              <View
                className='find-similer'
                onClick={this.findSimiler.bind(this, data)}
              >
                找相似
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default BillProductItem;
