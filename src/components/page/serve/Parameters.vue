<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="parasValue"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            placeholder="请输入内容"
            	style="margin-top: 48px;">
	        </search>
	        <div>
			    <x-table :cell-bordered="false" :full-bordered="true" style="background-color:#fbf9fe;" :class="{'tab':tab}">
			        <thead>
				        <tr>
				            <th>参数名称</th>
				        </tr>
			        </thead>
			    </x-table>
		    </div>
		    <div>
		    	<swipeout>
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(list, index) in lists" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonDelete(list, index)" type="warn">删除</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell-box :border-intent="false" is-link @click.native="details(list, index)">{{list.pName}}</cell-box>
			        	</div>
		    		</swipeout-item>
		    	</swipeout>
		    </div>
	    </div>
	    <v-hint :state="state"></v-hint>
	    <load-more :show-loading="showLoad" :tip="loadText"></load-more>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import VHint from '../../common/Hint'
	import {Search, Group, Cell, CellBox, Swipeout, SwipeoutItem, SwipeoutButton, XTable, Confirm, LoadMore} from 'vux'
	export default {
		components:{
			VHeader,
			Search,
			Swipeout,
			SwipeoutItem,
			SwipeoutButton,
			Group,
			Cell,
			CellBox,
			XTable,
			Confirm,
			VHint,
			LoadMore
		},
		data () {
			return{
				headObj:{
	                title:"参数管理",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                icon: '&#xe6b9;',
	            },
	            results: [],
	            parasValue:'',//搜索框内容
	            tab:false,
	            delshow:false,
	            portList:{},
	            configInput:'',
	            lists:[],
	            selParasId:'',//选中的参数id
	            //提示框
	            state:{
	            	name: "",
	            	isShow: false,
	            },
	            loadText: "",//加载指示字体
            	showLoad: true,//加载指示符是否显示
			}
		},
		mounted(){
			let self = this;
			let portList = JSON.parse(localStorage.getItem('portList'));
			console.log('=',portList);
			self.portList = portList;
			self.askParameters();
		},
		methods:{
			askParameters(){//请求参数
				let self = this;
				let datas={
	      			'pName' : self.parasValue,
		    		'interId' : self.portList.id
	      		}
	      		console.log(datas);
	      		self.$axios({
	      			url:'/basic-platform/parm/sel?pName='+self.parasValue+'&interId='+self.portList.id,
	      			method: 'get',
		    		responseType: 'json',
		    		data: datas
	      		})
	      		.then(function(response){
	      			console.log(response);
	      			let parasList = response.data.data;
	      			if (parasList.length == 0) {
	      				self.loadText="暂无数据";
	      			}else{
	      				self.loadText="数据加载完毕"
	      			}
	      			self.showLoad=false;
	      			self.lists=[];
	      			parasList.forEach(function(item,index){
	      				self.lists.push(item);
	      			})
	      		})
	      		.catch(function(response){
	      			console.log("error");
	      		})
			},
			details(list, index){//参数详情页
				let self = this;
				console.log(list,index);
				localStorage.setItem('manageList',JSON.stringify(list));
				self.$router.go('/EditParasManage');
			},
			backWay(data){//返回上一页面
	        	let self = this;
	        	self.$router.back('/EditParameters');
	            console.log(data)
	        },
	        resultClick (item) {
	            window.alert('you click the result item: ' + JSON.stringify(item))
	        },
	        getResult(val){//搜索参数
	        	let self = this;
				self.parasValue = val;
				self.askParameters();
				// self.lists=[];
	        },
	        onFocus () {//搜索框获得焦点
	            console.log('on focus')
	            let self = this;
	            self.tab=true;
	        },
	        onCancel () {//搜索框是去焦点
	            console.log('on cancel')
	            let self = this;
	            self.tab=false;
	        },
	        finish(data){//右侧加号新增参数
	        	console.log(data)
	        	let self = this;
	        	self.$router.go('/AddParameters');
	        },
	        onButtonDelete(list, index){//删除按钮
	        	let self = this;
	        	self.$vux.confirm.show({
	        		title:"删除参数",
	        		content:"您确定删除吗？",
					onCancel () {
					   
					},
				  	onConfirm () {
						self.selParasId = list.id;
						self.ondelConfirm();
				  	}
				},1500)
	        },
	        ondelConfirm () {//删除弹框确认按钮
	        	let self = this;
	        	self.$axios({
	        		url:'/basic-platform/parm/del',
	        		method:'delete',
	        		responseType:'json',
	        		data:{
	        			'id':self.selParasId
	        		}
	        	})
	        	.then(function(response){
	        		console.log(response);
	        		self.state.name = "删除参数成功！";
					self.state.isShow = true;
					self.askParameters();
	        	})
	        	.catch(function(response){
	        		console.log("error");
	        	})
	        },
	        onSubmit () {
	            let self = this;
	            self.$refs.search.setBlur()
	            self.$vux.toast.show({
	                type: 'text',
	                position: 'top',
	                text: 'on submit'
	            })
	        },
	        onShow () {
	          	console.log('promt show')
	        },
	        onHide () {
	          	console.log('prompt hide')
	        },
	        onCancel1 () {
	          	console.log('prompt cancel')
	        }
		}
	}
</script>

<style lang="less" scoped>
	
</style>
<style>
	.tab{
		margin-top: 92px;
	}
</style>