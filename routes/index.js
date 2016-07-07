var express = require('express');
var router = express.Router();

var commonModel = require('../models/common');

var common = require('./common');
var studentModel = require('../models/student');

//验证码模块
var ccap = require('ccap')({
	width: 100,
	height:50,
	offset:23,
	fontsize:35,
	generate:function(){
		var items = '1234567890';
		var vcode = '';
		for(var i = 0;i<4;i++){
			var rnd = Math.random();
			var item = Math.round(rnd*(items.length-1));
			vcode+=item;
		}
		return vcode;
	}
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


/**
 * 登陆页面
 */
router.get('/login',function(req,res,next){
	if(req.session.userID){
		common.isWho(req,res,next,function(result){
			if(result === 'student'){
				res.redirect('/student');
			}else if(result === 'teacher'){
				res.redirect('/teacher');
			}else if(result === 'admin'){
				res.redirect('/admin');
			}
		})
	}else{
		console.log('req.session.authcode:'+req.session.authcode);	
	    res.render('login');
	}

})

/**
 * 登陆页验证码
 */
router.get('/authpic/:id',function(req,res,next){
	var ary = ccap.get();
	var txt = ary[0];
	var buf = ary[1];

	// res.render('login');

	req.session.authcode = txt;
	console.log("req.session.authcode:"+req.session.authcode);
	res.end(buf);
	// console.log("req.cookies:"+JSON.stringify(req.cookies));
	// console.log('req.session.authcode:'+req.session.authcode);
	// console.log('req.session.abcd'+req.session.abcd);
	// console.log(txt);
	
})

router.get('/test',function(req,res,next){
	console.log("req.cookies:"+JSON.stringify(req.cookies));
	res.send(req.session.authcode);
})





/**
 * 非ajax登陆接口
 */
router.post('/login',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var usercode = req.body.usercode.toUpperCase();
	var authcode = req.session.authcode;
	console.log('req.session.authcode:'+usercode);	
	console.log('usercode:'+req.session.authcode);	
	if(username && password){
		commonModel.login(username,password,usercode,authcode,function(results){
			if(results.status > 0){
				req.session.userID = results.userID;
				console.log('req.session.userID:'+req.session.userID);
				if(results.userType === 'student'){
					res.redirect('/student');
				}else if(results.userType === 'teacher'){
					res.redirect('/teacher');
				}else if(results.userType === 'admin'){
					res.redirect('/admin');
				}
			}else{
				res.send(results.info);
			}
		});
	}else{
		res.json({status:0,info:"参数错误"});
	}
});

/**
 * 非ajax退出登陆
 */
router.get('/loginout',function(req,res,next){
	req.session.userID = '';
	res.redirect('/login');	
});





module.exports = router;
 