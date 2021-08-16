import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
import { userDefaultPicture } from '../../utils/images';
// import { transformTime } from '../../utils/filter';
import './index.scss';

export default class GoTeamEasy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    info: {},
  };

  componentWillMount() {}

  onClick = info => {
    this.props.onClick(info);
  };

  render() {
    let { info } = this.props;
    return (
      <View className='go-fight-page'>
        <Image
          src={
            info.memberInfo.avatar ? info.memberInfo.avatar : userDefaultPicture
          }
          mode='aspectFit'
          className='user-img'
        />
        <View className='right-content'>
          <View className='header'>
            <Text className='user-name'>
              {info.memberInfo.nickname ? info.memberInfo.nickname : ''}
            </Text>
            <Text className='time'>{info.startTimeString}</Text>
          </View>
          <View className='main'>
            <View className='left'>
              <Text>我在开团，就差</Text>
              <Text className='red'>{info.needNum}人</Text>了
            </View>
            <View className='right' onClick={this.onClick.bind(this, info)}>
              跟TA拼
            </View>
          </View>
        </View>
      </View>
    );
  }
}
