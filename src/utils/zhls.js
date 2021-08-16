import Taro from '@tarojs/taro';

const plugin =
  process.env.TARO_ENV === 'weapp' ? Taro.requirePlugin('loginPlugin') : Taro;
const app = Taro.getApp().$app;

const onPageShow = () => {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const prePage = pages[pages.length - 2];
  app.sr.track('browse_wxapp_page', {
    refer_page: prePage ? prePage.route : null,
    is_newle_open:
      pages.filter(page => page && page.route === currentPage.route).length > 1
        ? 'false'
        : true,
  });
};

const onPageHide = stay_time => {
  app.sr.track('leave_wxapp_page', {
    stay_time,
  });
};

const onPageShare = shareInfo => {
  app.sr.track('page_share_app_message', {
    from_type: shareInfo.from,
    share_title: shareInfo.title,
    share_path: shareInfo.url,
    share_image_url: shareInfo.imageUrl,
  });
};

const onProductExpose = product => {
  const storeInfo = Taro.getStorageSync('addressInfo');
  app.sr.track('expose_sku_component', {
    sku: {
      sku_id: `${product.skuId}`,
      sku_name: product.skuName,
    },
    spu: {
      spu_id: `${product.productId || product.skuId}`,
      spu_name: product.skuName,
    },
    sku_category: [
      {
        sku_cat_id: `${product.categoryId}`,
        sku_cat_name: `${product.categoryId}`,
        sku_parent_cat_id: 'null',
      },
    ],
    sale: {
      original_price: product.marketPrice - 0 || product.jdPrice - 0,
      current_price: product.jdPrice - 0,
    },
    sku_num: product.startBuyUnitNum - 0,
    shipping_shop: {
      shipping_shop_id: `${storeInfo.storeId || 0}`,
      shipping_shop_name: storeInfo.storeName || '七鲜',
    },
  });
};

const onProductTrigger = product => {
  const storeInfo = Taro.getStorageSync('addressInfo');
  app.sr.track('trigger_sku_component', {
    sku: {
      sku_id: `${product.skuId}`,
      sku_name: product.skuName,
    },
    spu: {
      spu_id: `${product.productId || product.skuId}`,
      spu_name: product.skuName,
    },
    sku_category: [
      {
        sku_cat_id: `${product.categoryId}`,
        sku_cat_name: `${product.categoryId}`,
        sku_parent_cat_id: 'null',
      },
    ],
    sale: {
      original_price: product.marketPrice - 0 || product.jdPrice - 0,
      current_price: product.jdPrice - 0,
    },
    sku_num: product.startBuyUnitNum - 0,
    shipping_shop: {
      shipping_shop_id: `${storeInfo.storeId || 0}`,
      shipping_shop_name: storeInfo.storeName || '七鲜',
    },
  });
};

const onProductPageShow = product => {
  const storeInfo = Taro.getStorageSync('addressInfo');
  app.sr.track('browse_sku_page', {
    sku: {
      sku_id: `${product.skuId}`,
      sku_name: product.skuName,
    },
    spu: {
      spu_id: `${product.productId || product.skuId}`,
      spu_name: product.skuName,
    },
    sku_category: [
      {
        sku_cat_id: `${product.categoryId}`,
        sku_cat_name: `${product.categoryId}`,
        sku_parent_cat_id: 'null',
      },
    ],
    sale: {
      original_price: product.marketPrice || product.jdPrice,
      current_price: product.jdPrice,
    },
    shipping_shop: {
      shipping_shop_id: `${storeInfo.storeId || 0}`,
      shipping_shop_name: storeInfo.storeName || '七鲜',
    },
  });
};

const onProductAddCart = product => {
  const storeInfo = Taro.getStorageSync('addressInfo');
  app.sr.track('add_to_cart', {
    action_type: 'first_add_to_cart',
    sku: {
      sku_id: `${product.skuId}`,
      sku_name: product.skuName,
    },
    spu: {
      spu_id: `${product.productId || product.skuId}`,
      spu_name: product.skuName,
    },
    sku_category: [
      {
        sku_cat_id: `${product.categoryId}`,
        sku_cat_name: `${product.categoryId}`,
        sku_parent_cat_id: 'null',
      },
    ],
    sale: {
      original_price: product.marketPrice - 0 || product.jdPrice - 0,
      current_price: product.jdPrice - 0,
    },
    sku_num: product.startBuyUnitNum - 0,
    shipping_shop: {
      shipping_shop_id: `${storeInfo.storeId || 0}`,
      shipping_shop_name: storeInfo.storeName || '七鲜',
    },
  });
};

const onOrderChange = (orderId, orderType) => {
  // give_order：用户提交订单；
  // cancel_pay：用户关闭支付密码浮层；
  // cancel_give_order：用户取消订单；
  // pay：用户发起支付；
  // refund：用户发起退货退款;
  if (app.sr.context.chan.chan_id) {
    app.sr.track('custom_order', {
      order: {
        order_id: `${orderId}`,
        order_time: new Date().getTime(),
        cancel_pay_time:
          orderType === 'cancel_pay' ? new Date().getTime() : null,
        cancel_time:
          orderType === 'cancel_give_order' ? new Date().getTime() : null,
        pay_time: orderType === 'pay' ? new Date().getTime() : null,
        refund_time: orderType === 'refund' ? new Date().getTime() : null,
        order_status: orderType,
      },
    });
  }
};

const onSearch = keyword => {
  app.sr.track('search', {
    keyword,
  });
};

const onRegister = () => {
  const pin = plugin.getStorageSync('jdlogin_pt_pin');
  app.sr.setUser({
    tag: [
      {
        tag_id: pin,
        tag_name: '注册用户',
      },
    ],
  });
  app.sr.track('register_wxapp');
};

const setChan = params => {
  app.sr.setChan({
    ...params,
  });
};

export default {
  onPageShow,
  onPageHide,
  onPageShare,
  onProductExpose,
  onProductTrigger,
  onProductPageShow,
  onProductAddCart,
  onOrderChange,
  onSearch,
  onRegister,
  setChan,
};
