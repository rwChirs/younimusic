import { sendRequest } from '../../utils/common/sendRequest';

const getInvitedInfo = (page = 1, pageSize = 20) => {
  return sendRequest({
    api: '7fresh.invite.getInvitedInfo',
    data: JSON.stringify({
      page,
      pageSize,
    }),
  }).then(res => {
    return res;
  });
};

export default {
  getInvitedInfo,
};
