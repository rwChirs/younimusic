import Taro,{getCurrentInstance} from '@tarojs/taro';
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Image,
  Input,
  Textarea,
  ScrollView,
} from '@tarojs/components';
import { clubRelease, getClubTopicDetail } from '@7fresh/api';
import { logClick, exportPoint } from '../utils';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import utils from '../../../pages/login/util';
import getUserStoreInfo from '../../../utils/common/getUserStoreInfo';
import { filterImg, h5Url } from '../../../utils/common/utils';
import FreshUploadModal from './upload-modal';
import NavBar from './nav-bar';
import SearchItems from './search-items';
// import cancelConfirmModal from './cancel-confirm-modal';
// import ruleModal from './rule-modal';
import './index.scss';
import ImageFilters from './weImageFilters/weImageFilters.js';

export default class PostNotes extends CommonPageComponent {

  constructor(props) {
    super(props);
    this.state = {
      statusHeight: '',
      navHeight: '',
      imgList: [
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
        // 'https://m.360buyimg.com/pop/jfs/t1/145030/40/210/52934/5eddd9f2E69e0db45/43d5a0439279e3f2.jpg!cc_4x3',
      ],
      newFilterImgsBak: [],
      inputValue: '',
      textAreaValue: '',
      isShowSearchItemsModal: false,
      isShowFilterImgModal: false,
      isShowCutImgModal: false,
      isShowRuleModal: false,
      filterImgModalSrc: '',
      currentImgIndex: 0,
      updateIndex: -1,
      originalFilterImgs: [
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
      ],
      newFilterImgs: [
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
        // 'http://tmp/wxb8c24a764d1e1e6d.o6zAJs2RO8d-lCj37f1wq4ipTwHY.pKolpiBi6eNYc9253a1a0c531db839b9c69618f8e829.jpeg',
      ],
      skin: '',
      isAllFilterImg: false,
      isShowCancelConfirmModal: false,
      selectedWareInfos: [],
      clubTopicInfo: '',
      filterImgsType: [
        'none',
        'saturate',
        'contrast',
        'brightness',
        'rgb',
        'white-balance',
      ],
      inputTxtCount: -1,
      textAreaTxtCount: -1,
      isHasGif: false,
      uploadOption: {
        show: false,
        hasHandle: false,
      },
    };
  }

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.windowHeight = res.windowHeight;
        this.windowWidth = res.windowWidth;

        this.setState(
          {
            statusHeight: res.statusBarHeight,
            navHeight: res.statusBarHeight + 44,
          },
          () => {
            this.getStoreId();
            let query = wx.createSelectorQuery();
            query
              .select('.container')
              .boundingClientRect(rect => {
                this.containereight1 = rect.height;
              })
              .exec();
            query
              .select('.main')
              .boundingClientRect(rect => {
                this.maineight2 = rect.height;
              })
              .exec();
            query
              .select('.rule')
              .boundingClientRect(rect => {
                this.ruleHeight3 = rect.height;
              })
              .exec();
          }
        );
      },
    });
  }

  getStoreId = () => {
    let addressInfo = Taro.getStorageSync('addressInfo') || {};
    if (typeof addressInfo === 'string' && addressInfo) {
      addressInfo = JSON.parse(addressInfo);
    }

    let { storeId = '' } = getCurrentInstance().router.params;
    if (addressInfo && addressInfo.storeId) {
      storeId = addressInfo.storeId;
    }

    //三公里定位
    getUserStoreInfo(storeId, '', '', '', 3)
      .then(res => {
        this.setState(
          {
            storeId: res.storeId || 131229,
          },
          () => {
            this.getClubTopicDetailFun();
          }
        );
      })
      .catch(err => {
        this.getClubTopicDetailFun();
        console.log(err);
      });
  };

  // 上传前置操作
  onBeforeUploadImg = () => {
    let isAfterSaleModal = Taro.getStorageSync('isAfterSaleModal') || '';
    if (isAfterSaleModal === 'y') {
      this.chooseImages();
    } else {
      this.setState({
        uploadOption: {
          show: true,
        },
      });
    }
  };

  //上传图片
  chooseImages = () => {
    const { imgList } = this.state;
    const _imgList = imgList;
    const len = _imgList.length;
    if (len >= 9) {
      return;
    }

    Taro.chooseImage({
      count: 9 - len,
      success: result => {
        let tempFilePaths = result.tempFilePaths;
        this.originalTempFilePaths = tempFilePaths;
        let gifCanvasWH = [];
        //gif转静态图
        for (let i = 0; i < tempFilePaths.length; i++) {
          let image = tempFilePaths[i];
          if (this.isGif(image)) {
            this.setState(
              {
                isHasGif: true,
              },
              () => {
                Taro.getImageInfo({
                  src: image,
                }).then(res => {
                  const imgW = res.width;
                  const imgH = res.height;
                  gifCanvasWH[i] = [imgW, imgH];
                  this.setState(
                    {
                      gifCanvasWH,
                    },
                    () => {
                      let ctx = wx.createCanvasContext(`canvas-gif${i}`);
                      ctx.drawImage(image, 0, 0, imgW, imgH);
                      ctx.draw(false, () => {
                        // 生成图片
                        wx.canvasToTempFilePath({
                          canvasId: `canvas-gif${i}`,
                          success: resData => {
                            console.log(resData.tempFilePath);
                            tempFilePaths[i] = resData.tempFilePath;
                            this.setState({
                              originalFilterImgs: tempFilePaths,
                              newFilterImgs: tempFilePaths,
                              isHasGif: false,
                            });
                          },
                        });
                      });
                    }
                  );
                });
              }
            );
          }
        }

        this.setState({
          currentImgIndex: 0,
          originalFilterImgs: tempFilePaths,
          newFilterImgs: tempFilePaths,
          skin: 'black',
        });
      },
    });
  };

  //判断是否gif图
  isGif = image => {
    let type = '',
      bool = false;
    if (image) {
      type = image.match(/^(.*)(\.)(.{1,8})$/)[3];
      type = type.toLowerCase();
    }
    if (type === 'gif') {
      bool = true;
    }
    return bool;
  };

  uploadImgs = () => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|49',
    });
    const {
      imgList,
      newFilterImgs,
      newFilterImgsBak,
      updateIndex,
    } = this.state;
    const _imgList = imgList;
    const _newFilterImgsBak = newFilterImgsBak;
    const len = _imgList.length;
    if (len >= 9) {
      return;
    }
    let uuid = '';
    const exportPoint2 = Taro.getStorageSync('exportPoint');
    if (
      exportPoint2 &&
      typeof exportPoint2 === 'string' &&
      exportPoint2 !== '{}'
    ) {
      uuid = JSON.parse(exportPoint2).openid;
    }

    if (newFilterImgs && newFilterImgs.length > 0) {
      for (let i = 0; i < newFilterImgs.length; i++) {
        if (len + i > 8) {
          break;
        }
        Taro.uploadFile({
          url: 'https://pic.jd.com/2/dd056064222048a5be3856e72e172561',
          filePath: newFilterImgs[i],
          name: 'file',
          formData: {
            loginType: '2',
            appkey: 'dd056064222048a5be3856e72e172561',
            client: 'm',
            uuid: uuid,
          },
          success: res => {
            console.log('uploadImgs res=', res);
            if (res && res.data && typeof res.data === 'string') {
              const data = JSON.parse(res.data);
              if (data.id === '1' && data.msg) {
                let imgUrl = 'https://m.360buyimg.com/pop/' + data.msg;
                Taro.getImageInfo({
                  src: newFilterImgs[i],
                  complete: result => {
                    console.log('result=', result);
                    let ratio = result.width / result.height;
                    if (ratio.toFixed(1) != (4 / 3).toFixed(1)) {
                      imgUrl = imgUrl + `!cc_4x3`;
                    }

                    if (updateIndex > -1) {
                      _imgList[updateIndex] = imgUrl;
                      _newFilterImgsBak[updateIndex] = newFilterImgs[i];
                    } else {
                      _imgList[len + i] = imgUrl;
                      _newFilterImgsBak[len + i] = newFilterImgs[i];
                    }

                    this.setState({
                      imgList: _imgList,
                      newFilterImgsBak: _newFilterImgsBak,
                      originalFilterImgs: [],
                      newFilterImgs: [],
                      updateIndex: -1,
                      filterImgModalSrc: '',
                      title: '',
                      skin: '',
                    });
                  },
                });
              }
            }
          },
          fail: err => {
            console.log('err=', err);
            this.setState({
              updateIndex: -1,
            });
          },
        });
      }
    }
  };

  //是否同步所有图片
  isAllFilterImgFun = () => {
    const { isAllFilterImg } = this.state;
    this.setState({
      isAllFilterImg: !isAllFilterImg,
    });
  };

  //原图
  getOriginalImgs = index => {
    const { originalFilterImgs } = this.state;
    this.setState({
      filterImgModalSrc: originalFilterImgs[index],
    });
  };

  //滤镜所有样式
  /*
  filterImgAllTypes(tempFilePaths) {

    const that = this;
    that.setState(
      {
        tempFilePaths: tempFilePaths,
      },
      () => {
        for (let x = 0; x < tempFilePaths.length; x++) {
          const imgSrc = tempFilePaths[x];
          wx.getImageInfo({
            src: imgSrc,
            success: function(res) {
              const imgW = res.width;
              const imgH = res.height;
              that.setState(
                {
                  canvasW: imgW,
                  canvasH: imgH,
                },
                () => {
                  let ctx = wx.createCanvasContext(`canvas${x}`);
                  ctx.drawImage(imgSrc, 0, 0, imgW, imgH);
                  ctx.draw(false, function() {
                    wx.canvasGetImageData({
                      canvasId: `canvas${x}`,
                      x: 0,
                      y: 0,
                      width: imgW,
                      height: imgH,
                      success(result) {
                        const { filterImgsType } = that.state;
                        let filterImgs = [];
                        filterImgs[0] = tempFilePaths[0];
                        for (let y = 1; y < filterImgsType.length; y++) {
                          let filtered = {};
                          if (y === 1) {
                            filtered = ImageFilters.Desaturate(result);
                          } else if (y === 2) {
                            filtered = ImageFilters.BrightnessContrastPhotoshop(
                              result,
                              1,
                              20
                            );
                          } else if (y === 3) {
                            filtered = ImageFilters.Brightness(result, 60); //测试
                          } else if (y === 4) {
                            const data = result.data;
                            for (
                              let i = 0;
                              i < result.width * result.height;
                              i++
                            ) {
                              let R = data[i * 4 + 0];
                              let G = data[i * 4 + 1];
                              let B = data[i * 4 + 2];
                              let grey = R + G + B;
                              // let grey = R + G * 1.076311 + B;
                              data[i * 4 + 0] = grey;
                              data[i * 4 + 1] = grey;
                              data[i * 4 + 2] = grey;
                            }
                            filtered.data = data;
                          } else if (y === 5) {
                            filtered = ImageFilters.Binarize(result, 0.6); //测试
                          }
                          wx.canvasPutImageData({
                            canvasId: `canvas${x}`,
                            x: 0,
                            y: 0,
                            width: imgW,
                            height: imgH,
                            data: filtered.data,
                            success() {
                              wx.canvasToTempFilePath({
                                canvasId: `canvas${x}`,
                                x: 0,
                                y: 0,
                                width: imgW,
                                height: imgH,
                                destWidth: imgW,
                                destHeight: imgH,
                                success: function(resData) {
                                  filterImgs[y] = resData.tempFilePath;
                                  if (
                                    filterImgs.length === filterImgsType.length
                                  ) {
                                    that.setState(
                                      {
                                        filterImgs: filterImgs,
                                      },
                                      () => {
                                        console.log(filterImgs[0]);
                                        console.log(filterImgs[1]);
                                        console.log(filterImgs[2]);
                                        console.log(filterImgs[3]);
                                        console.log(filterImgs[4]);
                                        console.log(filterImgs[5]);
                                      }
                                    );
                                  }
                                },
                              });
                            },
                          });
                        }
                      },
                    });
                  });
                }
              );
            },
          });
        }
      }
    );
  }
*/

  //滤镜
  filterImg = (tempFilePaths, typeIndex, currentImgIndex) => {
    const that = this;
    console.log('tempFilePaths============', tempFilePaths);
    const { isAllFilterImg } = that.state;
    that.setState(
      {
        typeIndex: typeIndex || 0,
        tempFilePaths: tempFilePaths,
      },
      () => {
        if (that.state.typeIndex === 0) {
          if (isAllFilterImg) {
            that.setState({
              newFilterImgs: that.state.originalFilterImgs,
              isShowFilterImgModal: false,
              isAllFilterImg: false,
              filterImgModalSrc: '',
            });
          } else {
            that.getOriginalImgs(currentImgIndex);
          }
          return;
        }

        const _newFilterImgs = [];
        for (let x = 0; x < tempFilePaths.length; x++) {
          const imgSrc = tempFilePaths[x];
          wx.getImageInfo({
            src: imgSrc,
            success: function(res) {
              const imgW = res.width;
              const imgH = res.height;
              // const imgW = 375;
              // const imgH = Math.round((375 * res.height) / res.width);

              that.setState(
                {
                  canvasW: that.windowWidth,
                  canvasH: that.windowWidth * (imgH / imgW),
                },
                () => {
                  let ctx = wx.createCanvasContext(`canvas${x}`);
                  ctx.drawImage(
                    imgSrc,
                    0,
                    0,
                    that.state.canvasW,
                    that.state.canvasH
                  );
                  ctx.draw(false, function() {
                    wx.canvasGetImageData({
                      canvasId: `canvas${x}`,
                      x: 0,
                      y: 0,
                      width: that.state.canvasW,
                      height: that.state.canvasH,
                      success(result) {
                        console.log('result=====', result);
                        let filtered = {};
                        if (typeIndex === 1) {
                          filtered = ImageFilters.Desaturate(result);
                        } else if (typeIndex === 2) {
                          filtered = ImageFilters.BrightnessContrastPhotoshop(
                            result,
                            1,
                            20
                          );
                        } else if (typeIndex === 3) {
                          filtered = ImageFilters.Brightness(result, 60); //测试
                        } else if (typeIndex === 4) {
                          const data = result.data;
                          for (
                            let i = 0;
                            i < result.width * result.height;
                            i++
                          ) {
                            let R = data[i * 4 + 0];
                            let G = data[i * 4 + 1];
                            let B = data[i * 4 + 2];
                            let grey = R + G + B;
                            // let grey = R + G * 1.076311 + B;
                            data[i * 4 + 0] = grey;
                            data[i * 4 + 1] = grey;
                            data[i * 4 + 2] = grey;
                          }
                          filtered.data = data;
                        } else if (typeIndex === 5) {
                          filtered = ImageFilters.Binarize(result, 0.6); //测试
                        }

                        // var filtered = ImageFilters.Brightness(result, 0.089802);
                        console.log('filtered====', filtered);
                        wx.canvasPutImageData({
                          canvasId: `canvas${x}`,
                          x: 0,
                          y: 0,
                          width: that.state.canvasW,
                          height: that.state.canvasH,
                          data: filtered.data,
                          success() {
                            wx.canvasToTempFilePath({
                              canvasId: `canvas${x}`,
                              x: 0,
                              y: 0,
                              width: that.state.canvasW,
                              height: that.state.canvasH,
                              destWidth: that.state.canvasW,
                              destHeight: that.state.canvasH,
                              success: function(resData) {
                                console.log(
                                  'resData.tempFilePath=====',
                                  resData.tempFilePath
                                );
                                if (isAllFilterImg) {
                                  _newFilterImgs[x] = resData.tempFilePath;
                                  that.setState(
                                    {
                                      newFilterImgs: _newFilterImgs,
                                    },
                                    () => {
                                      if (
                                        _newFilterImgs.length ===
                                        tempFilePaths.length
                                      ) {
                                        that.setState({
                                          isShowFilterImgModal: false,
                                          isAllFilterImg: false,
                                          filterImgModalSrc: '',
                                        });
                                      }
                                    }
                                  );
                                } else {
                                  that.setState({
                                    filterImgModalSrc: resData.tempFilePath,
                                  });
                                }
                              },
                            });
                          },
                        });
                      },
                    });
                  });
                }
              );
            },
          });
        }
      }
    );
  };

  sureFilterImg = () => {
    const {
      originalFilterImgs,
      newFilterImgs,
      filterImgModalSrc,
      currentImgIndex,
      isAllFilterImg,
      typeIndex,
    } = this.state;
    if (isAllFilterImg) {
      this.filterImg(originalFilterImgs, typeIndex);
    } else {
      let _newFilterImgs = newFilterImgs;
      if (filterImgModalSrc) {
        _newFilterImgs[currentImgIndex] = filterImgModalSrc;
      }
      this.setState(
        {
          filterImgModalSrc: '',
          newFilterImgs: _newFilterImgs,
          isShowFilterImgModal: false,
        },
        () => {
          console.log('newFilterImgs=', this.state.newFilterImgs);
        }
      );
    }
  };

  //删除图片
  delImg = index => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|50',
    });
    const that = this;
    const { imgList, newFilterImgsBak } = that.state;
    const _imgList = imgList;
    const _newFilterImgsBak = newFilterImgsBak;
    _imgList.splice(index, 1);
    _newFilterImgsBak.splice(index, 1);
    that.setState({
      imgList: _imgList,
      newFilterImgsBak: _newFilterImgsBak,
    });
  };

  txtChange = (total, e) => {
    const txt = (e && e.detail && e.detail.value) || '';
    if (total === 20) {
      this.setState({
        inputTxtCount: total - txt.length,
        inputValue: txt,
      });
      if (total - txt.length === 0) {
        Taro.showToast({
          title: '标题最多20字哦~',
          icon: 'none',
        });
      }
    } else if (total === 200) {
      this.setState({
        textAreaTxtCount: total - txt.length,
        textAreaValue: txt,
      });
      if (total - txt.length === 0) {
        Taro.showToast({
          title: '内容最多200字哦~',
          icon: 'none',
        });
      }
    }
  };

  handleBack = () => {
    const { isShowSearchItemsModal, newFilterImgs } = this.state;
    if (isShowSearchItemsModal) {
      this.setState({
        isShowSearchItemsModal: false,
        title: '',
      });
    } else if (newFilterImgs && newFilterImgs.length > 0) {
      this.setState({
        originalFilterImgs: [],
        newFilterImgs: [],
        filterImgModalSrc: '',
        title: '',
        skin: '',
      });
    } else {
      const {
        imgList,
        inputValue,
        textAreaValue,
        selectedWareInfos,
      } = this.state;
      if (
        imgList.length > 0 ||
        inputValue.length > 0 ||
        textAreaValue.length > 0 ||
        selectedWareInfos.length > 0
      ) {
        this.setState({
          isShowCancelConfirmModal: true,
        });
      } else {
        this.onSureBack();
      }
    }
  };

  onSureBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      Taro.switchTab({
        url: '/pages/center-tab-page/index',
      });
    }
  };

  showSearchItemsModal = () => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|51',
    });
    this.setState({
      isShowSearchItemsModal: true,
      title: '搜索商品',
    });
  };

  // type == filter-滤镜 cut-裁剪
  showFilterImgModal = (tems, type) => {
    this.setState(
      {
        isShowFilterImgModal: type === 'filter' ? true : false,
        isShowCutImgModal: type === 'cut' ? true : false,
        typeIndex: 0,
      },
      () => {
        this.cropper = this.$scope.selectComponent('#image-cropper');
        // console.log('this.cropper', this.cropper);
        // this.filterImgAllTypes(tems);
      }
    );
  };

  // type == filter-滤镜 cut-裁剪
  closeFilterImgModal = () => {
    this.setState({
      isShowFilterImgModal: false,
      isShowCutImgModal: false,
    });
  };

  changeIndex = ev => {
    this.setState({
      currentImgIndex: ev.currentTarget.current,
    });
  };

  handleSelectedWareInfos = selectedWareInfos => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|52',
    });
    this.setState({
      selectedWareInfos: selectedWareInfos,
      isShowSearchItemsModal: false,
      title: '',
    });
  };

  //跳转社区规范页面
  gotoClubRule = () => {
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|54',
    });
    let uuid = '';
    const wxUserInfo = Taro.getStorageSync('exportPoint');
    if (wxUserInfo && typeof wxUserInfo === 'string' && wxUserInfo !== '{}') {
      uuid = JSON.parse(wxUserInfo).openid;
    }
    const lbsData = Taro.getStorageSync('addressInfo') || '';
    // TOH5编码

    const url = `${h5Url}/club-rule?storeId=${lbsData.storeId}&uuid=${uuid}&lat=${lbsData.lat}&lng=${lbsData.lon}&tenantId=${lbsData.tenantId}`;
    utils.navigateToH5({ page: url });
  };

  //获取话题信息
  getClubTopicDetailFun = () => {
    const params = getCurrentInstance().router.params;
    const args = {
      terminalType: 2,
      topicId: params && params.topicId,
    };
    getClubTopicDetail(args).then(res => {
      let clubTopicInfo = '';
      if (res && res.clubTopicInfo) {
        clubTopicInfo = res.clubTopicInfo;
      }
      this.setState(
        {
          clubTopicInfo: clubTopicInfo,
        },
        () => {
          console.log('clubTopicInfo==', clubTopicInfo);
        }
      );
    });
  };

  //发布内容
  onClubRelease = () => {
    if (this.clubReleased === true) return;
    logClick({
      eid: '7FRESH_miniapp_2_1578553760939|48',
    });
    const {
      clubTopicInfo,
      inputValue,
      textAreaValue,
      selectedWareInfos,
    } = this.state;
    let { imgList } = this.state;
    if (imgList.length === 0) {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none',
      });
      return;
    }
    if (!inputValue) {
      Taro.showToast({
        title: '请填写标题',
        icon: 'none',
      });
      return;
    }
    if (!textAreaValue) {
      Taro.showToast({
        title: '请填写正文',
        icon: 'none',
      });
      return;
    }

    if (!Taro.getStorageSync('isPostNotesed')) {
      Taro.setStorageSync('isPostNotesed', true);
      this.setState({
        isShowRuleModal: true,
      });
      return;
    }

    let skuIds = [];
    for (let i = 0; i < selectedWareInfos.length > 0; i++) {
      skuIds.push(selectedWareInfos[i].skuId);
    }
    imgList = imgList.filter(function(val) {
      return val;
    });
    const args = {
      terminalType: 2,
      contentType: 1,
      title: inputValue,
      content: textAreaValue,

      coverImg: imgList[0],
      topicInfos: {
        firstClassificationId:
          clubTopicInfo && clubTopicInfo.firstClassificationId,
        firstClassificationName:
          clubTopicInfo && clubTopicInfo.firstClassificationName,
        secondClassificationId: clubTopicInfo && clubTopicInfo.topicId,
        secondClassificationName: clubTopicInfo && clubTopicInfo.topicName,
      },

      imgList: imgList,
      skuIds: skuIds,
    };
    this.clubReleased = true;
    clubRelease(args)
      .then(res => {
        console.log('res=====', res);
        if (
          res &&
          res.success &&
          res.contentId > 0
          // && clubTopicInfo &&
          // clubTopicInfo.topicId > 0
        ) {
          this.setState(
            {
              isShowRuleModal: false,
            },
            () => {
              Taro.showToast({
                title: '内容发布成功，审核通过后就会公开展示哦~',
                icon: 'none',
              });
              setTimeout(() => {
                Taro.navigateTo({
                  url: `/pages-activity/7club/topic-detail/index?topicId=${clubTopicInfo.topicId}&source=post`,
                });
              }, 2000);
            }
          );
        } else {
          this.clubReleased = false;
          Taro.showToast({
            title: '发布失败，请重试',
            icon: 'none',
          });
        }
      })
      .catch(() => {
        this.clubReleased = false;
        this.setState({
          isShowRuleModal: false,
        });
        Taro.showToast({
          title: '发布失败，请重试',
          icon: 'none',
        });
      });
  };

  delItem = index => {
    const { selectedWareInfos } = this.state;
    if (selectedWareInfos && selectedWareInfos.length > 0) {
      selectedWareInfos.splice(index, 1);
    }
    this.setState({
      selectedWareInfos,
    });
  };

  cropperload = e => {
    console.log('cropper加载完成', e);
  };
  loadimage = e => {
    wx.hideLoading();
    console.log('图片', e);
    this.cropper.imgReset();
  };
  clickcut = e => {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url], // 需要预览的图片http链接列表
    });
  };

  cutSubmit = () => {
    const { newFilterImgs, currentImgIndex } = this.state;

    this.cropper.getImg(obj => {
      console.log('submit', obj);
      let _newFilterImgs = newFilterImgs;
      if (obj.url) {
        _newFilterImgs[currentImgIndex] = obj.url;
      }
      this.setState(
        {
          filterImgModalSrc: obj.url,
          newFilterImgs: _newFilterImgs,
          isShowCutImgModal: false,
        },
        () => {
          console.log('newFilterImgs=', this.state.newFilterImgs);
        }
      );
    });
  };

  updateImg = (i, e) => {
    e && e.stopPropagation();
    const { newFilterImgsBak } = this.state;
    console.log('newFilterImgsBak=====', newFilterImgsBak);
    this.setState({
      skin: 'black',
      originalFilterImgs: [newFilterImgsBak[i]],
      newFilterImgs: [newFilterImgsBak[i]],
      updateIndex: i,
    });
  };

  onCloseModal = () => {
    this.setState({
      isShowCancelConfirmModal: false,
    });
  };

  onCloseRuleModal = () => {
    this.setState(
      {
        isShowRuleModal: false,
      },
      () => {
        Taro.removeStorageSync('isPostNotesed');
      }
    );
  };

  // 上传图片安全合规弹窗
  onGotIt = () => {
    const { uploadOption } = this.state;
    if (uploadOption.hasHandle) {
      Taro.setStorageSync('isAfterSaleModal', 'y');
    }
    this.setState({
      uploadOption: {
        show: false,
      },
    });
    this.chooseImages();
  };

  // 安全合规弹窗勾选
  onPrompt = () => {
    const { uploadOption } = this.state;
    this.setState({
      uploadOption: {
        show: uploadOption.show,
        hasHandle: uploadOption.hasHandle ? false : true,
      },
    });
  };

  render() {
    const {
      imgList,
      inputValue,
      textAreaValue,
      statusHeight,
      navHeight,
      isShowSearchItemsModal,
      canvasW,
      canvasH,
      tempFilePaths,
      isShowFilterImgModal,
      isShowCutImgModal,
      filterImgModalSrc,
      originalFilterImgs,
      newFilterImgs,
      currentImgIndex,
      skin,
      isAllFilterImg,
      selectedWareInfos,
      clubTopicInfo,
      title,
      filterImgsType,
      inputTxtCount,
      textAreaTxtCount,
      isShowCancelConfirmModal,
      isShowRuleModal,
      gifCanvasWH,
      isHasGif,
      uploadOption,
    } = this.state;
    console.log('imgList=', imgList);

    return (
      <View className='container'>
        <View className='top-cover'>
          <NavBar
            statusHeight={statusHeight}
            navHeight={navHeight}
            onBack={this.handleBack}
            title={title || ''}
            isShowModal={isShowSearchItemsModal}
            skin={skin}
            onUploadImgs={this.uploadImgs}
            onClubRelease={this.onClubRelease}
            isShowNextBtn={newFilterImgs && newFilterImgs.length > 0}
            isHasGif={isHasGif}
          />
        </View>

        <View className='main' style={{ marginTop: navHeight + 'PX' }}>
          <View className='upload-imgs-container'>
            <View className='upload-imgs'>
              {imgList &&
                imgList.length > 0 &&
                imgList.map((val, i) => {
                  return (
                    <View className='upload-img-list' key={i.toString()}>
                      <Image
                        mode='aspectFill'
                        className='upload-img'
                        src={val}
                        onClick={this.updateImg.bind(this, i)}
                      />
                      <View
                        className='del-img'
                        onClick={this.delImg.bind(this, i)}
                      />
                    </View>
                  );
                })}
            </View>
            {imgList.length < 9 && (
              <View onClick={this.onBeforeUploadImg.bind(this)}>
                <Image
                  className='real-card-img'
                  src='https://m.360buyimg.com/img/jfs/t1/118877/31/5534/782/5eb3f21eE5c809e5b/e82f8be72a7778fd.png'
                />
              </View>
            )}
          </View>

          <View className='title'>
            <Input
              className='title-input'
              type='text'
              value={inputValue}
              placeholder='填写标题可以让更多人看到~'
              placeholderStyle={{
                fontSize: '30px',
                color: 'rgb(149,150,159)',
              }}
              maxLength={20}
              onInput={this.txtChange.bind(this, 20)}
            />
            {inputTxtCount >= 0 && inputTxtCount <= 3 && (
              <View className='title-input-max'>{inputTxtCount}</View>
            )}
          </View>

          {(!newFilterImgs || newFilterImgs.length === 0) &&
            !isShowSearchItemsModal &&
            !isShowRuleModal && (
              <View className='content'>
                <Textarea
                  name='content'
                  className='content-text-area'
                  value={textAreaValue}
                  placeholder='填写正文（内容越丰富可能点赞越多哦~）'
                  placeholderStyle={{
                    fontSize: '28px',
                    color: 'rgb(149,150,159)',
                  }}
                  maxlength='200'
                  onInput={this.txtChange.bind(this, 200)}
                />
                {clubTopicInfo && clubTopicInfo.topicName && (
                  <View className='topic-name'>
                    <View className='topic-name-icon' />
                    <View>{clubTopicInfo.topicName}</View>
                  </View>
                )}
                {textAreaTxtCount >= 0 && textAreaTxtCount <= 3 && (
                  <View className='content-max'>{textAreaTxtCount}</View>
                )}
              </View>
            )}
        </View>

        <View className='items-container'>
          <View className='items-list-title'>
            <View className='left'>
              <View className='icon' />
              <View className='txt'>
                添加商品({selectedWareInfos.length}/10)
              </View>
            </View>
            <View
              className='right'
              onClick={this.showSearchItemsModal.bind(this)}
            >
              <View className='txt'>添加商品可能获得更多赞哦～</View>
              <View className='icon' />
            </View>
          </View>
          {selectedWareInfos && selectedWareInfos.length > 0 && (
            <View
              className='items-list'
              style={{
                maxHeight:
                  this.containereight1 -
                  this.maineight2 -
                  this.ruleHeight3 -
                  navHeight -
                  50 +
                  'px',
              }}
            >
              {selectedWareInfos.map((val, i) => {
                return (
                  <View className='items-wrap-container' key={i.toString()}>
                    <View className='items-wrap'>
                      <Image
                        className='items-img'
                        src={filterImg(val.imageUrl)}
                      />
                      <View className='items-info'>{val.skuName}</View>
                      <View
                        className='del-items'
                        onClick={this.delItem.bind(this, i)}
                      />
                    </View>
                  </View>
                );
              })}

              {/*<View className='items-wrap'>*/}
              {/*<Image className='items-img' src='' />*/}
              {/*<View className='items-info'>珍滋味港式粥火锅金牌 200g/份</View>*/}
              {/*<View className='del-items'></View>*/}
              {/*</View>*/}
            </View>
          )}
          {(!selectedWareInfos || selectedWareInfos.length === 0) && (
            <View className='no-items'>
              <View className='no-items-img' />
              <View className='no-items-txt'>暂未添加商品，快去添加吧~</View>
            </View>
          )}
        </View>

        <View className='rule'>
          {/*<View className='rule-icon' />*/}
          <Text className='rule-title'>社区规范请参考</Text>
          <Text
            className='rule-href-title'
            onClick={this.gotoClubRule.bind(this)}
          >
            《七鲜社区规范》
          </Text>
        </View>

        {isShowSearchItemsModal && (
          <SearchItems
            navHeight={navHeight}
            onHandle={this.handleSelectedWareInfos}
            selectedItems={selectedWareInfos}
          />
        )}

        {tempFilePaths &&
          tempFilePaths.length > 0 &&
          tempFilePaths.map((val, k) => {
            return (
              <canvas
                canvas-id={`canvas${k}`}
                key={k.toString()}
                style={`width:${canvasW}px;height:${canvasH}px;position:fixed;top:9999px;left:0`}
              />
            );
          })}

        {this.originalTempFilePaths &&
          this.originalTempFilePaths.length > 0 &&
          gifCanvasWH &&
          gifCanvasWH.length > 0 &&
          this.originalTempFilePaths.map((val, k) => {
            return this.isGif(val) ? (
              <canvas
                canvas-id={`canvas-gif${k}`}
                key={k.toString()}
                style={`width:${gifCanvasWH[k][0]}px;height:${gifCanvasWH[k][1]}px;position:fixed;top:-9999px;left:0`}
              />
            ) : (
              ''
            );
          })}

        {newFilterImgs && newFilterImgs.length > 0 && (
          <View className='imgage-container'>
            <View className='sw' style={{ height: `${this.windowHeight}px` }}>
              <Swiper
                current={0}
                onChange={this.changeIndex}
                style={{ width: `750px`, height: `100%` }}
              >
                {newFilterImgs.map((val, i) => {
                  return (
                    <SwiperItem key={i.toString()} className='swiper-item'>
                      <Image
                        src={val}
                        className='img'
                        key={i.toString()}
                        mode='aspectFit'
                      />
                    </SwiperItem>
                  );
                })}
              </Swiper>
              {newFilterImgs && newFilterImgs.length > 1 && (
                <View
                  className='indicator-dots'
                  style={{
                    top: navHeight - 5 + 'PX',
                  }}
                >
                  {`${
                    newFilterImgs.length > 0
                      ? this.state.currentImgIndex + 1
                      : 0
                  }/${newFilterImgs.length}`}
                </View>
              )}
            </View>

            <View className='filter-img-btn'>
              {/*<View*/}
              {/*className='filter-box'*/}
              {/*onClick={this.showFilterImgModal.bind(*/}
              {/*this,*/}
              {/*[originalFilterImgs[currentImgIndex]],*/}
              {/*'filter'*/}
              {/*)}*/}
              {/*>*/}
              {/*<View className='filter-img-icon' />*/}
              {/*<View className='filter-img-txt'>滤镜</View>*/}
              {/*</View>*/}

              <View
                className='cut-box'
                onClick={this.showFilterImgModal.bind(
                  this,
                  [originalFilterImgs[currentImgIndex]],
                  'cut'
                )}
              >
                <View className='cut-img-icon' />
                <View className='filter-img-txt'>裁剪</View>
              </View>
            </View>
          </View>
        )}

        {isShowFilterImgModal && (
          <View className='filter-img-modal'>
            <View className='filter-img-modal-container'>
              <Image
                className='filter-img-modal-image'
                src={`${
                  filterImgModalSrc
                    ? filterImgModalSrc
                    : newFilterImgs[currentImgIndex]
                }`}
              />
            </View>
            <View className='filter-img-modal-btn-container'>
              <ScrollView
                className='filter-img-modal-btn-main'
                scrollX
                scrollWithAnimation
              >
                {/*<View*/}
                {/*className='filter-img-modal-btn'*/}
                {/*onClick={this.getOriginalImgs.bind(this, currentImgIndex)}*/}
                {/*/>*/}

                {filterImgsType.map((val, i) => {
                  return (
                    <View
                      key={i.toString()}
                      className='filter-img-modal-btn'
                      onClick={this.filterImg.bind(
                        this,
                        [originalFilterImgs[currentImgIndex]],
                        i,
                        currentImgIndex
                      )}
                    />
                  );
                })}
              </ScrollView>
              <View className='filter-img-modal-btn-all'>
                <View
                  className={`filter-img-modal-btn-all-icon ${
                    isAllFilterImg ? 'selected' : ''
                  }`}
                  onClick={this.isAllFilterImgFun.bind(this)}
                />
                <View>将同步应用至全部照片</View>
              </View>

              <View className='filter-img-modal-btn-main-btns'>
                <View
                  className='filter-img-modal-btn-main-btns-left'
                  onClick={this.closeFilterImgModal.bind(this)}
                />
                <View className='filter-img-modal-btn-main-btns-txt'>滤镜</View>
                <View
                  className='filter-img-modal-btn-main-btns-right'
                  onClick={this.sureFilterImg.bind(this)}
                />
              </View>
            </View>
          </View>
        )}

        {isShowCutImgModal && (
          <View className='cut-img-modal'>
            <View className='cut-img-modal-container'>
              <image-cropper
                // eslint-disable-next-line taro/props-reserve-keyword
                id='image-cropper'
                limit_move
                disable_rotate
                width={355}
                height={266}
                imgSrc={newFilterImgs[currentImgIndex]}
                onload={this.cropperload.bind(this)}
                onimageload={this.loadimage.bind(this)}
                ontapcut={this.clickcut.bind(this)}
              />
              <View className='cut-img-box'>
                <View className='cut-img-box-shadow'></View>
                <View className='cut-img-box-main'></View>
                <View className='cut-img-box-shadow'></View>
              </View>
            </View>
            <View className='cut-img-modal-btn-container'>
              <View className='cut-ratio'>4:3</View>
              <View className='cut-img-modal-btn-main-btns'>
                <View
                  className='cut-img-modal-btn-main-btns-left'
                  onClick={this.closeFilterImgModal.bind(this)}
                />
                <View className='cut-img-modal-btn-main-btns-txt'>调整</View>
                <View
                  className='cut-img-modal-btn-main-btns-right'
                  onClick={this.cutSubmit.bind(this)}
                />
              </View>
            </View>
          </View>
        )}

        {isShowCancelConfirmModal === true && (
          <cancelConfirmModal
            onCloseModal={this.onCloseModal}
            onSureBack={this.onSureBack}
          />
        )}

        {isShowRuleModal === true && (
          <ruleModal
            onCloseModal={this.onCloseRuleModal}
            onClubRelease={this.onClubRelease}
          />
        )}
        {uploadOption.show && (
          <FreshUploadModal
            type={7}
            show={uploadOption.show}
            hasHandle={uploadOption.hasHandle}
            title='温馨提示'
            desc='为保障您的个人信息安全，上传图片时我们会删除您图片上的自带信息，如拍摄设备、地点等。'
            onClick={this.onGotIt.bind(this)}
            onPrompt={this.onPrompt.bind(this)}
          />
        )}
      </View>
    );
  }
}
