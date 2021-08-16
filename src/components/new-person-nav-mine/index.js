import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { px2vw } from '../../utils/common/utils';
import { filterImg } from '../../utils/common/utils';
import './index.scss';

export default class NewPersonNavMine extends Component {
  constructor(props) {
    super(props);
  }

  renderWidth = (start, all) => {
    let result = `${(parseInt(start, 10) / parseInt(all, 10)) * 100}%`;
    console.log('新人任务进度', result);
    return result;
  };

  renderProcess = data => {
    return `(${data.completeTaskCount}/${data.totalTaskCount})`;
  };

  render() {
    const { data, onGoNewPerson } = this.props;
    return (
      <View className='nav-container'>
        <View
          className='nav-bk-box'
          onClick={onGoNewPerson}
          style={{
            backgroundImage: `url(${filterImg(data && data.floorBg)})`,
          }}
        >
          <View
            className='main-title'
            style={{
              textAlign: data && data.taskStatus === 3 ? 'center' : 'left',
              fontSize: data && data.taskStatus === 3 ? px2vw(32) : px2vw(24),
            }}
          >
            {data && data.taskText}
          </View>
          <View
            className='main-desc'
            style={{
              justifyContent:
                data && data.taskStatus === 3 ? 'center' : 'unset',
            }}
          >
            <View className='main-desc-detail'>
              {`${data && data.taskProgressText}${
                data && data.taskStatus !== 3 ? this.renderProcess(data) : ''
              }`}
            </View>
            {/* 进度条 */}
            {data && data.taskStatus !== 3 && (
              <View className='process-bar'>
                <View className='i-s'></View>
                <View
                  className='b-s'
                  style={{
                    width: this.renderWidth(
                      data && data.completeTaskCount,
                      data && data.totalTaskCount
                    ),
                  }}
                ></View>
              </View>
            )}
          </View>
          <Image
            className='ani-icon'
            src={filterImg(data && data.btnBg)}
            alt='七鲜'
          />
        </View>
      </View>
    );
  }
}
