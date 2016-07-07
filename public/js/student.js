$(function(){



	var arrGrade = [];
	arrGrade.push(eval('('+'{ x: '+1+', y: '+80+', label: "'+'计算机网络'+'",indexLabel:"'+'80'+'"}'+')'));
	arrGrade.push(eval('('+'{ x: '+2+', y: '+90+', label: "'+'概率论'+'",indexLabel:"'+'90'+'"}'+')'));
	arrGrade.push(eval('('+'{ x: '+3+', y: '+70+', label: "'+'C语言'+'",indexLabel:"'+'70'+'"}'+')'));
	
	try{
		//图表
		var chart = new CanvasJS.Chart("chartContainer",
		{
			animationEnabled: true,
			title:{
				text: "各科成绩柱状图"
			},
			data: [
			{
				type: "column", //change type to bar, line, area, pie, etc
				dataPoints: arrGrade
			}
			]
		});

		chart.render();		
	}catch(e){

	}

	//选课
	var choseBtn = $("#tbody").find("button");
	choseBtn.bind("click",function(event){
		event.preventDefault();
		var courseID = $(this).parent().siblings('.courseID').html();
		var oTr = $(this).parent().parent();
		$.post('/api/chooseCourse',{courseID:courseID},function(result){
			console.log(result);
			if(result.status == 1){
				layer.open({
				    content: result.info,
				    btn: ['确定'],
				    yes:function(){
				    	oTr.fadeOut();
				    	layer.closeAll();
				    }
				});

			}else{
				layer.open({
				    content: result.info,
				    btn: ['确定'],
				    yes:function(){
				    	layer.closeAll();
				    }
				});		
			}
		})
	})

})