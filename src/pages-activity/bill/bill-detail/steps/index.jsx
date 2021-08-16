import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { addHttps, numberToChinese } from '../../../../utils/common/utils';
import './index.scss';

export default class Steps extends Component {
  static defaultProps = {
    items: [],
  };

  onPreview = (i) => {
    Taro.previewImage({
      current: addHttps(this.props.items[i].imgList[0].url),
      urls: this.props.items.map((item) => addHttps(item.imgList[0].url)),
    });
  };

  render() {
    const { items } = this.props;
    return (
      <View className='steps'>
        {items &&
          items.length > 0 &&
          items.map((val, i) => {
            return (
              <View className='steps-item' key={i}>
                <View className='step-name'>第{numberToChinese(i + 1)}步</View>
                {val.imgList.length && (
                  <View
                    className='img-wrap'
                    onClick={this.onPreview.bind(this, i)}
                  >
                    <Image
                      src={addHttps(val.imgList[0].url)}
                      className='img'
                      mode='aspectFill'
                    />
                    {/* <View className="num">
                    <Text className="index">{i + 1}</Text>
                    <Text className="total">/{items.length}</Text>
                  </View> */}
                  </View>
                )}
                <View className='desc'>{val.stepDesc}</View>
              </View>
            );
          })}
      </View>
    );
  }
}
