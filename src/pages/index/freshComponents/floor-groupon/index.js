// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import GrouponItem from '../../components/groupon-item';
import './index.scss';

export default class FloorGroupon extends Component {
  static defaultProps = {
    data: {},
  };

  constructor(props) {
    super(props);
  }

  onShowMore() {
    if (this.props.data.action) {
      this.props.onGoToUrl(this.props.data.action);
    }
  }

  onGoDetail(info) {
    this.props.onGoToDetail(info);
  }

  onClick(info) {
    this.props.onClick(info);
  }

  render() {
    const {
      firstTitle = '',
      secondTitle = '',
      items = [],
      backGroudColor,
      image,
    } = this.props.data;
    return items && items.length > 0 ? (
      <View
        className='floor-groupon'
        style={{
          background: image ? `url(${image}) top center no-repeat` : 'none',
          backgroundColor: backGroudColor ? backGroudColor : 'none',
        }}
      >
        <View className='title'>
          <View className='name'>{firstTitle}</View>
          <View className='desc'>{secondTitle}</View>
          <View className='more' onClick={this.onShowMore.bind(this)}>
            <Text>更多</Text>
            <View className='right-icon' />
          </View>
        </View>
        <View>
          {items.map((item) => {
            return (
              <GrouponItem
                info={item}
                key={item.skuId}
                onGoDetail={this.onGoDetail.bind(this)}
                onClick={this.onClick.bind(this)}
              />
            );
          })}
        </View>
      </View>
    ) : null;
  }
}
