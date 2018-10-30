<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<!-- 系统 -->
			<div v-show="isGover">
				<add-group :groupList="groupList"></add-group>
			</div>
			<!-- 操作 -->
			<div v-show="isOperate">
				<add-operate :operateList="operateList"></add-operate>
			</div>
			<!-- 服务器监控 -->
			<div v-show="isServer">
				<add-server :serverList="serverList"></add-server>
			</div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'			//头部
import addGroup from '../../common/addGroup'		//系统
import addOperate from '../../common/addOperate'	//操作
import addServer from '../../common/addServer'		//服务器监控
export default{
	components: {
        VHeader, addGroup, addOperate, addServer
    },
	data(){
		return{
			currentFrim: {},//数据
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            //系统详情
            isGover: false,
            groupList: {
            	name:'',
            	code:'',
            	type:'',
            },
            types:["通用权限模型","RBAC权限模型"],
            groups:{},//备份
            //操作详情
            isOperate: false,
            operateList: {
            	name: '',
            	code: '',
            },
            sta:0,
            //服务器监控
            isServer: false,
            serverList:{
            	name:'',
            	address:'',
            },
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('DetailsInfoMation'));
		console.log(self.currentFrim)
		self.mountStart();
	},
	watch: {
		'groupList': {
			handler: function(val,old){
				let self = this;
				if(self.groups.name == val.name && self.groups.code == val.code && self.types[self.groups.type] == val.type){
					self.sta = 0;
				}
				self.sta++;
				if(self.sta == 1){
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'operateList': {
			handler: function(val,old){
				let self = this;
				if(self.groups.name == val.name && self.groups.code == val.code){
					self.sta = 0;
				}
				self.sta++;
				if(self.sta == 1){
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		},
		'serverList': {
			handler: function(val,old){
				let self = this;
				if(self.groups.name == val.name && self.groups.address == val.address){
					self.sta = 0;
				}
				self.sta++;
				if(self.sta == 1){
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		}
	},
	methods:{
		mountStart(){//开始执行
			let self = this;
			if(self.currentFrim.plateCode == "0"){//0指从系统页面而来
				self.isGover = true;
				// self.headObj.title = self.currentFrim.system_name;
				self.headObj.title = "修改系统";
				self.groupList.name = self.currentFrim.system_name;
				self.groups.name = self.currentFrim.system_name;
				self.groupList.code = self.currentFrim.sys_code;
				self.groups.code = self.currentFrim.sys_code;
				self.groups.type = self.currentFrim.system_model;
				if(self.currentFrim.system_model == 0){
					self.groupList.type = "通用权限模型";
				}else if(self.currentFrim.system_model == 1){
					self.groupList.type = "RBAC权限模型";
				}
			}else if(self.currentFrim.plateCode == "1"){
				self.isOperate = true;
				self.headObj.title = "修改操作";
				self.operateList.name = self.currentFrim.action_name;
				self.operateList.code = self.currentFrim.action_code;
				self.groups.name = self.currentFrim.action_name;
				self.groups.code = self.currentFrim.action_code;
			}else if(self.currentFrim.plateCode == "2"){
				self.isServer = true;
				self.headObj.title = "修改服务器";
				self.serverList.name = self.currentFrim.serviceName;
				self.serverList.address = self.currentFrim.serviceNumber;
				self.groups.name = self.currentFrim.serviceName;
				self.groups.address = self.currentFrim.serviceNumber;
			}
		},
		backWay(data){//返回
			let self = this;
			self.$router.back(self.currentFrim.pathPage)
		},
		finish(data){//完成
			let self = this;
			if(self.isGover){//系统修改
				self.gover();
			}else if(self.isOperate){//操作修改
				self.operate();
			}else if(self.isServer){//服务器监控
				self.server();
			}
		},
		gover(){//系统方法
			let self = this;
			if(self.groupList.name == ''){
				self.$vux.toast.text('请输入系统名称', 'middle')
			}else if(self.groupList.code == ''){
				self.$vux.toast.text('请输入系统编码', 'middle')
			}else if(self.groupList.type == '' || self.groupList.type == '请选择权限模型'){
				self.$vux.toast.text('请选择权限模型', 'middle')
			}else{
				let type = '';
				let url = "/UAMS/system/do_system_update";
				if(self.groupList.type == "通用权限模型"){
					type = '0';
				}else if(self.groupList.type == "RBAC权限模型"){
					type = '1';
				}
				let data = {
    				"compCode": self.currentFrim.comp_code,
		    		"sysName": self.groups.name,
		    		"sysCode": self.groups.code,
		    		"sysModel": type,
		    		"newSysName":self.groupList.name,
		    		"newSysCode":self.groupList.code
    			}
    			let method = "post";
    			console.log(data)
    			self.amendSubmit(url, data, method);
			}
		},
		operate(){//操作方法
			let self = this;
			if(self.operateList.name == ''){
				self.$vux.toast.text('请输入操作名称', 'middle')
			}else if(self.operateList.code == ''){
				self.$vux.toast.text('请输入操作编码', 'middle')
			}else{
				let url = "/UAMS/action/ajax/do_update_action";
				let data = {
					'compCode':self.currentFrim.comp_code,
		    		"actionCode":self.operateList.code,
		    		"actionName":self.operateList.name,
		    		"actionId":self.currentFrim.id,
				}
				let method = "post";
				self.amendSubmit(url, data, method);
			}
		},
		server(){//服务器监控
			let self = this;
			if(self.serverList.name == ''){
				self.$vux.toast.text('请输入服务器名称', 'middle')
			}else if(self.serverList.address == ''){
				self.$vux.toast.text('请输入服务器地址', 'middle')
			}else{
				let url = "/basic-platform/server/up";
				let data = {
					id: self.currentFrim.id,
          			serviceName: self.serverList.name,
          			serviceNumber: self.serverList.address
				}
				let method = "put";
				self.amendSubmit(url, data, method);
			}
		},
		amendSubmit(url, data, method){//修改方法
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if(response.data.success){
	    			if(self.isGover){
	    				self.$vux.toast.text('修改系统完成', 'middle')
	    			}else if(self.isOperate){
	    				self.$vux.toast.text('修改操作完成', 'middle')
	    			}
					setTimeout(() => {
						self.$router.back(self.currentFrim.pathPage)
					},1500)
	    		}else if(response.data.status == 200){
	    			if(self.isServer){
	    				self.$vux.toast.text('修改服务器完成', 'middle')
	    			}
	    			setTimeout(() => {
						self.$router.back(self.currentFrim.pathPage)
					},1500)
	    		}else{
					self.$vux.toast.text(response.data.msg, 'middle')
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
		}
	},
}
</script>
<style lang="less" scoped>
	
</style>