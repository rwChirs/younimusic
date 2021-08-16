import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Image, Text } from '@tarojs/components';

import './index.scss';

export default class PackageGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDotedShow: 5,
      easyBuyLabelList: [],
    };
  }

  static defaultProps = {
    data: [],
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState(
      {
        easyBuyLabelList:
          data.easyBuyLabelList.length > 6
            ? data.easyBuyLabelList.slice(0, 6)
            : data.easyBuyLabelList,
      },
      () => {
        this.getDotedShow();
      }
    );
  }
  getDotedShow = () => {
    const query = Taro.createSelectorQuery();
    // const query = Taro.createSelectorQuery().in(this.$scope);
    query
      .selectAll('#service-desc .service-con')
      .boundingClientRect(res => {
        for (var i = 0; i < res.length; i++) {
          if (
            res &&
            res[i + 1] &&
            res[i + 1].left &&
            res[i].left &&
            res[i + 1].left < res[i].left
          ) {
            this.setState({
              serviceDotedShow: i,
            });
            return;
          }
        }
      })
      .exec();
  };
  onChange = id => {
    this.props.onChange(id);
  };

  render() {
    const { data } = this.props;
    const { serviceDotedShow, easyBuyLabelList } = this.state;
    return (
      <View className='free-buy-service'>
        <View className='service-title'>
          <Image
            className='free-img'
            src={
              data && data.easyBuyImageUrl
                ? data.easyBuyImageUrl
                : 'https://m.360buyimg.com/img/jfs/t1/155543/36/16852/5929/6018e7c2Ef8acaa0c/b1ef55ff28c853f0.png'
            }
          />
        </View>
        <View className='service-desc' id='service-desc'>
          {easyBuyLabelList.map((item, index) => {
            return (
              <View className='service-con' key={index}>
                <Text className='text-msg'>{item.name}</Text>
                <Text
                  className={`doated ${
                    serviceDotedShow === index ? ' noShow' : ''
                  }`}
                >
                  ·
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
