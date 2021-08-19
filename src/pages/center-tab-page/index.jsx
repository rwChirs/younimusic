import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { 
  // WebView,
   View } from '@tarojs/components';
import {
  getClubQueryUserInfo,
  getClubIndexV2,
  getBaseConfigService,
  getListData,
} from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
// import Loading from '../../components/loading';

import { exportPoint } from '../../utils/common/exportPoint';
import util from '../login/util';
import NavBar from '../../components/nav-bar';
import CustomTabBar from '../../components/custom-tab-bar';

import './index.scss';

const plugin = Taro.requirePlugin('loginPlugin');

/*
 * 需要用两个接口来判断要展示菜谱、7club或者活动页；
 * getBaseConfig() 用来判断要展示菜谱还是7club;
 * getIndexData()&&getListData() 用来判断是否要展示活动页;
 */

export default class CenterTabPage extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeId: '',
      isShowAppView: false,
      isLoading: true,
      toUrl: '',
      centerTabBar: 1, //0:菜谱，1:7club //app.globalData.centerTabBar
      clubData: '',
      billData: '',
      suportNavCustom: true,
      navHeight: '',
      userInfo: {}, //个人信息
      scrollTop: 0,
    };
  }

  componentWillMount() {
    const option = getCurrentInstance().router.params;
    /**
     * 解决分享页面跳转先打开今天吃啥首页，后打开分享页面；
     * 如果retureUrl存在，则跳转到指定分享页面；
     */
    if (option.returnUrl) {
      console.log(
        '[options]',
        option.returnUrl,
        decodeURIComponent(option.returnUrl)
      );
      wx.navigateTo({
        url: decodeURIComponent(option.returnUrl),
      });
    }

    this.getPlanDate();
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          suportNavCustom: res.version.split('.')[0] >= 7,
          navHeight: res.statusBarHeight + 44,
        });
      },
    });
  }

  onPageScroll = e => {
    this.setState({
      scrollTop: e.scrollTop,
    });
  };

  componentDidShow() {
    exportPoint(getCurrentInstance().router);
    this.getStoreId(false);
    this.onPageShow();
    this.getClubQueryUserInfo();
  }

  componentDidHide() {
    this.onPageHide();
  }


  initData = isRefresh => {
    if (!isRefresh) {
      this.setState({
        isShowAppView: true,
        isLoading: true,
      });
    }
    this.getBaseConfig();
  };

  getBaseConfig = () => {
    getBaseConfigService()
      .then(res => {
        if (res && res.success && res.configList) {
          if (typeof res.configList.centerTabType === 'number') {
            const centerTabBar = res.configList.centerTabType;
            this.setState({
              centerTabBar,
            });
            if (centerTabBar === 0) {
              this.getBillData();
            } else {
              this.getClubIndexData();
            }
          }
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        console.error('获取baseConfig-错误', err);
      });
  };

  // 获取是否为7fresh
  getClubIndexData = () => {
    const { storeId } = this.state;
    getClubIndexV2(storeId)
      .then(res => {
        if (res && res.success) {
          if (res.show === true) {
            this.setState({
              isLoading: false,
              isShowAppView: true,
              clubData: res.floors,
            });
          } else if (res.toUrl) {
            const toUrl = this.addAddressInfoInUrl(res.toUrl);
            this._genToken(toUrl);
          } else {
            this.setState({
              isLoading: false,
              isShowAppView: false,
              toUrl: '',
            });
          }
        } else {
          Taro.showToast({
            title: res.msg || '请求失败',
            icon: 'none',
          });
          this.setState({
            isLoading: false,
            isShowAppView: false,
            toUrl: '',
          });
        }
      })
      .catch(err => {
        console.error('获取7club展示数据-错误', err);
        this.setState({
          isLoading: false,
          isShowAppView: false,
          toUrl: '',
        });
      });
  };

  //获取个人信息数据
  getClubQueryUserInfo = () => {
    getClubQueryUserInfo().then(res => {
      this.setState({
        userInfo: res.success ? res.userInfo : {},
      });
    });
  };

  // 获取是否为7fresh
  getBillData = () => {
    getListData(this.state.storeId, this.planDate)
      .then(res => {
        if (res && res.success) {
          if (res.show === true) {
            this.setState({
              isLoading: false,
              isShowAppView: true,
              billData: res,
            });
          } else if (res.toUrl) {
            const toUrl = this.addAddressInfoInUrl(res.toUrl);
            // const toUrl= 'https://7fresh.m.jd.com/channel/?id=7675&showNavigationBar=1&fullScreen=true&statusBarStyleType=1&storeId=131229';
            // const h5_url = encodeURIComponent(toUrl);
            this._genToken(toUrl);
          } else {
            this.setState({
              isLoading: false,
              isShowAppView: false,
              toUrl: '',
            });
          }
        } else {
          Taro.showToast({
            title: res.msg || '请求失败',
            icon: 'none',
          });
          this.setState({
            isLoading: false,
            isShowAppView: false,
            toUrl: '',
          });
        }
      })
      .catch(err => {
        console.error('获取菜谱展示数据-错误', err);
        this.setState({
          isLoading: false,
          isShowAppView: false,
          toUrl: '',
        });
      });
  };

  //h5链接加地址信息
  addAddressInfoInUrl = url => {
    return util.transformH5Url(url);
  };

  onReachBottom = () => {
    //触发子组件触底
  };

  onPullDownRefresh = () => {
    // console.log('PULL DOWN REFRESH~');
    
  };

  //监听tab点击切换事件加埋点
  onTabItemTap = () => {
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

  _genToken = h5_url => {
    plugin
      .genToken({
        h5_url,
      })
      .then(res => {
        let { isSuccess, err_code, url, tokenkey, err_msg } = res;
        if (isSuccess && !err_code) {
          this.setState({
            isLoading: false,
            isShowAppView: false,
            toUrl: `${url}?to=${h5_url}&tokenkey=${tokenkey}`,
          });
        } else {
          Taro.showModal({
            title: '提示',
            content: err_msg || '页面跳转失败，请重试',
            success: () => {
              if (res.confirm) {
                this._genToken();
              }
            },
          });
        }
      });
  };

  // 无数据时点击刷新
  onRefresh = () => {
    this.getStoreId(true);
  };

  /**
   * 转发事件
   */
  onShareAppMessage = option => {
    console.log('7club转发事件', option);
    if (option.from === 'button' && option.target.dataset.shareInfo) {
      let shareInfo = option.target.dataset.shareInfo || {};
      return {
        title: shareInfo.title,
        imageUrl: '',
        // path: `/pages/center-tab-page/index?returnUrl=${encodeURIComponent(
        //   get7clubPath(shareInfo)
        // )}`,
      };
    } else {
      return {
        title: this.state.centerTabBar === 0 ? '今天吃啥' : '7CLUB444',
        path: `/pages/center-tab-page/index`,
      };
    }
  };

  /**
   * 跳转个人中心
   */
  onAvatar = () => {
    let { userInfo } = this.state;
    if (!userInfo || !userInfo.pin) {
      Taro.showToast({
        title: '暂无个人中心',
        icon: 'none',
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages-activity/7club/club-mine/index?author=${userInfo.pin ||
        ''}&avatar=${userInfo.yunMidImageUrl || ''}&authorNickName=${
        userInfo.nickname
      }`,
    });
  };

  onGoTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };

  render() {
    const {
      
      suportNavCustom,
      userInfo,
    } = this.state;
    return (
      <View>
        {suportNavCustom && (
          <View className='top-cover'>
            <NavBar
              title={this.state.centerTabBar === 0 ? '今天吃啥' : '7CLUB'}
              skin='white'
              showBack={false}
              isShowAvatar={this.state.centerTabBar === 0 ? false : true}
              avatar={
                this.state.centerTabBar === 0
                  ? ''
                  : userInfo &&
                    (userInfo.yunBigImageUrl ||
                      userInfo.yunMidImageUrl ||
                      userInfo.yunSmaImageUrl)
              }
              onAvatar={this.onAvatar}
            />
          </View>
        )}
        
        <View onClick={this.onGoTop}>
          <CustomTabBar selected={2} />
        </View>
      </View>
    );
  }
}
