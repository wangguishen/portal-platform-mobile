<template>
	<div>
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div style="margin-top: 46px;">
			<group class="box">
				<popup-picker title="服务名称" :data="serveList" v-model="serveValue" @on-change="serveChange" placeholder="请选择服务名称"></popup-picker>
				<x-input title="接口名称" text-align="right" placeholder="请输入接口名称" v-model="port.name"></x-input>
				<popup-picker title="请求方式" :data="options" v-model="options1" @on-change="requestChange" placeholder="请选择请求方式"></popup-picker>
				<x-input title="请求链接" text-align="right" placeholder="请输入请求链接" v-model="port.request"></x-input>
				<x-input title="入示参数" text-align="right" placeholder="请输入入示参数" v-model="port.inpara"></x-input>
				<x-input title="出示参数" text-align="right" placeholder="请输入出示参数" v-model="port.outpara"></x-input>
				<x-input title="简介" text-align="right" placeholder="请输入简介" v-model="port.dsc"></x-input>
			</group>
		</div>
		<v-hint :state="state"></v-hint>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import VHint from '../../common/Hint'
	import {Group, XInput, Cell, PopupRadio, Toast,PopupPicker}from 'vux'
	export default {
		components:{
			VHeader,
			Group,
			XInput,
			Cell,
			PopupRadio,
			VHint,
			Toast,
			PopupPicker
		},
		data(){
			return{
				headObj:{
	                title:"新增接口",
	                isBack:true
            	},
	            rightObj:{
	                title:'完成',
	                isMore:true,
	                // icon: '&#xe6b9;',
	            },
	            port:{
	            	name:'',//接口名称
	            	method:'',//请求方式
	            	request:'',//请求链接
	            	inpara:'',//入参示例
	            	outpara:'',//出参示例
	            	dsc:'',//简介
	            },
	            serveList:[],
	            serveValue:[],//选中服务
	            serveObj:{
	            	id:''
	            },//备份对象
	            option:"请选择请求方式",
	            options:[['PUT','POST','GET','DELETE']],
	            option1: '请选择服务名称',
      			options1: [],
      			//提示框
	            state:{
	            	name: "",
	            	isShow: false,
	            }
			}
		},
		mounted(){
			let self = this;
			self.askServe();
		},
		watch: {

		},
		methods:{
			askServe(){//请求服务
				let self = this;
				let data={
					'serviceName' : ''
				}
				self.$axios({
					url: self.BP_HOST+'/module/sel',
					method: 'get',
					responseType: 'json',
					data:data
				})
				.then(function(response){
					console.log(response);
					if (response.status == 200) {
						let list = response.data.data;
						self.serveList=[[]];
						list.forEach(function(item,index){
							// item.key = item.id;
							// item.value = item.serviceName;
							self.$set(item,'name',item.serviceName);
							self.$set(item,'value',item.serviceName);
							self.serveList[0].push(item)
						})
					}	
				})
				.catch(function(response){
					console.log("error");
				})
			},
			serveChange(val){//改变服务名称
				let self = this;
				self.serveList[0].forEach(function(item,index){
					if (item.serviceName == val[0]) {
						self.serveObj = item;
					}
				})
				console.log(self.serveObj.id);
			},
			requestChange(val){
				let self = this;
			},
			finish(data){//新增接口完成
	        	let self = this;
	        	if (self.serveValue == '') {
	        		self.$vux.toast.text('请选择服务名称','middle');
	        	}else if (self.port.name == '') {
	        		self.$vux.toast.text('请输入接口名称','middle');
	        	}else if (self.options1 == '') {
	        		self.$vux.toast.text('请选择请求方式','middle');
	        	}else if (self.port.request == '') {
	        		self.$vux.toast.text('请输入请求链接','middle');
	        	}else if (self.port.inpara == '') {
	        		self.$vux.toast.text('请输入入示参数','middle');
	        	}else if (self.port.outpara == '') {
	        		self.$vux.toast.text('请输入出示参数','middle');
	        	}else if (self.port.dsc == '') {
	        		self.$vux.toast.text('请输入简介','middle');
	        	}else{
	        		let urls="add";
		    		let methods = "post";
		    		let datas={
		    			mId:self.serveObj.id,
		    			interName:self.port.name,
		    			interMethod:self.options1[0],
		    			url:self.port.request,
		    			introduce:self.port.dsc,
		    			repData:self.port.outpara,
		    			reqData:self.port.inpara,
		    		}
		    		console.log(datas);
		    		self.$axios({
		    			url: self.BP_HOST+'/inter/'+urls,
		      			method: methods,
			    		responseType: 'json',
			    		data: datas
		    		})
		    		.then(function(response){
		    			console.log(response);
		    			if(response.data.status == 200){
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'新增接口成功!'
							},1500)
		    			}
		    			self.$router.back('/PortConfig');
		    		})
		    		.catch(function(response){
		    			console.log("error");
		    		})
	        	}
	        },
	        backWay(data){
	        	let self = this;
	        	self.$router.back('/PortConfig');
	            console.log(data)
	        },
		}
	}
</script>

<style lang="less" scoped>
	
</style>

<style>
	.box .weui-cell{
		height: 27px;
	}
</style>