import Taro from '@tarojs/taro';

/**
 * 尺寸转换
 *
 * @export
 */
const px2vw = number => {
  return `${(100 / 750) * number}vw`;
};

/**
 * 不同屏幕css数值运算得出真实数值
 *
 * @export
 */
const getRealValue = (cssValue, windowWidth) => {
  windowWidth = windowWidth || Taro.getSystemInfoSync().windowWidth;
  return Math.round((cssValue * windowWidth) / 750);
};

/**
 * 不同屏幕真实数值运算得出css数值
 *
 * @export
 */
const getCssValue = (jsValue, windowWidth) => {
  windowWidth = windowWidth || Taro.getSystemInfoSync().windowWidth;
  return Math.round((jsValue * 750) / windowWidth);
};

const setCenterTabBarConfig = index => {
  if (typeof index !== 'number') {
    return;
  }
  const centerTabBarConfig = {
    0: {
      index: 2,
      text: '今天吃啥',
      iconPath: '/images/bill.png',
      selectedIconPath: '/images/bill-select.png',
    },
    1: {
      index: 2,
      text: '7CLUB',
      iconPath: '/images/club.png',
      selectedIconPath: '/images/club-select.png',
    },
  };
  Taro.setTabBarItem(centerTabBarConfig[index]).catch(err => {
    console.log('动态设置 tabBar 某一项的内容失败!', err);
  });
};

const checkTel = tel => {
  var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/,
    phone = /^0\d{2,3}-?\d{7,8}$/;
  return mobile.test(tel) || phone.test(tel);
};

export { px2vw, getRealValue, getCssValue, setCenterTabBarConfig, checkTel };
