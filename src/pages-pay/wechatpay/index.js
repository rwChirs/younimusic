import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { svpSettlementGetPayParam } from '@7fresh/api';
import CommonPageComponent from '../../utils/common/CommonPageComponent';
import { wePay } from '../../utils/common/jdpayWePay';

export default class Wechatpay extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      dealId: '',
      price: '',
      source: '',
      failRedirectUrl: '',
      successRedirectUrl: '',
    };
  }

  componentDidShow() {
    let { dealId, price } = getCurrentInstance().router.params;
    this.svpSettlementGetPayParam({
      orderId: dealId,
      amount: (price / 100).toFixed(2),
    });
  }

  // 获取京东支付参数
  svpSettlementGetPayParam = (params) => {
    svpSettlementGetPayParam(params)
      .then((data) => {
        console.log('7fresh.svp.settlement.getPayParam', data);
        if (data && data.payParam) {
          const payParam = data.payParam;
          // 解码payParam后微信支付
          this.callBackFun(payParam);
        }
      })
      .catch((err) => {
        Taro.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        });
      });
  };

  callBackFun = (payParam) => {
    let { failRedirectUrl, successRedirectUrl } =
      getCurrentInstance().router.params;
    wePay({ payParam: payParam, appId: 'jd7FreshMini' }, (res) => {
      console.log('【支付回调】:', res);
      Taro.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
      });
      if (res.code === 1) {
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/login/wv-common/wv-common?h5_url=${successRedirectUrl}`,
          });
        }, 3000);
      } else {
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/login/wv-common/wv-common?h5_url=${failRedirectUrl}`,
          });
        }, 2000);
      }
    });
  };

  render() {
    return <View></View>;
  }
}
