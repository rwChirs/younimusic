import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import FreshSeatAvatar from '../seat-avatar';
import FreshSeatItem from '../seat-item';
import FreshSeatItemList from '../seat-item-list';
import { filterDescription } from '../../../../utils/common/utils';
import './index.scss';

export default class FreshSeatContain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  scrollToLower = () => {
    this.props.onScrollToLower();
  };

  render() {
    const { list, current } = this.props;

    return (
      <View className='seat-content'>
        <ScrollView
          className='seat-content-list'
          scrollY
          scrollWithAnimation='true'
          lower-threshold={current.length !== 0 ? 170 : 50}
          onScrolltolower={this.scrollToLower.bind(this)}
          style={{ height: '100%' }}
        >
          <View
            className='seat-list'
            style={{ paddingBottom: current.length !== 0 ? '150rpx' : 0 }}
          >
            <FreshSeatItemList list={list} />
          </View>
        </ScrollView>
        {current.length !== 0 && (
          <View>
            <View className='seat-fixed-shadow' />
            <View className='seat-fixed'>
              <View className='seat-avatar'>
                <FreshSeatAvatar
                  text={current.title}
                  type={current.sort}
                  img={current.avatarUrl}
                />
              </View>
              <View className='seat-item'>
                <FreshSeatItem
                  piece={current.piece}
                  info={
                    current.piece
                      ? filterDescription(current.recommendText, 14)
                      : filterDescription(current.recommendText, 18)
                  }
                  type={current.type}
                  width={
                    current.width
                      ? `${current.width}px`
                      : `${Taro.pxTransform(538)}`
                  }
                />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
