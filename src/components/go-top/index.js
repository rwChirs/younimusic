import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default class GoTop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goHome:
        'https://m.360buyimg.com/img/jfs/t1/29552/24/14337/4135/5ca56cedE042ca4eb/d1d4a1ee25cc3ad7.png',
    };
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    const { title, type } = this.props;
    return (
      <View className='go-top-component' onClick={this.onClick}>
        {type == 'top' ? (
          <View className='go-top-content'>
            <Text className='icon' />
            <Text className='go-top-title'>顶部</Text>
          </View>
        ) : type == 'home' ? (
          <Image className='go-top-icon' src={this.state.goHome} />
        ) : (
          <Text className='go-top-title'>{title}</Text>
        )}
      </View>
    );
  }
}
