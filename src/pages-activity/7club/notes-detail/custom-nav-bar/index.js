import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class CustomNavBar extends Component {
  gotoCart = () => {
    const { onGotoCart, onLogClick } = this.props;
    onLogClick &&
      typeof onLogClick === 'function' &&
      onLogClick('7FRESH_miniapp_2_1578553760939|27');
    onGotoCart && typeof onGotoCart === 'function' && onGotoCart();
  };

  goToMine = author => {
    const { onGoToMine, onLogClick } = this.props;
    onLogClick &&
      typeof onLogClick === 'function' &&
      onLogClick('7FRESH_miniapp_2_1578553760939|26');
    onGoToMine && typeof onGoToMine === 'function' && onGoToMine(author);
  };

  showDelNotesModal = () => {
    const { onShow } = this.props;
    onShow && typeof onShow === 'function' && onShow();
  };

  render() {
    const {
      showBack,
      onBack,
      statusHeight,
      navHeight,
      author,
      isLogin,
      clubDetailInfo,
      userInfo,
    } = this.props;
    return (
      <View className='wrapper'>
        <View className='navbar' style={{ height: `${navHeight}px` }}>
          <View style={{ height: `${statusHeight}px` }} />
          <View className='customer-title-container'>
            {showBack && (
              <View className='back-btn' onClick={onBack}>
                <Image
                  className='image'
                  src='https://m.360buyimg.com/img/jfs/t1/35211/24/13970/1108/5d1dc088E6d087ba2/3a51555c850d5416.png'
                />
              </View>
            )}
            <View className='title'>
              <View className='user-info'>
                <View
                  className='user-icon'
                  onClick={this.goToMine.bind(this, author)}
                >
                  <Image
                    src={author && author.headIcon}
                    className='user-icon-img'
                  />
                </View>
                <View className='user-name'>
                  {(author && author.authorNickName) || ''}
                </View>
              </View>
              <View className='cart-icon' onClick={this.gotoCart} />
              {isLogin &&
                clubDetailInfo &&
                clubDetailInfo.author &&
                clubDetailInfo.author.author &&
                userInfo &&
                userInfo.pin &&
                userInfo.pin === clubDetailInfo.author.author && (
                  <View className='del-icon' onClick={this.showDelNotesModal} />
                )}
            </View>
          </View>
        </View>
        <View style={{ height: `${navHeight}px` }} />
      </View>
    );
  }
}
