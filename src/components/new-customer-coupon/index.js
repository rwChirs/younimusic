import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

export default class NewCustomerCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [],
    };
  }

  componentDidMount() {
    const { coupons } = this.props;
    this.handlerCoupons(coupons);
  }

  // 处理优惠劵数据
  handlerCoupons = data => {
    const len = (data && data.length) || 0;
    const { arr } = this.state;
    if (len === 0) return;
    if (len === 1) {
      arr.push([data[0]]);
      this.setState({
        arr,
      });
      return;
    }
    if (len === 2) {
      arr.push([data[0], data[1]]);
      this.setState({
        arr,
      });
      return;
    }
    if (len === 3) {
      arr.push([data[0], data[1]]);
      arr.push([data[2]]);
      this.setState({
        arr,
      });
      return;
    }
    if (len > 3) {
      const sliceArr = data.slice(3, len);
      arr.push([data[0], data[1], data[2]]);
      this.setState(
        {
          arr,
        },
        () => {
          this.handlerCoupons(sliceArr);
        }
      );
    }
  };

  // couponItemOne = val => {
  //   return (
  //     <View>
  //       <View className='name'>{val.couponName}</View>
  //       <View className='right'>
  //         <View className='price'>
  //           {val.couponMode === 1 && <View className='priceIcon'>￥</View>}

  //           <View
  //             style={{
  //               display: 'inline-block',
  //               // verticalAlign: 'middle'
  //             }}
  //           >
  //             {val.couponMode === 1 ? val.amountDesc : ''}
  //             {val.couponMode === 2 ? val.discount : ''}
  //           </View>
  //           {val.couponMode === 2 && <View className='priceIcon'>折</View>}
  //         </View>
  //         <View className='condition'>
  //           <View className='text'>{val.ruleDescSimple}</View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  // 领劵
  getCoupon = () => {
    const { getCoupon, alreadyGetCoupon } = this.props;
    if (!alreadyGetCoupon) {
      getCoupon();
    }
  };

  render() {
    const { coupons, style, type } = this.props;
    const { arr } = this.state;
    return (
      <View style={style} className='main'>
        {coupons && (
          <View className='con'>
            {arr.map((item, j) => {
              return item.length === 3 ? (
                <View className='coupon-row' key={j.toString()}>
                  {item.map((info, i) => {
                    return (
                      <View
                        className='coupon-item-3'
                        style={{
                          background:
                            type === 1
                              ? `url(//m.360buyimg.com/img/jfs/t1/121087/36/12720/10562/5f61818eE8b5c141d/e68d9853822e8882.png) no-repeat`
                              : `url(//m.360buyimg.com/img/jfs/t1/64172/35/10574/28312/5d7f2de8E5a6ec500/9e1d749436af7bfa.png) no-repeat`,
                          backgroundSize: '100%',
                        }}
                        key={j.toString() + i.toString()}
                      >
                        <View>
                          <View
                            className='name'
                            style={{
                              color: type === 1 ? '#fff' : 'rgb(255, 242, 215)',
                            }}
                          >
                            {info.couponName}
                          </View>
                          <View className='right'>
                            <View
                              className='price'
                              style={{
                                color:
                                  type === 1 ? '#fff' : 'rgb(255, 237, 199)',
                              }}
                            >
                              {info.couponMode === 1 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  ￥
                                </View>
                              )}

                              <View
                                style={{
                                  display: 'inline-block',
                                }}
                              >
                                {info.couponMode === 1 ? info.amountDesc : ''}
                                {info.couponMode === 2 ? info.discount : ''}
                              </View>
                              {info.couponMode === 2 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  折
                                </View>
                              )}
                            </View>
                            <View
                              className='condition'
                              style={{
                                background:
                                  type === 1
                                    ? '#fff'
                                    : 'linear-gradient(123deg,rgba(255, 233, 185, 1) 0%,rgba(255, 224, 153, 1) 100%)',
                                color:
                                  type === 1
                                    ? 'rgb(246, 43, 20)'
                                    : 'rgb(156, 21, 21)',
                              }}
                            >
                              <View className='text'>
                                {info.ruleDescSimple}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : item.length === 2 ? (
                <View className='coupon-row' key={j.toString()}>
                  {item.map((info, i) => {
                    return (
                      <View
                        className='coupon-item-2'
                        style={{
                          background:
                            type === 1
                              ? `url(//m.360buyimg.com/img/jfs/t1/137022/26/10018/99565/5f61818eE97aa8348/74c2e7e016e92ea2.png) no-repeat`
                              : `url(//m.360buyimg.com/img/jfs/t1/74146/29/10306/108308/5d7f2e42E0e41981f/b13f731a6ff86672.png) no-repeat`,
                          backgroundSize: '100%',
                        }}
                        key={j.toString() + i.toString()}
                      >
                        <View>
                          <View
                            className='name'
                            style={{
                              color: type === 1 ? '#fff' : 'rgb(255, 242, 215)',
                            }}
                          >
                            {info.couponName}
                          </View>
                          <View className='right'>
                            <View
                              className='price'
                              style={{
                                color:
                                  type === 1 ? '#fff' : 'rgb(255, 237, 199)',
                              }}
                            >
                              {info.couponMode === 1 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  ￥
                                </View>
                              )}

                              <View
                                style={{
                                  display: 'inline-block',
                                  // verticalAlign: 'middle'
                                }}
                              >
                                {info.couponMode === 1 ? info.amountDesc : ''}
                                {info.couponMode === 2 ? info.discount : ''}
                              </View>
                              {info.couponMode === 2 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  折
                                </View>
                              )}
                            </View>
                            <View
                              className='condition'
                              style={{
                                background:
                                  type === 1
                                    ? '#fff'
                                    : 'linear-gradient(123deg,rgba(255, 233, 185, 1) 0%,rgba(255, 224, 153, 1) 100%)',
                                color:
                                  type === 1
                                    ? 'rgb(246, 43, 20)'
                                    : 'rgb(156, 21, 21)',
                              }}
                            >
                              <View className='text'>
                                {info.ruleDescSimple}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View className='coupon-row' key={j.toString()}>
                  {item.map((info, i) => {
                    return (
                      <View
                        className='coupon-item-1'
                        style={{
                          background:
                            type === 1
                              ? `url(//m.360buyimg.com/img/jfs/t1/152433/10/2/215146/5f61818eE8ab0ebd3/e17248cf6613d641.png) no-repeat`
                              : `url(//m.360buyimg.com/img/jfs/t1/44794/3/10907/204293/5d7f2e93E22d5f7e3/a6e8fc3c6f8f2243.png) no-repeat`,
                          backgroundSize: '100%',
                        }}
                        key={j.toString() + i.toString()}
                      >
                        <View>
                          <View
                            className='name'
                            style={{
                              color: type === 1 ? '#fff' : 'rgb(255, 242, 215)',
                            }}
                          >
                            {info.couponName}
                          </View>
                          <View className='right'>
                            <View
                              className='price'
                              style={{
                                color:
                                  type === 1 ? '#fff' : 'rgb(255, 237, 199)',
                              }}
                            >
                              {info.couponMode === 1 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  ￥
                                </View>
                              )}

                              <View
                                style={{
                                  display: 'inline-block',
                                  // verticalAlign: 'middle'
                                }}
                              >
                                {info.couponMode === 1 ? info.amountDesc : ''}
                                {info.couponMode === 2 ? info.discount : ''}
                              </View>
                              {info.couponMode === 2 && (
                                <View
                                  className='priceIcon'
                                  style={{
                                    color:
                                      type === 1
                                        ? '#fff'
                                        : 'rgb(255, 237, 199)',
                                  }}
                                >
                                  折
                                </View>
                              )}
                            </View>
                            <View
                              className='condition'
                              style={{
                                background:
                                  type === 1
                                    ? '#fff'
                                    : 'linear-gradient(123deg,rgba(255, 233, 185, 1) 0%,rgba(255, 224, 153, 1) 100%)',
                                color:
                                  type === 1
                                    ? 'rgb(246, 43, 20)'
                                    : 'rgb(156, 21, 21)',
                              }}
                            >
                              <View className='text'>
                                {info.ruleDescSimple}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
}
