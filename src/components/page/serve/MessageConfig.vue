<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入主题名称"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 46px;">
	        </search>
	    </div>
	    <div :class="{'tabSpace':tabSpace}">
	    	<swipeout class="swipTopicBox">
	    		<template v-for="(item,index) in topicLists">
	    			<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="showLogs(item,index)" background-color="#38ce58" class="iconfont" :width="60">&#xe646;</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell :title="item.topic" is-link @click.native="paraDetails(item,index)"></cell>
			        	</div>
		    		</swipeout-item>
	    		</template>
	    	</swipeout>
	    </div>
	    <load-more :show-loading="showLoad" :tip="loadText"></load-more>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,Swipeout,SwipeoutItem,SwipeoutButton,Cell}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,Swipeout,SwipeoutItem,SwipeoutButton,Cell
	},
	data() {
		return {
			headObj: {
                title: '消息推送',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	// icon:'&#xe6b9;'
            },
            tabSpace:false,
            results:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	topicLists:[],//主题列表
           	timer:null,
		}
	},
	mounted() {
		let self = this;
		self.getTopicMehtods()
	},
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/OpenService');
		},
		finish(){
			let self = this;
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
		getResult(val){//搜索框
            let self = this;
            self.searchInput = val;
            self.loadText="正在加载";
            self.topicLists=[];
            self.showLoad=true;
            if (self.timer == null) {
            	self.timer=setTimeout(()=>{
            		clearTimeout(self.timer);
            		self.timer=null;
            		self.getTopicMehtods();
            	},1000)
            }
        },
        getTopicMehtods(){//请求topic
			let self = this;
			self.$axios({
				url:self.BP_HOST+"/messageApplication/queryMesseageApplication?pageSize="+self.pageSize+"&currentPage="+self.currentPage+"&topic="+self.searchInput,
				method:'get',
				responseType:'json',
				data:{
					'topic' : self.searchInput
				}
			})
			.then((res)=>{
				console.log('getTopicMehtods Success',res)
				if (res.data.message) {
					let resData = res.data.data;
					self.topicLists=[]
					if (resData.length == 0) {
						self.loadText = '暂无数据'
					}else{
						self.loadText = '数据加载完毕'
					}
					self.showLoad = false;
					if (resData) {
						resData.forEach(function(item,index){
							self.topicLists.push(item)
						})
					}else{
						self.$vux.toast.text('该接口下暂无参数!','middle')
					}
				}else{
					self.$vux.toast.text('请求接口失败!','middle')
				}
			})
			.catch((res)=>{
				console.log('getTopicMehtods Error',res)
			})
		},
        paraDetails(item){//参数详情
        	let self = this;
        	let obj = {
        		path: '/MessageConfig'
        	}
        	console.log('参数详情',item)
        	localStorage.setItem('serveList',JSON.stringify(item))
        	localStorage.setItem('jumpRoutePath',JSON.stringify(obj));
        	self.$axios({
        		url:self.BP_HOST+"/inter/query_by_topic?topic="+item.topic,
        		method:'get',
        		responseType:'json',
        		data:{
        			'topic' : item.topic
        		}
        	})
        	.then((res)=>{
        		console.log('paraDetails Success',res)
        		if (res.data.status == 200) {
        			let resData = res.data.data;
        			if (!resData) {
        				self.$vux.toast.text('该主题下暂无关联接口','middle')
        				return
        			}
        			localStorage.setItem('serveList',JSON.stringify(resData))
        			self.$router.go('/ServeDetails')
        		}
        		else{
        			self.$vux.toast.text('无效接口!','middle')
        		}
        	})
        	.catch((res)=>{
        		console.log('paraDetails Error',res)
        	})
        },
        showLogs(item){//日志展示
        	let self = this;
        	console.log('日志展示',item)
        	// localStorage.setItem('logsJson',JSON.stringify(item))
        	// self.$router.go('/logShow')
        	self.isExist(item)
        },
        isExist(item){//判断该主题下是否有日志参数
        	let self = this;
        	self.$axios({
        		url:'http://172.19.4.232:4444/vr-push/queryApollo?topic='+item.topic,
        		method:'get',
        		responseType:'json',
        		data:{
        			'topic' : item.topic
        		}
        	})
        	.then((res)=>{
        		console.log('isExist Success',res)
        		if (res.data.status == 200) {
        			let resData = res.data.data;
        			if (resData.length == 0) {
        				self.$vux.toast.text('该主题下暂无展示参数','middle')
        				return
        			}
        			localStorage.setItem('logsJson',JSON.stringify(item))
        			self.$router.go('/logShow')
        		}
        	})
        	.catch((res)=>{
        		console.log('isExist Error',res)
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
        },
        onCancel () {//搜索框取消
        	let self = this;
            console.log('on cancel')
            self.tabSpace = false;
            self.topicLists = [];
            self.searchInput='';
            self.loadText="正在加载";
            self.showLoad = true;
            setTimeout(()=>{
            	self.getTopicMehtods()
            },1000)
        },
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
	.swipTopicBox .weui-cell {
	    padding: 0px 15px;
	}
</style>