import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Button } from '@tarojs/components';
import FreshProductButton from '../../../../components/product-button'
import FreshSeatTitle from '../seat-title';
import './index.scss';

export default class FreshSolitaireInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  onClose = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  render() {
    const { type, show, img, content, openType, title, desc } = this.props;
    let teamInfo = [];
    if (desc) {
      if (desc.indexOf('##') > -1) {
        teamInfo = desc.split('##');
      } else {
        teamInfo = [desc];
      }
    }
    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' />
        <View className='info-modal-content'>
          {type === 1 && (
            <View className='info-modal-wx'>
              <View className='info-modal-wx-title'>需要在小程序上接龙哦</View>
              <View className='info-modal-wx-sub-title'>长按识别小程序码</View>
              <Image className='info-modal-wx-img' src={img} />
            </View>
          )}
          {type === 2 && (
            <View className='info-modal-visit'>
              <View className='info-modal-visit-title'>
                <FreshSeatTitle title='接龙成功' isHaveFlower split />
              </View>
              {content &&
                content.map((info, index) => (
                  <View className='info-modal-visit-desc' key={index}>
                    {info}
                  </View>
                ))}
              <View className='info-btn'>
                <Button
                  className='info-share-btn'
                  openType={openType}
                  dataInfo=''
                  onClick={this.onClick.bind(this)}
                  style={{ border: 0 }}
                >
                  邀请接龙
                </Button>
              </View>
            </View>
          )}
          {type === 3 && (
            <View className='info-modal-team'>
              <View className='info-modal-team-title'>
                <View className='info-modal-team-leftLine'>
                  <View className='info-modal-team-line-circle-l' />
                </View>
                <View className='info-modal-team-content'>邀请团</View>
                <View className='info-modal-team-rightLine'>
                  <View className='info-modal-team-line-circle-r' />
                </View>
              </View>
              {content &&
                content.map((info, index) => (
                  <View className='info-modal-team-desc' key={index}>
                    {info}
                  </View>
                ))}
              <View className='info-team-btn'>
                <FreshProductButton
                  name='我知道了'
                  disabled={false}
                  borderRadius={[0, 44, 44, 44]}
                  color='rgb(255, 255, 255)'
                  width='400px'
                  onClick={this.onClick.bind(this)}
                  background='linear-gradient(to right, rgb(255, 109, 109), rgb(253, 50, 50))'
                  boxShadow='0 5px 10px 0 rgba(255, 109, 109, 0.4)'
                />
              </View>
            </View>
          )}
          {type === 4 && (
            <View className='solitaire-team-modal'>
              <View className='title'>{title}</View>
              <View className='desc'>
                {teamInfo &&
                  teamInfo.map((info, index) => (
                    <View className='team-list' key={index}>
                      {info}
                    </View>
                  ))}
              </View>
              <View className='btn' onClick={this.onClick.bind(this)}>
                确定
              </View>
            </View>
          )}
          {type !== 4 && (
            <View className='close-btn'>
              <Image
                src='https://m.360buyimg.com/img/jfs/t1/31101/30/2130/3801/5c669c1fE98231e9e/191a2768868a76b6.png'
                onClick={this.onClose.bind(this)}
                className='close-btn-img'
              />
            </View>
          )}
        </View>
      </View>
    ) : null;
  }
}
