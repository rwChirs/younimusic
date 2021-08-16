import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class AfterSalesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onConfirm = () => {
    const { onConfirm } = this.props;
    onConfirm();
  };

  render() {
    const {
      show,
      type,
      name,
      desc,
      cancelTxt,
      mobile,
      onClose,
      okTxt,
    } = this.props;
    return (
      <View>
        {
          show && (
            <View className='modal'>
              <View className='main'>
                <View className='contain'>
                  <View
                    className='after-sales-model-content'
                    style={{
                      paddingTop: type === 1 ? px2vw(56) : px2vw(34),
                      width: type === 1 ? px2vw(690) : px2vw(610),
                    }}
                  >
                    <View className='tips-con'>
                      {name && (
                        <View className='after-sales-model-title'>{name}</View>
                      )}
                      <View
                        className={`after-sales-model-desc  ${name ? '' : 'big'} `}
                      >
                        {desc}
                      </View>
                    </View>
                  </View>
                </View>
                <View className='footer' style={{ zIndex: 2 }}>
                  <View className='after-sales-model-footer'>
                    <View className='two-btn'>
                      <View onClick={onClose} className='cancel-btn'>
                        {cancelTxt}
                      </View>
                      <View className='line' />
                      {mobile ? (
                        <View className='ok-btn' onClick={this.onConfirm}>
                          {okTxt}
                        </View>
                      ) : (
                        <View className='ok-btn' onClick={this.onConfirm}>
                          {okTxt}
                        </View>
                      )}
                    </View>
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
