const dev = process.env.NODE_ENV === "development";
export const bizReqUrl = `${
  dev
    ? "https://mwpgwb.m.jd.com" // 预发
    : "https://mwpgw.m.jd.com" // 线上
}/mwp/mobileDispatch`;

export const commonParams = {
  appName: "7fresh",
  client: "m"
};
