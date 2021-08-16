import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from '@tarojs/components';
import './index.scss';

export default class TeamIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['全部', '进行中', '成功', '失败'],
    };
  }

  static defaultProps = {
    list: [],
    selected: 0,
  };

  onClick = index => {
    this.props.onClick(index);
  };

  render() {
    return (
      <View className='tab-bar'>
        {this.state.list.map((info, index) => {
          return (
            <View
              key={index}
              className={
                this.props.selected == index ? `tab-name current` : `tab-name`
              }
              onClick={this.onClick.bind(this, index)}
            >
              {info}
              {this.props.selected == index && (
                <View
                  className='current-line'
                  style={{ width: index === 1 ? '39px' : '26px' }}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  }
}
