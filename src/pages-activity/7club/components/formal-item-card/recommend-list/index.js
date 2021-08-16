import Taro from '@tarojs/taro';
import { Component } from 'react';
import { ScrollView, View } from '@tarojs/components';
import './index.scss';
import RecommendItem from './recommend-item/index';

export default class RecommendList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      wareInfoList,
      onGoToProDetail,
      onAddCart,
      onFindSimiler,
      hasSimiler,
    } = this.props;
    return (
      <ScrollView
        scrollX
        scrollWithAnimation
        className='recommend-list'
        enableFlex
      >
        <View className='recommend-list-inner'>
          {wareInfoList &&
            wareInfoList.length &&
            wareInfoList.map((recommend, index) => (
              <RecommendItem
                data={recommend}
                key={index}
                onGoToProDetail={onGoToProDetail}
                onAddCart={onAddCart}
                isLast={index === wareInfoList.length - 1}
                onFindSimiler={onFindSimiler}
                hasSimiler={hasSimiler}
              />
            ))}
        </View>
      </ScrollView>
    );
  }
}
