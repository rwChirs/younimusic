import { exportPoint } from '../../utils/common/exportPoint';
import srUtils from '../../utils/zhls';

const { onPageShow, onPageHide } = srUtils;

Page({
  data: {},
  onShow: function() {
    onPageShow();
  },
  onHide: function() {
    onPageHide();
  },
  onload: function() {
    exportPoint(this.$router);
  },
});
