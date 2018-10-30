<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="urlAdd">
				<x-input title="链接名称" text-align="right" placeholder="请输入链接名称" v-model="addForm.linkName"></x-input>
				<x-input title="链接URL" text-align="right" placeholder="请输入链接URL" v-model="addForm.link"></x-input>
				<popup-picker title="请求方式" :data="options" v-model="methodValue" @on-change="methodChange" placeholder="请选择请求方式"></popup-picker>
				<popup-picker title="终端名称" :data="opTerminals" v-model="typeValue" @on-change="typeChange" placeholder="请选择终端名称"></popup-picker>
				<popup-picker title="实验室名称" :data="labOptions" v-model="labValue" @on-change="labChange" placeholder="请选择实验室"></popup-picker>
				<popup-picker title="项目名称" :data="sysOptions" v-show="projName" v-model="sysValue" @on-change="sysChange" placeholder="请选择项目"></popup-picker>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group, XInput, PopupRadio, Toast,PopupPicker} from 'vux'
export default{
	components: {
        VHeader,
        Group,
        XInput,
        PopupRadio,
        Toast,
        PopupPicker
    },
	data(){
		return{
			headObj: {
                title: '注册链接',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            addForm:{
            	linkName:'',
            	link:'',
            },
            labName:'',//实验室名称
            sysName:'',//项目名称
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
            methodValue:[],
            options:[['GET','POST','HTML']],
            sysObj:{
            	id:''
            },//备份项目对象
            projName:true,//项目
            sysValue:[],//选中的项目
            sysOptions:[],//系统名称组
            labValue:[],//选中的实验室
            labOptions:[],//实验室名称
            labObj:{
            	id:''
            },//备份实验室对象
		}
	},
	mounted(){
		let self = this;
		self.requestLab();
	},
	methods:{
		methodChange(val){//切换请求方式
			let self = this;
			console.log(val[0])
		},
		typeChange(val){//切换终端
			let self = this;
			console.log(val[0])
		},
		labChange(val){//切换实验室
			let self = this;
			console.log(val[0])
			self.labOptions[0].forEach(function(item,index){
				if (item.deptName == val[0]) {
					self.labObj = item;
				}
			})
			console.log(self.labObj.id);
			self.askSys();
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
					self.$set(item,'name',item.deptName);
					self.$set(item,'value',item.deptName);
					self.labOptions[0].push(item);
				})
			})
			.catch(function(res){
				console.log(res)
			})
		},
		changeName(value,lable){
			let self = this;
			console.log(value,lable)
		},
		askSys(){//请求项目系统
			let self = this;
			let  url = "/basic-platform/system/sel?pageSize=10000&deptId="+self.labObj.id;
			let data = {
				'pageSize': 10000
			};
			let method = 'get';
			self.$axios({
				url:url,
				method:method,
				responseType:'json',
				data:data
			})
			.then(function(res){
				console.log('=',res)
				// sysListName.forEach(function(item,index){
				// 	item.key = item.id;//解决当前下拉选项获取id
				// 	item.value = item.systemName;
				// 	self.sysOptions.push(item)
				// })
				let sysData = res.data.data;
				self.items=[];
				self.sysOptions = [[]];
				sysData.forEach(function(item,index){
					item.id = item.id.toString();
					self.$set(item,'name',(item.comp_name+'--'+item.dept_name+'--'+item.systemName));
					self.$set(item,'value',(item.comp_name+'--'+item.dept_name+'--'+item.systemName));
					self.sysOptions[0].push(item);
					if(index == 0){
						self.sysValue = [];
						self.sysValue.push(item.comp_name+'--'+item.dept_name+'--'+item.systemName);
					}
				})
				// if (self.sysOptions[0].length == 0) {//如果实验室下无项目，隐藏项目选项
				// 	self.projName = false;
				// }
				if (self.sysOptions[0].length == 0) {
					self.sysValue=[];
					self.sysOptions[0].push('暂无项目')
				}
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonUrlConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			if (self.addForm.linkName == '') {
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请输入链接名称'
				},1500)
			}else if(self.addForm.link == ''){
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'请输入链接地址'
				},1500)
			}else if (!reg.test(self.addForm.link)) {
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
					text:'请在该实验室下添加项目'
				},1500)
			}else{
				let url = '/basic-platform/link/add';
				let method='post';
				let datas={
					'linkName' : self.addForm.linkName,
					'link' : self.addForm.link,
					'requestMethod' : self.methodValue[0],
					'systemId' : self.sysObj.id,
					'enable':'1',
					'type' : self.typeValue[0],
					'status': '0'
				}
				console.log(datas);
				self.$axios({
					url:url,
					method:method,
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					self.$vux.toast.show({
						type:'text',
						position:'middle',
						text:'注册链接成功!'
					})
					self.$router.back('/MonUrlConfig')
				})
				.catch(function(res){
					console.log('error',res);
				})
			}
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.urlAdd .weui-cell{
		height: 36px;
	}
</style>