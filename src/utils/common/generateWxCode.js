import Taro from '@tarojs/taro';

export const generateStoreWxCode = storeId => {
  const access_token =
    '17_CMoY1uOLi9Tu-nfnKuWBJzaqcglXfQTw4LRxfKi8zd1T859_ay0bD-tvO1G79sCmS_tRvQM-L2T9pslmeVpQ0iQuU6BZo8kmOHVEe2f6FjbWORxpJE3RfGXeyoMLNPbAEACEG';
  Taro.request({
    url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`,
    method: 'POST',
    responseType: 'arraybuffer',
    data: {
      path: `pages/index/index?storeId=${storeId}`,
    },
  })
    .then(res => {
      console.log(`data:image/png;base64,${wx.arrayBufferToBase64(res.data)}`);
    })
    .catch(err => console.log(err));
};

export const generateGrouponWxCode = () => {
  const access_token =
    '19_WBuY4uVKIaHcSuPsNFNZU0sXA4--fdlPFR1WOfDCJHlB9IMo4vyRNsptr-F-i7dqVa7jTP3F3anabDnbX8-7kyi06HJiEyO4gaSaL-1XSJvFPAHYNv5gFGaeltff9qRlH5dLLFvHRSNXfkrhLOJiADAHKF';
  Taro.request({
    url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`,
    method: 'POST',
    responseType: 'arraybuffer',
    data: {
      path: `pages/bill/bill-list/index?source=miniappqrcode&position=wxqudaoneirong`,
      width: 1280,
    },
  })
    .then(res => {
      console.log(`data:image/png;base64,${wx.arrayBufferToBase64(res.data)}`);
    })
    .catch(err => console.log(err));
};
