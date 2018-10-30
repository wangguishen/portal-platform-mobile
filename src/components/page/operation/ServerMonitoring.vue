<template>
  <div id="page_box">
    <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
  	<div style="padding: 10px">
  	  <label class="text-muted">性能监控(%)</label>
	  	<hr>
  	  </div>
  	  <div id="myChart1" style="width: 100%;height:300px;"></div>
  	  <div>
  	    <group class="group_cell" title="进程列表">
  	    	<template v-for="list in proList">
  	    		<cell 
  	    		  :title="list.name"
  	    		  :border-intent="false"
  	    		  :arrow-direction="list.isShow ? 'down' : 'right'"
  	    		  @click.native="detail(list, proList)"
  	    		  is-link>
  	    		</cell>

  	    		<template v-if="list.isShow">
  	    			<cell-form-preview :border-intent="false" :list="list.children"></cell-form-preview>
  	    		</template>
  	    	</template>
  	    </group>
  	    <group class="group_cell" title="告警列表">
  	      <template>
  	    		<cell title="告警数"
  	    		  :border-intent="false">
  	    		  {{successCount}}
  	    		</cell>
  	    		<cell title="正常数"
  	    		  :border-intent="false">
  	    		  {{failCount}}
  	    		</cell>
  	    	</template>
  	    </group>
  	  </div>
  </div>
</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  //引入饼图组件
  require('echarts/lib/chart/pie')
  //引入图例组件
  require('echarts/lib/component/legend')
  require('echarts/lib/component/dataZoom')
  //引入拆线图组件
  require('echarts/lib/chart/line')
  //引入仪表盘组件
  require('echarts/lib/chart/gauge')

  import VHeader from '../../common/Header'
  import { Cell, Group, CellFormPreview } from 'vux'

  export default {
  	components: {
  		VHeader,
  		Cell,
  		Group,
  		CellFormPreview
  	},
    data() {
      return {
      	headObj: {
            title: '',
            isBack: true,
        },
        rightObj: {
        	isMore: false,
        	title: "完成",
        },
      	activeName2: 'first',
      	lastTime: [], /*时间*/
		    cpuEmploy: [], /*CPU使用率*/
	      applicationEmploy: [], /*内存使用率(应用内存使用率)*/
	      rootDirectoryEmploy:[], /*根(磁)盘使用率*/
	      swapEmploy:[], /*swap使用率*/
	      successCount: 0, /*成功的进程数*/
	      failCount: 0, /*失败的进程数*/
	      cpuEmployMax: 0, /*CPU使用率Y轴显示最大值*/
	      rootDirectoryEmployMax: 0, /*根盘使用率Y轴显示最大值*/
	      mac: '',  /*服务器地址*/
        myChart1: null,
        loading: true,
        interval: null,
        showContent001: false,
        proList: [], //进程列表
      }
    },
    watch: {
      '$route': {
        handler: function(val,oldval) {
        	let self = this
        	self.loading = true
          self.GetRequest(val.fullPath)
        },
        deep:true//对象内部的属性监听，也叫深度监听  
      }
    },
    mounted() {
    	Date.prototype.format = function(fmt) { 
		    var o = { 
		        "M+" : this.getMonth()+1,                 //月份 
		        "d+" : this.getDate(),                    //日 
		        "h+" : this.getHours(),                   //小时 
		        "m+" : this.getMinutes(),                 //分 
		        "s+" : this.getSeconds(),                 //秒 
		        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
		        "S"  : this.getMilliseconds()             //毫秒 
		    }; 
		    if(/(y+)/.test(fmt)) {
		            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		    }
		     for(var k in o) {
		        if(new RegExp("("+ k +")").test(fmt)){
		             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		         }
		     }
		    return fmt; 
			}

    	let self = this
    	self.headObj.title = localStorage.getItem("s_title")
    	self.myChart1 = echarts.init(document.getElementById('myChart1'))
    	Array.prototype.max = function() { 
		    return Math.max.apply({},this) 
	    }
    	let url = self.$route.fullPath
    	self.GetRequest(url)

    	self.interval = setInterval(() => {
    		self.getData()
    	}, 300000)
    },
    methods: {
    	handleClick(tab, event) {
        console.log(tab, event)
      },
    	getData() {
    		let self = this
    		self.lastTime = []
	  	  self.cpuEmploy = []
	  	  self.applicationEmploy = [],
	  	  self.rootDirectoryEmploy = [],
	  	  self.swapEmploy = [],
	  	  self.successCount = 0,
	  	  self.failCount = 0,
	  	  self.proList = [],
	  	  self.cpuEmployMax = 0,
	  	  self.rootDirectoryEmployMax = 0
	  	  let todayDate = new Date().format("yyyy-MM-dd")
	  	  console.log(self.mac, todayDate)
	  	  self.$axios({
	  	    url: '/basic-platform/getVMDayInfo?mac=' + self.mac + '&day=' + todayDate,
	  	    methods: 'post',
	  	    responseType: 'json'
	  	  })
	  	  .then(function(res) {
	  	    if(res.status === 200) {
	  	      let resData = res.data.data
	  	      if(resData.length === 0) { return }
  	        let list = resData[resData.length-1].process
  	      	list.forEach(function(item, index) {

  	      		let str = ''
  	      		if(item.status === 'success') {
  	      			str = "<span class='iconfont' style='color:rgb(43, 231, 79);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>正常"
  	      		} else if(item.status === 'failed') {
  	      			str = "<span class='iconfont' style='color:rgb(245, 13, 41);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>异常"
  	      		}

  	      		let arr = [{
  	      			label: '端口号',
  	      			value: item.info
  	      		}, {
  	      			label: '状态',
  	      			value: str
  	      		}]

  	      		self.$set(item,'isShow',false)
  	      		self.$set(item,'children',arr)
							self.proList.push(item)
  	      	})


	  	      for(let i = 0; i < resData.length; i++) {
	  	      	if(i < 150) {
	  	      	  self.successCount = resData[i].successCount
	  	      	  self.failCount = resData[i].failCount
		  	        self.cpuEmploy.unshift(resData[i].cpuEmploy)
		  	        self.rootDirectoryEmploy.unshift(resData[i].rootDirectoryEmploy.substr(0, 2))
		  	        self.applicationEmploy.unshift(resData[i].applicationEmploy.substr(0, 5))
		  	        self.swapEmploy.unshift(resData[i].swapEmploy.substr(0, 5))
		  	        let formatLastTime = resData[i].lastTime
		  	        formatLastTime = formatLastTime.substr(formatLastTime.length - 5, 5)
		  	        self.lastTime.unshift(formatLastTime)
		  	      }
	  	      }

	  	      self.$nextTick(() => {
	  	      	self.myChart1Init()
	  	      })
	  	    }
	  	  })
	  	  .catch(function(res) {
	  	    console.log("error", res)
	  	  })
    	},
    	myChart1Init() {
    		let self = this
    		console.log("go myChart1Init method", self.myChart1)
    		self.cpuEmployMax = self.cpuEmploy.max()
   		  self.cpuEmployMax = self.cpuEmployMax % 10 === 0 ? self.cpuEmployMax += 10 : self.cpuEmployMax
   		  self.cpuEmployMax = self.cpuEmployMax + (100 - self.cpuEmployMax) % 10
    		let option = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
			            animation: false
			          },
			          formatter: '{b1} <br/> {a0}: {c0}% <br/> {a1}: {c1}% <br/> {a2}: {c2}%' /// 这里是鼠标移上去的显示数据
				    },
				    legend: {
				        data:['CPU使用率','内存使用率','swap使用率']
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    dataZoom: {
				    	show: true,
				    	realtime: false,
				    	height: 20,
				    	y: 36,
				    	start: 95,
				    	end: 100,
				    	handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        			handleSize: '120%',
        			handleColor: '#106eae',
        			zoomLock: true,
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: self.lastTime,
				        splitLine: {
			            show: false
			        }
					  },
				    yAxis: {
				        type: 'value',
		        	  min: 0,
		        	  splitLine: {
			            show: false
			          }
				    },
				    series: [
				        {
				            name:'CPU使用率',
				            type:'line',
				            stack: 'CPU使用率',
				            data: self.cpuEmploy,
				            itemStyle: {
				            	normal: {
				            		lineStyle: {
				            			color: '#ff3300',
				            			type: 'solid',
				            			opacity: '5'
				            		}
				            	}
				            }
				        },
				        {
				            name:'内存使用率',
				            type:'line',
				            stack: '内存使用率',
				            data: self.applicationEmploy,
				            itemStyle: {
				            	normal: {
				            		lineStyle: {
				            			color: '#98fa04',
				            			type: 'solid',
				            			opacity: '0.5'
				            		}
				            	}
				            }
				        },
				        {
				            name:'swap使用率',
				            type:'line',
				            stack: 'swap使用率',
				            data: self.swapEmploy,
				            itemStyle: {
				            	normal: {
				            		lineStyle: {
				            			color: '#04fa15',
				            			type: 'solid',
				            			opacity: '0.5'
				            		}
				            	}
				            }
				        }
				    ]
				};
				self.myChart1.setOption(option)
				self.loading = false
    	},
    	GetRequest : function(url){//解析url传递的参数
		    let self = this
	      if (url.indexOf("?") != -1) {
	        self.mac = decodeURIComponent(url.substr(url.indexOf('=') + 1, url.length))
	      }
	      self.getData()
	    },
	    backWay(data){
			  let self = this;
			  self.$router.back('/operationgover')
		  },
		  finish(data){
			  let self = this;
			  console.log(data)
		  },
		  detail(list, proList) {
		  	let self = this

		  	proList.forEach(function(item, value) {
					if(item.name == list.name) {
						item.isShow = !item.isShow;
					} else {
						item.isShow = false;
					}
				})
		  }
    },
    beforeRouteLeave(to, from, next) { //路由跳转时清除定时器
    	let self = this
    	clearInterval(self.interval)
    	next()
    }
  }
</script>

<style scoped>
		.el-row {
	    margin-bottom: 20px;
	    &:last-child {
	      margin-bottom: 0;
	    }
	  }
	  .el-col {
	    border-radius: 4px;
	  }
	  .bg-purple-white {
	    background: #ffffff;
	    height: 360px;
	  }
	  .bg-purple-btm {
	  	background: #ffffff;
	    height: 280px;
	    min-height: 280px;
	  }
	  .bg-purple {
	    background: #d3dce6;
	  }
	  .grid-content {
	    border-radius: 4px;
	    min-height: 36px;
	  }
	  .row-bg {
	    padding: 10px 0;
	    background-color: #f9fafc;
	  }

    .circle-red {
    	display: block;
    	background: black;
    	border-radius: 50%;
    	height: 15px;
    	width: 15px;
    	margin: 0;
    	background: radial-gradient(circle at 7.5px 7.5px, #f16670, #ee636d);
    }

    .circle-green {
	    display: block;
    	background: black;
    	border-radius: 50%;
    	height: 15px;
    	width: 15px;
    	margin: 0;
    	background: radial-gradient(circle at 7.5px 7.5px, #66d8e6, #57d1e1);
    }

    .text-muted {
	  	color: #999;
	  	font-weight: 700;
	  }

	  hr {
	  	border-top: 1px solid #eff2f6;
	  	box-sizing: content-box;
	    height: 0;
	    margin-top: 10px;
	    border-top-color: #ccd1d3;
	  }
</style>