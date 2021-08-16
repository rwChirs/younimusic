import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import FloorHeader from '../../components/common-header';
import StackingSwiper from '../../components/stacking-swiper';
import { commonLogExposure } from '../../../../utils/common/logReport';

export default class FloorBetter100 extends Component {
  static defaultProps = {
    data: {
      pictureAspect: 0,
      image: '',
      items: [],
      moreAction: [],
      horizontalScrollIndicator: 1,
      action: {},
    },
    speed: 3000,
    duration: 500,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.isVisible = false; // 在可视区域内
  }

  componentWillMount() {
    this.imageExposure();
  }

  componentWillUnmount() {
    this._intersectionObserver && this._intersectionObserver.disconnect();
  }

  // 图片曝光
  imageExposure = () => {
    const {
      data: { floorIndex },
    } = this.props;

    const targetDom = `#floor-better-100-${floorIndex}`;
    this._intersectionObserver = Taro.createIntersectionObserver(this.$scope);
    this._intersectionObserver
      .relativeToViewport({ left: 0, right: 0, top: -150, bottom: -150 })
      .observe(targetDom, (res) => {
        this.isVisible = res && res.intersectionRatio > 0;
      });
  };

  onGoToUrl = () => {
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({ ...action, target: 1 });
  };

  handleImgClick = (item) => {
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({
      ...action,
      target: 3,
      index: item.index + 1,
      mageUrl: item.image,
    });
  };

  scrollChange(index) {
    const {
      data: { floorIndex, buriedPointVo, items },
    } = this.props;
    const targetDom = `floor-better-100-image${index}`;
    if (this.isVisible) {
      if (!this[targetDom]) {
        //曝光埋点
        if (buriedPointVo) {
          const expAction = {
            target: 3,
            index: index + 1,
            imageUrl: items && items[index] && items[index].image,
            floorIndex,
          };
          commonLogExposure({
            action: expAction, // 曝光动作参数
            buriedPointVo: buriedPointVo,
          });
          this[targetDom] = true;
        }
      }
    }
  }

  render() {
    const { data, speed, duration } = this.props;
    const { action, floorIndex } = data;
    return (
      <View className='floor-scramble-today-wrap'>
        <View className='floor-scramble-today' onClick={this.onGoToUrl}>
          <FloorHeader
            firstTitle={data.firstTitle || '优选100'}
            secondTitle={data.secondTitle || '网红爆款用心推荐'}
            data={action}
            onGoToUrl={this.onGoToUrl}
          />
          {data && data.items && (
            <View
              className='floor-scramble-today-goods'
              id={`floor-better-100-${floorIndex}`}
            >
              <StackingSwiper
                onClick={this.handleImgClick}
                data={data}
                speed={speed}
                duration={duration}
                onChange={this.scrollChange.bind(this)}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
