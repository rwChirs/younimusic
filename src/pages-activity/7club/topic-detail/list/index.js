import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import { switchNum } from '../../utils';
import './index.scss';
import { onGoToMine } from '../../common/common';
import { get7clubPath, images } from '../../utils';

export default class List extends Component {
  //跳转7club详情
  gotoNotesDetail = option => {
    if (!option.contentId) return;

    if (option.contentType === 3) {
      Taro.showToast({
        title: '小程序暂不支持视频播放',
        icon: 'none',
      });
      return;
    }

    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  onPartake = (args, index) => {
    const { onPartake } = this.props;
    onPartake && typeof onPartake === 'function' && onPartake(args, index);
  };

  onErrImg = (args, index) => {
    const { onErrImg } = this.props;
    onErrImg && typeof onErrImg === 'function' && onErrImg(args, index);
  };

  onErrItemsImg = (args, index) => {
    const { onErrItemsImg } = this.props;
    onErrItemsImg &&
      typeof onErrItemsImg === 'function' &&
      onErrItemsImg(args, index);
  };

  gotoClubMine = args => {
    console.log('args=====', args);
    const isOpenedTopicDetail = Taro.getStorageSync('isOpenedTopicDetail');
    if (isOpenedTopicDetail) {
      this.props.onBodyScroll();
    }
    onGoToMine(args);
  };

  render() {
    const { clubNotesList, isShowLayer } = this.props;
    return (
      <View className='page-container'>
        <View
          className='page-main'
          style={{
            justifyContent:
              clubNotesList &&
              clubNotesList.length === 1 &&
              JSON.stringify(clubNotesList[0]) !== '{}'
                ? ''
                : 'center',
            marginLeft:
              clubNotesList &&
              clubNotesList.length === 1 &&
              JSON.stringify(clubNotesList[0]) !== '{}'
                ? '20rpx'
                : '',
          }}
        >
          {clubNotesList && clubNotesList.length > 0 && (
            <View className='items-list'>
              {clubNotesList
                .filter((v, i) => i % 2 === 0)
                .map((val, k) => {
                  return val.contentId > 0 ? (
                    <View
                      className='items-info'
                      key={k.toString()}
                      role='button'
                      tabIndex='0'
                    >
                      <View
                        className='items-info-main'
                        onClick={this.gotoNotesDetail.bind(this, val)}
                      >
                        <View
                          className='items-img'
                          style={{
                            height: `${
                              val.radio > 0 ? 338 / val.radio : 338 / (4 / 3)
                            }rpx`,
                          }}
                        >
                          <Image
                            className='img'
                            src={filterImg(val.coverImg)}
                            style={{
                              height: `${
                                val.radio > 0 ? 338 / val.radio : 338 / (4 / 3)
                              }rpx`,
                            }}
                            mode='aspectFill'
                            onError={this.onErrItemsImg.bind(this, val, k * 2)}
                          />
                          {val.contentType === 3 && (
                            <View className='play-btn' />
                          )}
                          {val.isTop && <View className='is-top-icon' />}
                        </View>
                        <View className='items-name'>{val.title}</View>
                      </View>
                      <View
                        className={`items-ext-container ${
                          k === 0 && isShowLayer === true ? 'has-flag' : ''
                        }`}
                      >
                        {k === 0 && isShowLayer === true && (
                          <View className='user-info-flag' />
                        )}
                        <View className='items-ext'>
                          {val.author && (
                            <View
                              className='user-info'
                              onClick={this.gotoClubMine.bind(this, val.author)}
                            >
                              {val.author.headIcon && (
                                <View className='user-icon'>
                                  <Image
                                    className='user-icon-img'
                                    src={
                                      val.author.headIcon ||
                                      'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png'
                                    }
                                    onError={this.onErrImg.bind(
                                      this,
                                      val,
                                      k * 2
                                    )}
                                  />
                                </View>
                              )}
                              {val.author.authorNickName && (
                                <View className='user-name'>
                                  {val.author.authorNickName}
                                </View>
                              )}
                            </View>
                          )}
                          <View
                            className='items-praise'
                            role='button'
                            tabIndex='0'
                            onClick={this.onPartake.bind(this, val, k * 2)}
                          >
                            <View
                              className='items-praise-icon'
                              style={{
                                backgroundSize: val.ifLike
                                  ? val.random
                                    ? '100%'
                                    : '60%'
                                  : '60%',
                                backgroundImage: val.ifLike
                                  ? val.random
                                    ? `url(${images.praiseSelectedGif}?t=${val.random})`
                                    : `url(${images.praiseSelectedImg})`
                                  : `url(${images.praiseDefaultImg})`,
                              }}
                            />
                            <View className='items-praise-num'>
                              {switchNum(val.likeCount) || '点赞'}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    ''
                  );
                })}
            </View>
          )}

          {clubNotesList && clubNotesList.length > 1 && (
            <View className='items-list'>
              {clubNotesList
                .filter((v, i) => i % 2 !== 0)
                .map((val, k) => {
                  return val.contentId > 0 ? (
                    <View
                      className='items-info'
                      key={k.toString()}
                      role='button'
                      tabIndex='0'
                    >
                      <View
                        className='items-info-main'
                        onClick={this.gotoNotesDetail.bind(this, val)}
                      >
                        <View
                          className='items-img'
                          style={{
                            height: `${
                              val.radio > 0 ? 338 / val.radio : 338 / (4 / 3)
                            }rpx`,
                          }}
                        >
                          <Image
                            className='img'
                            src={filterImg(val.coverImg)}
                            style={{
                              height: `${
                                val.radio > 0 ? 338 / val.radio : 338 / (4 / 3)
                              }rpx`,
                            }}
                            mode='aspectFill'
                            onError={this.onErrItemsImg.bind(
                              this,
                              val,
                              k * 2 + 1
                            )}
                          />
                          {val.contentType === 3 && (
                            <View className='play-btn' />
                          )}
                          {val.isTop && <View className='is-top-icon' />}
                        </View>
                        <View className='items-name'>{val.title}</View>
                      </View>
                      <View className='items-ext-container'>
                        <View className='items-ext'>
                          {val.author && (
                            <View
                              className='user-info'
                              onClick={this.gotoClubMine.bind(this, val.author)}
                            >
                              {val.author.headIcon && (
                                <View className='user-icon'>
                                  <Image
                                    className='user-icon-img'
                                    src={
                                      val.author.headIcon ||
                                      'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png'
                                    }
                                    onError={this.onErrImg.bind(
                                      this,
                                      val,
                                      k * 2 + 1
                                    )}
                                  />
                                </View>
                              )}
                              {val.author.authorNickName && (
                                <View className='user-name'>
                                  {val.author.authorNickName}
                                </View>
                              )}
                            </View>
                          )}
                          <View
                            className='items-praise'
                            role='button'
                            tabIndex='0'
                            onClick={this.onPartake.bind(this, val, k * 2 + 1)}
                          >
                            <View
                              className='items-praise-icon'
                              style={{
                                backgroundSize: val.ifLike
                                  ? val.random
                                    ? '100%'
                                    : '60%'
                                  : '60%',
                                backgroundImage: val.ifLike
                                  ? val.random
                                    ? `url(${images.praiseSelectedGif}?t=${val.random})`
                                    : `url(${images.praiseSelectedImg})`
                                  : `url(${images.praiseDefaultImg})`,
                              }}
                            />

                            <View className='items-praise-num'>
                              {switchNum(val.likeCount) || '点赞'}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    ''
                  );
                })}
            </View>
          )}
        </View>
      </View>
    );
  }
}
