const common = '7FRESH_miniapp_1_1530785333379|';
//商品点击 - 列表
const gotoDetail = `${common}65`;
//分享按钮 - 列表
const gotoShare = `${common}66`;
//分享 - 商详
const detailShare = `${common}67`;
//各图片点击 - 商详
const detailPictureClicked = `${common}68`;
//商详页评论抢占区查看全部按钮点击 - 商详
const detailSearchAll = `${common}69`;
//接龙推荐坑位点击 - 商详
const detailClicked = `${common}70`;
//继续接龙 - 支付结果页
const goToList = `${common}71`;
//分享按钮 - 支付结果页
const payShare = `${common}72`;
//接龙商品推荐 - 支付结果页
const goPayDetail = `${common}73`;

module.exports = {
  gotoDetail,
  gotoShare,
  goToList,
  payShare,
  goPayDetail,
  detailShare,
  detailPictureClicked,
  detailSearchAll,
  detailClicked,
};
