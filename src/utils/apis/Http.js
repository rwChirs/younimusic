import Taro from '@tarojs/taro';

const plugin =
  process.env.TARO_ENV === 'weapp' ? requirePlugin('loginPlugin') : Taro;

class Http {
  static Post(url, data, success = null, fail = null, config = null) {
    let ptKey = plugin.getStorageSync('jdlogin_pt_key');

    let defaultConfig = {
      method: 'POST',
      url: url,
      data: data,
      header: { cookie: `pt_key=${ptKey}` },
    };

    if (config) {
      defaultConfig = Object.assign(defaultConfig, config);
    }

    if (success || fail) {
      defaultConfig.success = success;
      defaultConfig.fail = fail;
      wx.request(defaultConfig);
      return;
    } else {
      return new Promise(function(resolve, reject) {
        defaultConfig.success = function(res) {
          if ((res.data.code, 10) == true) {
            resolve(res.data.data);
          } else {
            console.log(res.data);
            reject(res.data);
          }
        };

        defaultConfig.fail = function(error) {
          console.log(error);
          reject(error);
        };

        wx.request(defaultConfig);
      });
    }
  }

  static Get(url, data, success = null, fail = null, config = null) {
    let ptKey = plugin.getStorageSync('jdlogin_pt_key');

    let defaultConfig = {
      method: 'GET',
      url: url,
      data: data,
      header: { cookie: `pt_key=${ptKey}` },
    };

    if (config) {
      defaultConfig = Object.assign(defaultConfig, config);
    }

    if (success || fail) {
      defaultConfig.success = success;
      defaultConfig.fail = fail;
      wx.request(defaultConfig);
      return;
    } else {
      return new Promise(function(resolve, reject) {
        defaultConfig.success = function(res) {
          if (parseInt(res.data.code, 10) == 0) {
            resolve(res.data.data);
          } else {
            console.log(res.data);
            reject(res.data);
          }
        };

        defaultConfig.fail = function(error) {
          reject(error);
        };
        wx.request(defaultConfig);
      });
    }
  }
}
module.exports = Http;
