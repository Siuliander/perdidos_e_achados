const cors = require('cors')

module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers",'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, content-type, Date, X-Api-Version, Authorization')
    res.header("Access-Control-Allow-Methods","GET,OPTIONS,PATCH,DELETE,POST,PUT")
    res.header("Access-Control-Allow-Credentials","true")
  
    // app.use( cors() )
    // next()
    
    return cors() 
}