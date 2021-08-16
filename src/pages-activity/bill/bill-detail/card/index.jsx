import { Component } from 'react';
import { View, Button, Image } from '@tarojs/components';
import './index.scss';

export default class Card extends Component {
  static defaultProps = {
    isMore: '',
    height: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      stateIsMore: true, // 是否隐藏
    };
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.refPreface &&
        this.refPreface.boundingClientRect().exec((res) => {
          console.log('【refs方法获取获取元素高度】:', res[0]);
          if (res[0] && res[0].height > 75) {
            this.setState({
              stateIsMore: false,
            });
          }
        });
    });
  }

  changeMore = (ev) => {
    ev.stopPropagation();
    const { onChangeMore } = this.props;
    onChangeMore();
  };

  render() {
    const {
      title,
      author,
      from,
      tags,
      cookTime,
      cookDifficult,
      preface,
      isMore,
      fromLogo,
    } = this.props;
    const { stateIsMore } = this.state;
    return (
      <View className='card'>
        <View className='top'>
          <View className='title-wrap'>
            <View className='title'>{title}</View>
            <Button className='share-btn' openType='share'>
              分享
            </Button>
          </View>
          <View className='author-wrap'>
            {/* <View className="author">疯狂的马克疯狂的马克</View> */}
            <View className='source-box'>
              {fromLogo && (
                <Image
                  className='source-logo'
                  src={
                    fromLogo.indexOf('://') > -1
                      ? fromLogo
                      : `https://${fromLogo}`
                  }
                />
              )}
              <View className='source-label'>来源</View>
              <View className='source'>{from}</View>
              {author && author.author && (
                <View className='author'>{`- ${
                  author.authorNickName || author.author
                }`}</View>
              )}
            </View>
          </View>
          <View className='tag'>
            {tags && <View className='item'>{tags}</View>}
            {tags && <View className='split-line' />}
            <View className='item'>{cookTime}</View>
            <View className='split-line' />
            <View className='item'>{cookDifficult}</View>
          </View>
          {/* <View className="time">
            <View className="date">{date}</View>
            <View className="month">{monthYear}</View>
          </View> */}
        </View>
        {preface && (
          <View className='bottom' onClick={this.changeMore}>
            <View className='preface-title'>主厨心语：</View>
            <View className='preface'>
              <View className='quote' />
              <View
                className={`preface-txt ${isMore ? '' : 'ellipsis'}`}
                // className={`preface-txt `}
                id='preface'
                style={
                  {
                    // height:`${ isMore ? 'auto' : Taro.pxTransform(140)}`,
                    // height:`${ isMore ? 'auto' : 'auto'}`,
                  }
                }
              >
                {preface}
              </View>
            </View>
            <View
              className='more'
              style={{
                display: `${stateIsMore ? 'none' : 'flex'}`,
              }}
            >
              <View className={`moreImg ${isMore ? 'rotate' : ''}`} />
            </View>

            <View className='jiludata'>
              <View className='text' ref={(ref) => (this.refPreface = ref)}>
                {preface}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
