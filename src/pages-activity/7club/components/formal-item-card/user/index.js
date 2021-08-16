import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';
import { images, addHttps } from '../../../utils';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { author, bgColor, color, isShowDot, line } = this.props;
    return (
      <View className='user' style={{ color: color }}>
        <View
          className='avatar-wrapper'
          style={{
            backgroundColor: bgColor,
          }}
        >
          <Image
            className='avatar'
            mode='aspectFill'
            src={
              author && author.headIcon
                ? addHttps(author.headIcon)
                : images.userDefaultPicture
            }
          />
          {isShowDot && <View className='dot'></View>}
        </View>
        <Text className={line ? 'name oneLine' : 'name'}>
          {author.authorNickName || '美食达人'}
        </Text>
      </View>
    );
  }
}
