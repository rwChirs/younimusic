// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { positionPic } from './images';
import './index.css';

export default class AddressPosition extends Component {
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

  onGetPosition = () => {
    this.props.onGetPosition();
  };

  onChooseAddress = () => {
    this.props.onChooseAddress();
  };

  render() {
    const { position, styleColor } = this.props;

    return (
      <View className='address-position'>
        {/* <View className='title'>当前定位</View> */}
        <View className='position'>
          <View
            className='left'
            onClick={this.onClick.bind(this)}
            style={styleColor ? { color: '#898989' } : {}}
          >
            {position ? position : '获取位置超时，请重试'}
          </View>
          <View className='right' onClick={this.onGetPosition.bind(this)}>
            <Image src={positionPic} className='img' />
            重新定位
          </View>
        </View>
        {/* <View className='line' />
        <View className='position' onClick={this.onChooseAddress.bind(this)}>
          <View className='left' >
            附近地址
          </View>
          <View className='right'>
            <Image src={positionMore} className='imgMore' />
          </View>
        </View> */}
      </View>
    );
  }
}
