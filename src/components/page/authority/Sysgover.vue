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
					<template v-for="(item,index) in items">
						<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe">
							<div slot="right-menu">
					          	<swipeout-button @click.native="onButtonClick(item,index)" background-color="#D23934">删除</swipeout-button>
							</div>
							<div slot="content" :class="{'vux-1px-b': index !== 20, 'vux-1px-t': index === 1}">
								<group>
						    		<cell
								    	:title="item.name"
								    	is-link
								    	@click.native="sysSidiary(item)">
							    	</cell>
					  			</group>
							</div>
						</swipeout-item>
					</template>
				</swipeout>
				<load-more :show-loading="showLoad" :tip="loadText"></load-more>
			</div>
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
            pageSize: 10,//一页几条信息
            //加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            timer:null,
            timer1:null,
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.goverAllot = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.goverAllot.name;
		self.askSystem();
		self.$nextTick(() => {
			self.boxHeight = document.body.clientHeight - 90;
      		self.$refs.scrollerBottomBox.addEventListener('scroll', ()=>{
      			let totalHei = self.$refs.scrol.offsetHeight - document.body.clientHeight;
				let scroll_top = self.$refs.scrollerBottomBox.scrollTop-90;
      			if(totalHei == scroll_top || totalHei < scroll_top){
      				if(self.timer == null){
      					clearTimeout(self.timer1)
      					self.timer1 = null;
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
			clearTimeout(self.timer)
			clearTimeout(self.timer1)
			self.timer = null;
			self.timer1 = null;
			self.$router.back('/mangenallot')
			console.log(data)
		},
		finish(data){//进入详情
			let self = this;
			let item = {};
			if(self.goverAllot.type == 'xt'){
				item = {
					title: '注册系统',
					path: '/sysgover',
					type: 'xt'
				}
			}else if(self.goverAllot.type == 'cz'){
				item = {
					title: '新增功能',
					path: '/sysgover',
					type: 'cz'
				}
			}
			clearTimeout(self.timer)
			clearTimeout(self.timer1)
			self.timer = null;
			self.timer1 = null;
			localStorage.setItem("addPage", JSON.stringify(item));
			self.$router.go('/addpage')
			console.log(data)
		},
		askSystem(){//请求系统
			let self = this;
			let url = "";
			let data = {};
			if(self.goverAllot.type == 'xt'){
				url = "/UAMS/system/do_system_query?pageSize="+self.pageSize+"&currentPage="+self.currentPage;
				data = {
		    		'compCode':self.currentFrim.comp_code,
		    		"sysName":self.sysInput,
		    		"pageSize":self.pageSize,
		    		"currentPage":self.currentPage
		    	};
			}else if(self.goverAllot.type == 'cz'){
				url = "/UAMS/action/ajax/do_query_action?pageSize="+self.pageSize+"&currentPage="+self.currentPage;
				data = {
					'compCode':self.currentFrim.comp_code,
		    		"actionName":self.sysInput,
		    		"pageSize":self.pageSize,
		    		"currentPage":self.currentPage
				}
			}
	    	console.log(data)
	    	self.$axios({
	    		url: url,
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
	    				if(self.goverAllot.type == 'xt'){
	    					item.name = item.system_name
	    				}else if(self.goverAllot.type == 'cz'){
	    					item.name = item.action_name
	    				}
	    				self.items.push(item)
	    			})
	    			self.$nextTick(()=>{
	    				clearTimeout(self.timer)
	    				self.timer = null;
	    				if(list.length == self.pageSize){
	    					if(self.$refs.scrol.offsetHeight - document.body.clientHeight<0){
			  					self.timer1 = setTimeout(() => {
				      				self.currentPage++;
									self.askSystem();
								},1500)
			  				}
	    				}
	    			})
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		sysSidiary(item){//跳转详情页面
			let self = this;
			if(self.goverAllot.type == 'xt'){
				item.plateCode = "0";
			}else if(self.goverAllot.type == 'cz'){
				item.plateCode = "1";
			}
			item.pathPage = "/sysgover";
			clearTimeout(self.timer)
			clearTimeout(self.timer1)
			self.timer = null;
			self.timer1 = null;
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
	      	console.log('on cancel')
	    },
	    onButtonClick(item, index){//删除
	    	let self = this;
	    	console.log(item)
	    	let url = "";
	    	let data = {};
	    	if(self.goverAllot.type == 'xt'){
	    		url = "/UAMS/system/do_system_del";
				data = {
	    			'compCode': item.comp_code,
	    			"sysCode": item.sys_code
	    		}
			}else if(self.goverAllot.type == 'cz'){
				url = "/UAMS/action/ajax/do_del_action";
				data = {
	    			'compCode': item.comp_code,
	    			"actionId": item.id
	    		}
			}
			self.$vux.confirm.show({
				title: '删除系统',
				content: '您确定要删除此系统吗？',
				onCancel () {
					self.$refs.swipe[index].close();
				},
				onConfirm () {
					self.deleteStrip(url, data, index)	
				}
			})
	    },
	    deleteStrip(url, data, index){//删除请求
	    	let self = this;
	    	self.$axios({
	    		url: url,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(self.goverAllot)
	    		if(response.data.success){
	    			if(self.goverAllot.type == 'xt'){
	    				self.$vux.toast.text('删除系统成功', 'middle')
	    			}else if(self.goverAllot.type == 'cz'){
	    				self.$vux.toast.text('删除功能成功', 'middle')
	    			}
	    			self.$refs.swipe[index].close();
	    			self.items.splice(index,1);
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
	    }
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