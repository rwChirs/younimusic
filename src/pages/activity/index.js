import Taro,{getCurrentInstance} from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import { getActivity } from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import util from '../login/util';
import { logUrlAddSeries } from '../../utils/common/logReport';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import { sendRequest } from '../../utils/common/sendRequest';
import { exportPoint } from '../../utils/common/exportPoint';

const plugin = Taro.requirePlugin('loginPlugin');
const app = Taro.getApp().$app;

export default class Activity extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: null,
      storeId: '',
      url: '',
    };
  }
  config = {
    navigationBarTitleText: '',
  };

  componentWillMount() {
    Taro.hideShareMenu();
    exportPoint(getCurrentInstance().router);
  }

  componentDidShow() {
    this.init(getCurrentInstance().router.params);
    this.onPageShow();
  }

  init = parmas => {
    const addressInfo = Taro.getStorageSync('addressInfo') || {};
    const storeId = addressInfo ? addressInfo.storeId : 0;
    getUserStoreInfo(
      parmas.storeId ? parmas.storeId : storeId,
      parmas.from == '7freshapp' ? parmas.lng || '' : parmas.lon || '',
      parmas.lat || '',
      parmas.id,
      2
    ).then(res => {
      if (res.storeId !== this.state.storeId) {
        this.setState(
          {
            storeId: res.storeId ? res.storeId : this.state.storeId,
          },
          () => {
            // 获取小程序参数，拼接webview的H5链接
            let h5_url = encodeURIComponent(
              `${app.h5RequestHost}/channel/?storeId=${this.state.storeId}&id=${
                parmas.id
              }&lng=${parmas.lng}&lat=${parmas.lat}&from=miniapp&flowId=${
                parmas.flowId ? parmas.flowId : ''
              }`
            );
            h5_url = util.transformH5Url(h5_url);
            console.log(h5_url);
            util.h5Init({
              ...{ returnPage: h5_url, pageType: 'h5' },
            });
            this.setState({ h5_url }, () => {
              this._genToken();
            });
            this.getShareInfo();
          }
        );
      }
    });
  };

  componentDidHide() {
    this.onPageHide();
  }

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
            success: result => {
              if (result.confirm) {
                this._genToken();
              }
            },
          });
        }
      });
  };

  onShareAppMessage = options => {
    const shareInfo = this.state.shareInfo;
    console.log('【shareInfo】:', shareInfo);
    let title, imageUrl, miniProUrl;

    title = shareInfo.title;
    imageUrl = this.filterImg(shareInfo.imgUrl);
    miniProUrl = shareInfo.miniProgramUrl;
    console.log(imageUrl);
    const share = {
      title: title,
      imageUrl: shareInfo.imgUrl ? imageUrl : null,
      path: miniProUrl,
      success: function() {},
    };
    this.onPageShare({
      from: options.from,
      ...share,
    });
    return share;
  };
  getShareInfo = () => {
    const { storeId } = this.state;
    const { id } = getCurrentInstance().router.params;
    getActivity({
      storeId: storeId,
      acId: id,
    }).then(res => {
      // 拿到数据开启转发
      Taro.showShareMenu();
      this.setState({
        shareInfo: res && res.shareAppAd ? res.shareAppAd : {},
      });
    });
  };
  filterImg = (img, str) => {
    let value = '';
    if (str === 'user') {
      value = img
        ? img
        : 'https://m.360buyimg.com/img/jfs/t1/26929/4/4756/5639/5c344af6Ebe5f3e0e/fa5459e8c7c28ac1.png';
    } else {
      value = img
        ? img
        : 'https://m.360buyimg.com/img/jfs/t1/10366/26/8278/700/5c3455c6E7713217b/bf369c461fca9fd9.png';
    }
    if (value) {
      if (value.indexOf('http') <= -1) {
        return 'https:' + value;
      } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
        let data = value.split('http:')[1];
        return 'https:' + data;
      } else if (value.indexOf('webp') > -1) {
        let path = value.replace('.webp', '');
        return path;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  render() {
    return <WebView src={this.state.url} />;
  }
}
