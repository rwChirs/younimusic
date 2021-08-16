import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import { getListData, share } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { logClick } from '../../../utils/common/logReport';
import loginCheck from '../../../utils/login_check';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import Item from './item/index';
import TimeTitle from './time-title/index';
import './index.scss';
import reportPoints from '../reportPoints';
import {
  addHttps,
  getRealUrl,
  getUrlParams,
} from '../../../utils/common/utils';
import utils from '../../../pages/login/util';
import { exportPoint } from '../../../utils/common/exportPoint';

const app = Taro.getApp().$app;
const router = getCurrentInstance().router;

export default class BillList extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      cookAd: '',
      cookSubAd: '',
      cookMenuInfoList: [],
      image: '',
      isLogin: false,
      canShare: false,
      isFirstShow: true,
      storeId: '',
    };
  }
  shareMsg = {
    title: '',
    imageUrl: '',
  };
  componentWillMount() {
    exportPoint(router);
    //先隐藏转发功能
    Taro.hideShareMenu();

    const option = router.params;
    /**
     * 解决分享页面跳转先打开今天吃啥首页，后打开分享页面；
     * 如果retureUrl存在，则跳转到指定分享页面；
     */
    // if (option.returnUrl) {
    //   wx.navigateTo({
    //     url: decodeURIComponent(option.returnUrl),
    //   });
    // }
    if (option.scene) {
      getRealUrl(decodeURIComponent(option.scene)).then((res) => {
        const params = getUrlParams(res.code);
        this.setState(
          {
            storeId: params.storeId,
          },
          () => {
            this.initData();
          }
        );
      });
      return;
    }
    this.initData();
  }
  componentDidShow() {
    console.log('componentDidShow', this.state.storeId);
    if (!this.state.isFirstShow) {
      this.initData();
    } else {
      this.setState({
        isFirstShow: false,
      });
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }
  onPullDownRefresh = () => {
    this.initData();
    Taro.stopPullDownRefresh();
  };
  /**
   * 转发事件
   */
  onShareAppMessage = (ev) => {
    logClick({
      ev,
      eid: reportPoints.listShare,
    });

    const { title, imageUrl } = this.shareMsg;
    return {
      title,
      imageUrl: addHttps(imageUrl),
      path: `/pages/bill/bill-list/index`,
      // path: url,
    };
  };
  initData() {
    this.getPlanDate();
    this.getStoreId();
  }
  //获取storeId
  getStoreId = () => {
    loginCheck().then((res) => {
      this.setState({
        isLogin: res,
      });
      let storeId = '';
      let urlParams = router.params;
      let addressInfo = Taro.getStorageSync('addressInfo') || {};
      if (typeof addressInfo === 'string' && addressInfo) {
        addressInfo = JSON.parse(addressInfo);
      }
      console.log(addressInfo);

      if (urlParams && urlParams.storeId) {
        storeId = urlParams.storeId;
      } else {
        if (addressInfo && addressInfo.storeId) {
          storeId = addressInfo.storeId;
        }
      }

      getUserStoreInfo(storeId, '', '', '', 3)
        .then((args) => {
          this.setState(
            {
              storeId: args.storeId || 131229,
            },
            () => {
              //同步公共数据
              app.globalData.storeId = args.storeId;
              app.globalData.coords = [args.lon, args.lat];

              this.getListData();
              this.getShareMsg();
            }
          );
        })
        .catch(() => {
          this.setState(
            {
              storeId: app.globalData.defaultStoreId,
            },
            () => {
              this.getListData();
              this.getShareMsg();
            }
          );
        });
    });
  };
  getListData = () => {
    if (this.props.data && this.props.data.success) {
      this.initListData(this.props.data);
    } else {
      getListData(this.state.storeId, this.planDate).then((res) => {
        if (res.success) {
          this.initListData(res);
        }
      });
    }
  };

  initListData = (res) => {
    const lbs_data = Taro.getStorageSync('addressInfo')
      ? Taro.getStorageSync('addressInfo')
      : ''; //缓存数据

    if (lbs_data.tenantId !== 1) {
      utils.redirectToH5({
        page: res.toUrl,
      });
      return;
    }

    this.setState({
      cookAd: res.cookAd || '',
      cookSubAd: res.cookSubAd || '',
      cookMenuInfoList: res.cookMenuInfoList || [],
      image: res.image || '',
      footDesc: res.footDesc || '',
    });
  };

  getShareMsg = () => {
    share({ shareType: 4 }).then((res) => {
      if (res.title && res.imageUrl) {
        this.shareMsg.title = res.title || '';
        this.shareMsg.imageUrl = res.imageUrl || '';
        this.setState({
          canShare: true,
        });
        Taro.showShareMenu();
      }
    });
  };
  goDetailPage = (data, ev) => {
    if (!data.contentId) return;
    logClick({
      ev,
      eid: reportPoints.listBill,
      eparam: { contentId: data.contentId, planDate: data.planDate },
    });
    Taro.navigateTo({
      url: `/pages/bill/bill-detail/index?storeId=${this.state.storeId}&contentId=${data.contentId}&planDate=${data.planDate}`,
    });
  };
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
    const {
      cookAd,
      cookSubAd,
      cookMenuInfoList,
      image,
      isLogin,
      footDesc,
      canShare,
    } = this.state;
    return (
      <View className='bill-list'>
        {canShare && (
          <Button openType='share' className='share-btn'>
            分享
          </Button>
        )}
        <View className='bg' style={{ backgroundImage: `url(${image})` }} />
        <View className='line'>
          <View className='spec-line' />
        </View>
        <View className='content'>
          <View className='header'>
            <View className='title'>{cookAd}</View>
            <View className='sub-title'>{cookSubAd}</View>
            <View className='dot' />
          </View>
          {cookMenuInfoList && cookMenuInfoList.length > 0 && (
            <View className='menu-list'>
              {cookMenuInfoList
                .filter((val) => {
                  return val && val.cookBaseInfoList;
                })
                .map((val, i) => {
                  return (
                    <View className='menu-con' key={i}>
                      <TimeTitle
                        week={val.week}
                        monthDate={val.monthDate}
                        title={val.title}
                        subTitle1={val.subTitle1}
                        subTitle2={val.subTitle2}
                        todayMenu={val.todayMenu}
                      />
                      {val.todayMenu ? (
                        <View className='menu-today'>
                          {val &&
                            val.cookBaseInfoList &&
                            val.cookBaseInfoList.length > 0 &&
                            val.cookBaseInfoList.map((slip, j) => {
                              return (
                                <Item
                                  data={slip}
                                  index={j + 1}
                                  key={j}
                                  onClick={this.goDetailPage.bind(this, slip)}
                                  isLogin={isLogin}
                                />
                              );
                            })}
                        </View>
                      ) : (
                        <View className='menu-other'>
                          {val &&
                            val.cookBaseInfoList &&
                            val.cookBaseInfoList.length > 0 &&
                            val.cookBaseInfoList.map((slip, j) => {
                              return (
                                <View className='menu-item' key={j}>
                                  {slip.coverSmallImg && (
                                    <Image
                                      src={
                                        slip.coverSmallImg.indexOf('http') > -1
                                          ? slip.coverSmallImg
                                          : `https:${slip.coverSmallImg}`
                                      }
                                      mode='aspectFill'
                                      className='menu-other-img'
                                      onClick={this.goDetailPage.bind(
                                        this,
                                        slip
                                      )}
                                    />
                                  )}
                                  <View className='menu-item-name'>
                                    {slip.title || ''}
                                  </View>
                                </View>
                              );
                            })}
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          )}
          <View className='bottom'>
            <View className='txt'>{footDesc}</View>
            {/* <View className="arrow-icon" /> */}
          </View>
        </View>
      </View>
    );
  }
}
