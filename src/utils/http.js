module.exports = {
  request: function request(option = {method: 'get'}){
    return new Promise((resolve, reject) => {
      wx.request({
        ...option,
        success: resp => {
          if(resp.statusCode == 200){
            // console.log('resolve');
            resolve(resp);
          }else{
            // console.log('reject');
            reject(resp);
          }
        },

        fail: resp => {
          reject(resp);
        }
      });
    });
  }
};