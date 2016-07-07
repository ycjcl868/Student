//连接数据库
var mysql = require('mysql');
var config = require('../conf/db');
//md5加密
var crypto = require('crypto');

var connection = mysql.createConnection(config.database);
connection.connect();


module.exports = {
	/**
	 * 查询所有学生
	 * @param  {[type]} fun    回调
	 * @return {[type]}        [description]
	 */
	queryStudent:function(fun){
		connection.query('SELECT * FROM student',function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没有学生信息"});
			}
			if(err){
				throw err;
			}			
		});		
	},
	/**
	 * 查询单个学生信息
	 * @param  {[type]} studentID 学生ID
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	queryStudentDetail:function(studentID,fun){
		connection.query('SELECT * FROM student where studentID=?',studentID,function(err,results){
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
	 * 添加一个学生
	 * @param {[type]} params 学生信息
	 * @param {[type]} fun    回调
	 * 密码默认:123456
	 */
	addStudent:function(params,fun){
		console.log(params);
		var that = this;
		var studentID = params.studentID;
		var password = 'e10adc3949ba59abbe56e057f20f883e';		
		var studentName = params.studentName;	
		var birthday = params.birthday;	
		var major = params.major;	
		that.queryStudentDetail(studentID,function(result){
			console.log(result);
			if(result.status != 0){
				fun({status:0,info:"该学生已经注册了"});
			}else{
				connection.query('INSERT INTO student (id, studentID, studentName, birthday, major) VALUES (NULL, ?, ?, ?, ?)',[studentID,studentName,birthday,major],function(err,results){
					if(results.affectedRows){
						connection.query('INSERT INTO users (id, username, password, userType) VALUES (NULL, ?, ?, ?)',[studentID,password,'student'],function(err,results){
							console.log(results);
							if(results.affectedRows){
								fun({status:1,info:"添加学生成功"});
							}else{
								fun({status:0,info:"用户表添加失败"});
							}
							if(err){
								throw err;
							}								
						})
					}else{
						fun({status:0,info:"学生添加失败"});
					}
					if(err){throw err; }
				});					
			}
		})
	},
	/**
	 * 删除单个学生
	 * @param  {[type]} studentID 学生ID		
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	delStudent:function(studentID,fun){
		connection.query('DELETE FROM student WHERE studentID = ?',[studentID],function(err,results){
			if(results.affectedRows){
				connection.query('DELETE FROM users WHERE username=?',[studentID],function(err,results){
					if(results.affectedRows){
						fun({status:1,info:"删除成功"});
					}else{
						fun({status:0,info:"用户表删除失败"});
					}
				})
			}else{
				fun({status:0,info:"学生表删除失败"});
			}
			if(err){throw err;}
		})
	},
	/**
	 * 修改单个学生
	 * @param  {[type]} params 学生ID
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	editStudent:function(params,fun){
		var studentID = params.studentID;
		var studentName = params.studentName;	
		connection.query('UPDATE student SET studentName=? WHERE studentID = ?',[studentName,studentID],function(err,results){
			if(err){throw err;}
			if(results.affectedRows){
				fun({status:1,info:"修改成功"});
			}else{
				fun({status:0,info:"修改失败"});
			}
		})
	},
	/**
	 * 查询所有教师
	 * @param  {[type]} fun    回调
	 * @return {[type]}        [description]
	 */
	queryTeacher:function(fun){
		connection.query('SELECT * FROM teacher',function(err,results){
			if(results.length != 0){
				fun({status:results.length,data:results});
			}else{
				fun({status:0,info:"没有教师信息"});
			}
			if(err){
				throw err;
			}			
		});		
	},
	/**
	 * 查询单个教师信息
	 * @param  {[type]} teacherID 教师ID
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	queryTeacherDetail:function(teacherID,fun){
		connection.query('SELECT * FROM teacher where teacherID=?',teacherID,function(err,results){
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
	 * 添加一个教师
	 * @param {[type]} params 参数
	 * @param {[type]} fun    回调
	 */
	addTeacher:function(params,fun){
		var that = this;
		var teacherID = params.teacherID;
		// var password = crypto.createHash('md5').update(params.password).digest('hex');		
		var teacherName = params.teacherName;	
		var jobTitle = params.jobTitle;	
		that.queryTeacherDetail(teacherID,function(result){
			if(result.status != 0){
				fun({status:0,info:"该教师已经注册了"});
			}else{
				connection.query('INSERT INTO teacher (id, teacherID, teacherName, jobTitle) VALUES (NULL, ?, ?, ?)',[teacherID,teacherName,jobTitle],function(err,results){
					console.log(results);
					if(results.affectedRows){
						connection.query('INSERT INTO users (id, username, password, userType) VALUES (NULL, ?, ?, ?)',[teacherID,'e10adc3949ba59abbe56e057f20f883e','teacher'],function(err,results){
							if(results.affectedRows){
								fun({status:1,info:"添加教师成功"});
							}else{
								fun({status:0,info:"用户表添加失败"});
							}
							if(err){
								throw err;
							}								
						})
					}else{
						fun({status:0,info:"教师添加失败"});
					}
					if(err){throw err; }
				});					
			}
		})
	},
	/**
	 * 删除单个教师
	 * @param  {[type]} teacherID 教师ID		
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	delTeacher:function(teacherID,fun){
		connection.query('DELETE FROM teacher WHERE teacherID=?',teacherID,function(err,results){
			if(results.affectedRows){
				connection.query('DELETE FROM users WHERE username=?',teacherID,function(err,results){
					if(results.affectedRows){
						fun({status:1,info:"删除成功"});
					}else{
						fun({status:0,info:"用户表删除失败"});
					}
				})
			}else{
				fun({status:0,info:"教师表删除失败"});
			}
			if(err){throw err;}
		})
	},
	/**
	 * 修改单个教师
	 * @param  {[type]} params 	  参数
	 * @param  {[type]} fun       回调
	 * @return {[type]}           [description]
	 */
	editTeacher:function(params,fun){
		var teacherID = params.teacherID;
		var teacherName = params.teacherName;	
		var jobTitle = params.jobTitle;		
		connection.query('UPDATE teacher SET teacherName=?,jobTitle=? WHERE teacherID = ?;',[teacherName,jobTitle,teacherID],function(err,results){
			if(err){throw err;}
			if(results.affectedRows){
				fun({status:1,info:"修改成功"});
			}else{
				fun({status:0,info:"修改失败"});
			}
		})
	}
	
}