<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="boxAdd">
				<x-input title="实验室名称" text-align="right" placeholder="请输入实验室名称" v-model="addForm.deptName"></x-input>
				<popup-picker title="企业名称" :data="compList" v-model="compValue" @on-change="onChange" placeholder="请选择企业名称"></popup-picker>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group, XInput, PopupRadio, Toast,PopupPicker,Picker} from 'vux'
export default{
	components: {
        VHeader,Group, XInput, PopupRadio, Toast,PopupPicker,Picker
    },
	data(){
		return{
			headObj: {
                title: '添加实验室',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            options:[],
            compList:[],
            compValue:[],//选中的企业
            labObj:{
            	id:''
            },//备份对象
            addForm:{
            	deptName: '',
				enterpriseId : '',
            }
		}
	},
	mounted(){
		let self = this;
		self.queryComp();
	},
	methods:{
		queryComp(){//请求企业
			let self = this;
			let datas = {
				'compName':''
			}
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
					self.compList=[[]];
					compData.forEach(function(item,index){
						// item.key = item.id;
						// item.value = item.compName;
						self.$set(item,'name',item.compName);
						self.$set(item,'value',item.compName)
						self.compList[0].push(item)
					})
				}
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		change(){},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonLabConfig')
		},
		onChange(val){
			let self = this;
			console.log('onChange')
			console.log(val)
			self.compList[0].forEach(function(item,index){
				if (item.compName == val[0]) {
					self.labObj = item;
				}
			})
			console.log(self.labObj.id);
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.addForm.deptName == '') {
				self.$vux.toast.text('请输入实验室名称','middle');
			}else if(self.compValue == ''){
				self.$vux.toast.text('请输入企业名称','middle');
			}else{
				let datas = {
					deptName : self.addForm.deptName,
					enterpriseId : parseInt(self.labObj.id)
				}
				console.log(datas)
				self.$axios({
					url:'/basic-platform/dept/add',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('添加实验室成功!','middle');
						self.$router.back('/MonLabConfig')
					}else{
						self.$vux.toast.text('添加实验室失败!','middle');
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