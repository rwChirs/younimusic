import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
const defaultHeaderImage =
  'https://m.360buyimg.com/img/jfs/t1/56696/10/801/4341/5ce7ae02Ebd65a1f4/1a5e770d859f6b9a.png';
const defaultLogo =
  'https://m.360buyimg.com/img/jfs/t1/42509/26/14416/4544/5d7751b0E54651a7b/b8ce6943f0ffd7fb.png';
const userDefaultPicture =
  'https://m.360buyimg.com/img/jfs/t1/26929/4/4756/5639/5c344af6Ebe5f3e0e/fa5459e8c7c28ac1.png';
const productDefaultPicture =
  'https://m.360buyimg.com/img/jfs/t1/137852/10/8783/10694/5f6489d2Ed18cb359/8c0bac890e5c3dec.png';
export default class FloorNotice extends Component {

  goPage(action, ev) {
    ev.stopPropagation();
    if (action.urlType) this.props.onGoToUrl(action);
  }

  filterImg = (img, str, flag) => {
    let value = '';
    if (str === 'solitaire') {
      value = img ? img : defaultHeaderImage;
    } else if (str === 'shoplogo') {
      value = img ? img : defaultLogo;
    } else if (str === 'user') {
      value = img ? img : userDefaultPicture;
    } else {
      value = img ? img : productDefaultPicture;
    }

    if (value) {
      //图片压缩
      if (
        value.indexOf('storage.360buyimg.com') <= -1 &&
        value.indexOf('storage.jd.com') <= -1 &&
        str !== 'solitaire' &&
        flag !== 'no'
      ) {
        if (value.indexOf('!q70') <= -1) {
          value += '!q70';
        }
        if (value.indexOf('.dpg') <= -1) {
          value += '.dpg';
        }
      }

      if (value.indexOf('//') <= -1) {
        value = 'https://' + value;
      } else if (value.indexOf('http') <= -1) {
        value = 'https:' + value;
      } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
        str = value.split('http:')[1];
        value = 'https:' + str;
      }
      if (value.indexOf('webp') > -1) {
        value = value.replace('.webp', '');
      }
      if (value.indexOf('!cc_4x3.jpg') > -1) {
        value = value.replace('!cc_4x3.jpg', '!cc_4x3');
      }
    }
    return value;
  };

  render() {
    const { data, windowWidth } = this.props;
    const { image, pictureAspect, action, actions, dynamicLabels } = data;
    const h = windowWidth / pictureAspect;

    // 埋点增加字段,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
    const clickAction = { ...action, target: 3, imageUrl: image };
    return (
      <View
        className='floor-notice lazy-load-img'
        style={{ height: h + 'px' }}
        onClick={this.goPage.bind(this, clickAction)}
      >
        <Image
          src={this.filterImg(image)}
          style={{ height: h + 'px' }}
          className='floor-notice-img'
          lazyLoad
        />

        {dynamicLabels &&
          dynamicLabels.length > 0 &&
          dynamicLabels.map((v, k) => {
            const btnStyle = {
              minWidth: (v.endX - v.startX) * windowWidth + 'px',
              minHeight: (v.endY - v.startY) * h + 'px',
              left: v.startX * windowWidth + 'px',
              top: v.startY * h + 'px',
              backgroundColor: v.backgroundColor,
              color: v.textColor,
              fontSize: v.font + 'px',
              borderRadius:
                Math.max((v.endY - v.startY) * h, v.font) + 4 / 2 + 'px',
              padding: '2px 7px',
            };
            return (
              <View
                className='floor-notice-dynamic-area'
                style={btnStyle}
                key={k}
              >
                {v.text}
              </View>
            );
          })}

        {actions &&
          actions.length &&
          actions.map((val, i) => {
            const btnStyle = {
              width: (val.endX - val.startX) * windowWidth + 'px',
              height: (val.endY - val.startY) * h + 'px',
              left: val.startX * windowWidth + 'px',
              top: val.startY * h + 'px',
            };
            // 埋点增加字段,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
            const actionItem = {
              ...val,
              index: i + 1,
              target: 6,
              imageUrl: image,
            };
            return (
              <View
                key={String(i)}
                className='floor-notice-btn'
                style={btnStyle}
                taroKey={String(i)}
                onClick={this.goPage.bind(this, actionItem)}
              />
            );
          })}
      </View>
    );
  }
}
