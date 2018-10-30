<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div style="margin-top: 46px;">
	    	<group class="boxAdd">
	    		<x-input title="关联主题" text-align="right" :readonly="true" v-model="relateTopic"></x-input>
				<popup-picker title="服务名称" :data="optionServe" v-model="serveValue" @on-change="serveChange" placeholder="请选择服务名称"></popup-picker>
				<x-input title="接口名称" text-align="right" placeholder="请输入接口名称" v-model="portName"></x-input>
				<popup-picker title="请求方式" :data="optionRequest" v-model="requestValue" @on-change="requestChange" placeholder="请选择请求方式"></popup-picker>
				<x-input title="接口链接" text-align="right" placeholder="请输入接口链接" v-model="portUrl"></x-input>
				<x-textarea title="接口简介" :rows="1" :autosize="true" placeholder="请输入接口简介" v-model="portDesc"></x-textarea>
				<x-textarea title="请求示例" :rows="1" :autosize="true" placeholder="请输入请求示例" v-model="portReqData"></x-textarea>
				<x-textarea title="返回示例" :rows="1" :autosize="true" placeholder="请输入返回示例" v-model="portRepData"></x-textarea>
			</group>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,PopupPicker,Group,XTextarea,XInput}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,PopupPicker,Group,XTextarea,XInput
	},
	data() {
		return {
			headObj: {
                title: '注册关联主题',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            relateTopic:'',//关联的主体名
            optionServe:[],//服务名称数组
            serveValue:[],//选中的服务
            portName:'',//接口名称
            optionRequest:[['PUT','POST','GET','DELETE']],//请求方式数组
            requestValue:[],
            portUrl:'',//接口链接
            portDesc:'',//接口简介
            portReqData:'',//请求示例
            portRepData:'',//返回示例
            serveObj:{
            	id:''
            },

		}
	},
	mounted() {
		let self = this;
		let assoTopicJson = JSON.parse(localStorage.getItem('associateTopic'))
		console.log('assoTopicJson',assoTopicJson)
		self.relateTopic = assoTopicJson.topic
		self.requestServe();
	},
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/TopicPushConfig');
		},
		requestServe(){
			let self = this;
			self.$axios({
      			url: self.BP_HOST+'/module/sel',
      			method: 'get',
	    		responseType: 'json',
	    		data: {
	    			'serviceName' : ''
	    		}
	    	})
	    	.then((res)=>{
	    		console.log('requestServe Success',res)
	    		if (res.data.status == 200) {
	    			let resData = res.data.data;
	    			self.optionServe = [[]]
	    			if (resData) {
	    				resData.forEach(function(item,index){
	    					self.$set(item,'name',item.serviceName)
	    					self.$set(item,'value',item.serviceName)
	    					self.optionServe[0].push(item)
	    				})
	    			}else{
	    				self.$vux.toast.text('该接口下暂无参数!','middle')
	    			}
	    		}else{
	    			self.$vux.toast.text('服务器信息错误!','middle')
	    		}
	    	})
	    	.catch((res)=>{
	    		console.log('requestServe Error',res)
	    	})
		},
		serveChange(val){
			let self = this;
			console.log(val)
			self.optionServe[0].forEach(function(item,index){
				if (item.serviceName == val[0]) {
					self.serveObj = item
				}
			})
			console.log('serveObjId',self.serveObj.id)//服务名id
		},
		requestChange(val){
			let self = this;
			console.log('requestChange val',val[0])
			console.log(self.requestValue[0])
		},
		finish(){
			let self = this;
			if (self.serveValue == '') {
				self.$vux.toast.text('请选择服务名称!','middle')
			}else if (self.portName == '') {
				self.$vux.toast.text('请输入接口名称!','middle')
			}else if (self.requestValue[0] == '') {
				self.$vux.toast.text('请选择请求方式!','middle')
			}else if (self.portUrl == '') {
				self.$vux.toast.text('请输入请求链接!','middle')
			}else if(self.portDesc == '') {
				self.$vux.toast.text('请输入接口简介!','middle')
			}else if (self.portReqData == '') {
				self.$vux.toast.text('请输入请求示例!','middle')
			}else if (self.portRepData == '') {
				self.$vux.toast.text('请输入返回示例!','middle')
			}else {
				let datas = {
					'mId' : parseInt(self.serveObj.id),
					'interName' : self.portName,
					'interMethod' : self.requestValue[0],
					'url' : self.portUrl,
					'introduce' : self.portDesc,
					'repData' : self.portRepData,
					'reqData':self.portReqData,
					'topic': self.relateTopic
				}
				console.log('datas',datas)
				self.$axios({
					url:self.BP_HOST+'/inter/add',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then((res)=>{
					console.log('finish Success',res)
					if (res.data.status == 200) {
						self.$vux.toast.text('注册关联主题成功!','middle')
						self.$router.back('/TopicPushConfig')
					}else{
						self.$vux.toast.text('注册关联主题失败!','middle')
					}
				})
				.catch((res)=>{
					console.log('finish Error',res)
				})
			}	
		},
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
</style>