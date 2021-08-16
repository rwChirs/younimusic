Component({
  data: {
    clicked: true,
  },
  pageLifetimes: {
    show: function() {
      this.setData({ clicked: true });
    },
  },
  methods: {
    onTap: function() {
      this.triggerEvent("navigateto", {}, {});
      this.setData({
        clicked: false,
      });
    },
  },
});
