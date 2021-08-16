// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class CommonTab extends Component {
  static defaultProps = {
    index: 0,
    data: [],
    isShowBottomLine: false,
    isShowRightLine: false,
    isShowSecondTitle: false,
    containerStyle: {},
    tabListStyle: {},
    tabInfoStyle: {},
    mainTitleStyle: {},
    extTitleStyle: {},
    bottomLineStyle: {},
    rightLineStyle: {},
    curTabInfoStyle: {},
    onSelect: () => {},
    isFixed: false,
    fixedTop: 210,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data,
      tabListStyle,
      tabInfoStyle,
      containerStyle,
      mainTitleStyle,
      extTitleStyle,
      bottomLineStyle,
      rightLineStyle,
      isShowBottomLine,
      isShowRightLine,
      isShowSecondTitle,
      index,
      onSelect,
      isFixed,
      fixedTop,
      navHeight,
      windowWidth,
      isShowApplet,
    } = this.props;
    const itemWidth =
      data.length <= 5 ? px2vw(690 / data.length) : px2vw(690 / 5.5);
    const itemInnerWidth =
      data.length <= 5 ? px2vw(690 / data.length - 20) : px2vw(690 / 5.5 - 20);
    console.log({ isFixed });
    return (
      <View
        className={`CommonTab-wrap ${isFixed ? 'fixed' : ''}`}
        style={{
          top: fixedTop
            ? isShowApplet
              ? px2vw(`${(navHeight / windowWidth) * 375 + 185}`)
              : px2vw(`${(navHeight / windowWidth) * 375 + 105}`)
            : px2vw(42),
          ...containerStyle,
        }}
      >
        <View className='CommonTab-container'>
          <ScrollView
            scrollX
            scrollWithAnimation
            className='scroll-wrap'
            scrollIntoView={`item${parseInt(index / 4) * 4}`}
            style={tabListStyle}
          >
            {data &&
              data.map((val, i) => {
                return (
                  <View
                    className={`tab ${i === index ? 'cur' : ''}`}
                    style={{ width: itemWidth }}
                    key={i}
                    onClick={onSelect.bind(this, i)}
                  >
                    <View
                      className='tab-info'
                      id={`item${i}`}
                      style={tabInfoStyle}
                    >
                      <View
                        className='main-title'
                        style={{
                          maxWidth: itemInnerWidth,
                          ...mainTitleStyle,
                        }}
                      >
                        <Text className='main-title-inner'>{val.title}</Text>
                      </View>
                      {isShowSecondTitle === true && val.subTitle && (
                        <View
                          className='ext-title'
                          style={{
                            maxWidth: itemInnerWidth,
                            ...extTitleStyle,
                          }}
                        >
                          <Text>{val.subTitle}</Text>
                        </View>
                      )}
                      {isShowBottomLine === true && (
                        <View className='bottom-line' style={bottomLineStyle} />
                      )}
                    </View>
                    {isShowRightLine === true && (
                      <View className='right-line' style={rightLineStyle} />
                    )}
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    );
  }
}
