import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import FreshSolitaireMoney from '../solitaire-money';
import FreshServiceCountDown from '../service-count-down';
import './index.scss';

export default class FreshPriceDescGroudon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onTimeEnd = () => {
    this.props.onTimeEnd();
  };

  render() {
    const {
      jdPrice,
      marketPrice,
      buyUnit,
      count,
      stock,
      dateTime,
      salesDesc,
      commissionInfo,
      canLeader,
    } = this.props;
    return (
      <View className='price-desc-groudon'>
        <View className='left'>
          <View className='left-top'>
            <View className='price'>
              <Text>￥</Text>
              {jdPrice}
              <Text>{buyUnit}</Text>
            </View>
            <Text className='count'>已接龙 {count} 件</Text>
          </View>
          {canLeader ? (
            <View className='left-bottom'>
              <Text className='original-price'>￥{marketPrice}</Text>
              <FreshSolitaireMoney
                commissionText={
                  commissionInfo && commissionInfo.commissionText
                    ? commissionInfo.commissionText
                    : '约赚'
                }
                commission={
                  commissionInfo && commissionInfo.commission
                    ? commissionInfo.commission
                    : '0.0'
                }
              />
            </View>
          ) : (
            <View className='jd-price'>￥{marketPrice}</View>
          )}
        </View>
        <View className='right'>
          {stock && stock <= 10 ? (
            <View>
              <View className='txt'>剩余库存</View>
              <View className='right-number'>
                {stock}
                {salesDesc || '件'}
              </View>
            </View>
          ) : (
            <View>
              <View className='txt'>距离结束剩余</View>
              <View className='right-time'>
                <FreshServiceCountDown
                  seconds={dateTime / 1000}
                  width='24px'
                  height='22px'
                  fontSize='13px'
                  color='#fff'
                  background='rgb(166, 29, 28)'
                  borderRadius='6px'
                  splitColor='rgb(166, 29, 28)'
                  splitFontWeight='normal'
                  splitSpace='3px'
                  onTimeEnd={this.onTimeEnd.bind(this)}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
