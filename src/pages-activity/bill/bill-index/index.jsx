import Taro, { getCurrentInstance } from '@tarojs/taro';
import { WebView, View, Image } from '@tarojs/components';
import { getListData } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import util from '../../../pages/login/util';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import BillList from '../bill-list/index';
import { isLogined } from '../../../utils/common/utils';
import { exportPoint } from '../../../utils/common/exportPoint';
import './index.scss';

const plugin = Taro.requirePlugin('loginPlugin');

export default class BillIndex extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      h5_url: null,
      src: null,
      isLogined: isLogined(),
      isShow: false,
      toUrl: '',
    };
  }
  componentDidShow() {
    exportPoint(getCurrentInstance().router);
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeId = addressInfo ? addressInfo.storeId : 0;
    getUserStoreInfo(storeId, '', '', '', 3).then(() => {
      this.getListData(storeId);
      console.log(this.state, '--------------3');
      let h5_url = encodeURIComponent(this.state.toUrl);
      h5_url = util.transformH5Url(h5_url);
      util.h5Init({
        ...{ returnPage: h5_url, pageType: 'h5' },
      });
      this.setState({ h5_url }, () => {
        this._genToken();
      });
    });
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }
  _genToken = () => {
    let { h5_url } = this.state;
    plugin
      .genToken({
        h5_url,
      })
      .then((res) => {
        let { isSuccess, err_code, url, tokenkey, err_msg } = res;
        if (isSuccess && !err_code) {
          this.setState({ url: `${url}?to=${h5_url}&tokenkey=${tokenkey}` });
        } else {
          Taro.showModal({
            title: '提示',
            content: err_msg || '页面跳转失败，请重试',
            success: (result) => {
              if (result.confirm) {
                this._genToken();
              }
            },
          });
        }
      });
  };
  // 获取是否为7fresh
  getListData = (storeId) => {
    this.getPlanDate();
    getListData(storeId, this.planDate).then((res) => {
      console.log(res, '-------菜谱列表信息，判断是否为7fresh-------');
      this.setState(
        {
          isShow: res.show || true,
          toUrl: res.toUrl,
          // toUrl: 'https://7fresh.m.jd.com/channel/?id=7675&showNavigationBar=1&fullScreen=true&statusBarStyleType=1&storeId=131229',
        },
        () => {}
      );
    });
  };
  // 获取当天日期
  getPlanDate = () => {
    const date = new Date();
    this.planDate =
      date.getFullYear() +
      '' +
      (date.getMonth() + 1 < 10 ? '0' : '') +
      (date.getMonth() + 1) +
      date.getDate();
  };

  render() {
    const { isShow, toUrl } = this.state;
    return (
      <view className='bill-index'>
        {isShow ? (
          <BillList />
        ) : toUrl === null ? (
          <View className='none-page'>
            <Image
              className='lazyload'
              src='https://m.360buyimg.com/img/jfs/t1/20824/13/11575/38431/5c91b0e4E2c239a18/4f7ffc5c87c2258c.png'
              alt='暂无数据'
            />
            <View className='none-word'>暂无数据</View>
          </View>
        ) : (
          <WebView src={toUrl} />
        )}
      </view>
    );
  }
}
