import Taro, { getCurrentInstance } from '@tarojs/taro';
import { WebView, View } from '@tarojs/components';
import {
  getActivity,
  getMaotaiCustomFixedPageService,
  getMaotaiCustomFixedPageOnlineService,
  share,
} from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import util from '../util';
import { logUrlAddSeries } from '../../../utils/common/logReport';
import './index.scss';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { exportPoint } from '../../../utils/common/exportPoint';
import { userLogin, getMessage } from '../../../utils/common/utils';

const plugin = Taro.requirePlugin('loginPlugin');
const router = getCurrentInstance().router;

export default class WvCommon extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: null,
      isFirstOpen: true,
      sp: '',
      title: 'H5页面',
      hideWebview: false,
      url: '',
      shareInfoMenu: {},
      scene: '',
    };
  }

  shareTitle = '七鲜'; //默认
  componentDidMount() {
    // 首次进入清除缓存去走定位接口，然后更新判断的状态值
    const scene = wx.getLaunchOptionsSync().scene;
    this.setState({
      scene,
    });
    console.log('wv-commom-componentDidMount-scene', scene);
    exportPoint(router);
    if (
      !(
        scene == 1007 ||
        scene == 1008 ||
        scene == 1011 ||
        scene == 1012 ||
        scene == 1013 ||
        scene == 1036 ||
        scene == 1044 ||
        scene == 1045 ||
        scene == 1047 ||
        scene == 1048 ||
        scene == 1049 ||
        scene == 1096
      )
    ) {
      console.log(
        "wv-commom-componentDidMount-Taro.setStorageSync('addressInfo', null)"
      );
    }
    const options = router.params;
    let { h5_url = '' } = options;

    if (
      h5_url.indexOf('availHeight%3D') === -1 &&
      h5_url.indexOf('order.html') !== -1
    ) {
      const availHeight = wx.getSystemInfoSync().windowHeight;
      h5_url = h5_url + '%26availHeight%3D' + `${availHeight}`;
    }
    if (
      // scene == 1047 &&
      decodeURIComponent(h5_url).indexOf('/food-category') > -1 ||
      h5_url.indexOf('idPhoto.html') > -1 ||
      decodeURIComponent(h5_url).indexOf(
        'https://wxapplogin.m.jd.com/h5/risk/select'
      ) > -1
    ) {
      console.log('h5_url:', h5_url);
    } else {
      h5_url = util.transformH5Url(h5_url);
    }
    console.log(h5_url);
    if (!this.isJdH5()) {
      this.setState({ url: decodeURIComponent(h5_url) });
    } else {
      // 获取分享title
      this.getActivityShareTitle();
      this.getShareOneKeyMenu(h5_url);
      this.init(h5_url);
      this.userLogin();
    }
  }

  componentDidShow() {
    // 根据isFirstOpen，执行非首次
    if (!this.state.isFirstOpen && this.isJdH5()) {
      this.init();
    }
    this.onPageShow();
    router.params.room_id &&
      this.setChan({
        room_id: router.params.room_id,
      });
  }

  componentDidHide() {
    if (
      this.state.url &&
      this.state.url.indexOf('food-order-detail') !== -1
      // ||
      // (this.state.url && this.state.url.indexOf('cart.html') !== -1)
    ) {
      this.setState(
        {
          // 隐藏 webview
          hideWebview: true,
        },
        () => {
          this.setState({
            // 隐藏之后立马显示它，此时完成一次 webview 的销毁，拿到了 postMessage 中的数据
            hideWebview: false,
          });
        }
      );
    }
    this.onPageHide();
  }

  isJdH5 = () => {
    const options = router.params;
    const { h5_url = '' } = options;
    return decodeURIComponent(h5_url).split('?')[0].indexOf('jd.com') > -1;
  };

  userLogin = () => {
    userLogin()
      .then((res) => {
        this.setState({
          sp: res.sp,
        });
      })
      .catch((err) => console.log(err));
  };

  init = (url) => {
    // this.setState({
    //   isFirstOpen: false,
    // });
    const h5_url = this.state.h5_url || url || router.params.h5_url || '';
    util.h5Init({ ...router.params, h5_url });
    // util.setCustomNavigation();
    let reg = decodeURIComponent(h5_url);
    const currentStorage = Taro.getStorageSync('addressInfo') || {};
    console.log(currentStorage);
    getUserStoreInfo(
      currentStorage.storeId || util.getUrlParam('storeId', reg)[0] || '',
      currentStorage.lon || '',
      currentStorage.lat || '',
      util.getUrlParam('id', reg)[0] || '',
      util.getUrlParam('id', reg)[0] ? 2 : 1
    )
      .then((args) => {
        // const scene = this.state.scene || wx.getLaunchOptionsSync().scene;
        if (
          // scene == 1047 &&
          reg.indexOf('/food-category') > -1
          // && /storeId=(\d{1})/.test(reg)
        ) {
          console.log('堂食H5链接:', reg);
        } else {
          reg = reg.replace(
            /storeId=(undefined|\d*)/,
            `storeId=${args.storeId}`
          );
          reg = reg.replace(
            /lng=(undefined|[1-9]\d*\.\d*|0\.\d*[1-9]\d*)/,
            `lng=${args.lon}`
          );
          reg = reg.replace(
            /lat=(undefined|[1-9]\d*\.\d*|0\.\d*[1-9]\d*)/,
            `lat=${args.lat}`
          );
          reg = reg.replace(/from=([^&]*)/, `from=miniapp`);
        }
        console.log('H5链接：', reg);
        reg = encodeURIComponent(reg);

        this.setState({ h5_url: reg }, () => {
          this._genToken();
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ h5_url }, () => {
          this._genToken();
        });
      });
  };

  _genToken = () => {
    let { h5_url } = this.state;
    plugin
      .genToken({
        h5_url,
      })
      .then((res) => {
        let { isSuccess, err_code, url, tokenkey, err_msg } = res;
        if (isSuccess && !err_code) {
          this.setState({
            url: logUrlAddSeries(`${url}?to=${h5_url}&tokenkey=${tokenkey}`),
          });
        } else {
          Taro.showModal({
            title: '提示',
            content: err_msg || '页面跳转失败，请重试',
            success: (resp) => {
              if (resp.confirm) {
                this._genToken();
              }
            },
          });
        }
      })
      .catch((res) => console.jdLoginLog(res));
  };

  getMessageInfo = ({ detail }) => {
    getMessage({ detail });
  };

  //小程序活动页取魔法石分享标题数据
  getActivityShareTitle = () => {
    const options = router.params;
    const { h5_url = '' } = options;
    if (
      !(
        h5_url &&
        (h5_url.indexOf('activity.html') > -1 || h5_url.indexOf('channel') > -1)
      )
    ) {
      return;
    }
    let reg = decodeURIComponent(h5_url);
    //小程序中活动页分享语取魔法石分享标题数据
    const storeId = util.getUrlParam('storeId', reg)[0];
    const acId = util.getUrlParam('id', reg)[0];
    console.log(acId);
    const pId = util.getUrlParam('pId', reg)[0] || '';
    if (!storeId || !acId) return;
    //茅台活动页 茅台有分流隔离策略，所以预发和线上接口不一样
    if (h5_url.indexOf('maotai') > -1) {
      const dev = process.env.NODE_ENV === 'development';
      if (dev) {
        getMaotaiCustomFixedPageService({
          fixedPageId: acId,
          storeId,
        }).then((res) => {
          this.handlerShareInfo(res);
        });
      } else {
        getMaotaiCustomFixedPageOnlineService({
          fixedPageId: acId,
          storeId,
        }).then((res) => {
          this.handlerShareInfo(res);
        });
      }
    } else {
      // 普通活动页
      getActivity(acId, storeId, pId).then((res) => {
        this.handlerShareInfo(res);
      });
    }
  };

  handlerShareInfo = (res) => {
    if (res && res.shareAppAd) {
      this.shareTitle = res.shareAppAd.title;
      const imgUrl = res.shareAppAd.imgUrl;
      this.imgUrl = imgUrl
        ? imgUrl.indexOf('http') > -1
          ? imgUrl
          : `https:${imgUrl}`
        : null;
      console.log('活动页分享图片', this.imgUrl);
    }
  };

  getShareOneKeyMenu = () => {
    const options = router.params;
    const { h5_url = '' } = options;
    if (!(h5_url && h5_url.indexOf('one-key-menu') > -1)) {
      return;
    }
    const params = { shareType: 13 };
    share(params)
      .then((data) => {
        this.setState({
          shareInfoMenu: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onShareAppMessage = (options) => {
    let { h5_url } = this.state;
    const _h5_url = decodeURIComponent(h5_url);
    console.log('onShareAppMessage', _h5_url, options);
    h5_url =
      h5_url == options &&
      encodeURIComponent(options.webViewUrl.split('&SR_SDK_INFO')[0])
        ? h5_url
        : encodeURIComponent(options.webViewUrl.split('&SR_SDK_INFO')[0]);
    let detailIndex = h5_url.indexOf('detail.html');
    let shareTitle = detailIndex > 0 ? '商品详情' : this.shareTitle;
    let shareJson = {
      path:
        detailIndex > 0
          ? `/pages/detail/index?${decodeURIComponent(
              h5_url.substr(detailIndex + 12)
            )}`
          : `/pages/login/wv-common/wv-common?h5_url=${
              h5_url
              // inviteGift ? inviteGiftUrl : h5_url
            }`,
    };
    // 今日值得抢社群分享链接start
    let acId = util.getUrlParam('pageLinkAcId', options.webViewUrl)[0];
    let pathUrl =
      shareJson.path.split('h5_url=') &&
      decodeURIComponent(shareJson.path.split('h5_url=')[1]);
    let pathHeader =
      shareJson.path.split('h5_url=') && shareJson.path.split('h5_url=')[0];
    let storeId = util.getUrlParam('storeId', options.webViewUrl)[0];
    if (acId) {
      let entrancedetail = '';
      if (acId.toString() == '-2') {
        entrancedetail = `009_${storeId}_20191219003`;
      } else if (acId.toString() == '-3') {
        entrancedetail = `009_${storeId}_20191219002`;
      } else if (acId.toString() == '-1') {
        entrancedetail = `009_${storeId}_20191219010`;
      }
      if (this.state.sp) {
        pathUrl = `${pathUrl}&entrancedetail=${entrancedetail}&sp=${this.state.sp}`;
      } else {
        pathUrl = `${pathUrl}&entrancedetail=${entrancedetail}`;
      }
      let detailUrl = encodeURIComponent(
        pathHeader + `h5_url=${encodeURIComponent(pathUrl)}`
      );
      const url = `/pages/index/index?returnUrl=${detailUrl}`;
      shareJson = {
        path: url,
      };
    } else if (h5_url && h5_url.indexOf('channel') > -1) {
      const pId = util.getUrlParam('id', options.webViewUrl)[0] || '';
      if (pathUrl.indexOf('?') !== -1) {
        pathUrl = pathUrl + `&entrancedetail=009_${storeId}_20191219007_` + pId;
      } else {
        pathUrl = pathUrl + `?entrancedetail=009_${storeId}_20191219007_` + pId;
      }
      if (this.state.sp) {
        pathUrl = pathUrl + `&sp=${this.state.sp}`;
      }
      let detailUrl = encodeURIComponent(
        pathHeader + `h5_url=${encodeURIComponent(pathUrl)}`
      );
      const url = `/pages/index/index?returnUrl=${detailUrl}`;
      shareJson = {
        path: url,
      };
    } else if (h5_url && h5_url.indexOf('food-detail') > -1) {
      let detailUrl = encodeURIComponent(
        pathHeader + `h5_url=${encodeURIComponent(pathUrl)}`
      );
      const url = `/pages/index/index?returnUrl=${detailUrl}`;
      shareJson = {
        path: url,
      };
    }
    const shareTitleArr = /shareTitle=(.*)&/.exec(_h5_url);
    if (shareTitleArr && shareTitleArr.length > 1) {
      shareTitle = shareTitleArr[1];
    }
    shareJson.title = shareTitle;
    const imageUrlArr = /imageUrl=(.*)&{0,1}/.exec(_h5_url);
    if (imageUrlArr && imageUrlArr.length > 1) {
      let _imageUrl = imageUrlArr[1];
      if (_imageUrl.indexOf('http') === -1 && _imageUrl.indexOf('//') === 0) {
        _imageUrl = `https:${_imageUrl}`;
      }
      shareJson.imageUrl = _imageUrl;
    }
    // 今日值得抢社群分享链接end

    // H5端---wx.miniProgram.postMessage传入小程序
    console.log('postMessage:', Taro.getStorageSync('share'));
    const shareInfo = Taro.getStorageSync('share') || {};
    if (shareInfo && shareInfo !== {}) {
      if (shareInfo && shareInfo.title) {
        shareJson.title = shareInfo.title;
      }
      if (shareInfo && shareInfo.imageUrl) {
        shareJson.imageUrl = shareInfo.imageUrl;
      }
      if (detailIndex <= 0) {
        //活动页
        shareJson.imageUrl = this.imgUrl;
      }
      Taro.removeStorageSync('share');
    }

    console.log('【shareJson】:', shareJson);
    if (
      this.state.shareInfoMenu &&
      JSON.stringify(this.state.shareInfoMenu) !== '{}'
    ) {
      shareJson.title = this.state.shareInfoMenu.title || shareJson.title;
      shareJson.imageUrl =
        this.state.shareInfoMenu.bigImageUrl || shareJson.imageUrl;
    }

    // 热销榜单
    if (h5_url && h5_url.indexOf('calculation-rank-list') > -1) {
      const bank_url = h5_url && h5_url.split('returnData')[0];
      const miniUrl = `/pages/index/index?returnUrl=${encodeURIComponent(
        `/pages/login/wv-common/wv-common?h5_url=${encodeURIComponent(
          bank_url
        )}`
      )}`;
      shareJson = {
        path: miniUrl,
        title: '七鲜【热销商品榜】火热出炉，快来看看吧！',
        imageUrl:
          'https://m.360buyimg.com/img/jfs/t1/156012/17/5814/223627/5ffeb7edEd477c7c8/de57c4dddadb03f8.png',
      };
    }

    this.onPageShare({
      from: options.from,
      ...shareJson,
    });
    return shareJson;
  };

  render() {
    const { hideWebview } = this.state;
    // console.log('render-url', this.state.url)

    return hideWebview ? (
      <View />
    ) : (
      <WebView src={this.state.url} onMessage={this.getMessageInfo} />
    );
  }
}
