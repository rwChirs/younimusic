import React, { Component } from 'react';
import Modal from '../modal';
import { theme } from '../../common/theme';

export default class Deletemodal extends Component {
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
    const data = {
      width: 560,
      height: 200,
      name: '',
      title: '',
      desc: '确定删除此订单？',
      subDesc: '删除后如有售后问题可联系客服恢复',
      type: 2,
      confirmTxt: '删除',
      cancelTxt: '取消',
    };
    return (
      <Modal
        show={this.props.show}
        width={data.width}
        height={data.height}
        title={data.title}
        desc={data.desc}
        subDesc={data.subDesc}
        type={data.type}
        confirmTxt={data.confirmTxt}
        cancelTxt={data.cancelTxt}
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
