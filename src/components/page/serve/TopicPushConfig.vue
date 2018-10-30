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
	    	<swipeout class="swipTopBox">
	    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(item,index) in items" :key="index">
	    			<div slot="right-menu">
			          	<swipeout-button @click.native="onButtonAssociate(item,index)" background-color="#38ce58" class="iconfont" :width="60">&#xe61e;</swipeout-button>
			          	<swipeout-button @click.native="onButtonDelete(item,index)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
			        </div>
			        <div slot="content" class="demo-content vux-1px-tb">
		        		<cell :title="item.topic" is-link @click.native="onButtonEdit(item,index)"></cell>
		        	</div>
	    		</swipeout-item>
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
                title: '消息推送配置',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            tabSpace:false,
            results:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	items:[],//topic列表
           	// 分页
	        pageSize: 10000,
	        totalCount:0,
	        currentPage:1,//当前页数
	        timer:null,
	        deleteId:'',//删除主题id
		}
	},
	mounted() {
		let self = this;
		self.getTopicMehtods();
	},
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/DataConfig');
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
					self.items=[]
					if (resData.length == 0) {
						self.loadText = '暂无数据'
					}else{
						self.loadText = '数据加载完毕'
					}
					self.showLoad = false;
					if (resData) {
						resData.forEach(function(item,index){
							self.items.push(item)
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
		finish(){
			let self = this;
			console.log('添加')
			self.$router.go('/TopicPushConfigAdd')
		},
		onButtonAssociate(item){//注册关联
			let self = this;
			console.log('关联',item)
			self.isRelate(item,item.topic);//判断该主题下是否已有关联接口
		},
		isRelate(item,isTopic){//判断是否关联
			let self = this;
			self.$axios({
				url:self.BP_HOST+"/inter/query_by_topic?topic="+isTopic,
				method:'get',
				responseType:'json',
				data:{
					'topic' :  isTopic
				}
			})
			.then((res)=>{
				console.log('isRelate Success',res)
				if (res.data.status == 200) {
					let resData = res.data.data;
					if (resData) {
						self.$vux.toast.text('该主题已关联接口!','middle')
						return
					}
					localStorage.setItem('associateTopic',JSON.stringify(item))
					self.$router.go('/TopicPushConfigAssociate')
				}
			})
			.catch((res)=>{
				console.log('isRelate Error',res)
			})
		},
		onButtonDelete(item,index){
			let self = this;
			console.log('删除',item)
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确定要删除吗?',
				onConfirm(){
					self.deleteId = item.id;
					self.deleteSure();
				},
				onCancel(){
					self.$vux.toast.text('您已取消删除!','middle')
				}
			})
		},
		deleteSure(){
			let self = this;
			self.$axios({
				url:self.BP_HOST+'/messageApplication/delMessageApplication',
				method:'post',
				responseType:'json',
				data:{
					'id' : self.deleteId
				}
			})
			.then((res)=>{
				console.log('deleteSure Success',res)
				if (res.data.message) {
					self.$vux.toast.text('删除topic成功!','middle')
					self.getTopicMehtods();
				}else{
					self.$vux.toast.text('删除topic失败!','middle')
				}
			})
			.catch((res)=>{
				console.log('deleteSure Error',res)
			})
		},
		onButtonEdit(item,index){
			let self = this;
			console.log('编辑',item,index)
			localStorage.setItem('editTopic',JSON.stringify(item))
			self.$router.go('/TopicPushConfigEdit')
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
		getResult(val){//搜索框
            let self = this;
            self.searchInput = val;
            self.loadText="正在加载";
            self.items=[];
            self.showLoad=true;
            if (self.timer == null) {
            	self.timer=setTimeout(()=>{
            		clearTimeout(self.timer);
            		self.timer=null;
            		self.getTopicMehtods();
            	},1000)
            }
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
            self.searchInput = '';
            self.items=[]
            self.getTopicMehtods();
        },
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
	.swipTopBox .weui-cell {
	    padding: 0px 15px;
	}
</style>