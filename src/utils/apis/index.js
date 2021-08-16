const app = getApp();
const Http = require('./Http.js');
const PostApi = require('./Post.js');
const CommentApi = require('./Comment.js');

const baseUrl = app.bizRequesgUrl + '/mwp/mobileDispatch';

// console.log(baseUrl);

class Apis {
  static __Ins__ = null;

  static getInstance() {
    if (Apis.__Ins__ == null) {
      Apis.__Ins__ = new Apis();
    }

    return Apis.__Ins__;
  }

  Promise = Promise;

  Post = null;
  BaseUrl = '';

  constructor() {
    this.BaseUrl = baseUrl;
    this.Post = new PostApi(this.BaseUrl);
    this.Comment = new CommentApi(this.BaseUrl);
  }
}

module.exports = Apis.getInstance();
