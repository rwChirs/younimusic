import React, { Component } from 'react';
let srUtils;
if (process.env.TARO_ENV === 'weapp') {
  srUtils = require('../zhls').default;
} else {
  let srUtilsFun = () => {};
  srUtils = {
    onPageShow: srUtilsFun,
    onPageHide: srUtilsFun,
    onPageShare: srUtilsFun,
    onProductExpose: srUtilsFun,
    onProductTrigger: srUtilsFun,
    onProductPageShow: srUtilsFun,
    onProductAddCart: srUtilsFun,
    onRegister: srUtilsFun,
    onOrderChange: srUtilsFun,
    setChan: srUtilsFun,
  };
}

const {
  onPageShow,
  onPageHide,
  onPageShare,
  onProductExpose,
  onProductTrigger,
  onProductPageShow,
  onProductAddCart,
  onRegister,
  onOrderChange,
  setChan,
} = srUtils;
export default class CommonPageComponents extends Component {
  time = null;
  onPageHide = () => {
    onPageHide(new Date() - this.time);
  };
  onPageShow = () => {
    this.time = new Date();
    onPageShow();
  };
  onPageShare = onPageShare;
  onProductExpose = onProductExpose;
  onProductTrigger = onProductTrigger;
  onProductPageShow = onProductPageShow;
  onProductAddCart = onProductAddCart;
  onRegister = onRegister;
  onOrderChange = onOrderChange;
  setChan = setChan;
}
