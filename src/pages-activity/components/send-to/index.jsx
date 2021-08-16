import Taro from '@tarojs/taro';
import {Component} from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class SentTo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    type: '',
  };

  static propTypes = {};

  render() {
    const { type, text, onClick } = this.props;

    return type === 'solitaire' ? (
      <View className='sentTo solitaire-sendTo'>
        <View className='contain'>
          <Text className='title solitaire-title'>送至</Text>
          <Text className='addressInfo solitaire-info' onClick={onClick}>
            {text}
          </Text>
          <Text className='addressImg' onClick={onClick} />
        </View>
      </View>
    ) : (
      <View className='sentTo'>
        <View className='contain'>
          <Text className='title'>送至</Text>
          <Text className='addressInfo' onClick={onClick}>
            {text}
          </Text>
          <Text className='addressImg' onClick={onClick} />
        </View>
      </View>
    );
  }
}
