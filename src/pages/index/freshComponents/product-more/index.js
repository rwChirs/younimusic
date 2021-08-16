// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

class ProductMore extends Component {
  static defaultProps = {
    onClick: () => {},
  };
  render() {
    const { styleObj, onClick } = this.props;
    return (
      <View className='product-more' style={styleObj} onClick={onClick}>
        <View className='product-more-text'>
          <View>查</View>
          <View>看</View>
          <View>更</View>
          <View>多</View>
        </View>
        <View className='icon icon-arrow-right-white' />
      </View>
    );
  }
}

export default ProductMore;
