import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image } from '@tarojs/components';
import { iosTrouchFn } from '../../../../utils/common/utils';
import './index.scss';

export default class AddressSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlag: false,
      platform: '',
    };
  }

  static defaultProps = {
    list: [],
  };

  componentDidMount() {
    if (this.props.show) {
      setTimeout(() => {
        this.setState(
          {
            isFlag: true,
          },
          () => {
            console.log(this.state.isFlag);
          }
        );
      }, 200);
    }

    Taro.getSystemInfo({
      success: res => {
        this.setState({
          platform: res.platform,
        }),
          () => {
            //修复iOS橡皮筋问题
            if (this.state.platform === 'ios') {
              var ViewEl = document.getElementById('addressModalList');
              iosTrouchFn(ViewEl);
            }
          };
      },
    });
  }

  onClose() {
    this.props.onClose();
  }

  onChange(info) {
    this.props.onChange(info);
  }

  onCreate() {
    console.log('onCreate');
    this.props.onCreate();
  }

  touchMove(e) {
    e.stopPropagation();
  }

  render() {
    const { list, failList } = this.props;

    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].tagName) {
        count++;
      }
    }
    return (
      <View className='address-select-modal' id='addressModalList'>
        {this.state.isFlag && (
          <View
            className='mask'
            onClick={this.onClose.bind(this, null)}
            onTouchMove={this.touchMove}
          />
        )}
        <View className='content show'>
          <View className='top' onTouchMove={this.touchMove}>
            <View className='title'>收货地址</View>
            <View
              className='close-wrap'
              onClick={this.onClose.bind(this, null)}
            >
              <View className='close' />
            </View>
          </View>
          <View className='address-select-scroller'>
            <View className='address-content'>
              {list &&
                list.map((info, index) => {
                  return (
                    <View key={index}>
                      {info.supportDelivery === false ? (
                        ''
                      ) : (
                        <View
                          className={
                            info.isDefault === 1
                              ? 'address-item active'
                              : 'address-item'
                          }
                          s
                          onClick={this.onChange.bind(this, info)}
                        >
                          <View className={count > 0 ? 'tag' : ''}>
                            <View className='tag-name'>
                              {info.tagName ? info.tagName : ''}
                            </View>{' '}
                          </View>
                          <View className='text'>{`${info.addressSummary} ${info.addressExt} ${info.where}`}</View>
                          <View className='select' />
                        </View>
                      )}
                    </View>
                  );
                })}
              {failList && failList.length > 0 && (
                <View className='fail-address-list'>
                  <View className='header'>
                    <Text className='f-title'>超配送地址</Text>
                    <Image
                      src={this.state.infoPic}
                      alt='7FRESH'
                      className='fail-pic'
                    />
                  </View>
                  {failList.map((info, index) => {
                    return (
                      <View
                        className='address-item'
                        key={index}
                        onClick={this.onChange.bind(this, info)}
                      >
                        <View className={count > 0 ? 'tag' : ''}>
                          <View className='tag-name'>
                            {info.tagName ? info.tagName : ''}
                          </View>
                        </View>
                        <View className='grey-text'>{`${info.addressSummary} ${info.addressExt} ${info.where}`}</View>
                        <View className='select' />
                      </View>
                    );
                  })}
                </View>
              )}
              {list.length < 1 && failList.length < 1 && (
                <View className='bottom'>
                  <Text className='btn' onClick={this.onCreate.bind(this)}>
                    新建地址
                  </Text>
                </View>
              )}
            </View>
          </View>
          {(list.length > 0 || failList.length > 0) && (
            <View className='bottom-box'>
              <Text className='btn' onClick={this.onCreate.bind(this)}>
                新建地址
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
