<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="box">
				<x-input title="用户名称" text-align="right" placeholder="请输入用户名称" v-model="editUser.userName"></x-input>
				<!-- <popup-radio title="监控级别" :options="options" :placeholder="option" v-model="editUser.level" @on-change="changeLevel(editUser.level)"></popup-radio> -->
				<popup-picker title="监控级别" :data="options" v-model="compLevel" @on-change="changeLevel(compLevel)" :placeholder="option"></popup-picker>
				<x-input title="联系方式" text-align="right" :placeholder="phText" v-model="editUser.contactWay"></x-input>
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
			jsonLevel:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            editUser:{
            	userName:'',
            	level:'',
            	contactWay:''
            },
            action:0,//监测数据变化
            TempData:{},//临时数据
            compLevel:[],
            phText:'根据监控级别输入不同的联系方式',
            option:'请选择监控级别',
            options:[['一级','二级','三级']],
		}
	},
	mounted(){
		let self = this;
		let userList = JSON.parse(localStorage.getItem('userList'))
		console.log(userList)
		self.editUser = userList;
		self.headObj.title=userList.userName
		self.compLevel.push(self.editUser.level);
		self.jsonLevel = userList.level;
		self.TempData.userName = userList.userName;
		self.TempData.contactWay = userList.contactWay;
	},
	watch:{
		'editUser':{
			handler:function(val,old){
				let self = this;
				console.log(val,self.TempData)
				if (self.TempData.userName == val.userName && self.TempData.contactWay == val.contactWay) {
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
		'compLevel':{
			handler:function(val,old){
				let self = this;
				console.log(val[0])
				if (self.jsonLevel == val[0]) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		}
	},
	methods:{
		changeLevel(level){//改变监控级别
			let self = this;
			if (level == '一级') {
				self.phText="请输入电话号码"
			}else if (level == '二级') {
				self.phText="请输入号码、字号或邮件"
			}else if (level == '三级') {
				self.phText="请输入邮箱"
			}
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/UserLevelConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			let regPhone = /^1[34578]\d{9}$/;
			let regMail = /[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			if (self.editUser.userName == '') {
				self.$vux.toast.text('请输入用户名称','middle')
			}else if(self.compLevel == ''){
				self.$vux.toast.text('请输入监控级别','middle')
			}else if (self.editUser.contactWay == '') {
				self.$vux.toast.text('请输入联系方式','middle')
			}else {
				if(self.compLevel == '一级'){
					if (!regPhone.test(self.editUser.contactWay)) {
						self.$vux.toast.text('手机号格式不正确','middle');
						return
					}
				}else if(self.compLevel == '三级'){
					 if (!regMail.test(self.editUser.contactWay)) {
						self.$vux.toast.text('邮箱格式不正确','middle');
						return
					}
				}
				let datas={
					'id' : self.editUser.id,
					'userName' : self.editUser.userName,
					'level' : self.compLevel[0],
					'contactWay' : self.editUser.contactWay
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/muser/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('修改信息成功!','middle');
						self.$router.back('/UserLevelConfig');
					}else{
						self.$vux.toast.text('修改信息失败!','middle');
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
	.box .weui-cell{
		height: 27px;
	}
</style>