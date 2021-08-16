// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import { dingPic } from './images';
import './index.scss';

export default class AddressTo extends Component {
  static propTypes = {
    tip: PropTypes.string,
  };
  static defaultProps = {
    tip: '',
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    this.props.onClick();
  };

  render() {
    const { tip } = this.props;

    return (
      <View className='adress-to'>
        <View className='adress-tip-zhanwei'></View>
        <View className='adress-tip'>
          <View className='adress-tip-top'>
            <Image
              src={dingPic}
              alt='七鲜'
              className='dingPic'
              onClick={this.onClick.bind(this)}
            />
            <Text className='tip'>{tip}</Text>
          </View>
          <View className='desc'>收货地址不同，店铺不同</View>
        </View>
      </View>
    );
  }
}
