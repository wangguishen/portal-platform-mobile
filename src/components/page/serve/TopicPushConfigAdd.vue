<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div class="boxAdd">
			<group style="margin-top: 46px;">
				<x-input title="主题" text-align="right" placeholder="请输入主题" v-model="paraAdd.topic"></x-input>
				<x-input title="发送者" text-align="right" placeholder="请输入发送者" v-model="paraAdd.sender"></x-input>
				<x-input title="接收者" text-align="right" placeholder="请输入接收者" v-model="paraAdd.recevier"></x-input>
				<x-input title="备注" text-align="right" placeholder="请输入备注" v-model="paraAdd.remark"></x-input>
				<x-input title="服务器" text-align="right" placeholder="请输入服务器" v-model="paraAdd.servicer"></x-input>
				<x-input title="文档链接" text-align="right" placeholder="获取文档链接" readonly v-model="paraAdd.url"></x-input>
				<cell title="上传文档" @click.native.stop="openFile">
	    			<form id="formSubmit">
	    				<input ref="iptFile" id="imFile" class="inputFile" style="display: none;" type="file" @change="importExcel($event.target)" name="file" />
	    				<input type="text" name="module_id" value="1" style="display: none;">
		    			<span class="formContent">{{fileValue}}</span>
		    			<span class="iconfont" style="color: #8470FF; display: inline-block; margin-bottom: 8px;" @click.self="openFile()">&#xe605;</span>
	    			</form>
	    		</cell>
			</group>
			<x-button mini style="float: right;margin: 10px 10px;" @click.native="submitUpload">文档上传服务器</x-button>
		</div>
	    <!-- <load-more :show-loading="showLoad" :tip="loadText"></load-more> -->
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore,XInput,Toast,Group,Cell,XButton}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore,Toast,XInput,Group,Cell,XButton
	},
	data() {
		return {
			headObj: {
                title: '新增主题',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "完成",
            	// icon:'&#xe6b9;'
            },
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	paraAdd:{//新增主题对象
           		topic:'',
           		sender:'',
           		recevier:'',
           		remark:'',
           		url:'',
           		servicer:''
           	},
           	fileValue:'',
           	importUserUrl:'',
           	folder:'',
		}
	},
	mounted() {
		let self = this;
		self.importUserUrl = self.LOGO_UPDATE_URL;
	},
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/TopicPushConfig');
		},
		openFile(){
			let self = this;
			self.$refs.iptFile.click();
		},
		importExcel(event){
			let self = this;
			console.log(event.files[0])
			let file = event.files[0];
			self.folder = file;
			console.log('file.name',file.name)
			self.fileValue = file.name;
			let types = file.name.split('.').pop();

			const fileType = ['docx','dotx','doc','dot','docm','dotm'].some(item => item === types)

            const isLt5M = file.size / 1024 / 1024 < 5

            console.log('fileType',fileType,'isLt5M',isLt5M)

            if (!fileType) {
            	self.$vux.toast.text('只能上传word文档!','middle');
            	setTimeout(()=>{
					self.fileValue='';
				},1000)
				return
            }
            if (!isLt5M) {
            	self.$vux.toast.text('文件大小不能超过5M!','middle');
            	setTimeout(()=>{
					self.fileValue='';
				},1000)
				return
            }
		},
		submitUpload(){//文档上传服务器获取url
			let self = this;
			if (self.fileValue = '') {
				self.$vux.toast.text('您没有选择文件!','middle');
				return
			}else{
				let formData = new FormData(document.getElementById('formSubmit'));
				if (self.folder == '' || self.folder == undefined) {
					self.$vux.toast.text('您没有选择文件!','middle');
				}else{
					self.$axios.create({
						headers: {
		                    'Content-Type': 'multipart/form-data'
		                }
					})
					.post(self.importUserUrl,formData)
					.then(function(res){
						console.log('submitUpload Success',res)
						if (res.data.returncode == 0) {
							let resUrl = res.data.data[0].file_url;
							self.paraAdd.url = resUrl;
							return
						}
					})
					.catch(function(res){
						console.log('submitUpload Error',res)
					})
				}
			}
		},
		finish(){
			let self = this;
			if (self.paraAdd.topic == '') {
				self.$vux.toast.text('请输入主题','middle')
			}else if (self.paraAdd.sender == '') {
				self.$vux.toast.text('请输入发送者','middle')
			}else if (self.paraAdd.recevier == '') {
				self.$vux.toast.text('请输入接收者','middle')
			}else if (self.paraAdd.remark == '') {
				self.$vux.toast.text('请输入备注','middle')
			}else if (self.paraAdd.servicer == '') {
				self.$vux.toast.text('请输入服务器','middle')
			}else if (self.paraAdd.url == '') {
				self.$vux.toast.text('未获取到文档链接','middle')
			}else {
				let datas = {
					'topic' : self.paraAdd.topic,
					'sender' : self.paraAdd.sender,
					'recevier' : self.paraAdd.recevier,
					'remark' : self.paraAdd.remark,
					'url' : self.paraAdd.url,
					'servicer' : self.paraAdd.servicer
				}
				console.log('datas',datas)
				self.$axios({
					url:self.BP_HOST+'/messageApplication/addMessageApplication',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then((res)=>{
					console.log('finish Success',res)
					if (res.data.status == 200) {
						self.$vux.toast.text('新增主题成功!','middle')
						self.$router.back('/TopicPushConfig')
					}else{
						self.$vux.toast.text('新增主题失败!','middle')
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
	.boxAdd .weui-cell{
		height: 27px;
	}
	.boxAdd .formContent {
		display: inline-block;
		width: 60%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
<style>
	.boxAdd .weui-cell{
		height: 27px;
	}
</style>