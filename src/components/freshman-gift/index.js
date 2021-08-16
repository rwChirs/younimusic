// components/fresh-man-gift/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    redPackets: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeRedPacket() {
      this.triggerEvent('close')
    }
  }
})
