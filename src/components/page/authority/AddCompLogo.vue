<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="content_box s-company-box">
			<div class="g-company-logo">
				<div class="g-label-ipt">
					<span>企业名称</span>
					<input id="targetInput" v-model="company" class="g-logo-ipt" type="text" readonly/>
					<span class="iconfont s-icon">&#xe61d;</span>
				</div>
				<div id="targetContainer" v-show="targetContainerShow"></div>
			</div>
			<group>
       			<popup-picker
       				title="版本/尺寸/颜色"
       				:data="layoutList"
       				v-model="layoutValue"
       				placeholder="请选择版本/尺寸/颜色"
       				@on-change="layoutChange"
       				ref="picker"></popup-picker>
       			<template v-for="(logo,index) in logoes">
       				<cell
       					:title="logo.name"
       					:border-intent="false"
       					v-show="logo.show"
       					@click.native="selectType(logo)"
       					is-link>
       						<div>
       							<span class="iconfont g-m-icon" v-if="logo.logo == ''">&#xe658;</span>
       							<img v-else class="g-m-logo" :src="logo.logo" alt="" onerror="onerror=null;this.src='/static/images/add.png'">
       						</div>
   					</cell>
       			</template>
 			</group>
 			<div v-transfer-dom>
	 			<popup v-model="selectPopupShow" position="bottom">
			        <div class="position-vertical-demo">
			        	<div v-for="menu in menus">
			        		<template v-if="menu.id!='yl'&&menu.id!='delete'">
			        			<form id="form" method="post" enctype="multipart/form-data">
			        				<input id="ipt_btns" name="file" type="file" accept="image/*" @change="onFileChange($event,menu)" style="display:none;">
			        				<input name="module_id" value="1" style="display:none;">
			        				<label for="ipt_btns" class="g-s-ipt">{{menu.label}}</label>
			        			</form>
			        		</template>
			        		<template v-else>
			        			<x-button type="default" class="g-s-btn" plain @click.native="checkMark(menu)">{{menu.label}}</x-button>
			        		</template>
			        	</div>
			        	<x-button type="default" class="g-s-cancel" plain @click.native="cancelPopup">取消</x-button>
			        </div>
		        </popup>
    		</div>
    		<div v-transfer-dom>
      			<x-dialog v-model="showToastImg" class="dialog-demo">
					<div class="img-box">
			          	<img :src="atPresent.logo" style="max-width:100%;display: block;width:100%;" onerror="onerror=null;this.src='/static/images/add.png'">
			          	<div @click="showToastImg=false">
				          	<icon type="cancel" style="font-size: 2.5rem;"></icon>
				        </div>
			        </div>
      			</x-dialog>
    		</div>
		</div>
	</div>
</template>
<script>
// import MultiPicker from 'mob-multi-picker';
import VHeader from '../../common/Header'
import { Group, Cell, PopupPicker, Popup, XButton, XDialog, Icon, TransferDom } from 'vux'

export default {
	directives: {
    	TransferDom
  	},
	components: {
		VHeader, Group, Cell, PopupPicker, Popup, XButton, XDialog, Icon
	},
	data(){
		return{
			a:this.createdCss('./static/MultiPicker.css'),
			b:this.createdJs('./static/MultiPicker.js'),
			dataJson:{},//用户登录信息
			headObj: {
                title: '变更企业LOGO',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "",
            },
            business: [],
            counterpart: [],//复本
            company: '请选择企业',
            companyId: '',//企业id
            companyCode: '',//企业编码

            layoutList: [
	            [
	            	{
	            		name: '请选择',
        				value: ' ',
        				id: ' '
    				},{
	            		name: 'PC端',
	            		value: 'PC端',
        				id: 'PC'
    				},{
	            		name: 'Android端',
	            		value: 'Android端',
        				id: 'Android'
    				},{
	            		name: 'IOS端',
	            		value: 'IOS端',
        				id: 'IOS'
    				}
	            ], [
	            	{
	            		name: '请选择',
        				value: ' ',
        				id: ' '
    				},{
	            		name: '大',
	            		value: '大',
        				id: 'l'
    				},{
	            		name: '中',
	            		value: '中',
        				id: 'm'
    				},{
	            		name: '小',
	            		value: '小',
        				id: 's'
    				}
	            ], [
	            	{
	            		name: '请选择',
        				value: ' ',
        				id: ' '
    				},{
	            		name: '彩色',
	            		value: '彩色',
        				id: 'colorful'
    				},{
	            		name: '黑白',
	            		value: '黑白',
        				id: 'black_white'
    				}
	            ]
      		],
            layoutValue: [],
            layoutpar:[],

            logoes:[],
            logo:[],//已经有的
            atPresent:{},
      //       menus: {
		    //     menu1: '上传',
		    //     menu2: '预览',
		    // },
		    menus: [],
		    selectPopupShow: false,//选择框
		    showToastImg: false,//预览框
		    targetContainerShow:true,
		    logoUpdataUrl:'',
		}
	},
	mounted(){
		let self = this;
		self.dataJson = JSON.parse(localStorage.getItem('jsonData'));
		self.logoUpdataUrl = self.LOGO_UPDATE_URL;
		self.queryAllGroup();//请求所有集团
	},
	watch:{
		'business':{
			handler:function(val,old){
				let self = this;
				new MultiPicker({
					input: 'targetInput',
					container: 'targetContainer',
					jsonData:val,
					success:function(arr){
						console.log(arr)
						if(arr[arr.length-1].id == 'xz'){
							self.company = arr[arr.length-2].value
							self.companyId = arr[arr.length-2].id
						}else{
							self.company = arr[arr.length-1].value
							self.companyId = arr[arr.length-1].id
						}
						self.counterpart.forEach(function(item, index){
							if(self.companyId == item.id){
								self.companyCode = item.comp_code
							}
						})
						self.$nextTick(()=>{
							console.log(self.companyCode)
							self.searchLogo();
						})
					}
				});
			},
			deep:true
		}
	},
	methods: {
		createdCss(path){
			let head = document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1];
			let link = document.createElement('link');
		    link.href = path;
		    link.rel = 'stylesheet';
		    link.type = 'text/css';
		    head.appendChild(link);
		},
		createdJs(path){
			let head = document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1];
		    let script = document.createElement('script');
		    script.src = path;
		    script.type = 'text/javascript';
		    head.appendChild(script);
		},
		removejscssfile(filename, filetype){ 
			//判断文件类型 
			let targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; 
			//判断文件名 
			let targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; 
			let allsuspects=document.getElementsByTagName(targetelement); 
			//遍历元素， 并删除匹配的元素 
			for (let i=allsuspects.length; i>=0; i--){ 
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) 
			allsuspects[i].parentNode.removeChild(allsuspects[i]); 
			} 
		},
		backWay(){//返回上个页面
			let self = this;
			self.targetContainerShow = false;
			self.removejscssfile('MultiPicker.css','css')
			self.$nextTick(()=>{
				self.$router.back('/Jurisdiction');
			})
		},
		finish(data){//上传
			let self = this;
			console.log(data)
		},
		renderingList(){
			let self = this;
		},
		versionSize(){//尺寸列表
			let self = this;
			self.logoes = [];
			let num = 0;
			let logoObj = {
      			compCode: self.companyCode,//企业code
      			logo:'',//图片路径
      			logoSize:'',//图片尺寸
      			logoColor:'',//图片颜色
      			logoVersion:'',//图片版本
      		}
      		let arr = [],arrList=[],versions=[],size=[],colors=[];
      		self.layoutList[0].forEach(function(item, index){
      			if(item.value != ' '){
      				versions.push(item)
      			}
      		})
      		self.layoutList[1].forEach(function(item, index){
      			if(item.value != ' '){
      				size.push(item)
      			}
      		})
      		self.layoutList[2].forEach(function(item, index){
      			if(item.value != ' '){
      				colors.push(item)
      			}
      		})
      		self.logoes = []
      		for(let x=0;x<versions.length;x++){
				for(let y=0;y<size.length;y++){
  					for(let z=0;z<colors.length;z++){
						let str = versions[x].name+'-'+size[y].name+'-'+colors[z].name
						let obj = {
							name: str,
							logo_version:versions[x].id,
							logo_size:size[y].id,
							logo_color:colors[z].id,
							logo:'',
							show: false,
						}
						self.logoes.push(obj)
  					}
				}
  			}
      		if(self.layoutpar.length == 0){//显示18个全部
      			for(let i=0;i<self.logoes.length;i++){
      				self.logoes[i].show = true;
      				self.logo.forEach(function(item,index){
						if(item.logo_version == self.logoes[i].logo_version && item.logo_size == self.logoes[i].logo_size && item.logo_color == self.logoes[i].logo_color){
							self.logoes[i].logo = item.logo
						}
					})
      			}
      		}else{
      			self.layoutpar.forEach(function(item, index){
      				if(item != ' '){
      					let str = '';
      					if(index == 0){
      						str = 'logo_version'
      					}else if(index == 1){
      						str = 'logo_size'
      					}else if(index == 2){
      						str = 'logo_color'
      					}
      					let obj = {
      						id: item,
      						index: index,
      						key: str,
      					}
      					arrList.push(obj)
      					num++
      				}
      			})
      			for(let i=0;i<self.logoes.length;i++){
  					self.logo.forEach(function(item,index){
  						if(item.logo_version == self.logoes[i].logo_version && item.logo_size == self.logoes[i].logo_size && item.logo_color == self.logoes[i].logo_color){
  							self.logoes[i].show = true;
							self.logoes[i].logo = item.logo
						}
  					})
  				}
      			if(num == 1){//一个有值
      				self.logoes.forEach(function(item, index){
      					if(item[arrList[0].key] == arrList[0].id){
      						item.show = true;
      					}
      				})
      			}else if(num == 2){//两个有值
      				self.logoes.forEach(function(item, index){
      					if(item[arrList[0].key] == arrList[0].id &&item[arrList[1].key] == arrList[1].id){
      						item.show = true;
      					}
      				})
      			}else if(num == 3){//三个都有值  只显示一个
      				self.logoes.forEach(function(item, index){
      					if(item[arrList[0].key] == arrList[0].id && item[arrList[1].key] == arrList[1].id && item[arrList[2].key] == arrList[2].id){
      						item.show = true;
      					}
      				})
      			}
      		}
		},
		queryAllGroup(){//请求所有集团
			let self = this;
			self.$axios({
	          	url: '/UAMS/company/do_comp_single_query_bycompanycode',
	          	method: 'post',
	          	responseType: 'json',
	          	data: {
	            	compCode: self.dataJson.compCode,
	            	type:"0"
	          	}
	        })
	        .then(function(res) {
          		console.log('queryAllType',res);
          		if(!res.data.success){
          			self.$vux.toast.text('请求集团报错', 'middle');
          			return
          		}
          		if(res.data.success){
          			let list = res.data.data;
          			self.counterpart = [];
          			self.business = list
          			self.circulation(self.business, 1)
          		}
        	})
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
		circulation(arr, num){//公共循环方法
			let self = this;
			let obj = {
				id: "xz",
				comp_name: '请选择',
				enterprises:[]
			}
			if(num != 1){
				arr.unshift(obj)
			}
			arr.forEach(function(item, index){
				item.id = item.id.toString();
				self.$set(item, 'value', item.comp_name)
				self.$set(item, 'child', item.enterprises)
				self.counterpart.push(item)
				if(item.child.length == 0){

				}else{
					self.circulation(item.child, 2)
				}
			})
		},
		layoutChange(values){//参数的筛选
			let self = this;
			if(values[0]== ' ' && values[1]== ' ' && values[2]== ' '){
				self.layoutValue = []
			}else{
				self.layoutpar = []
				for(let x=0;x<values.length;x++){
					self.layoutList[x].forEach(function(item,index){
						if(item.value == values[x]){
							self.layoutpar.push(item.id)
						}
					})
				}
				self.$nextTick(()=>{
					if(self.companyId == ''){
						self.$vux.toast.text('请选择集团企业', 'middle');
	          			return
					}else{
						self.searchLogo() 
					}
				})
			}
		},
		searchLogo(){//查询logo
			let self = this;
			let url = '/UAMS/logo/queryLogo';
			let data = {
  				compCode: self.companyCode
  			}
			if(self.layoutpar.length != 0){
				data.logoVersion = self.layoutpar[0] == ' '?'':self.layoutpar[0];
				data.logoSize = self.layoutpar[1] == ' '?'':self.layoutpar[1];
				data.logoColor = self.layoutpar[2] == ' '?'':self.layoutpar[2];
			}
  			console.log(data)
			self.$axios({
                url: url,
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
            	console.log("查询",res)
            	if(!res.data.success){
            		self.$vux.toast.text(res.data.msg, 'middle');
  					return
            	}
            	let list = [];
            	if(res.data.data){
            		list = res.data.data
            	}
            	self.logo = list;
            	self.versionSize();
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		selectType(logo){//选择样式
			let self = this;
			if(logo.logo != ''){
				self.menus = [
			    	{
				        label:'修改',
				        id:'xg'
			    	},{
			    		label:'预览',
			    		id:'yl'
			    	},{
			    		label:'删除',
			    		id:'delete'
			    	}
			    ]
			}else{
				self.menus = [
			    	{
				        label:'上传',
				        id:'sc'
			    	}
			    ]
			}
			self.atPresent = logo;
			self.selectPopupShow = !self.selectPopupShow
			console.log(logo)
		},
		checkMark(item){//选项点击
			let self = this;
			let url,data,type;
			if(item.id == 'delete'){
				url = "/UAMS/logo/delLogo";
	    		data = {
	    			compCode: self.companyCode,
	    			logoSize: self.atPresent.logo_size,
	    			logoVersion: self.atPresent.logo_version,
	    			logoColor: self.atPresent.logo_color,
	    		}
	    		type = "del"
	    		self.commonalityData(data,url,type,item.logo)
			}else{
				self.selectPopupShow = false;
				self.showToastImg = !self.showToastImg
			}
		},
		cancelPopup(){//取消popup模态框
			let self = this;
			self.selectPopupShow = false;
		},
		onFileChange(e,menu){
			let self = this;
			let files = e.target.files || e.dataTransfer.files;
            if (!files.length)return;
            let formData = new FormData(document.getElementById('form'));
            self.$axios.create({
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).post(self.logoUpdataUrl,formData)
            .then(function(res){
            	console.log('generateLink',res)
            	if (res.status == 200) {
            		let url = res.data.data[0].file_url;
            		self.updataUrl(menu,url);
            	}else{
            		self.$vux.toast.text(res.data.errmsg,'middle')
            	}
            })
            .catch(function(res){
            	console.log('generateLink Error',res);
            })
		},
		updataUrl(menu,logo){//更新url
			let self = this;
			console.log(self.atPresent)
			console.log(self.companyCode)
			let url,data,type;
			if(menu.id == 'sc'){//上传
				url = "/UAMS/logo/addLogo";
	    		data = {
	    			compCode: self.companyCode,
	    			logoSize: self.atPresent.logo_size,
	    			logoVersion: self.atPresent.logo_version,
	    			logoColor: self.atPresent.logo_color,
	    			logo: logo
	    		}
	    		type = "up"
			}else if(menu.id == 'xg'){//修改
				url = "/UAMS/logo/updateLogo";
	    		data = {
	    			compCode: self.companyCode,
	    			logoSize: self.atPresent.logo_size,
	    			logoVersion: self.atPresent.logo_version,
	    			logoColor: self.atPresent.logo_color,
	    			logo: logo
	    		}
	    		type = "edit"
			}
			self.commonalityData(data,url,type,logo)
		},
		commonalityData(data, url, type, logo){//公共请求方法
			let self = this;
			self.$axios({
	          	url: url,
	          	method: 'post',
	          	responseType: 'json',
	          	data: data
	        })
	        .then(function(res) {
          		console.log('res===',res);
          		if(!res.data.success){
          			self.$vux.toast.text(res.data.msg,'middle')
          			return
          		}
          		if(type == 'up'){
	    			self.$vux.toast.text(self.atPresent.name+"  上传logo成功",'middle')
	    			self.atPresent.logo = logo;
          		}else if(type == 'edit'){
          			self.$vux.toast.text(self.atPresent.name+"  修改logo成功",'middle')
          			self.atPresent.logo = logo;
          		}else if(type == 'del'){
          			self.$vux.toast.text(self.atPresent.name+"  删除logo成功",'middle')
          			self.atPresent.logo = '';
          		}
          		self.selectPopupShow = false;
        	})
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
	}
}
</script>
<style lang="less" scoped>
	.g-label-ipt{
		display: block;
		width:100%;
		height:3.2rem;
		line-height: 3.2rem;
		border:none;
		box-sizing: border-box;
		padding: 0 1rem 0  1.2rem;
		font-size: 1.2rem;
		position: relative;
	}
	.g-logo-ipt{
		position: absolute;
		width:100%;
		height:3.2rem;
		line-height: 3.2rem;
		border:none;
		top:0;
		left:0;
		z-index:99;
		background: transparent;
	    padding-left: 30%;
	    padding-right: 8%;
		text-align: right;
		box-sizing: border-box;
		color:#999999;
	}
	.s-icon{
		float:right;
		font-size:0.8rem;
		color:#C8C8CD;
	}
	.g-m-icon{
		font-size: 1.8rem;
		color:inherit;
	}
	.g-m-logo{
		display: block;
		width:25px;
		height:25px;
		border-radius: 3px;
	}
	.g-s-ipt{
		display: block;
	    height: 3rem;
    	line-height: 3rem;
    	text-align: center;
    	font-size:1.4rem;
    	color:#353535;
    	background-color: #fff;
		border-bottom:1px solid #D9D9D9;
	}
	.g-s-cancel{
		border:none;
		border-radius: 0;
		background-color: #fff;
		border-top:1px solid #D9D9D9;
		margin-top: .5rem;
	}
	.g-s-btn{
		border:none;
		border-radius: 0;
		background-color: #fff;
		border-bottom:1px solid #D9D9D9;
	}
</style>