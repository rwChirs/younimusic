import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { getRealValue } from '../../../../utils/common/utils';
import { logClick } from '../../utils';
import './index.scss';

export default class TabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixClass: '',
      statusHeight: '',
      navHeight: '',
    };
  }
  tabTop = 0;
  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          statusHeight: res.statusBarHeight,
          navHeight: res.statusBarHeight + 44,
        });
      },
    });
  }

  componentDidMount() {
    this.getPosition();
  }

  onChangeClubNotesList = topicListType => {
    const { onChangeClubNotesList, fromPage } = this.props;
    onChangeClubNotesList &&
      typeof onChangeClubNotesList === 'function' &&
      onChangeClubNotesList(topicListType);
    if (fromPage === 'club-mine') {
      if (topicListType === 1) {
        this.logClickFun('7FRESH_miniapp_2_1578553760939|34');
      } else {
        this.logClickFun('7FRESH_miniapp_2_1578553760939|35');
      }
    } else if (fromPage === 'topic-detail') {
      if (topicListType === 1) {
        this.logClickFun('7FRESH_miniapp_2_1578553760939|39');
      } else {
        this.logClickFun('7FRESH_miniapp_2_1578553760939|40');
      }
    }
  };

  getPosition = () => {
    const targetDom = '#tab-list-space'; // 目标元素

    const top = -getRealValue(120, this.windowWidth);
    const query = Taro.createSelectorQuery();
    const { onGetFixClass, onGetFixScrollTop } = this.props;

    query.selectViewport().scrollOffset();
    try {
      this._intersectionObserver = Taro.createIntersectionObserver(this.$scope);
      this._intersectionObserver
        .relativeToViewport({ top, bottom: null })
        .observe(targetDom, (res = {}) => {
          console.log('7club吸顶', res);
          if (
            (res.intersectionRatio === 0 && res.intersectionRect.top > 0) ||
            !res
          ) {
            return;
          }
          const fixClass = res.intersectionRatio === 0 ? 'fix' : '';
          onGetFixClass &&
            typeof onGetFixClass === 'function' &&
            onGetFixClass(fixClass, res.intersectionRatio);

          this.setState({
            fixClass,
          });

          query.exec((res1 = []) => {
            console.log('取得 tab 位置', res1);
            if (res1[0]) {
              this.tabTop = res1[0].scrollTop;
              if (fixClass && res.intersectionRatio === 0) {
                onGetFixScrollTop &&
                  typeof onGetFixScrollTop === 'function' &&
                  onGetFixScrollTop(this.tabTop);
              }
            }
          });
        });
    } catch (err) {
      console.warn('版本过低不支持吸顶特性', err);
    }
  };

  logClickFun = eid => {
    logClick({ eid: eid });
  };

  render() {
    const { statusHeight, navHeight, fixClass } = this.state;
    const {
      showBack,
      onBack,
      suportNavCustom,
      clubTopicInfo,
      topicListType,
      tabList,
      fromPage,
    } = this.props;
    return (
      <View>
        {fixClass && suportNavCustom && (
          <View className='navbar' style={{ height: `${navHeight}px` }}>
            <View style={{ height: `${statusHeight}px` }} />
            <View className='title-container'>
              {showBack && (
                <View className='back-btn' onClick={onBack}>
                  <Image
                    className='image'
                    src='https://m.360buyimg.com/img/jfs/t1/35211/24/13970/1108/5d1dc088E6d087ba2/3a51555c850d5416.png'
                  />
                </View>
              )}
              <View className='tab-list-title'>
                <View className='title-name'>
                  {clubTopicInfo && clubTopicInfo.topicName}
                </View>
                {fromPage === 'topic-detail' && (
                  <View className='title-ext'>
                    <View className='title-ext-info'>
                      {(clubTopicInfo && clubTopicInfo.browseNum) || 0}人浏览
                    </View>
                    <View className='title-line' />
                    <View className='title-ext-info'>
                      {(clubTopicInfo && clubTopicInfo.partakeNum) || 0}人参与
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        <View>
          <View id='tab-list-space' />
          <View className='tab-list-container'>
            <View
              className={`${fixClass}`}
              style={{ top: suportNavCustom ? `${navHeight}px` : 0 }}
            >
              <View className='tab-list'>
                <View
                  className='tab left'
                  onClick={this.onChangeClubNotesList.bind(this, 1)}
                >
                  <View
                    className={`tab-name ${
                      topicListType === tabList[0].type ? 'cur' : ''
                    }`}
                  >
                    {tabList[0].tabName}
                    {topicListType === 1 && <View className='line' />}
                  </View>
                </View>
                <View
                  className='tab right'
                  onClick={this.onChangeClubNotesList.bind(this, 2)}
                >
                  <View
                    className={`tab-name ${
                      topicListType === tabList[1].type ? 'cur' : ''
                    }`}
                  >
                    {tabList[1].tabName}
                    {topicListType === 2 && <View className='line' />}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
