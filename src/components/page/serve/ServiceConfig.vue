<template>
	<div id="page_box" style="overflow:-Scroll;overflow-y:hidden">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            @on-change="getResult"
	            v-model="serveInput"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            placeholder="请输入服务名称"
	            style="margin-top: 48px;">
	        </search>
	        <div :class="{'tab':tab}">
			    <div class="sysgover">
			    	<div class="list_menu">
					    	<swipeout>
						    	<swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(item,index) in items" :key="index">
							        <div slot="right-menu">
							          	<swipeout-button @click.native="onButtonClick(index)" type="primary">编辑</swipeout-button>
							          	<swipeout-button @click.native="onButtonDelete(index)" type="warn">删除</swipeout-button>
							        </div>
						        	<div slot="content" class="demo-content vux-1px-tb">
						        		<cell :title="item.serviceName" :value="'服务编号'+item.id"></cell>
						        	</div>
						      	</swipeout-item>
						    </swipeout>
					</div>
			    </div>
			</div>
		    <!-- 编辑弹框 -->
			<div v-transfer-dom>
			    <confirm v-model="bjshow"
			      	show-input
			      	:title="title1"
			      	:input-attrs="{type: 'string'}"
			      	@on-cancel="onCancel1"
			      	@on-confirm="onbjConfirm"
			      	@on-show="onEditShow"
			      	@on-hide="onHide"
			      	placeholder="请输入服务名称"
			      	ref="conf">
	      		</confirm>
	    	</div>
	    	<!-- 新增服务弹框 -->
	    	<div v-transfer-dom>
			    <confirm v-model="addshow"
			      	show-input
			      	:title="title1"
			      	:input-attrs="{type: 'string'}"
			      	@on-cancel="onCancel1"
			      	@on-confirm="onaddConfirm"
			      	@on-show="onShow"
			      	@on-hide="onHide"
			      	placeholder="请输入服务名称">
	      		</confirm>
	    	</div>
	    	<load-more :show-loading="showLoad" :tip="loadText"></load-more>
		</div>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Cell, Group, Search, Swipeout, SwipeoutItem, SwipeoutButton, XTable, Confirm, TransferDomDirective as TransferDom, Toast,LoadMore} from 'vux'
	export default {
		directives: {
    		TransferDom
  		},
		components:{
			Confirm,
	        VHeader,
	        Search,
	        XTable,
	        Swipeout,
    		SwipeoutItem,
    		SwipeoutButton,
    		Group,
    		Cell,
    		Toast,
    		LoadMore
		},
		data () {
			return{
				showMenus: false,
				bjshow:false,
				addshow:false,
				title1:"服务配置",
				title2:"操作提示",
	            results: [],
	            serveInput: '',//搜索框输入内容
	            loadText:'',//加载指示字体
	            showLoad:true,//加载提示符是否显示
	            timer:null,//定时器
	            headObj:{
	                title:"服务配置",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                icon: '&#xe6b9;',
	            },
	            tab:false,
	            items:[],
	            selectIndex:0,//选中
	            itemIndex:0,
	            currentPage: 1,//当前页数
            	pageSize: 10,//一页几条信息
            	pageIndex:0,
            	isSeek:true,
            	//提示框
	            state:{
	            	name: "",
	            	isShow: false,
	            }
			}
		},
		mounted(){
			let self = this;
			self.ask();
		},
		methods: {
			// refresh() {
			// 	let self = this;
		 //        setTimeout(() => {
		 //        	self.currentPage = 1;
		 //        	self.items = [];
		 //        	self.ask();
		 //        }, 1500)
	  //     	},
	  //     	loadMore(done) {
	  //     		console.log('infinite called..')
	  //     		let self = this;
	  //     		if(self.pageIndex == 0){
	  //     			setTimeout(() => {
			//         	self.pageIndex = 1;
			//         	self.ask();
			//         }, 1500)
	  //     		}
	  //     	},
	      	handleEvents (type) {
		    	let self = this;
		    	// self.lockYShow = true;.
		      	console.log('event: ', type)
		    },
			ask(){//请求列表
				let self = this;
				console.log(self.serveInput);
				let data={
					'serviceName' : self.serveInput
				}
				self.$axios({
					url: self.BP_HOST+'/module/sel?serviceName='+self.serveInput+"&pageSize="+self.pageSize+"&currentPage="+self.currentPage,
					method: 'get',
					responseType: 'json',
					data:data
				})
				.then(function(response){
					console.log(response);
					let askData = response.data.data;
					if (askData.length == 0) {
						self.loadText="暂无数据";
					}else{
						self.loadText="数据加载完毕"
					}
					self.showLoad=false;
					self.items = [];
					askData.forEach(function(item,index){
						self.items.push(item)
					})
					// self.$nextTick(()=>{
	    // 				self.isSeek = true;
	    // 				if(askData.length >= 0 && askData.length < self.pageSize){
	    // 					setTimeout(() => {
	    //                         self.$refs.my_scroller.finishPullToRefresh();
	    //                         self.$refs.my_scroller.finishInfinite(1);
	    //                		})
	    // 				}else{
	    // 					self.pageIndex = 0;
	    // 					self.currentPage++;
		   //  				setTimeout(() => {
	    //                         self.$refs.my_scroller.finishInfinite(0);
	    //                		})
	    // 				}
	    // 			})
				})
				.catch(function(response){
					console.log('error');
				})
			},
			getResult(val){//搜索框
				let self = this;
				self.serveInput = val;
				// if(self.isSeek){
				// 	self.isSeek = false;
				// 	self.currentPage = 1;
				// 	self.items = [];
				// 	setTimeout(() => {
		  //               self.$refs.my_scroller.finishInfinite(0);
		  //      		})
				// }	
				self.loadText="正在加载",
				self.showLoad=true,
				self.items = [];
				if (self.timer == null) {
					self.timer = setTimeout(()=>{
						clearTimeout(self.timer);
						self.timer=null,
						self.ask();
					},1000)
				}
			},
			goes(){
	            let self = this;
	        },
	        backWay(data){//返回按钮
	        	let self = this;
	        	self.$router.back('/DataConfig');
	            console.log(data)
	        },
	        finish(data){//右侧加号新增服务
	            console.log(data)
	            let self = this;
	            // self.$refs.my_scroller.finishPullToRefresh();//去掉加载
    			self.addshow = true;
	        },
	        onaddConfirm(val){//新增服务确认
	        	let self = this;
	        	self.register_edit('add',val)
	        },
	        onButtonClick (index,item) {//编辑按钮
	        	let self = this;
      			self.selectIndex = index;
      			// console.log(self.selectIndex);
      			console.log(self.items[index].serviceName);
      			self.bjshow = true;

    		},
    		onEditShow(){//编辑弹框show
    			let self = this;
    			let value = self.items[self.selectIndex].serviceName;
    			console.log(value)
    			self.$refs.conf.setInputValue(value)//把值传入弹框
    		},
    		onbjConfirm (val) {//编辑弹框确认按钮
	          	let self = this;
	          	console.log(val)//修改后的值
	          	self.register_edit('edit',val);
	        },
	        register_edit(ur,val){//编辑或新增
	        	let self = this;
	        	self.itemValue = val;
	        	console.log(self.itemValue);
	        	let urls="";
	        	let data="";
	        	let types="";
	        	if (ur == "add") {
	        		types = "post";
	        		urls = "add";
	        		data = {
	        			'serviceName': self.itemValue
	        		}
	        	}else if (ur == "edit") {
	        		types="put";
    				urls = "up";
    				data = {
    					'id': self.items[self.selectIndex].id,
    					'serviceName': self.itemValue
    				}
	        	}
	        	console.log(data);
	        	self.$axios({
	        		url: "/basic-platform/module/"+urls,
		    		method: types,
		    		responseType: 'json',
		    		data: data
	        	})
	        	.then(function(response){
	        		console.log(response);
	        		if (response.data.status == 200) {
	        			if (ur == "edit") {
	      //   				self.state.name = "修改服务成功！";
							// self.state.isShow = true;
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'修改服务成功!'
							},1500)
	        				self.ask();
	        			}else if (ur == "add") {
	      //   				self.state.name = "新增服务成功！";
							// self.state.isShow = true;
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'新增服务成功!'
							},1500)
	        				self.ask();
	        			}
	        		}else {
	        			if (ur == "edit") {
	        				console.log('修改服务失败！');
	      //   				self.state.name = "修改服务失败！";
							// self.state.isShow = true;
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'修改服务失败!'
							},1500)
	        			}else if (ur == "add") {
	        				console.log('新增服务失败！');
	      //   				self.state.name = "新增服务失败！";
							// self.state.isShow = true;
							self.$vux.toast.show({
								type:'text',
								position:'middle',
								text:'新增服务失败!'
							},1500)
	        			}
	        		}
	        	})
	        	.catch(function(response){
	        		console.log("error");
	    //     		self.state.name = response.data.message;
					// self.state.isShow = true;
	        	})

	        },
    		onButtonDelete(index){//删除按钮
    			let self = this; 
    			// self.delshow = true;
    			self.$vux.confirm.show({
    				title:'操作提示',
    				content:'确定删除吗?',
    				onCancel(){
    					self.$vux.toast.text('已取消删除!','middle');
    				},
    				onConfirm(){
    					self.ondelConfirm();
    				}
    			})
    			self.itemIndex = index;
    			self.selectIndex = self.items[index].id;
    			console.log(self.selectIndex);
    		},
	        ondelConfirm () {//删除弹框确认按钮
	          	let self = this;
	          	self.$axios({
	          		url: "/basic-platform/module/del",
	    			method: 'delete',
	    			responseType: 'json',
	    			data:{
	    				'id' : self.selectIndex
	    			}
	          	})
	          	.then(function(response){
	          		console.log(response);
	          		self.items.splice(self.itemIndex,1)
	          		// self.state.name = "删除服务成功！";
					// self.state.isShow = true;
					self.$vux.toast.show({
						type:'text',
						position:'middle',
						text:'删除服务成功!'
					},1500)
	          		// self.ask();
	          	})
	          	.catch(function(response){
	          		console.log("error");
	          		self.state.name = response.data.message;
					self.state.isShow = true;
	          	})
	        },
	        resultClick (item) {
	            window.alert('you click the result item: ' + JSON.stringify(item))
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
	        onFocus () {//搜索框点击
	        	let self = this;
	            console.log('on focus')
	            self.tab = true;	
	            // self.ask();
	        },
	        onCancel () {//搜索框取消
	        	let self = this;
	            console.log('on cancel')
	            self.tab = false;
	            // self.ask();
	        },
	        onShow () {
	          	console.log('promt show')
	        },
	        onHide () {
	          	console.log('prompt hide')
	        },
	        onCancel1 () {
	          	console.log('prompt cancel')
	        }
	    }
	}
	
</script>

<style lang="less" scoped>
	.demo-content {
  		/*padding: 10px 10px;*/
	}
</style>
<style>
	.tab{
		margin-top: 92px;
	}
</style>