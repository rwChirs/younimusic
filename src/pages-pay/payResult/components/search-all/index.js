import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
// import FreshComponent from '../../common/component'
import './index.scss';

export default class FreshSearchAll extends Component {
  onClick = (e) => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    const { text } = this.props;

    return (
      <View className='search-all' onClick={this.onClick}>
        <View className='search-word'>{text}</View>
        <Image
          className='search-icon'
          src='https://m.360buyimg.com/img/jfs/t1/23602/36/4601/1718/5c34564cE490b8c18/7035e3b7a41c1f33.png'
          mode='aspectFit'
          lazyLoad
        />
      </View>
    );
  }
}
FreshSearchAll.defaultProps = {
  text: '',
};

FreshSearchAll.propTypes = {
  text: PropTypes.string,
};
