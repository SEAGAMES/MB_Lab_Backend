const md5 = require('md5');
 


async function create_md5(data) {

  return  md5(data)
 
}


module.exports = { md5: create_md5 }