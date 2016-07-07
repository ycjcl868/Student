$(function(){
	$(".addgrade-btn").bind("click",function(event){
		event.preventDefault();
		var oBtn = $(this);
		var courseID = $("#courseID").val();
		var gradeOobj = $(this).parent().siblings().find(".grade");
		var grade = gradeOobj.val();
		var studentID = $(this).parent().siblings("th").html();
		var params = {};
		params.courseID = courseID;
		params.grade = grade;
		params.studentID = studentID;
		$.post("/api/addGrade",params,function(result){
			if(result.status == 1){
				alert(result.info);
				gradeOobj.css({
					'background':'transparent',
					'border':'none'
				});
				gradeOobj.attr("readonly","true");
				oBtn.removeClass("addgrade-btn btn-primary").addClass("btn-danger").attr("disabled","disabled").html("已保存");
				return false;
			}else{
				alert(result.info);
			}
		})

	})
})