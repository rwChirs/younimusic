import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Textarea, Input } from '@tarojs/components';
import './index.css';

export default class RecommendInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommend: {
        info: '',
        tags: ['', '', ''],
      },
      textLen: 100,
      sayDesc: '',
    };
  }

  onRecommendChange = e => {
    const value = e.detail.value;
    if (value) {
      this.setState(
        {
          recommend: {
            ...this.state.recommend,
            info: value,
          },
          textLen: 100 - value.length <= 0 ? 0 : 100 - value.length,
        },
        () => {
          this.props.onTextChange(this.state.recommend);
        }
      );
    }
  };

  onTagChange = (index, e) => {
    console.log(index, e.detail.value);
    this.setState(
      {
        recommend: {
          ...this.state.recommend,
          tags: this.state.recommend.tags.map((tag, i) => {
            if (index === i) {
              return e.detail.value;
            }
            return tag;
          }),
        },
      },
      () => {
        this.props.onTextChange(this.state.recommend);
      }
    );
  };

  componentDidMount() {
    console.log(this.props.shareInfo);

    const shareInfo = this.props.shareInfo;
    const data = shareInfo ? shareInfo : null;
    let sayDesc,
      recommendation,
      tagList = [],
      length = 0;
    if (data) {
      sayDesc = shareInfo ? shareInfo.sayDesc : '我想说：';
      recommendation = data.recommendation
        ? data.recommendation
        : shareInfo
        ? shareInfo.recommendDefault
        : '';
      length = recommendation ? recommendation.length : 0;
      for (let i = 0; i < 3; i++) {
        if (data.tags[i]) {
          tagList.push(data.tags[i]);
        } else {
          tagList.push('');
        }
      }
    }
    this.setState({
      textLen: 100 - length,
      sayDesc: sayDesc,
      recommend: {
        info: recommendation,
        tags: tagList,
      },
    });
  }

  render() {
    const { textLen, sayDesc, recommend } = this.state;

    return (
      <View className='recommendInfo'>
        {/* <View className='mask' /> */}
        <View className='r-top'>
          <View className='userAvatarUrl'>
            <open-data type='userAvatarUrl' default-text='myIcon'></open-data>
          </View>
          <View className='text'>{sayDesc}</View>
        </View>
        <View className='recommend-content'>
          <Textarea
            className='recommend-textarea'
            maxlength={100}
            placeholder='给这个商品写句你的推荐语吧～'
            onInput={this.onRecommendChange.bind(this)}
            value={recommend.info}
            catchtouchmove={this.handleMove.bind(this)}
            fixed='true'
          />
          <View className='recommend-textarea-num'>剩余{textLen}字</View>
        </View>

        <View className='phrase'>推荐关键词</View>
        <View className='des'>至少输入1个关键词，每个关键词2-4个字</View>
        <View className='phrase-input'>
          {recommend.tags.map((tag, index) => {
            return (
              <Input
                className='recommend-input'
                key={index}
                maxLength={4}
                minLength={2}
                onInput={this.onTagChange.bind(this, index)}
                value={tag}
              />
            );
          })}
        </View>
      </View>
    );
  }
}
