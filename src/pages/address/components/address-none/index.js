// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

export default class AddressNone extends Component {
  static propTypes = {
    tip: PropTypes.string,
  };

  static defaultProps = {
    tip: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      nonePic:
        'https://m.360buyimg.com/img/jfs/t13402/135/846113130/4171/fe05b39e/5a14de9cNfbe14ffa.png',
    };
  }

  onClick = () => {
    this.props.onClick();
  };

  render() {
    const { nonePic } = this.state;

    return (
      <View className='address-none' onClick={this.onClick.bind(this)}>
        <Image src={nonePic} className='img' />
        <View className='title'>您还没有收货地址哦</View>
        <View className='btn'>新建地址</View>
      </View>
    );
  }
}
