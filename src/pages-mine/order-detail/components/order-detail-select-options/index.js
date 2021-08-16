import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class OrderDetailSelectOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, onSelect, onClose } = this.props;
    return (
      <View className='after-sales-select'>
        <View className='afterSale-select'>
          <View className='afterSale-select-title'>
            <View>选择售后类型</View>
            <View className='close' onClick={onClose} />
          </View>
          <View className='box'>
            {data &&
              data.map((item, i) => {
                return (
                  <View
                    className='afterSale-select-option'
                    key={i.toString()}
                    onClick={onSelect.bind(this, item.serviceType)}
                  >
                    <View>{item.serviceTypeName}</View>
                  </View>
                );
              })}
          </View>
        </View>
      </View>
    );
  }
}
