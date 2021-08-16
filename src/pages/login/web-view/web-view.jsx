import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  // View,
  WebView,
} from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { exportPoint } from '../../../utils/common/exportPoint';
import util from '../util';

const plugin = Taro.requirePlugin('loginPlugin');
const router = getCurrentInstance().router;

export default class WebviewNormal extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    exportPoint(router);
    util.setCustomNavigation();
    const options = router.params;
    const { token, islogin } = options;
    if (Number(islogin) === 0) {
      util.redirectPage('/pages/login/index/index?riskFail=1');
      return;
    }

    this.handleBackFromH5(token);
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  handleBackFromH5 = (token) => {
    plugin
      .tokenLogin({
        token,
      })
      .then((res = {}) => {
        let { goback, err_msg } = res;
        if (goback) {
          plugin.gobackLog({ route: 7 });
          util.goBack();
          return;
        }
        err_msg &&
          wx.showModal({
            title: '提示',
            content: err_msg,
            success: (resp) => {
              if (resp.confirm) {
                this.handleBackFromH5(token);
              }
            },
          });
      })
      .catch((res) => console.jdLoginLog(res));
  };

  render() {
    return <WebView />;
  }
}
