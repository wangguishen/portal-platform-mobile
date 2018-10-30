<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top addZoolog">
			<group>
				<group-title slot="title">*为必填项</group-title>
				<x-input class="ipt" title="*企业名称" text-align="right" placeholder="请输入企业名称" v-model="companyObj.name"></x-input>
				<x-input v-show="!compCodeShow" class="ipt" title="*企业编码" text-align="right" placeholder="请输入企业编码" v-model="companyObj.code"></x-input>
                <cell v-show="compCodeShow" class="dem comp" title="*企业编码" :value="companyObj.code"></cell>
				<x-input class="ipt" title="*企业简称" text-align="right" placeholder="请输入企业简称" v-model="companyObj.shortName"></x-input>
                <cell v-show="compCodeShow" class="dem comp" title="企业类型" :value="zoologDetails.isGroup == 'Y' && zoologDetails.comp_parent_code === 0 ? '集团' : zoologDetails.comp_parent_code === 1 ? '生态企业' : '企业'"></cell>
				<x-address title="企业地址" @on-hide="logHide" @on-shadow-change="onShadowChange" :raw-value="true" v-model="companyObj.address" :list="addressData" placeholder="请选择企业地址">
				    <!-- <template slot="title" scope="props">
				        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
				          <span style="vertical-align:middle;">地址</span>
				        </span>
				    </template> -->
			    </x-address>
                <x-input class="ipt" title="详细地址" v-show="companyObj.address.length != 0" text-align="right" placeholder="请输入详细地址" v-model="companyObj.addresses"></x-input>
				<x-input class="ipt" title="联系人" text-align="right" placeholder="请输入企业联系人" v-model="companyObj.contact"></x-input>
				<x-input class="ipt" title="联系方式" text-align="right" placeholder="请输入企业电话" v-model="companyObj.contactPhone"></x-input>
				<cell class="logo" :class="{'relevan':companyObj.relevance}" title="选择关联集团" is-link @click.native="selectRelevance()" :value="companyObj.relevance"></cell>
	            <cell class="logo" title="企业LOGO" @click.native="selectImg()" is-link>
	            	<div>
          				<span class="iconfont" v-show="!companyObj.logo">&#xe658;</span>
          				<img :src="companyObj.logo" alt="" v-show="companyObj.logo" width="30" height="30">
        			</div>
	            </cell>
				<x-textarea title="备注" v-model="companyObj.remark" placeholder="请输入备注" :show-counter="false" :rows="1" autosize></x-textarea>
			</group>
		</div>
		<div v-transfer-dom>
            <popup v-model="typeShow" height="170px" is-transparent>
                <div style="width: 95%;background-color:#fff;height:150px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <div style="padding:20px 15px 0;" v-for="type in types">
                        <x-button :type="type.typeText" @click.native="selectType(type)">{{ type.name }}</x-button>
                    </div>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="imgShow" is-transparent>
                <div style="background-color:#fff;">
                    <div class="styless preview" v-show="companyObj.logo" @click="preview()">
                        预览
                    </div>
                    <input id="ipt_btns" style="display: none;" type="file" accept="image/*" @change="onFileChange">
                    <form id="form" method="post" enctype="multipart/form-data">  
                        <input type="text" id="module_id" name="module_id" value="1" style="display:none;"/> 
                        <input type="text" id="imagesName" name="imagesName" value="imagesName" style="display:none;"/> 
                        <!-- <input type="file" id="file" name="file" @change="clickChange" for="submit_btn" style="display:none;"/> -->
                        <input id="file" style="display: none;" type="file" name="file" accept="image/*" @change="onFileChange" for="submit_btn">
                        <label for="file" class="styless">
                            本地上传
                        </label> 
                        <input style="display:none;" type="submit" id="submit_btn" value="提  交"/>  
                    </form>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
	      	<x-dialog v-model="showToast" class="dialog-demo">
		        <div class="img-box">
          			<img :src="companyObj.logo" style="max-width:100%;display:block;">
        		</div>
		        <div @click="showToast=false">
		          	<span class="vux-close"></span>
		        </div>
	      	</x-dialog>
	    </div>
	    <div v-transfer-dom>
      		<popup v-model="showPopup" class="checker-popup">
		        <div style="padding:10px 10px 40px 10px;background-color:#fff;">
		          	<div class="Pop_title">选择关联集团
						<x-button class="determine" type="primary" mini @click.native="determine()">确定</x-button>
		          	</div>
		          	<div>
		          		<icon class="ch_icon" v-show="hollowShow" @click.native="check('0')" type="circle"></icon>
		          		<icon class="ch_icon" v-show="pigeonShow" @click.native="check('1')" type="success-circle"></icon>
						<icon class="ch_icon" v-show="checkedShow" @click.native="check('2')" type="success"></icon>
		          		全选
		          	</div>
		          	<checker 
		          		v-model="companyObj.relevanceGroup" 
		          		type="checkbox" 
		          		default-item-class="demo4-item"
      					selected-item-class="demo4-item-selected">
        				<checker-item :value="item" v-for="(item, index) in items" :key="index">{{item.value}}</checker-item>
      				</checker>
		        </div>
      		</popup>
    	</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import VueCropper from 'vue-cropper'
import { Group, GroupTitle, Cell, XInput, XAddress, XButton, XTextarea, PopupPicker, ChinaAddressData, Value2nameFilter as value2name, Popup, TransferDom, Actionsheet, XDialog, Checker, CheckerItem, Icon } from 'vux'
export default{
	directives: {
        TransferDom
    },
    components: {
        VHeader, Group, GroupTitle, Cell, XInput, XAddress, Popup, XButton, PopupPicker, VueCropper, XTextarea, Actionsheet, XDialog, Checker, CheckerItem, Icon
    },
    data(){
    	return {
    		dataJson: {},
    		addZoology: {},
    		zoologDetails: {},
    		headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
                isMore: true,
                title: '完成'
            },
            addressData: ChinaAddressData,
            companyBackUp:{
                name: '',//名字
                code: '',//编码
                shortName: '',//简称
                address: [],//地址
                addressArr: '',//地址数值
                contact: '',//联系人
                contactPhone: '',//联系方式
                relevance: '',//关联集团显示
                relevanceGroup:[],//关联集团
                relevanceBackup:[],//关联集团备份
                logo: '',//图片
                remark: '',//备注
                addresses: '',//详细地址
            },//备份记录
            companyObj: {
            	name: '',//名字
            	code: '',//编码
            	shortName: '',//简称
            	address: [],//地址
            	addressArr: '',//地址数值
            	contact: '',//联系人
            	contactPhone: '',//联系方式
            	relevance: '',//关联集团显示
            	relevanceGroup:[],//关联集团
            	relevanceBackup:[],//关联集团备份
            	logo: '',//图片
            	remark: '',//备注
                addresses: '',//详细地址
            },
            relevanceUp: [],//备份关联信息
            showPopup: false,
            items: [
            	{
			        key: '1',
			        value: 'Aaaaaaaa'
      			}, {
			        key: '2',
			        value: 'Bc'
      			}, {
			        key: '3',
			        value: 'Cdddddd'
      			}
      		],
            typeShow: false,//模型选择
            types: [
                {
                    typeText: 'default',//选种颜色
                    name: '是',
                    state: 0,
                }, {
                    typeText: 'default',
                    name: '否',
                    state: 0,
                }
            ],
            labList: [],//企业编码列表
            sureLab:[],//选中企业编码的值
            imgShow: false,
            showToast: false,
            photoes: {
            	preview: '预览',
            	updata: '本地选取'
            },
            //全选
            hollowShow: true,//空
            pigeonShow: false,//半全选
            checkedShow: false,//全选
            compCodeShow: false,//添加或编辑不同显示
    	}
    },
    mounted(){
    	let self = this;
    	self.dataJson = JSON.parse(localStorage.getItem('jsonData'))
        self.addZoology = JSON.parse(localStorage.getItem('addZoology'))
        self.zoologDetails = JSON.parse(localStorage.getItem('DetailsInfoMation'))
        self.headObj.title = self.addZoology.title;
        self.transerfBloc();
        // self.companyObj.relevanceGroup = []
        // self.companyObj.relevanceBackup = []
        // self.companyBackUp.relevanceGroup = []
        // self.companyBackUp.relevanceBackup = []
        console.log("21321",self.addZoology)
        if(self.addZoology.state == 3){
        	console.log('zoologDetails',self.zoologDetails)
        	self.companyObj.name = self.zoologDetails.comp_name
            self.companyBackUp.name = self.zoologDetails.comp_name
            self.companyObj.code = self.zoologDetails.comp_code
            self.companyBackUp.code = self.zoologDetails.comp_code
            self.companyObj.shortName = self.zoologDetails.comp_short_name
            self.companyBackUp.shortName = self.zoologDetails.comp_short_name
            let addressArr = [],arr = [];
            if(self.zoologDetails.address){
            	// self.companyObj.address = self.zoologDetails.address.split(" ")
                if(self.zoologDetails.address.indexOf('&') >= 0){
                    addressArr = self.zoologDetails.address.split('&')
                    arr = addressArr[0].split(' ')
                    self.companyObj.addresses = addressArr[1];
                    self.companyBackUp.addresses = addressArr[1];
                    self.companyObj.addressArr = addressArr[0];
                    self.companyBackUp.addressArr = addressArr[0];
                    self.companyObj.address = arr
                    self.companyBackUp.address = arr
                }else{
                    self.companyObj.address = self.zoologDetails.address.split(" ")
                    self.companyBackUp.address = self.zoologDetails.address.split(" ")
                    self.companyObj.addressArr = self.zoologDetails.address
                    self.companyBackUp.addressArr = self.zoologDetails.address
                }
            }
            // self.companyObj.addressArr = self.zoologDetails.address
            self.companyObj.contact = self.zoologDetails.contact
            self.companyBackUp.contact = self.zoologDetails.contact
            self.companyObj.contactPhone = self.zoologDetails.telephone
            self.companyBackUp.contactPhone = self.zoologDetails.telephone
            self.companyObj.logo = self.zoologDetails.logo
            self.companyBackUp.logo = self.zoologDetails.logo
            self.companyObj.remark = self.zoologDetails.remarks
            self.companyBackUp.remark = self.zoologDetails.remarks
            self.compCodeShow = true;
        }
    },
    watch:{
    	'companyObj':{
    		handler: function(val, old){
    			let self = this;
    			self.hollowShow = false;
    			self.pigeonShow = false;
    			self.checkedShow = false;
    			if(val.relevanceGroup.length == 0){
    				self.hollowShow = true;
    			}else if(val.relevanceGroup.length == self.items.length){
    				self.checkedShow = true;
    			}else{
    				self.pigeonShow = true;
    			}
    		},
    		deep: true
    	}
    },
    methods:{
    	backWay(data){
            let self = this;
            self.$router.back('/flatcompany');
        },
        onShadowChange(id, name){
            let self = this;
            if(name.toString()==self.companyBackUp.address){
                self.companyBackUp.address = id
            }
        },
        finish(data){
            let self = this
            // console.log(self.companyObj)
            if(!self.companyObj.name) {
                self.$vux.toast.text("请输入企业名称", 'middle')
            } else if(!self.companyObj.code) {
                self.$vux.toast.text("请输入企业编码", 'middle')
            } else if(!self.companyObj.shortName) {
                self.$vux.toast.text("请输入企业简称", 'middle')
            } else {
                console.log("=====",self.companyObj)
                console.log("-----",self.companyBackUp)
            	let url,data,ress;
                if(self.companyObj.addresses != ''){
                    ress = self.companyObj.addressArr + '&' + self.companyObj.addresses
                }else{
                    ress = self.companyObj.addressArr
                }
            	if(self.addZoology.state == 3){
                    url = self.BP_HOST + '/updateComp'
                    data = {
                        'sessionId': self.dataJson.sessionId,
                        'enterpriseCode': self.companyObj.code,
                        'enterpriseParentCode': 1,
                        'name': self.companyObj.name,
                        'newCompName': self.companyObj.name,
                        'shortName': self.companyObj.shortName,
                        'address': ress,
                        'contact': self.companyObj.contact,
                        'telephone': self.companyObj.contactPhone,
                        'logo': self.companyObj.logo,
                        'remarks': self.companyObj.remark,
                        'newCompName': self.companyObj.name,//新企业名称
                        'type': 'SYSTEM'
                    }
                }else{
                    url = self.BP_HOST + '/addComp'
                    data = {
                    	'sessionId': self.dataJson.sessionId,
                        'enterpriseCode': self.companyObj.code,
                        'enterpriseParentCode': 1,
                        'name': self.companyObj.name,
                        'shortName': self.companyObj.shortName,
                        'address': ress,
                        'contact': self.companyObj.contact,
                        'telephone': self.companyObj.contactPhone,
                        'logo': self.companyObj.logo,
                        'remarks': self.companyObj.remark,
                        'type': 'SYSTEM'
                    }
                }
                let relevanceUp = [],relevanceGroup = [], requestData = [];
                self.relevanceUp.forEach(function(item, index){
                	relevanceUp.push(item)
                })
                self.companyObj.relevanceGroup.forEach(function(item, index){
                	relevanceGroup.push(item)
                })
                for(let x=0;x<relevanceUp.length;x++){
                	for(let y=0;y<relevanceGroup.length;y++){
                		if(relevanceUp[x].id == relevanceGroup[y].id){
                			relevanceGroup.splice(y,1)
                			relevanceUp.splice(x,1)
                		}
                	}
                }
                relevanceUp.forEach(function(item, index){
                	item.addDelete = "0"
                	requestData.push(item)
                })
                relevanceGroup.forEach(function(item, index){
                	item.addDelete = "1"
                	requestData.push(item)
                })
                if(isObjectUtil(self.companyObj, self.companyBackUp)){
                    self.$vux.toast.text("你还没有进行任何修改", 'middle')
                    return
                }
                self.$axios({
                    url: url,
                    method: 'post',
                    responseType: 'json',
                    data: data
                })
                .then(function(res) {
                    console.log("success", res);
                    let list = JSON.parse(res.data.data)
                    if(!list.success){
                    	self.$vux.toast.text(list.msg, 'middle') 
                    	return
                    }
   					if(!self.hollowShow){
   						if(requestData.length != 0){
       						if(self.addZoology.state == 3){
       							self.releaseEcologyComp(self.zoologDetails.id, "0", requestData)
       						}else{
       							let compId = list.data.id 
       							self.releaseEcologyComp(compId, "1", requestData)
       						}
   						}else{
   							if(self.addZoology.state == 3){
	   							self.$router.back('/flatcompany');
	   							self.$vux.toast.text("修改生态企业成功", 'middle')
	   						}else{
	   							self.$router.back('/flatcompany');
	   							self.$vux.toast.text("注册生态企业成功", 'middle')
	   						}
   						}	
   					}else{
   						if(self.addZoology.state == 3){
   							self.$router.back('/flatcompany');
   							self.$vux.toast.text("修改生态企业成功", 'middle')
   						}else{
   							self.$router.back('/flatcompany');
   							self.$vux.toast.text("注册生态企业成功", 'middle')
   						}
   					}
                })
                .catch(function(res) {
                    console.log("error", res);
                })
            }
        },
        queryCompRelevan(){//查询当前生态企业关联信息
        	let self = this;
        	self.$axios({
	            url: '/UAMS/company/query_comp_ecology',
	            method: 'post',
	            responseType: 'json',
	            data: {
	              	compId: self.zoologDetails.id
	            }
          	})
          	.then(function(res) {
            	console.log("success", res)
            	if(!res.data.success) return
            	let list = res.data.data;
                let arr = []
        		for(let x=0;x<list.length;x++){
        			for(let y=0;y<self.items.length;y++){
        				if(list[x].group_id == self.items[y].id){
        					self.companyObj.relevanceGroup.push(self.items[y])
                            self.companyObj.relevanceBackup.push(self.items[y])
                            self.companyBackUp.relevanceGroup.push(self.items[y])
        					self.companyBackUp.relevanceBackup.push(self.items[y])
        					self.relevanceUp.push(self.items[y])
        					// if(list.length == 1){
        					// 	self.companyObj.relevance += self.items[y].comp_name 
        					// }else{
        					// 	self.companyObj.relevance += self.items[y].comp_name + '/'
        					// }
                            arr.push(self.items[y].comp_name)
        				}
        			}
        		}
        		self.$nextTick(()=>{
                    self.companyObj.relevance = arr.join('/')
                    self.companyBackUp.relevance = arr.join('/')
        			console.log("---------",self.companyObj.relevance)
        		})
          	})
          	.catch(function(res) {
            	console.log("error", res)
          	})
        },
        releaseEcologyComp(compId, type, request) { //生态企业关联添加
          	let self = this
          	let requestData = [];
          	if(type == "1") {  //添加
          		self.companyObj.relevanceGroup.forEach(function(item, index){
          			requestData.push({
                		compId: compId,
                		groupId: item.id,
                		type: type,
                		code_name: item.comp_name
              		})
          		})
          	} else {  //修改,可添加，可删除
          		request.forEach(function(item, index){
          			requestData.push({
                		compId: compId,
                		groupId: item.id,
                		type: item.addDelete
              		})
          		})
          	}
          	console.log(requestData)
          	self.$axios({
            	url: '/UAMS/company/release_ecology_comp',
            	method: 'post',
            	responseType: 'json',
            	data: requestData
          	})
          	.then(function(res) {
          		console.log("resres===",res)
            	if(res.data.success) {
              		if(type == "1"){//添加
              			self.$router.back('/flatcompany');
              			self.$vux.toast.text("注册生态企业成功", 'middle')
              		}else{
              			self.$router.back('/flatcompany');
              			self.$vux.toast.text("修改生态企业成功", 'middle')
              		}
            	}
          	})
          	.catch(function(res) {
            	console.log("error", res)
          	})
        },
        transerfBloc() {//调取所有的企业编码
            let self = this
            let data = {}
            self.$axios({
                url: '/UAMS/company/do_group_query',
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log('resres',res)
                let list = res.data.data
                self.items = [];
                list.forEach(function(item, index){
                	self.$set(item, 'key', item.comp_code)
                	self.$set(item, 'value', item.comp_name)
                	self.items.push(item)
                })
                self.$nextTick(()=>{
                    if(self.addZoology.state == 3){
                        self.queryCompRelevan();
                    }
                	
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        logHide (str) {//关闭选择企业地址框
        	let self = this;
	      	console.log('on-hide', str)
	      	console.log(self.companyObj.address)
	      	self.companyObj.addressArr = self.getName(self.companyObj.address) 	
	      	console.log(self.companyObj.addressArr)
	    },
	    getName (value) {//地址由id转为汉字
      		return value2name(value, ChinaAddressData)
    	},
        selectImg(){//调取图片
        	let self = this;
        	self.imgShow = !self.imgShow
        },
        onFileChange(e) {
            let self = this;
            let formData = new FormData(document.getElementById('form'));
            let url = '/vr-content/file/upload'
            self.$axios.create({
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).post(url,formData)
            .then(function(res) {
                console.log("success", res);
                let img = res.data.data[0]
                self.companyObj.logo = img.file_url
                self.imgShow = !self.imgShow  
            })
            .catch(function(res) {
                console.log("error", res);
            })
        },
        preview(){// 图片预览
        	let self = this;
        	self.imgShow = false;
            self.showToast = true 
        },
	    selectRelevance(){//选择关联集团
	    	let self = this;
	    	self.companyObj.relevanceGroup = [];
	    	self.companyObj.relevanceBackup.forEach(function(item, index){
	    		self.companyObj.relevanceGroup.push(item)
	    	})
	    	self.showPopup = !self.showPopup
	    },
	    check(num){//点击全选状态切换
	    	let self = this;
	    	self.companyObj.relevanceGroup = [];
	    	if(num == 0){//点击空状态呢
	    		self.items.forEach(function(item, index){
	    			self.companyObj.relevanceGroup.push(item)
	    		})
	    		// self.companyObj.relevanceGroup
	    	}else if(num == 1){//点击半全选
	    		self.items.forEach(function(item, index){
	    			self.companyObj.relevanceGroup.push(item)
	    		})
	    	}
	    },
	    determine(){//选择关联集团
	    	let self = this;
	    	console.log('relevanceGroup',self.companyObj.relevanceGroup)
	    	self.companyObj.relevanceBackup = [];
	    	self.companyObj.relevance = '';
	    	self.companyObj.relevanceGroup.forEach(function(item,index){
	    		self.companyObj.relevanceBackup.push(item)
	    		if(self.companyObj.relevanceGroup.length == 1){
	    			self.companyObj.relevance+= item.comp_name
	    		}else{
	    			self.companyObj.relevance+= item.comp_name+'/'
	    		}
	    		
	    	})
	    	self.showPopup = false;
	    }
    },
}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close';
	.dem.weui-cell{//改变cell的样式
        padding:0 15px;
    }
    .comp.weui-cell{
        padding-right: 2rem;
    }
    .logo.weui-cell{
    	padding:0 15px;
    }
	.ipt.weui-cell{
		padding-right:20px;
	}
	.iconfont{
    	color: #ccc;
    }
	.styless{
		display: block;
		height: 50px;
		text-align: center;
		line-height: 50px;
	}
	.preview{
		border-bottom: 1px solid #d9d9d9;
		box-sizing: border-box;
	}
	.dialog-demo {
	  	.weui-dialog{
		    border-radius: 8px;
		    padding-bottom: 8px;
	  	}
	  	.dialog-title {
		    line-height: 30px;
		    color: #666;
	  	}
	  	.img-box {
		    // height: 350px;
		    overflow: hidden;
	  	}
	  	.vux-close {
		    margin-top: 8px;
		    margin-bottom: 8px;
	  	}
	}
	.demo4-item {
  		background-color: #ddd;
  		color: #222;
  		font-size: 14px;
  		padding: 5px 10px;
  		margin-right: 10px;
  		line-height: 18px;
  		border-radius: 15px;
  		margin-bottom: .5rem;
	}
	.demo4-item-selected {
  		background-color: #1AAD19;
  		color: #fff;
	}
	.Pop_title{
		height: 2rem;
		line-height: 2rem;
		padding:0 0 .8rem;
		text-align: center;
		color:#999;
	}
	.ch_icon{
		margin-bottom: .5rem;
	}
	.determine{
		float: right;
		margin-right: .5rem;
	}
</style>