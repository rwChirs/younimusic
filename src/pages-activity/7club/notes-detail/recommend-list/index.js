import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class RecommendList extends Component {
  //跳转话题详情
  gotoTopicDetail = args => {
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-detail/index?topicId=${(args && args.topicId) ||
        ''}`,
    });
  };

  render() {
    const { topicList } = this.props;
    return (
      <View className='recommend'>
        {topicList && topicList.length > 0 && (
          <View className='title'>话题推荐</View>
        )}
        <View className='list'>
          {topicList &&
            topicList.length > 0 &&
            topicList.map((val, i) => {
              return (
                <View className='recommend-wrap' key={i.toString()}>
                  <View
                    className='recommend-main'
                    onClick={this.gotoTopicDetail.bind(this, val)}
                  >
                    <Image
                      className='img'
                      src={filterImg(val.imgUrl)}
                      mode='aspectFill'
                    />
                    <View className='wrap'>
                      <View className='name'>
                        <View className='name-icon' />
                        <View className='name-txt'>{val.topicName}</View>
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
          {/*<View className='recommend-wrap'>*/}
          {/*<View className='recommend-main'>*/}
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
      </View>
    );
  }
}
