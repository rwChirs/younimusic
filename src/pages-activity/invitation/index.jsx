import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  View,
  WebView
} from '@tarojs/components';
import {
  share,
  getLoginStatus
} from '@7fresh/api';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import utils from '../../pages/login/util';
import { exportPoint } from '../../utils/common/exportPoint';
import { logUrlAddSeries } from '../../utils/common/logReport';
import './index.scss';

const plugin = Taro.requirePlugin('loginPlugin');
const app = Taro.getApp().$app;
const h5RequestHost = app.h5RequestHost;

export default class Invitation extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      invitaInfo: {},
      invRuleUrl: `${h5RequestHost}/inviteRules.html`,
      pageList: [],
      shareAppAd: {},
      showModal: false,
      backImgUrl:
        'https://m.360buyimg.com/img/jfs/t1/65117/18/1214/73396/5cf75716Ee775eb49/bef1e5670bae1866.jpg',
      sp: '',
      isLogin: !!plugin.getStorageSync('jdlogin_pt_key'),

      h5_url: null,
      storeId: 0,
      shareInfo: {},
      url: '',
    };
  }
  coords = {};
  // https://7freshbe.m.jd.com/immersive/inviteHasGifts?showNavigationBar=1

  UNSAFE_componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.hideShareMenu();
    if (!this.state.isLogin) {
      utils.redirectToLogin('/pages-activity/invitation/index');
    }
  }

  componentDidShow() {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeId = addressInfo ? addressInfo.storeId : 0;
    const lat = addressInfo ? addressInfo.lat : '';
    const lon = addressInfo ? addressInfo.lon : '';
    this.getStoreInfo(storeId, lon, lat, '', 3)
      .then(res => {
        if (res.storeId) {
          this.coords = {
            lng: res.lon,
            lat: res.lat,
          };
          this.setState(
            {
              storeId: res.storeId || '',
            },
            () => {
              //同步公共数据
              app.globalData.storeId = res.storeId;
              app.globalData.coords = [res.lon, res.lat];

              this.init(res);
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  init = () => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const tenantId = addressInfo ? addressInfo.tenantId : 1;

    // 获取小程序参数，拼接webview的H5链接
    let h5_url = encodeURIComponent(
      `${app.h5RequestHost}/immersive/inviteHasGifts?showNavigationBar=1&from=miniapp&storeId=${this.state.storeId}&lat=${this.coords.lat}&lng=${this.coords.lon}&tenantId=${tenantId}`
    );
    h5_url = utils.transformH5Url(h5_url);
    utils.h5Init({
      ...{ returnPage: h5_url, pageType: 'h5' },
    });
    this.setState({ h5_url }, () => {
      this._genToken();
    });

    this.getShareInfo();
  };

  getStoreInfo = (storeId, lon, lat, acId, type) => {
    return getUserStoreInfo(storeId, lon, lat, acId, type).then(res => {
      return res;
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
            () => { }
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

  getShareInfo = () => {
    const params = { shareType: 23 };
    share(params)
      .then(data => {
        Taro.showShareMenu();
        this.setState({
          shareInfo: data,
        });
      })
      .catch(err => {
        console.log(err);
      });

    // 强校验登陆
    getLoginStatus()
      .then(res => {
        let sp = res.sp || '';
        this.setState({ sp }, () => { });
      })
      .catch(() => { });
  };

  onShareAppMessage = () => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const tenantId = addressInfo ? addressInfo.tenantId : 1;

    const { title, bigImageUrl } = this.state.shareInfo;
    const { sp } = this.state;
    return {
      title,
      imageUrl: bigImageUrl
        ? bigImageUrl.indexOf('http') > -1
          ? bigImageUrl
          : `https:${bigImageUrl}`
        : '',
      path: `/pages/index/index?from=miniapp&pageId=0225&sp=${sp}&venderId=${this.state.storeId}&inviterTenantId=${tenantId}`,
      success: function (res) {
        console.log(res);
      },
    };
  };

  render() {
    return (
      <View>
        <WebView src={this.state.url} />
      </View>
    );
  }
}
