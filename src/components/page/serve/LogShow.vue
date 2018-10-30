<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div class="logsShow" style="margin-top: 47px;" :style="{heigth:boxHeigth+'px'}" ref="scrollerBox">
    		<div ref="scrol">
    			<template v-for="(item,index) in topicList">
	    			<group>
			    		<cell title="日志序列ID" :value="item.id" is-link @click.native="showDetails(item,index)"></cell>
			    	</group>
		    	</template>
		    	<!-- <load-more :show-loading="showLoad" :tip="loadText"></load-more> -->
    		</div>
    		<load-more :show-loading="showLoad" :tip="loadText"></load-more>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,Group,Cell,XTextarea}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,Group,Cell,XTextarea
	},
	data() {
		return {
			headObj: {
                title: '日志展示',
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
           	Logs:{},
           	showTopic:'',
       	 	pageSize: 1000,
	        totalCount:0,
	        currentPage:1,//当前页数
	        topicList:[],
	        boxHeigth:200,
	        timer:null,
		}
	},
	mounted() {
		let self = this;
		let jsonShow = JSON.parse(localStorage.getItem('logsJson'))
		console.log('jsonShow',jsonShow)
		self.showTopic = jsonShow.topic;
		self.getShowLogs();
		self.$nextTick(()=>{
			self.boxHeigth = document.body.clientHeight - 46;
			// window.addEventListener('scroll',()=>{
			// 	let scrollTop = document.body.scrollTop;
			// 	if (scrollTop+window.innerHeight >= document.body.clientHeight) {
			// 		self.getShowLogs()
			// 	}
			// })
			console.log(document.body.clientHeight)//736
			console.log(self.boxHeigth)//690
			self.$refs.scrollerBox.addEventListener('scroll',()=>{
				let totalHeight = self.$refs.scrol.offsetHeight - document.body.clientHeight;
				let scroll_top = self.$refs.scrollerBox.scrollTop - 46;
				console.log(totalHeight,scroll_top)
				if (totalHeight == scroll_top || totalHeight < scroll_top) {
					if (self.timer == null) {
						self.timer = setTimeout(()=>{
							if (self.currentPage == 1) {
								self.currentPage+=2;
							}else {
								self.currentPage++;
							}
							self.getShowLogs()
						},1000)
					}
				}
			})
		})
	},
	methods: {
		getShowLogs(){
			let self = this;
			console.log(self.pageSize,self.currentPage)
			self.$axios({
				url:'http://172.19.4.232:4444/vr-push/queryApollo?pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&topic='+self.showTopic,
				method:'get',
				responseType:'json',
				data:{
					'topic' : self.showTopic
				}
			})
			.then((res)=>{
				console.log('getShowLogs Success',res)
				if (res.data.status == 200) {
					self.topicList = []
					let resData = res.data.data;
					if (resData.length == 0) {
						self.loadText = '暂无数据'
					}else{
						self.loadText = '数据加载完毕'
					}
					self.showLoad = false
					resData.forEach(function(item,index){
						self.topicList.push(item)
					})
					self.$nextTick(()=>{
						clearTimeout(self.timer)
						self.timer = null;
					})
				}else{
					self.$vux.toast.text('服务器信息错误!','middle')
				}
			})
			.catch((res)=>{
				console.log('getShowLogs Error',res)
			})
		},
		showDetails(item){//跳转日志展示
			let self = this;
			console.log('单条日志详情',item)
			localStorage.setItem('logShowDetails',JSON.stringify(item))
			self.$router.go('/LogShowDetails')
		},
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/MessageConfig');
		},
		finish(){
			let self = this;
		},
	}
}
</script>

<style lang="less" scoped>
	.logsShow .weui-cell {
		padding: 0 15px;
	}
</style>
<style>
	.weui-loadmore_line .weui-loadmore__tips {
		top: 0;
	}
</style>