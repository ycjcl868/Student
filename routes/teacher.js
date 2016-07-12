var express = require('express');
var router = express.Router();

var common = require('./common');
var teacherModel = require('../models/teacher');

//教师主页
router.get('/',common.isLogin,function(req, res, next) {
	common.isTeacher(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			teacherModel.queryInfo(userID,function(result){
				req.session.teacherName = result.data[0].teacherName;
				res.render('teacher/home',{data:result,page:'home',name:req.session.teacherName});				
			})
		}else{
			res.send({status:0,info:'参数错误'});			
		}
	});	
});


//显示教师所教学科，及学科相对应的学生 ,默认第一个
router.get('/course',common.isLogin,function(req,res,next){
	common.isTeacher(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			teacherModel.courseList(userID,function(result){
				var result1 = result;
				var courseID = result1.data[0].courseID;
				teacherModel.studentList(userID,courseID,function(result){
					var result2 = result;
					if(result2.data  || result.data ){
						res.render('teacher/course',{status:1,course:result1,student:result2,name:req.session.teacherName,page:'course'});
					}else{
						res.render('teacher/course',{status:0,course:result1,student:result2,name:req.session.teacherName,page:'course'});
					}
				})
			})
			
		}else{
			res.send({status:0,info:'参数错误'});	
		}
	})
});
//显示教师所教学科，及学科相对应的学生，界面
router.get('/course/:id',common.isLogin,function(req,res,next){
	common.isTeacher(req,res,next,function(){
		var userID = req.session.userID;
		if(userID){
			teacherModel.courseList(userID,function(result){
				var result1 = result;
				var courseID = req.params.id;
				// console.log(result1);
				// console.log(defaultCourse);
				teacherModel.studentList(userID,courseID,function(result){
					var result2 = result;
					res.render('teacher/course',{status:1,course:result1,student:result2,name:req.session.teacherName,page:'course'});
				});
			})
			
		}else{
			res.send({status:0,info:'参数错误'});	
		}
	})
});

//录入学生成绩，要用ajax，所以写一在api路由中


//修改密码
router.get('/editpass',common.isLogin,function(req,res,next){
	common.isTeacher(req,res,next,function(){	
		res.render('teacher/editpass',{name:req.session.teacherName,page:'editpass'})
	})
})



module.exports = router;