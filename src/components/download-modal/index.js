import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class Modal extends Component {
  constructor(props) {
    super(props);
  }

  onSetting = () => {
    this.props.onSetting();
  };

  onGetUserInfo = e => {
    this.props.onSetting(e);
  };

  saveImage = (url, e) => {
    const qrCodePath = url;
    console.log(url);
    const _this = this;
    e.stopPropagation();
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //没有授权
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              _this.downloadImgToAlbum(qrCodePath);
            },
            fail: () => {
              _this.setState({
                //显示授权层
                openSetting: true,
              });
            },
          });
        } else {
          //已授权
          _this.downloadImgToAlbum(qrCodePath);
        }
      },
    });
  };

  downloadImgToAlbum = qrCodePath => {
    Taro.showToast({
      title: '正在保存，请稍等',
      icon: 'none',
      duration: 2000,
    });
    //下载图片
    this.downloadHttpImg(qrCodePath).then(res => {
      this.sharePosteCanvas(res);
    });
  };
  downloadHttpImg = httpImg => {
    return new Promise(resolve => {
      Taro.downloadFile({
        url: httpImg,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            Taro.showToast({
              title: '图片下载失败！',
              icon: 'none',
              duration: 1000,
            });
          }
        },
        fail: () => {
          Taro.showToast({
            title: '图片下载失败！',
            icon: 'none',
            duration: 1000,
          });
        },
      });
    });
  };
  sharePosteCanvas = imgUrl => {
    // let that = this;
    Taro.saveImageToPhotosAlbum({
      filePath: imgUrl,
      success() {
        Taro.showToast({
          title: '图片已保存到相册',
          icon: 'none',
          duration: 1000,
        });
        // that.closeModal();
      },
      fail() {
        Taro.showToast({
          title: '图片保存失败',
          icon: 'none',
          duration: 1000,
        });
      },
    });
  };

  closeModal() {
    const { onDownloadModalClose } = this.props;
    onDownloadModalClose();
  }

  render() {
    const { show, data } = { ...this.props };
    return show && data ? (
      <View className='download-modal'>
        <View className='modal-content'>
          <Image
            src={data}
            className='qrcode'
            onLongPress={this.saveImage.bind(this, data)}
          />
        </View>
        <Image
          src='//m.360buyimg.com/img/jfs/t1/121735/12/18497/1186/5fade323Eda76dfec/9d7788eade9b3e78.png'
          className='deleteImg'
          onClick={this.closeModal}
        />
      </View>
    ) : (
      <View />
    );
  }
}
