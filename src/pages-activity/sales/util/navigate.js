import Taro from '@tarojs/taro';
import utils from '../../../pages/login/util';
/**
 * 跳转页面适配h5和小程序
 * @param {String} type 跳转页面
 * @param {Object} obj 参数
 */
export const navigateSwitch = (type) =>{
  /**
   * 去首页
   */
  if (type === 'home') {
      Taro.switchTab({
        url: '/pages/index/index',
      });
  }

  /**
   * 登录页
   */
  if (type === 'login') {
      utils.redirectToLogin(`/pages-activity/sales/index/index`);
  }

  /*
   * 个人中心
   */
  if (type === 'self') {
      Taro.switchTab({
        url: '/pages/my/index',
      });
  }
}
