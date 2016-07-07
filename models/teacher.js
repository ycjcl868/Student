//连接数据库
var mysql = require('mysql');
//引入数据库信息
var config = require('../conf/db');
//md5加密
var crypto = require('crypto');


var connection = mysql.createConnection(config.database);
connection.connect();


module.exports = {
	/**
	 * 查询教师的信息以及所带的课程
	 * @param  {[type]} userID 教师号
	 * @param  {[type]} fun    回调
	 */
	queryInfo: function(userID,fun){
		connection.query('SELECT teacher.teacherID, teacher.teacherName, teacher.jobTitle, course.courseName FROM teacher LEFT JOIN teachCourse ON teachCourse.teacherID = teacher.id LEFT JOIN course ON teachCourse.courseID = course.id WHERE (teacher.teacherID =?)',userID,function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没有该教师信息"});
			}
			if(err){
				throw err;
			}			
		});
	},
	/**
	 * 教师所带课程列表
	 * @param  {[type]} userID 教师号
	 * @param  {[type]} fun    回调
	 * @return {[type]}        [description]
	 */
	courseList: function(userID,fun){
		connection.query('SELECT course.courseID,course.courseName , teacher.teacherID, course.courseName FROM teacher LEFT JOIN teachCourse ON teachCourse.teacherID = teacher.id LEFT JOIN course ON teachCourse.courseID = course.id WHERE (teacher.teacherID =?)',userID,function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没有授课"});
			}
			if(err){
				throw err;
			}
		})
	},
	/**
	 * 选修该教师的课程列表
	 * @param  {[type]} userID   教师号
	 * @param  {[type]} courseID 课程号
	 * @param  {[type]} fun      回调
	 * @return {[type]}          [description]
	 */
	studentList: function(userID,courseID,fun){
		connection.query('SELECT student.studentID, chooseCourse.grade,student.studentName, student.major, teachCourse.courseID, teacher.teacherID, course.courseName FROM teacher LEFT JOIN teachCourse ON teachCourse.teacherID = teacher.id LEFT JOIN course ON teachCourse.courseID = course.id LEFT JOIN chooseCourse ON chooseCourse.courseID = course.id LEFT JOIN student ON chooseCourse.studentID = student.id WHERE (teacher.teacherID =? and teachCourse.courseID = ?)',[userID,courseID],function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没人选课"});
			}

			if(err){
				throw err;
			}
		})
	},
	/**
	 * 判断老师是不是教这门课，且有没有提交过成绩
	 * @param  {[type]} courseID 课程号
	 * @param  {[type]} fun      回调
	 * @return {[type]}          [description]
	 */
	courseCorrect:function(userID,courseID,fun){
		var len = 0;
		connection.query('SELECT DISTINCT course.courseID, teacher.teacherID, chooseCourse.grade FROM teacher LEFT JOIN teachCourse ON teachCourse.teacherID = teacher.id LEFT JOIN course ON teachCourse.courseID = course.id LEFT JOIN chooseCourse ON chooseCourse.courseID = course.id WHERE (teacher.teacherID =? and chooseCourse.grade=0)',userID,function(err,results){
			for(var i=0;i<results.length;i++){
				console.log("results.courseID:"+results[i].courseID);
				console.log("courseID:"+courseID);
				if(results[i].courseID == courseID){
					len++;
				}
			}
			console.log(len);
			if(len>0){
				fun({status:1,info:"教师可以添加成绩"});
			}else{
				fun({status:0,info:"老师不能添加成绩"});
			}
		})
	},
	/**
	 * 登分操作
	 * @param {[type]} courseID   课程号
	 * @param {[array]} studentIDs 学生ID
	 * @param {[array]} grades     成绩
	 * @param {[type]} fun        回调
	 */
	addGrade: function(courseID,studentID,grade,flag,fun){
		if(flag == 1){
				connection.query('UPDATE chooseCourse SET grade = ? WHERE  studentID in (select id from student where studentID = ?) and courseID = ?',[grade,studentID,courseID],function(err,results){
					console.log(results);
					if(results.affectedRows){
						fun({status:1,info:'登分成功'});
					}else{
						fun({status:0,info:'登分失败'});
					}
					if(err){
						throw err;
					}			
				});				
			// }


		}else{
			fun({status:0,info:'老师不能添加成绩'});
		};	
	}




	
}