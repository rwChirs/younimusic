// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg, px2vw } from '../../../../utils/common/utils';

class FloorFloatImg extends Component {
  static defaultProps = {
    data: { action: {}, image: '' },
  };

  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  handleClick(action) {
    const { isHideFloorFloatImg, onShowFloorFloatImg, onGoToUrl, data } =
      this.props;
    if (isHideFloorFloatImg === true) {
      onShowFloorFloatImg();
    } else {
      onGoToUrl({ ...action, target: 3, imageUrl: data.image });
    }
  }
  render() {
    const { data, isConcern, isHideFloorFloatImg } = this.props;
    const { show } = this.state;
    const { action, image } = data;
    return show ? (
      <View
        className='float-img lazy-load-img'
        onClick={this.handleClick.bind(this, action)}
        style={{
          bottom: isConcern ? px2vw(275) : px2vw(445),
          opacity: isHideFloorFloatImg ? 0.6 : 1,
          right: isHideFloorFloatImg ? px2vw(-80) : 0,
        }}
      >
        <Image className='float-img-icon' src={filterImg(image)} lazyLoad />
      </View>
    ) : null;
  }
}

export default FloorFloatImg;
