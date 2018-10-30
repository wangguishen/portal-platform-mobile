<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<search
		    @result-click="resultClick"
		    @on-change="getResult"
		    v-model="urlInput"
		    top="46px"
		    @on-focus="onFocus"
		    @on-cancel="onCancel"
		    ref="search"
		    placeholder="请输入项目名称或者链接地址"
		    class="search_box">
	    </search>
	    <div class="lab_sys">
	    	<group>
				<popup-picker
					title="实验室"
					:data="labList"
					v-model="sureLab"
					@on-change="onChange"
					placeholder='请选择实验室'
					ref="picker1">
				</popup-picker>
			</group>
	    </div>
		<div class="container_top urlLink">
			<group class="group_cell">
				<template v-for="list in urlList">
					<cell
						:title="list.linkName"
						:arrow-direction="list.isShow ? 'down' : 'right'"
	          			:border-intent="false"
						@click.native="lookClass(list, urlList)"
						is-link>
					</cell>
					<template v-if="list.isShow">
	          			<cell-form-preview :border-intent="false" :list="list.children"></cell-form-preview>
	          		</template>
				</template>
			</group>
			<div class="prompt_text" v-show="urlListShow">
				暂无url链接
			</div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton, Search, XButton, Popup, PopupPicker, Picker, CellFormPreview } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton, Search, XButton, Popup, PopupPicker, Picker, CellFormPreview
    },
	data(){
		return{
			operationObj: {},//详情信息
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            urlList:[],//url链接列表
            urlInput:'',//input输入框的值
            urlListShow:true,//没有数据的时候
            // 模态框
            
            // labList:[[{name:'小米',value:'1'},{name:'iPhone',value:'2'},{name:'华为',value:'3'},{name:'情怀',value:'4'},{name:'三星',value:'5'},{name:'其他',value:'6'},{name:'不告诉你',value:'7'}]],//实验室列表
            labList:[],//实验室列表
            sureLab:[],//选中实验室的值
            labObj:{
            	id:'',
            },//备份对象
            labtitle:'实验室',
            // 分页
	  		pageSize: 10000,
	  		currentPage: 1,
	  		totalCount: 0,
		}
	},
	mounted(){
		let self = this;
		self.operationObj = JSON.parse(localStorage.getItem('operationDetail'));
		console.log(self.operationObj)
		self.headObj.title = self.operationObj.compName;
		self.askUrlLink();
		self.askLab();
	},
	methods:{
		backWay(data){//返回
			let self = this;
			self.$router.back('/operationgover')
			console.log(data)
		},
		finish(data){//完成
			let self = this;
			console.log(data)
		},
		askUrlLink(){//请求url 链接
			let self = this;
			let  url = "/basic-platform/link/sel?systemId="+self.operationObj.id+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			self.ajax(url, method, data, function(res){
				console.log(res)
				if(res.data.status == 200){
					let list = res.data.data;
					self.urlList = [];
					if(list.length != 0){
						self.urlListShow = false;
						list.forEach(function(item, index){
							self.$set(item,'isShow',false)
							let str = '';
	    					if(item.status == 0){
	    						str = "<span class='iconfont' style='color:rgb(43, 231, 79);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>正常";
	    					}else if(item.status == 1){
	    						str = "<span class='iconfont' style='color:rgb(246, 162, 15);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>异常";
	    					}else if(item.status == 2){
	    						str = "<span class='iconfont' style='color:rgb(235, 23, 53);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>宕机";
	    					}
	    					let arr = [
	    						{
		    						label: '项目名称',
	        						value: item.system_name
		    					},{
		    						label: '终端',
	        						value: item.type
		    					},{
		    						label: '链接地址',
	        						value: item.link
		    					},{
		    						label: '链接状态',
	        						value: str
		    					}
	    					]
	    					self.$set(item,'children',arr)
							self.urlList.push(item)
						})

					}else{
						self.urlListShow = true;
					}
				}else{
					self.$vux.toast.text('请求url链接报错', middle)
				}
			})
		},
		askLab(){//请求实验室
			let self = this;
			let url = "/basic-platform/dept/sel?enterpriseId="+self.operationObj.id;
    		let data = {};
    		let method = 'get';
    		self.ajax(url, method, data, function(res){
				console.log('sys',res)
				if(res.data.status == 200){
					let list = res.data.data;
					self.labList = [[]];
					list.forEach(function(item, index){
						self.$set(item, 'name', item.deptName);
						self.$set(item, 'value', item.deptName);
						self.labList[0].push(item)
					})
				}else{
					self.$vux.toast.text('请求实验室发生错误', middle)
				}
			})
		},
		resultClick(item){//搜索点击
			let self = this;
			console.log(item)
		},
		getResult(val){//搜索的值变换时
			let self = this;
			let url = "/basic-platform/link/sel?systemId="+self.operationObj.id+'&deptId='+self.labObj.id+'&linkName='+val+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			self.ajax(url, method, data, function(res){
				console.log(res)
				if(res.data.status == 200){
					let list = res.data.data;
					self.urlList = [];
					if(list.length != 0){
						self.urlListShow = false;
						list.forEach(function(item, index){
							self.$set(item,'isShow',false)
							let str = '';
	    					if(item.status == 0){
	    						str = "<span class='iconfont' style='color:rgb(43, 231, 79);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>正常";
	    					}else if(item.status == 1){
	    						str = "<span class='iconfont' style='color:rgb(246, 162, 15);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>异常";
	    					}else if(item.status == 2){
	    						str = "<span class='iconfont' style='color:rgb(235, 23, 53);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>宕机";
	    					}
	    					let arr = [
	    						{
		    						label: '项目名称',
	        						value: item.system_name
		    					},{
		    						label: '终端',
	        						value: item.requestMethod
		    					},{
		    						label: '链接地址',
	        						value: item.link
		    					},{
		    						label: '链接状态',
	        						value: str
		    					}
	    					]
	    					self.$set(item,'children',arr)
							self.urlList.push(item)
						})
					}else{
						self.urlListShow = true;
					}
				}else{
					self.$vux.toast.text('请求url链接报错', middle)
				}
			})
		},
		onFocus () {
	    	let self = this;
	      	console.log('on focus')
	    },
	    onCancel () {
	    	let self = this;
	      	console.log('on cancel')
	    },
	    onChange(val){//切换选中的值
	    	let self = this;
	    	self.labList[0].forEach(function(item, index){
	    		if(item.deptName == val[0]){
	    			self.labObj = item;
	    		}
	    	})
	    	self.askLabUrlLink()
	    },
	    askLabUrlLink(){//根据实验室查询链接
	    	let self = this;
	    	let  url = "/basic-platform/link/sel?systemId="+self.operationObj.id+'&deptId='+self.labObj.id+'&linkName='+self.urlInput+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			self.ajax(url, method, data, function(res){
				console.log(res)
				if(res.data.status == 200){
					let list = res.data.data;
					self.urlList = [];
					if(list.length != 0){
						self.urlListShow = false;
						list.forEach(function(item, index){
							self.$set(item,'isShow',false)
							let str = '';
	    					if(item.status == 0){
	    						str = "<span class='iconfont' style='color:rgb(43, 231, 79);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>正常";
	    					}else if(item.status == 1){
	    						str = "<span class='iconfont' style='color:rgb(246, 162, 15);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>异常";
	    					}else if(item.status == 2){
	    						str = "<span class='iconfont' style='color:rgb(235, 23, 53);font-size:1.2rem;margin-right:.5rem;'>&#xe602;</span>宕机";
	    					}
	    					let arr = [
	    						{
		    						label: '项目名称',
	        						value: item.system_name
		    					},{
		    						label: '终端',
	        						value: item.requestMethod
		    					},{
		    						label: '链接地址',
	        						value: item.link
		    					},{
		    						label: '链接状态',
	        						value: str
		    					}
	    					]
	    					self.$set(item,'children',arr)
							self.urlList.push(item)
						})
					}else{
						self.urlListShow = true;
					}
				}else{
					self.$vux.toast.text('请求url链接报错', middle)
				}
			})
	    },
	    lookClass(list, urlList){//显示状态
			let self = this;
			// list.isShow = !list.isShow;//都能显示
			urlList.forEach(function(item, value){//只能显示一个
				if(item.id == list.id){
					item.isShow = !item.isShow;
				}else{
					item.isShow = false;
				}
			})
		},
		ajax(url, method, data, callback){//公共请求方法
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		callback(res)
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    		self.$vux.toast.text("后台报错", middle)
	    	})
		},
	},
}
</script>
<style lang="less" scoped>
#page_box{
	.container_top{
		margin-top: 145px;
		.prompt_text{
			width:100%;
			height: 3rem;
			line-height: 3rem;
			text-align: center;
			font-size: 0.8rem;
			color:#aaa;
		}
	}
}
</style>