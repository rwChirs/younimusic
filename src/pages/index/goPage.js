import Taro, { getApp } from "@tarojs/taro";
import { getH5PageUrl, getUrlParams } from "../../utils/common/utils";
import utils from "../login/util";

export default function toUrlByType({
  action,
  storeId,
  coords,
  tenantId,
  platformId,
  allCategoryList,
  productItem,
}) {
  if (!action || !action.urlType) return;

  action.toUrl = action.toUrl || "";

  let toUrl = "";
  let goH5 = true;
  let name = "";

  if (allCategoryList && allCategoryList.length > 0) {
    allCategoryList.forEach((value) => {
      if (value.id === Number(action.toUrl)) {
        name = value.name;
      }
    });
    console.log(
      "allCategoryList",
      allCategoryList,
      "选中的1级分类id及name",
      action.toUrl,
      name
    );
  }
  switch (action.urlType) {
    //邀请有礼
    case "204":
      // toUrl = "inviteHasGifts.html";
      toUrl = `/pages-a/invitation/index?${action.toUrl}&storeId=${
        storeId || ""
      }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`;
      goH5 = false;
      break;
    //新人专享
    case "205":
      toUrl = "newGift.html";
      break;
    //试吃
    case "209":
      toUrl = action.toUrl;
      break;
    //热销排行
    case "202":
      toUrl = `hot.html`;
      break;
    //新品上市
    case "203":
      toUrl = `new.html`;
      break;
    //砍价列表
    case "211":
      toUrl = `bargainList.html`;
      break;
    // 无连接
    case "0":
      return;
    //商祥
    case "1":
      if (
        action &&
        action.toUrl &&
        action.toUrl.indexOf("channel/netredstall") > 0
      ) {
        toUrl = action.toUrl;
      } else if (productItem && productItem.prepayCardType) {
        toUrl = `/pages/secondaryActivity/card-detail/index?from=miniapp&storeId=${storeId}&skuId=${productItem.skuId}&lng=${coords.lng}&lat=${coords.lat}&prepayCardType=${productItem.prepayCardType}`;
        goH5 = false;
      } else {
        toUrl = `/pages/detail/index?${action.toUrl}&storeId=${
          storeId || ""
        }&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`;
        goH5 = false;
      }
      break;
    //秒杀列表
    case "201":
      toUrl = "seckill/?";
      break;
    //店铺
    // case "2":
    //   toUrl = `/pages/index/index?storeId=${storeId}`;
    //   goH5 = false;
    //   break;
    //分类
    case "5":
      // eslint-disable-next-line no-restricted-globals
      toUrl = isNaN(action.toUrl * 1)
        ? "category1.html?iconSource=1"
        : "category2.html?iconSource=1&cid=" + action.toUrl + "&name=" + name;
      break;
    //m站
    case "3":
    case "210":
      console.log("action", action);
      // start 解决直播落地页跳转app的问题
      let liveType =
        action.toUrl &&
        getUrlParams(action.toUrl) &&
        getUrlParams(action.toUrl)["liveType"] === "1";
      console.log("oriUrl", getUrlParams(action.toUrl)["liveType"], liveType);
      if (liveType) {
        action.toUrl = "https://7fresh.m.jd.com/channel/?id=11116";
      }
      // end
      toUrl = action.toUrl.replace("http://", "https://");
      break;
    case "220":
      (toUrl = `/pages/bill/bill-detail/index?${action.toUrl}&storeId=${
        storeId || ""
      }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`),
        (goH5 = false);
      break;
    case "222":
      toUrl = `${action.toUrl}&storeId=${storeId || ""}`.replace(
        "http://",
        "https://"
      );
      break;
    case "224":
      toUrl = action.toUrl;

      goH5 = false;
      break;
    //堂食分类
    case "230":
      toUrl = "food-category/?from=miniapp";
      break;
    // 小程序直播
    case "232":
      toUrl = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${action.toUrl}`;
      goH5 = false;
      break;
    case "search":
      toUrl = action.toUrl;
      break;
    //跳转7club话题详情页
    case "231":
      toUrl = `/pages/7club/topic-detail/index?topicId=${action.toUrl}`;
      goH5 = false;
      break;
  }

  if (goH5) {
    if (!toUrl) return;
    if (toUrl.indexOf("7fresh/active") > -1) {
      const _toUrl = toUrl.replace("7fresh/active", "mini/active");
      toUrl =
        _toUrl.indexOf("?") > -1
          ? `${_toUrl}&wxAppName=7fresh`
          : `${_toUrl}?wxAppName=7fresh`;
    }
    if (toUrl.indexOf("7fresh-groupon") > -1) {
      Taro.navigateTo({
        url: `/pages-a/fight-group/list/index?storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("fight-group") > -1 && toUrl.indexOf("detail") > -1) {
      Taro.navigateTo({
        url: `/pages-a/fight-group/detail/index?${toUrl
          .split("?")[1]
          .replace("sID", "skuId")}&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("fight-group") > -1 && toUrl.indexOf("list") > -1) {
      Taro.navigateTo({
        url: `/pages-a/fight-group/list/index?storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("7fresh.m.jd.com/groupon") > -1) {
      Taro.removeStorageSync("solitaire-list-top");
      Taro.navigateTo({
        url: `/pages/solitaire/list/index?storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/top100") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/top100/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/seckill") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/seckill/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("red-envelope-rain") > -1) {
      Taro.navigateTo({
        url: `/pages-a/red-envelope-rain/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/nm") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/nm/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/three-group") > -1) {
      Taro.navigateTo({
        url: `/pages-a/fight-group/three-group/index?${
          toUrl.split("?")[1]
        }&storeId=${storeId}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/draw") > -1) {
      Taro.navigateTo({
        url: `/pages-a/draw/index?${toUrl.slice(toUrl.indexOf("?") + 1)}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/multiple-orders-gift") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/multiple-orders-gift/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/happy-eliminate") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/happy-eliminate/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/immersive/inviteHasGifts") > -1) {
      Taro.navigateTo({
        url: `/pages-a/invitation/index?${action.toUrl}&storeId=${
          storeId || ""
        }`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/new-customer") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/newcustomer/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}&storeId=${
          storeId || ""
        }&fromPage=${action && action.fromPage}`,
      });
      return;
    }
    if (toUrl.indexOf("m.jd.com/giftCards/cardDetail") > -1) {
      Taro.navigateTo({
        url: `/pages/secondaryActivity/card-detail/index?${toUrl.slice(
          toUrl.indexOf("?") + 1
        )}&lng=${
          coords && typeof coords === "object" && coords.lng ? coords.lng : ""
        }&lat=${
          coords && typeof coords === "object" && coords.lat ? coords.lat : ""
        }&tenantId=${tenantId || ""}&platformId=${platformId || ""}`,
      });
      return;
    }

    toUrl =
      toUrl.indexOf("7fresh") === -1 &&
      toUrl.indexOf("http") === -1 &&
      toUrl.indexOf(".com") === -1
        ? getApp().h5RequestHost + "/" + toUrl
        : toUrl;
    toUrl = getH5PageUrl(toUrl, storeId, tenantId, platformId, coords);
    utils.navigateToH5({ page: toUrl });
  } else {
    if (toUrl.indexOf("?") > -1) {
      toUrl = toUrl + "&";
    } else {
      toUrl = toUrl + "?";
    }
    toUrl =
      toUrl +
      `lng=${
        coords && typeof coords === "object" && coords.lng ? coords.lng : ""
      }&lat=${
        coords && typeof coords === "object" && coords.lat ? coords.lat : ""
      }`;
    if (toUrl.indexOf("storeId=") === -1) {
      toUrl = getH5PageUrl(toUrl, storeId, tenantId, platformId, coords);
    }
    Taro.navigateTo({
      url: toUrl,
    });
  }
}
