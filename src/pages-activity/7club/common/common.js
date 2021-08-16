import Taro from '@tarojs/taro';
import { logClick } from '../utils';

/**
 * 跳转7club个人中心
 */
const onGoToMine = (author, ev) => {
  ev && ev.stopPropagation();
  logClick({ eid: '7FRESH_miniapp_2_1578553760939|17' });
  if (!author) {
    Taro.showToast({
      title: '暂无个人主页',
      icon: 'none',
      duration: 2000,
    });
    return;
  }
  Taro.navigateTo({
    url: `/pages-activity/7club/club-mine/index?authorNickName=${(author &&
      author.authorNickName) ||
      ''}&author=${author.author || ''}&avatar=${author.headIcon}`,
  });
};

export { onGoToMine };
