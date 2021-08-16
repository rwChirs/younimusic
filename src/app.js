import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { ApiInt, getBaseConfigService } from '@7fresh/api';
import { setCenterTabBarConfig } from './utils/utils';
import { compareVersion } from './utils/common/utils';
import log from './utils/common/realtimeLog';
import srSdk from './utils/sr-sdk-wxapp.min';

import './app.scss'

const _console = console;

const dev = process.env.NODE_ENV === 'development';
if (!dev) {
  console = {
    ..._console,
    log: (...args) => {
      log.info(...args);
      _console.log(...args);
    },
    info: (...args) => {
      log.info(...args);
      _console.info(...args);
    },
    warn: (...args) => {
      log.warn(...args);
      _console.warn(...args);
    },
    error: (...args) => {
      log.error(...args);
      _console.error(...args);
    },
  };
}

let sr = srSdk.init({
  appid: 'wxb8c24a764d1e1e6d',
  token: 'bi942e65c935cb45a3',
  debug: dev,
});

class App extends Component {

  // 全局数据
  globalData = {
    userInfo: null,
    coords: null,
    defaultStoreId: 131229,
    storeId: null,
    openId: null,
    from_param: 'miniapp',
    pt_pin: '',
    centerTabBar: '', //0:菜谱，1:7club
    tabBar: 0,
    systemInfo: null,
    isConcern: false,
    canUseCustomTabBar: true,
    cartNum: 0,
    isIphoneX: false,
  };

  sr = sr;
  cachedData = {};
  // 腾讯地图服务key
  wx_map_dev_key = 'BNZBZ-MBPR3-KDB33-YNKYF-HK6AQ-GGBLD';
  // 后端根据pt_key验证登录的接口
  requestUrl = 'https://zmd.m.jd.com';
  // 登录域名
  loginRequestUrl = dev
    ? 'https://beta-wxapplogin.m.jd.com' // 预发
    : 'https://wxapplogin.m.jd.com'; // 线上
  // 接口调用域名
  bizRequesgUrl = dev
    ? 'https://mwpgwb.m.jd.com' // 预发
    : 'https://mwpgw.m.jd.com'; // 线上
  // 嵌入H5页面的域名
  h5RequestHost = dev ? 'https://7freshbe.m.jd.com' : 'https://7fresh.m.jd.com';
  // h5RequestHost = "http://7fresh.m.jd.com:8080";
  // 首页魔法石轮播配置id
  index_activity_id = 2009;
  // 论坛列表页魔法石轮播配置id
  postlist_activity_id = 2010;
  // 页面标题
  pageTitle = '七鲜';
  // 小程序appid
  wxversion = 'wxb8c24a764d1e1e6d';
  appid = '269';
  // 高德地图key
  gaodeKey = 'a186a963d392b84a9cc4b91feeda4a19';
  // 默认头像
  defaultAvatar =
    '<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="main" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><circle id="Oval-54" fill="#F5F5F6" sketch:type="MSShapeGroup" cx="18" cy="18" r="18"></circle><path d="M5.4,30.7857624 C7.02734638,28.5505478 9.11948902,27.2315331 11.509848,26.495122 C13.4258171,27.7003982 15.614721,28.3857706 17.9371709,28.3857706 C20.2600383,28.3857706 22.4514461,27.69844 24.3674152,26.495122 C26.7590024,27.2307663 28.8511939,28.5501227 30.4786406,30.7860494 C27.2372783,33.9723161 22.814717,35.9341463 17.9394663,35.9341463 C13.0640691,35.9341463 8.64138862,33.9721982 5.4,30.7857624 L5.4,30.7857624 Z M17.9997846,4 C11.9242219,4 7,8.92340534 7,14.9993537 C7,21.0761638 11.9242219,26 17.9997846,26 C24.0775016,26 29,21.0761638 29,14.9993537 C29,8.92340534 24.0775016,4 17.9997846,4 L17.9997846,4 Z" id="Fill-9" fill="#BCB5B9" sketch:type="MSShapeGroup"></path></g></svg>';

  scene = '';
  /**
   * 获取默认storeId
   */
  getDefaultStoreId = function() {
    return this.globalData.defaultStoreId;
  };

  componentDidMount () {

    ApiInt({
      env: 'weapp',
      node_env: dev ? 'development' : 'production',
      hostname: dev ? 'https://mwpgwb.m.jd.com' : 'https://mwpgw.m.jd.com',
    });
    // 加载字体文件 HYRunYuan-75W
    Taro.loadFontFace({
      family: 'HYRunYuan-75W',
      source:
        'url("https://storage.jd.com/7fresh-fonts/HYRunYuan-75W/HYRunYuan-75W.ttf")',
      success(res) {
        console.log('【自定义字体加载】成功', res);
      },
      fail: function(res) {
        console.log('【自定义字体加载】失败', res);
      },
      complete: function(res) {
        console.log('【自定义字体加载】完成', res);
      },
    });

    if (
      getCurrentInstance().router.params.scene !== 1089 &&
      getCurrentInstance().router.params.scene !== 1038
    ) {
      Taro.setStorageSync('scene', getCurrentInstance().router.params.scene);
    }
    const systemInfo = Taro.getSystemInfoSync();
    const model = systemInfo.model;
    const isIphoneX =
      /iphone\sx/i.test(model) ||
      (/iphone/i.test(model) && /unknown/.test(model)) ||
      /iphone\s11/i.test(model) ||
      /iphone\s12/i.test(model);
    this.globalData.isIphoneX = isIphoneX;
    this.globalData.canUseCustomTabBar =
      compareVersion(systemInfo.SDKVersion, '2.5.0') > -1;

      this.getBaseConfig().then(() => {
        sr.setUser({
          open_id: Taro.getStorageSync('openId'),
        });
        sr.startReport();
      });
      this.updateManagerFunc(); //更新版本
      Taro.onMemoryWarning(function(res) {
        console.log('onMemoryWarningReceive', res);
      });
  
      if (wx.canIUse('getPerformance')) {
        const performance = wx.getPerformance();
        const observer = performance.createObserver(entryList => {
          console.log(entryList.getEntries());
          let renderObj = {};
          entryList.getEntries().forEach(val => {
            if (val.entryType === 'render') {
              renderObj = val;
            }
          });
          if (renderObj.duration) {
            console.log(
              `---页面【${renderObj.path}】渲染耗时：${renderObj.duration}ms`
            );
            if (wx.canIUse('reportPerformance')) {
              // 渲染测速上报
              wx.reportPerformance(2003, renderObj.duration, renderObj.path);
            }
          }
        });
        observer.observe({ entryTypes: ['navigation', 'render', 'script'] });
    }
  }

  componentDidShow () {
    if (
      getCurrentInstance().router.params.scene !== 1089 &&
      getCurrentInstance().router.params.scene !== 1038
    ) {
      Taro.setStorageSync('scene', getCurrentInstance().router.params.scene);
    }
  }

  componentDidHide () {
    Taro.removeStorageSync('scene');
  }

  componentDidCatchError () {
    Taro.switchTab({
      url: '/pages/index/index',
    });
  }

  getBaseConfig() {
    return getBaseConfigService()
      .then(res => {
        if (res && res.success && res.configList) {
          if (typeof res.configList.centerTabType === 'number') {
            const centerTabBar = (this.globalData.centerTabBar =
              res.configList.centerTabType);
            try {
              setCenterTabBarConfig(centerTabBar);
            } catch (error) {
              console.log('不支持动态设置 tabBar 某一项的内容!', error);
            }
          }
        }
      })
      .catch(err => {
        console.error('获取baseConfig-错误', err);
      });
  }

  updateManagerFunc() {
    const updateManager = wx.getUpdateManager();
    if (!updateManager) return;
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      console.log(`【是否有新版本】：${res.hasUpdate}`);
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      console.log('新版本下载失败');
    });
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
