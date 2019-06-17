const app = require('express')();
const environment = process.env.NODE_ENV || app.get('env');

if(environment == 'production'){
  module.exports = require('./prod');
}else{
  module.exports = require('./dev')
}