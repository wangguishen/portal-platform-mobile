<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top">
			<group class="paraAdd">
				<x-input title="参数名称" text-align="right" placeholder="请输入参数名称" v-model="paraAdd.paramName"></x-input>
				<x-input title="字段" text-align="right" placeholder="请输入字段" v-model="paraAdd.field"></x-input>
				<x-input title="示例" text-align="right" placeholder="请输入示例" v-model="paraAdd.sample"></x-input>
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
			paraList:{},
			headObj: {
                title: '注册参数',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            },
            paraAdd:{
            	paramName:'',
            	field:'',
            	sample:''
            },
		}
	},
	mounted(){
		let self = this;
		let linkList = JSON.parse(localStorage.getItem('linkList'))
		console.log(linkList)
		self.paraList = linkList;
	},
	methods:{
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/ParameterDetails')
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.paraAdd.paramName == '') {
				self.$vux.toast.text('请输入参数名称!','middle');
			}else if(self.paraAdd.field == ''){
				self.$vux.toast.text('请输入字段!','middle');
			}else if(self.paraAdd.sample == ''){
				self.$vux.toast.text('请输入示例!','middle');
			}else{
				let datas = {
					'linkId' : self.paraList.id,
					'paramName' : self.paraAdd.paramName,
					'field' : self.paraAdd.field,
					'sample' : self.paraAdd.sample
				}
				console.log(datas)
				self.$axios({
					url:'/basic-platform/param/add',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log(res)
					if (res.status == 200) {
						self.$vux.toast.text('添加参数成功!','middle');
						self.$router.back('/ParameterDetails');
					}else{
						self.$vux.toast.text('添加参数失败!','middle');
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
	.paraAdd .weui-cell{
		height: 27px;
	}
</style>