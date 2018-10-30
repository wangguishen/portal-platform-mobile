<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<search
		    @on-change="getResult"
		    v-model="searchValue"
		    position="fixed"
		    placeholder="请选择用户角色"
		    auto-scroll-to-top
		    @on-focus="onFocus"
		    @on-cancel="onCancel"
		    @on-submit="onSubmit"
		    ref="useSearch"
		    class="user_search">
		    <div v-show="userSearchShow" :style="{'minHeight':maxHeight+'px'}">
		    	<div class="user_deta" v-for="item in results">
		    		<div @click="selectName(item)">
		    			{{item.real_name}}
		    		</div>
		    	</div>
		    	<load-more v-show="loading" class="loadCla" :show-loading="showLoad" :tip="loadText"></load-more>
		    </div>
	    </search>
		<div class="container_top orgcha" :class="{'user_text':contTop}">
		    <group>
				<cell
					:title="currentFrim.comp_name"
					:arrow-direction="goverShow ? 'down' : 'right'"
					:border-intent="false"
					@click.native="lookClass()"
					is-link>
				</cell>
				<template v-if="goverShow">
					<template  v-for="(first,index) in firstList">
						<template v-if="first.isRole">
							<checklist class="first_cells" label-position="left" :options="[first]" v-model="listArr" :check-disabled="false" @on-change="changeHandle"></checklist>
						</template>
						<template v-else>
							<cell
								class="first_cell"
								:title="first.dept_name"
								:border-intent="false"
								@click.native="lookClassify(first, firstList)">
							</cell>
						</template>
					</template>
				</template>
		    </group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Search, LoadMore, Cell, Group, CellBox, Swipeout, SwipeoutItem, SwipeoutButton, Checklist, Radio } from 'vux'
export default{
	components: {
        VHeader, Search, LoadMore, Cell, Group, CellBox, Swipeout, SwipeoutItem, SwipeoutButton, Checklist, Radio
    },
	data(){
		return{
			currentFrim: {},//集团
			gover:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "授权",
            },
            results: [],
      		searchValue: '',//输入框的内容
      		userSearchShow: false,//是否显示模态框
      		contTop: false,//内容的高度显示
      		selectObj:{},//选中的对象
      		maxHeight:0,//搜索模态显示框的最大高度
      		pageSize:10,//每页条数
        	currentPage:1,//当前第几页
        	//加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            loading:false,
            timer:null,
            // 主体
            goverShow:true,//集团图标显示
            firstList:[],//存储所有信息
            firstArr:[],//数组集合
            firstArrList:[],//数组集合
            listArr: [],//提交的操作集合
            backupList:[],//备份已经有的
            backupObj:[],//备份已经有的
            addList:[],
            deleteList:[],
            state:1,
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.gover = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.gover.name;
		self.maxHeight = document.body.clientHeight - 90;
		self.$refs.useSearch.$el.lastElementChild.style.maxHeight = self.maxHeight+'px';//模态框设置最大高度
		let url = "/UAMS/department/query_dep_list";
		let data = {
			"compCode": self.currentFrim.comp_code,
		}
		self.askOrcha(url, data);
		self.$nextTick(() => {
      		self.$refs.useSearch.$el.lastElementChild.addEventListener('scroll', ()=>{
      			let obj = self.$refs.useSearch.$el.lastElementChild;
      			let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
      			let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
      			let modBoxHei = self.$refs.useSearch.$el.lastElementChild.offsetHeight;//模块盒子的高度
      			let modBoxTop = self.$refs.useSearch.$el.lastElementChild.scrollTop;//模块盒子的scrollTop
      			if(sumHeight >= modBoxHei){
      				if((sumHeight - modBoxHei) <= modBoxTop){
      					if(self.timer == null){
      						self.state++;
      						self.resultload('2',self.searchValue)
      					}
	      			}
      			}
      		})
    	})
	},
	methods:{
		backWay(data){//返回
			let self = this;
			self.$router.back('/mangenallot')
		},
		finish(data){//授权
			let self = this;
			let arr = self.listArr.slice(0);//新增
			let arr2 = self.backupList.slice(0);//删除
			for(let k=0;k<arr.length;k++){
				for(let j=0;j<self.backupList.length;j++){
					if(self.backupList[j] == arr[k]){
						arr.splice(k,1)
					}
				}
			}
			for(let j=0;j<arr2.length;j++){
				for(let k=0;k<self.listArr.length;k++){
					if(arr2[j] == self.listArr[k]){
						arr2.splice(j,1)
					}
				}
			}
			if(self.searchValue == ''){
				self.$vux.toast.text('请选择用户角色', 'middle')
			}else if(arr.length == 0 && arr2.length == 0){
				self.$vux.toast.text('你还没有进行任何修改', 'middle')
			}else{
				self.referAccredit(arr,arr2)
			}
		},
		lookClass(){//点击集团查看分类
			let self = this;
			self.goverShow = !self.goverShow;
		},
		lookClassify(obj, list){//点击系统
			let self = this;
			list.forEach(function(item, index){
				if(item.id == obj.id){
					if(item.parent_id){
						item.firstShow = !item.firstShow;
					}else{
						item.systemShow = !item.systemShow;
					}
				}else{
					if(item.parent_id){
						item.firstShow = false;
					}else{
						item.systemShow = false;	
					}
				}
			})
		},
    	getResult (val) {//输入框值变化的时候
    		let self = this;
    		self.results = [];
    		clearTimeout(self.timer)
    		self.state++;
    		self.timer = null;
			self.resultload('1', val)
    	},
    	changeHandle(value){//多选切换
    		let self = this;
    		// if(self.listArr.indexOf){}
		},
    	onSubmit () {//移动端输入框的搜索按钮或者pc端的enter按钮
    		let self = this;
  			self.$refs.useSearch.setBlur()
		},
    	onFocus () {//触及input搜索框
      		let self = this;
      		self.userSearchShow = true;
      		self.state++;
      		self.$refs.useSearch.setFocus()
      		if(self.timer == null){
				self.resultload('0', self.searchValue)
			}
    	},
    	onCancel () {//输入框取消按钮
    		let self = this;
    		self.contTop = false;
    		self.currentPage = 1;
    		self.state = 0;
    		self.timer = null;
    		self.listArr = []
      		console.log('on cancel')
    	},
    	selectName(item){//点击当前人物姓名
    		let self = this;
    		console.log(item)
    		self.searchValue = item.real_name;
    		self.userSearchShow = false;
    		self.contTop = true;
    		self.selectObj = item;
    		self.listArr = [];
    		let url = "UAMS/role/queryRoleByUserId";
    		let data = {
	      	  	'compCode': item.comp_code,
	      	  	'userId': item.id
	      	}
		    self.askUser(url, data)
    	},
    	askSearch(val, type){//加载角色信息数据
    		let self = this;
    		let data = {
    			'username':val,
	      		// 'username':"王",
		      	'compCode':self.currentFrim.comp_code,
		      	'pageSize':self.pageSize,
		      	'currentPage':self.currentPage
    		}
    		self.$axios({
	    		url: "/UAMS/user/list?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.success){
	    			let list = res.data.data.data;
	    			if(list.length <= self.pageSize && list.length != 0){
	    				self.loading = false;
	    				if(self.currentPage == 1){
	    					self.results = [];
	    				}
	    				if(list.length != 0 && type == 1){//输入字
	    					self.$refs.useSearch.$el.lastElementChild.scrollTop = 0;
	    				}
	    				if(self.searchValue == val){
	    					list.forEach(function(item, index){
			    				self.results.push(item)
			    			})
	    				}
		    			self.$nextTick(()=>{
		    				if(self.results.length != 0){
		    					if(list.length < self.pageSize){
		    						console.log(88888888)
		    						self.showLoad = false;
		    						self.loadText = '数据加载完毕';
		    						self.loading = true;
		    					}else{
		    						let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
					      			let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
					      			let modBoxHei = self.$refs.useSearch.$el.lastElementChild.offsetHeight;//模块盒子的高度
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
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
    	},
    	askOrcha(url, data){//加载所有角色
    		let self = this;
    		self.$axios({
	    		url: url,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.success){
	    			self.firstArr = res.data.data;
	    			self.firstArrList = res.data.data;
                	self.lookRole();
	    		}else{
	    			self.$vux.toast.text(response.data.msg, 'middle')
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
    	},
    	lookRole(){//查询角色
			let self = this;
			self.$axios({
	    		url: "/UAMS/role/queryRole",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.currentFrim.comp_code,
		    	}
	    	})
	    	.then(function(res) {
	    		console.log('res=====',res)
	    		if(res.data.success){
	    			let list = res.data.data;
	    			self.firstList = [];
	    			list.forEach(function(item, index){
	    				self.$set(item,'parent_id',item.dept_code)
	    				self.$set(item,'dept_name',item.roleName)
	    				self.$set(item,'isRole',true)
	    				self.$set(item,'key',(item.id))
            			self.$set(item,'value',item.roleName)
	    				self.firstArr.push(item)
	    				self.firstList.push(item)
	    			})
	    			console.log('firstArr',self.firstArr)
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		askUser(url, data){
			let self = this;
			self.$axios({
		      	url: url,
		      	method: 'post',
		      	responseType: 'json',
		      	data: data
	      	})
	      	.then(function(res) {
	     		console.log(res)
	     		if(res.data.success){
	     			let list = res.data.data;
	     			self.listArr = [];
	     			self.backupList = [];
	     			self.backupObj = [];
	     			list.forEach(function(item, index){
	     				self.backupObj.push(item)
	     				self.backupList.push(item.id)
	     				self.listArr.push(item.id)
	     			})
	     		}
	      	})
	      	.catch(function(res) {
	        	console.log("error", res)
	      	})
		},
		referAccredit(arr1, arr2){
			let self = this;
			let data = [];
			let url = 'UAMS/permission/ajax/do_role_user_rel';
			for(let x=0;x<arr1.length;x++){
				for(let y=0;y<self.firstArrList.length;y++){
					if(self.firstArrList[y].id == arr1[x]){
						let obj = {};
						obj.roleId = self.firstArrList[y].id;
						obj.userId = self.selectObj.id;
						obj.type = '1';
						data.push(obj)
					}
				}
			}
			for(let x=0;x<arr2.length;x++){
				for(let y=0;y<self.backupObj.length;y++){
					if(self.backupObj[y].id == arr2[x]){
						let obj = {};
						obj.id = self.backupObj[y].relId;
						obj.roleId = self.backupObj[y].roleId;
						obj.userId = self.selectObj.id;
						obj.type = '0';
						data.push(obj)
					}
				}
			}
			self.$axios({
                url: url,
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success) {
                	self.$vux.toast.text('授权成功', 'middle');
                }else{
                    self.$vux.toast.text('授权失败', 'middle')
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
    	resultload(type, val){//加载符号的公共样式
    		let self = this;
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
						// self.timer = null;
						clearTimeout(self.timer)
						self.timer = null;
						self.askSearch(val,type);
					},1000)
	    		}
    		}
	    		
    	},
	},
}
</script>
<style lang="less" scoped>
.weui-loadmore{
	margin:10.5px auto;
}
.weui-loadmore.weui-loadmore_line{
	margin-top: 20px;
}
.user_search{
	margin-top: 46px;
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 100;
}
.user_deta{
	padding:.8rem;
	border-bottom:1px solid #D9D9D9;
}
#page_box{
	.container_top{
		margin:0;
		margin-top: 90px;
	}
	.user_text{
		margin-top: 90px;
	}
	.prompt_text{
		width:100%;
		height: 3rem;
		line-height: 3rem;
		text-align: center;
		font-size: 0.8rem;
		color:#aaa;
	}
}
</style>