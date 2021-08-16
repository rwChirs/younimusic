import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import OrderEmptyModal from '../order-empty-modal';
import './index.scss';

export default class OrderPriceTipsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, onClose } = this.props;
    return (
      data && (
        <View className='price-box'>
          {data && data.moneyRemarkInfo && (
            <OrderEmptyModal
              show
              title={data.moneyRemarkInfo.title}
              onClose={onClose}
            >
              {data && data.type === 1 && (
                <View className='con-txt'>{data.moneyRemarkInfo.content}</View>
              )}
              {data &&
                data.type === 2 &&
                data.moneyRemarkInfo &&
                data.moneyRemarkInfo.remarkDetailInfoList &&
                data.moneyRemarkInfo.remarkDetailInfoList.length > 0 && (
                  <View className='list-box'>
                    {data.moneyRemarkInfo.remarkDetailInfoList.map(
                      (info, i) => {
                        return (
                          <View className='list' key={i.toString()}>
                            <View>{info.name}</View>
                            <View>{info.content}</View>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}
            </OrderEmptyModal>
          )}
        </View>
      )
    );
  }
}
