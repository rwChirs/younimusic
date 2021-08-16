import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowing: false,
    };
  }

  onShowAll = e => {
    e.stopPropagation();
    const { isShowAll, onShowAll } = this.props;
    if (!isShowAll) return;
    if (!this.state.isShowing) {
      this.setState(
        {
          isShowing: true,
        },
        () => {
          onShowAll();
        }
      );
    }
  };

  componentDidShow() {
    this.setState({
      isShowing: false,
    });
  }

  render() {
    const { data, isShowAll, onGoToDetail } = this.props;
    return (
      <View className='topic-list'>
        <ScrollView
          scrollX
          scrollWithAnimation
          onScrollToLower={this.onShowAll.bind(this)}
          lowerThreshold={50}
          className='scroll-wrap'
        >
          <View className='topic-list-box'>
            {data &&
              data.length &&
              data.map((item, index) => (
                <View
                  className='topic-item'
                  key={index.toString()}
                  onClick={onGoToDetail.bind(this, item)}
                >
                  <Image
                    className='img'
                    src={filterImg(item.imgUrl)}
                    mode='aspectFill'
                  />
                  <View className='topic-mask1'></View>
                  <View className='topic-mask2'></View>
                  <View className='topic-mask3'></View>
                  <View className='topic-con'>
                    <View className='title'>
                      <View className='tag-icon'></View>
                      <View className='txt'>{item.topicName}</View>
                    </View>
                    <View className='tag'>
                      {item.browseNum
                        ? `${item.browseNum}人关注`
                        : item.partakeNum
                        ? `${item.partakeNum}人关注`
                        : ''}
                      {(item.browseNum || item.partakeNum) && (
                        <Text className='line'></Text>
                      )}
                      参与话题
                    </View>
                  </View>
                </View>
              ))}
            {isShowAll && (
              <View className='more-box'>
                <View className='more' onClick={this.onShowAll.bind(this)}>
                  全部<View className='arrow'></View>
                </View>
                <View className='empty-box'> </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
