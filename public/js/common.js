$(function(){
	var oMenubtn =  $("#toggle-left");
	var slideCourse = $("#course-slide");

	//二级菜单
	slideCourse.bind('click',function(event){
		event.preventDefault();
		var oUl = $(this).siblings('ul');
		if(oUl.data("status") == 'hide'){
			oUl.slideDown();
			oUl.data("status","show");
			return false;
		}else{
			oUl.slideUp();
			oUl.data("status","hide");
			return false;
		}
	});

	// 手机按钮点击后菜单消失
	oMenubtn.bind('click',function(event){
		event.preventDefault();
		var targetEle = $(this).data("target");
		var status = $(this).data("status");
		if(status == 'show'){
			$(targetEle).css({
				"margin-left": "-240px"
			});
			$(".main-block").css({
				"margin-left":"0"
			})
			$(this).data("status","hide");
		}else{
			$(targetEle).css({
				"margin-left": "0"
			});
			$(".main-block").css({
				"margin-left":"240px"
			})
			$(this).data("status","show");			
		}
	})	

	//修改密码

	var oEditbtn = $("#edit-pass");
	oEditbtn.bind('click',function(event){
		event.preventDefault();
		var old_password = $("#old_password").val();
		var new_password_1 = $("#new_password_1").val();
		var new_password = $("#new_password").val();		
		if(old_password && new_password_1 && new_password){
			if(new_password_1 !== new_password){
				alert("两次密码不一致");
				return false;
			}else{
				var params = {};
				params.old_password = old_password;
				params.new_password = new_password;
				$.post('/api/editPass',params,function(result){
					if(result.status == 1){
						alert(result.info);
					}else{
						alert(result.info);
						$("form")[0].reset()
					}
					return;
				})

			}			
		}else{
			alert("请输入密码");
			return false;
		}

	})


})