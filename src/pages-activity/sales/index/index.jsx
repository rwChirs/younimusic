import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { getBigUserIntroduceService,getWxLoginStatus } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { imageList } from '../util/images';
import { logClick } from '../../../utils/common/logReport';
import { navigateSwitch } from '../util/navigate';
import { hotline, apply } from '../util/reportPoints';
import { exportPoint } from '../../../utils/common/exportPoint';
import './index.scss';

export default class SalesIndex extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isLoginFlag: false,
      storeId: '',
      pageImage: '',
      imageWidth: 0,
      imageHeight: 0,
    };
  }

  componentWillMount() {
    exportPoint(getCurrentInstance().router);

    Taro.getSystemInfo({
      success: res => {
        this.setState(
          {
            systemInfo: res,
            width: res.windowWidth,
            height: res.windowHeight,
          },
          () => {
            this.isLoginFunc();
          }
        );
      },
    });
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  isLoginFunc = () => {
    const addressInfo = Taro.getStorageSync('addressInfo');
    let storeId = addressInfo
      ? addressInfo.storeId
      : getCurrentInstance().router.params.storeId
      ? getCurrentInstance().router.params.storeId
      : 131229;
    getWxLoginStatus({storeId}).then(res => {
      if (res && res.code === '3') {
        navigateSwitch('login');
      } else {
        this.getImage(storeId);
        if (!storeId) {
          Taro.showToast({
            title: '请先到首页选择一个门店',
            icon: 'none',
            duration: 2000,
          });
          return false;
        }
        this.setState({
          isLoginFlag: true,
          storeId,
        });
      }
    });
  };

  getImage = storeId => {
    let params = {
      storeId: storeId,
    };
    getBigUserIntroduceService(params).then(res => {
      if (res && res.success) {
        let url = res.imgUrl ? res.imgUrl : '';
        if (url.indexOf('http') <= 1) {
          url = 'https:' + url;
        }
        this.setState({
          pageImage: url,
        });
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        });
        return false;
      }
    });
  };

  hotLine = event => {
    //拨打电话
    logClick({ event, eid: hotline });
    wx.makePhoneCall({
      phoneNumber: '4006068768',
    });
  };

  apply = event => {
    logClick({ event, eid: apply });
    let { isLoginFlag, storeId } = this.state;
    if (isLoginFlag && storeId) {
      // 申请表单
      Taro.redirectTo({
        url: `/pages-activity/sales/form/index?storeId=${storeId}`,
      });
    }
  };

  imageLoad = e => {
    if (e.detail && e.detail.width && e.detail.height) {
      this.setState({
        imageWidth: e.detail.width,
        imageHeight: e.detail.height,
      });
    }
  };

  render() {
    let {
      width,
      pageImage,
      imageHeight,
      imageWidth,
    } = this.state;
    return (
      <View className='sales-page'>
        {pageImage ? (
          <Image
            className='sales-picture'
            src={pageImage}
            lazyLoad
            style={`width: ${width}px; height: ${(width / imageWidth) *
              imageHeight}px;`}
            onLoad={this.imageLoad}
          />
        ) : (
          <Image
            className='sales-grey-picture'
            src={imageList.greyLogo}
            lazyLoad
          />
        )}
        <View className='sales-btn'>
          <View className='sales-btn-left' onClick={this.hotLine}>
            <View href='tel:4006068768'>
              <Image
                className='sales-hotline'
                src={imageList.hotline}
                mode='aspectFit'
                lazyLoad
              />
              <Text className='sales-hotline-txt'>订购热线</Text>
            </View>
          </View>
          <View className='sales-btn-right' onClick={this.apply.bind(this)}>
            <Image
              className='sales-apply'
              src={imageList.apply}
              mode='aspectFit'
              lazyLoad
            />
            <Text className='sales-apply-txt'>马上申请</Text>
          </View>
        </View>
      </View>
    );
  }
}
