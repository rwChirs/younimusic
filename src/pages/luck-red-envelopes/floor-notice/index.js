import Taro from "@tarojs/taro";
import {Component} from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class FloorNotice extends Component {
  static defaultProps = {
    onClick: () => {},
    data: {
      image: '',
      pictureAspect: 0,
      action: {},
      actions: [],
    },
  };
  goPage = (action, ev) => {
    ev.stopPropagation();
    if (action.urlType) this.props.onGoToUrl(action);
  };
  render() {
    const { data, windowWidth } = this.props;
    const { image, pictureAspect, action, actions } = data;
    const h = windowWidth / pictureAspect;
    return (
      <View
        className='floor-notice'
        style={{ height: h + 'px' }}
        onClick={this.goPage.bind(this, action)}
      >
        <Image
          src={image}
          style={{ height: h + 'px' }}
          className='floor-notice-img'
        />
        {actions &&
          actions.length &&
          actions.map((val, i) => {
            const btnStyle = {
              width: (val.endX - val.startX) * windowWidth + 'px',
              height: (val.endY - val.startY) * h + 'px',
              left: val.startX * windowWidth + 'px',
              top: val.startY * h + 'px',
            };
            return (
              <View
                key={i}
                className='floor-notice-btn'
                style={btnStyle}
                taroKey={String(i)}
                onClick={this.goPage.bind(this, val)}
              />
            );
          })}
      </View>
    );
  }
}
