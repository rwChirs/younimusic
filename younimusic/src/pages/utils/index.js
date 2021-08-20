/**
 * 单位转换：px转换为vw
 * @function
 * @param {number} value 数值
 */
export const px2vw = number => {
  const val = (100 / 750) * number;
  return `${val}vw`;
};
/**
 * 根据宽高比返回高度
 * @function
 * @param {width} value 带vw的数值-宽度
 * @param {ratio}  宽高比
 */
export const getHeightWithRatio = (width, ratio) => {
  const num = Number(width.replace("vw", ""));
  const height = num / ratio;
  return `${height}vw`;
};
/**
 * 判断浏览器是否支持webp - 支持返回true - 不支持返回false
 * @function
 */
export const webpSupport = () => {
  try {
    return (
      document
        .createElement("canvas")
        .toDataURL("image/webp")
        .indexOf("data:image/webp") === 0
    );
  } catch (err) {
    return false;
  }
};

/**
 * 获取图片宽高比
 * @function
 * @param {*} img - 图片元素
 */
export const getImageAspect = img => {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  return width / height;
};

/**
 * 不同屏幕数值运算得出真实数值
 * @function
 * @param {*} value
 */
export const getRealValue = value => {
  return parseFloat(((value * window.innerWidth) / 750).toFixed(2));
};

/**
 * 不同屏幕真实数值运算得出css数值
 * @function
 * @param {*} value
 */
export const getCssValue = value => {
  return parseFloat(((value * 750) / window.innerWidth).toFixed(2));
};

// 获取页面滚动高度
export const getScrollTop = el => {
  return el
    ? el.scrollTop
    : document.body.scrollTop ||
        document.documentElement.scrollTop ||
        window.pageYOffset;
};

const scrollTo = (y, el) => {
  if (el) {
    // eslint-disable-next-line no-param-reassign
    el.scrollTop = y;
  } else {
    window.scrollTo(0, y);
  }
};

// 页面滚动动画
export const windowScrollTo = (yPos, el) => {
  if (yPos === undefined) return;
  const ypos = Math.min(
    yPos,
    el
      ? el.scrollHeight - el.clientHeight
      : document.body.scrollHeight - document.documentElement.clientHeight
  );
  const curScrollTop = getScrollTop(el);
  const scrollDistance = ypos - curScrollTop;
  if (scrollDistance === 0) return;
  if (Math.abs(scrollDistance) < 20) {
    scrollTo(ypos, el);
    return;
  }

  const scrollStep =
    Math.max(Math.abs(scrollDistance) / 20, 20) * (scrollDistance > 0 ? 1 : -1);

  try {
    if (window.freshUiScrollTimer) clearInterval(window.freshUiScrollTimer);
  } catch (error) {
    // console.error(error)
  }

  const t = setInterval(() => {
    const top = getScrollTop(el);
    if (top === ypos) {
      clearInterval(t);
      return;
    }
    if (Math.abs(ypos - top) <= Math.abs(scrollStep)) {
      clearInterval(t);
      scrollTo(ypos, el);
    } else {
      scrollTo(top + scrollStep, el);
    }
  }, 1);

  window.freshUiScrollTimer = t;
};

/*
 * scroll 定位，获取scrollLeft
 * index: 当前选中的元素
 * width： 宽度
 * showNum: 一屏展示数量
 */
export const getScrollLeft = (index, width) => {
  return index + 1 > 3 ? (index - 1) * getRealValue(width / 4) : 0;
};

export const transformTime = seconds => {
  const day = Math.floor(seconds / 3600 / 24);
  const hour = Math.floor((seconds - day * 24 * 3600) / 3600);
  const minute = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60);
  const second = Math.floor(
    seconds - day * 24 * 3600 - hour * 3600 - minute * 60
  );

  const date = {
    day: day < 10 ? `0${day}天` : `${day}天`,
    hour: hour < 10 ? `0${hour}:` : `${hour}:`,
    minute: minute < 10 ? `0${minute}:` : `${minute}:`,
    second: second < 10 ? `0${second}` : second
  };

  const dateTime = date.hour + date.minute + date.second;
  return dateTime;
};

export const addCartAction = (ev, data, ref) => {
  if (data.isPop) {
    return;
  }
  const imageUrl = filterImgOld(data.imageUrl, "");

  // 创建dom
  const div = document.createElement("div");
  div.className = "cart-action";
  div.style.backgroundImage = `url(${imageUrl})`;
  div.style.backgroundRepeat = "no-repeat";
  div.style.backgroundSize = "100%";
  div.style.borderRadius = "50%";
  div.style.width = `${px2vw(140)}`;
  div.style.height = `${px2vw(140)}`;
  // div.style.opacity = '0.8';
  div.style.transition =
    "left 500ms linear, top 500ms ease-in, width 500ms linear, height 500ms linear"; // , opacity 500ms linear
  div.style.position = "fixed";
  div.style.zIndex = "18";

  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  // 当前点击位置的x/y
  let startTop = 0;
  let startLeft = 0;
  // 获取初始dom位置并添加到新创建的dom上
  if (ref.current) {
    const parentsObj = ref.current.getBoundingClientRect();
    startLeft = (parentsObj.left * 750) / windowWidth;
    startTop = (parentsObj.top * 750) / windowWidth;
  }
  div.style.left = `${px2vw(startLeft)}`;
  div.style.top = `${px2vw(startTop)}`;

  // 运动的最终位置
  const cartNum = document.getElementById("float-cart");
  let endTop = 0;
  if (cartNum) {
    const cartNumObj = cartNum.getBoundingClientRect();
    endTop = ((cartNumObj.top + 20) * 750) / windowWidth;
  }

  if (
    document.getElementsByClassName("channel") &&
    document.getElementsByClassName("channel")[0] &&
    (!document.getElementsByClassName("extension") ||
      !document.getElementsByClassName("extension")[0])
  ) {
    const channel = document.getElementsByClassName("channel")[0];
    channel.appendChild(div);
    setTimeout(() => {
      div.style.left = `${px2vw(700)}`;
      div.style.top = `${px2vw(endTop)}`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      channel.removeChild(div);
    }, 3000);
    return;
  }

  if (
    document.getElementsByClassName("extension") &&
    document.getElementsByClassName("extension")[0]
  ) {
    const extension = document.getElementsByClassName("extension")[0];
    extension.appendChild(div);
    setTimeout(() => {
      div.style.left = `${px2vw(100)}`;
      div.style.top = `${px2vw(endTop)}`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      extension.removeChild(div);
    }, 3000);
    return;
  }

  if (
    document.getElementsByClassName("home") &&
    document.getElementsByClassName("home")[0]
  ) {
    const home = document.getElementsByClassName("home")[0];
    home.appendChild(div);

    setTimeout(() => {
      div.style.left = `${px2vw(480)}`;
      div.style.top = `94vh`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      home.removeChild(div);
    }, 3000);
    return;
  }
  // 计算字符串宽度

  // 支付结果页
  if (
    document.getElementsByClassName("groupon-pay") &&
    document.getElementsByClassName("groupon-pay")[0]
  ) {
    const home = document.getElementsByClassName("groupon-pay")[0];
    home.appendChild(div);

    setTimeout(() => {
      div.style.left = `${px2vw(680)}`;
      div.style.top = `${px2vw(endTop)}`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      home.removeChild(div);
    }, 3000);
    return;
  }

  // 二级分类页

  if (
    document.getElementsByClassName("category2") &&
    document.getElementsByClassName("category2")[0]
  ) {
    const home = document.getElementsByClassName("category2")[0];
    home.appendChild(div);

    setTimeout(() => {
      div.style.left = `${px2vw(680)}`;
      div.style.top = `${px2vw(endTop)}`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      home.removeChild(div);
    }, 3000);
    return;
  }

  // 有右下角购物车 float-cart
  if (cartNum) {
    const App = document.getElementsByTagName("body")[0];
    App.appendChild(div);
    setTimeout(() => {
      div.style.left = `${px2vw(700)}`;
      div.style.top = `${px2vw(endTop)}`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      App.removeChild(div);
    }, 3000);
  }

  // 商详搭配购
  if (
    document.getElementsByClassName("recommendTail") &&
    document.getElementsByClassName("recommendTail")[0]
  ) {
    const home = document.getElementsByClassName("recommendTail")[0];
    home.appendChild(div);

    setTimeout(() => {
      div.style.left = `${px2vw(95)}`;
      div.style.top = `95vh`;
      div.style.width = `${px2vw(12)}`;
      div.style.height = `${px2vw(12)}`;
    }, 20);
    setTimeout(() => {
      home.removeChild(div);
    }, 3000);
  }
};

export const strLen = str => {
  let chinese = 0;
  let english = 0;

  if (str && str.length > 0 && str.match(/[a-zA-z0-9]/g) != null) {
    english = str.match(/[a-zA-z0-9]/g).length;
  }
  chinese = str.length - english;
  const strLength = english > 0 ? chinese + english / 2 + 0.5 : chinese;
  return strLength;
};

// 将color HEx格式转为rgb，适配不同浏览器

const isValidHex = hex => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const getChunksFromString = (st, chunkSize) =>
  st.match(new RegExp(`.{${chunkSize}}`, "g"));

const convertHexUnitTo256 = hexStr =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16);

const getAlphafloat = (a, alpha) => {
  if (typeof a !== "undefined") {
    return a / 256;
  }
  if (typeof alpha !== "undefined") {
    if (alpha > 1 && alpha <= 100) {
      return alpha / 100;
    }
    if (alpha >= 0 && alpha <= 1) {
      return alpha;
    }
  }
  return 1;
};

export const hexToRGBA = (hex, alpha) => {
  if (!isValidHex(hex)) {
    return "";
  }
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`;
};

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 * */
export const accAdd = (arg1, arg2) => {
  let r1;
  let r2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  const c = Math.abs(r1 - r2);
  // eslint-disable-next-line no-restricted-properties
  const m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    // eslint-disable-next-line no-restricted-properties
    const cm = Math.pow(10, c);
    if (r1 > r2) {
      // eslint-disable-next-line no-param-reassign
      arg1 = Number(arg1.toString().replace(".", ""));
      // eslint-disable-next-line no-param-reassign
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      // eslint-disable-next-line no-param-reassign
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      // eslint-disable-next-line no-param-reassign
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    // eslint-disable-next-line no-param-reassign
    arg1 = Number(arg1.toString().replace(".", ""));
    // eslint-disable-next-line no-param-reassign
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
};

// 给Number类型增加一个add方法，调用起来更加方便。
// eslint-disable-next-line no-extend-native
Number.prototype.add = function(arg) {
  return accAdd(arg, this);
};

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 * */
export const accSub = (arg1, arg2) => {
  let r1;
  let r2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  // eslint-disable-next-line no-restricted-properties
  const m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
  const n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
};

// 给Number类型增加一个mul方法，调用起来更加方便。
// eslint-disable-next-line no-extend-native
Number.prototype.sub = function(arg) {
  return accSub(arg, this);
};

// 判断手机型号
// export const isIphoneNew = () => {
//   // iPhone X、iPhone XS
//   var isIPhoneX =
//     /iphone/gi.test(window.navigator.userAgent) &&
//     window.devicePixelRatio &&
//     window.devicePixelRatio === 3 &&
//     window.screen.width === 375 &&
//     window.screen.height === 812
//   // iPhone XS Max
//   var isIPhoneXSMax =
//     /iphone/gi.test(window.navigator.userAgent) &&
//     window.devicePixelRatio &&
//     window.devicePixelRatio === 3 &&
//     window.screen.width === 414 &&
//     window.screen.height === 896
//   // iPhone XR
//   var isIPhoneXR =
//     /iphone/gi.test(window.navigator.userAgent) &&
//     window.devicePixelRatio &&
//     window.devicePixelRatio === 2 &&
//     window.screen.width === 414 &&
//     window.screen.height === 896
//   if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) {
//     return true
//   } else {
//     return false
//   }
// }

// iphoneX以上
export const isIphoneNew = () => {
  return (
    window &&
    /iphone/gi.test(window.navigator.userAgent) &&
    window.screen.height >= 812
  );
};

export const filterImg = (img, str) => {
  let value = img
    ? img
    : "//m.360buyimg.com/img/jfs/t1/153468/16/700/3673/5f6c7b9eE41269409/c664a71f7f5ac898.png";

  if (value) {
    //图片压缩
    if (
      value.indexOf("storage.360buyimg.com") <= -1 &&
      value.indexOf("storage.jd.com") <= -1
    ) {
      if (value.indexOf("!q70") <= -1) {
        value += "!q70";
      }
      if (value.indexOf(".dpg") <= -1) {
        value += ".dpg";
      }
    }

    if (value.indexOf("//") <= -1) {
      value = "https://" + value;
    } else if (value.indexOf("http") <= -1) {
      value = "https:" + value;
    } else if (value.indexOf("http") > -1 && value.indexOf("https") <= -1) {
      str = value.split("http:")[1];
      value = "https:" + str;
    }
    if (value.indexOf("webp") > -1) {
      value = value.replace(".webp", "");
    }
    if (value.indexOf("!cc_4x3.jpg") > -1) {
      value = value.replace("!cc_4x3.jpg", "!cc_4x3");
    }
  }
  return value;
};
