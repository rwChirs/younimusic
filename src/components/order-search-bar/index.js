import React, { Component } from 'react';
import { View, Input, Image } from '@tarojs/components';
import { px2vw } from '../../utils/common/utils';
import './index.scss';

export default class OrderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleWidth() {
    const { isShowSearchBtn } = this.props;
    let backWidth = 0;
    if (!isShowSearchBtn) {
      backWidth = px2vw(710);
    } else {
      backWidth = px2vw(620);
    }
    return backWidth;
  }
  handleInputWidth() {
    const { isShowSearchBtn } = this.props;
    let backWidth = 0;
    if (!isShowSearchBtn) {
      backWidth = px2vw(650);
    } else {
      backWidth = px2vw(560);
    }
    return backWidth;
  }

  render() {
    const {
      keyWord,
      defaultKeyWord,
      searchBtnTxt,
      onClearValue,
      onKeyUp,
      onChangeWord,
      onClickSearchBtn,
      isShowSearchBtn,
      isShowClearValueBtn,
      isDisabled,
      onFocusSearch,
      onBlurSearch,
      canService,
      onService,
    } = this.props;
    const widthParams = this.handleWidth();
    const widthInputParams = this.handleInputWidth();
    return (
      <View className='order-search-bar'>
        <View
          className='order-search-part'
          style={{
            width: widthParams,
          }}
        >
          {!isDisabled ? (
            <Input
              id='input'
              className='input'
              style={{
                width: widthInputParams,
              }}
              placeholder={defaultKeyWord}
              value={keyWord}
              onInput={onChangeWord}
              onConfirm={onKeyUp}
              onFocus={onFocusSearch}
              onBlur={onBlurSearch}
            />
          ) : (
            <Input
              id='input'
              styleName='input'
              readOnly='true'
              style={{
                width: widthInputParams,
              }}
              placeholder={defaultKeyWord}
              value={keyWord}
            />
          )}

          <View
            className='order-search-icon'
            style={{
              left: px2vw(22),
            }}
          />
          {isShowClearValueBtn && keyWord && (
            <View className='order-search-clear' onClick={onClearValue} />
          )}
        </View>

        {isShowSearchBtn && (
          <View
            className='order-search-btn'
            onClick={onClickSearchBtn.bind(this, keyWord)}
          >
            {searchBtnTxt || '搜索'}
          </View>
        )}
        {canService && (
          <View className='service-icon' onClick={onService}>
            <Image
              className='pic'
              src='https://m.360buyimg.com/img/jfs/t1/151734/18/1823/2993/5f8110c7Ecc5a518a/21e43aea330850b4.png'
              lazyLoad
            />
          </View>
        )}
      </View>
    );
  }
}
