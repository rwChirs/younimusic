function request(option) {
  let succ, fail, complete /* ,cookie */;

  option = option || {};
  option.header = option.header || {};

  succ = option.success;
  fail = option.fail;
  complete = option.complete;

  //注意：可以对params加密等处理
  return wx.request(option);
}

module.exports = { ajax: request };
