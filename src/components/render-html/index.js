import Taro from "@tarojs/taro";
import React, { Component } from 'react';
import { View } from '@tarojs/components';
import LazyLoadImage from './lazy-load-image';
import './index.scss';

export default class RenderHtml extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          width: res.windowWidth,
        });
      },
    });
  }

  validImgUrl(url) {
    const imgReg = /^(http:|https:)?\/\//i;
    if (url && imgReg.test(url)) {
      return url;
    } else {
      return '';
    }
  }

  isZhuangbaRe(nodes) {
    return nodes.match(/<div[^>]+skudesign="100011"[^>]*>/gi);
  }

  getNodes(nodes) {
    let data = nodes;
    // 非图书音像
    if (data) {
      data = data
        .replace(/\\/gi, '')
        .replace(/\n/gi, '')
        .replace(/\r/gi, '');
    } else {
      return [];
    }

    // 装吧详情图片
    const isZhuangbaRe = /<div[^>]+skudesign="100011"[^>]*>/gi;
    if (data.match(isZhuangbaRe)) {
      const zhuangbaImgRe = /<div[^>]+id="zbViewWeChatMiniImages"[^>]+value="([^>]*)">/i;
      const host = 'https://img30.360buyimg.com';
      const hasImgs = data.match(zhuangbaImgRe);
      if (hasImgs && hasImgs.length > 1) {
        if (hasImgs[1]) {
          const imgs = hasImgs[1].split(',').map(img => `${host}${img}`);
          return imgs;
        }
      }
    }

    const imgList = [];

    // 匹配图片（g表示匹配所有结果i表示区分大小写）
    const imgReg = /[(&lt;)<][img|IMG].*?src=["|'](.*?)["|']/gi;
    // 匹配src属性
    const srcReg = /src=['"]?([^'"]*)['"]?/i;
    const arr = data.match(imgReg);
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        const src = arr[i].match(srcReg);
        // 获取图片地址
        if (this.validImgUrl(src[1])) {
          imgList.push(src[1]);
        }
      }
      return imgList;
    }

    const cssReg = /background-image:url\((.*?)\)/gi;
    const cssImg = data.match(cssReg);
    if (cssImg) {
      for (let j = 0; j < cssImg.length; j++) {
        if (cssImg[j].indexOf('360buyimg')) {
          const imgurl = cssImg[j]
            .replace('background-image:url(', '')
            .replace(')', '');
          if (this.validImgUrl(imgurl)) {
            imgList.push(imgurl);
          }
        }
      }
      return imgList;
    }

    return [];
  }

  render() {
    const { nodes } = { ...this.props };
    return (
      <View style='overflow: hidden;'>
        {this.getNodes(nodes).map((img, index) => {
          return (
            <LazyLoadImage width={this.state.width} src={img} key={index} />
          );
        })}
      </View>
    );
  }
}
