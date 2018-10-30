<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div class="fileBox" style="margin-top: 66px">
	    	<group>
	    		<cell title="附件" @click.native.stop="openFile">
	    			<form id="formSubmit">
	    				<input ref="iptFile" id="imFile" class="inputFile" style="display: none;" type="file" @change="importExcel($event.target)" name="file" />
		    			<span class="formContent">{{fileValue}}</span>
		    			<span class="iconfont" style="color: #8470FF; display: inline-block; margin-bottom: 8px;" @click.self="openFile()">&#xe605;</span>
	    			</form>
	    		</cell>
	    	</group>
			<x-button mini style="float: right;margin: 10px 10px;" @click.native="downloadExcelTemplate">下载Excel模板</x-button>
	    	<canvas ref="canvas" style="height: 0"></canvas> 
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Toast,XButton,Group,Cell}from 'vux'
export default {
	components: {
		VHeader,Toast,XButton,Group,Cell
	},
	data() {
		return {
			headObj: {
                title: '企业用户导入',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "上传",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            results:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	adminSessionId:'',
           	importUserUrl:'',
           	imFile:'',//导入文件
           	formSubmit:'',
           	fileValue:'',
           	folder:'',
		}
	},
	mounted() {
		let self = this;
		self.adminSessionId = localStorage.getItem('adminSessionId')
		console.log('adminSessionId',self.adminSessionId)
		self.importUserUrl = '/account_auth_admin/user-api.importUser?sessionId=' + self.adminSessionId
		// self.imFile = document.getElementById('imFile');
		
	},
	methods: {
		openFile(){
			let self = this;
			console.log("go openFile")
        	self.$refs.iptFile.click();
		},
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/Jurisdiction');
		},
		finish(data){//上传到服务器
			let self = this;
			console.log(data)
			if(self.fileValue == ''){
				self.$vux.toast.text('您没有选择文件','middle')
				return
			}else{
				let formData = new FormData(document.getElementById('formSubmit'));
	            // let url = '/vr-content/file/upload'
	            if (self.folder == '' || self.folder == undefined) {
	            	self.$vux.toast.text('您没有选择文件!','middle');
	            }else{
	            	self.$axios.create({
		                headers: {
		                    'Content-Type': 'multipart/form-data'
		                }
		            })
		            .post(self.importUserUrl,formData)
		            .then(function(res) {
		                console.log("success", res);
		                if (res.data.status == 1) {
		                	self.$vux.toast.text('上传成功','middle');
		                }else if(res.data.status == 2){
		                	self.$vux.toast.text(res.data.message,'middle');
		                	self.fileValue='';
		                }
		            })
		            .catch(function(res) {
		                console.log("error", res);
		            })
	            }
			}
		},
		importExcel(obj){
			let self = this;
			console.log('obj',obj)
			console.log('obj.files[0]',obj.files[0])
			// console.log(self.$refs.iptFile)
			let file = obj.files[0];
			self.folder = file;
			console.log('file.name',file.name)
			self.fileValue = file.name;
			/*获取文件后缀名types*/
			let types = file.name.split('.').pop();
			console.log('types',types)

			const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(item => item === types);

			const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

			const isLt5M = file.size / 1024 / 1024 < 5

			console.log("isLt5M",isLt5M, "fileType",fileType)
			if (!fileType) {
				self.$vux.toast.text('只能上传excel文件!','middle')
				setTimeout(()=>{
					self.fileValue='';
				},1000)
				return
			}
			if (!isLt5M) {
				self.$vux.toast.text('文件大小不能超过5M!','middle')
				setTimeout(()=>{
					self.fileValue='';
				},1000)
				return
			}
		},
		downloadExcelTemplate(){//下载Excel模板
			let self = this;
			console.log('downloadExcelTemplate methods')
			let canvas = self.$refs.canvas
            canvas.toBlob(function(blob) {
                var url = self.EXCEL_TEMPLATE_URL
                var a = document.createElement('a')
                a.download = 'canvas'
                a.href = url
                a.click()
                URL.revokeObjectURL(url)
            })
		},
		test() {
		    console.log("go test methods")
		}
	}
}
</script>

<style lang="less" scoped>
	/* .fileBox .inputFile {
		margin: 8px 6px;
	} */
	.fileBox .weui-cell {
		height: 36px;
	}
	.fileBox .formContent {
		display: inline-block;
		width: 60%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	/* .fileBox .iconfont{
		display: inline;
		width: 10%;
		overflow: hidden;
		margin-top: -8px;
	} */
</style>