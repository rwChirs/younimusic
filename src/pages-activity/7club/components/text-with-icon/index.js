import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';

import './index.scss';

export default class StarCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      describeLineCount: 1,
    };
  }

  componentWillMount() {
    this.getDescribeLineCount();
  }

  getDescribeLineCount = () => {
    const { content } = this.props;
    this.setState({
      describeLineCount: Math.ceil((content.length * 28) / 650),
    });
  };

  getDescribeTxt = () => {
    let { content } = this.props;
    if (content) {
      const contentLength = content.length;

      const contentLineCount = Math.ceil((content.length * 28) / 650);

      if (content && contentLineCount > 1) {
        const contentMaxLength = parseInt((650 * 92) / (34 * 40));
        if (contentLength > contentMaxLength) {
          content = content && content.substr(0, contentMaxLength);
          content = content + '...';
        }
      }
    }

    return content;
  };

  render() {
    const {
      isCollapse,
      label,
      lineNum,
      isShowAll,
      content,
      showRightBtn,
      rightBtnText,
      onRightClick,
    } = this.props;
    const { describeLineCount } = this.state;
    return (
      <View
        className={`text-with-icon ${isCollapse ? 'collapse' : ''}`}
        style={{
          paddingRight: showRightBtn ? px2vw(100) : 0,
          padding: this.props.styleObj.padding,
          '-webkitLineClamp': lineNum,
          marginTop: this.props.styleObj.marginTop,
          marginBottom: this.props.styleObj.marginBottom,
        }}
      >
        {label && (
          <View className='label-icon'>
            <Text class='label-text'>{label || ''}</Text>
          </View>
        )}

        {/* {contentType === 6 && <Text className='rank-icon'>榜单</Text>} */}
        <Text className='text' style={{ ...this.props.styleObj }}>
          {isShowAll
            ? this.getDescribeTxt() &&
              this.getDescribeTxt().replace(/[\r\n]/g, '')
            : content}
        </Text>

        {showRightBtn && (
          <View className='right-btn' onClick={onRightClick}>
            {rightBtnText || '详情'}
            <View className='more-icon'></View>
          </View>
        )}

        {isShowAll && lineNum > 1 && describeLineCount > lineNum && (
          <View className='see-all'>
            {/*<View className='dots'>...</View>*/}
            <View className='text-see'>查看全部</View>
          </View>
        )}
      </View>
    );
  }
}
