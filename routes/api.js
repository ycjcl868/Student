var express = require('express');
var router = express.Router();

var common = require('./common');
var commonModel = require('../models/common');
var studentModel = require('../models/student');
var teacherModel = require('../models/teacher');
var adminModel = require('../models/admin');


/**
 * 用户修改密码
 */
router.post('/editPass',common.isLogin,function(req,res,next){
	var username = req.session.userID;
	var old_password = req.body.old_password;
	var new_password = req.body.new_password;
	if(username && old_password && new_password){
		commonModel.editPass(username,old_password,new_password,function(results){
			res.json(results);
		});
	}else{
		res.json({status:0,info:"参数错误"});
	}
});

/**
 * 重置密码
 */
router.post('/resetPass',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){	
		var username = req.body.userID;
		if(username){
			commonModel.resetPass(username,function(results){
				res.json(results);
			});
		}else{
			res.json({status:0,info:"参数错误"});
		}
	})

});

/**
 *  用户验证码正确与否
 */
router.post('/authcode',function(req,res,next){
	var usercode = req.body.usercode;
	var authcode = req.session.authcode;
	console.log(usercode);
	console.log(authcode);
	if(usercode === authcode){
		res.json({status:1,info:"验证码正确"});
	}else{
		res.json({status:0,info:"验证码错误"});
	}
});

router.post('/login',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var usercode = req.body.usercode;
	var authcode = req.session.authcode;

	if(username && password){
		commonModel.login(username,password,usercode,authcode,function(results){
			if(results.status === 1){
				req.session.userID = results.userID;
			}
			res.json(results);
		});
	}else{
		res.json({status:0,info:"参数错误"});
	}	
})


/**
 * 学生选课
 */
router.post('/chooseCourse',common.isLogin,function(req,res,next){
	common.isStudent(req,res,next,function(){
		var userID = req.session.userID;
		var courseID = req.body.courseID;
		if(userID && courseID){
			studentModel.chooseCourse(userID,courseID,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}

	})
})

/**
 * 登分操作
 */
router.post('/addGrade',common.isLogin,function(req,res,next){
	common.isTeacher(req,res,next,function(){
		var userID = req.session.userID;
		var courseID = req.body.courseID;
		var studentID = req.body.studentID;
		var grade = req.body.grade;
		if(userID && courseID && studentID && grade){
			teacherModel.courseCorrect(userID,courseID,function(results){
				var flag = results.status;
				if(grade >= 0 && grade <= 100){
					teacherModel.addGrade(courseID,studentID,grade,flag,function(result){
						res.json(result);
					});					
				}else{
					res.json({status:0,info:'成绩应为0-100的整数'});
				}

			})

		}else{
			res.json({status:0,info:'参数错误'});	
		}
	})
});

/**
 * 管理员查询单个学生信息 select
 */
router.post('/student/:id',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var studentID = req.params.id;
		if(userID){
			adminModel.queryStudentDetail(studentID,function(result){
				res.send(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员新增单个学生信息  insert
 */
router.post('/add/student',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var params = {};
		params.studentID = req.body.studentID;
		params.studentName = req.body.studentName;
		params.birthday = req.body.birthday;
		params.major = req.body.major;
		console.log("studentName:"+params.studentName)
		console.log("major:"+params.major)
		if(userID){
			adminModel.addStudent(params,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员删除单个学生信息  delete
 */
router.post('/del/student',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var studentID = req.body.studentID;		
		if(userID){
			adminModel.delStudent(studentID,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员修改单个学生信息 update
 */
router.post('/edit/student',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var params = {};
		params.studentID = req.body.id;
		params.studentName = req.body.studentName;


		if(userID){
			adminModel.editStudent(params,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员查询单个教师信息 select
 */
router.post('/teacher/:id',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var teacherID = req.params.id;
		if(userID){
			adminModel.queryTeacherDetail(teacherID,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员新增一个教师信息  insert
 */
router.post('/add/teacher',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var params = {};
		params.teacherID = req.body.teacherID;
		params.teacherName = req.body.teacherName;
		params.jobTitle = req.body.jobTitle;
		console.log("params:"+JSON.stringify(params));


		if(userID){
			adminModel.addTeacher(params,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});			
		}
	})
});

/**
 * 管理员删除单个教师信息  delete
 */
router.post('/del/teacher',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var teacherID = req.body.teacherID;		
		if(userID){
			adminModel.delTeacher(teacherID,function(result){
				res.json(result);
			})
		}else{
			res.json({status:0,info:'参数错误'});
		}
	})
});

/**
 * 管理员修改单个教师信息 update
 */
router.post('/edit/teacher',common.isLogin,function(req,res,next){
	common.isAdmin(req,res,next,function(){
		var userID = req.session.userID;
		var params = {};
		params.teacherID = req.body.id;
		params.teacherName = req.body.teacherName;
		params.jobTitle = req.body.jobTitle;

		if(userID){
			console.log(params);
			adminModel.editTeacher(params,function(result){
				res.json(result);				
			})
		}else{
			res.json({status:0,info:'参数错误'});			
		}
	})
});

module.exports = router;
