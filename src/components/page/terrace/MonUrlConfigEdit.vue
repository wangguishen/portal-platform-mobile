<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="urlEdit">
				<x-input title="链接名称" text-align="right" placeholder="请输入链接名称" v-model="editForm.linkName"></x-input>
				<x-input title="链接URL" text-align="right" placeholder="请输入链接URL" v-model="editForm.link"></x-input>
				<popup-picker title="请求方式" :data="options" v-model="methodValue" placeholder="请选择请求方式"></popup-picker>
				<popup-picker title="终端名称" :data="opTerminals" v-model="typeValue" placeholder="请选择终端名称"></popup-picker>
				<popup-picker title="实验室名称" :data="labOptions" v-model="labValue" @on-change="labChange" placeholder="请选择实验室"></popup-picker>
				<popup-picker title="项目名称" :data="sysOptions" v-show="projName" v-model="sysValue" @on-change="sysChange" placeholder="请选择项目"></popup-picker>
				<x-switch :title="switchTitle" v-model="switchValue" @on-change="changeSwitch" @on-click.native="onSwitch"></x-switch>
				<x-button plain v-show="editForm.requestMethod=='POST'" type="primary" @click.native="parameters">参数</x-button>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group, XInput, PopupRadio, Toast, XButton,XSwitch,PopupPicker} from 'vux'
export default{
	components: {
        VHeader,
        Group,
        XInput,
        PopupRadio,
        Toast,
        PopupRadio,
        XButton,
        XSwitch,
        PopupPicker
    },
	data(){
		return{
			jsonMethod:{},
			jsonType:{},
			jsonLab:{},
			jsonSys:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            sysFormName:'',
            labName:'',//实验室名称
            editForm:{
            	linkName:'',
            	link:'',
            	requestMethod:'',
            	type:''
            },
            TempData:{},//临时数据
            TempLabName:'',//临时实验室名称
            TempSysName:'',//临时项目名称
            typeValue:[],//选中的终端
            opTerminals:[[
            	{
            		name :'手机端',
            		value:'手机端'
            	},
            	{
            		name:'PC端',
            		value:'PC端'
            	},
            	{
            		name:'手机端、PC端',
            		value:'两者皆有'
            	}
            ]],
            labValue:[],//选中的实验室名称
            labOptions:[],//实验室名称组
            labObj:{
            	id:''
            },
            methodValue:[],//选中的请求方式
            options:[['GET','POST','HTML']],
            projName:true,
            sysValue:[],//选中的项目
            sysOptions:[],//系统名称组
            sysObj:{
            	id:''
            },
            seleteId:'',//当前编辑id
            action:0,//监测数据变化
            action1:0,
            action2:0,
            action3:0,
            act:0,
            switchTitle:'是否启用',
            switchValue: true,
            switchbeifen: true,
            arc:0,
		}
	},
	mounted(){
		let self = this;
		let linkList = JSON.parse(localStorage.getItem('linkList'))
		console.log('linkList',linkList);
		self.editForm = linkList;
		self.methodValue.push(linkList.requestMethod);
		self.typeValue.push(linkList.type);
		self.headObj.title=linkList.linkName;
		self.labName = linkList.dept_name;
		self.sysFormName = linkList.system_name;
		self.switchValue = self.editForm.enable === '0' ? false : true
		self.switchbeifen = self.switchValue;
		if(self.switchValue){
			self.changeSwitch(self.switchValue)
		}
		let seleteId = self.editForm.id;
		console.log(seleteId)
		self.TempData.linkName = linkList.linkName;
		self.TempData.link = linkList.link;
		self.jsonMethod = linkList.requestMethod;//备份请求方式
		self.jsonType = linkList.type;//备份终端名称
		self.jsonLab = linkList.dept_name;//备份实验室名称
		self.jsonSys = linkList.comp_name+'--'+linkList.dept_name+'--'+linkList.system_name;//备份项目名称
		self.requestLab();
	},
	watch:{
		'editForm':{
			handler:function(val,old){
				let self = this;
				console.log(val,self.TempData)
				if (self.TempData.linkName == val.linkName && self.TempData.link == val.link) {
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
		'methodValue':{
			handler:function(val,old){
				let self = this;
				if (self.jsonMethod == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'typeValue':{
			handler:function(val,old){
				let self = this;
				if (self.jsonType == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'labValue':{
			handler:function(val,old){
				let self = this;
				if (self.jsonLab == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'sysValue':{
			handler:function(val,old){
				let self = this;
				if (self.jsonSys == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'switchValue':{
			handler:function(one,two){
				let self = this;
				console.log(one,'---------',self.switchbeifen);
				if(self.arc != 0){
					if(one != self.switchbeifen){
						self.rightObj.isMore = true;
					}else{
						self.rightObj.isMore = false;
					}
				}
			},
			deep:true
		}
	},
	methods:{
		requestLab(){//请求实验室
			let self = this;
			let datas = {}
			self.$axios({
				url:"/basic-platform/dept/sel",
				mthod:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log('labres:',res)
				let labData = res.data.data;
				self.labOptions=[[]];
				labData.forEach(function(item,index){
					// item.key = item.id;
					// item.value = item.deptName;
					// self.labOptions.push(item);
					if (item.deptName == self.editForm.dept_name) {
						self.labValue.push(self.editForm.dept_name);
					}
					self.$set(item,'name',item.deptName);
					self.$set(item,'value',item.deptName);
					self.labOptions[0].push(item);
				})
			})
			.catch(function(res){
				console.log(res)
			})
		},
		labChange(val){//切换实验室
			let self = this;
			console.log(val[0]);
			self.labOptions[0].forEach(function(item,index){
				if (item.deptName == val[0]) {
					self.labObj = item;
				}
			})
			console.log(self.labObj.id)
			self.querySysData();
		},
		querySysData(){//请求系统列表数据
			let self = this;
			let url="/basic-platform/system/sel?deptId="+self.labObj.id;
			let datas={};
			let method = "get"
			console.log(datas);
			self.$axios({
				url:url,
				method:method,
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log('sysList=======',self.editForm)
				let sysData = res.data.data;
				self.items=[];
				self.sysOptions=[[]];
				sysData.forEach(function(item,index){
					if (item.comp_name == self.editForm.comp_name) {
						self.sysValue=[];
						self.sysValue.push(self.editForm.comp_name+'--'+self.editForm.dept_name+'--'+self.editForm.system_name)
					}
					item.id = item.id.toString();
					self.$set(item,'name',(item.comp_name+'--'+item.dept_name+'--'+item.systemName));
					self.$set(item,'value',(item.comp_name+'--'+item.dept_name+'--'+item.systemName));
					// self.$set(item,'key',item.id);
					self.sysOptions[0].push(item);
					if(index == 0){
						self.sysValue = [];
						self.sysValue.push(item.comp_name+'--'+item.dept_name+'--'+item.systemName);
					}
				})
				if (self.sysOptions[0].length == 0) {
					self.sysValue=[];
					self.sysValue.push('暂无项目');
					self.sysOptions[0].push('暂无项目');
				}
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		sysChange(val){//切换项目
			let self = this;
			console.log(val[0]);
			self.sysOptions[0].forEach(function(item,index){
				if (item.name == val[0]) {
					self.sysObj = item;
				}
			})
			console.log(self.sysObj.id);
		},
		changeName(value,lable){
			console.log(value)
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonUrlConfig')
		},
		onSwitch(newVal,oldVal){
			let self = this;
			console.log(newVal,oldVal)
		},
		changeSwitch(val){//是否禁用
			let self = this;
			if(self.arc == 0){
				self.arc++;
			}else{
				self.arc++;
				console.log(val)
				let account = 0;
				if (val) {
					account = 1;
				}else{
					account = 0;
				}
				let datas ={
					'id' : self.editForm.id,
					'enable' : account,
					'link' : self.editForm.link,
					'systemId' : self.editForm.systemId
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/link/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res);
					if (res.data.data.enable == 0) {
						self.$vux.toast.text('链接已禁用!','middle');
					}else if (res.data.data.enable == 1) {
						self.$vux.toast.text('链接已启用!','middle');
					}
				})
				.catch(function(res){
					console.log('error',res);
				})
			}
				
		},
		finish(data){
			let self = this;
			console.log(data)
			let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			if (self.editForm.linkName == '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请输入链接名称'
				},1500)
			}else if(self.editForm.link == ''){
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请输入链接地址'
				},1500)
			}else if (!reg.test(self.editForm.link)) {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'链接格式不正确'
				},1500)
			}else if (self.methodValue == '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请选择请求方式'
				},1500)
			}else if (self.typeValue == '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请选择终端名称'
				},1500)
			}else if (self.labValue == '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请选择实验室'
				},1500)
			}else if (self.sysValue== '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请选择项目名称'
				},1500)
			}else if (self.sysObj.id== '' || undefined) {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请选择有项目的实验室!'
				},1500)
			}else{
				let datas={
					'id' : self.editForm.id,
					'linkName' : self.editForm.linkName,
					'link' : self.editForm.link,
					'requestMethod' : self.methodValue[0],
					'systemId' : self.sysObj.id,
					'type' : self.typeValue[0],
					'status': '0'
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/link/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					self.$vux.toast.show({
						type:'text',
						position:'middle',
						text:'修改链接成功!'
					})
					// localStorage.setItem('linkList',JSON.stringify(res.data.data))
					self.$router.back('/MonUrlConfig')
				})
				.catch(function(res){
					console.log('error',res);
				})
			}	
		},
		parameters(){
			let self = this;
			self.$router.go('/ParameterDetails')
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.urlEdit .weui-cell{
		height: 36px;
	}
	.sysNameStyle .vux-popup-dialog{
		top: 370px;
	}
</style>