var express = require('express');
var router = express.Router();


var common = require('./common');
var adminModel = require('../models/admin');
var moment = require('moment');

//管理员界面
router.get('/',common.isLogin ,function(req, res, next) {
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			res.render('admin/home',{name: userID,page:'home'});
		}
	})
});

//查看所有学生信息
router.get('/student',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			adminModel.queryStudent(function(result){
				for(var i = 0; i < result.status;i++){
					result.data[i].birthday = moment(result.data[i].birthday).format('YYYY年MM月DD日');
				}				
				res.render('admin/student',{data:result,name: userID,page:'student'});
			})
		}else{
			res.send({status:0,info:'参数错误'});				
		}
	})
})


//查看所有教师信息
router.get('/teacher',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			adminModel.queryTeacher(function(result){
				res.render('admin/teacher',{data:result,name: userID,page:'teacher'});
			})
		}else{
			res.send({status:0,info:'参数错误'});				
		}
	})
})

//查看修改密码信息
router.get('/editpass',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			res.render('admin/editpass',{name: userID,page:'admin'});
		}else{
			res.send({status:0,info:'参数错误'});				
		}
	})
})


//增删改查单个教师、学生信息,ajax接口



module.exports = router;