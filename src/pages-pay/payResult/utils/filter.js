import { userDefaultPicture, productDefaultPicture } from '../utils/images';

/**
 * 尺寸转换
 *
 * @export
 */
export const px2vw = number => {
  return `${(100 / 750) * number}vw`;
};

export function filterImg(img, str) {
  let value = '';
  if (str === 'user') {
    value = img ? img : userDefaultPicture;
  } else {
    value = img ? img : productDefaultPicture;
  }
  if (value) {
    if (value.indexOf('http') <= -1) {
      return 'https:' + value;
    } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
      let txt = value.split('http:')[1];
      return 'https:' + txt;
    } else if (value.indexOf('webp') > -1) {
      let txt = value.replace('.webp', '');
      return txt;
    } else {
      return value;
    }
  } else {
    return value;
  }
}

/**
 * 截取字符串
 *
 * @export
 * @param {*} word 文案
 * @param {*} number 截取长度
 */
export function filterDescription(word, number) {
  if (word) {
    if (word.length > number) {
      let value = word.substring(0, number);
      return value + '...';
    } else {
      return word;
    }
  } else {
    return '';
  }
}

/**
 * 转化时间
 */

export function transformTime(seconds) {
  let day = Math.floor(seconds / 3600 / 24);
  let hour = Math.floor((seconds - day * 24 * 3600) / 3600);
  let minute = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60);
  let second = Math.floor(
    seconds - day * 24 * 3600 - hour * 3600 - minute * 60
  );

  (day = day < 10 ? `${day}` : day),
    (hour = hour < 10 ? `0${hour}` : hour),
    (minute = minute < 10 ? `0${minute}` : minute),
    (second = second < 10 ? `0${second}` : second);

  return day + ' 天 ' + hour + ':' + minute + ':' + second;
}
