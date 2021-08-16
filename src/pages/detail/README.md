### 详情页

##### 商品

```
// 7fresh.ware.detail
{
  addCart, // 是否加入购物车标记
  av, // 广告词
  bigFieldUrl,
  brand,
  buyButtonType, // 购物车显示的按钮，0是加车按钮，1是立即购买按钮
  buySaleRatio,
  buyStatus, // 购买状态，1已购买
  buyUnit, // 购买单位
  buyUnitInCart, // 购物车购买使用单位
  deliveryType,
  imageInfoList: [{
    imageUrl,
    index,
    sceneType
  }], // 图片数组
  imageUrl, // 图片地址
  isGift, // 是否是赠品
  isPackage, // 是否是套装商品
  isPeriod, // 是否是定期购商品
  isPiece, // 是否是称重商品， true称重商品标品，false计件商品
  isPop, // 是否弹框字段 true 弹出
  jdPrice, // 京东价
  marketPrice, // 市场价
  maxBuyUnitNum, // 最大购买数量
  miaoshaPrice, // 预告商品的秒杀价格（秒杀开始，价格不显示）
  periodIcon, // 定期送利益点
  placeOfProduct,
  preSale, // 是否是预售商品
  productId, // 商品？
  productfeatures: {
    isTest,
    packageType,
    storeprop
  },
  promotionTypes: [{
    promotionType, // 1.折扣 2.赠品 3.满赠
    promotionSubType,
    beginTime,
    endtime,
    promoId,
    promotionName,
    giftInfos,
    privilegeDiscount,
    fullPromoResultInfos: [{
      condition,
      giftInfos: [{
        skuId,
        addCart,
        skuNum,
        discountPrice
      }]
    }],
  }], // 促销节点
  relationWareInfos,
  saleAttrInfos: [{
    attrId,
    attrName,
    valId,
    valName,
    dim,
    valNo,
    attrInfos: [{
      attrId,
      attrName,
      valId,
      valName,
      dim,
      valNo
    }]
  }], // 销售属性？
  saleNum, // 剩余库存数量
  saleNumBigDecimal,
  saleSpecDesc,
  saleUnit,
  salemode, // 销售方式 1.计件 2.称重
  seckillInfo: {
    totalCount,
    page,
    pageSize,
    totalPage,
    started, // 是否正在进行，true正在进行
    time, // 场次显示的时间，如：10:00
    startTime, // 秒杀开始时间，格式：2017-10-11 10:00:00
    restseckillTime
  }, // 秒杀节点
  serviceTagId, // 加工方式选择的ID值，加入购物车使用
  serviceTags, // 加工方式
  shelfLife, // 保质期
  showCheckbox,
  showPreIcon,
  skuId, // 商品编号
  skuName, // 商品名称
  startBuyUnitNum, // 起够数量
  startBuyDesc, // 起购描述
  status,
  stepBuyUnitNum, // 每次购买数量?
  stockNotice,
  stockNum, // 购物车库存数量
  storeId, // 店铺编号
  weightDesc // 商品重量，计件商品
}
```

```
// 7fresh.wareext.get
{
  cashBackInfo, // 消费返现节点
  showCouponLabels, // 优惠券显示节点
  showGetMoneyIcon, // 分享得好进去icon
  suitIncludeWares, // 套装包含的商品列表
  wareInSuits // 商品所在的套装列表
}
```

```
// 7fresh.ware.changeAddress
// isInvalid=true  则 toast提示
// isInvalid=false，addCart: true，正常切换
// isInvalid=false，addCart: false，购物车按钮置灰
{
  addCart,
  storeId,
  isGift,
  isInvalid,
  invalidTip
}
```

```
// 7fresh.ware.getFastDeliveryTime
```

```
// 7fresh.ware.hasPromotionWares
```

```
// 7fresh.ware.pDesc
```

```
// 7fresh.coupon.wares
{
  myCoupons, // 已经领取优惠券列表 父节点
  canAchieveCoupons // 可领取优惠券列表
}
```

- 基本信息
  - 商品主题
  - 秒杀/秒杀预告
  - 分享有礼
  - 商品名称
  - 广告语
  - 划线价
  - 售卖价格
  - 规则+限购信息
  - spu 展示
  - 组套
  - 规格选择 服务 SKU
- 促销模块
  - 消费返现
  - 领券
  - 促销：满减、满赠
  - 惠搭配
- 配送地址 展示默认地址

##### 推荐

单独组件，不涉及交互

##### 详情

##### 评价

##### 分享

##### 加车

通过 url 获取 storeId、lat、lng

1.是否登录 2.是否定位 3.是否加载商品详情图片描述 4.分享
