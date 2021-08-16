import Taro,{getCurrentInstance} from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { getClubTopicList } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { filterImg } from '../../../utils/common/utils';
import { logClick, exportPoint } from '../utils';
import './index.scss';

export default class TopicList extends CommonPageComponent {

  constructor(props) {
    super(props);
    this.state = {
      topicInfoList: [{}],
    };
  }

  totalPage = 1;
  page = 0;
  pageSize = 20;

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    this.getStoreId();
  }

  onReachBottom() {
    this.getClubTopicListFun();
  }

  //跳转话题详情
  gotoTopicDetail = topicId => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|42',
      eparam: { topicId: topicId },
    });
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-detail/index?topicId=${topicId}`,
    });
  };

  getClubTopicListFun = () => {
    if (this.totalPage <= this.page) return;
    const { topicInfoList } = this.state;
    const params = getCurrentInstance().router.params;
    this.page++;
    const args = {
      terminalType: 2,
      page: this.page,
      pageSize: this.pageSize,
      primaryCnl: params && params.primaryCnl,
    };
    getClubTopicList(args)
      .then(res => {
        if (res) {
          if (this.page === 1 && res.totalPage) {
            this.totalPage = res.totalPage;
          }
          if (res.topicInfoList) {
            const _topicInfoList =
              this.page === 1
                ? res.topicInfoList
                : [...topicInfoList, ...res.topicInfoList];
            this.setState({
              topicInfoList: _topicInfoList,
            });
          } else {
            if (this.page === 1) {
              this.setState({
                topicInfoList: [],
              });
            }
          }
        }
      })
      .catch(() => {
        if (this.page === 1) {
          this.setState({
            topicInfoList: [],
          });
        }
      });
  };

  getStoreId = () => {
    let addressInfo = Taro.getStorageSync('addressInfo') || {};
    if (typeof addressInfo === 'string' && addressInfo) {
      addressInfo = JSON.parse(addressInfo);
    }

    let { storeId = '' } = getCurrentInstance().router.params;
    if (addressInfo && addressInfo.storeId) {
      storeId = addressInfo.storeId;
    }

    //三公里定位
    getUserStoreInfo(storeId, '', '', '', 3)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId || 131229,
          },
          () => {
            this.getClubTopicListFun();
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { topicInfoList } = this.state;
    return (
      <View className='container'>
        {(!topicInfoList || topicInfoList.length === 0) && (
          <View className='empty'>
            <Image
              className='empty-img'
              src='https://m.360buyimg.com/img/jfs/t1/111498/37/8363/15086/5ece50cfE9fc31460/8db01092b75ddd49.png'
            />
            <View className='empty-txt'>暂未有话题，敬请期待~</View>
          </View>
        )}

        {topicInfoList &&
          topicInfoList.length > 0 &&
          JSON.stringify(topicInfoList[0]) !== '{}' && (
            <View className='list'>
              {topicInfoList.map((val, i) => {
                return (
                  <View key={i.toString()} className='topic-wrap'>
                    <View
                      className='topic-main'
                      onClick={this.gotoTopicDetail.bind(this, val.topicId)}
                    >
                      <Image
                        className='img'
                        src={filterImg(val.imgUrl)}
                        mode='aspectFill'
                      />
                      <View className='wrap'>
                        <View className='name'>
                          <View className='name-icon' />
                          <View className='name-txt'>
                            {val.topicName || ''}
                          </View>
                        </View>
                        <View className='ext'>
                          <Text className='ext-info'>
                            {val.browseNum || 0}人浏览
                          </Text>
                          <View className='ext-info-line' />
                          <Text className='ext-info'>
                            {val.partakeNum || 0}人参与
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/*<View className='topic-wrap'>*/}
              {/*<View className='topic-main'>*/}
              {/*<Image className='img' src='' />*/}
              {/*<View className='wrap'>*/}
              {/*<View className='name'>*/}
              {/*<View className='name-icon'></View>*/}
              {/*<View>测试测试测试测试</View>*/}
              {/*</View>*/}
              {/*<View className='ext'>*/}
              {/*<Text className='ext-info'>100次浏览</Text>*/}
              {/*<View className='ext-info-line'></View>*/}
              {/*<Text className='ext-info'>10次参与</Text>*/}
              {/*</View>*/}
              {/*</View>*/}
              {/*</View>*/}
              {/*</View>*/}
            </View>
          )}
      </View>
    );
  }
}
