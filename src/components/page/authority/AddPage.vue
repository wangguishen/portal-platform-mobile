<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<!-- 注册系统 -->
			<div v-show="isGroup">
				<add-group :groupList="groupList"></add-group>
			</div>
			<!-- 新增功能 -->
			<div v-show="isOperate">
				<add-operate :operateList="operateList"></add-operate>
			</div>

			<!-- 新增管理员 -->
			<div v-show="isAdmin">
			    <add-admin :adminList="adminList"></add-admin>
			</div>

			<!-- 平台企业管理 -->
			<div v-show="isFlatcompany">
			    <add-flatcompany :flatcompanyList="flatcompanyList"></add-flatcompany>
			</div>
			
			<!-- 服务器监控 -->
			<div v-show="isServer">
			    <add-server :serverList="serverList"></add-server>
			</div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'				//头部
import addGroup from '../../common/addGroup'			//系统
import addOperate from '../../common/addOperate'		//功能
import addAdmin from '../terrace/AddAdmin'          	//新增管理员
import addFlatcompany from '../terrace/AddFlatcompany' 	//平台企业管理新增
import addServer from '../../common/addServer' 			//服务器监控
export default{
	components: {
        VHeader, addGroup, addOperate, addAdmin, addFlatcompany, addServer
    },
	data(){
		return{
			currentFrim:{},//当前集团
			addPage:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            //系统
            isGroup:false,
            groupList: {
            	name:'',
            	code:'',
            	type:'请选择权限模型',
            },
            //服务器监控
            isServer: false,
            serverList:{
            	name:'',
            	address:'',
            },
            //功能
            isOperate: false,
            operateList: {
            	name: '',
            	code: '',
            },
            show:true,
            text:'123',
            isAdmin: false, //新增管理员
            adminList: {
                comp_code: '',
                account: '',
                name: '',
                password: '',
                type: 'xz'
            },
            isFlatcompany: false, //平台企业管理企业注册
            flatcompanyList: {
            	id: '',
            	enterpriseCode: '',
            	name: '',
            	shortName: '',
            	isGroup: '',
            	enterpriseParentCode: 0,
            },
		}
	},
	mounted(){
		let self = this;
		self.addPage = JSON.parse(localStorage.getItem('addPage'));
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		console.log(self.addPage)
		self.headObj.title = self.addPage.title;
		if(self.addPage.type == "xt"){
			if(self.addPage.path == '/sysgover'){
				self.isGroup = true;
			}
		}else if(self.addPage.type == "cz"){
			self.isOperate = true;
		}else if(self.addPage.path == '/newadmin'){
		    self.isAdmin = true
		} else if(self.addPage.path == '/flatcompany'){
			// self.isFlatcompany = true
		} else if(self.addPage.type = "fwqjk"){
			self.isServer = true;
		}
	},
	methods:{
		backWay(data){
			let self = this;
			self.$router.back(self.addPage.path)
		},
		finish(data){
			let self = this;
			if(self.isGroup){
				self.group();
			}else if(self.isOperate){
				self.operate();
			}else if(self.isAdmin) {
				self.addAdminData()
			}else if(self.isFlatcompany) {
				console.log(self.flatcompanyList)
				// self.addFlatcompanyData()
			}else if(self.isServer){
				self.server();
			}
		},
		group() {//系统
			let self = this;
			if(self.groupList.name == ''){
				self.$vux.toast.text('请输入系统名称', 'middle')
			}else if(self.groupList.code == ''){
				self.$vux.toast.text("请输入系统编码", 'middle')
			}else if(self.groupList.type == '' || self.groupList.type == '请选择权限模型'){
				self.$vux.toast.text("请选择权限模型", 'middle')
			}else{
				let type = '';
				let url = "/UAMS/system/do_system_regist";
				if(self.groupList.type == "通用权限模型"){
					type = '0';
				}else if(self.groupList.type == "RBAC权限模型"){
					type = '1';
				}
				let data = {
    				"compCode": self.currentFrim.comp_code,
		    		"sysName": self.groupList.name,
		    		"sysCode": self.groupList.code,
		    		"sysModel": type,
    			}
    			self.addSubmit(url, data);
			}
		},
		operate(){//功能
			let self = this;
			if(self.operateList.name == ''){
				self.$vux.toast.text("请输入功能名称", 'middle')
			}else if(self.operateList.code == ''){
				self.$vux.toast.text("请输入功能编码", 'middle')
			}else{
				let url = "/UAMS/action/ajax/do_add_action";
				let data = {
					'compCode':self.currentFrim.comp_code,
		    		"actionName":self.operateList.name,
		    		"actionCode":self.operateList.code,
				}
				self.addSubmit(url, data);
			}
		},
		addAdminData() { //添加管理员
		  let self = this
		  if(!self.adminList.comp_code) {
		      self.$vux.toast.text("请输入企业编码", 'middle')
		  } else if(!self.adminList.account) {
		  	self.$vux.toast.text("请输入管理员帐号", 'middle')
		  } else if(!self.adminList.name) {
		  	self.$vux.toast.text("请输入管理员名称", 'middle')
		  } else if(!self.adminList.password) {
		  	self.$vux.toast.text("请输入管理员密码", 'middle')
		  } else {
		  	let url = '/UAMS/adminReq/addAdminManager'
		  	let data = {
		  	    'comp_code' : self.adminList.comp_code,
		  	    'account': self.adminList.account,
		  	    'name': self.adminList.name,
		  	    'password': self.adminList.password
		  	}
		  	self.addSubmit(url, data)
		  }
		},
		addFlatcompanyData() { //企业注册
		    let self = this
		    console.log(self.enterpriseParentCode)
		    console.log(self.flatcompanyList)
		    if(!self.flatcompanyList.enterpriseCode) {
		        self.$vux.toast.text("请输入企业编码", 'middle')
		    } else if(!self.flatcompanyList.name) {
		    	self.$vux.toast.text("请输入企业名称", 'middle')
		    } else if(!self.flatcompanyList.shortName) {
		    	self.$vux.toast.text("请输入企业简称", 'middle')
		    } else if(!self.flatcompanyList.isGroup) {
		    	self.$vux.toast.text("请选择是否集团企业", 'middle')
		    } else if(self.flatcompanyList.isGroup == '否' && self.flatcompanyList.enterpriseParentCode == 0){
				self.$vux.toast.text("请选择集团编码", 'middle')
		    } else {
		    	let url = '/basic-platform/addComp'
		    	let tempGroup = self.flatcompanyList.isGroup === '是' ? 'Y' : 'N'
		    	if(tempGroup == 'Y'){
		    		self.flatcompanyList.enterpriseParentCode = 0;
		    	}
		    	let data = {
		    	    'enterpriseCode': self.flatcompanyList.enterpriseCode,
		    	    'name': self.flatcompanyList.name,
		    	    'shortName': self.flatcompanyList.shortName,
		    	    'isGroup': tempGroup,
		    	    'enterpriseParentCode': self.flatcompanyList.enterpriseParentCode
		    	}
		    	// self.addSubmit(url, data)
		    }
		},
		server(){//服务器监控
			let self = this;
			if(self.serverList.name == ''){
				self.$vux.toast.text("请输入服务器名称", 'middle')
			}else if(self.serverList.address == ''){
				self.$vux.toast.text("请输入服务器地址", 'middle')
			}else{
				let url = "/basic-platform/server/add";
				let data = {
					id: '',
      				serviceName: self.serverList.name,
          			serviceNumber: self.serverList.address
				}
				self.addSubmit(url, data);
			}
		},
		addSubmit(url, data){
			let self = this;
			self.$axios({
	    		url: url,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if(response.data.success){
	    			if(self.isGroup){
	    				self.$vux.toast.text("注册系统完成", 'middle')
	    			}else if(self.isOperate){
	    				self.$vux.toast.text("新增功能完成", 'middle')
	    			}else if(self.isAdmin) {
	    				self.$vux.toast.text("添加成功", 'middle')
	    			}else if(self.isFlatcompany) {
	    				self.$vux.toast.text("添加成功", 'middle')
	    			}else if(self.isServer){
	    				self.$vux.toast.text("新增服务器成功", 'middle')
	    			}
					setTimeout(() => {
						self.$router.back(self.addPage.path)
					},1500)
	    		}else{
					self.$vux.toast.text(response.data.msg, 'middle')
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
		},
	},
}
</script>
<style lang="less" scoped>
	
</style>