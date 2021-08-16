import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { exportPoint } from '../../utils/common/exportPoint';

export default class InvoiceDownload extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
    };
  }

  componentDidMount() {
    exportPoint(getCurrentInstance().router);
    let { filePath } = getCurrentInstance().router.params;
    let url = '';
    filePath = decodeURIComponent(filePath);
    if (filePath.indexOf('http') <= -1) {
      url = 'https:' + filePath;
    } else if (
      filePath.indexOf('http') > -1 &&
      filePath.indexOf('https') <= -1
    ) {
      let str = filePath.split('http:')[1];
      url = 'https:' + str;
    }
    this.download(url);
  }

  componentDidShow() {
    if (this.state.isOpened) {
      Taro.navigateBack();
    }
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  download = filePath => {
    Taro.downloadFile({
      url: filePath,
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          isOpened: true,
        });
        Taro.openDocument({
          filePath: res.tempFilePath,
        }).then(resp => {
          console.log('打开文档成功');
          console.log(resp);
        });
      }
    }); // 仅为示例，并非真实的资源
  };

  goHome = () => {
    Taro.navigateTo({
      url: `/pages-mine/invoice/index`,
    });
  };

  render() {
    return (
      <View className='invoice-download'>
        {/* {isLoad && (
          <Loading
            width={window.screen.availWidth}
            height={window.screen.availHeight}
          />
        )} */}
        {/* <View>
          <View className="goTop" onClick={this.goHome.bind(this)} >
            <GoTop type={'top'} onClick={this.goHome.bind(this)} />
          </View>
        </View> */}
      </View>
    );
  }
}
