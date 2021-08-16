const TEST_HOST = 'https://beta-wxapplogin.m.jd.com',
  PROD_HOST = 'https://wxapplogin.m.jd.com';

const isTest = false,
  host = isTest ? TEST_HOST : PROD_HOST,
  api = {
    smslogin: 'cgi-bin/login/smslogin',
    smslogin_sendmsg: 'cgi-bin/login/smslogin_sendmsg',
    dosmslogin: 'cgi-bin/login/dosmslogin',
    smslogin_checkreceiver: 'cgi-bin/login/smslogin_checkreceiver',
    wxconfirmlogin: 'cgi-bin/login/wxconfirmlogin',
    logout: 'cgi-bin/login/logout',
    wxapp_gentoken: 'plogin/cgi-bin/app/wxapp_gentoken',
    tokenlogin: 'cgi-bin/login/tokenlogin',
  };

(function(arg) {
  for (let i in arg) {
    arg[i] = `${host}/${arg[i]}`;
  }
})(api);

export default api;
