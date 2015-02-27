/*****************************************************
*													 *
*	Author: Dinesh Vadivel							 *
*	Plugin: jstimelineBubble.1.0.0.js				 *
*	Date:	27-02-2015								 *
*													 *
*													 *
*													 *
*													 *
*													 *
*													 *
*****************************************************/

(function($){
   var JSTimelineBubble = function(element, options)
   {
       var elem = $(element);
       var obj = this;
       var rand;
       var HeatData=[];
       var ObjSeries={};
	   var byweek={};
	   var bymonth={};
       // Merge options with defaults
       var defaults={
       	  title		: {
       	  	show	:true,
       	  	text 	:"Hourly vs Weekly"
       	  },
       	  legend		: {
       	  		show : true
       	  },
       	  xAxis		: {
       	  	type: "DateTime",
       	  	label: {
       	  		show:true,
       	  		text:"Weekly"
       	  	},
       	  	defaultView: "Day",
       	  	scroll: false
       	  },
          yAxis		: {
       	  	type: "Time",
       	  	label: {
       	  		show:true,
       	  		text:"Hourly"
       	  	},
       	  	defaultView: null,
       	  	scroll: false
       	  },
       	  zAxis		:{
       	  	 type		: "Integer",
       	  	 popup		:{
       	  	 	show 		: true,
       	  	 	Text	: "Transient Count"
			 },
			 colorRange	:{

			 	"0-0":"#000000",
			 	"1-20":"#2ea300",
			 	"21-40":"#90ff00",
			 	"41-60":"#fff600",
			 	"61-80":"#ff8c00",
			 	"81-100":"#ff0000 "
			 }
       	  },
       	  colorRange:{
       	  	start:[]
       	  },
       	  viewBy	:{
       	  	show 	: true,
       	  	items	: ['Day','Weak','Month','Year']
       	  },
          width		: "auto",
          height	: "auto",
          paging	: {
          		type 	: "scroll",
          		itemCount 	: 0,

          },
          bubbleSeries:{}	

          
       };
       var settings = $.extend(defaults, options || {});
       
       var matched, browser;
       jQuery.uaMatch = function( ua ) {
	   ua = ua.toLowerCase();
	   var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

		    return {
		        browser: match[ 1 ] || "",
		        version: match[ 2 ] || "0"
		    };
		};

		matched = jQuery.uaMatch( navigator.userAgent );
		browser = {};
		
		if ( matched.browser ) {
		    browser[ matched.browser ] = true;
		    browser.version = matched.version;
		}
		
		// Chrome is Webkit, but Webkit is also Safari.
		if ( browser.chrome ) {
		    browser.webkit = true;
		} else if ( browser.webkit ) {
		    browser.safari = true;
		}
		
		jQuery.browser = browser;
		rand=Math.floor((Math.random() * 999999999) + 9999);
       	// GenerateUI(elem, settings, matched.browser);
       	generate();
      
       
       
       // Public method
       this.addhighlight = function()
       {
           
       };

 	   function generate () {
 	   	$(elem).empty();
 	   	ObjSeries.zSeries=[];
 	   	ObjSeries.z1Series=[];
 	   	ObjSeries.xSeries=[];
 	   	ObjSeries.ySeries=[];
 	   	ObjSeries.scaleSeries={};
 	   	// if($.isArray(settings.bubbleSeries))
 	   	{
	 	   	$.each(settings.bubbleSeries,function(key,value){
	 	   			ObjSeries.zSeries.push(value.z);
	 	   			ObjSeries.z1Series.push(value.z1);
	 	   			ObjSeries.xSeries.push(value.x);
	 	   			ObjSeries.ySeries.push(value.y);
	 	   			
	 	   	});

			var result = groupBy(settings.bubbleSeries, function(item) {
					    return [item.x];
			});
			bubbleCol=result.length;
			bubbletRow=(settings.bubbleSeries.length/result.length);
 	   	}
 	   	
 	   	ObjSeries.xmin =Math.min.apply(Math, ObjSeries.xSeries)
 	   	ObjSeries.xmax =Math.max.apply(Math,ObjSeries.xSeries)
 	   	ObjSeries.zmin =Math.min.apply(Math, ObjSeries.zSeries)
 	   	ObjSeries.zmax =Math.max.apply(Math,ObjSeries.zSeries)
 	   	ObjSeries.z1min=Math.min.apply(Math, ObjSeries.z1Series)
 	   	ObjSeries.z1max=Math.max.apply(Math,ObjSeries.z1Series)
 	   	var graphcss='height: 90%; width: 100%;';
 	   var	gradi="background: #4c4c4c; background: -moz-linear-gradient(left,  #4c4c4c 0%, #1c1c1c 22%, #131313 100%); background: -webkit-gradient(linear, left top, right top, color-stop(0%,#4c4c4c), color-stop(22%,#1c1c1c), color-stop(100%,#131313)); background: -webkit-linear-gradient(left,  #4c4c4c 0%,#1c1c1c 22%,#131313 100%); background: -o-linear-gradient(left,  #4c4c4c 0%,#1c1c1c 22%,#131313 100%); background: -ms-linear-gradient(left,  #4c4c4c 0%,#1c1c1c 22%,#131313 100%); background: linear-gradient(to right,  #4c4c4c 0%,#1c1c1c 22%,#131313 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4c4c4c', endColorstr='#131313',GradientType=1 ); ";

	$(elem).append('<div class="timeLineBubble" id="timeLineBubble-'+rand+'" style="'+gradi+'"></div>');
 	   	if(settings.title.show)
 	   		$('.timeLineBubble').append('<div class="timeLineBubbleTitle" id="timeLineBubbleTitle" style="font-size: 18px ;text-align: center;padding: 2px;">'+settings.title.text+'</div>');
 	   	ObjSeries.axisX=settings.xAxis.type;
 	   	ObjSeries.axisY=settings.yAxis.type;
 	   	var width=$(elem).width();
 	   	scalesize=width*.1
 	   	console.log(ObjSeries.xmin+'-'+ObjSeries.xmax)
 	   	$('.timeLineBubble').append('<div class="bubbleScaleColumn" id="bubbleScaleColumn" style=" width:100%; height:auto; display:inline-block; "></div>');
 		for(i=ObjSeries.xmin; i<=ObjSeries.xmax; i+= 3600000)
 		{
 			
 			year=new Date(i).getFullYear()
			month=new Date(i).getMonth()
			day=new Date(i).getDate()
			date=new Date(year,month,day,0,0,0).getTime();
			if(!(date in ObjSeries.scaleSeries))
			{
				ObjSeries.scaleSeries[date]={}
			}
			hour=new Date(i).getHours()
			ObjSeries.scaleSeries[date][hour]=[]
			
 		}
 		$.each(settings.bubbleSeries,function(key,value){
 			// console.log(value.x)
 			year=new Date(value.x).getFullYear()
			month=new Date(value.x).getMonth()
			day=new Date(value.x).getDate()
			date=new Date(year,month,day,0,0,0).getTime();
			hour=new Date(value.x).getHours()
			ObjSeries.scaleSeries[date][hour].push(value)
 		})
 		circleCSS='-moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;';
 		$.each(Object.keys(ObjSeries.scaleSeries).sort().reverse(),function(key,value){
 			// console.log(ObjSeries.scaleSeries[parseInt(value)])
 			date=parseInt(value)
 			datecss="height:auto; width:100%; display: inline-block;"
 			$('#bubbleScaleColumn').append('<div class="date" id="dataArea_'+value+'" style="font-size: 12px; font-weight: 200; '+datecss+'"><div class="scaleArea" style="border-right: 1px solid #fff; text-align: right; padding-right: 5px; float:left; width: 7%;"><div class="dateField" style="height:25px;">'+timeConverter(date)+'</div><div class="hour" id="hourArea" style="height:auto;"></div></div><div class="plotArea" id="plotArea" style="float:right; width: 92%; padding-top:20px;"></div></div>')
 			$.each(ObjSeries.scaleSeries[parseInt(value)],function(kl,v){
 				
 				$('#dataArea_'+value+' #hourArea').append('<div class="hourField" style="height:50px; margin-bottom:10px;">'+kl+':00</div>')
 				$('#dataArea_'+value+' #plotArea').append('<div class="hourdata" id="hourdata_'+kl+'" style="height:50px; width100%;  margin-bottom:10px; border-bottom: 1px solid #555;"></div>')
 				$.each(v,function(l,m){
 					perCT=parseInt(ObjSeries.zmax)/parseInt(m.z)
 					size=40*perCT;
 					colorPer=parseInt(ObjSeries.z1max)/parseInt(m.z1)
 					clr=getGreenToRed(colorPer*10)
 					$('#dataArea_'+value+' #hourdata_'+kl).append('<div class="bubble" style=" width:'+size+'px; height:'+size+'px; background:'+clr+'; '+circleCSS+' float:left; margin-right:20px; padding:5px; color:#fff;">'+m.z+'</div>')
 				})
 			})
 		})

 		// $()

 	//    	if(ObjSeries.axisX=='DateTime'||ObjSeries.axisY=='DateTime')
 	//    	{
 	//    		ObjSeries.showView=true;
 	//    		if(ObjSeries.axisX=='DateTime')
 	//    			ObjSeries.type='col'
 	//    		else
 	//    			ObjSeries.type='row'
 	//    	}
 	//    	if(settings.viewBy.show&&ObjSeries.showView)
 	//    	{
	 // 	    var viewByString='';
	 // 	   	$.each(settings.viewBy.items,function(key,value){
	 // 	   		viewByString+=' <a href="#" id="heatmap-'+value+'" class="viewby" style="font-size:11px; text-decoration: none; color:#000">'+value+'</a> '
	 // 	   	})
	 // 	   	viewByString = viewByString.substring(0, viewByString.length - 1)
	 // 	   	if(ObjSeries.showView)
	 // 	   		$('.HeatMap').append('<div class="HeatMapviewby" id="HeatMapviewby" style="font-size: 18px ;text-align: center;padding: 2px; border:1px dotted #ddd; border-radius:4px; display:inline-block;position: relative;z-index: 2;top: -26; padding:2px 5px;">'+viewByString+'</div>');
	 // 	   	$(".HeatMapviewby a").hover(function(){
		// 	  $(this).css("color","#888");
		// 	  },function(){
		// 	  $(this).css("color","#000");
		// 	});
		// 	graphcss+='position: relative;z-index: 2;top: -15px;';
 	//    }
  //       width=$(elem).width();
        
  //       var tempObj=[];
  //       var tempData=null;
  //       $('.HeatMap').append('<div class="HeatMaparea" id="HeatMaparea" style="'+graphcss+'"></div>');
  //       if($.isArray(settings.bubbleSeries))
 	//    	{
		// 	if(ObjSeries.type=='col')
		// 	{
		// 		percent=90/heatCol;
				
		// 		Titlehtml='<div class="HeatColumn" style="float:left; max-width:10%; width:auto;">';
		// 		Titlehtml+='<div style="test" style="height:20px;"> &nbsp;</div>';

		// 		sz=$('#HeatMaparea').height();
		// 		if(((heatRow+1)*14)<=sz)
		// 		{
		// 			skipvalue=1;
		// 			heightPercent=14;
		// 		}
		// 		else
		// 		{
		// 			heightPercent=(sz/(heatRow+1));
		// 			console.log(heightPercent)
		// 			skipvalue=Math.ceil(heatRow/heightPercent)
		// 		}

		// 		$.each(result[0],function(key,value){
		// 			if(value.y%skipvalue==0||value.y==heatRow)
		// 				dvalue=value.y
		// 			else
		// 				dvalue=''
		// 			Titlehtml+='<div style="text-align:right;  height:'+heightPercent+'px; text-align:center; vertical-align: middle; ">'+dvalue+'</div>';
		// 		})
		// 		Titlehtml+='</div>'
		// 		$('.HeatMap #HeatMaparea').append(Titlehtml)
		// 		paddcss=' padding:10px; line-height: 2rem;'
		// 		cz=$('#HeatMaparea').width();
		// 		if(((heatCol+1)*80)<=cz)
		// 		{
		// 			skipcvalue=1;
		// 			wdper=((cz-20)/heatCol)
		// 			widthPercent=wdper;
		// 		}
		// 		else
		// 		{
		// 			widthPercent=(cz/(heatCol))*3;
		// 			wdper=(cz-20)/heatCol;
					
		// 			if(widthPercent<80)
		// 				skipcvalue=Math.ceil(widthPercent/heatCol)
		// 			else
		// 				skipcvalue=Math.ceil(heatCol/widthPercent)*Math.ceil(widthPercent/wdper)
		// 		}
		// 		if(cz<300)
		// 		{
		// 			addOverflow='max-height:18px; overflow-y:hidden;'
		// 		}
		// 		else
		// 		{
		// 			addOverflow=''
		// 		}
		// 		skCnt=0;
		// 		$.each(result,function(key,value){
		// 			if(key%skipcvalue==0||key==heatCol)
		// 			{
		// 				dateValue=timeConverter(parseInt(value[0].x))
		// 				dss=widthPercent;
		// 			}
		// 			else{
		// 				dateValue='&nbsp;';
		// 				dss=wdper
		// 			}
		// 			html='<div class="HeatColumn" style="float:left; width:'+wdper+'px;">';
		// 			// html+='<div style="text-align:center; ">'+dateValue+'</div>'
		// 			html+='<div style="text-align:center; width:'+dss+'px; position:relative; z-index:9; height:20px;" '+addOverflow+'">'+dateValue+'</div>'
		// 			$.each(value,function(key1,value1){
		// 				$.each(settings.zAxis.colorRange,function(ck,cv){
		// 					part=ck.split('-')
		// 					if(value1.z<=parseInt(part[1])&&value1.z>=parseInt(part[0]))
		// 					{
		// 						color=cv;
		// 					}
		// 					else
		// 					{
		// 						color='#550000'
		// 					}
		// 				});
						
		// 				html+='<div class="Heatcells" style="background:'+color+';   height:'+heightPercent+'px; text-align:center; vertical-align: middle;  " data-z='+value1.z+' data-x='+value1.x+' data-y='+value1.y+'></div>'; //
		// 			});
		// 			html+='</div>'
		// 			$('.HeatMap #HeatMaparea').append(html)
					

		// 		})
		// 		if(settings.legend.show)
		// 		{
		// 			$(".HeatColumn .Heatcells").hover(function(){
		// 				 zvalue=$(this).data('z');
		// 				 xvalue=timeConverter($(this).data('x'));	
		// 				 // timeConverter(parseInt(value[0].x))
		// 				 yvalue=$(this).data('y');				
		// 				 $(this).append('<div class="HeatLegend" style="width:120px; height:15px; font-size:12px; font-weight:400; background:rgba(255,255,255,.9); padding:5px; position: relative; left:25px; border:1px dotted #ddd; transition:2s; line-height:1rem; border-radius:3px;">'+xvalue+' - '+yvalue+' : '+zvalue+'</div>');
		// 				 },function(){
		// 				 $(this).empty();
		// 			});
		// 		}
		// 	}
		// }
		// else
		// {
		// 	if(ObjSeries.type=='col')
		// 	{
		// 		percent=90/heatCol;
				
		// 		Titlehtml='<div class="HeatColumn" style="float:left; max-width:10%; width:auto;">';
		// 		Titlehtml+='<div style="test" style="height:20px;"> &nbsp;</div>';
				
		// 		sz=$('#HeatMaparea').height();
		// 		if(((heatRow+1)*14)<=sz)
		// 		{
		// 			skipvalue=1;
		// 			heightPercent=14;
		// 		}
		// 		else
		// 		{
		// 			heightPercent=(sz/(heatRow+1));
		// 			console.log(heightPercent)
		// 			skipvalue=Math.ceil(heatRow/heightPercent)
		// 		}
		// 		$.each(Object.keys(settings.bubbleSeries[firstItem].total_events),function(key,value){
		// 			if(key%skipvalue==0||key==heatRow)
		// 				dvalue=value
		// 			else
		// 				dvalue=''
		// 				Titlehtml+='<div style="text-align:right;  height:'+heightPercent+'px; text-align:center; vertical-align: middle; ">'+dvalue+'</div>';
					
		// 		})
				
		// 		Titlehtml+='</div>'
		// 		$('.HeatMap #HeatMaparea').append(Titlehtml)
		// 		paddcss=' padding:10px; line-height: 2rem;'

		// 		cz=$('#HeatMaparea').width();
		// 		if(((heatCol+1)*80)<=cz)
		// 		{
		// 			skipcvalue=1;
		// 			widthPercent=50;
		// 		}
		// 		else
		// 		{
		// 			widthPercent=(cz/(heatCol))*10;
		// 			wdper=cz/(heatCol+3)
		// 			skipcvalue=Math.ceil(heatCol/widthPercent)*12
		// 		}
		// 		if(cz<300)
		// 		{
		// 			addOverflow='max-height:18px; overflow-y:hidden;'
		// 		}
		// 		else
		// 		{
		// 			addOverflow=''
		// 		}
		// 		skCnt=0;
				
		// 		$.each(settings.bubbleSeries,function(key,value){
					
		// 			if(skCnt%skipcvalue==0||key==heatRow)
		// 			{
		// 				dateValue=timeConverter(parseInt(key))
		// 				dss=widthPercent;
		// 			}
		// 			else{
		// 				dateValue='&nbsp;';
		// 				dss=wdper
		// 			}
		// 			html='<div class="HeatColumn" style="float:left; width:'+wdper+'px; height:100%;">';
		// 			html+='<div style="text-align:center; width:'+dss+'px; position:relative; z-index:9; height:20px;" '+addOverflow+'">'+dateValue+'</div>'
		// 			$.each(value.total_events,function(key1,value1){
		// 				$.each(settings.zAxis.colorRange,function(ck,cv){
		// 					part=ck.split('-')
		// 					if(value1<=parseInt(part[1])&&value1>=parseInt(part[0]))
		// 					{
		// 						color=cv;
		// 					}
		// 					else
		// 					{
		// 						color='#550000'
		// 					}
		// 				});
		// 				// normalized = (value1-ObjSeries.zmin)/(ObjSeries.zmax-ObjSeries.zmin)*100
		// 				// // console.log(normalized)
		// 				// var h= Math.floor((100 - normalized) * 120 / 100);
		// 		  //       var s = Math.abs(normalized - 50)/50;
		// 		  //       var v = 1;
		// 		  //       color=hsv2rgb(h,s,v)
		// 		  //       R = Math.floor((255 * normalized) / 100)
		// 				// G = Math.floor((255 * (100 - normalized)) / 100 )
		// 				// B = 0
		// 				//color='rgba('+R+','+G+','+B+',.8)';
		// 				 html+='<div class="Heatcells" style="background:'+color+'; width:'+wdper+'px;  height:'+heightPercent+'px; text-align:center; vertical-align: middle;   " data-z='+value1+' data-y='+key1+' data-x='+key+'></div>'; //position: absolute; z-index:8;
		// 			});
					
		// 			skCnt++;
		// 			html+='</div>';
		// 			$('.HeatMap #HeatMaparea').append(html)
		// 		})
		// 		if(settings.legend.show)
		// 		{
		// 			$(".HeatColumn .Heatcells").hover(function(){
		// 				 zvalue=$(this).data('z');
		// 				 xvalue=timeConverter($(this).data('x'));	
		// 				 // timeConverter(parseInt(value[0].x))
		// 				 yvalue=$(this).data('y');				
		// 				 $(this).append('<div class="HeatLegend" style="width:120px; height:15px; font-size:12px; font-weight:400; background:rgba(255,255,255,.9); padding:5px; position: relative; left:25px; border:1px dotted #ddd; transition:2s; line-height:1rem; border-radius:3px;">'+xvalue+'-'+yvalue+' : '+zvalue+'</div>');
		// 				 },function(){
		// 				 $(this).empty();
		// 			});
		// 		}
				
		// 	}
		// }

			
       }

		function getGreenToRed(percent){
			console.log(percent)
            r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
            g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
            return 'rgb('+r+','+g+',0)';
        }
       	function getWeekNumber(d) {
		    // Copy date so don't modify original
		    d = new Date(+d);
		    d.setHours(0,0,0);
		    // Set to nearest Thursday: current date + 4 - current day number
		    // Make Sunday's day number 7
		    d.setDate(d.getDate() + 4 - (d.getDay()||7));
		    // Get first day of year
		    var yearStart = new Date(d.getFullYear(),0,1);
		    // Calculate full weeks to nearest Thursday
		    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
		    // Return array of year and week number
		    return [d.getFullYear(), weekNo];
		}
		function timeConverter(UNIX_timestamp){
		  var a = new Date(UNIX_timestamp);
		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var sec = a.getSeconds();
		  if(hour<10)
		  {
		  	hour='0'+hour;
		  }
		  if(min<10)
		  {
		  	min='0'+min;
		  }
		  if(sec<10)
		  {
		  	sec='0'+sec;
		  }
		  var time = date + '-' + month + '-' + year + ' ';// + hour + ':' + min + ':' + sec ;
		  return time;
		}
       function hexAverage() {
	    var args = Array.prototype.slice.call(arguments);
	    return args.reduce(function (previousValue, currentValue) {
	        return currentValue
	            .replace(/^#/, '')
	            .match(/.{2}/g)
	            .map(function (value, index) {
	                return previousValue[index] + parseInt(value, 16);
	            });
	    }, [0, 0, 0])
	    .reduce(function (previousValue, currentValue) {
	        return previousValue + Math.floor(currentValue / args.length).toString(16);
	    }, '#');
	}
       function hsv2rgb(h, s, v) {
		  // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
		  var rgb, i, data = [];
		  if (s === 0) {
		    rgb = [v,v,v];
		  } else {
		    h = h / 60;
		    i = Math.floor(h);
		    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
		    switch(i) {
		      case 0:
		        rgb = [v, data[2], data[0]];
		        break;
		      case 1:
		        rgb = [data[1], v, data[0]];
		        break;
		      case 2:
		        rgb = [data[0], v, data[2]];
		        break;
		      case 3:
		        rgb = [data[0], data[1], v];
		        break;
		      case 4:
		        rgb = [data[2], data[0], v];
		        break;
		      default:
		        rgb = [v, data[0], data[1]];
		        break;
		    }
		  }
		  return '#' + rgb.map(function(x){
		    return ("0" + Math.round(x*255).toString(16)).slice(-2);
		  }).join('');
		};
       function arrayFromObject(obj) {
		    var arr = [];
		    for (var i in obj) {
		        arr.push(obj[i]);
		    }
		    return arr;
		}

		function groupBy(list, fn) {
		    var groups = {};
		    for (var i = 0; i < list.length; i++) {
		        var group = JSON.stringify(fn(list[i]));
		        if (group in groups) {
		            groups[group].push(list[i]);
		        } else {
		            groups[group] = [list[i]];
		        }
		    }
		    return arrayFromObject(groups);
		}
		$.fn.extend({
		  
		  getData: function() {
		  	return settings; 
		  },
		  updateData:function(newSeries)
		  {
		  		settings = $.extend({},defaults, newSeries );
		  		console.log(settings)
		  		// settings.heatSeries=newSeries.data

		   		generate();
		  }
		});
       
   };

   
  
  
   $.fn.jsTimelinebubble = function(options)
   {
       return this.each(function()
       {
           var element = $(this);
          
           // Return early if this element already has a plugin instance
           if (element.data('jsTimelinebubble')) return;

           // pass options to plugin constructor
           var jsTimelinebubble = new JSTimelineBubble(this, options);
          
           // Store plugin object in this element's data
           element.data('jsTimelinebubble', jsTimelinebubble);
       });
   };
})(jQuery);