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
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Toast, Group, XInput, Cell, PopupRadio, PopupPicker}from 'vux'
	export default{
		components:{
			VHeader,
			Group,
			XInput,
			Cell,
			PopupRadio,
			Toast,
			PopupPicker 
		},
		data(){
			return{
				jsonRequire:{},
				headObj:{
	                title:"",
	                isBack:true
            	},
	            rightObj:{
	                title:'完成',
	                isMore:false,
	                // icon: '&#xe6b9;',
	            },
	            option:[],
	            options:[['是','否']],
	            paras:{},
	            TempData:{},//临时数据
	            action:0,//监测是否操作
			}
		},
		mounted(){
			let self = this;
			let manageList = JSON.parse(localStorage.getItem('manageList'));
			self.paras=manageList;
			console.log('=',self.paras)
			self.headObj.title = manageList.pName;
			self.option.push(manageList.required);
			self.TempData.pName = manageList.pName;
			self.TempData.pType = manageList.pType;
			self.TempData.pIntroduce = manageList.pIntroduce;
			self.jsonRequire = manageList.required;
			self.TempData.sample = manageList.sample;
		},
		watch:{
			paras:{
				handler:function(val,old){
					let self = this;
					console.log('go watch methods');
					if (self.TempData.pName == val.pName && self.TempData.pType == val.pType && self.TempData.pIntroduce == val.pIntroduce && self.TempData.sample == val.sample) {
						self.rightObj.isMore = false;
					}else{
						self.rightObj.isMore = true;
					}
				},	
				deep:true
			},
			'option':{
				handler:function(val,old){
					let self = this;
					if (self.jsonRequire == val[0]) {
						self.rightObj.isMore = false;
					}else{
						self.rightObj.isMore = true;
					}
				},
				deep:true
			}
		},
		methods:{
			finish(data){
				let self = this;
				console.log(data)
				let types="put";
      			let urls="up";
      			let datas={
      				'id' : self.paras.id,
      				'pName' : self.paras.pName,
      				'pType' : self.paras.pType,
      				'pIntroduce' : self.paras.pIntroduce,
      				'required' : self.option[0],
      				'sample' : self.paras.sample,
      				'interId' : self.paras.interId
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
	      					type: 'text',
			                position: 'middle',
			                text: '修改参数成功!'
	      				},1500)
		    			self.$router.back('/Parameters');
		    		}else{
		    			self.$vux.toast.text(response.data.message, 'middle')
		    		}
	      		})
	      		.catch(function(response){
	      			console.log(response);
	      		})
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