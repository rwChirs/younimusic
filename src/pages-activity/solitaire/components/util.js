//像素转换
export const px2vw = number => {
  const val = (100 / 750) * number;
  return `${val}vw`;
};

export const webpSupport = () => {
  try {
    return (
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') == 0
    );
  } catch (err) {
    return false;
  }
};


//解决ios橡皮筋问题
export function iosTrouchFn(el) {
  //el需要滑动的元素
  el.addEventListener('touchmove', function (e) {
    e.isSCROLL = true;
  })
  document.body.addEventListener('touchmove', function (e) {
    if (!e.isSCROLL) {
      e.preventDefault(); //阻止默认事件(上下滑动)
    } else {
      //需要滑动的区域
      var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离
      var scrollH = el.scrollHeight; //含滚动内容的元素大小
      var offsetH = el.offsetHeight; //网页可见区域高
      var cScroll = top + offsetH; //当前滚动的距离

      //被滑动到最上方和最下方的时候
      if (top === 0) {
        top = 1; //0～1之间的小数会被当成0
      } else if (cScroll === scrollH) {
        el.scrollTop = top - 0.1;
      }
    }
  }, { passive: false }) //passive防止阻止默认事件不生效
}

/**
*  从网址里获取参数
*  @param name url中的请求参数
*  @return 参数值，如果没有，则返回null
*/
export function getURLParameter(url) {
  let theRequest = new Object();
  let strs = url ? url.split("&") : "";
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return theRequest;
}
