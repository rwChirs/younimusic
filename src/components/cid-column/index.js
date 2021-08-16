import Taro from "@tarojs/taro";
import {Component} from 'react';
import { View, Image } from "@tarojs/components";
import { filterImg, px2vw } from "../../utils/common/utils";
import "./index.scss";

export default class CidColumn extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    // };
  }

  changeCid = (val, i) => {
    const { onChangeCid } = this.props;
    onChangeCid(val, i);
  };

  cidBorder = () => {
    const { i, cidList, cidIndex } = this.props;

    let radius = "";
    if (cidIndex === i) {
      radius = `${px2vw(16)} 0 0 ${px2vw(16)}`;
    } else if (cidIndex + 1 === i && cidList.length >= cidIndex + 1) {
      radius = `0 ${px2vw(16)} 0 0`;
    } else if (cidIndex - 1 === i) {
      radius = `0 0 ${px2vw(16)} 0`;
    } else {
      radius = `${px2vw(16)} 0 0 ${px2vw(16)}`;
    }
    return radius;
  };

  cidBgc = () => {
    const { i, cidList, cidIndex } = this.props;
    let bgc = "";
    if (cidIndex === i) {
      bgc = "#f7f7f7";
    } else if (cidIndex + 1 === i && cidList.length >= cidIndex + 1) {
      bgc = "#fff";
    } else if (cidIndex - 1 === i) {
      bgc = "#fff";
    }

    return bgc;
  };

  render() {
    const { val, i, cid, source } = this.props;
    return (
      <View
        className="cid"
        i={i}
        style={{
          backgroundColor: this.cidBgc(),
          // color: cid === val.id ? '#345B8F' : 'rgb(37, 37, 37)'
        }}
        onClick={this.changeCid.bind(this, val, i)}
      >
        <View
          className="cid-bg"
          style={{
            backgroundColor: cid === (val && val.id) ? "#fff" : "#f7f7f7",
            borderRadius: this.cidBorder(),
          }}
        >
          {val && (source === "category1" ? val.tagIcon : val.imageUrl) && (
            <Image
              className="cid-img"
              alt=""
              src={filterImg(
                val && (source === "category1" ? val.tagIcon : val.imageUrl)
              )}
            />
          )}
          <View
            className="cid-text"
            style={{
              fontWeight: cid === (val && val.id) ? "bold" : "unset",
              fontSize: cid === (val && val.id) ? px2vw(28) : px2vw(24),
            }}
          >
            {val.name}
          </View>
          {cid === (val && val.id) && <View className="cidLine"></View>}
        </View>
      </View>
    );
  }
}
