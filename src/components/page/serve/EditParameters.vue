<template>
	<div>
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div style="margin-top: 46px;">
			<group class="box">
				<popup-picker title="服务名称" :data="serveOptions" v-model="serveValue" @on-change="serveChange" placeholder="请选择服务名称"></popup-picker>
				<x-input title="接口名称" text-align="right" placeholder="请输入接口名称" v-model="port.name"></x-input>
				<popup-picker title="请求方式" :data="options" v-model="reqmethod" placeholder="请选择请求方式"></popup-picker>
				<x-input title="请求链接" text-align="right" placeholder="请输入请求链接" v-model="port.request"></x-input>
				<x-input title="入示参数" text-align="right" placeholder="请输入入示参数" v-model="port.inpara"></x-input>
				<x-input title="出示参数" text-align="right" placeholder="请输入出示参数" v-model="port.outpara"></x-input>
				<x-input title="简介" text-align="right" placeholder="请输入简介" v-model="port.dsc"></x-input>
				<x-button plain type="primary" @click.native="Parameters">编辑参数</x-button>
			</group>
		</div>
		<v-hint :state="state"></v-hint>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import VHint from '../../common/Hint'
	import {Group, XInput, Cell, PopupRadio, Toast, XButton,PopupPicker}from 'vux'
	export default{
		components:{
			VHint,
			VHeader,
			Group,
			XInput,
			Cell,
			PopupRadio,
			Toast,
			XButton,
			PopupPicker
		},
		data(){
			return{
				jsonPrea:{},
				jsonMethod:{},
				headObj:{
	                title:"",
	                isBack:true
            	},
	            rightObj:{
	                title:'完成',
	                isMore:false,
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
	            //提示框
	            state:{
	            	name: "",
	            	isShow: false,
	            },
	            // serNamePort:{},
	            serveOption:'',
	            serveValue:[],//选中的服务名
	            serveOptions:[],
	            serveObj:{
	            	id:''
	            },
	            option:'请输入请求方式',
	            reqmethod:[],
	            options:[['PUT','POST','GET','DELETE']],
	            TempData:{},//临时数据
	            action:0,//监测是否有操作
			}
		},
		mounted(){
			let self = this;
			let storage = JSON.parse(localStorage.getItem('serviceData'));//所有服务名及id
			let servePort = JSON.parse(localStorage.getItem('serveName'));//当前服务名称
			let portStorage = JSON.parse(localStorage.getItem('portList'));
			self.jsonPrea = servePort;
			self.jsonMethod = portStorage.interMethod;
			console.log('-----------',storage)
			console.log(portStorage);
			self.serveOption = servePort.serviceName;
			console.log('++++++++++++++',servePort)
			self.serveValue.push(servePort.serviceName)
			self.reqmethod.push(portStorage.interMethod)
			self.headObj.title = portStorage.interName;
			self.serveOptions=[[]];
			storage.forEach(function(item,index){
				self.$set(item,'name',item.serviceName)
				self.$set(item,'value',item.serviceName)
				self.serveOptions[0].push(item);
			})
			console.log(self.serveOptions)
			self.port={
				id: portStorage.id,
				mId: portStorage.mId,
				name : portStorage.interName,
				method : portStorage.interMethod,
				request : portStorage.url,
				inpara : portStorage.reqData,
				outpara : portStorage.repData,
				dsc : portStorage.introduce
			}
			self.TempData.serviceName = servePort.serviceName;//备份服务名称
			self.TempData.interName = portStorage.interName;
			self.TempData.interMethod = portStorage.interMethod;
			self.TempData.url = portStorage.url;
			self.TempData.reqData = portStorage.reqData;
			self.TempData.repData = portStorage.repData;
			self.TempData.introduce = portStorage.introduce;
		},
		watch:{
			'port':{
				handler:function(val,old){
					let self = this;
					console.log("go watch methods");
					console.log(val,'-------------',self.TempData,'--------',self.port)
					if (self.TempData.interName == val.interName && self.TempData.interMethod == val.interMethod && self.TempData.url == val.url && self.TempData.reqData == val.reqData && self.TempData.repData == val.repData && self.TempData.introduce == val.introduce) {
						self.action = 0;
					}
					self.action++;
					if (self.action == 1) {
						self.rightObj.isMore = false;
					}else{
						self.rightObj.isMore = true;
					}
				},
				deep:true
			},
			'serveValue':{
				handler:function(val,old){
					let self = this;
					if(val[0] == self.jsonPrea.serviceName){
						self.rightObj.isMore = false;
					}else{
						self.rightObj.isMore = true;
					}
				},
				deep:true
			},
			'reqmethod':{
				handler:function(val,old){
					let self = this;
					if (val[0] == self.jsonMethod) {
						self.rightObj.isMore = false;
					}else{
						self.rightObj.isMore = true;
					}
				},
				deep:true
			}
		},
		methods:{
			serveChange(val){
				let self = this;
				self.serveOptions[0].forEach(function(item,index){
					if (item.serviceName == val[0]) {
						self.serveObj = item;
					}
				})
				console.log(self.serveObj.id)
			},
			finish(data){//右侧加号提交编辑后的数据
	        	let self = this;
	            console.log(data);
	            let urls = "up";
    			let methods = "put";
    			let datas = {
    				mId : self.serveObj.id,
    				id : self.port.id,
    				interName :	self.port.name,
					interMethod : self.reqmethod[0],
					url : self.port.request,
					introduce : self.port.dsc,
					repData : self.port.outpara,
					reqData: self.port.inpara
    			}
    			console.log(datas)
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
		    				text:'修改参数成功!'
		    			},1500)
		    			// localStorage.setItem('portList',JSON.stringify(response.data.data))
		    			self.$router.back('/PortConfig');
		    		}else{
		    			self.$vux.toast.text(response.data.message, 'middle')
		    		}
		    	})
		    	.catch(function(response){
		    		console.log("error");
		    	})
	        },
	        backWay(data){
	        	let self = this;
	        	self.$router.back('/PortConfig');
	            console.log(data)
	        },
	        Parameters(){
	        	let self = this;
	        	self.$router.go('/Parameters');
	        }
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