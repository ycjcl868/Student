$(function(){
	//重置密码
	$(".resetPass").bind("click",function(event){
		event.preventDefault();
		var userID = $(this).parent().siblings('th').html();
		layer.open({
		    title: '提示',
		    content: '确定要重置密码',
		    btn: ['要', '不要'],
		    yes: function(){
		    	$.post('/api/resetPass',{userID:userID},function(result){
		    		if(result.status == 1){
		    			layer.open({content:result.info});
		    			return;
		    		}else{
		    			layer.open({content:result.info});
		    		}
		    	})
		    	layer.closeAll();
		    },
		    no: function(){

		    	layer.closeAll();
		    }
		});
		return false;
	})

	

	//删除学生
	$(".Sdel").bind("click",function(event){
		event.preventDefault();
		var studentID = $(this).parent().siblings('th').html();
		layer.open({
		    title: '提示',
		    content: '确认要删除该学生信息',
		    btn: ['要', '不要'],
		    yes: function(){
		    	$.post('/api/del/student',{studentID:studentID},function(result){
		    		console.log(result);
		    		if(result.status == 1){
		    			layer.open({content:result.info});
		    			location.reload();
		    			return;
		    		}else{
		    			layer.open({content:result.info});
		    		}
		    	})
		    	layer.closeAll();
		    },
		    no: function(){

		    	layer.closeAll();
		    }
		});
		return false;
	})

	//删除教师
	$(".Tdel").bind("click",function(event){
		event.preventDefault();
		var teacherID = $(this).parent().siblings('th').html();
		layer.open({
		    title: '提示',
		    content: '确认要删除该教师信息',
		    btn: ['要', '不要'],
		    yes: function(){
		    	$.post('/api/del/teacher',{teacherID:teacherID},function(result){
		    		console.log(result);
		    		if(result.status == 1){
		    			layer.open({content:result.info});
		    			location.reload();
		    			return;
		    		}else{
		    			layer.open({content:result.info});
		    		}
		    	})
		    	layer.closeAll();
		    },
		    no: function(){

		    	layer.closeAll();
		    }
		});
		return false;
	})

	//添加学生
	$("#add-student").bind('click',function(event){
		event.preventDefault();
		var params = {};

		params.studentID = $("#studentID").val();
		params.studentName = $("#studentName").val();
		params.birthday = $("#birthday").val();
		params.major = $("#major").val();

		$.post('/api/add/student',params,function(result){
			if(result.status == 1){
				layer.open({content:result.info});
				location.reload();
				return;
			}else{
				layer.open({content:result.info});
				return;
			};
		})
	})	

	//添加学生
	$("#add-teacher").bind('click',function(event){
		event.preventDefault();
		var params = {};

		params.teacherID = $("#teacherID").val();
		params.teacherName = $("#teacherName").val();
		params.jobTitle = $("#jobTitle").val();

		$.post('/api/add/teacher',params,function(result){
			if(result.status == 1){
				layer.open({content:result.info});
				location.reload();
				return;
			}else{
				layer.open({content:result.info});
				return;
			};
		})
	})

	//修改学生
	$(".Ssave").bind("click",function(event){
		event.preventDefault();
		var params = {};
		params.id = $(this).parent().siblings("th").html()
		params.studentName = $(this).parent().siblings("td").eq(0).children("input").val();
		$.post('/api/edit/student',params,function(result){
			if(result.status == 1){
				layer.open({content:result.info});
				location.reload();
				return;
			}else{
				layer.open({content:result.info});
				return;
			}
		})
	})	

	//修改教师
	$(".Tsave").bind("click",function(event){
		event.preventDefault();
		var params = {};
		params.id = $(this).parent().siblings("th").html()
		params.teacherName = $(this).parent().siblings("td").eq(0).children("input").val();
		params.jobTitle = $(this).parent().siblings("td").eq(1).children("input").val();
		console.log(params);
		$.post('/api/edit/teacher',params,function(result){
			if(result.status == 1){
				layer.open({content:result.info});
				location.reload();
				return;
			}else{
				layer.open({content:result.info});
				return;
			}
		})
	})
})