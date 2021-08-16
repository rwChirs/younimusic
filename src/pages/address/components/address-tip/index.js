// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import { dingPic, closePic } from './images';
import './index.css';

export default class AddressTip extends Component {
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
      <View className='yellow-tip'>
        <Image src={dingPic} alt='七鲜' className='dingPic' />
        <Text className='tip'>{tip}</Text>
        <Image
          src={closePic}
          alt='七鲜'
          className='closePic'
          onClick={this.onClick.bind(this)}
        />
      </View>
    );
  }
}
