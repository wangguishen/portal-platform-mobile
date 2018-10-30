<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="box">
				<x-input title="用户名称" text-align="right" placeholder="请输入用户名称" v-model="addUser.userName"></x-input>
				<!-- <popup-radio title="监控级别" :options="options" :placeholder="option" v-model="addUser.level" @on-change="changeLevel(addUser.level)"></popup-radio> -->
				<popup-picker title="监控级别" :data="options" v-model="compLevel" @on-change="changeLevel(compLevel)" :placeholder="option"></popup-picker>
				<x-input title="联系方式" text-align="right" :placeholder="phtext" v-model="addUser.contactWay"></x-input>
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
                title: '添加用户',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            addUser:{
            	userName:'',
            	level:'',
            	contactWay:'',
            },
            compLevel:[],//选中的监控级别
            phtext:'根据监控级别输入不同的联系方式',
            option:'请选择监控级别',
            options:[['一级','二级','三级']],
		}
	},
	mounted(){

	},
	methods:{
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/UserLevelConfig')
		},
		changeLevel(level){
			let self = this;
			if (level == '一级') {
				self.phtext="请输入手机号码"
			}else if (level == '二级') {
				self.phtext="请输入号码、字号或邮件"
			}else if (level == '三级') {
				self.phtext="请输入邮箱"
			}
			console.log(self.phtext)
		},
		finish(data){
			let self = this;
			let regPhone = /^1[34578]\d{9}$/;
			let regMail = /[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			if (self.addUser.userName == '') {
				self.$vux.toast.text('请输入用户名称','middle')
			}else if(self.compLevel == ''){
				self.$vux.toast.text('请选择监控级别','middle')
			}else if (self.addUser.contactWay == '') {
				self.$vux.toast.text('请输入联系方式','middle')
			}else{
				if(self.compLevel == '一级'){
					if (!regPhone.test(self.addUser.contactWay)) {
						self.$vux.toast.text('手机号格式不正确','middle')
						return 
					}
				}else if(self.compLevel == '三级'){
					 if (!regMail.test(self.addUser.contactWay)) {
						self.$vux.toast.text('邮箱格式不正确','middle')
						return
					}
				}
				let datas={
					'userName' : self.addUser.userName,
					'level' : self.compLevel[0],
					'contactWay' : self.addUser.contactWay
				}
				console.log(datas)
				self.$axios({
					url:'/basic-platform/muser/add',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if(res.status == 200){
						self.$vux.toast.text('添加成功!','middle');
						self.$router.back('/UserLevelConfig');
					}else{
						self.$vux.toast.text('添加失败!','middle');
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