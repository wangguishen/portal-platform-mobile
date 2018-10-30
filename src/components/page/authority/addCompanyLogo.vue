<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div style="margin-top: 44px;" :class="{'tabSpace':tabSpace}">
	    	<group>
                <popup-picker
                    title="企业" 
                    :data="screenArr" 
                    placeholder='选择企业' 
                    v-model="currentVal"
                    @on-change="shadowChange">
                </popup-picker>
                <popup-picker
                    title="选择LOGO" 
                    :data="logoArr" 
                    placeholder='选择LOGO版本/尺寸/颜色' 
                    v-model="currentlogo"
                    @on-change="logoChange"
                    :display-format="logoFormat">
                </popup-picker>
            </group>
	    	<!-- 小logo -->
	    	<div>
	    		<div class="logoBox" v-for="(item,index) in hasAlreadyLogo">
		    		<!-- <img :src="item.logo" ref="img" class="avatar" :class="item.logoClass">
		    		<div style="text-align:center;font-size: 12px;color: #1f2d3d;">
		    			{{noPicInfo}}
		    		</div> -->
					<group>
						<cell title="LOGO" is-link @click.native="selectImg(item,index)">
							<div>
								<span class="iconfont" style="color: #ccc;" v-show="!item.logo">&#xe658;</span>
								<img :src="item.logo" v-show="item.logo" width="30" height="30">
							</div>
						</cell>
					</group>
					<!-- 预览logo -->
					<div v-transfer-dom>
					    <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
					        <div class="img-box" v-if="currentItem.logo">
					          	<img :src="currentItem.logo" style="max-width:100%;display: block;width:100%;">
					          	<div @click="showHideOnBlur=false">
						          	<icon type="cancel" style="font-size: 2.5rem;"></icon>
						        </div>
					        </div>
					        <div v-else>
					        	<div style="width: 100%;height: 140px;background: #ccc;line-height: 140px;margin: 0 auto;">暂无LOGO</div>
					        	<div @click="showHideOnBlur=false">
						          	<icon type="cancel" style="font-size: 2.5rem;"></icon>
						        </div>
					        </div>
					    </x-dialog>
				    </div>
				    <!-- 提示弹框 -->
					<div v-transfer-dom>
				      	<popup v-model="showLogo">
					        <div class="popup">
						        <div style="width: 96%;background-color:#fff;margin:0 auto;border-radius:5px;padding-top:10px;">
						         	<div style="padding:20px 15px;">
						          		<x-button style="margin-bottom: 15px;" @click.native="preview" plain>预览</x-button>
						          		<form action="" id="formSubmit">
						          			<input ref="iptFile" id="imFile" class="inputFile" style="display: none;" type="file" @change="importExcel($event.target)" name="file" />
						          			<input type="text" style="display: none;" name="module_id" value="1">
						          			<label for="imFile" style="display:block;width: 368px;height: 46px;text-align: center;line-height: 46px;border: 1px solid #000; border-radius: 5px;font-size: 18px;">
						          				编辑
						          			</label>
						          		</form>
						          		<x-button style="margin-top: 15px;" @click.native="logoDelete(item)" plain>删除</x-button>
						          		<x-button @click.native="showLogo = false">取消</x-button>
						         	</div>
						        </div>
					        </div>
				      	</popup>
		    		</div>
		    	</div>
	    	</div>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,Group,PopupPicker,XButton,Cell,Popup,TransferDom,XDialog,Icon}from 'vux'

let versions =[
	{
		name:' ',
		value:' '
	},
	{
		name:'PC端',
		value:'PC'
	},
	{
		name:'Android端',
		value:'Android'
	},
	{
		name:'IOS端',
		value:'IOS'
	}
]

let photoSizeList = [
	{
		name:' ',
		value:' '
	},
	{
		name:'大',
		value:'l'
	},
	{
		name:'中',
		value:'m'
	},
	{
		name:'小',
		value:'s'
	}
] 

let color = [
	{
		name:' ',
		value:' '
	},
	{
		name:'彩色',
		value:'colorful'
	},
	{
		name:'黑白',
		value:'black_white'
	}
]

export default {
	directives: {
        TransferDom
    },
	components: {
		VHeader, Toast,Group,PopupPicker,XButton,Cell,Popup,TransferDom,XDialog,Icon
	},
	data() {
		return {
			headObj: {
                title: '变更企业LOGO',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "上传",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            screenArr:[],//企业集合
            currentVal:[],//企业选中的值
            jsonData:{},
            compCode:'',
            backupAdmin:[],
            enterprise: {},//当前选中的企业
            logoArr:[
            	versions,
            	photoSizeList,
            	color
            ],//LOGO集合
            currentlogo:[],
            logoShow:false,
            logoSrc:'',
            fileValue:'',//logo名
            hasAlreadyLogo:[],//已有logo
            logos:[],//logo集合
            // imgBoxShow:false,
            folder:'',
            states:0,//判断是上传还是编辑状态码  0: 上传  1：编辑
            importUserUrl:'',
            noPicInfo:'',
            noPicUrl:'',
            succUrl:'',//上传成功返回的URl
            showLogo:false,//点击logo缩略图显示提示框
            showHideOnBlur:false,//预览框
            showEditLogo:false,//编辑框
            currentItem:{},
            onlineURL:{},
            logoTitle:'',
		}
	},
	mounted() {
		let self = this;
		self.jsonData = JSON.parse(localStorage.getItem('jsonData'))
		let uams = JSON.parse(localStorage.getItem('uams'))
		self.compCode = JSON.parse(localStorage.getItem('compCode'))
		console.log('jsonData',self.jsonData,'uams',uams,'compCode',self.compCode)
		self.importUserUrl = '/vr-content/file/upload'
		self.noPicUrl = "../../../assets/noPic.png"
		if (uams == self.PLAT_ADMIN) {
			self.adminQueryData()
		}else{
			self.queryAllGroup()
		}
	},
	methods: {
		adminQueryData(){
			let self = this;
			self.$axios({
				url:'/UAMS/company/do_comp_query?pageSize=100000',
				responseType:'json',
				method:'post',
				data:{
					"compName":""
				}
			})
			.then(function(res){
				console.log('adminQueryData',res)
				if (res.data.success) {
					let compAllData = res.data.data.list;
					self.screenArr = [];
					let tempArr = []
					compAllData.forEach(function(item,index){
						self.backupAdmin.push(item)
						tempArr.push(item.comp_name)
					})
					self.$nextTick(()=>{
						self.screenArr.push(tempArr)
					})
				}else{
					self.$vux.toast.text(res.data.msg,'middle');
				}
			})
			.catch(function(res){
				console.log('adminQueryData Error',res)
			})
		},
		queryAllGroup(){
			let self = this;
			self.$axios({
				url:'/UAMS/company/do_comp_query',
				responseType:'json',
				method:'post',
				data:{
					'compCode' : self.jsonData.compCode,
					'type' : 0
				}
			})
			.then(function(res){
				console.log('queryAllGroup',res);
				// if (res.data.success) {
				// 	let groupList = res.data.data.list;
				// 	self.screenArr = [];
				// 	groupList.forEach(function(item,index){
				// 		self.screenArr.push(item.comp_name)
				// 	})
				// }else{
				// 	self.$vux.toast.text(res.data.msg,'middle');
				// }
			})
			.catch(function(res){
				console.log('queryAllGroup Error',res)
			})
		},
		logoFormat(val,name){//格式化显示logo值
			let self = this;
			// console.log(val,name)
			let arr = name.split(' ')
			let str = arr.join('/')
			self.noPicInfo = str
			return `${str}`
		},
		logoChange(val){//切换logo
			let self = this;
			self.logos = []
			console.log('logoChange',val)
			console.log('currentlogo',self.currentlogo)
			self.inquire()
		},
		inquire(){//查询
			let self = this;
			self.logoShow = true;
			// self.imgBoxShow = true;
			if (self.currentVal == '') {
				self.$vux.toast.text('请选择一个企业!','middle')
				return
			}else{
				let datas = {
					'compCode' : self.enterprise.comp_code,
					// 'logoColor' : logoColor,
					// 'logoSize' : logoSize,
					// 'logoVersion' : logoVersion
				}

				if (self.currentlogo[0] == " ") {

				}else if (self.currentlogo[1] == " ") {
					datas.logoVersion = self.currentlogo[0]
				}else if (self.currentlogo[2] == " ") {
					datas.logoVersion = self.currentlogo[0]
					datas.logoSize = self.currentlogo[1]
				}else {
					datas.logoVersion = self.currentlogo[0]
					datas.logoSize = self.currentlogo[1]
					datas.logoColor = self.currentlogo[2]
				}
				console.log('datas',datas)
				self.$axios({
					url:'/UAMS/logo/queryLogo',
					responseType:'json',
					method:'post',
					data:datas
				})
				.then(function(res){
					console.log('inquire',res)
					self.hasAlreadyLogo = []
					self.logos = [];
					let objLogos = {};
					if (res.data.success) {
						console.log(8888)
						if(res.data.data == null) return
						let list = res.data.data;

						if (list) {
							self.hasAlreadyLogo = list;
							self.renderLogo()
						}else {//data为空显示18条
							self.renderLogo()
						}

						// self.hasAlreadyLogo.forEach(function(item,index){
						// 	objLogos.compCode = item.comp_code;
						// 	objLogos.logo = item.logo;
						// 	objLogos.logoColor = item.logo_color;
						// 	objLogos.logoSize = item.logo_size;
						// 	objLogos.logoVersion = item.logo_version;
						// 	objLogos.logoClass = item.logo_size+'_logo';
						// 	self.logos.push(objLogos)
						// })
						// console.log('logos集合',self.logos)
						
						/*self.logoObj.logoVersion = self.hasAlreadyLogo[0].logo_version;
						self.logoObj.logoSize = self.hasAlreadyLogo[0].logo_size;
						self.logoObj.logoColor = self.hasAlreadyLogo[0].logo_color*/

						/*if (self.logoObj.logoVersion == 'PC') {
							self.logoObj.logoVersion = 'PC端';
						}else if (self.logoObj.logoVersion == 'Android') {
							self.logoObj.logoVersion = 'Android端'
						}else if (self.logoObj.logoVersion == 'IOS') {
							self.logoObj.logoVersion = 'IOS端'
						}

						if (self.logoObj.logoSize == 'l') {
							self.logoObj.logoSize = '大'
						}else if (self.logoObj.logoSize == 'm') {
							self.logoObj.logoSize = '中'
						}else if (self.logoObj.logoSize == 's') {
							self.logoObj.logoSize = '小'
						}

						if (self.logoObj.logoColor == 'colorful') {
							self.logoObj.logoColor = '彩色'
						}else if (self.logoObj.logoColor == 'black_white') {
							self.logoObj.logoColor = '黑白'
						}*/

					}else{
						self.$vux.toast.text(res.data.msg,'middle')
					}
				})
				.catch(function(res){
					console.log('inquire Error',res);
				})
			}
		},
		renderLogo(){
			let self = this;
			console.log(999)
			let logoObj = {
				compCode: self.enterprise.comp_code,//企业code
      			logo:'',//图片路径
      			logoSize:'',//图片尺寸
      			logoColor:'',//图片颜色
      			logoVersion:'',//图片版本
      			logoClass:'',//图片样式
      			size:'',
      			color:'',
      			version:'',
			}

			if (self.currentlogo.length == 1) {//只有版本
				let tipLogo = self.currentlogo[self.currentlogo.length-1]
				versions.forEach(function(item,index){
					if (tipLogo == item.value) {
						logoObj.logoVersion = item.name;
						logoObj.version = item.vaule;
					}
				})
				for(let x=0;x<photoSizeList.length;x++){
					for(let y=0;y<color.length;y++){
						let obj = {}
						for(let key in logoObj){
							obj[key] = logoObj[key]
						}
						obj.logoColor = color[y].name;
						obj.color = color[y].value;
						obj.logoSize = photoSizeList[x].name+'尺寸';
						obj.size = photoSizeList[x].value;
						obj.logoClass = photoSizeList[x].value+'_logo';
						self.logos.push(obj)
						console.log('1',self.logos)
					}
				}
			}else if (self.currentlogo.length == 2) {
				let version = self.currentlogo[0]
				let size = self.currentlogo[self.currentlogo.length-1]
				versions.forEach(function(item,index){
					if (version == item.value) {
						logoObj.logoVersion = item.name;
						logoObj.version = item.value;
					}
				})
				photoSizeList.forEach(function(item,index){
					if (size == item.value) {
						logoObj.logoSize = item.name;
						logoObj.size = item.value;
						logoObj.logoClass = item.value+'_logo'
					}
				})
				for(let y=0;y<color.length;y++){
					let obj={};
					for(let key in logoObj){
						obj[key] = logoObj[key]
					}
					logoObj.logoColor = color[y].name;
					logoObj.color = color[y].value;
					self.logos.push(obj)
					console.log('2',self.logos)
				}
			}else if (self.currentlogo.length == 3) {//版本、尺寸、颜色
				let version = self.currentlogo[0];
				let size = self.currentlogo[1];
				let color1 = self.currentlogo[self.currentlogo.length-1]
				console.log(version,size,color1)
				versions.forEach(function(item,index){
					if (version == item.value) {
						logoObj.logoVersion = item.name;
						logoObj.version = item.value;
					}
				})
				photoSizeList.forEach(function(item,index){
					if (size == item.value) {
						logoObj.logoSize = item.name;
						logoObj.size = item.value;
						logoObj.logoClass = item.value+'_logo'
					}
				})
				color.forEach(function(item,index){
					if (color1 == item.value) {
						logoObj.logoColor = item.name;
						logoObj.color = item.value
					}
				})
				self.logos.push(logoObj)
				console.log('3',self.logos)
			}else{
				for(let x=0;x<versions.length;x++){
					for(let y=0;y<photoSizeList.length;y++){
						for(let z=0;z<color.length;z++){
							let obj={};
							for(let key in logoObj){
								obj[key] = logoObj[key]
							}
							obj.logoVersion = versions[x].name;
							obj.logoSize = photoSizeList[y].name;
							obj.logoColor = color[z].name;
							obj.logoClass = photoSizeList[y].value+'_logo';
							obj.version = versions[x].value;
							obj.size = photoSizeList[y].value;
							obj.color = color[z].value;
							self.logos.push(obj)
							console.log('0',self.logos)
						}
					}
				}
			}
			console.log('logos',self.logos)
		},
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/Jurisdiction');
		},
		shadowChange(val){//选择切换企业
			let self = this;
			console.log(val)
			self.logos = []
			self.backupAdmin.forEach(function(item,index){
				if (val[0] == item.comp_name) {
					self.enterprise = item;
					console.log('选择企业',self.enterprise)
				}
			})
		},
		openFile(){
			let self = this;
			self.$refs.iptFile.click()
		},
		importExcel(obj){
			let self = this;
			let file = obj.files[0];
			self.fileValue = file.name;
			self.folder = file;
			console.log(file)

			let types = file.name.split('.').pop()

			const fileType = ['jpeg','png'].some(item => item === types)

			const isJPG = file.type === 'image/jpeg' || 'image/png'

			const isLt2M = file.size / 1024 / 1024 < 2

			console.log('fileType',fileType,'isLt2M',isLt2M)

			if (!fileType) {
				self.$vux.toast.text('上传头像格式不对!')
				setTimeout(()=>{
					self.fileValue = ''
				},2000)
			}
			if (!isLt2M) {
				self.$vux.toast.text('上传头像大小不能超过2M!');
				setTimeout(()=>{
					self.fileValue = ''
				},2000)
			}
			// return fileType && isLt2M

			self.generateLink();
		},
		generateLink(){//logo生成url在线链接
			let self = this;
			let formData = new FormData(document.getElementById('formSubmit'));
			self.$axios.create({
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).post(self.importUserUrl,formData)
            .then(function(res){
            	console.log('generateLink',res)
            	if (res.status == 200) {
            		console.log('生成在线url链接')
            		let fileUrlList = res.data.data;//logo上传成功在线链接
            		self.succUrl = fileUrlList[0].file_url;
            		self.states = 0
            		self.beforeEdit_Upload()
            		// self.inquire()
            		
            		/*self.onlineURL.comp_code = self.currentItem.comp_code;
            		self.onlineURL.logo_color = self.currentItem.logo_color;
            		self.onlineURL.logo_size = self.currentItem.logo_size;
            		self.onlineURL.logo_version = self.currentItem.logo_version;
            		self.onlineURL.logo = self.succUrl;
            		self.hasAlreadyLogo.push(self.onlineURL)*/
            	}else{
            		self.$vux.toast.text(res.data.errmsg,'middle')
            	}
            })
            .catch(function(res){
            	console.log('generateLink Error',res);
            })
		},
		selectImg(item,index){
			let self = this;
			console.log('选择LOGO')
			console.log(item,index)
			self.currentItem = item;
			self.showLogo = ! self.showLogo;
			if (item.logo == "") {
				self.states = 0 // 上传
				// self.beforeEdit_Upload()
			}else{
				self.states = 1 // 编辑
				// self.beforeEdit_Upload()
			}
		},
		beforeEdit_Upload(){
			let self = this;
			console.log('go beforeEdit_Upload methods')
			let data,type,url;
			console.log('states',self.states)
			if (self.states == 0) {//上传
				console.log('上传')
				url = '/UAMS/logo/addLogo';
				data = {
					'compCode' : self.currentItem.comp_code,
					'logoSize' : self.currentItem.logo_size,
					'logoVersion' : self.currentItem.logo_version,
					'logoColor' : self.currentItem.logo_color,
					'logo' : self.succUrl
				}
				type = 'up'
			}else if (self.states == 1) {//编辑
				console.log('编辑')
				url='/UAMS/logo/updateLogo';
				data = {
					'compCode' : self.currentItem.comp_code,
					'logoSize' : self.currentItem.logo_size,
					'logoVersion' : self.currentItem.logo_version,
					'logoColor' : self.currentItem.logo_color,
					'logo' : self.succUrl
				}
				type = 'edit'
			}
			self.commonEditDelete(data,url,type)
		},
		logoDelete(item){//删除LOGO
			let self = this;
			console.log('deleteLogo',item)
			let url = "/UAMS/logo/delLogo"
			let data = {
				'compCode' : item.comp_code,
				'logoSize' : item.logo_size,
				'logoVersion' : item.logo_version,
				'logoColor' : item.logo_color
			}
			let type = 'del'
			console.log(data)
			self.commonEditDelete(data,url,type);
		},
		commonEditDelete(data,url,type){//编辑删除公共方法
			// type => up  上传 -->  edit  编辑  -->  del  删除
			let self = this;
			self.$axios({
				url:url,
				responseType:'json',
				method:'post',
				data:data
			})
			.then((res)=>{
				console.log('commonEditDelete',res);
				if (!res.data.success) {
					self.$vux.toast.text(res.data.msg,'middle')
					return
				}
				if (type == 'up') {
					self.$vux.toast.text('上传logo成功!','middle')
					console.log("上传成功",data,res.data.data)
					self.showLogo = false;
					self.inquire()
				}else if (type == 'edit') {
					self.$vux.toast.text('修改logo成功!','middle')
					self.showLogo = false;
					console.log('修改成功',data,res.data.data)
					self.inquire()
				}else if (type == 'del') {
					self.$vux.toast.text('删除logo成功!','middle')
					self.showLogo = false;
				}
			})
			.catch((res)=>{
				console.log('commonEditDelete Error',res)
			})
		},
		finish(data){
			let self = this;
			console.log(data)
			if (self.currentVal == '') {
				self.$vux.toast.text('请选择一个企业!','middle')
				return
			}else if (self.currentlogo == '') {
				self.$vux.toast.text('请选择LOGO类型!','middle');
			}else if (self.folder == '' || self.folder == undefined) {
				self.$vux.toast.text('请选择上传图片!','middle');
			}else{
				/*let formData = new FormData(document.getElementById('formSubmit'));
				self.$axios.create({
	                headers: {
	                    'Content-Type': 'multipart/form-data'
	                }
	            }).post(self.importUserUrl,formData)
	            .then(function(res){
	            	console.log('finish',res)
	            	if (res.status == 200) {
	            		self.$vux.toast.text('生成url链接成功!','middle')
	            		let fileUrlList = res.data.data;//logo上传成功绝对路径
	            		self.succUrl = fileUrlList[0].file_url;
	            	}else{
	            		self.$vux.toast.text(res.data.errmsg,'middle')
	            	}
	            })
	            .catch(function(res){
	            	console.log('finish Error',res);
	            })*/
			}
		},
		preview(){//预览logo
			let self = this;
			self.showHideOnBlur = !self.showHideOnBlur;
		},
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
	.formContent {
		display: inline-block;
		width: 60%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.logoBox {
		position: relative;
	}
	.noPicSpan {
	    width: 178px;
	    height: 178px;
	    
  	}
  	.logoBox .avatar{
  		display: block;
	    margin: 0 auto;
	    border: 1px dashed;
	    border-radius: 18px;

  	}
  	.noLogo img{
  		display: block;
	    margin: 0 auto;
	    border: 1px dashed;
	    border-radius: 22px;
	    color: #ccc;
		width: 180px;
		height: 180px;
		line-height: 180px;
		margin-top: 8px;
  	}
  	.edit_delete .editStyle {
  		position: absolute;
  		color: #aaaaff;
  		top: 73%;
  		left: 36%;
  	}
  	
  	.edit_delete .deleteStyle {
  		position: absolute;
  		color: #aaaaff;
  		top: 73%;
  		left: 56%;
  	}
  	.l_logo{
		width:180px;
	    height:180px;
	    line-height: 180px;
	    font-size: 25px;
  	}
  	.m_logo{
		width:150px;
	    height:150px;
	    line-height: 150px;
	    font-size: 22px;
  	}
  	.s_logo{
		width:120px;
	    height:120px;
	    line-height: 120px;
	    font-size: 20px;
  	}
  	.vux-close {
	    margin-top: 8px;
	    margin-bottom: 8px;
	}
	/*.dialog-demo .weui-mask {
		background: rgba(0, 0, 0, 0.1) !important;
	}*/
</style>
<style>
	.dialog-demo .weui-mask {
		background: rgba(0, 0, 0, 0.1) !important;
	}
</style>