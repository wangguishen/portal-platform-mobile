<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="boxAdd">
				<x-input title="项目名称" text-align="right" placeholder="请输入系统名称" v-model="paraAdd.systemName"></x-input>
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
			headObj: {
                title: '注册项目',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            paraAdd:{
            	systemName:'',
            	compName:'',
            	enterpriseId:''
            },
            enterpriseId:'',
            option:'',
            lab:[],
            sysObj:{
            	id:''
            },
            labObj:{
            	id:''
            },
            compValue:[],//选中企业
            options:[],
            optionLab:[],
		}
	},
	mounted(){
		let self = this;
		self.requestComp();
		// self.requestLab();
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
				if (res.data.status == 200) {
					let compData = res.data.data;
					self.options=[[]];
					compData.forEach(function(item,index){
						// item.key = item.id;
						// item.value = item.compName;
						// self.options.push(item)
						self.$set(item,'name',item.compName);
						self.$set(item,'value',item.compName);
						self.options[0].push(item)
					})
				}else{
					self.$vux.toast.text('暂无此接口','middle');
				}
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		compChange(val){//企业切换
			let self = this;
			console.log(val[0]);
			self.options[0].forEach(function(item,index){
				if (item.compName == val[0]) {
					self.sysObj = item;
				}
			})
			console.log(self.sysObj.id);
			self.requestLab();
		},
		labChange(val){//实验室切换
			let self = this;
			console.log(val[0]);
			self.optionLab[0].forEach(function(item,index){
				if (item.deptName == val[0]) {
					self.labObj = item;
				}
			})
			console.log(self.labObj.id)
		},
		// changeLab(id){
		// 	let self = this;
		// 	console.log(id)
		// 	if (id != '') {
		// 		self.requestLab(id);
		// 	}
		// },
		requestLab(){//请求实验室
			let self = this;
			let datas = {
				'id' : self.sysObj.id
			}
			console.log(datas)
			self.$axios({
				url:"/basic-platform/dept/sel?enterpriseId="+self.sysObj.id,
				mthod:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let labData = res.data.data;
				self.optionLab=[[]];
				labData.forEach(function(item,index){
					if(index == 0){
						self.lab = [];
						self.lab.push(item.deptName);
					}
					// item.key = item.id;
					// item.value = item.deptName;
					// self.optionLab.push(item);
					self.$set(item,'name',item.deptName);
					self.$set(item,'value',item.deptName);
					self.optionLab[0].push(item)
				})
			})
			.catch(function(res){
				console.log(res)
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonSysConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.paraAdd.systemName == '') {
				self.$vux.toast.text('请输入系统名称','middle');
			}else if (self.compValue == '') {
				self.$vux.toast.text('请选择企业名称!','middle');
			}else if (self.lab == '') {
				self.$vux.toast.text('请选择实验室!','middle');
			}else{
				let datas={
					'systemName' : self.paraAdd.systemName,
					'deptId' : self.labObj.id
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/system/add',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						let sysData = res.data.data;
						self.$vux.toast.text('新增系统成功!','middle')
						self.$router.back('/MonSysConfig')
					}else{
						self.$vux.toast.text('新增系统失败!','middle')
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