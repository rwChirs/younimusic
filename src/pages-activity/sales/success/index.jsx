import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { imageList } from '../util/images';
import { navigateSwitch } from '../util/navigate';
import './index.scss';

export default class SalesResult extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
    };
  }

  componentDidShow(options) {
    const { version = '' } = options;
    Taro.getSystemInfo({
      success: res => {
        this.setState(
          {
            systemInfo: res,
            version: version,
          }
        );
      },
    });
  }

  goToSelf = () => {
    navigateSwitch('self');
  };

  render() {
    return (
      <View className='sales-result-page'>
        <Image
          className='sales-result-picture'
          src={imageList.success}
          mode='aspectFit'
          lazyLoad
        />
        <View className='sales-word'>感谢您的申请</View>
        <View className='sales-tip'>
          专属客服人员将于1-3个工作日内与您取得联系请保持电话畅通
        </View>
        <View className='sales-result-btn' onClick={this.goToSelf.bind(this)}>
          返回
        </View>
      </View>
    );
  }
}
