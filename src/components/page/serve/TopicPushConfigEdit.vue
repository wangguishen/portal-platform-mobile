<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    	<div class="topicEdit">
				<group style="margin-top: 46px;">
				<x-input title="主题" text-align="right" placeholder="请输入主题" v-model="paraEdit.topic"></x-input>
				<x-input title="发送者" text-align="right" placeholder="请输入发送者" v-model="paraEdit.sender"></x-input>
				<x-input title="接收者" text-align="right" placeholder="请输入接收者" v-model="paraEdit.recevier"></x-input>
				<x-input title="备注" text-align="right" placeholder="请输入备注" v-model="paraEdit.remark"></x-input>
				<x-input title="服务器" text-align="right" placeholder="请输入服务器" v-model="paraEdit.servicer"></x-input>
				<x-input title="文档链接" text-align="right" placeholder="获取文档链接" v-model="paraEdit.url"></x-input>
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
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,Group,XInput,Cell,XButton}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,Group,XInput,Cell,XButton
	},
	data() {
		return {
			headObj: {
                title: '编辑主题',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            paraEdit:{
            	topic:'',
           		sender:'',
           		recevier:'',
           		remark:'',
           		url:'',
           		servicer:''
            },
            fileValue:'',
            folder:'',
            importUserUrl:'',
            tempObj:{},
		}
	},
	mounted() {
		let self = this;
		let topicJson  = JSON.parse(localStorage.getItem('editTopic'))
		console.log('topicJson',topicJson)
		self.paraEdit = topicJson;
		for(let key in topicJson){
			self.tempObj[key] = topicJson[key]
		}
		console.log('tempObj',self.tempObj)
		self.importUserUrl = self.LOGO_UPDATE_URL;
	},
	watch:{
		'paraEdit':{
			handler:function(val,old){
				let self = this;
				// let boolean = self.isEqual(self.tempObj,val)
				if (val.topic == self.tempObj.topic && val.sender == self.tempObj.sender && val.recevier == self.tempObj.recevier && val.remark == self.tempObj.remark && val.url == self.tempObj.url && val.servicer == self.tempObj.servicer) {
					self.rightObj.isMore = false
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep:true
		}
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
		submitUpload(){
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
							self.paraEdit.url = resUrl;
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
			if (self.paraEdit.topic == '') {
				self.$vux.toast.text('请输入主题','middle')
			}else if (self.paraEdit.sender == '') {
				self.$vux.toast.text('请输入发送者','middle')
			}else if (self.paraEdit.recevier == '') {
				self.$vux.toast.text('请输入接收者','middle')
			}else if (self.paraEdit.remark == '') {
				self.$vux.toast.text('请输入备注','middle')
			}else if (self.paraEdit.servicer == '') {
				self.$vux.toast.text('请输入服务器','middle')
			}else if (self.paraEdit.url == '') {
				self.$vux.toast.text('未获取到文档链接','middle')
			}else{
				let datas = {
					'id' : self.paraEdit.id,
					'topic' : self.paraEdit.topic,
					'sender' : self.paraEdit.sender,
					'recevier' : self.paraEdit.recevier,
					'remark' : self.paraEdit.remark,
					'url' : self.paraEdit.url,
					'servicer' : self.paraEdit.servicer
				}
				console.log('datas',datas)
				self.$axios({
					url:self.BP_HOST+'/messageApplication/updateMesseageApplication',
					method:'post',
					responstType:'json',
					data:datas
				})
				.then((res)=>{
					console.log('finish Success',res)
					if (res.data.status == 200) {
						self.$vux.toast.text('修改主题成功!','middle');
						self.$router.back('/TopicPushConfig')
					}else{
						self.$vux.toast.text('修改主题失败!','middle')
					}
					
				})
				.catch((res)=>{
					console.log('finish Error',res)
				})
			}
		},
		isEqual(a,b){//判断两个对象是否相等
		  	//如果a和b本来就全等
		  	if(a===b){
		    	//判断是否为0和-0
		    	return a !== 0 || 1/a ===1/b;
		  	}
		  	//判断是否为null和undefined
		  	if(a==null||b==null){
		    	return a===b;
		  	}
		  	//接下来判断a和b的数据类型
		  	var classNameA=toString.call(a),
		    classNameB=toString.call(b);
		  	//如果数据类型不相等，则返回false
		  	if(classNameA !== classNameB){
		    	return false;
		  	}
		  	//如果数据类型相等，再根据不同数据类型分别判断
		  	switch(classNameA){
		    	case '[object RegExp]':
		    	case '[object String]':
		    	//进行字符串转换比较
		    	return '' + a ==='' + b;
		    	case '[object Number]':
		    	//进行数字转换比较,判断是否为NaN
		    	if(+a !== +a){
		      		return +b !== +b;
		    	}
		    	//判断是否为0或-0
		    	return +a === 0?1/ +a === 1/b : +a === +b;
		    	case '[object Date]':
		    	case '[object Boolean]':
		    	return +a === +b;
		  	}
		  	//如果是对象类型
		  	if(classNameA == '[object Object]'){
		    	//获取a和b的属性长度
		    	var propsA = Object.getOwnPropertyNames(a),
		      	propsB = Object.getOwnPropertyNames(b);
		    	if(propsA.length != propsB.length){
		      		return false;
		    	}
		    	for(var i=0;i<propsA.length;i++){
			      	var propName=propsA[i];
			      	//如果对应属性对应值不相等，则返回false
			      	if(a[propName] !== b[propName]){
		        		return false;
			      	}
		    	}
		    	return true;
		  	}
		  	//如果是数组类型
		  	if(classNameA == '[object Array]'){
		    	if(a.toString() == b.toString()){
		      		return true;
		    	}
		    	return false;
		  	}
		},
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
	.topicEdit .weui-cell{
		height: 27px;
	}
	.topicEdit .formContent {
		display: inline-block;
		width: 60%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>