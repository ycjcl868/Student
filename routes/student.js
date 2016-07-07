var express = require('express');
var router = express.Router();

var common = require('./common');
var studentModel = require('../models/student');
var moment = require('moment');



/**
 * 查询学生主页个人信息
 */
router.get('/',common.isLogin,function(req,res,next){
	//学生ID:studentID
	common.isStudent(req,res,next,function(){
		// console.log("req.session.userID:"+req.session.userID);
		var userID = req.session.userID;
		if(userID){

			studentModel.queryStudent(userID,function(result){
				req.session.studentName = result.data[0].studentName;
				result.data[0].birthday = moment(result.data[0].birthday).format('YYYY年MM月DD日');
				res.render('student/home',{data:result,name:req.session.studentName,page:'home'});
			});					
		}else{
			res.send({status:0,info:'参数错误'});
		}

	});

});

/**
 * 查询选课信息
 */
router.get('/course',common.isLogin,function(req,res,next){
	common.isStudent(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			studentModel.queryCourse(userID,function(result){
				for(var i = 0; i < result.status;i++){
					result.data[i].birthday = moment(result.data[i].birthday).format('YYYY年MM月DD日');
				}
				console.log(result); 
				res.render('student/course',{data:result,name:req.session.studentName,page:'course'});
			})			
		}else{
			res.send({status:0,info:'参数错误'});			
		}
	})
});

/**
 * 查看有可选哪些课程
 */
router.get('/courseList',common.isLogin,function(req,res,next){
	common.isStudent(req,res,next,function(){
		studentModel.courseList(function(result){
			for(var i = 0; i < result.status;i++){
				result.data[i].date = moment(result.data[i].date).format('YYYY年MM月DD日');
			}			
			res.render('student/courseList',{data:result,name:req.session.studentName,page:'courseList'});
		})		
	})
});


router.get('/editpass',common.isLogin,function(req,res,next){
	common.isStudent(req,res,next,function(){	
		res.render('student/editpass',{name:req.session.studentName,page:'editpass'})
	})
})




module.exports = router;