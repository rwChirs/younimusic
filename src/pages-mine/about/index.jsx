import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import utils from '../../pages/login/util';
import './index.scss';

export default class AboutPage extends CommonPageComponent {
  config = {
    navigationBarTitleText: '关于我们',
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          type: 'h5',
          title: '关于我们',
          link: 'https://7fresh.m.jd.com/channel/?id=6702',
        },
        {
          type: 'h5',
          title: '七鲜用户协议',
          link: 'https://7fresh.m.jd.com/reg-protocal.html',
        },
        {
          type: 'h5',
          title: '七鲜隐私政策',
          link: 'https://7fresh.m.jd.com/policy.html',
        },
        {
          type: 'h5',
          title: '京东用户注册协议',
          link: 'https://wxapplogin.m.jd.com/static/registration.html',
        },
        {
          type: 'h5',
          title: '京东隐私政策',
          link: 'https://wxapplogin.m.jd.com/static/private.html',
        },
        {
          type: 'h5',
          title: '经营证照',
          link: 'https://7fresh.m.jd.com/idPhoto.html',
        },
      ],
    };
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  onClick(item) {
    if (item.type === 'h5') {
      utils.navigateToH5({
        page: item.link,
      });
    }
  }

  render() {
    return (
      <View className='list'>
        <View className='brand'>
          <Image
            className='brand-icon'
            src='//m.360buyimg.com/img/jfs/t1/136884/37/3352/648654/5efb720aEcfc6b9ae/59ac3452a6c29dfd.png'
          ></Image>
          <View className='brand-title'>七鲜</View>
        </View>
        {this.state.data.map((item, index) => {
          return (
            <View
              className='item-box'
              key={`${index}`}
              onClick={this.onClick.bind(this, item)}
            >
              <View className='item'>
                <View className='title'>{item.title}</View>
                <View className='icon'></View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
