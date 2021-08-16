import Taro, { getCurrentInstance } from '@tarojs/taro';
import {
  View,
  Button,
} from '@tarojs/components';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { exportPoint } from '../../utils/common/exportPoint';
import './index.scss';

export default class H5share extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 0
    };
  }

  componentDidShow() {
    this.pullShare();
    if (this.state.flag) {
      wx.navigateBack();
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  componentDidMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          windowHeight: res.windowHeight || 0,
        })
      }
    })
  }

  onPullDownRefresh = () => {
    this.pullShare();
    Taro.stopPullDownRefresh();
  };

  onShareAppMessage = () => {
    this.setState({
      flag: true,
    });

    const { title, imageUrl, path } = this.state;
    console.log('【分享前的all参数】:', title, imageUrl, path);
    return {
      title,
      imageUrl,
      path,
      success: function () { },
    };
  };

  pullShare = () => {
    const params = getCurrentInstance().router.params;
    console.log('【公共分享页地址栏参数对象】:', params);
    const url = `/pages/login/wv-common/wv-common?h5_url=${params.shareurl}`;
    this.setState({
      title:
        params && params.sharetitle
          ? decodeURIComponent(params.sharetitle)
          : '',
      imageUrl:
        params && params.shareimgurl
          ? decodeURIComponent(params.shareimgurl)
          : '',
      path: url,
    });
  };

  render() {
    const { windowHeight } = this.state
    return (
      <View>
        <View className='h5share' style={{ height: windowHeight }}>
          <Button className='sharebtnptag' openType='share'>
            {/* 分享给好友 */}
          </Button>
        </View>
      </View>
    );
  }
}
