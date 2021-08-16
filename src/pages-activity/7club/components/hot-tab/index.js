import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView, Image } from '@tarojs/components';
import { px2vw, getRealValue } from '../../../../utils/common/utils';
import { logClick } from '../../../../utils/common/logReport';
import { HOT_TAB } from '../../reportPoints';
import './index.scss';

export default class HotTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixClass: '',
      navHeight: '',
    };
  }

  hotTabTop = null;
  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        console.log(
          '【设备监控信息】:',
          res,
          wx.getMenuButtonBoundingClientRect()
        );
        this.windowHeight = res.windowHeight;
        this.windowWidth = res.windowWidth;
        this.setState(
          {
            compatibleHeight: res.statusBarHeight * 2 + 80,
          },
          () => {
            let clientRect = wx.getMenuButtonBoundingClientRect();
            if (clientRect) {
              if (res.brand === 'HUAWEI') {
                this.setState({
                  navHeight: clientRect.height * 2 + clientRect.top * 2 + 20,
                });
              } else {
                const windowWidth = Taro.getSystemInfoSync().windowWidth;
                const navHeightOri =
                  (clientRect.bottom + clientRect.top - res.statusBarHeight) *
                  2;
                this.setState({
                  // navHeight: clientRect.height * 2 + clientRect.top * 2 - 4,
                  // 20210204发现有刘海屏的iphone 置顶时候有条缝儿
                  navHeight: (navHeightOri / windowWidth) * 375,
                });
              }
            } else {
              this.setState({
                navHeight: this.state.compatibleHeight,
              });
            }
          }
        );
      },
    });
  }
  componentDidMount() {
    this.getPosition();
  }

  getPosition = () => {
    const { onGetFixClass, onGetFixScrollTop } = this.props;
    const top = getRealValue(200, this.windowWidth);
    const query = Taro.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select('#targetArea').boundingClientRect();
    try {
      this._intersectionObserver = Taro.createIntersectionObserver(this.$scope);
      this._intersectionObserver
        .relativeToViewport({ top: -top })
        .observe('#hotTitle', (res = {}) => {
          // console.log('********_intersectionObserver', res);
          if (
            (res.intersectionRatio === 0 && res.boundingClientRect.top > 44) ||
            !res
          ) {
            return;
          }

          const fixClass = res.intersectionRatio === 0 ? 'fix' : '';
          onGetFixClass &&
            typeof onGetFixClass === 'function' &&
            onGetFixClass(fixClass, res.intersectionRatio);
          this.setState({
            fixClass,
          });
          query.exec((res1 = []) => {
            // console.log('取得 tab 位置', res1);
            if (res1[0]) {
              this.hotTabTop = res1[0].scrollTop;
              if (fixClass && res.intersectionRatio === 0) {
                onGetFixScrollTop &&
                  typeof onGetFixScrollTop === 'function' &&
                  onGetFixScrollTop(this.hotTabTop);
              }
            }
          });
        });
    } catch (err) {
      console.warn('版本过低不支持吸顶特性', err);
    }
  };

  onTabClick = (index, e) => {
    logClick({ e, eid: HOT_TAB, eparam: { tabId: index } });
    if (index === this.props.index) return;
    this.props.onTabChange({
      ...this.props.list[index],
      index,
      // hotTabScrollTop: this.hotTabTop,
    });
  };

  render() {
    const { fixClass, navHeight } = this.state;
    const { list, index, isFixed } = this.props;
    return (
      <View>
        <View id='hotTitle' className='hot-titile'>
          {fixClass && <view style={{ height: px2vw(80) }}></view>}
          <ScrollView
            className={`hot-tab ${isFixed ? fixClass : ''}`}
            scrollX
            scrollWithAnimation
            style={{
              height: fixClass ? px2vw(90) : px2vw(140),
              top: fixClass ? px2vw(navHeight) : '',
            }}
          >
            <View className={`target ${list.length > 5 ? '' : 'average'}`}>
              {list &&
                list.length > 0 &&
                list.map((item, i) => (
                  <View
                    key={`item${i}`}
                    className='tab-con'
                    onClick={this.onTabClick.bind(this, i)}
                    style={{
                      height: !fixClass ? 'auto' : px2vw(90),
                      lineHeight: !fixClass ? 1 : px2vw(90),
                    }}
                  >
                    <View
                      className={`tab-item-title ${
                        index === i ? 'active' : ''
                      }`}
                    >
                      {item.noSelectedImgUrl && item.selectedImgUrl ? (
                        <Image
                          className='title-img'
                          src={
                            index === i
                              ? item.selectedImgUrl
                              : item.noSelectedImgUrl
                          }
                          alt=''
                        />
                      ) : (
                        item.title
                      )}
                    </View>
                    {!fixClass && item.subTitle && (
                      <View
                        className='tab-item'
                        onClick={this.onTabClick.bind(this, i)}
                      >
                        <View
                          className={`tab-item-txt ${
                            index === i ? 'active' : ''
                          }`}
                        >
                          {item.subTitle}
                        </View>
                      </View>
                    )}
                    {index === i && (fixClass || !item.subTitle) && (
                      <View className='active-line'></View>
                    )}
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
