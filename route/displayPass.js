const route = require('express').Router();
const User = require('../model/UserDetails');
route.get('/',(req,res)=>{
    res.render('login');
})

module.exports = route;