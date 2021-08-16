import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import User from '../formal-item-card/user';
import TextWithIcon from '../text-with-icon';
import './index.scss';
import { filterImg, logClick } from '../../utils';
import { VD_CONTENT } from '../../reportPoints';

export default class VideoText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapse: true,
    };
  }

  toggleCollapse = e => {
    logClick({ eid: VD_CONTENT });
    e.stopPropagation();
    this.setState({
      isCollapse: !this.state.isCollapse,
    });
  };
  render() {
    const { isCollapse } = this.state;
    const { author, preface, label } = this.props;
    return (
      <View>
        <View className={`background ${isCollapse ? '' : 'active'}`} />
        <View className='video-text'>
          <View className='user-wrap'>
            <User author={author} color='#ffffff' bgColor='black' />
            <Image
              style={{ display: preface.length < 65 ? 'none' : 'block' }}
              className={`img ${isCollapse ? '' : 'rotate'}`}
              src={filterImg(
                'https://m.360buyimg.com/img/jfs/t1/59507/16/8572/244/5d664c61Ecee18882/c421702ab5322f1c.png!q70.dpg'
              )}
              onClick={this.toggleCollapse}
            />
          </View>
          <TextWithIcon
            styleObj={this.props.styleObj}
            isCollapse={isCollapse}
            content={preface}
            label={label}
          />
        </View>
      </View>
    );
  }
}
