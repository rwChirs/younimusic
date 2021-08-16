// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class RecommendSearch extends Component {
  constructor(props) {
    super(props);
  }

  getWordWidth = (word) => {
    let wordWidth = 56;
    if (word.length > 1) {
      wordWidth = 96 + (word.length - 2) * 24;
    }
    return wordWidth;
  };

  getMaxIndex = () => {
    const { data } = this.props;
    let totalW = 0,
      count = 0;
    const maxW = (338 - 30) * 5;
    let hotWordIndex = data.length;
    for (let i = 0; i < data.length; i += 1) {
      const wordW = this.getWordWidth(data[i].hotWord) + 20;
      if (wordW > 80) {
        count += 1;
      }
      totalW += wordW;
      if (totalW >= maxW || count > 5) {
        hotWordIndex = i;
        break;
      }
    }
    return hotWordIndex;
  };

  onGoSearch = (args) => {
    const { onGoSearch } = this.props;
    onGoSearch && onGoSearch(args);
  };

  render() {
    const { data, itemStyle } = this.props;
    return (
      <View>
        {data && data.length > 5 && (
          <View className='container' style={itemStyle}>
            <View className='title-container'>
              <View className='title-img' />
            </View>
            <View className='word-container'>
              <View className='word-main'>
                {data.map((val, i) => {
                  return i < this.getMaxIndex() ? (
                    <View
                      className='word'
                      key={i.toString()}
                      onClick={this.onGoSearch.bind(this, val)}
                    >
                      {val.hotWord}
                    </View>
                  ) : (
                    ''
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
