import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import User from '../../components/formal-item-card/user/index';
import TextWithIcon from '../../components/text-with-icon/index';
import { filterImg } from '../../utils';
import './index.scss';

export default class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //跳转7club详情页
  onGoDetail() {
    this.props.onGoDetail(this.props.data);
  }

  //修改收藏状态
  onChangeCollect() {
    this.props.onChangeCollect({
      ...this.props.data,
      index: this.props.uniqueId,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <View onClick={this.onGoDetail.bind(this)}>
        <View className='user-box'>
          <User author={data.author} />
        </View>
        {data.title && (
          <TextWithIcon
            label={data.tags}
            content={data.title}
            styleObj={{
              fontSize: '34rpx',
              fontWeight: 500,
            }}
            lineNum={1}
          />
        )}
        <TextWithIcon
          label={data.title ? null : data.categoryName}
          content={data.preface}
          isCollapse={false}
          isShowAll={false}
        />
        <View className='content-box'>
          {data &&
            data.contentType !== 5 &&
            data.contentDetailInfoList &&
            data.contentDetailInfoList.length > 0 &&
            data.contentDetailInfoList.map((val, i) => {
              return (
                <View className='content-item' key={i}>
                  {val.stepDesc && (
                    <Text className='content-name'>{val.stepDesc}</Text>
                  )}
                  {val.imgList.length &&
                    val.imgList.length > 0 &&
                    val.imgList.map((img, index) => {
                      return img ? (
                        <Image
                          src={filterImg(img.url)}
                          className='img'
                          mode='widthFix'
                          key={index}
                        />
                      ) : (
                        ''
                      );
                    })}
                  {val.contentDesc && (
                    <View className='desc'>{val.contentDesc}</View>
                  )}
                </View>
              );
            })}
          {data && data.contentType === 5 && (
            <View className='content-item'>
              {data.images.length &&
                data.images.length > 0 &&
                data.images.map((img, index) => {
                  return img ? (
                    <Image
                      src={filterImg(img)}
                      className='img'
                      mode='widthFix'
                      key={index}
                    />
                  ) : (
                    ''
                  );
                })}
            </View>
          )}
        </View>
      </View>
    );
  }
}
