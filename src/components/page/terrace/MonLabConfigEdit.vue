<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="boxAdd">
				<x-input title="实验室名称" text-align="right" placeholder="请输入实验室名称" v-model="editForm.deptName"></x-input>
				<popup-picker title="企业名称" :data="options" v-model="compValue" @on-change="compChange" placeholder="请选择企业名称"></popup-picker>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group, XInput, Toast,PopupPicker} from 'vux'
export default{
	components: {
        VHeader,Group, XInput, Toast,PopupPicker
    },
	data(){
		return{
			headObj: {
                title: '修改实验室',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            compObj:{
            	id:''
            },
            compValue:[],
            options:[],
            editForm:{},
            TempData:{},//临时数据
            jsonComp:{},
            action:0,//检测是否有操作
		}
	},
	mounted(){
		let self = this;
		let labList = JSON.parse(localStorage.getItem('labList'));
		self.requestComp();
		console.log(labList)
		self.$nextTick(()=>{
			self.editForm = labList;
			// self.compValue.push(labList.comp_name);
			self.jsonComp = labList.comp_name;
			self.TempData.deptName = self.editForm.deptName;
			self.TempData.comp_name = self.editForm.comp_name;
		})
	},
	watch:{
		'editForm':{
			handler:function(val,old){
				let self = this;
				console.log('go watch methods');
				console.log(val,'---------',self.TempData)
				if (self.TempData.deptName == val.deptName && self.TempData.comp_name == val.comp_name) {
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
				if (res.data.status == 200) {
					self.options=[[]];
					let compData = res.data.data;
					compData.forEach(function(item,index){
						// item.key = item.id;
						// item.value = item.compName;
						// self.options.push(item)
						if(item.compName == self.editForm.comp_name){
							self.compValue.push(item.compName);
						}
						self.$set(item,'name',item.compName);
						self.$set(item,'value',item.compName);
						self.options[0].push(item);
					})
				}	
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		compChange(val){
			let self = this;
			console.log('++++++',self.options)
			self.options[0].forEach(function(item,index){
				if (item.compName == val[0]) {
					self.compObj = item;
				}
			})
			console.log(self.compObj.id);
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonLabConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.editForm.deptName == '') {
				self.$vux.toast.text('请输入实验室','middle');
			}else if (self.compValue == '') {
				self.$vux.toast.text('请选择企业','middle');
			}else{
				let datas={
					'id' : self.editForm.id,
					'deptName' : self.editForm.deptName,
					'enterpriseId' : self.compObj.id
				}
				console.log(datas)
				self.$axios({
					url:'/basic-platform/dept/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('修改成功!','middle');
						self.$router.back('/MonLabConfig')
					}else{
						self.$vux.toast.text('修改失败!','middle');
					}
				})
				.catch(function(res){
					console.log(res);
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