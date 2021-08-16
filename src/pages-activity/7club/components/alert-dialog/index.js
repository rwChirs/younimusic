import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import FloatingContent from '../floating-content';

export default class AlertDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertDialog: false,
    };
  }

  componentWillUnmount() {
    console.log('componentWillUnmount alert-dialog');
    Taro.eventCenter.off('show7clubProDialog');
    Taro.eventCenter.off('close7clubProDialog');
  }
  onToggleAlertDialog = () => {
    console.log('onToggleAlertDialog');
  };
  showDialog = () => {
    this.setState({
      showAlertDialog: true,
    });
  };

  onClick = e => {
    e.stopPropagation();
    this.closeDialog();
  };

  closeDialog = () => {
    this.setState({
      showAlertDialog: false,
    });
  };

  render() {
    const { showAlertDialog } = this.state;
    const {
      data,
      onGoProDetail,
      onAddCart,
      onGoBillDetail,
      onGo7clubDetail,
    } = this.props;
    return (
      <View className={`alert-dialog ${showAlertDialog ? 'show' : ''}`}>
        <View className='wrap' onClick={this.onClick.bind(this)} />
        <View className='content'>
          <FloatingContent
            data={data}
            onGoProDetail={onGoProDetail}
            onAddCart={onAddCart}
            onGoBillDetail={onGoBillDetail}
            onGo7clubDetail={onGo7clubDetail}
            onToggleAlertDialog={this.onToggleAlertDialog}
            onCloseDialog={this.closeDialog}
          />
        </View>
      </View>
    );
  }
}
