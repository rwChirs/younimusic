import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import {
  View,
  // Button
} from '@tarojs/components';

import './index.scss';
import { logClick } from '../../../utils/common/logReport';
import { getExposure } from '../../../utils/common/exportPoint';

export default class FloatMenus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scene: Taro.getStorageSync('scene'),
    };
  }

  static defaultProps = {
    isShowBackToTop: false,
    isNewUser: false,
  };

  componentDidMount() {
    if (Number(this.state.scene) === 1036) {
      this.launchAppExposure();
    }
  }

  gotoHome = e => {
    e.stopPropagation();
    this.props.onGotoHome();
  };

  gotoTop = e => {
    e.stopPropagation();
    this.props.onGotoTop();
  };

  launchAppError = e => {
    e.stopPropagation(); // 阻止事件冒泡
    const { onErrorLauch } = this.props;
    onErrorLauch('');
    // Taro.getSystemInfo().then(res => {
    //   if (res.platform === 'ios') {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往App Store搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   } else {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往应用商店搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   }
    // });
    return;
  };

  getBuryingPrint = e => {
    logClick({ e, eid: '7FRESH_miniapp_2_1578553760939|12' });
  };

  // 打开APP浮层曝光埋点
  launchAppExposure = () => {
    const targetDom = `#open-app-btn`;
    const intersectionObserver = Taro.createIntersectionObserver(this.$scope);
    intersectionObserver
      .relativeTo('#float-menus', { right: 0 })
      .observe(targetDom, () => {
        const params = {
          router: this.$router,
          eid: 'Product_details_share_open',
          eparam: {},
        };
        getExposure(params);
        intersectionObserver.disconnect();
      });
  };

  render() {
    // const { scene } = this.state;
    return (
      <View className='float-menus' id='float-menus'>
        {/* {scene === 1036 && (
          <Button
            openType='launchApp'
            id='open-app-btn'
            className='open-app-btn'
            appParameter={this.props.appParameter}
            onClick={this.getBuryingPrint}
            onError={this.launchAppError}
            style={
              {
                // bottom: this.state.isShowBackToTop ? '465rpx' : '330rpx'
              }
            }
            hover-class='none'
          >
            <View className='open-app-title'>
              <View>打开</View>APP
            </View>
          </Button>
        )} */}
        <View className='float-goto-home'>
          <View className='goto-home' onClick={this.gotoHome} />
        </View>

        {this.props.isShowBackToTop && (
          <View className='float-goto-top'>
            <View className='goto-top' onClick={this.gotoTop} />
          </View>
        )}
      </View>
    );
  }
}
