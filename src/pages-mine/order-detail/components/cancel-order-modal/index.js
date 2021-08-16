import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../../../common/theme';
import './index.scss';

export default class CancelOrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: '', // 选中状态
    };
  }

  handelSelected(index) {
    this.setState({
      selectedIndex: index,
    });
  }

  onHandleIsCancelOrder = () => {
    this.props.onHandleIsCancelOrder(false);
  };

  onHandelSelected = index => {
    this.setState({
      selectedIndex: index,
    });
  };

  onCancelOrder = selectedIndex => {
    if (selectedIndex) {
      this.props.onCancelOrder(selectedIndex);
    }
  };

  render() {
    const { selectedIndex } = this.state;
    const { reasons } = this.props;

    return (
      <View>
        <View className='stockout-bar'>
          <View className='mask' />
          <View className='stockout-container'>
            <View className='title'>
              <Text>请选择申请退款原因</Text>
            </View>
            <View className='close-btn' onClick={this.onHandleIsCancelOrder}>
              <Text className='drop' />
            </View>

            <View className='stockout-options'>
              <View className='ul'>
                {reasons &&
                  reasons.length > 0 &&
                  reasons.map((item, i) => {
                    return (
                      <View
                        className={`li ${
                          i === selectedIndex ? 'selected' : ''
                        }`}
                        key={i.toString()}
                        onClick={this.onHandelSelected.bind(this, i)}
                      >
                        {item}
                        <View
                          className='span'
                          style={{
                            border:
                              i === selectedIndex
                                ? 'none'
                                : '1px solid #898989',
                          }}
                        >
                          <View
                            className='i'
                            style={{
                              backgroundImage: `url(${
                                i === selectedIndex ? theme.selectBtn : ''
                              })`,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </View>
        <View
          className='submit-btn'
          style={{
            background: selectedIndex !== '' ? theme.btnColor : '#ccc',
            color: selectedIndex !== '' ? '#fff' : '#999',
          }}
          onClick={this.onCancelOrder.bind(this, selectedIndex)}
        >
          提交
        </View>
      </View>
    );
  }
}
