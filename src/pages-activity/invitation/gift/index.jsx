import Taro, { getCurrentInstance } from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import util from '../../../pages/login/util';
import { logUrlAddSeries } from '../../../utils/common/logReport';
import { exportPoint } from '../../../utils/common/exportPoint';

const plugin = Taro.requirePlugin('loginPlugin');
const app = Taro.getApp().$app;

export default class Gift extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: null,
      url: '',
    };
  }

  UNSAFE_componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.hideShareMenu();
  }

  componentDidShow() {
    this.init(getCurrentInstance().router.params);
  }

  init = parmas => {
    // 获取小程序参数，拼接webview的H5链接
    let h5_url = encodeURIComponent(
      `${app.h5RequestHost}/inviteGift.html?sp=${parmas.sp}`
    );
    h5_url = util.transformH5Url(h5_url);
    console.log(h5_url);
    util.h5Init({
      ...{ returnPage: h5_url, pageType: 'h5' },
    });
    this.setState({ h5_url }, () => {
      this._genToken();
    });
  };


  _genToken = () => {
    let { h5_url } = this.state;
    plugin
      .genToken({
        h5_url,
      })
      .then(res => {
        let { isSuccess, err_code, url, tokenkey, err_msg } = res;
        if (isSuccess && !err_code) {
          this.setState(
            {
              url: logUrlAddSeries(`${url}?to=${h5_url}&tokenkey=${tokenkey}`),
            },
            () => {
              console.log(this.state.url);
            }
          );
        } else {
          Taro.showModal({
            title: '提示',
            content: err_msg || '页面跳转失败，请重试',
            success: resp => {
              if (resp.confirm) {
                this._genToken();
              }
            },
          });
        }
      });
  };

  render() {
    return <WebView src={this.state.url} />;
  }
}
