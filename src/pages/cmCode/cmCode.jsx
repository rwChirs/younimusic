import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import CommonPageComponent from '../../utils/common//CommonPageComponent';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import { exportPoint } from '../../utils/common/exportPoint';
import loginCheck from '../../utils/login_check';
import utils from '../login/util.js';

import './index.scss';

const router = getCurrentInstance().router;

/**
 * 加群中间页
 *
 * @export
 * @class CmCode
 * @extends {CommonPageComponent}
 */
export default class CmCode extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeId: 0,
    };
  }

  componentDidShow() {
    this.onPageShow();
    this.loginCheck();
  }

  componentWillMount() {
    exportPoint(router);
  }

  componentDidMount() {}

  componentDidHide() {
    this.onPageHide();
  }

  loginCheck() {
    loginCheck().then((res) => {
      if (!res) {
        const params = router.params;
        const url = `/pages/transition/transition?${Object.keys(params)
          .map((key) => (key ? `${key}=${params[key]}` : ''))
          .join('&')}`;
        console.log('loginCheck', res, router.params, url);

        utils.redirectToLogin(url);
      } else {
        this.init();
      }
    });
  }

  init = () => {
    const { storeId = '', lat = '', lon = '' } = router.params;
    //三公里定位
    getUserStoreInfo(storeId, lon, lat, '', 3)
      .then((res) => {
        this.setState({
          storeId: res.storeId || 0,
        });
      })
      .catch((err) => {
        console.log('三公里定位-err', err);
      });
  };

  onBack = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  render() {
    const { storeId } = this.state;
    return (
      <View className='page-container'>
        <View className='btn-box'>
          <Button
            openType='contact'
            sendMessageTitle='扫码加群，参加更多活动~'
            sendMessagePath={`/pages/index/index?CommunityCode=${storeId}`}
            showMessageCard='true'
            sessionFrom={`CommunityCode:${storeId}`}
            className='cm-btn'
          >
            <View>点击获取进群二维码</View>
          </Button>
          <View className='cm-btn' onClick={this.onBack}>
            已加群继续参加活动
          </View>
        </View>
        <View className='tips'>
          进入客服详情页{'>'}点击右下角卡片{'>'}获取进群二维码
        </View>
      </View>
    );
  }
}
