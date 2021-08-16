import Taro from '@tarojs/taro';
import { changeCollect } from '@7fresh/api';
/**
 * 收藏功能
 * @param {*} obj
 * @param {*} contentId
 */
export default function collect(obj, contentId) {
  const params = {
    source: 2,
    contentId: contentId || '',
    opType: obj.state.stared ? 5 : 3,
  };
  const tipTxt = obj.state.stared ? '取消收藏' : '收藏';
  changeCollect(params)
    .then((res) => {
      if (res.success) {
        obj.setState({
          stared: !obj.state.stared,
          collectCount: obj.state.collectCount + (obj.state.stared ? -1 : 1),
        });
        Taro.showToast({
          title: obj.state.stared ? tipTxt : tipTxt + '成功',
          icon: 'none',
        });
      } else {
        Taro.showToast({
          title: obj.state.stared ? tipTxt : tipTxt + '失败',
          icon: 'none',
        });
      }
    })
    .catch(() => {
      Taro.showToast(tipTxt);
    });
}
