import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import { switchNum, px2vw, images } from '../../utils';
import './index.scss';

export default class Item extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      onGoNotesDetail,
      onClubCollect,
      onGoToMine,
      onErrItemImg,
      onErrHeadIcon,
    } = this.props;
    data.radio = data.radio ? data.radio : 1.33;
    return data ? (
      <View className='items-info' role='button' tabIndex='0'>
        <View
          className='items-info-main'
          onClick={onGoNotesDetail.bind(this, data)}
        >
          <View
            className='items-img'
            style={{
              width: px2vw(340),
              height:
                data.contentType === 3
                  ? px2vw((340 / data.width) * data.high)
                  : px2vw(340 / data.radio),
            }}
          >
            <Image
              className='img'
              src={filterImg(data && data.coverImg)}
              mode='aspectFill'
              onError={onErrItemImg.bind(this)}
            />
            {data.contentType === 3 && <View className='play-btn' />}
          </View>
          {data.topicName && (
            <View className='topic-name'>
              <View className='topic-name-icon' />
              <View className='name'>{data.topicName || ''}</View>
            </View>
          )}
          <View className='items-name'>{data.title || ''}</View>
        </View>
        <View className='items-ext-container'>
          <View className='items-ext'>
            {data && data.author && (
              <View
                className='user-info'
                onClick={onGoToMine.bind(this, {
                  ...data.author,
                  avatar: data.author.headIcon,
                })}
              >
                {data.author.headIcon && (
                  <View className='user-icon'>
                    <Image
                      className='user-icon-img'
                      src={filterImg(data.author.headIcon)}
                      onError={onErrHeadIcon.bind(this)}
                    />
                  </View>
                )}
                {data.author.authorNickName && (
                  <View className='user-name'>
                    {data.author.authorNickName}
                  </View>
                )}
              </View>
            )}
            <View
              className='items-praise'
              role='button'
              tabIndex='0'
              onClick={onClubCollect.bind(this, data)}
            >
              <View
                className='items-praise-icon'
                style={{
                  backgroundSize: data.ifLike
                    ? data.random
                      ? '100%'
                      : '60%'
                    : '60%',
                  backgroundImage: data.ifLike
                    ? data.random
                      ? `url(${images.praiseSelectedGif}?t=${data.random})`
                      : `url(${images.praiseSelectedImg})`
                    : `url(${images.praiseDefaultImg})`,
                }}
              />
              {/* {data.collectCount && data.collectCount > 0 && ( */}
              <View className='items-praise-num'>
                {data.likeCount ? switchNum(data.likeCount) : '点赞'}
              </View>
              {/* )} */}
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View></View>
    );
  }
}
