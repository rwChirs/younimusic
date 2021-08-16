import React, { Component } from 'react';
import Modal from '../modal';
import { theme } from '../../common/theme';

export default class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onConfirm = () => {
    this.props.onConfirm();
  };
  onCancel = () => {
    this.props.onCancel();
  };
  render() {
    const { desc, confirmTxt, cancelTxt } = this.props;
    return (
      <Modal
        show={this.props.show}
        desc={desc}
        width={560}
        height={200}
        type={2}
        confirmTxt={confirmTxt}
        cancelTxt={cancelTxt}
        borderRadius='10px'
        descStyle='height:44px;line-height:44px;margin-top:13px;font-size:14px'
        rBtnStyle={`border-radius: 0 0 10px 0;color:${theme.color};background:#fff;border-left:1px solid #edeef2`}
        lBtnStyle='border-radius: 0   0  10px 0;'
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
      />
    );
  }
}
