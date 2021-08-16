import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import util from '../util';
import { exportPoint } from '../../../utils/common/exportPoint';
import './index.scss';

const plugin = Taro.requirePlugin('loginPlugin');
const config = util.getLoginConfig();
const router = getCurrentInstance().router;
export default class LoginIndex extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      config,
      code: null,
      stopClick: false,
      checkboxChecked: true || !config.author,
      detail: {},
    };
  }

  componentDidShow() {
    plugin.pvLog();
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentWillMount() {
    exportPoint(router);
    const options = router.params;
    this.setState({
      config: util.getLoginConfig(options),
    });
    if (!options.riskFail) {
      util.setLoginParamsStorage(options);
    }
    plugin.setLog({
      url: 'pages/login/index/index',
      pageId: 'WLogin_Diversion',
    });
    util.setCustomNavigation();
    this.getWxcode();
  }

  showLoad = () => {
    wx.showToast({
      title: '请阅读并勾选页面底部协议',
      icon: 'none',
      duration: 3000,
    });
  };

  changeCheckbox = (e) => {
    console.log('changeCheckbox');
    this.setState({ checkboxChecked: e.detail });
  };

  needAuthor = () => {
    if (!this.state.checkboxChecked) {
      this.showLoad();
    }
  };

  getPhoneNumber = (event = {}) => {
    let { stopClick } = this.state;
    if (stopClick) {
      wx.showToast({
        icon: 'none',
        title: '请不要重复点击',
      });
      return;
    }

    this.setState({
      stopClick: true,
    });

    let { detail } = event;
    let { iv, encryptedData } = detail;
    plugin.clickLog({
      event,
      eid: 'WLogin_Diversion_Wechat',
    });
    if (!iv || !encryptedData) {
      this.setState({ stopClick: false });
      return;
    }
    Taro.showLoading({
      title: '加载中',
    });

    this.setState(
      {
        detail,
      },
      () => {
        this.mobileLogin();
      }
    );
    plugin.clickLog({
      event,
      eid: 'WLogin_DiversionWechat_Allow',
    });
  };

  mobileLogin = () => {
    let { code, detail } = this.state;
    let { iv, encryptedData } = detail;
    if (!code || !iv || !encryptedData) return;
    const startClick = () => {
      Taro.hideLoading();
      this.setState({
        stopClick: false,
      });
    };

    plugin
      .WXMobileLogin({
        iv,
        encryptedData,
        code,
      })
      .then((res) => {
        if (res.err_code == 32) return plugin.loginRequest({});
        if (res.err_code == 124) return this.getWxcode(); // 风控提示用户去浏览器解除 重新获取code
        wx.setStorageSync('isLoginRejectPolicy', true);
        return res;
      })
      .then((res) => {
        let { pt_key, rsa_modulus, guid } = res;
        if (!pt_key && rsa_modulus && guid) {
          // login 返回
          res.pluginUrl = plugin.formatPluginPage('main');
        }
        wx.setStorageSync('isLoginRejectPolicy', true);

        startClick();
        util.handleJump(res);
      })
      .catch((res) => {
        startClick();
        console.jdLoginLog(res);
      });
  };

  smsloginResListener = (res = {}) => {
    if (this.state.checkboxChecked) {
      util.handleJump(res.detail);
    } else {
      this.showLoad();
    }
  };

  getWxcode = () => {
    Taro.login({
      success: (res = {}) => {
        console.log('页面的wxcode', res.code);
        this.setState({
          code: res.code,
        });
      },
    });
  };

  // 拒绝协议
  reject = () => {
    Taro.navigateBack();
  };

  render() {
    const { stopClick, checkboxChecked } = this.state;
    return (
      <View className='login'>
        <index
          onSmsloginres={this.smsloginResListener}
          config={this.state.config}
          checkboxChecked={checkboxChecked}
        />
        {!stopClick && checkboxChecked ? (
          <Button
            class='phone-btn'
            openType='getPhoneNumber'
            onGetPhoneNumber={this.getPhoneNumber}
          >
            微信手机号快捷登录
          </Button>
        ) : (
          <Button class='phone-btn btn-disabled' onClick={this.needAuthor}>
            微信手机号快捷登录
          </Button>
        )}
        {/* 弹窗类型展示协议授权 */}
        {config.selfTipsDialog ? (
          <View class='dialog-tips'>
            <View class='dialog-tips-box'>
              <instruction
                config={this.state.config}
                onChangeCheck={this.changeCheckbox}
                class='no-fix'
              />
              <View class='btns'>
                <Button class='phone-btn bg-btn' onClick={this.reject}>
                  拒绝
                </Button>
                <Button
                  class='phone-btn'
                  openType='getPhoneNumber'
                  onGetPhoneNumber={this.getPhoneNumber}
                >
                  同意
                </Button>
              </View>
            </View>
          </View>
        ) : (
          <instruction
            config={this.state.config}
            bindChangeCheck={this.changeCheckbox}
          />
        )}
      </View>
    );
  }
}
