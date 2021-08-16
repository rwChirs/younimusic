// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import CountDown from '../../../../components/count-down';
import FloorAdPop from '../../components/floor-ad-pop';
import goPage from '../../goPage';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorRedRun extends Component {
  static defaultProps = {
    data: {
      firstTitle: '',
      secondTitle: '',
      image: '',
      action: '',
      remainingTime: '',
      durationTime: '',
      pictureAspect: '',
      successImage: '',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowStartCountDown: true,
      activityTxt: '',
      isShowFloorAdPop: false,
    };
  }

  componentWillMount() {
    this.setState({
      isShowStartCountDown: this.props.data.remainingTime > 0,
      activityTxt: this.props.data.remainingTime <= 0 ? '正在进行' : '',
      isShowFloorAdPop: this.props.data.remainingTime <= 0,
    });
  }

  finishedStartCount() {
    this.setState({
      isShowStartCountDown: false,
      activityTxt: '正在进行',
      isShowFloorAdPop: true,
    });
  }

  finishedEndCount() {
    this.setState({
      isShowStartCountDown: false,
      activityTxt: '已结束',
      isShowFloorAdPop: false,
    });
  }

  gotoRedRun(redRunSeconds) {
    if (redRunSeconds <= 0) {
      this.setState(
        {
          isShowFloorAdPop: false,
        },
        () => {
          const { action } = this.props.data;
          const storeId = this.props.storeId || '';
          const tenantId = this.props.tenantId || '';
          const platformId = this.props.platformId || '';
          goPage({
            action,
            storeId,
            tenantId,
            platformId,
          });
        }
      );
    }
  }

  render() {
    const { isShowStartCountDown, activityTxt } = this.state;
    const { onGoToUrl, windowWidth, storeId } = this.props;
    const {
      firstTitle,
      secondTitle,
      image,
      action,
      remainingTime,
      durationTime,
      pictureAspect,
      successImage,
      backGroudColor,
    } = this.props.data;
    const h = pictureAspect
      ? Math.max(100, ((windowWidth - 28 * 2) * 0.5) / pictureAspect) + 'px'
      : 'auto';
    return (
      <View
        className='floor-red-run'
        style={{ backgroundColor: `${backGroudColor ? backGroudColor : ''}` }}
      >
        <View
          className='floor-red-run-container'
          style={{ height: h }}
          onClick={onGoToUrl.bind(this, action)}
        >
          <View
            className='left-part'
            style={{
              backgroundImage: `url(${filterImg(image)})`,
            }}
          />
          <View className='right-part'>
            {firstTitle && <View className='right-part-t'>{firstTitle}</View>}
            {secondTitle && <View className='right-part-b'>{secondTitle}</View>}
            {!isShowStartCountDown && activityTxt && (
              <View
                className={`activity-txt ${
                  activityTxt === '已结束' ? 'end-color' : ''
                }`}
              >
                {activityTxt}
              </View>
            )}
            {isShowStartCountDown && (
              <View className='countdown-time'>
                <CountDown
                  seconds={parseInt(
                    (remainingTime > 0 ? remainingTime : 0) / 1000
                  )}
                  width={40}
                  height={46}
                  fontSize={26}
                  splitFontSize={26}
                  splitColor='rgb(250,91,91)'
                  background='linear-gradient(to right, rgb(255, 98, 85) , rgb(242, 52, 36))'
                  splitSpace={10}
                  onFinishedCount={this.finishedStartCount.bind(this)}
                />
              </View>
            )}

            <View className='countdown-time' style={{ display: `none` }}>
              <CountDown
                seconds={parseInt((durationTime + remainingTime) / 1000)}
                width={40}
                height={46}
                fontSize={26}
                splitFontSize={26}
                splitColor='rgb(250,91,91)'
                background='linear-gradient(to right, rgb(255, 98, 85) , rgb(242, 52, 36))'
                splitSpace={10}
                onFinishedCount={this.finishedEndCount.bind(this)}
              />
            </View>
          </View>
        </View>
        {this.state.isShowFloorAdPop && successImage && (
          <FloorAdPop
            isShowFloorAdPop={this.state.isShowFloorAdPop}
            onGotoRedRun={this.gotoRedRun.bind(this)}
            action={action}
            storeId={storeId}
            successImage={successImage}
          />
        )}
      </View>
    );
  }
}
