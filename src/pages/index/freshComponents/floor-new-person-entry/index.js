// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorNewPersonEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderWidth = (start, all) => {
    let result = `${(parseInt(start) / parseInt(all)) * 100}%`;
    console.log('新人任务进度', result);
    return result;
  };

  render() {
    const { data, onGoNewPerson } = this.props;
    const newUserTaskEntranceInfo =
      (data && data.newUserTaskEntranceInfo) || '';
    return (
      <View className='new-person-home-entry'>
        <View className='nav-container'>
          <View
            className='nav-bk-box'
            onClick={onGoNewPerson}
            style={{
              backgroundImage: `url(${filterImg(
                (newUserTaskEntranceInfo && newUserTaskEntranceInfo.floorBg) ||
                  ''
              )})`,
            }}
          >
            <View className='main-tag'>
              {newUserTaskEntranceInfo &&
                newUserTaskEntranceInfo.taskStatusText}
            </View>
            <View className='main-title'>
              {newUserTaskEntranceInfo && newUserTaskEntranceInfo.taskText}
            </View>
            <View className='main-desc'>
              {newUserTaskEntranceInfo && (
                <View className='main-desc-detail'>
                  {`${newUserTaskEntranceInfo.taskProgressText}(${newUserTaskEntranceInfo.completeTaskCount}/${newUserTaskEntranceInfo.totalTaskCount})`}
                </View>
              )}

              {/* 进度条 */}

              <View className='process-bar'>
                <View className='ti-i'></View>
                <View
                  className='ti-b'
                  style={{
                    width: this.renderWidth(
                      newUserTaskEntranceInfo &&
                        newUserTaskEntranceInfo.completeTaskCount,
                      newUserTaskEntranceInfo &&
                        newUserTaskEntranceInfo.totalTaskCount
                    ),
                  }}
                ></View>
              </View>
            </View>
            <Image
              className='ani-icon'
              src={newUserTaskEntranceInfo && newUserTaskEntranceInfo.btnBg}
            />
          </View>
        </View>
      </View>
    );
  }
}
