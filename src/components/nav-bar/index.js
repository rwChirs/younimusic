import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';
/**
 * backImg图片替换
 * 附上 svg源码
 * <svg xmlns="http://www.w3.org/2000/svg" width="36" height="72" viewBox="0 0 12 24">  <path fill-rule="evenodd" d="M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z" /></svg>
 * svg转为png再上传
 */
const backImg = {
  black:
    'https://m.360buyimg.com/img/jfs/t1/134510/6/10740/493/5f6af38aEa982e3c8/23f92993bf2d6bba.png',
  white:
    'https://m.360buyimg.com/img/jfs/t1/136687/35/10639/491/5f6af522E154e6368/0ac57ce40f65cefa.png',
};
export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusHeight: '',
      navHeight: '',
    };
  }

  componentWillMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.getSystemInfo({
        success: res => {
          this.setState(
            {
              statusHeight: res.statusBarHeight * 2,
              compatibleHeight: res.statusBarHeight * 2 + 80,
              windowWidth: res.windowWidth,
            },
            () => {
              let clientRect = '';
              if (process.env.TARO_ENV === 'h5') {
                clientRect = Taro.getMenuButtonBoundingClientRect();
              } else {
                clientRect = wx.getMenuButtonBoundingClientRect();
              }
              if (clientRect) {
                this.setState({
                  navHeight:
                    (clientRect.bottom + clientRect.top - res.statusBarHeight) *
                    2,
                });
              } else {
                this.setState({
                  navHeight: this.state.compatibleHeight,
                });
              }
            }
          );
        },
      });
    }
  }

  render() {
    const { statusHeight, navHeight, windowWidth } = this.state;
    const {
      title,
      showBack,
      onBack,
      showGoHome,
      onHome,
      skin,
      isShowAvatar,
      avatar,
      onAvatar,
      showSearch,
      onSearch,
      // isIpx,
    } = this.props;
    return (
      <View>
        {navHeight ? (
          <View
            className='wrapper'
            style={{
              height: `${(navHeight / windowWidth) * 375}rpx`,
              background: skin === 'black' ? 'transparent' : 'white',
            }}
          >
            <View
              className='navbars'
              style={{
                // height: `${(navHeight / windowWidth) * 375}rpx`,
                background: skin === 'black' ? 'transparent' : 'white',
              }}
            >
              <View
                className='common-title-container'
                style={{
                  height: `${((navHeight - statusHeight) / windowWidth) *
                    375}rpx`,
                  background: skin === 'black' ? 'transparent' : 'white',
                  marginTop: `${(statusHeight / windowWidth) * 375}rpx`,
                }}
              >
                {showBack && (
                  <View
                    className='back-btn'
                    onClick={onBack}
                    // style={{ top: isIpx ? '42%' : '50%' }}
                  >
                    <Image
                      className='image'
                      src={skin === 'black' ? backImg.white : backImg.black}
                    ></Image>
                  </View>
                )}
                {isShowAvatar && (
                  <View
                    className='avatar'
                    onClick={onAvatar}
                    // style={{ top: `${navHeight - statusHeight}px` }}
                  >
                    {/* https://m.360buyimg.com/img/jfs/t24223/55/868159330/5502/81368ae2/5b46fffcN50cb08cb.png */}
                    <Image
                      className='avatar-image'
                      src={
                        avatar
                          ? avatar
                          : 'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png'
                      }
                    ></Image>
                  </View>
                )}
                {showGoHome && (
                  <View className='avatar' onClick={onHome}>
                    <Image
                      className='avatar-image'
                      src='https://m.360buyimg.com/img/jfs/t1/167035/33/5818/3107/601d4c3cEd8f131a5/6006ac73085d1200.png'
                    ></Image>
                  </View>
                )}
                <View
                  className='title-new'
                  style={{
                    color: skin === 'black' ? 'white' : 'black',
                  }}
                >
                  {title || ''}
                </View>
                {showSearch && (
                  <View
                    className='show-search'
                    onClick={onSearch}
                    // style={{ top: isIpx ? '42%' : '50%' }}
                  >
                    <View className='icon' />
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}
