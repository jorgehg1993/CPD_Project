var express = require('express')
var router = express.Router()

router.use('/api', require('./public.js'))
router.use('/api', require('./protected.js'))

router.get('/logoutcallback.html', function(req,res){
  res.sendfile("logoutcallback.html");
})

module.exports = router
