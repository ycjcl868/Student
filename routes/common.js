var express = require('express');
var commonModel = require('../models/common');

module.exports = {
	// 判断是否登陆
	isLogin:function(req,res,next){

		if(!req.session.userID){
			console.log('Access Denied');
			res.redirect('/login');	
		}else{
			next();
		}
	},
	// 身份判断
	isWho:function(req,res,next,fun){
		var username = req.session.userID;
		commonModel.userType(username,function(result){
			fun(result);
		})
	},
	// 判断是否为学生
	isStudent:function(req,res,next,fun){
		var username = req.session.userID;
		commonModel.userType(username,function(result){
			if(result === 'student'){
				fun();
			}else{
				res.redirect('/');
			}
		})
	},
	// 判断是否为教师
	isTeacher:function(req,res,next,fun){
		var username = req.session.userID;
		commonModel.userType(username,function(result){
			if(result === 'teacher'){
				fun();
			}else{
				res.redirect('/');
			}
		})	
	},
	// 判断是否为管理员
	isAdmin:function(req,res,next,fun){
		var username = req.session.userID;
		commonModel.userType(username,function(result){
			if(result === 'admin'){
				fun();
			}else{
				res.redirect('/');
			}
		})			
	}

}