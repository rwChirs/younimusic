import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import FormalTitle from '../formal-title/index';
import EvaluationItem from './evaluation-item/index';

export default class RecommendEvaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onGoDetail, data } = this.props;
    return (
      <View>
        <FormalTitle
          text='热门推荐'
          fontSize={32}
          fontWeight={400}
          padding='30rpx 0 34rpx 0'
        />
        <View className='evaluation-list'>
          {data &&
            data.length > 0 &&
            data.map((item, index) => (
              <EvaluationItem key={index} data={item} onGoDetail={onGoDetail} />
            ))}
        </View>
      </View>
    );
  }
}
