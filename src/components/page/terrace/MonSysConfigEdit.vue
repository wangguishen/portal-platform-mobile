<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="boxAdd">
				<x-input title="项目名称" text-align="right" placeholder="请输入系统名称" v-model="paraEdit.systemName"></x-input>
				<popup-picker title="企业名称" :data="options" v-model="compValue" @on-change="compChange" placeholder="请选择企业名称"></popup-picker>
				<popup-picker title="实验室名称" :data="optionLab" v-model="lab" @on-change="labChange" placeholder="请选择实验室"></popup-picker>
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
			jsonComp:{},
			jsonLab:{},
			headObj: {
                title: '编辑项目',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            paraEdit:{},
            enterpriseId:'',
            TempData:{},//临时数据
            TempComp:'',
            compValue:[],//选中的企业
            options:[],
            compObj:{
            	id:''
            },
            labObj:{
            	id:''
            },
            option:'',
            lab:[],
            optionLab:[],//实验室列表
            action:0,//监听是否操作
            act:0,
            ion:0,
		}
	},
	mounted(){
		let self = this;
		let editList = JSON.parse(localStorage.getItem('editList'))
		console.log('--->',editList)
		self.paraEdit = editList;
		self.requestComp();
		self.TempData.systemName = editList.systemName;
		self.jsonComp = editList.comp_name;
		self.jsonLab = editList.dept_name;
	},
	watch:{
		'paraEdit':{
			handler:function(val,old){
				let self = this;
				console.log("go watch methods");
				console.log(val,"-----",self.TempData)
				if (self.TempData.systemName == val.systemName) {
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
		'compValue':{
			handler:function(val,old){
				let self = this;
				if (self.jsonComp == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'lab':{
			handler:function(val,old){
				let self = this;
				if (self.jsonLab == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		}
	},
	methods:{
		requestComp(){//请求企业
			let self = this;
			let datas={
				'compName' :''
			}
			console.log(datas)
			self.$axios({
				url:'/basic-platform/enterprise/sel',
				method:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let compData = res.data.data;
				self.options = [[]];
				compData.forEach(function(item,index){
					// item.key = item.id;
					// item.value = item.compName;
					// self.options.push(item)
					if (item.compName == self.paraEdit.comp_name) {
						self.compValue.push(self.paraEdit.comp_name);
					}
					self.$set(item,'name',item.compName);
					self.$set(item,'value',item.compName);
					self.options[0].push(item);
				})
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		compChange(val){//切换企业
			let self = this;
			console.log(val)
			self.options[0].forEach(function(item,index){
				if (item.compName == val[0]) {
					self.compObj = item;
				}
			})
			console.log(self.compObj.id);
			self.requestLab();
		},
		requestLab(){//请求实验室
			let self = this;
			let datas = {}
			self.$axios({
				url:"/basic-platform/dept/sel?enterpriseId="+self.compObj.id,
				mthod:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log('labres:',res)
				let labData = res.data.data;
				self.optionLab=[[]];
				labData.forEach(function(item,index){
					if(index == 0){
						self.lab = [];
						self.lab.push(item.deptName);
					}
					if (item.deptName == self.paraEdit.dept_name) {
						self.lab = [];
						self.lab.push(self.paraEdit.dept_name);
					}
					self.$set(item,'name',item.deptName);
					self.$set(item,'value',item.deptName);
					self.optionLab[0].push(item);
				})
				// self.lab = self.optionLab[0].id
			})
			.catch(function(res){
				console.log(res)
			})
		},
		labChange(val){//切换实验室
			let self = this;
			self.optionLab[0].forEach(function(item,index){
				if (item.deptName == val[0]) {
					self.labObj = item;
				}
			})
			console.log(self.labObj.id);
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonSysConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.paraEdit.systemName == '') {
				self.$vux.toast.text('请输入系统名称','middle');
			}else if(self.paraEdit.compName == '') {
				self.$vux.toast.text('请输入企业名称','middle')
			}else{
				let datas={
					'id': self.paraEdit.id,
					'systemName' : self.paraEdit.systemName,//系统名称
					'deptId' : self.labObj.id//实验室id
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/system/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('修改系统成功!','middle')
						self.$router.back('/MonSysConfig')
					}else{
						self.$vux.toast.text('修改系统失败!','middle')
					}
				})
				.catch(function(res){
					console.log('error',res)
				})
			}
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.boxAdd .weui-cell{
		height: 27px;
	}
</style>