import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class ItemsModal extends Component {
  componentDidMount() {
    this.isAllNoStock();
  }

  closeItemsModal = () => {
    const { onClose } = this.props;
    onClose && typeof onClose === 'function' && onClose();
  };

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
  addCartAll = (args, ev) => {
    ev && ev.stopPropagation();
    const { onAddCartAll } = this.props;
    onAddCartAll(args);
  };

  isAllNoStock = () => {
    const { wareInfoList } = this.props;
    let isAllNoStock = true;
    for (let i = 0; i < wareInfoList.length; i++) {
      if (wareInfoList[i].status === 2) {
        isAllNoStock = false;
        break;
      }
    }
    this.setState({
      isAllNoStock,
    });
  };

  render() {
    const { wareInfoList } = this.props;
    const { isAllNoStock } = this.state;
    return (
      <View>
        <View
          className='modal-layer'
          onClick={this.closeItemsModal.bind(this)}
        />
        <View className='container'>
          <View className='title'>
            提到的商品
            <View className='close' onClick={this.closeItemsModal.bind(this)} />
          </View>
          <View className='list'>
            <View className='items-container'>
              {wareInfoList &&
                wareInfoList.length > 0 &&
                wareInfoList.map((val, i) => {
                  return (
                    <View
                      key={i.toString()}
                      className='items-main'
                      onClick={this.goDetail.bind(this, val.skuId)}
                    >
                      <View className='img-container'>
                        <Image
                          className={`img ${
                            val.status !== 2 ? 'no-stock' : ''
                          }`}
                          src={filterImg(val.imageUrl)}
                        />
                        {val.status !== 2 && (
                          <View className='status-icon'>无货</View>
                        )}
                      </View>

                      <View className='items-info'>
                        <View className='items-name'>{val.skuShortName}</View>
                        {val.av && <View className='items-ad'>{val.av}</View>}
                        {val.promotionTypes && val.promotionTypes.length > 0 && (
                          <View className='items-promotions'>
                            {val.promotionTypes.map((value, k) => {
                              return k <= 1 ? (
                                <View
                                  key={k.toString()}
                                  className='items-promotion'
                                  style={{
                                    display: value.promotionName
                                      ? 'block'
                                      : 'none',
                                  }}
                                >
                                  {value.promotionName}
                                </View>
                              ) : (
                                ''
                              );
                            })}
                          </View>
                        )}
                        <View className='items-price'>
                          <View className='price'>¥{val.jdPrice}</View>
                          <View className='unit'>{val.buyUnit}</View>
                        </View>
                      </View>
                      <View
                        className={`add-cart-btn ${
                          val.status !== 2 ? 'disable' : ''
                        }`}
                        onClick={this.addCart.bind(this, val)}
                      />
                    </View>
                  );
                })}

              {/*<View className='items-main'>*/}
              {/*<Image className='img' src='' />*/}
              {/*<View className='items-info'>*/}
              {/*<View className='items-name'>*/}
              {/*京觅·优选 山东栖霞苹果京觅·优选 山东栖霞苹果*/}
              {/*</View>*/}
              {/*<View className='items-ad'>*/}
              {/*富含丰富维生素Z0 顶级食材就在*/}
              {/*</View>*/}
              {/*<View className='items-promotion'>满100减10</View>*/}
              {/*<View className='items-price'>*/}
              {/*<View className='price'>¥99.9</View>*/}
              {/*<View className='unit'>/个</View>*/}
              {/*</View>*/}
              {/*</View>*/}
              {/*<View className='add-cart-btn'></View>*/}
              {/*</View>*/}
            </View>
          </View>
          <View
            className={`all-add-cart-btn ${
              isAllNoStock === true ? 'disable' : ''
            }`}
            onClick={this.addCartAll.bind(this, wareInfoList)}
          >
            一键全部加购
          </View>
        </View>
      </View>
    );
  }
}
