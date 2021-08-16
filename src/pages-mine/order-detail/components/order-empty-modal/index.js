import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class OrderEmptyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose() {
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const {
      children,
      title,
      show,
      toastsInfo,
      content_style,
      close_style,
      scrollGetData,
    } = this.props;
    return (
      <View className={`modal-wrapper ${show ? 'show' : ''}`}>
        <View className='mask' onClick={this.onClose.bind(this, null)} />
        <View className='modal-content' style={content_style}>
          <View className='top'>
            {title}
            <View
              className='close-wrap'
              onClick={this.onClose.bind(this, null)}
              style={close_style}
            >
              <View className='close' />
            </View>
          </View>
          <View
            className='modal-body'
            style={
              content_style
                ? { maxHeight: '100%', marginBottom: px2vw(88) }
                : {}
            }
            onScrollCapture={scrollGetData}
          >
            {children && !toastsInfo && <View>{children}</View>}
            {!children && toastsInfo && toastsInfo.length > 0 && (
              <View className='toasts-info'>
                {toastsInfo.map((val, i) => {
                  return <View key={i.toString()}>{val}</View>;
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
