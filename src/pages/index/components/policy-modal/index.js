// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import FreshProductButton from '../../../../components/product-button';
import { theme } from '../../../../common/theme';
import './index.scss';

export default class PolicyModal extends Component {
  static defaultProps = {};

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

  onGoToPolicyUrl(data) {
    this.props.onGoToPolicyUrl(data);
  }

  render() {
    let { data, show } = this.props;
    const onCancelText = '不同意';
    const onOkText = '我同意';
    return (
      <View>
        {show && data.tip ? (
          <View className='switch-modal' style={{ zIndex: 999 }}>
            <View className='main' style={{ height: 'auto' }}>
              <View className='switch-title'>七鲜隐私政策变更</View>
              <View className='s-content'>
                <View className='switch-name'>
                  {data.tip}
                  <View>
                    点击查看完整版
                    {data && data.regProtocol && (
                      <Text
                        style={{
                          color: theme.color,
                        }}
                        onClick={this.onGoToPolicyUrl.bind(
                          this,
                          data.regProtocol
                        )}
                      >
                        《七鲜用户注册协议》
                      </Text>
                    )}
                    {data && data.policyLink && (
                      <Text
                        style={{ color: theme.color }}
                        onClick={this.onGoToPolicyUrl.bind(
                          this,
                          data.policyLink
                        )}
                      >
                        《七鲜隐私协议》
                      </Text>
                    )}
                    {data && data.registerInfoUrl && (
                      <Text
                        style={{ color: theme.color }}
                        onClick={this.onGoToPolicyUrl.bind(
                          this,
                          data.registerInfoUrl
                        )}
                      >
                        《京东用户注册协议》
                      </Text>
                    )}
                    {data && data.jdPolicyUrl && <Text>及</Text>}
                    {data && data.jdPolicyUrl && (
                      <Text
                        style={{ color: theme.color }}
                        onClick={this.onGoToPolicyUrl.bind(
                          this,
                          data.jdPolicyUrl
                        )}
                      >
                        《京东隐私政策》
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View className='s-footer' style={{ zIndex: 2 }}>
                <FreshProductButton
                  name={onCancelText}
                  color='#252525'
                  width='180'
                  height='80'
                  background='#fff !important'
                  borderType='circle'
                  border='none'
                  fontWeight='normal'
                  onClick={this.onCancel.bind(this, data)}
                />
                <View className='line'></View>
                <FreshProductButton
                  name={onOkText}
                  borderType='circle'
                  background='#fff !important'
                  color={theme.color}
                  width='180'
                  height='80'
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
