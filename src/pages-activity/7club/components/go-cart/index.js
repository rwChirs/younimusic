import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class GoCart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleGoCart = () => {
    this.props.onGoCart();
  };

  render() {
    const { cartNum } = this.props;
    return (
      <View className='cart' onClick={this.handleGoCart}>
        {cartNum && (
          <View className='cart-txt'>{cartNum < 100 ? cartNum : '99+'}</View>
        )}
      </View>
    );
  }
}
