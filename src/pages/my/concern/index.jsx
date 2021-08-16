import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import util from '../../login/util';
import { logUrlAddSeries } from '../../../utils/common/logReport';
import { exportPoint } from '../../../utils/common/exportPoint';

const plugin = Taro.requirePlugin('loginPlugin');

export default class Concern extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: '',
      url: '',
      articleUrl:
        'https://mp.weixin.qq.com/s?__biz=MzUxNzA4NTQxNQ==&mid=100008693&idx=1&sn=bc6ac5115dd2bc2c604fb329dfa4e793&chksm=799f237d4ee8aa6b86572076bb1e9f3e24b3afb27ef40f106f2261bd20c26a1c28b20ce712a8#rd', //文章路径
    };
  }

  config = {
    navigationBarTitleText: '',
  };

  componentWillMount() {
    // 开始需要先隐藏分享功能
    Taro.hideShareMenu();
    exportPoint(getCurrentInstance().router);
    const { articleUrl } = getCurrentInstance().router.params;
    if (articleUrl) {
      this.setState(
        {
          articleUrl: articleUrl,
        },
        () => {
          this.init();
        }
      );
    } else {
      this.init();
    }
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  init = () => {
    // 获取小程序参数，拼接webview的H5链接
    let h5_url = encodeURIComponent(this.state.articleUrl);
    h5_url = util.transformH5Url(h5_url);
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
              console.log({ url });
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
