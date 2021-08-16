import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Button } from '@tarojs/components';
import { logClick } from '../../../../../utils/common/logReport';
import { switchNum, images } from '../../../utils';
import './index.scss';

export default class CardFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleTapLike = (type, ev) => {
    ev.stopPropagation();
    const { onChangeCollect } = this.props;
    onChangeCollect(type);
  };
  handleBtnClick = ev => {
    ev.stopPropagation();
    const { data } = this.props;
    if (data && data.contentType === 6) {
      logClick({
        eid: '7FRESH_APP_9_20200811_1597153579446|14',
        eparam: {
          contentId: data && data.contentId,
        },
      });
    }
  };
  render() {
    const { data } = this.props;
    const {
      collect,
      collectCount,
      ifLike,
      likeCount,
      likeRandom,
      collectRandom,
    } = data;
    return (
      <View className='card-footer'>
        <View className='scan' onClick={this.handleBtnClick.bind(this)}>
          <Button openType='share' className='share-btn' dataShareInfo={data} />
          {/* 浏览{seeCount || 0}次 */}
        </View>
        <View className='func'>
          <View
            className='collect-box'
            onClick={this.handleTapLike.bind(this, 'collect')}
          >
            <View
              className='like'
              style={{
                backgroundSize: collect
                  ? collectRandom
                    ? '100%'
                    : '60%'
                  : '60%',
                backgroundImage: collect
                  ? collectRandom
                    ? `url(${images.collectSelectedGif}?t=${collectRandom})`
                    : `url(${images.collectSelectedImg})`
                  : `url(${images.collectDefaultImg})`,
              }}
            />
            <View className='num'>
              {collectCount ? switchNum(collectCount) : '收藏'}
            </View>
          </View>
          <View
            className='like-box'
            onClick={this.handleTapLike.bind(this, 'like')}
          >
            <View
              className='like'
              style={{
                backgroundSize: ifLike ? (likeRandom ? '100%' : '60%') : '60%',
                backgroundImage: ifLike
                  ? likeRandom
                    ? `url(${images.praiseSelectedGif}?t=${likeRandom})`
                    : `url(${images.praiseSelectedImg})`
                  : `url(${images.praiseDefaultImg})`,
              }}
            />
            <View className='num'>
              {likeCount ? switchNum(likeCount) : '点赞'}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
