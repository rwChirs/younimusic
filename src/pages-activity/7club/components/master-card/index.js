import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { filterImg, addHttps } from '../../../../utils/common/utils';
import { logClick } from '../../../../utils/common/logReport';
import TextWithIcon from '../text-with-icon/index';
import RecommendList from '../formal-item-card/recommend-list';
import PubTimeIcon from '../pub-time-icon/index';
import CardFooter from '../formal-item-card/card-footer';
import './index.scss';
import { images } from '../../utils';

export default class MasterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    const { data, showMore, onMoreClick, onClick } = this.props;
    const extData = data && data.extData;
    if (showMore) {
      onMoreClick(data);
      return;
    }
    onClick(extData);
  };

  handleClickMore = e => {
    e && e.stopPropagation();
    const { data, onMoreClick } = this.props;
    onMoreClick(data);
  };

  onChangeCollect = type => {
    const { data, index, onChangeCollect } = this.props;
    const extData = data && data.extData;
    onChangeCollect({
      ...extData,
      index: index,
      handlerType: type,
    });
  };

  onGoToMine = ev => {
    ev && ev.stopPropagation();
    const { data, onGoToMine } = this.props;
    const extData = data && data.extData;
    if (extData && extData.contentSubType === 1) {
      onGoToMine(extData.author);
    } else {
      Taro.showToast({
        title: '该用户尚未开通个人主页',
        icon: 'none',
      });
    }
  };

  onGoToTopicDetail = ev => {
    ev && ev.stopPropagation();
    const { data, onGoToTopicDetail } = this.props;
    const extData = data && data.extData;
    const topicId = extData && extData.topicId;
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|18',
      eparam: { topicId },
    });
    onGoToTopicDetail(topicId);
  };

  render() {
    const {
      size,
      isCurrent,
      data,
      showMore,
      showFooter,
      showBg,
      showPro,
      onGoToProDetail,
      fromHomePage,
      onAddCart,
    } = this.props;
    const extData = data && data.extData;
    const author = (extData && extData.author) || {};
    return (
      <View
        className={`star-card ${size}`}
        style={{
          backgroundImage: showBg
            ? data && data.bgImage
              ? `url(${filterImg(data.bgImage)})`
              : 'url(https://m.360buyimg.com/img/jfs/t1/51859/39/11144/101416/5d81d7e3E985249c5/41e0c8704e1565a2.png)'
            : '',
        }}
        onClick={this.handleClick.bind(this)}
      >
        <View className='title'>
          <View className='star' onClick={this.onGoToMine.bind(this)}>
            <View className='avatar-wrapper'>
              <Image
                className='avatar'
                mode='aspectFill'
                src={
                  author && author.headIcon
                    ? addHttps(author.headIcon)
                    : images.userDefaultPicture
                }
              />
            </View>
            <Text className='name'>
              {(author && author.authorNickName) || '美食达人'}
            </Text>
          </View>
          {showMore && (
            <View className='more' onClick={this.handleClickMore.bind(this)}>
              更多{' '}
              <Image
                className='arrow'
                src='https://m.360buyimg.com/img/jfs/t1/48584/39/9028/299/5d666ab5E206380e4/515a8f7fa75c4c0f.png!q70.dpg'
              />
            </View>
          )}
        </View>
        <View className='video-cover'>
          {extData && extData.contentType === 3 && (
            <Image
              className='player-img'
              src='https://m.360buyimg.com/img/jfs/t1/49240/35/9163/6656/5d6ce5ccEe47e6766/9466d3430fcd5e3e.png'
            />
          )}
          <PubTimeIcon text={isCurrent ? '本期' : '往期'} />
          <Image
            className='img'
            mode='aspectFill'
            src={filterImg((extData && extData.coverImg) || '')}
          />
        </View>
        {extData && extData.title && (
          <TextWithIcon
            content={extData.title}
            styleObj={{
              fontSize: '34rpx',
              fontWeight: 500,
              padding: 0,
            }}
            lineNum={1}
          />
        )}
        <TextWithIcon
          styleObj={{ padding: 0 }}
          content={extData && extData.preface}
          lineNum={extData && extData.title ? 2 : 3}
          isShowAll={!fromHomePage}
        />
        {!fromHomePage && extData && extData.topicId && extData.topicName && (
          <View
            onClick={this.onGoToTopicDetail.bind(this)}
            className='topic-box'
            style={{
              marginBottom:
                extData &&
                extData.wareInfoList &&
                extData.wareInfoList.length > 0
                  ? ''
                  : '24rpx',
            }}
          >
            {extData && extData.topicName}
          </View>
        )}

        {showPro &&
          extData &&
          extData.wareInfoList &&
          extData.wareInfoList.length > 0 && (
            <View className='recommend-list'>
              <RecommendList
                wareInfoList={extData && extData.wareInfoList}
                onGoToProDetail={onGoToProDetail}
                onAddCart={onAddCart}
              />
            </View>
          )}
        {showFooter && (
          <CardFooter
            data={extData && extData}
            onChangeCollect={this.onChangeCollect}
          />
        )}
      </View>
    );
  }
}
