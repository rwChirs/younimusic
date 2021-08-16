// 小程序京东支付
import Taro from '@tarojs/taro';

function wePay(param, cb) {
  wx.login({
    success: function(resp) {
      if (resp.code) {
        param.code = resp.code;

        Taro.request({
          url: 'https://hpay.jd.com/weixin/miniPay',
          header: {
            'content-type': 'application/json',
          },
          method: 'POST',
          data: param,
          success(response) {
            console.log('【wePay】:', response);

            if (
              response &&
              typeof response.data !== 'undefined' &&
              response.data.success == true &&
              response.data.httpUrl
            ) {
              let temp = JSON.parse(response.data.httpUrl);
              wx.requestPayment({
                timeStamp: temp.timeStamp,
                nonceStr: temp.nonceStr,
                package: temp.package,
                signType: temp.signType,
                paySign: temp.paySign,
                success(res) {
                  console.log('successResult', res);
                  if (res.errMsg == 'requestPayment:ok') {
                    cb({
                      code: 1,
                      // message: res.errMsg,
                      message: '支付成功',
                      data: response,
                    });
                  } else {
                    cb({
                      code: 0,
                      message: res.errMsg,
                      data: response,
                    });
                  }
                },
                fail(res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    cb({
                      code: 2,
                      // message: res.errMsg,
                      message: '取消支付',
                      data: response,
                    });
                  } else {
                    cb({
                      code: 0,
                      message: res.errMsg,
                      data: response,
                    });
                  }
                },
              });
            } else {
              cb({
                code: 0,
                message:
                  response && response.data && response.data.messageInfo
                    ? response.data.messageInfo
                    : `请求支付失败~`,
                data: response,
              });
              wx.reportMonitor('0', 1);
            }
          },
          fail(err) {
            console.log('查看状态err', err);
            cb({
              code: 0,
              message: `请求支付失败.${JSON.stringify(err)}`,
              data: err,
            });
          },
        });
      } else {
        console.log('登录失败！' + resp.errMsg);
        cb({
          code: 3,
          message: '登录失败',
          data: {},
        });
      }
    },
  });
}

export { wePay };
