/* eslint-disable react/react-in-jsx-scope */

import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API
import { View, Text } from '@tarojs/components';

import './index.scss';

export default class Tab extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    tabs: [],
    currentTabId: 0,
  };

  changeTab = (id, className, e) => {
    e.stopPropagation();
    this.props.onChange(id, className);
  };

  render() {
    return (
      <View className='tabs'>
        {this.props.tabs.map((tab, index) => (
          // eslint-disable-next-line react/react-in-jsx-scope
          <View
            key={tab.id}
            className={`tab ${
              this.props.currentTabId === index ? 'active' : ''
            }`}
            onClick={this.changeTab.bind(this, index, tab.class)}
          >
            <Text className='tab-label'>{tab.name}</Text>
          </View>
        ))}
      </View>
    );
  }
}
