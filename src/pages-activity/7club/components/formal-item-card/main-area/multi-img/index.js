import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg, addHttps } from '../../../../../../utils/common/utils';
import { logClick } from '../../../../../../utils/common/logReport';
import './index.scss';
import { HOT_POST_BILL } from '../../../../reportPoints';

export default class MultiImg extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showBigImg = (i, e) => {
    const { imgList } = this.props;
    console.log('this.props.imgList', imgList);
    e.stopPropagation();
    logClick({ e, eid: HOT_POST_BILL });
    Taro.previewImage({
      current: addHttps(imgList[i]),
      urls: imgList.map(item => addHttps(item)),
    });
  };

  render() {
    const { imgList } = this.props;
    return (
      <View
        className={`img-list ${
          imgList.length === 1
            ? 'big'
            : imgList.length === 4
            ? 'middle'
            : 'less'
        }`}
      >
        {imgList &&
          imgList.length > 0 &&
          imgList.map((img, index) => (
            <Image
              className='img'
              src={filterImg(img)}
              key={img}
              onClick={this.showBigImg.bind(this, index)}
              mode='aspectFill'
            />
          ))}
      </View>
    );
  }
}
