const date = (time) => {
  if(time==null){
    return ""
  }
  else{
    let d = new Date(time).toString().split(" ");

      //["Fri", "Apr", "09", "2021", "16:11:06", "GMT+0700", "(เวลาอินโดจีน)"]
       
      return d[2] + " " + getmonth(d[1]) + " " + (parseInt(d[3]) + 543)//+ " " + d[4];
  }
    
    
}

const mysql_dateformat = (time) =>{
  
  let d = new Date(time)
  
  return d.getFullYear()+ "-" + (d.getMonth()+1) + "-" + d.getDate()
}

const date_time = (time) => {
  if(time==null){
    return ""
  }
  else{
  let d = new Date(time).toString().split(" ");

    //["Fri", "Apr", "09", "2021", "16:11:06", "GMT+0700", "(เวลาอินโดจีน)"]
     
    return d[2] + " " + getmonth(d[1]) + " " + (parseInt(d[3]) + 543)+ " " + d[4];
  }
}

function getmonth (month){
      switch (month) {
        case "Jan":
          return "มกราคม";
        case "Feb":
          return "กุมภาพันธ์";
        case "Mar":
          return "มีนาคม";
        case "Apr":
          return "เมษายน";
        case "May":
          return "พฤษภาคม";
        case "Jun":
          return "มิถุนายน";
        case "Jul":
          return "กรกฎาคม";
        case "Aug":
          return "สิงหาคม";
        case "Sep":
          return "กันยายน";
        case "Oct":
          return "ตุลาคม";
        case "Nov":
          return "พฤศจิกายน";
        case "Dec":
          return "ธันวาคม";
      }
    }
module.exports = {getDate: date,getDatetime:date_time,getDateSql:mysql_dateformat} ;