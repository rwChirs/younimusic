import Taro from '@tarojs/taro';
const Http = require('./Http.js');

const plugin =
  process.env.TARO_ENV === 'weapp' ? requirePlugin('loginPlugin') : Taro;

const ptPin = plugin.getStorageSync('jdlogin_pt_pin');
const uuid = plugin.getStorageSync('jdlogin_guid');

class PostApi {
  baseUrl = '';

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // 获取社区帖子列表
  getPostList(data = {}) {
    let initData = {
      api: 'freshminip.post.postList',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }

  // 获取我的帖子
  getMyPostList(data = {}) {
    let initData = {
      api: 'freshminip.myPost.postList',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }

  // 发布帖子
  publishStory(data = {}) {
    let initData = {
      api: 'freshminip.myPost.publishStory',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      functionId: 'pubStory',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }

  // 帖子详情
  postDetail(data = {}) {
    let initData = {
      api: 'freshminip.myPost.postDetail',
      osVersion: 1,
      pin: ptPin,
      uuid,
      client: 'm',
      appName: 'freshminip',
      data: JSON.stringify(data),
    };

    return Http.Get(this.baseUrl, initData);
  }

  // 对帖子操作
  postStoryAction(data = {}) {
    let initData = {
      api: 'freshminip.myPost.postStoryAction',
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

module.exports = PostApi;
