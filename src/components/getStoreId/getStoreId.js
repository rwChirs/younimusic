Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showSelectStore: {
      type: Boolean,
      value: false,
    },
    failMessage: {
      type: String,
      value: "",
    },
    stores: {
      type: Array,
    },
    // onClose: {
    //   type: Function
    // },
    // onShow: {
    //   type: Function
    // },
    // onSelectStore: {
    //   type: Function
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    hideSelectStore: function() {
      this.triggerEvent("close");
    },

    handleSelectStore: function(e) {
      this.triggerEvent("select", {
        id: e.currentTarget.dataset.id,
        address: e.currentTarget.dataset.address,
      });
    },
  },
});
