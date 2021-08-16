/*
  倒计时
  @params [Number] 需要倒计时的时间，单位为秒
  @return [Array] 倒计时之后的时间，[时，分，秒]
*/

function timeCountDown (obj) {
  // obj.timer = setInterval(() => {
  //   if(obj.state.duration < 0) {
  //     clearInterval(obj.timer);
  //     return;
  //   }
  //   obj.setState({
  //     duration: obj.state.duration - 1
  //   });
  //   let runningTime = formatTime(obj.state.duration);

  //   obj.setState({
  //     hour: runningTime[0],
  //     minute: runningTime[1],
  //     second: runningTime[2]
  //   })
  // },1000);

  // function formatTime(time) {
  //   let h = Math.floor(time / 3600);
  //   let m = Math.floor((time - h * 3600) / 60);
  //   let s = time % 3600;
  //   return [toTwo(h),toTwo(m),toTwo(s)];
  // };

  // function toTwo(n) {
  //   return n < 10 ? '0' + n : '' + n;
  // }
  return '';
};

export default timeCountDown;

/**
 *  function 倒计时
 *  参数：intDiff 时间
 *  单位：s 秒
 */
export const countDown=(obj,intDiff,fn)=> {
  obj.timer = setInterval(function() {
      //计算出相差天数  
      let day=Math.floor(intDiff/(24*3600*1000))  
      //计算出小时数
      let leave1=intDiff%(24*3600*1000)    //计算天数后剩余的毫秒数  
      let hour=Math.floor(leave1/(3600*1000))  
      //计算相差分钟数  
      let leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
      let minute=Math.floor(leave2/(60*1000))  
      //计算相差秒数  
      let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
      let second=Math.round(leave3/1000)  
      // console.log(" 相差 "+day+"天 "+hour+"小时 "+minute+" 分钟"+second+" 秒")
      intDiff-=1000;
      if (intDiff <= 0) {
          day = 0; hour = 0; minute = 0; second = 0;
          clearInterval(obj.timer);
      }
      fn(day,hour,minute,second);
  }, 1000);
}