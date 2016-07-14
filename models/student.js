//数据库模块
var mysql = require('mysql');
var config = require('../conf/db');
//md5加密模块
var crypto = require('crypto');

//连接数据库
var connection = mysql.createConnection(config.database);
connection.connect();

module.exports = {
	/**
	 * 查询个人学生信息
	 * @param  {[type]} params [学号]
	 * @param  {[type]} fun    [返回值]
	 */
	queryStudent: function(userID,fun){
		connection.query('select * from student where studentID= ?',userID,function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没有该学生信息"});
			}
			if(err){
				throw err;
			}
		});
	},
	/**
	 * 查询已经选课程
	 */
	queryCourse:function(userID,fun){
		connection.query('SELECT course.courseID,course.courseName, teacher.teacherName, teacher.jobTitle,chooseCourse.grade, course.credit, teachCourse.date FROM student LEFT JOIN chooseCourse ON chooseCourse.studentID = student.id LEFT JOIN course ON chooseCourse.courseID = course.id LEFT JOIN teachCourse ON teachCourse.courseID = course.id LEFT JOIN teacher ON teachCourse.teacherID = teacher.id WHERE (student.studentID =? and teacher.teacherName is not NULL) ORDER BY teachCourse.date DESC',userID,function(err,results){
			if(err){
				throw err;
			}
			fun({status:results.length,data:results});		
		})
	},
	/**
	 * 学生选课
	 */
	chooseCourse:function(userID,courseID,fun){
		//先查询有没有选过该课程
		connection.query('SELECT * FROM course WHERE courseID = ?',[courseID],function(err,results){
			if(err){
				throw err;
			}			
			if(results.length != 0){
				console.log("userID:"+userID);
				console.log("courseID:"+courseID);

				connection.query('SELECT chooseCourse.studentID, chooseCourse.courseID, student.studentID, student.id FROM chooseCourse LEFT JOIN student ON chooseCourse.studentID = student.id WHERE chooseCourse.courseID =? AND student.studentID= ?',[courseID,userID],function(err,results){
					console.log(results);
					if(results.length == 0){
						connection.query('INSERT INTO chooseCourse (studentID, courseID)  SELECT id,? FROM student WHERE studentID = ?',[courseID,userID],function(err,results){
							if(err){
								throw err;
							}
							fun({status:1,info:'选课成功'});
						});				
					}else{
						fun({status:0,info:'已经选修过这门课'});
					}
				});							
			}else{
				fun({status:0,info:'没有这门课'});
			}

		})


	},
	/**
	 * 课程列表
	 */
	courseList:function(fun){
		connection.query('SELECT course.courseID,course.courseName, course.credit, teachCourse.date, teacher.teacherName FROM teachCourse LEFT JOIN course ON teachCourse.courseID = course.id LEFT JOIN teacher ON teachCourse.teacherID = teacher.id WHERE (teachCourse.date is not null) ORDER BY teachCourse.date DESC',function(err,results){
			if(err){
				throw err;
			}
			fun({status:results.length,data:results});
		})
	}



}