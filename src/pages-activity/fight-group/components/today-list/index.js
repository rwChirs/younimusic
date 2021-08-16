import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, ScrollView } from '@tarojs/components';
import TodayProduct from './product';
import './index.scss';
//详情页-今日拼团列表
export default class TodayList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //刷新商品详情
  goDetail = info => {
    Taro.navigateTo({
      url:
        '/pages-a/fight-group/detail/index?activityId=' +
        info.activityId +
        '&storeId=' +
        info.storeId +
        '&skuId=' +
        info.skuId +
        '&grouponId=' +
        info.grouponId,
    });
  };

  scrollToLower = () => {
    this.props.onScrollToLower();
  };

  render() {
    const { list } = this.props;
    return (
      <ScrollView
        scrollX
        scrollWithAnimation='true'
        className='today-list-page'
        onScrolltolower={this.scrollToLower}
      >
        {list &&
          list.map((info, index) => {
            return (
              <View
                className='cont'
                key={index}
                onClick={this.goDetail.bind(this, info)}
              >
                <TodayProduct info={info} />
              </View>
            );
          })}
      </ScrollView>
    );
  }
}
