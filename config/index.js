const ambiente = process.env.NODE_ENV ||'development'
const configuraciónBase ={
    jwt:{ },
    puerto:3000
}
let configuraciónDeAmbiente={}
 switch (ambiente){
case 'desarrollo':
case 'dev':
case 'development':
  configuraciónDeAmbiente = require('./dev')
break
case 'producción':
case 'prod':
    configuraciónDeAmbiente = require('./prod')
    break
 default:
    configuraciónDeAmbiente = require('./dev')

 }
 
 module.exports = {
...configuraciónBase,
...configuraciónDeAmbiente
 }