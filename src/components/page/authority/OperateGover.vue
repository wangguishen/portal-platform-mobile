<template>
	<div id="page_box" ref="pageBox">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<search
		    @result-click="resultClick"
		    @on-change="getResult"
		    v-model="sysInput"
		    top="46px"
		    @on-focus="onFocus"
		    @on-cancel="onCancel"
		    ref="search"
		    class="search_box">
	    </search>
		<div class="container_top sysgover" style="margin-top: 90px;" :style="{height: boxHeight+'px'}" ref="scrollerBottomBox">
			<div ref="scrol">
				<swipeout class="vux-1px-tb">
					<swipeout-item transition-mode="follow" v-for="(item,index) in items" :key="index">
						<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonClick(item,index)" background-color="#D23934">删除</swipeout-button>
						</div>
						<div slot="content" :class="{'vux-1px-b': index !== 20, 'vux-1px-t': index === 1}">
							<group>
					    		<cell
							    	:title="item.system_name"
							    	is-link
							    	@click.native="sysSidiary(item)">
						    	</cell>
				  			</group>
						</div>
					</swipeout-item>
				</swipeout>
				<load-more :show-loading="showLoad" :tip="loadText"></load-more>
			</div>
			<v-hint :state="state"></v-hint>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import VHint from '../../common/Hint'
import { Group, Cell, Scroller, LoadMore, Search, InlineLoading, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default{
	components: {
        VHeader, Group, Cell, Search, Swipeout, SwipeoutItem, SwipeoutButton, Scroller, LoadMore, VHint
    },
	data(){
		return {
			currentFrim: JSON.parse(localStorage.getItem('currentFrim')),
			goverAllot:{},
			items: [],
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	icon: '&#xe6b9;',
            },
            // 搜索框
            sysInput:'',//搜索框的值
            //无限加载
            boxHeight: 200,//高度
            contentHei:0,
            scrolled: false,
            //请求参数
            currentPage: 1,//当前页数
            pageSize: 15,//一页几条信息
            //加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            timer:null,
            //提示框
            state:{
            	name: "",
            	isShow: false,
            }
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.goverAllot = JSON.parse(localStorage.getItem('GoverAllot'));
		console.log(self.goverAllot)
		console.log(self.currentFrim)
		self.headObj.title = self.goverAllot.name;
		self.askSystem();
		self.$nextTick(() => {
			self.boxHeight = document.body.clientHeight - 90;
      		self.$refs.scrollerBottomBox.addEventListener('scroll', ()=>{
      			let totalHei = self.$refs.scrol.offsetHeight - self.boxHeight;
      			let scroll_top = self.$refs.scrollerBottomBox.scrollTop;
      			if(totalHei == scroll_top || totalHei < scroll_top){
      				if(self.timer == null){
      					self.timer = setTimeout(() => {
		      				self.currentPage++;
							self.askSystem();
						},1500)
      				}
      			}
      		})
    	})
	},
	methods:{
		backWay(data){//返回页面
			let self = this;
			self.$router.back('/mangenallot')
			console.log(data)
		},
		finish(data){//进入详情
			let self = this;
			let item = {
				title: '注册系统',
				path: '/sysgover'
			}
			localStorage.setItem("addPage", JSON.stringify(item));
			self.$router.go('/addpage')
			console.log(data)
		},
		askSystem(){//请求系统
			let self = this;
			let data = {
	    		'compCode':self.currentFrim.comp_code,
	    		"sysName":self.sysInput,
	    		"pageSize":self.pageSize,
	    		"currentPage":self.currentPage
	    	};
	    	console.log(data)
	    	self.$axios({
	    		url: "/UAMS/system/do_system_query?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.success){
	    			let list = res.data.data.list;
	    			if(list.length == 0 || list.length < self.pageSize){
	    				if(self.currentPage == 1 && list.length == 0){
	    					self.loadText = "暂无数据";
	    				}else{
	    					self.loadText = "数据加载完毕";
	    				}
	    				self.showLoad = false;
	    			}
	    			list.forEach(function(item, index){
	    				self.items.push(item)
	    			})
	    			self.$nextTick(()=>{
	    				clearTimeout(self.timer)
	    			})
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		sysSidiary(item){//跳转详情页面
			let self = this;
			item.plateCode = "0";
			item.pathPage = "/sysgover";
			localStorage.setItem("DetailsInfoMation", JSON.stringify(item));
			self.$router.go('/lookdetail')
		},
		resultClick(item){//搜索点击
			let self = this;
			console.log(item)
		},
		getResult(val){//搜索的值变换时
			let self = this;
			self.showLoad = true;
			self.loadText = "正在加载";
			self.currentPage = 1;
			self.items = [];
			self.askSystem();
		},
	    onFocus () {
	    	let self = this;
    		// self.$refs.my_scroller.top = 90
	      	console.log('on focus')
	    },
	    onCancel () {
	    	let self = this;
	    	self.marginTop = 46;
	      	console.log('on cancel')
	    },
	    onScrollBottom () {
	    	console.log(88888)
	    },
	    handleEvents(type){
	    	console.log(888888888888)
	    },
	    onButtonClick(item, index){//删除
	    	let self = this;
	    	console.log(item)
	    	self.$axios({
	    		url: "/UAMS/system/do_system_del",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
	    			'compCode': item.comp_code,
	    			"sysCode": item.sys_code
	    		}
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if(response.data.success){
	    			self.state.name = "删除系统成功";
	    			self.state.isShow = true;
	    			self.items.splice(index,1);
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
	    },
	}
}
</script>
<style lang="less" scoped>
	.no_record{
	    text-align: center;
	    padding: 10px 0;
	    font-size: 1.1rem;
	}
	.list_menu{
		overflow: hidden;
	}
</style>