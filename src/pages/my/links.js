// 付款码
const memebercode = `/pages/payCode/payCode`;
// 支付设置
const setting = `/pages-pay/openPayCode/openPayCode`;
// 大客户
const bigUser = `/pages-activity/sales/index/index`;
// 在线客服
const contact = `/pages-mine/customer-service/index`;
// 发票
const invoiceCenter = `/pages-mine/invoice/index`;
// 收货地址
const addresslist = `/pages/address/list/index?from=user`;
// 我的收藏
const collection = `/pages-activity/7club/club-mine/index?source=mine`;
// const collection = `/pages/my-collection/index`;
// 我的拼团
const mygroup = `/pages-a/fight-group/my-order/index`;
// 我的订单 待付款
const waitPay = `/pages-mine/order-list/index?status=1`;
// 我的订单 待配送
const waitShip = `/pages-mine/order-list/index?status=2`;
// 我的订单 待收货
const waitReceive = `/pages-mine/order-list/index?status=3`;
// 我的订单 全部订单
const allOrder = `/pages-mine/order-list/index?status=0`;
// 我的订单 订单详情
const orderDetail = `/pages-mine/order-detail/index`;
// 团长返佣
const solitaireLeaderProfit = `/pages-activity/solitaire/my-rebate/index`;
// 邀请有礼
const getInvitedInfo = `/pages-a/invitation/index`;

export default {
  memebercode,
  setting,
  bigUser,
  contact,
  invoiceCenter,
  addresslist,
  collection,
  mygroup,
  waitPay,
  waitShip,
  waitReceive,
  allOrder,
  orderDetail,
  solitaireLeaderProfit,
  getInvitedInfo,
};
