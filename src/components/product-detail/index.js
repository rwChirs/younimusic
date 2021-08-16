import Taro from '@tarojs/taro'
import React, { Component } from 'react';
import { View } from '@tarojs/components';
import { getNodes } from './fix-picture';
import PriceDesc from '../price-desc';
import RecommendDesc from '../recommend-desc';
import LazyLoadImage from '../render-html/lazy-load-image';
import { zipPicture } from '../../utils/common/utils';
import './index.css';

export default class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          width: res.windowWidth,
        });
      },
    });
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.detail &&
      this.props.detail &&
      nextProps.detail.length === this.props.detail.length
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { detail, specs, priceDesc, recommendDesc } = this.props;
    return (
      <View className='product-detail'>
        {recommendDesc && <RecommendDesc title='推荐语' text={recommendDesc} />}
        {specs && specs.length > 0 && (
          <View className='specs'>
            {specs.map((item, index) => {
              return (
                <View className='spec' key={index}>
                  <View className='spec-name'>{`${item.name}：`}</View>
                  <View className='spec-value'>
                    {item.value ? item.value : ''}
                  </View>
                </View>
              );
            })}
          </View>
        )}
        {/* {detail ? <RenderHtml nodes={detail} /> : <View>暂无信息</View>} */}
        {getNodes(detail).map((img, index) => {
          return (
            <LazyLoadImage
              width={this.state.width}
              src={zipPicture(img)}
              key={index}
            />
          );
        })}
        {priceDesc && <PriceDesc data={priceDesc} onClick={this.onClick} />}
      </View>
    );
  }
}
