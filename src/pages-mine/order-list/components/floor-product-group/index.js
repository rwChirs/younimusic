import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import FreshProductItem from '../../../../components/product-item';
import { px2vw } from '../../../../utils/common/utils';
import { getExposure } from '../../../../utils/common/exportPoint';
import './index.scss';

const handleType = type => {
  switch (type) {
    case 1:
      return 'type-one';
    case 2:
      return 'type-two';
    case 3:
      return 'type-three';
    default:
      return 'type-three';
  }
};

export default class FloorProductGroup extends Component {
  componentDidMount() {
    // 曝光埋点方法执行
    setTimeout(()=>{
      this.skuExposure();
    },300)
  }

  // 商品曝光
  skuExposure = () => {
    const { orderListTab, tabList, data } = this.props;
    const { items, from, tenantId } = data;
    items &&
      items.length > 0 &&
      items.map((item, i) => {
        const targetDom = `#order-recommend-${i}`;
        const intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        intersectionObserver
          .relativeToViewport({ bottom: -50 })
          .observe(targetDom, () => {
            let params = {};
            // 详情页为你推荐
            if (from === 'detail') {
              params = {
                router: getCurrentInstance().router,
                eid: 'OrderList_recommendSku',
                eparam: {
                  pageId: '0024',
                  pageName: '订单详情页',
                  orderId: item.orderId,
                  skuId: item.skuId,
                  skuName: item.skuName,
                  skuSequence: i,
                  ela: {
                    pageId: '0024',
                    pageName: '订单详情页',
                    orderId: item.orderId,
                    skuId: item.skuId,
                    skuName: item.skuName,
                  },
                  storeId: item.storeId,
                  tenantId: tenantId,
                  platformId: 1,
                  superiorPageId: '0023',
                  superiorPageName: '我的订单页',
                },
              };
            } else {
              // 列表页为你推荐
              params = {
                router: getCurrentInstance().router,
                eid: 'OrderList_recommendSku',
                eparam: {
                  pageId: '0023',
                  pageName: '我的订单页',
                  orderTabName: tabList[orderListTab],
                  skuId: item.skuId,
                  skuName: item.skuName,
                  skuSequence: i + 1,
                  ela: {
                    pageId: '0023',
                    pageName: '我的订单页',
                    orderTabName: tabList[orderListTab],
                    skuId: item.skuId,
                    skuName: item.skuName,
                  },
                  storeId: item.storeId,
                  tenantId: tenantId,
                  platformId: 1,
                  superiorPageId: '0022',
                  superiorPageName: '个人中心',
                },
              };
            }
            getExposure(params);
            intersectionObserver.disconnect();
          });
      });
  };
  onGoDetail = data => {
    this.props.onGoDetail(data);
  };

  onAddCart = (ev, data) => {
    this.props.onAddCart(ev, data);
  };

  render() {
    const {
      addType,
      data,
      lazyloadScrollContainer,
      useLazyload,
      isFromPage,
    } = this.props;
    let type = 2,
      items = [],
      backGroudColor = 'transparent';
    if (data && data.items) {
      type = data.type;
      items = data.items;
      backGroudColor = data.items;
    }
    const radiusstyle = data && data.autoFold === 1 ? 'btn' : 'noBtn';
    return (
      <View
        className={`floor-product-group floor-wrap-${handleType(type)}`}
        style={{
          background: backGroudColor || '#fff',
          paddingBottom: type === 1 ? px2vw(20) : px2vw(10),
        }}
      >
        <View
          className='floor-product-group-inner'
          style={{ flexDirection: type === 1 ? 'column' : 'row' }}
        >
          {items &&
            items.map((info, i) => {
              const productItem = { ...info, index: i + 1 };
              return (
                <View
                  className={`product-group-info-wrap ${radiusstyle}`}
                  key={`${String(i)}${info.skuId}`}
                  id={`order-recommend-${i}`}
                >
                  <View className='product-group-info'>
                    <FreshProductItem
                      style={{ width: '100%' }}
                      type={type}
                      addType={addType}
                      data={productItem}
                      onGoDetail={this.onGoDetail.bind(this, productItem)}
                      onAddCart={this.onAddCart.bind(this, productItem)}
                      highLightAd={type === 1 && data.highLightAd === 1}
                      lazyloadScrollContainer={lazyloadScrollContainer}
                      useLazyload={useLazyload}
                      isFromPage={isFromPage}
                      isShowMarketPrice
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    );
  }
}
