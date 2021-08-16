import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
// import { images } from '../../../7club/utils';
import './index.scss';

//默认图片
const images = {
  shareDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/69208/12/10463/20438/5d8071feE8dcd8369/91d24f744bc3f13f.png',
  default7clubImg:
    'https://m.360buyimg.com/img/jfs/t1/70032/29/10545/3427/5d80720cE2de6d257/6500d012aba8852d.png',
  userDefaultPicture:
    'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png',
  praiseDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/118152/12/5320/1432/5eb27038E825191da/871d05cd498a9f22.png',
  praiseSelectedGif:
    'https://m.360buyimg.com/img/jfs/t1/138465/2/932/53506/5ee9ddd7E9dc5fe60/b1efa1e9f3fe88b9.gif',
  praiseSelectedImg:
    'https://m.360buyimg.com/img/jfs/t1/125734/32/1151/1864/5eba0376E341f4e4a/e74905151153094a.png',

  collectDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/114852/25/5231/1690/5eb26fa5E5eff204a/dff47dc3cb6ad1a2.png',
  collectSelectedGif:
    'https://m.360buyimg.com/img/jfs/t1/120802/3/5175/45243/5eeb394bE26407c55/43d2b6b45104044c.gif',
  collectSelectedImg:
    'https://m.360buyimg.com/img/jfs/t1/126319/3/1114/1979/5eba02b6Ee7901f1d/e79d5d72c084b78d.png',
};

const backImg = {
  black:
    'https://m.360buyimg.com/img/jfs/t1/134510/6/10740/493/5f6af38aEa982e3c8/23f92993bf2d6bba.png',
  white:
    'https://m.360buyimg.com/img/jfs/t1/136687/35/10639/491/5f6af522E154e6368/0ac57ce40f65cefa.png',
};
export default class NavBar extends Component {
  static defaultProps = {
    showBack: true,
    title: '',
    onBack: () => {},
    skin: 'white',
    isShowAvatar: false, //是否显示头像
    avatar: '',
    onAvatar: () => {},
    showSearch: false,
    onSearch: () => {},
    isIpx: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      statusHeight: '',
      navHeight: '',
    };
  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: (res) => {
        this.setState(
          {
            statusHeight: res.statusBarHeight * 2,
            compatibleHeight: res.statusBarHeight * 2 + 80,
            windowWidth: res.windowWidth,
          },
          () => {
            let clientRect = Taro.getMenuButtonBoundingClientRect();
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

  isShowBusinessesList = (bool) => {
    const { addrInfo, onHandelBusinessesList } = this.props;
    const tenantShopInfoList =
      addrInfo && addrInfo.tenantShopInfoList
        ? addrInfo.tenantShopInfoList
        : addrInfo && addrInfo.tenantShopInfo
        ? addrInfo.tenantShopInfo
        : '';
    if (tenantShopInfoList && tenantShopInfoList.length > 1) {
      onHandelBusinessesList(bool);
    }
  };

  render() {
    const { statusHeight, navHeight, windowWidth } = this.state;
    const {
      showBack,
      onBack,
      skin,
      isShowAvatar,
      avatar,
      onAvatar,
      showSearch,
      onSearch,
      addrInfo,
      showBusinessesList,
    } = this.props;

    const tenantShopInfoList =
      addrInfo && addrInfo.tenantShopInfoList
        ? addrInfo.tenantShopInfoList
        : addrInfo && addrInfo.tenantShopInfo
        ? addrInfo.tenantShopInfo
        : '';
    const tenantInfo =
      addrInfo && addrInfo.tenantInfo ? addrInfo.tenantInfo : '';

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
              className='navbar'
              style={{
                background: skin === 'black' ? 'transparent' : 'white',
              }}
            >
              <View
                className='title-container'
                style={{
                  height: `${
                    ((navHeight - statusHeight) / windowWidth) * 375
                  }rpx`,
                  background: skin === 'black' ? 'transparent' : 'white',
                  marginTop: `${(statusHeight / windowWidth) * 375}rpx`,
                }}
              >
                {showBack && (
                  <View className='back-btn' onClick={onBack}>
                    <Image
                      className='image'
                      src={skin === 'black' ? backImg.white : backImg.black}
                    ></Image>
                  </View>
                )}
                {isShowAvatar && (
                  <View className='avatar' onClick={onAvatar}>
                    <Image
                      className='avatar-image'
                      src={avatar ? avatar : images.userDefaultPicture}
                    ></Image>
                  </View>
                )}
                <View
                  className='title'
                  style={{
                    color: skin === 'black' ? 'white' : 'black',
                  }}
                >
                  <View
                    className='businesses-part lazy-load-img'
                    onClick={this.isShowBusinessesList.bind(
                      this,
                      !showBusinessesList
                    )}
                    style={{
                      textAlign:
                        tenantShopInfoList && tenantShopInfoList.length > 1
                          ? 'left'
                          : 'center',
                    }}
                  >
                    <Image
                      className='businesses-logo-nav'
                      src={
                        tenantInfo && tenantInfo.smallLogo
                          ? tenantInfo.smallLogo
                          : filterImg(
                              'https://m.360buyimg.com/img/jfs/t1/169080/32/5423/17426/601a6140E3d278895/cd52b51382116b04.png'
                            )
                      }
                      mode='aspectFit'
                      lazyLoad
                    />
                    {tenantShopInfoList && tenantShopInfoList.length > 1 && (
                      <View className='select-businesses-icon' />
                    )}
                  </View>
                </View>
                {showSearch && (
                  <View className='show-search' onClick={onSearch}>
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
