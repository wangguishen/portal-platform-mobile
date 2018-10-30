<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<search
		    @result-click="resultClick"
		    @on-change="getResult"
		    v-model="serverInput"
		    top="46px"
		    @on-focus="onFocus"
		    @on-cancel="onCancel"
		    ref="search"
		    class="search_box">
	    </search>
		<div class="container_top link_monitoring" :style="{height: boxHeight+'px'}" ref="scrollerBottomBox">
			<div ref="scrol">
				<swipeout class="vux-1px-tb">
					<swipeout-item transition-mode="follow" :auto-close-on-button-click="false" v-for="(server,index) in serverList" :key="index" ref="swipe">
						<div slot="right-menu">
							<swipeout-button @click.native="onButtonClick(server,index,'pzjc')" background-color="#17def6" class="iconfont" :width="60">&#xe63a;</swipeout-button>
				          	<swipeout-button @click.native="onButtonClick(server,index,'sc')" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
						</div>
						<div slot="content" :class="{'vux-1px-b': index !== 20, 'vux-1px-t': index === 1}">
							<group>
					    		<cell
							    	:title="server.serviceName"
							    	is-link
							    	@click.native="serverDetail(server)">
						    	</cell>
				  			</group>
						</div>
					</swipeout-item>
				</swipeout>
				<load-more :show-loading="showLoad" :tip="loadText"></load-more>
			</div>
				
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Search, Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore } from 'vux'
export default{
	components: {
        VHeader, Search, Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore
    },
	data(){
		return{
			headObj: {
                title: '配置服务器监控',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	icon: "&#xe6b9;",
            },
            serverInput: '',//输入服务器的值
            pageSize: 20,//请求每页的个数
            currentPage: 1,//请求当前页数
            totalPages:0,//总页数
            serverList: [],//请求的服务器数据列表
            //加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            timer:null,//定时器
            boxHeight:0,//box的高度
		}
	},
	mounted(){
		let self = this;
		self.callServer('cx');
		self.$nextTick(() => {
			self.boxHeight = document.body.clientHeight - 90;
			self.$refs.scrollerBottomBox.addEventListener('scroll', ()=>{
				let totalHei = self.$refs.scrol.offsetHeight - document.body.clientHeight;
				let scroll_top = self.$refs.scrollerBottomBox.scrollTop-90;
				if(totalHei == scroll_top || totalHei < scroll_top){
      				if(self.timer == null){
      					if(self.showLoad){
      						if(self.totalPages >= self.currentPage){
								self.timer = setTimeout(() => {
		      						clearTimeout(self.timer)
		      						self.timer = null;
		      						if(self.currentPage == 1){
		                                self.currentPage+=2;
		                            }else{
		                                self.currentPage++;
		                            }
									self.callServer('wxjz');
								},1000)
      						}else{
      							// self.loadText = "数据已加载完毕";
  	        		// 			self.showLoad = false;
      						}
      					}
      				}
      			}
			})
		})
	},
	methods:{
		backWay(data){
			let self = this;
			self.$router.back('/dataconfig')
		},
		finish(data){
			let self = this;
			let item = {
				title: '添加服务器',
				path: '/ServiceControl',
				type: 'fwqjk'
			}
			localStorage.setItem("addPage", JSON.stringify(item));
			self.$router.go('/addpage')
			console.log(data)
		},
		resultClick(item){//手机按键搜索事件
			let self = this;
			console.log(item)
		},
		getResult(val){//搜索的值变换时
			let self = this;
			self.serverList = [];
			self.loadText = "正在加载";
			self.showLoad = true;
			self.currentPage = 1;
			self.pageSize = 20;
			if(self.timer == null){
				self.timer = setTimeout(() => {
					clearTimeout(self.timer)
					self.timer = null;
					self.callServer('cx');
				},1000)
			}
		},
		onFocus(){//搜索框点击事件
	    	let self = this;
	      	console.log('on focus')
	    },
	    onCancel(){//搜索框取消事件
	    	let self = this;
	      	console.log('on cancel')
	    },
	    onButtonClick(item, index, type){//滑动后操作按钮
	    	let self = this;
	    	let url = '',data = {},method = '';
	    	if(type == 'sc'){
	    		self.$vux.confirm.show({
					title: '删除服务器监控',
					content: '您确定要删除此服务器监控吗？',
					onCancel () {
						self.$refs.swipe[index].close();
					},
					onConfirm () {
						url = "/basic-platform/server/del";
		      			data = {
		                    'id': item.id,
		      			};
		      			method = 'delete';
		      			self.askServer(url, data, method, type, item, index);
					}
				})
	    	}else if(type == 'pzjc'){
	    		self.$vux.toast.text('配置进程暂未开发', 'middle')
	    		self.$refs.swipe[index].close();
	    	}
	    },
	    serverDetail(item){//点击进入详情以及编辑
	    	let self = this;
	    	item.plateCode = '2';
	    	item.pathPage = '/ServiceControl'
	    	localStorage.setItem("DetailsInfoMation", JSON.stringify(item));
	    	self.$router.go('/lookdetail')
	    },
	    callServer(type){//请求服务器监控
	    	let self = this;
	    	let url = '/basic-platform/server/sel?serviceName='+self.serverInput+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage;
	    	let data = {
	    		serviceName: self.serverInput,
	    		pageSize: self.pageSize,
	    		currentPage: self.currentPage
	    	};
	    	let method = 'get';
	    	self.askServer(url, data, method, type)
	    },
	    askServer(url, data, method, type, obj, index){//公共请求
	    	let self = this;
	    	self.$axios({
  	      		url: url,
  	      		method: method,
  	      		responseType: 'json',
  	      		data:data
  	    	})
  	    	.then(function(res) {
  	    		console.log(res)
  	      		if(res.data.status == 200) {
  	        		let list = res.data.data;
  	        		self.pageSize = 10;
  	        		if(type == 'cx'){
  	        			self.serverList = [];
  	        			self.totalPages = res.data.page.totalPages;
	  	        		list.forEach(function(item, index){
	  	        			self.serverList.push(item)
	  	        		})
	  	        		self.$nextTick(()=>{
	  	        			if(self.$refs.scrol.offsetHeight <= document.body.clientHeight){
	  	        				if(list.length == self.pageSize){
	  	        					self.timer = setTimeout(() => {
		  	        					self.currentPage++;
		  	        					self.callServer('wxjz');
		  	        					clearTimeout(self.timer);
		  	        					self.timer = null;
		  	        				},1000)
	  	        				}
	  	        			}
	  	        		})
  	        		}else if(type == 'wxjz'){
  	        			if(self.currentPage <= res.data.page.totalPages){
							list.forEach(function(item, index){
		  	        			self.serverList.push(item)
		  	        		})
  	        			}else{
  	        				self.loadText = "数据已加载完毕";
  	        				self.showLoad = false;
  	        			}
  	        		}else if(type == 'sc'){
  	        			self.serverList.splice(index,1)
  	        			self.$refs.swipe[index].close();
  	        			self.$vux.toast.text('删除服务器监控成功','middle')
  	        		}
  	        		if(list.length < self.pageSize){
  	        			if(list.length == 0){
  	        				self.loadText = "暂无数据";
  	        				self.showLoad = false;
  	        			}else{
  	        				self.loadText = "数据已加载完毕";
  	        				self.showLoad = false;
  	        			}
  	        		}
	      		}else{
  	      			self.$vux.toast.text('服务器监控数据查询失败','middle')
  	      		}
    		})
    		.catch(function(res) {
  	      		console.log("queryData error", res)	
  	    	})
	    },
	},
}
</script>
<style lang="less" scoped>
#page_box .link_monitoring{
	margin-top: 90px;
}
.weui-loadmore_line,.weui-loadmore{
	margin: .5rem auto;
}
.weui-loadmore{
	margin-top: 1rem;
}
.weui-loadmore_line{
	margin-top: 1.5rem;
	margin-bottom: 0rem;
}
</style>