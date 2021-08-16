import Taro,{getCurrentInstance} from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import {
  getOrderDrawPageService,
  getShareAddChangeService,
  share,
} from '@7fresh/api';
import CommonPageComponent from '../../pages/CommonPageComponent';
import util from '../../pages/login/util';
import { logUrlAddSeries } from '../../utils/common/logReport';
import { exportPoint } from '../../utils/common/exportPoint';

const plugin = Taro.requirePlugin('loginPlugin');
const app = Taro.getApp().$app;

export default class Draw extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: null,
      src: null,
      storeId: 0,
      acId: 0,
      activityId: '',
      shareInfo: {},
      url: '',
    };
  }

  config = {
    navigationBarTitleText: '',
  };

  componentWillMount() {
    // 开始需要先隐藏转发
    Taro.hideShareMenu();
    exportPoint(getCurrentInstance().router);
  }

  componentDidMount() {
    let { storeId, acId } = getCurrentInstance().router.params;
    this.init({ acId, storeId });
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  init = res => {
    this.setState(
      {
        storeId: res.storeId ? res.storeId : this.state.storeId,
        acId: res.acId ? res.acId : this.state.acId,
      },
      () => {
        // 获取小程序参数，拼接webview的H5链接
        let h5_url = encodeURIComponent(
          `${app.h5RequestHost}/draw/?storeId=${this.state.storeId}&acId=${this.state.acId}&showNavigationBar=1&from=miniapp`
        );
        h5_url = util.transformH5Url(h5_url);
        util.h5Init({
          ...{ returnPage: h5_url, pageType: 'h5' },
        });
        this.setState({ h5_url }, () => {
          this._genToken();
        });
        this.getShareInfo();
        this.handleData();
      }
    );
  };

  handleData = () => {
    const params = {
      acId: this.state.acId,
      storeId: this.state.storeId,
    };
    getOrderDrawPageService(params)
      .then(res => {
        if (res.success) {
          this.setState({
            activityId: res.activityId,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // 分享
  getShareInfo = () => {
    const { storeId } = this.state;

    const params = {
      storeId: storeId,
      shareType: 5,
    };
    share(params)
      .then(res => {
        // 拿到数据开启转发
        Taro.showShareMenu();
        this.setState({
          shareInfo: res,
        });
      })
      .catch(err => {
        console.log(err);
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
          this.setState({
            url: logUrlAddSeries(`${url}?to=${h5_url}&tokenkey=${tokenkey}`),
          });
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

  onShareAppMessage = () => {
    const shareInfo = this.state.shareInfo;
    this.addDrawChance();

    let title = shareInfo.title,
      imageUrl = shareInfo.imageUrl,
      bigImageUrl = shareInfo.bigImageUrl,
      miniProUrl =
        shareInfo.miniProUrl +
        '?storeId=' +
        this.state.storeId +
        '&acId=' +
        this.state.acId +
        '&showNavigationBar=1';
    return {
      title: title,
      imageUrl: bigImageUrl ? bigImageUrl : imageUrl,
      path: miniProUrl,
      success: function(res) {
        console.log(res);
      },
    };
  };

  /**
   * 分享增加机会接口
   */
  addDrawChance = () => {
    const { activityId, storeId } = this.state;
    const params = {
      activityId,
      storeId,
    };
    getShareAddChangeService(params)
      .then(res => {
        let h5_url = this.state.h5_url + '&time=' + new Date().getTime();
        if (res.addChanceCount > 0) {
          this.setState({ h5_url }, () => {
            this._genToken();
            this.getShareInfo();
          });
        } else {
          console.log(res);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return <WebView src={this.state.url} />;
  }
}
