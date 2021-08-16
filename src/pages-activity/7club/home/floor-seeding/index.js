import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import Loading from '../../../../components/loading';

import HotTab from '../../components/hot-tab/index';
import ContentList from '../../components/content-list/index';
import NoMore from '../../components/no-more';
import './index.scss';

export default class FloorSeeding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 667,
    };
  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          windowHeight: res.windowHeight,
        });
      },
    });
  }

  onGetFixClass = (fixClass, intersectionRatio) => {
    const { onGetFixClass } = this.props;
    onGetFixClass(fixClass, intersectionRatio);
  };

  onTabChange = options => {
    const { onTabChange } = this.props;
    onTabChange(options);
  };

  render() {
    const { windowHeight } = this.state;
    const {
      onGoDetail,
      onDetail,
      onGoToMine,
      onGoToPosition,
      onGoToProDetail,
      onGoToTopicDetail,
      onAddCart,
      // onTabChange,
      data,
      listData,
      listInfo,
      currentIndex,
      onChangeCollect,
      tabId,
      onGetFixScrollTop,
      loadingData,
      tabLoading,
      onSearchDetail,
      isFixed,
      onFindSimiler,
      hasSimiler,
    } = this.props;
    return (
      <View style={{ minHeight: windowHeight + 'px' }}>
        <HotTab
          list={data.clubTab}
          index={currentIndex}
          onTabChange={this.onTabChange}
          onGetFixClass={this.onGetFixClass}
          onGetFixScrollTop={onGetFixScrollTop}
          isFixed={isFixed}
        />
        <ContentList
          onGoToProDetail={onGoToProDetail}
          onGoToTopicDetail={onGoToTopicDetail}
          onAddCart={onAddCart}
          onGoDetail={onGoDetail}
          onDetail={onDetail}
          onGoToMine={onGoToMine}
          onGoToPosition={onGoToPosition}
          listData={listData}
          onChangeCollect={onChangeCollect}
          index={tabId}
          onSearchDetail={onSearchDetail}
          onFindSimiler={onFindSimiler}
          hasSimiler={hasSimiler}
        />
        {tabLoading && <Loading tip='加载中...' />}
        {loadingData && listInfo.hasMore['hasMore' + tabId] && (
          <View
            className='data-loading'
            style={{
              marginTop:
                listData &&
                listData['list' + tabId] &&
                listData['list' + tabId].length > 0
                  ? 0
                  : '100rpx',
            }}
          >
            <Image
              className='load-img'
              src='https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png'
              lazyLoad
            />
          </View>
        )}

        {listData &&
          listData &&
          listData['list' + tabId] &&
          listData['list' + tabId].length > 0 &&
          !listInfo.hasMore['hasMore' + tabId] && <NoMore height={px2vw(80)} />}

        {listData &&
          (!listData ||
            (listData &&
              listData['list' + tabId] &&
              listData['list' + tabId].length < 1)) && (
            <View
              className='empty-page'
              style={{
                height: px2vw(windowHeight * 2 - 100),
              }}
            >
              <View className='empty-img' />
              <Text className='empty-txt'>暂无数据</Text>
            </View>
          )}
      </View>
    );
  }
}
