import Taro from '@tarojs/taro';
import React, { Component } from 'react'; // Component 是来自于 React 的 API
import { View, Text } from '@tarojs/components';
import FreshWarmPrompt from '../../../components/FreshWarmPrompt';

import './index.scss';

export default class ProductAdvanceSale extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    time: 0,
    preSaleInfo: {},
    productDetail: {},
  };

  // onGetValue() {
  //   this.props.onGetValue();
  // }

  onQuestion = () => {
    this.props.onPopup();
  };

  checkTime = (i) => {
    //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  };
  timeFormat = (timestamp) => {
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    let time = new Date(timestamp);
    // let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    // let seconds = time.getSeconds();
    return (
      // year + '-' +
      this.checkTime(month) +
      '月' +
      this.checkTime(date) +
      '日' +
      ' ' +
      this.checkTime(hours) +
      ':' +
      this.checkTime(minutes)
      // +':' +checkTime(seconds)
    );
  };

  render() {
    const { preSaleInfo, productDetail, time } = this.props;
    // console.log(
    //   '---------------------------------------------',
    //   preSaleInfo,
    //   productDetail,
    //   time
    // );

    let isShow =
      productDetail &&
      !productDetail.isPeriod &&
      preSaleInfo &&
      preSaleInfo.type === 2 &&
      preSaleInfo.status !== null
        ? true
        : false;

    return (
      <View style='backgrond: #fff'>
        {isShow && (
          <View className='advance-sale'>
            {/* onClick={this.onGetValue.bind(this)} */}
            <View className='info'>
              <View className='preview-price'>
                <Text className='text'>
                  {preSaleInfo &&
                  (preSaleInfo.status === 2 || preSaleInfo.status === 3)
                    ? '预售价:'
                    : preSaleInfo && preSaleInfo.status === 1
                    ? '预告价:'
                    : ''}
                </Text>
                <Text className='symbol'>¥</Text>
                {preSaleInfo && preSaleInfo.price !== null && (
                  <Text className='num'>{preSaleInfo.price}</Text>
                )}
                {preSaleInfo && preSaleInfo.buyUnit && (
                  <Text className='buyUnit'>{preSaleInfo.buyUnit}</Text>
                )}
                {productDetail.toasts && (
                  <View className='question' onClick={this.onQuestion} />
                )}
              </View>
              <View className='original-price'>
                <Text className='text'>原价:</Text>
                {preSaleInfo && productDetail.jdPrice !== null && (
                  <Text className='num'>¥{productDetail.jdPrice}</Text>
                )}
              </View>
            </View>
            <View className='timer'>
              <View className='describe'>
                {preSaleInfo &&
                (preSaleInfo.status === 2 || preSaleInfo.status === 3)
                  ? '距结束剩余'
                  : preSaleInfo && preSaleInfo.status === 1
                  ? preSaleInfo.waitStartTime > 86400000
                    ? '开始时间'
                    : '距开始剩余'
                  : ''}
              </View>
              {preSaleInfo &&
                (preSaleInfo.status === 3 ||
                  preSaleInfo.status === 2 ||
                  (preSaleInfo.status === 1 &&
                    preSaleInfo.waitStartTime < 86400000)) &&
                time && (
                  <View className='timer-info'>
                    {time.day > 0 && (
                      <Text className='day-num'>{time.day}天</Text>
                    )}
                    <View className='count-down'>
                      <Text className='time hour'>{time.hour}</Text>
                      <Text className='yinhao'>:</Text>
                      <Text className='time minute'>{time.minute}</Text>
                      <Text className='yinhao'>:</Text>
                      <Text className='time second'>{time.second}</Text>
                    </View>
                  </View>
                )}
              {preSaleInfo &&
                preSaleInfo.status === 1 &&
                preSaleInfo.waitStartTime > 86400000 && (
                  <View className='start-time'>
                    {/* {this.timeFormat(preSaleInfo.startTime)} */}
                    {preSaleInfo.startTimeString}
                  </View>
                )}
            </View>
          </View>
        )}

      </View>
    );
  }
}
