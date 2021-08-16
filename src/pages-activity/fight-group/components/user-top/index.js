import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
import { userDefaultPicture, noneDefaultPicture } from '../../utils/images';
import './index.scss';

export default class UserTop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { list, type, resource } = this.props;
    let fightMember = type && type > 0 ? type : 0;
    let defaultList = [];
    if (fightMember > 0) {
      for (let i = 0; i < fightMember; i++) {
        defaultList.push(i);
      }
    }

    return (
      <View
        className={
          list && list.length + fightMember > 4
            ? 'user-top-page'
            : 'user-top-page user-top-center'
        }
        style={{ marginBottom: type === 4 || type === 5 ? '16px' : 0 }}
      >
        {type > 0 && resource !== 'result' && (
          <View
            className='user-tip'
            style={{
              top:
                (list && list.length > 1) ||
                (list && list.length > 0 && fightMember > 1)
                  ? '-56rpx'
                  : '20rpx',
            }}
          >
            快上车，一起拼
          </View>
        )}
        {list &&
          list.length > 0 &&
          list.map((info, index) => {
            return (
              <View className='user-top' key={index}>
                <Image
                  src={info.avatar ? info.avatar : userDefaultPicture}
                  className='img'
                />
                <Text
                  className='name'
                  style={{
                    background:
                      index === 0
                        ? 'linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))'
                        : 'linear-gradient(to right, rgb(251,148,71), rgb(245,177,53))',
                  }}
                >
                  {index === 0 ? '团长' : '沙发'}
                </Text>
              </View>
            );
          })}
        {defaultList.length > 0 &&
          defaultList.map((item, k) => {
            return (
              <View className='user-top' key={k}>
                <Image src={noneDefaultPicture} className='img' />
                {/* <Text
                  className="name"
                  style={{background:'linear-gradient(to right, rgb(251,148,71), rgb(245,177,53))'}}>
                  沙发
                </Text> */}
              </View>
            );
          })}
      </View>
    );
  }
}
