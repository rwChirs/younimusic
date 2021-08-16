import Taro from '@tarojs/taro';

const Http = require('./Http.js');

const plugin = requirePlugin('loginPlugin');

const ptPin =
  process.env.TARO_ENV === 'weapp'
    ? plugin.getStorageSync('jdlogin_pt_pin')
    : Taro.getStorageSync('jdlogin_pt_pin');
const uuid =
  process.env.TARO_ENV === 'weapp'
    ? plugin.getStorageSync('jdlogin_guid')
    : Taro.getStorageSync('jdlogin_guid');

class CommentApi {
  baseUrl = '';

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // 获取评论列表
  commentList(data = {}) {
    let initData = {
      api: 'freshminip.post.commentList',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }

  // 发布评论
  publishComment(data = {}) {
    let initData = {
      api: 'freshminip.post.publishComment',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }
}

module.exports = CommentApi;
