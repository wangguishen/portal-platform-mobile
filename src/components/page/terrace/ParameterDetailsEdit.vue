<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="paraEdit">
				<x-input title="参数名称" text-align="right" placeholder="请输入参数名称" v-model="paraEdit.paramName"></x-input>
				<x-input title="字段" text-align="right" placeholder="请输入字段" v-model="paraEdit.field"></x-input>
				<x-input title="示例" text-align="right" placeholder="请输入示例" v-model="paraEdit.sample"></x-input>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Group, XInput, Toast} from 'vux'
export default{
	components: {
        VHeader,Group, XInput, Toast
    },
	data(){
		return{
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            paraEdit:{
            	paramName:'',
            	field:'',
            	sample:''
            },
            TempData:{},//临时数据
            act:0
		}
	},
	mounted(){
		let self = this;
		let paraslists = JSON.parse(localStorage.getItem('parasList'));
		console.log(paraslists)
		self.paraEdit = paraslists;
		self.headObj.title = paraslists.paramName;
		self.TempData.paramName = paraslists.paramName;
		self.TempData.field = paraslists.field;
		self.TempData.sample = paraslists.sample;
	},
	watch:{
		'paraEdit':{
			handler:function(val,old){
				let self = this;
				console.log(val,'-----------',self.TempData);
				if (self.TempData.paramName == val.paramName && self.TempData.field == val.field && self.TempData.sample == val.sample) {
					self.act = 0;
				}
				self.act++;
				if (self.act == 1) {
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		}
	},
	methods:{
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/parameterDetails')
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.paraEdit.paramName == '') {
				self.$vux.toast.text('请输入参数名称!','middle');
			}else if(self.paraEdit.field == ''){
				self.$vux.toast.text('请输入字段!','middle');
			}else if(self.paraEdit.sample == ''){
				self.$vux.toast.text('请输入示例!','middle');
			}else{
				let datas = {
					'id' : self.paraEdit.id,
					'paramName' : self.paraEdit.paramName,
					'field' : self.paraEdit.field,
					'sample' : self.paraEdit.sample
				}
				console.log(datas);
				self.$axios({
					url:'/basic-platform/param/up',
					method:'put',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('修改参数成功!','middle');
						self.$router.back('/ParameterDetails');
					}else{
						self.$vux.toast.text('修改参数失败!','middle');
					}
				})
				.catch(function(res){
					console.log(res)
				})
			}
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.paraEdit .weui-cell{
		height: 27px;
	}
</style>