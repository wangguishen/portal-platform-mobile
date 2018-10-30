<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group>
				<x-input title="系统名称" text-align="right" readonly placeholder="请输入系统名称" v-model="assoUser.systemName"></x-input>
				<x-input title="用户"  text-align="right" placeholder="请输入用户" v-model="userInput" @on-change="changeUser"></x-input>
			</group>
			<group class="checkList">
				<checklist title="选择用户名" :options="commonList" label-position="left" v-model="checklist" @on-change="change"></checklist>
				<x-button plain type="primary" @click.native="selectAll">全选</x-button>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group,XInput,Checklist,XButton,Toast} from 'vux'
export default{
	components: {
        VHeader,
        Group,
        XInput,
        Checklist,
        XButton,
        Toast
    },
	data(){
		return{
			headObj: {
                title: '关联用户',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            assoUser:{},
            commonList:[],//所有用户列表
            checklist:[],//选中
            initList:[],
            selectAllShow:false,
            userInput:'',//用户
            resData:{},//关联用户res
		}
	},
	mounted(){
		let self = this;
		let sysName = JSON.parse(localStorage.getItem('sysName'));
		console.log(sysName);
		self.assoUser = sysName;
		self.initList=self.checklist;
		self.askUser();
		self.checkAssoUser();
	},
	methods:{
		askUser(){//获取用户列表
			let self = this;
			let datas={
				'userName' : self.userInput
			}
			self.$axios({
				url:'/basic-platform/muser/sel?userName='+self.userInput,
				method:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let userData=res.data.data;
				self.commonList=[];
				userData.forEach(function(item,index){
					item.key = item.id;
					item.value = item.userName+'('+item.level+')';
					self.commonList.push(item)
				})
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		change(){},
		changeUser(){//根据用户搜索
			let self = this;
			self.askUser()
		},
		selectAll(){
			let self = this;
			self.selectAllShow = !self.selectAllShow;
			if(self.selectAllShow){
				self.commonList.forEach(function(item, index){
					self.checklist.push(item.key)
				})
			}else{
				self.checklist = [];
			}
		},
		checkAssoUser(){//查询关联用户
			let self = this;
			self.checklist=[];
			let datas={
				'systemId' : self.assoUser.id
			}
			console.log(datas)
			self.$axios({
				url:'/basic-platform/system/sel_user_rel?systemId='+self.assoUser.id,
				method:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log('关联用户res',res)
				if (res.status == 200) {
					self.resData = res.data.data;
					function tempArrStory(userId) {
	          	    	this.userId = userId
	          		}
	          		self.resData.forEach(function(item,index){
	          			self.checklist.push(parseInt(item.userId));
	          			self.initList.push(parseInt(item.userId));
	          		})
				}
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonSysConfig')
		},
		finish(data){//完成返回监控系统页面
			let self = this;
			console.log(data, "======", self.initList, self.checklist)
	      	let delArr= self.compare(self.initList, self.checklist)
	      	let addArr= self.compare(self.checklist, self.initList)
	      	console.log("======", delArr, addArr)
	  	  	let  userDatas = new Array();
	  	  	if (delArr.length === 0 && addArr.length === 0) {
	  	  		self.$vux.toast.text('请先关联用户','middle');
	  	  		return
	  	  	}
	  	  	for(let index in delArr){
	  	  		console.log(delArr[index])
	  	  		let obj = {
		        	systemId: self.assoUser.id,
		        	userId: delArr[index],
		        	type: '0'
		        }
	  	  		userDatas.push(obj)
	  	  	}
	  	  	for(let index in addArr){
	  	  		let obj = {
		        	systemId: self.assoUser.id,
		        	userId: addArr[index],
		        	type: '1'
		        }
	  	  		userDatas.push(obj)
	  	  	}
	  	  	console.log('=-=-=-=',userDatas)
	  	  	self.$axios({
	  	  		url:'/basic-platform/system/user_rel_system',
	  	  		method:'post',
	  	  		responseType:'json',
	  	  		data:userDatas
	  	  	})
	  	  	.then(function(res){
	  	  		console.log('=',res);
	  	  		if (res.status == 200) {
	  	  			self.$vux.toast.text('关联成功!','middle');
	  	  			self.$router.back('/MonSysConfig')
	  	  		}else{
	  	  			self.$vux.toast.text('关联失败!','middle');
	  	  		}
	  	  	})
	  	  	.catch(function(res){
	  	  		console.log('error',res)
	  	  	})
		},
		compare(arr1, arr2) {
          	var result = []
        	for(let i = 0; i < arr1.length; i++) {
        		var obj = arr1[i];
        		var isExist = false;
        		for(let j = 0; j < arr2.length; j++) {
        			var aj = arr2[j]
        			if(obj == aj) {
        				isExist = true;
        				break;
        			}
        		}
        		if(!isExist) {
        		    result.push(obj)
        		}
        	}
        	return result;
        }
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.checkList .weui-check_label{
		height: 38px;
	}
</style>