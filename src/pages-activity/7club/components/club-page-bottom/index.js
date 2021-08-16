import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text, Button } from '@tarojs/components';
import { switchNum, images } from '../../utils';
import './index.scss';

const image = {
  collectIcon:
    'https://m.360buyimg.com/img/jfs/t1/135730/4/1199/2691/5ed70e3eE2448bf13/76415d9c80fe1e60.png',
  collectedIcon:
    'https://m.360buyimg.com/img/jfs/t1/131098/5/1264/3130/5ed70bb9E5e18ed88/b17cba576eef7f06.png',
  blackLikeDefault:
    'https://m.360buyimg.com/img/jfs/t1/125781/16/2039/2167/5ec24205E555ed837/93cb28b0a78c2023.png',
  // 'https://m.360buyimg.com/img/jfs/t1/49506/34/7558/1432/5d52bf7cE35dffadd/29db26eda4db130b.png',
  blackLikeChecked:
    'https://m.360buyimg.com/img/jfs/t1/137550/17/1176/2977/5ed70ba4E92231a1b/426d53bc1cb62062.png',
  // 'https://m.360buyimg.com/img/jfs/t1/44781/7/11332/2513/5d821045Eb37d8593/bec84472aa004657.png',
  whiteLikeDefault:
    'https://m.360buyimg.com/img/jfs/t1/73394/36/7653/1079/5d5a4c1fEfa15f591/45f381e36b2d6818.png',
  blackShare:
    'https://m.360buyimg.com/img/jfs/t1/52632/11/7476/1056/5d52bf92E32e40fe6/3f972b0cacb9960b.png',
  whiteShare:
    'https://m.360buyimg.com/img/jfs/t1/60277/23/7590/830/5d5a4c6bE10fd9782/b024598d6a7d38e7.png',
  whiteCart:
    'https://m.360buyimg.com/img/jfs/t1/83254/7/8934/1492/5d6cd600Eec7182e9/32f37939e257fd02.png',
  blackCart:
    'https://m.360buyimg.com/img/jfs/t1/73128/19/8843/2547/5d6cd52bE99949927/b7f4f1a2850efd15.png',
};

export default class ClubPageBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onClickStop = e => {
    e.stopPropagation();
  };
  handleCollection = () => {
    const { onCollection, data } = this.props;
    const { clubDetailInfo = {} } = data;
    onCollection(clubDetailInfo);
  };

  render() {
    const {
      skin,
      onClickRightBtn,
      onGoCart,
      cartNum,
      data,
      showShare,
      showLike,
      showRightBtn,
    } = this.props;
    const { clubDetailInfo = {}, wareInfoList = [] } = data;
    return (
      <View
        className='video-bottom'
        style={{
          backgroundColor: skin === 'black' ? '' : skin,
        }}
        onClick={this.onClickStop.bind(this)}
      >
        <View className='func'>
          {showLike && (
            <View
              className='like-box'
              onClick={this.handleCollection.bind(this)}
            >
              <View
                className='img like'
                style={{
                  backgroundSize:
                    clubDetailInfo && clubDetailInfo.collect
                      ? clubDetailInfo.random
                        ? '100%'
                        : '60%'
                      : '60%',
                  backgroundImage:
                    clubDetailInfo && clubDetailInfo.collect
                      ? clubDetailInfo.random
                        ? `url(${images.collectSelectedGif}?t=${clubDetailInfo.random})`
                        : `url(${images.collectSelectedImg})`
                      : `url(${images.collectDefaultImg})`,
                }}
              />
              <Text
                className='like-num'
                style={{ color: skin === 'black' ? 'white' : '#252525' }}
              >
                {(clubDetailInfo && switchNum(clubDetailInfo.collectCount)) ||
                  ''}
              </Text>
            </View>
          )}
          {showShare && (
            <Button
              className='share-btn'
              openType='share'
              dataShareInfo={clubDetailInfo}
              style={{
                backgroundImage: `url(${
                  skin === 'black' ? image.whiteShare : image.blackShare
                })`,
              }}
            />
          )}
        </View>
        <View className='right-box'>
          <View className='cart-btn' onClick={onGoCart}>
            <Image
              className='img cart'
              src={skin === 'black' ? image.whiteCart : image.blackCart}
            />
            {!!cartNum && (
              <View className='cart-num'>
                {cartNum < 100 ? cartNum : '99+'}
              </View>
            )}
          </View>
          {showRightBtn && (
            <View className='right-btn' onClick={onClickRightBtn}>
              商品
              {(wareInfoList && wareInfoList.length) > 0
                ? `(${wareInfoList.length})`
                : ''}
            </View>
          )}
        </View>
      </View>
    );
  }
}
