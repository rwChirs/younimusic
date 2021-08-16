// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Button } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';

export default class FloorRedPop extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      notCouponImage: true,
    };
  }

  componentWillReceiveProps(props) {
    if (
      (props.data && props.data.uuid) !==
      (this.props.data && this.props.data.uuid)
    ) {
      this.setState({
        notCouponImage: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  closeAdPop(ev) {
    ev.stopPropagation();
    this.props.onCloseRedPop();
  }

  imageUpload() {
    this.setState(
      {
        notCouponImage: false,
      },
      () => {
        const { source } = this.props;
        if (source === 'index' || source === 'already') return;
      }
    );
  }

  imageUploadCoupon() {
    this.setState({
      notCouponImage: false,
    });
  }

  // 复制
  onGoCopy = () => {
    const { onGoCopy } = this.props;
    onGoCopy();
  };

  render() {
    const { data, successImage, goCopyFlag, source, customerFlag } = this.props;
    const { notCouponImage } = this.state;
    let imageUrl = (data && data.appletCommandImg) || successImage;
    return (
      <View
        className='redPop popup-mask'
        // onClick={this.closeAdPop.bind(this)}
        style={{
          display: `${
            source === 'index'
              ? goCopyFlag
                ? 'block'
                : 'none'
              : customerFlag
              ? 'block'
              : 'none'
          }`,
          visibility: !notCouponImage ? 'visible' : 'hidden',
        }}
      >
        <View className='popup-wrapper'>
          <View className='close-wrapper' onClick={this.closeAdPop.bind(this)}>
            <View className='close' />
          </View>
          {goCopyFlag && (
            <View
              className='popup-link-red lazy-load-img'
              onClick={this.onGoCopy.bind(this)}
            >
              <Button
                openType='contact'
                sendMessageTitle='品质生活，在七鲜'
                sendMessagePath='/pages/index/index'
                showMessageCard='true'
                sessionFrom='Passwordalert'
                className='kefu'
              >
                <Image
                  className='Image'
                  src={filterImg(
                    imageUrl
                      ? imageUrl
                      : 'https://m.360buyimg.com/img/jfs/t1/187682/6/7603/909705/60c1d129Ef94e9dcc/2f067cb8923a0b15.png'
                  )}
                  onLoad={this.imageUpload.bind(this)}
                  lazyLoad
                />
              </Button>
            </View>
          )}
          {customerFlag && (
            <View
              className='popup-link-red lazy-load-img'
              onClick={this.onGoCopy.bind(this)}
            >
              <Image
                className='Image'
                src={filterImg(
                  imageUrl
                    ? imageUrl
                    : 'https://m.360buyimg.com/img/jfs/t1/187682/6/7603/909705/60c1d129Ef94e9dcc/2f067cb8923a0b15.png'
                )}
                onLoad={this.imageUpload.bind(this)}
                lazyLoad
              />
            </View>
          )}

          {/* {customerFlag && (
            <View
              className='popup-link-red lazy-load-img'
              onClick={this.closeAdPop.bind(this)}
            >
              <Button
                openType='contact'
                sendMessageTitle='品质生活，在七鲜'
                sendMessagePath='/pages/index/index'
                showMessageCard='true'
                sessionFrom='Passwordalert'
                className='kefu'
              >
                <Image
                  className='Image'
                  src={filterImg(
                    data && data.appletCommandCopyImg
                      ? data.appletCommandCopyImg
                      : 'https://m.360buyimg.com/img/jfs/t1/171485/14/3836/650142/600a68ceEef03bb6f/251f99e844947098.png'
                  )}
                  onLoad={this.imageUpload.bind(this)}
                  lazyLoad
                />
              </Button>
            </View>
          )} */}
        </View>
      </View>
    );
  }
}
