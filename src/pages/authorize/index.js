Page({
  data: {},
  onLoad(option) {
    //埋点上报

    this.setData({
      option: option,
    });
  },

  onShow() {
    console.log(this.data.option);
  },

  onOpenSetting() {
    console.log(arguments);
  },
});
