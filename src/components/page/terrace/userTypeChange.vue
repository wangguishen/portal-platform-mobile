<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请选择用户"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 46px;">
	            <div v-show="userSearchShow" :style="{'minHeight':maxHeight+'px'}">
	                <div v-if="currentVal.length == 0">
	                    <div class="prompt_text">
	                        请先选择企业，再选择用户
	                    </div>
	                </div>
	                <div v-else>
	                    <div class="user_deta" v-for="item in userResults">
	                        <div @click="selectName(item)">
	                            {{item.name || item.userName}}
	                        </div>
	                    </div>
	                    <load-more v-show="loading" :show-loading="showLoad" :tip="loadText"></load-more>
	                </div>
	            </div>
	        </search>
	        <div :class="{'tabSpace':tabSpace}">
		    	<group>
	                <popup-picker
	                    title="企业" 
	                    :data="screenArr" 
	                    placeholder='请先选择企业' 
	                    v-model="currentVal"
	                    @on-change="shadowChange">
	                </popup-picker>
	            </group>
		    </div>
		    <group title="用户类型" class="checkList">
                <checklist :options="commonList" label-position="left" v-model="checklist" ref="uType" @on-change="checkChange"></checklist>
                <!-- <x-button plain @click.native="selectAll">全选</x-button> -->
            </group>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,PopupPicker,Group,Checklist,XButton}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,PopupPicker,Group,Checklist,XButton
	},
	data() {
		return {
			headObj: {
                title: '用户类型变更',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "变更",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            results:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	loading:true,
           	userResults:[],//用户信息集合
           	currentVal: [],//企业选中的值
           	enterprise: {},//当前选中的企业
           	screenArr: [],//企业集合
           	backupAdmin:[],//admin登录数据备份
           	pageSize:20,//每页条数
            currentPage:1,//当前第几页
            userSearchShow: false,//是否显示模态框
            isScrollShow:false,
            selectAllShow:false,//全选
            maxHeight:0,//搜索模态显示框的最大高度
            state:1,
            timer:null,
           	addObj:{},
           	jsonData:{},
           	accountCompCode:{},
           	commonList:[],
           	checklist:[],
           	adminSessionId: '',   //用户中心admin帐号的sessionId
           	userInfo: {},
           	parentEnterpriseCode:'',//企业编码
           	tempCheckList:[],//备份用户类型
		}
	},
	mounted() {
		let self = this;
        self.jsonData = JSON.parse(localStorage.getItem('jsonData'))
        self.accountCompCode = JSON.parse(localStorage.getItem('compCode'))
        let uams = JSON.parse(localStorage.getItem('uams'))
        self.adminSessionId = localStorage.getItem('adminSessionId')
        console.log(self.jsonData,self.accountCompCode,uams)
        if (uams == self.PLAT_ADMIN) {
        	self.adminQueryData();
        }else{
        	self.NotAdminData();
        }
        self.maxHeight = document.body.clientHeight - 90;
        self.$refs.search.$el.lastElementChild.style.maxHeight = self.maxHeight+'px';//模态框设置最大高度
        self.$nextTick(() => {
            self.$refs.search.$el.lastElementChild.addEventListener('scroll', ()=>{
                let obj = self.$refs.search.$el.lastElementChild;
                if(obj.offsetHeight > 0){
                	let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
	                let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
	                let modBoxHei = self.$refs.search.$el.lastElementChild.offsetHeight;//模块盒子的高度
	                let modBoxTop = self.$refs.search.$el.lastElementChild.scrollTop;//模块盒子的scrollTop
	                if(sumHeight >= modBoxHei){
	                    if((sumHeight - modBoxHei) <= modBoxTop){
	                        if(self.timer == null){
	                            if(self.isScrollShow){
	                                self.state++;
	                                self.resultload('2',self.searchInput)
	                            }
	                        }
	                    }
	                }
                }
	                
            })
        })
        /*请求所有用户类型*/
        self.queryAllType();
	},
	methods: {
		adminQueryData(){//admin状态下请求集团
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
				console.log(res)
				if (res.data.success) {
					let adminDataLists = res.data.data.list;
					self.screenArr=[];
					self.backupAdmin=[];
					let tempArr=[];
					adminDataLists.forEach(function(item,index){
						self.backupAdmin.push(item);
						tempArr.push(item.comp_name);
					})
					self.$nextTick(()=>{
						self.screenArr.push(tempArr);
						console.log(self.screenArr)
					})
				}else{
					self.$vux.toast.text(res.data.msg,'middle');
				}
			})
			.catch(function(res){
				console.log('adminQueryData error',res);
			})
		},
		NotAdminData(){//非admin状态下请求
			let self = this;
			self.$axios({
                url: '/UAMS/Auth/queryCompany',
                method: 'post',
                data: {
                    "compCode": self.accountCompCode ? self.accountCompCode : ''
                }
            })
            .then(function(res) {
                console.log('NotAdminData',res)
                if (res.data.success) {
                	let resData = res.data.data.companyChildren;
                	self.screenArr=[];
					self.backupAdmin=[];
					let tempArr=[];
                	resData.forEach(function(item,index){
                		self.backupAdmin.push(item);
                		tempArr.push(item.comp_name)
                	})
                	self.$nextTick(()=>{
                		self.screenArr.push(tempArr);
                	})
                }
            })
            .catch(function(res) {
                console.log("NotAdminData error", res)
            })
		},
		resultload(type,val){
			let self = this;
			console.log(type,val)
            if(type == 0){//触及input搜索框
                self.currentPage = 1;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 1){//输入
                self.currentPage = 1;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 2){//无限加载
                self.currentPage++;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 3){//数据撑不满框
                self.loading = true;
                self.currentPage++;
                self.showLoad = true;
                self.loadText = '正在加载';
            }
            if(self.state != 0){
                if(self.timer == null){
                    self.timer = setTimeout(() => {
                        clearTimeout(self.timer)
                        self.timer = null;
                        if(self.isScrollShow){
                            self.askSearch(val,type);
                            // self.findByEnterpriseCode();
                        }
                    },1000)
                }
            }   
		},
		askSearch(val,type){//搜索当前企业下的用户
			let self = this;
			console.log(val,type)
			self.$axios({
                url: '/account_auth_admin/user-api.findUser',
                method: 'post',
                data: {
                    // 'compCode': self.enterprise.comp_code,
                    // 'username': val
                    'pageSize': self.pageSize,
            		'pageNumber': self.currentPage,
                    'key' : self.searchInput,
                    'sessionId' : self.adminSessionId,
                    'sort' : ''
                }
            })
            .then(function(res){
            	console.log('askSearch',res)
            	if (res.data.status) {
            		let userList = res.data.data.items;
            		console.log('userList',userList)
            		if(userList.length <= self.pageSize && userList.length != 0){
                        self.loading = false;
                        if(self.currentPage == 1){
                            self.userResults = [];
                        }
                        if(userList.length != 0 && type == 1){//输入字
                            self.$refs.search.$el.lastElementChild.scrollTop = 0;
                        }
                        userList.forEach(function(item, index){
                            self.userResults.push(item)
                        })
                        self.$nextTick(()=>{
                            if(self.userResults.length != 0){
                                if(userList.length < self.pageSize){
                                    self.showLoad = false;
                                    self.loadText = '数据加载完毕';
                                    self.loading = true;
                                }else{
                                    let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
                                    let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
                                    let modBoxHei = self.$refs.search.$el.lastElementChild.offsetHeight;//模块盒子的高度
                                    let page = res.data.data.totalPages
                                    if(page.currentPage == 1 && page.pageSize == 20){
                                        self.pageSize = 10;
                                        self.currentPage = 2;
                                    }
                                    if(sumHeight<=modBoxHei){
                                        self.state++;
                                        self.resultload('3',val)
                                    }
                                }   
                            }
                        })
                    }else{
                    	self.showLoad = false;
                        if(self.currentPage == 1){
                            self.results = [];
                            self.loadText = '暂无数据'
                        }else{
                            self.loadText = '数据加载完毕'
                        }
                        self.loading = true;
                        self.timer = null;
                    }
            	}else{
            		self.$vux.toast.text(res.data.message,'middle');
            	}
            })
            .catch(function(res){
            	console.log('askSearch error',res);
            })
		},
		queryAllType(){//查询所有用户类型
			let self = this;
			self.$axios({
	          	url: '/account_auth_admin/user-api.findAllType',
	          	method: 'post',
	          	responseType: 'json',
	          	data: {
	            	'sessionId': self.adminSessionId
	          	}
	        })
	        .then(function(res){
	        	console.log('queryAllType',res);
	        	let typeLists = res.data.data;
	        	typeLists.forEach(function(item, index){
	        		// let obj = {
	        		// 	id: item.typeId,
	        		// 	code: item.typeCode
	        		// }
	        		self.$set(item, 'key',item.typeCode)
	        		self.$set(item, 'value',item.typeName)
	        		self.commonList.push(item)
	        	})
	        })
	        .catch(function(res){
	        	console.log('queryAllType Error',res);
	        })
		},
		findByEnterpriseCode(){//查询出企业下用户的用户类型
			let self = this;
			let datas = {
				'sessionId' : self.adminSessionId,
				'enterpriseCode' : self.enterprise.comp_code,
				'userId' : self.userInfo.userId
			}
			console.log(datas)
			self.$axios({
	          	url: '/account_auth_admin/user-api.findByEnterpriseCode',
	          	method: 'post',
	          	responseType: 'json',
	          	data:datas
	        })
	        .then(function(res){
	        	console.log('findByEnterpriseCode',res);
	        	if (res.data.status == 1) {
	        		let list = res.data.data;
	        		self.checklist = [];
	        		list.forEach(function(item,index){
	        			self.checklist.push(item.type);
	        			self.tempCheckList.push(item.type);
	        		})
	        	}
	        })
	        .catch(function(res){
	        	console.log('findByEnterpriseCode Error',res);
	        })
		},
		deleteEnterprisUser(delEnterpriseCode){//解除用户与企业关系
			let self = this;
			console.log('go deleteEnterprisUser methods');
			self.$axios({
				url: '/account_auth_admin/user-api.deleteEnterprisUser',
		        method: 'post',
		        responseType: 'json',
		        data:{
		        	appCode: "ACCOUNT",
		            clientIp: "127.0.0.1",
		            encryptCode: "123456",
		            account: "admin",
		            password: "e10adc3949ba59abbe56e057f20f883e",
		            mobile: self.userInfo.mobile,
		            enterpriseCode: delEnterpriseCode
		        }
			})
			.then(function(res){
				console.log('deleteEnterprisUser',res);
				if (res.data.status == 1) {
					self.$vux.toast.text('用户与企业解除成功!','middle');
				}else{
					self.$vux.toast.text('用户与企业解除失败!','middle');
				}
			})
			.catch(function(res){
				console.log('deleteEnterprisUser Error',res);
			})
		},
		finish(data){
			let self = this;
			console.log(data)
			console.log('tempCheckList',self.tempCheckList);
			let boolean = self.equal(self.tempCheckList,self.checklist);
			if (self.currentVal == '') {
				self.$vux.toast.text('请选择企业!','middle');
			}else if (self.searchInput == '') {
				self.$vux.toast.text('请选择用户!','middle');
			}else if (boolean) {
				self.$vux.toast.text('您没有做任何操作!','middle');
				return
			}else{
				console.log(888)
				self.parentEnterpriseCode = self.parentEnterpriseCode ? self.parentEnterpriseCode : self.enterprise.comp_code
				let str = ""
				str = self.checklist.join(",")
				let userTypeData = {
					'inenterpriseCode' : self.enterprise.comp_code,
					'parentEnterpriseCode' : self.parentEnterpriseCode,
					'userType' : str
				}
				let datas = {
					'sessionId' : self.adminSessionId,
					'userId' : self.userInfo.userId,
					'enterpriseCodeUserType' : JSON.stringify(userTypeData)
				}
				console.log(datas)
				if (self.checklist.length == 0) {
					let delEnterpriseCode = self.enterprise.comp_code + ',' + self.parentEnterpriseCode
					self.deleteEnterprisUser(delEnterpriseCode);
					return
				}
				self.$axios({
					url:'/account_auth_admin/user-api.updateUserType',
					method:'post',
					responseType:'json',
					data:datas
				})
				.then(function(res){
					console.log('finish',res);
					if (res.data.status == 1) {
						self.$vux.toast.text('用户类型变更成功!','middle');
						self.findByEnterpriseCode();
					}else{
						self.$vux.toast.text('用户类型变更失败!','middle');
					}
				})
				.catch(function(res){
					console.log('finish Error',res);
				})
			}

		},
		checkChange(val,label){//选择用户类型
			let self = this;
			let currentType = val[val.length-1]
			console.log('当前类型',currentType)
			console.log('self.checklist',self.checklist)
			if (currentType == "CUSER") {
				for(let x=0;x<self.checklist.length;x++){
					if (self.checklist[x] == "BUSER") {
						self.checklist.splice(x,1)
					}
				}
			}else if(currentType == "BUSER"){
				for(let y=0;y<self.checklist.length;y++){
					if (self.checklist[y] == "CUSER") {
						self.checklist.splice(y,1);
					}
				}
			}
		},
		selectAll(){//全选
			let self = this;
			self.selectAllShow = !self.selectAllShow;
			console.log(self.commonList)
			if (self.selectAllShow) {
				self.commonList.forEach(function(item,index){
					self.checklist.push(item.key)
				})
			}else{
				self.checklist = [];
			}
		},
		selectName(item){//点击当前用户
            let self = this;
            console.log('点击用户',item)
            self.userInfo = item;
            self.searchInput = item.name ? item.name : item.userName;
            self.userSearchShow = false;
            self.isScrollShow = false;
            self.userResults = [];
            self.findByEnterpriseCode();
        },
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/Jurisdiction');
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
		getResult(val){//搜索框
            let self = this;
            console.log(val)
            if(self.currentVal.length != 0){
                self.userResults = [];
                self.currentPage = 1;
                self.pageSize = 20;
                clearTimeout(self.timer)
                self.state++;
                self.timer = null;
                self.resultload('1', val)
            }
        },
        shadowChange(val){//选择企业
        	let self = this;
        	console.log('------',val[0])
        	console.log('currentVal',self.currentVal)
        	self.backupAdmin.forEach(function(item,index){
        		if (val[0] == item.comp_name) {
        			self.enterprise = item;
        			console.log('切换企业',item)
        		}
        	})
        	self.$axios({
        		url:'/UAMS/Auth/queryCompany',
        		method:'post',
        		responseType:'json',
        		data:{
        			'compCode' : self.enterprise.comp_code
        		}
        	})
        	.then(function(res){
        		console.log('shadowChange',res);
        		if (res.data.success) {
        			let resData = res.data.data
        			if (resData.company) {
        				self.parentEnterpriseCode = resData.company.cluster_code
        			}
        		}
        	})
        	.catch(function(res){
        		console.log('shadowChange Error',res);
        	})
        },
        onSubmit () {
            let self = this;
            self.$refs.search.setBlur()
            self.$vux.toast.show({
                type: 'text',
                position: 'top',
                text: 'on submit'
            })
        },
        onFocus () {//搜索框获取焦点
        	let self = this;
            console.log('on focus')	
            self.tabSpace = true;
            self.userSearchShow = true;
            self.isScrollShow = true;
            console.log('currentVal',self.currentVal)
            if (self.currentVal.length != 0) {
            	self.state++;
                self.currentPage = 1;
                self.pageSize = 20;
                self.$refs.search.setFocus()
                if(self.timer == null){
                    self.resultload('0', self.searchValue)
                }
            }
        },
        onCancel () {//搜索框取消
        	let self = this;
            console.log('on cancel')
            self.tabSpace = false;
        },
        equal(objA, objB){//比较数组
            let self = this;
            if (typeof arguments[0] != typeof arguments[1]){
                return false;
            }
            //数组
            if (arguments[0] instanceof Array){
                if (arguments[0].length != arguments[1].length){
                    return false;
                }
                let allElementsEqual = true;
                for (let i = 0; i < arguments[0].length; ++i){
                    if (typeof arguments[0][i] != typeof arguments[1][i]){
                        return false;
                    }
                    if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number'){
                        allElementsEqual = (arguments[0][i] == arguments[1][i]);
                    }else{
                        // allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等     
                        allElementsEqual = self.equal(arguments[0][i], arguments[1][i])
                    }
                }
                return allElementsEqual;
            }
            return arguments[0] == arguments[1];
        },
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
	.prompt_text{
        width:100%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        font-size: 0.8rem;
        color:#aaa;
    }
    .user_deta{
	    padding:.8rem;
	    border-bottom:1px solid #D9D9D9;
	}
</style>

<style>
	.checkList .vux-checklist-label-left{
        height: 38px;
    }
</style>