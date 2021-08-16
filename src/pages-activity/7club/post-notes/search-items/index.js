import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Input, Image, ScrollView, Text } from '@tarojs/components';
import { getSearchInfoApi } from '@7fresh/api';
import { logClick } from '../../utils';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class SearchItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '',
      wareInfos: [],
      selectedWareInfos: (props && props.selectedItems) || [],
      listHeight: 0,
      isInputFocus: false,
      isAjax: false,
    };
  }

  totalPage = 1;
  page = 0;
  pageSize = 20;

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          listHeight: res.windowHeight,
        });
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedItems === this.props.selectedItems) {
      return;
    }
    this.setState({
      selectedWareInfos: nextProps.selectedItems,
    });
  }

  selectItems = args => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|51',
    });
    const { selectedWareInfos } = this.state;
    const index = this.isSelected(args.skuId);
    if (index >= 0) {
      selectedWareInfos.splice(index, 1);
    } else {
      if (selectedWareInfos.length >= 10) {
        Taro.showToast({
          title: '最多添加10个',
          icon: 'none',
        });
      } else {
        selectedWareInfos.push(args);
      }
    }

    this.setState(
      {
        selectedWareInfos: selectedWareInfos,
      },
      () => {
        console.log('selectedWareInfos===', selectedWareInfos);
      }
    );
  };

  isSelected = skuId => {
    let index = -1;
    const { selectedWareInfos } = this.state;
    for (let i = 0; i < selectedWareInfos.length; i++) {
      if (selectedWareInfos[i].skuId === skuId) {
        index = i;
        break;
      }
    }
    return index;
  };

  onKeyup = () => {
    const { keyWord } = this.state;
    if (keyWord) {
      this.totalPage = 1;
      this.page = 0;
      this.setState(
        {
          wareInfos: [],
        },
        () => {
          this.getSearchInfo();
        }
      );
    }
  };

  inputChange = e => {
    const keyWord = e.target.value;
    this.setState(
      {
        keyWord: keyWord,
      },
      () => {
        if (!keyWord) {
          this.clearWareInfos();
        }
      }
    );
  };

  inputOnFocus = () => {
    this.setState({
      isInputFocus: true,
    });
  };

  clearWareInfos = () => {
    this.totalPage = 1;
    this.page = 0;
    this.setState({
      keyWord: '',
      isInputFocus: true,
      wareInfos: [],
    });
  };

  getSearchInfo = () => {
    if (this.totalPage <= this.page) return;
    const { wareInfos, keyWord } = this.state;
    this.page++;
    const args = {
      page: this.page,
      pagesize: this.pageSize,
      keyword: keyWord,
    };
    this.setState(
      {
        isAjax: true,
      },
      () => {
        getSearchInfoApi({ data: args })
          .then(res => {
            console.log('res=======', res);
            this.setState({
              isAjax: false,
            });
            if (res) {
              if (res.searchInfo) {
                const searchInfo = res.searchInfo;
                if (this.page === 1 && searchInfo.totalPage) {
                  this.totalPage = searchInfo.totalPage;
                }
                if (searchInfo && searchInfo.wareInfos) {
                  const _wareInfos =
                    this.page === 1
                      ? searchInfo.wareInfos
                      : [...wareInfos, ...searchInfo.wareInfos];
                  this.setState({
                    wareInfos: _wareInfos,
                  });
                } else {
                  if (this.page === 1) {
                    this.totalPage = 1;
                    this.page = 0;
                    Taro.showToast({
                      title: '当前关键词暂无商品，请修改后重新搜索',
                      icon: 'none',
                    });
                  }
                }
              }
            }
          })
          .catch(() => {
            this.setState({
              isAjax: false,
            });
          });
      }
    );
  };

  handleSelectedWareInfos = () => {
    const { onHandle } = this.props;
    const { selectedWareInfos } = this.state;
    onHandle && typeof onHandle === 'function' && onHandle(selectedWareInfos);
  };

  render() {
    const { navHeight } = this.props;
    const {
      wareInfos,
      listHeight,
      selectedWareInfos,
      isInputFocus,
      keyWord,
    } = this.state;
    console.log('wareInfos==', wareInfos, isInputFocus);
    return (
      <View className='container' style={{ top: navHeight * 2 + 'Px' }}>
        <View className='main'>
          <View className='search-container'>
            <View className='search-bar'>
              {/*{!isInputFocus && <View className='search-icon' />}*/}
              <Input
                type='search'
                className='input'
                placeholder='添加商品'
                value={keyWord}
                placeholderStyle={{
                  fontSize: '30px',
                  color: 'rgb(138,138,138)',
                }}
                onFocus={this.inputOnFocus.bind(this)}
                onConfirm={this.onKeyup.bind(this)}
                onInput={this.inputChange.bind(this)}
              />
              {keyWord && (
                <View
                  className='clear-input'
                  onClick={this.clearWareInfos.bind(this)}
                />
              )}
            </View>
          </View>

          {(!wareInfos || wareInfos.length === 0) && (
            <View className='search-word-tip'>请输入关键词</View>
          )}

          {wareInfos && wareInfos.length > 0 && (
            <View className='items-container'>
              <ScrollView
                className='items-list'
                style={{ height: listHeight - 180 + 'px' }}
                scrollY
                scrollWithAnimation
                lowerThreshold={200}
                onScrollToLower={this.getSearchInfo.bind(this)}
              >
                {wareInfos.map((val, i) => {
                  return (
                    <View className='items-wrap' key={i.toString()}>
                      <View
                        className='items-info'
                        onClick={this.selectItems.bind(this, val)}
                      >
                        <View className='select-wrap'>
                          <View
                            className={`select-icon ${
                              this.isSelected(val.skuId) >= 0 ? 'selected' : ''
                            }`}
                          />
                        </View>
                        <Image className='img' src={filterImg(val.imageUrl)} />
                        <View className='items-name'>{val.skuName}</View>
                      </View>
                    </View>
                  );
                })}

                {/*<View className='items-wrap'>*/}
                {/*<View className='items-info'>*/}
                {/*<View className='select-wrap'>*/}
                {/*<View className='select-icon'></View>*/}
                {/*</View>*/}
                {/*<Image className='img' src='' />*/}
                {/*<View className='items-name'>*/}
                {/*珍滋味港式粥火锅金牌 200g/份*/}
                {/*</View>*/}
                {/*</View>*/}
                {/*</View>*/}
                {this.state.isAjax === true && (
                  <View className='load-home-cont'>
                    <Image
                      className='load-img'
                      src='https://m.360buyimg.com/img/jfs/t1/67174/9/837/9776/5cf0de53Eaf910805/9c96513ec1b53241.png'
                      lazyLoad
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <View className='bottom-container'>
          {(!selectedWareInfos || selectedWareInfos.length === 0) && (
            <View className='no-selected-items'>暂无已选商品</View>
          )}
          {selectedWareInfos && selectedWareInfos.length > 0 && (
            <View className='selected-items'>
              <ScrollView scrollX className='selected-items-wrap'>
                {selectedWareInfos.map((val, i) => {
                  return (
                    <View key={i.toString()} className='img-wrap'>
                      <View className='selected-items-img'>
                        <Image
                          className='selected-items-img-val'
                          src={filterImg(val.imageUrl)}
                        />
                        <View
                          className='selected-items-img-close'
                          onClick={this.selectItems.bind(this, val)}
                        />
                      </View>
                    </View>
                  );
                })}

                {/*<View className='img-wrap'>*/}
                {/*<View className='selected-items-img'>*/}
                {/*<View className='selected-items-img-val' />*/}
                {/*<View className='selected-items-img-close' />*/}
                {/*</View>*/}
                {/*</View>*/}
              </ScrollView>
            </View>
          )}
          <View
            className={`sure-btn ${
              selectedWareInfos && selectedWareInfos.length > 0 ? '' : 'disable'
            }`}
            onClick={this.handleSelectedWareInfos.bind(this)}
          >
            <Text
              className={`${
                selectedWareInfos && selectedWareInfos.length > 0
                  ? ''
                  : 'disable'
              }`}
            >
              完成
            </Text>
            {selectedWareInfos && selectedWareInfos.length > 0 && (
              <Text>({selectedWareInfos.length})</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
