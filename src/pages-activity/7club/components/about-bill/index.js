import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import FormalTitle from '../formal-title/index';

import './index.scss';

export default class AboutBill extends Component {
  constructor(props) {
    super(props);
  }

  handleGoBillDetail = item => {
    this.props.onGoBillDetail(item);
  };
  render() {
    const { data } = this.props;
    return (
      <View>
        <FormalTitle
          text='相关菜谱'
          fontSize={32}
          fontWeight={400}
          padding='30rpx 0 34rpx 0'
        />
        <ScrollView scrollX scrollWithAnimation className='bill-list'>
          {data &&
            data.length &&
            data.map((item, index) => (
              <View
                className='bill-item'
                key={index}
                onClick={this.handleGoBillDetail.bind(this, item)}
              >
                <Image
                  src={filterImg(item.coverImg)}
                  mode='aspectFill'
                  className='img'
                />
                <View className='title'>{item.title}</View>
              </View>
            ))}
        </ScrollView>
      </View>
    );
  }
}
