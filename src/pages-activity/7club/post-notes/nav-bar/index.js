import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

const backImg = {
  black:
    'https://m.360buyimg.com/img/jfs/t1/35211/24/13970/1108/5d1dc088E6d087ba2/3a51555c850d5416.png',
  white:
    'https://m.360buyimg.com/img/jfs/t1/78538/1/3688/631/5d1f0042E165853d6/f3ecc6c4ebc5e5e9.png',
  closeImg:
    'https://m.360buyimg.com/img/jfs/t1/123625/27/1502/390/5ebd1236E4cb85519/0e31189678b1346b.png',
};
export default class NavBar extends Component {
  sureUploadImgs = () => {
    const { onUploadImgs } = this.props;
    onUploadImgs && typeof onUploadImgs === 'function' && onUploadImgs();
  };

  clubRelease = () => {
    const { onClubRelease } = this.props;
    onClubRelease && typeof onClubRelease === 'function' && onClubRelease();
  };

  render() {
    const {
      onBack,
      statusHeight,
      navHeight,
      isShowModal,
      title,
      skin,
      isShowNextBtn,
      isHasGif,
    } = this.props;
    return (
      <View
        className='wrapper'
        style={{ background: skin === 'black' ? '#000' : '#fff' }}
      >
        <View className='navbar' style={{ height: `${navHeight}px` }}>
          <View style={{ height: `${statusHeight}px` }} />
          <View className='note-title-container'>
            <View className='back-btn' onClick={onBack}>
              <Image
                className={isShowModal ? 'closeImage' : 'image'}
                src={
                  isShowModal
                    ? backImg.closeImg
                    : isShowNextBtn
                    ? backImg.white
                    : backImg.black
                }
              />
            </View>
            <View className='title'>{title ? title : ''}</View>
            {!isShowModal && isShowNextBtn === true && isHasGif === false && (
              <View className='r-btn' onClick={this.sureUploadImgs}>
                下一步
              </View>
            )}
            {!isShowModal && isShowNextBtn === false && (
              <View className='r-btn' onClick={this.clubRelease}>
                发布
              </View>
            )}
          </View>
        </View>
        <View style={{ height: `${navHeight}px` }} />
      </View>
    );
  }
}
