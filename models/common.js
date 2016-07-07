//连接数据库
var mysql = require('mysql');
var config = require('../conf/db');
//md5加密
var crypto = require('crypto');


var connection = mysql.createConnection(config.database);
connection.connect();

module.exports = {

	/**
	 * 用户登陆
	 * @param  {[type]} username [用户名]
	 * @param  {[type]} password [密码]
	 * @param  {[type]} usercode [用户输入的验证码]
	 * @param  {[type]} authcode [服务器上的验证码]
	 * @param  {[type]} fun      [回调]
	 * status:  0为验证码错误，-1为用户名错误，-2为密码错误
	 */
	login: function(username,password,usercode,authcode,fun){
		var password =  crypto.createHash('md5').update(password).digest('hex');;
		connection.query('select * from users where username=?',[username],function(err,results){
			if(err) throw err;
			console.log('usercode:'+usercode);
			console.log('authcode:'+authcode);
			if(usercode !== authcode){
				fun({status:0,info:'验证码错误'});
			}else if(results[0] === undefined){
				fun({status:-1,info:'用户名错误'});
			}else{
				if(results[0].password === password){
					fun({status:1,info:'登陆成功',userID:results[0].username,userType:results[0].userType});
				}else{
					fun({status:-2,info:'密码错误'});
				}
			}
		})
	},

	/**
	 * 身份查询
	 * @param  {[type]} username 用户名
	 * @param  {[type]} fun      回调
	 * @return {[type]}          [description]
	 */
	userType: function(username,fun){
		connection.query('select userType from users where username = ?',username,function(err,results){
			if(err) throw err;
			fun(results[0].userType);
		})
	},



	/**
	 * 修改用户密码
	 * @param  {[type]} username     [用户名，用session拿取]
	 * @param  {[type]} old_password [原密码]
	 * @param  {[type]} new_password [新密码]
	 * @param  {[type]} fun          [回调]
	 */
	editPass: function(username,old_password,new_password,fun){
		var username = username;
		var old_password = crypto.createHash('md5').update(old_password).digest('hex');
		var new_password = crypto.createHash('md5').update(new_password).digest('hex');
		if(old_password !== new_password){
			connection.query('select password from users where username=?',[username],function(err,results){
				if(err) throw err;
				if(results[0] === undefined){
					fun({status:0,info:'用户名错误'});
				}else{
					// 旧密码正确
					if(results[0].password === old_password){
						connection.query('update users set password = ? where username = ?',[new_password,username],function(err,results){
							if(err) throw err;
							if(results.affectedRows){
								fun({status:1,info:'修改密码成功'});
							}else{
								fun({status:0,info:'修改密码失败'});
							}
						})					
					}else{
						fun({status:0,info:'原密码不正确'});
					}
				}
			});			
		}else{
			fun({status:0,info:"新旧密码不能一致"});
		}
	},
	/**
	 * 重置密码接口
	 * @param  {[type]} username 用户名
	 * @param  {[type]} password 密码
	 * @param  {[type]} fun      回调
	 * @return {[type]}          [description]
	 */
	resetPass: function(username,fun){
		var username = username;
		var password = 'e10adc3949ba59abbe56e057f20f883e';
		connection.query('select password from users where username=?',[username],function(err,results){
			if(err) throw err;
			if(results[0].password !== password){
				connection.query('update users set password = ? where username = ?',[password,username],function(err,results){
					if(err) throw err;
					if(results.affectedRows){
						fun({status:1,info:"重置密码成功"});
					}else{
						fun({status:0,info:"重置密码失败"});
					}
				})
			}else{
				fun({status:0,info:"不能重置密码，密码一致"});
			}
		})

	}



}