import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick() {
    this.props.onClick();
  }

  render() {
    const { codeData, onCallPhone, show } = this.props;
    return (
      <View>
        {
          show && (
            <View className='code-page'>
              <View className='code-modal'>
              <View className='title' onClick={this.onClick.bind(this)}>
                自取提货码
                <Text className='close'></Text>
              </View>
              <View className='content'>
                <View className='telephone'>{codeData.selfTakeCode}</View>
                <View className='picture'>
                  <Image
                    src={codeData && codeData.codeUrl}
                    mode='aspectFit'
                    className='img'
                    lazyLoad
                  />
                </View>
                <View className='shop'>
                  <Text className='name'>
                    自提点：{codeData && codeData.siteName}
                  </Text>
                  <View className='status'>
                    <View
                      style={{
                        color:
                          codeData && codeData.openStatus === 1 ? '#00AB0C' : 'red',
                      }}
                    >
                      {codeData && codeData.openStatusDesc}
                    </View>
                    <View className='split-line' />
                    <View onClick={onCallPhone}>
                      <Image
                        src='https://m.360buyimg.com/img/jfs/t1/130573/15/10950/1147/5f708bf7Eac4fe850/e34c85688d858092.png'
                        className='icon'
                        mode='aspectFit'
                        lazyLoad
                      />
                    </View>
                  </View>
                </View>
                <View className='time'>
                  <Image
                    src='https://m.360buyimg.com/img/jfs/t1/30575/17/10160/662/5cac0522Ebd228cab/4bb2b20197c07700.png'
                    mode='aspectFit'
                    className='img'
                    lazyLoad
                  />
                  <Text>{codeData.openTime}</Text>
                </View>
                <View className='address'>
                  <Image
                    src='https://m.360buyimg.com/img/jfs/t12172/157/2630355692/1826/8b13831a/5a4509a4N275c65f0.png'
                    mode='aspectFit'
                    className='img'
                    lazyLoad
                  />
                  <Text>{codeData.siteAddress}</Text>
                </View>
                <View className='mobile'>
                  <Text className='left'>预留手机</Text>
                  <Text className='right'>{codeData.mobile}</Text>
                </View>
                <View className='date'>
                  <Text className='left'>提货时间</Text>
                  <Text className='right'>{codeData.selfTakeTime}</Text>
                </View>
              </View>
            </View>
            </View>
          )
        }
      </View>
      );
  }
}
