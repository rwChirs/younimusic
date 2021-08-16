import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
import { View, Image,Text } from "@tarojs/components";
import FreshSplitLine  from '../FreshSplitLine'
import "./index.scss";

export default class FreshSolitaireDetailPanel extends Component {
  constructor(props) {
    super(props);
  }
  onClick = () => {
    this.props.onClick()
  }

  render() {
    const { buttonText, price, description, unit, type, priceText } = this.props
    const picture =
      Number(type) === 1
        ? 'https://m.360buyimg.com/img/jfs/t1/50659/15/14318/337/5db2aad7Ee3329e86/a5dce194d30c0cec.png'
        : 'https://m.360buyimg.com/img/jfs/t1/15923/34/14265/401/5cb549d2Ea7bc8ca6/a298c77d47aa638a.png'

    return (
      <View
        className={
          Number(type) === 1
            ? 'solitaire-detail-panel fight-group'
            : 'solitaire-detail-panel'
        }
        onClick={this.onClick.bind(this)}
      >
        <View className='left'>
          <View className='top'>
            <Text className='title'>{priceText}</Text>
            <Text className='price'>
              ¥{price}
              {unit}
            </Text>
          </View>
          <View className='info'>{description}</View>
        </View>
        <FreshSplitLine
          width={1}
          height={30}
          color={Number(type) === 1 ? 'rgb(255,255,255)' : 'rgb(132,63,46)'}
          opacity={0.2}
        />
        <View className='btn'>
          <Text className='description'>{buttonText}</Text>
          <Image className='picture' src={picture} mode='aspectFit' lazyLoad />
        </View>
      </View>
    )
  }
}
