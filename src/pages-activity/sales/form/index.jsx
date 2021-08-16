import Taro,{ getCurrentInstance } from '@tarojs/taro';
import { View, Input, Textarea, Text } from '@tarojs/components';
import { getBigUserConfigService, getBigUserSaveService } from '@7fresh/api';
import XSS from 'xss';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import { logClick } from '../../../utils/common/logReport';
import { category, number, submit } from '../util/reportPoints';
import { exportPoint } from '../../../utils/common/exportPoint';
import './index.scss';

export default class SalesForm extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      length: 0,
      customerName: '',
      customerMobile: '',
      companyName: '',
      content: '',
      note: '',
      intentionCategoryTagList: [],
      personNumTagList: [],
    };
  }

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    let { storeId, saveParams = '' } = getCurrentInstance().router.params;

    this.setState(
      {
        storeId: storeId,
        saveParams: saveParams,
      },
      () => {
        this.init(storeId);
      }
    );
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  init = storeId => {
    // 查询配置项
    let params = {
      storeId: storeId,
    };
    getBigUserConfigService(params).then(res => {
      if (res && res.success) {
        this.setState(
          {
            intentionCategoryTagList: res.intentionCategoryTagList,
            personNumTagList: res.personNumTagList,
          }
        );
      } else {
        Taro.showToast({
          title: res.msg ? res.mag : '网络异常',
          icon: 'none',
          duration: 2000,
        });
        return false;
      }
    });
  };

  checkTel = tel => {
    var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/,
      phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
  };

  save = event => {
    let {
      customerName,
      customerMobile,
      companyName,
      content,
      intentionCategoryTagList,
      personNumTagList,
      note,
      storeId,
    } = this.state;
    content = XSS(content);
    if (customerName == '') {
      Taro.showToast({
        title: '请填写联系人姓名',
        icon: 'none',
        duration: 2000,
      });
      return false;
    }
    if (customerMobile == '') {
      Taro.showToast({
        title: '请填写联系电话',
        icon: 'none',
        duration: 2000,
      });
      return false;
    } else if (!this.checkTel(customerMobile)) {
      Taro.showToast({
        title: '联系电话错误，请重新输入',
        icon: 'none',
        duration: 2000,
      });
      return false;
    }

    let list1 = [],
      list2 = [];
    for (let i in intentionCategoryTagList) {
      if (intentionCategoryTagList[i].selected == 1) {
        list1.push(intentionCategoryTagList[i]);
      }
    }
    //加上自定义，不需要传id
    if (note) {
      list1.push({
        tagName: note,
      });
    }

    for (let j in personNumTagList) {
      if (personNumTagList[j].selected == 1) {
        list2.push(personNumTagList[j]);
      }
    }
    let params = {
      customerName: customerName,
      customerMobile: customerMobile,
      companyName: companyName,
      content: content,
      intentionCategoryTagList: list1,
      personNumTagList: list2,
      storeId: storeId,
    };
    let saveParams = JSON.stringify(params);
    //存值
    let saveData = {
      customerName: customerName,
      customerMobile: customerMobile,
      companyName: companyName,
      content: content,
      intentionCategoryTagList: intentionCategoryTagList,
      personNumTagList: personNumTagList,
      storeId: storeId,
    };
    saveData = JSON.stringify(saveData);
    getBigUserSaveService(params).then(res => {
      if (res && res.success) {
        logClick({ event, eid: submit });
        //提交成功
        Taro.redirectTo({
          url: `/pages-activity/sales/success/index?saveParams=${saveData}`,
        });
      } else {
        Taro.showToast({
          title: res.msg ? res.msg : '提交失败，请重新提交',
          icon: 'none',
          duration: 2000,
        });
        return false;
      }
    });
  };

  //选择意向品类
  chooseTag = (info, event) => {
    logClick({ event, eid: category });
    let data = this.state.intentionCategoryTagList.map(item => {
      if (item.id === info.id) {
        if (item.selected === 1) {
          item.selected = 2;
        } else {
          item.selected = 1;
        }
      }
      return item;
    });

    return this.setState({
      intentionCategoryTagList: data,
    });
  };

  //选择订购人数
  choosePersonNumTag = (info, event) => {
    logClick({ event, eid: number });
    let data = this.state.personNumTagList.map(item => {
      if (item.id === info.id) {
        item.selected = item.selected == 1 ? 2 : 1;
      } else {
        item.selected = 2;
      }
      return item;
    });

    return this.setState({
      personNumTagList: data,
    });
  };

  //自定义标签
  editTag = () => {
    this.setState(
      {
        selected: !this.state.selected,
      },
      () => {
        if (!this.state.selected) {
          this.setState({
            length: 0,
            note: '',
          });
        }
      }
    );
  };

  //监听input事件
  onInput = e => {
    let length = e.detail.value.length;
    this.setState({
      length: length,
      note: e.detail.value,
    });
  };

  customerName = e => {
    this.setState({
      customerName: e.detail.value,
    });
  };

  customerMobile = e => {
    if (process.env.TARO_ENV === 'h5') {
      let txt = e.detail.value;
      let inputValue = txt.replace(/\s/g, '').replace(/^[0-9][11]+$/g, '');
      if (inputValue.length > 11) {
        inputValue = inputValue.substr(0, 11);
      }
      this.setState({
        customerMobile: inputValue,
      });
    } else {
      this.setState({
        customerMobile: e.detail.value,
      });
    }
  };

  companyName = e => {
    this.setState({
      companyName: e.detail.value,
    });
  };

  content = e => {
    let value = '';
    if (process.env.TARO_ENV === 'h5') {
      value = document.getElementById('note').value;
    } else {
      value = e.detail.value;
    }
    this.setState({
      content: value,
    });
  };

  render() {
    let {
      intentionCategoryTagList,
      personNumTagList,
      selected,
      length,
      customerMobile,
    } = this.state;
    return (
      <View className='sales-form-page'>
        <View className='sales-form-model'>
          <View className='sales-form-label'>
            <Text className='name'>
              <Text className='userName'>如何称呼您</Text>
              <Text className='red'>*</Text>
            </Text>
            <Input
              type='text'
              placeholder='如李女士'
              maxLength='20'
              onInput={this.customerName.bind(this)}
            />
          </View>
          <View className='sales-form-label'>
            <Text className='name'>
              <Text className='userName'>联系电话</Text>
              <Text className='red'>*</Text>
            </Text>
            <Input
              type='number'
              placeholder='请输入手机或座机号码'
              maxLength='11'
              value={customerMobile}
              onInput={this.customerMobile.bind(this)}
            />
          </View>
          <View className='sales-form-label'>
            <Text className='name'>企业名称</Text>
            <Input
              type='text'
              placeholder='请输入企业全称'
              maxLength='30'
              onInput={this.companyName.bind(this)}
            />
          </View>
        </View>
        <View className='sales-form-model'>
          <View className='sales-form-title'>意向品类</View>
          <View className='sales-from-list'>
            {intentionCategoryTagList &&
              intentionCategoryTagList.map((info, index) => {
                return (
                  <Text
                    key={index}
                    className={
                      info.selected === 1
                        ? 'sales-list-txt sales-list-txt-choose'
                        : 'sales-list-txt'
                    }
                    onClick={this.chooseTag.bind(this, info)}
                    id={info.id}
                  >
                    {info.tagName}
                  </Text>
                );
              })}
            <Text
              className={
                selected == true
                  ? 'sales-list-txt sales-list-txt-choose'
                  : 'sales-list-txt'
              }
              onClick={this.editTag.bind(this)}
            >
              自定义
            </Text>
            {selected && (
              <View className='sales-new-edit'>
                <Input
                  type='text'
                  className='sales-edit-input'
                  placeholder='请输入您的意向品类或者指定商品，20字以内'
                  maxLength='20'
                  onInput={this.onInput.bind(this)}
                />
                <View className='sales-edit-count'>
                  <Text className='left'>{length}</Text>
                  <Text className='right'>/20</Text>
                </View>
              </View>
            )}
          </View>
          <View className='sales-form-title'>订购人数（预估）</View>
          <View className='sales-from-list'>
            {personNumTagList &&
              personNumTagList.map((info, index) => {
                return (
                  <Text
                    key={index}
                    className={
                      info.selected === 1
                        ? 'sales-list-txt sales-list-txt-choose'
                        : 'sales-list-txt'
                    }
                    onClick={this.choosePersonNumTag.bind(this, info)}
                    id={info.id}
                  >
                    {info.tagName}
                  </Text>
                );
              })}
          </View>
        </View>
        <View className='sales-form-model sales-note'>
          <View className='sales-form-note'>备注</View>
          <Textarea
            maxLength='100'
            auto-height
            placeholder='请输入100字以内的备注信息'
            confirm-type='done'
            onInput={this.content.bind(this)}
            id='note'
            cursor-spacing='140'
          />
        </View>
        <View className='sales-save-btn' onClick={this.save.bind(this)}>
          提交
        </View>
      </View>
    );
  }
}
