import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getEncryptUnionId } from '@7fresh/api';
import Loading from '../../components/loading';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { exportPoint } from '../../utils/common/exportPoint';
import loginCheck from '../../utils/login_check';
import utils from '../login/util.js';

import './index.scss';

const app = Taro.getApp().$app;
const router = getCurrentInstance().router;
const loginPlugin = Taro.requirePlugin('loginPlugin');
// TODO 可改成动态获取
const isvPlugin = Taro.requirePlugin('wxcaf1c8f8f41ad846');

export default class Transition extends CommonPageComponent {
  config = {
    navigationBarTitleText: '中间页',
  };
  constructor(props) {
    super(props);
    this.state = {
      kPluData: {},
    };
  }

  componentDidShow() {
    console.log('=============componentDidShow - Transition=============');
    this.onPageShow();
  }

  componentWillMount() {
    console.log('=============componentWillMount - Transition=============');
    exportPoint(router);
    this.loginCheck();
  }

  componentDidMount() {}

  componentDidHide() {
    this.onPageHide();
  }

  loginCheck() {
    loginCheck().then((res) => {
      console.log('======loginCheck======', res);
      if (!res) {
        const params = router.params;
        const url = `/pages/transition/transition?${Object.keys(params)
          .map((key) => (key ? `${key}=${params[key]}` : ''))
          .join('&')}`;

        utils.redirectToLogin(url);
      } else {
        this.init();
      }
    });
  }

  init = async () => {
    let { returnPage } = router.params;
    returnPage = decodeURIComponent(returnPage);
    const newReturnPage =
      returnPage && returnPage.replace(/loginToken\=\w{5,50}\&?/, '');
    const { wxversion } = app;
    const pointData =
      Taro.getStorageSync('exportPoint') &&
      JSON.parse(Taro.getStorageSync('exportPoint'));
    console.log(`appid=${wxversion},unionId=${pointData.unionId}`, returnPage);
    if (pointData) {
      const res = await getEncryptUnionId({
        appid: wxversion,
        unionId: pointData.unionId,
      });
      const encryptUnionId = (res && res.encryptUnionId) || '';
      const kPluData = {
        scene: wx.getStorageSync('scene'),
        appId: wxversion,
        openid: pointData.openid,
        unionId: encryptUnionId,
      };
      this.setState(
        {
          kPluData,
          returnPage: `${newReturnPage}&kPluData=${encodeURIComponent(
            JSON.stringify(kPluData)
          )}`,
        },
        () => {
          this.getToken();
        }
      );
    }
  };

  getToken() {
    loginPlugin
      .isvObfuscator()
      .then((res) => {
        let { token } = res;
        console.log('token', token);
        if (isvPlugin && isvPlugin.setToken) {
          isvPlugin.setToken(token || '');
        }
        this.onGotoPlugin();
      })
      .catch((err) => {
        isvPlugin.setToken('');
        console.log('err', err);
      });
  }

  onGotoPlugin() {
    const { kPluData } = this.state;
    console.log('kPluData', kPluData);
    Taro.redirectTo({
      url: this.state.returnPage,
      // url: `plugin://wxcaf1c8f8f41ad846/activity?activityId=1&getUnionid=1&kPluData=${encodeURIComponent(JSON.stringify(kPluData))}`,
    });
  }

  render() {
    return (
      <View className='page-container'>
        <Loading tip='加载中...' />
      </View>
    );
  }
}
