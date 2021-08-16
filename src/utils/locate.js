const locate = (config = { type: 'wgs84' }) => {

  return new Promise(function (resolve, reject) {
    let options = { ...config };
    // options.fail = function(err){
    //   wx.showModal({
    //     content: JSON.stringify(err)
    //   })
    // }
    options.complete = ({ errMsg, ...rest }) => {
      if ('getLocation:ok' == errMsg) {
        // TEST CODE
        // rest.longitude = 116.56326293945312;
        // rest.latitude = 39.786468505859375;
        console.log(`%c 坐标体系：${options.type}，坐标：${rest.longitude},${rest.latitude}`, 'font-size: 16px');
        resolve(rest);
      } else {
        // wx.showModal({
        //   content: errMsg
        // })
        reject(errMsg);
      }
    };

    wx.getLocation(options);
  })
}

module.exports = locate