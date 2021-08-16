import {
  onPageSet,
  onPagePv,
  logPointsClick,
  logUrlAddSeries,
  logPageUnload,
  commonLogClick,
  onPageClick,
  commonLogExposure,
  wxStructureLogClick,
  logOrder,
  getPageInfo,
} from './miniReport';

/**
 * @param {String} params 必填，点击事件参数
 */
const logClick = params => {
  logPointsClick({
    ...params,
    developMode: process.env.NODE_ENV === 'development' ? 1 : '',
  });
};

/**
 * @param {String} eventId 必填，点击事件id
 * @param {Object} jsonParam 必填，点击事件参数
 */
export const structureLogClick = params => {
  wxStructureLogClick({
    ...params,
    developMode: process.env.NODE_ENV === 'development' ? 1 : '',
  });
};

export {
  onPageSet,
  onPagePv,
  logClick,
  logUrlAddSeries,
  logPageUnload,
  commonLogClick,
  commonLogExposure,
  onPageClick,
  logOrder,
  getPageInfo,
};
