import jquery from '../jquery';
let navClick = {
    on: function() {
        $('.nav-menu').on('click', 'dt', function() {
            let oSelf = $(this);
            oSelf.find('.arrow').toggleClass('arrow-down');
            oSelf.siblings('dd').slideToggle();
            oSelf.addClass('cur').parents('dl').siblings().children('dd').slideUp();
            oSelf.parents('dl').siblings().children('dt').removeClass('cur').find('.arrow').removeClass('arrow-down');
        })
    }
}
navClick.on();

function barPercent(res,color,name){
	var data = res.data;
	var option = {
            backgroundColor: '#10254f',
            color: color,
            tooltip: {},
            grid: {
                left: '20',
                right: '40',
                bottom: '20',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#2b74b4'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#2b74b4'
                    }
                },
                axisLabel: {
                    show: false,
                    inside: true
                },
                splitLine: {
                	show: true,
                	lineStyle:{
                		color: ['#163766']
                	}
                },
                data: data.yAxis_data
            },
            series: [{
                name: name,
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'insideLeft',
                        formatter: '{b}'
                    }
                },
                data: data.series_data
            }]
        };
    return option;
}

function barVertical(res,color,yname){
	var data = res.data;
	var series_data = [];
	if (Object.prototype.toString.call(data.series_data) === '[object Object]') {
		var seriesKey = Object.keys(data.series_data);
		for(var i = 0; i<seriesKey.length;i++){
			var dataKey = {
	            name: data.legend_data[i],
	            type: 'bar',
	            label: {
	                normal: {
	                    show: true,
	                    color:'#fff',
	                    position: 'inside',
	                    formatter: '{c}'
	                }
	            },
	            data: data.series_data[seriesKey[i]]
	        };
	        series_data.push(dataKey);
		}
	}else if (Object.prototype.toString.call(data.series_data) === '[object Array]') {
		var dataKey = {
            name: data.legend_data[0],
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    color:'#fff',
                    position: 'inside',
                    formatter: '{c}'
                }
            },
            data: data.series_data
        };
        series_data.push(dataKey);
	}
    var option = {
        backgroundColor: '#10254f',
        color: color,
        tooltip: {
        	trigger: 'axis'
        },
        legend: {
            show: true,
            left: 'center',
            top: '20',
            textStyle: {
                color: '#2b74b4'
            },
            data: data.legend_data
        },
        grid: {
            left: '20',
            right: '40',
            bottom: '20',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#2b74b4'
                }
            },
            splitLine: {
                show: false
            },
            data: data.xAxis_data
        },
        yAxis: {
            type: 'value',
            name: yname,
            axisLine: {
                lineStyle: {
                    color: '#2b74b4'
                }
            },
            splitLine: {
                show: true,
                lineStyle:{
                    color: ['#163766']
                }
            }
        },
        series: series_data
    };
    return option
}

function lineShow(res,color,yname){
	var data = res.data;
	var series_data = [];
	if (Object.prototype.toString.call(data.series_data) === '[object Object]') {
		var seriesKey = Object.keys(data.series_data);
		for(var i = 0; i<seriesKey.length;i++){
			var dataKey = {
	            name: data.legend_data[i],
	            type: 'line',
	            areaStyle: {
                    normal: {
                    	color: color[i],
                    	opacity: 0.2
                    }
                },
	            data: data.series_data[seriesKey[i]]
	        };
	        series_data.push(dataKey);
		}
	}else if (Object.prototype.toString.call(data.series_data) === '[object Array]') {
		var dataKey = {
            name: data.legend_data[0],
            type: 'line',
            areaStyle: {
                normal: {
                	color: color[0]
                }
            },
            data: data.series_data
        };
        series_data.push(dataKey);
	}
    var option = {
        backgroundColor: '#10254f',
        color: color,
        tooltip: {
        	trigger: 'axis'
        },
        legend: {
            show: true,
            left: 'center',
            top: '20',
            textStyle: {
                color: '#2b74b4'
            },
            data: data.legend_data
        },
        grid: {
            left: '20',
            right: '40',
            bottom: '20',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#2b74b4'
                }
            },
            splitLine: {
                show: true,
                lineStyle:{
                    color: ['#163766']
                }
            },
            data: data.xAxis_data
        },
        yAxis: {
            type: 'value',
            name: yname,
            axisLine: {
                lineStyle: {
                    color: '#2b74b4'
                }
            },
            splitLine: {
                show: true,
                lineStyle:{
                    color: ['#163766']
                }
            }
        },
        series: series_data
    };
    return option
}

function pieShow(res,color,seriesname){
	var data = res.data;
	var option = {
		backgroundColor: '#10254f',
        color: color,
        tooltip: {
        	trigger: 'item',
        	formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            show: true,
            left: 'center',
            top: '20',
            textStyle: {
                color: '#2b74b4'
            },
            data: data.legend_data
        },
        series: {
        	name: seriesname,
        	type: 'pie',
        	radius: ['40%', '60%'],
        	center: ['50%', '50%'],
        	itemStyle: {
                label:{
                    normal: {
                        show: true,
                        formatter:function(params){
                            console.log(params);
                            return params.name + '\n'+ params.value + '(' + (params.percent-0).toFixed(0) + '%)'
                        }
                    }
                }, 
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: data.series_data
        }
	};
	return option
}

function radarShow(res,color,seriesname){
	var data = res.data;
	var option = {
		backgroundColor: '#10254f',
        color: color,
        tooltip: {
        	trigger: 'axis',
        },
        radar: [{
        	indicator: data.radar_data,
        	center: ['50%', '50%'],
        	// radius: 100
        }],
        series: [{
        	name: seriesname,
        	type: 'radar',
        	itemStyle: {
        		normal: {
        			areaStyle:{
        				type: 'default'
        			}
        		}
        	},
        	data: data.series_data
        }]
	};
	return option
}

window.barPercent = barPercent;
window.barVertical = barVertical;
window.lineShow = lineShow;
window.pieShow = pieShow;
window.radarShow = radarShow;