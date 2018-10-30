<template>
	<div>
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div style="margin-top: 46px;">
			<group class="box">
				<x-input title="参数名称" text-align="right" placeholder="请输入参数名称" v-model="paras.pName"></x-input>
				<x-input title="参数类型" text-align="right" placeholder="请输入参数类型" v-model="paras.pType"></x-input>
				<x-input title="介绍" text-align="right" placeholder="请输入介绍" v-model="paras.pIntroduce"></x-input>
				<popup-picker title="必填" :data="options" v-model="option" placeholder="请选择是否必填"></popup-picker>
				<x-input title="示例" text-align="right" placeholder="请输入示例" v-model="paras.sample"></x-input>
			</group>
		</div>
		<v-hint :state="state"></v-hint>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import VHint from '../../common/Hint'
	import {Group, XInput, Cell, PopupRadio, Toast, PopupPicker}from 'vux'
	export default{
		components:{
			VHeader,
			Group,
			XInput,
			Cell,
			PopupRadio,
			VHint,
			Toast,
			PopupPicker 
		},
		data(){
			return{
				headObj:{
	                title:"新增参数",
	                isBack:true
            	},
	            rightObj:{
	                title:'完成',
	                isMore:true,
	                // icon: '&#xe6b9;',
	            },
	            option:[],
	            options:[['是','否']],
	            paras:{
	            	pName:'',
	            	pType:'',
	            	pIntroduce:'',
	            	sample:''
	            },
	            portList:{},
	            //提示框
	            state:{
	            	name: "",
	            	isShow: false,
	            }
			}
		},
		mounted(){
			let self = this;
			let portList = JSON.parse(localStorage.getItem('portList'));
			console.log('=',portList);
			self.portList = portList;
		},
		methods:{
			finish(data){//完成新增参数
				let self = this;
				if (self.paras.pName == '') {
					self.$vux.toast.text('请输入参数名称','middle');
				}else if (self.paras.pType == '') {
					self.$vux.toast.text('请输入参数类型','middle');
				}else if (self.paras.pIntroduce == '') {
					self.$vux.toast.text('请输入介绍','middle');
				}else if (self.option == '') {
					self.$vux.toast.text('请选择是否必填','middle');
				}else if (self.paras.sample == '') {
					self.$vux.toast.text('请输入示例','middle');
				}else{
					let types="post";
	      			let urls="add";
	      			let datas={
	      				'pName' : self.paras.pName,
	      				'pType' : self.paras.pType,
	      				'pIntroduce' : self.paras.pIntroduce,
	      				'required' : self.option[0],
	      				'sample' : self.paras.sample,
	      				'interId' : self.portList.id
	      			}
	      			console.log(datas);
	      			self.$axios({
	      				url:"/basic-platform/parm/"+urls,
	      				method:types,
	      				responseType:'json',
	      				data:datas
	      			})
	      			.then(function(response){
	      				console.log(response);
	      				if(response.data.status == 200){
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'新增参数成功!'
							},1500)
							self.$router.back('/Parameters')
		    			}
	      			})
	      			.catch(function(response){
	      				console.log("error")
	      			})
				}	
			},
			backWay(data){
	        	let self = this;
	            console.log(data)
	            self.$router.back('/Parameters');
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