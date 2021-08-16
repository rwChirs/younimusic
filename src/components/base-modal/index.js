import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../common/theme';
import FreshProductButton from '../product-button';
import './index.scss';

export default class BaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onOk(info) {
    this.props.onOk(info);
  }

  onCancel(info) {
    this.props.onCancel(info);
  }

  render() {
    let { data, show } = this.props;

    return (
      <View>
        {show ? (
          <View className='base-switch-modal' style={{ zIndex: 999 }}>
            <View className='main' style={{ height: 'auto' }}>
              <View className='s-content'>
                {data.title && (
                  <View className='switch-title'>{data.title}</View>
                )}
                <View className='switch-name'>
                  {data.content && <Text>{data.content}</Text>}
                </View>
              </View>
              <View className='s-footer' style={{ zIndex: 2 }}>
                {data && data.showCancelBtn && (
                  <FreshProductButton
                    name={data.onCancelText}
                    borderRadius={['44rpx', '44rpx', '44rpx', '44rpx']}
                    color='#252525'
                    width='280'
                    height='80'
                    background='#fff'
                    borderType='circle'
                    border='1px solid rgba(151,151,151,0.5)'
                    fontWeight='normal'
                    onClick={this.onCancel.bind(this, data)}
                  />
                )}
                <FreshProductButton
                  name={data.onOkText}
                  borderType='circle'
                  borderRadius={['44rpx', '44rpx', '44rpx', '44rpx']}
                  color='#fff'
                  width={!data.showCancelBtn ? '530' : '280'}
                  height='80'
                  background={theme.btnColor}
                  fontWeight='normal'
                  onClick={this.onOk.bind(this, data)}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
