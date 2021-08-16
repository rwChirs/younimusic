// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';

import './index.scss';

export default class FloorHeader extends Component {
  static defaultProps = {
    data: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, onGoToUrl, firstTitle, secondTitle } = this.props;
    const action = data;
    return (
      <View className='floor-title'>
        <View className='title-left'>
          <Text className='name'>{firstTitle}</Text>
          <Text className='desc'>{secondTitle}</Text>
        </View>

        {action && action.toUrl && action.urlType && (
          <View className='title-right' onClick={onGoToUrl.bind(this, action)}>
            <View className='title-right-container'>
              <View className='more-text'>更多</View>
              <View className='more-icon' />
            </View>
          </View>
        )}
      </View>
    );
  }
}
