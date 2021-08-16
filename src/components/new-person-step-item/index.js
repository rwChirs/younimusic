import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { px2vw, filterImg } from '../../utils/common/utils';
import './index.scss';

export default class NewPersonStepItem extends Component {
  constructor(props) {
    super(props);
  }

  setImage = (taskStatus, taskType) => {
    let imageUrl = '';
    if (taskType === 1) {
      if (taskStatus === 3) {
        imageUrl =
          'https://m.360buyimg.com/img/jfs/t1/136455/31/14432/8990/5f9f75eaE1071a02c/055d4d22599eb9c9.png';
      } else if (taskStatus === 1) {
        imageUrl =
          'http://m.360buyimg.com/img/jfs/t1/134513/10/16425/5942/5fb3b36fE87bc93ca/f0d906a9fb0ded8b.png';
      }
    } else {
      imageUrl =
        'http://m.360buyimg.com/img/jfs/t1/148871/38/12906/14352/5f9f76c7E0c4e20ae/1f3432538a7aac1d.png';
    }

    return filterImg(imageUrl);
  };

  setWidth = (now, len) => {
    const nowi = parseInt(now, 10);
    const leni = parseInt(len, 10);
    return `${(nowi / leni) * 100}%`;
  };

  render() {
    const { data } = this.props;
    const { taskPointList } = data;
    return (
      <View className='daily-check-in-container'>
        <View className='daily-check-in-scroll' id='daily-check-in-scroll'>
          {taskPointList &&
            taskPointList.length > 0 &&
            taskPointList.map((val, i) => {
              return (
                <View
                  key={String(i)}
                  className='daily-box'
                  style={{
                    width: `${100 / taskPointList.length}%`,
                  }}
                >
                  <View className='img-outer'>
                    <Image
                      className={`daily-check-in-type daily-check-in-type${
                        val.taskType
                      } ${
                        data.activityStatus === 3 && val.taskStatus === 1
                          ? 'gray-box-s'
                          : ''
                      } `}
                      alt='七鲜'
                      src={
                        val.awardImg
                          ? filterImg(val.awardImg)
                          : this.setImage(val.taskStatus, val.taskType)
                      }
                      style={{
                        position: 'relative',
                        backgroundColor: 'unset',
                      }}
                    />
                    {val.taskStatus === 1 &&
                      val.taskType === 2 &&
                      !val.magicAwardStock && (
                        <View className='sell-out'>已领光</View>
                      )}
                  </View>

                  <View
                    className='daily-check-in-day'
                    style={{
                      color:
                        val.taskStatus === 3
                          ? 'rgba(0,0,0,0.8031)'
                          : 'rgba(0,0,0,0.3994)',
                      textAlign: 'center',
                    }}
                  >
                    {val.taskName}
                  </View>
                </View>
              );
            })}
          <View className='line-box'>
            <View className='gray-box'></View>
            <View
              className='orange-box'
              style={{
                width: this.setWidth(
                  data.completeTaskCount,
                  taskPointList && taskPointList.length
                ),
              }}
            ></View>
            <View
              className='leftModal'
              style={{
                width: taskPointList.length < 4 ? px2vw(84) : px2vw(55),
              }}
            ></View>
            <View
              className='rightModal'
              style={{
                width: taskPointList.length < 4 ? px2vw(84) : px2vw(55),
              }}
            ></View>
          </View>
        </View>
      </View>
    );
  }
}
