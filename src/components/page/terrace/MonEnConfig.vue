<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入企业名称"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 46px;">
	        </search>
		    <div :class="{'tabMon':tabMon}">
		    	<swipeout>
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(list,index) in lists" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonDelete(list, index)" type="warn">删除</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell-box :border-intent="false" is-link @click.native="details(list, index)">{{list.compName}}</cell-box>
			        	</div>
		    		</swipeout-item>
		    	</swipeout>
		    </div>
	    </div>
	    <load-more :show-loading="showLoad" :tip="loadText"></load-more>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Search, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore, CellBox,Confirm, Toast}from 'vux'
export default{
	components: {
        VHeader,
        Search,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        LoadMore,
        CellBox,
        Confirm,
        Toast
    },
	data(){
		return{
			headObj: {
                title: '监控企业配置',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            tabMon:false,
            results:[],
            lists:[],
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
            timer:null,//定时器
           	showLoad: true,//加载指示符是否显示
           	delId:'',
           	listIndex:0
		}
	},
	mounted(){
		let self = this;
		self.queryCompany();
	},
	methods:{
		queryCompany(){
			let self = this;
			let datas={
				'compName' :self.searchInput
			}
			self.$axios({
				url: '/basic-platform/enterprise/sel?compName=' + self.searchInput,
				method: 'get',
				responseType: 'json',
				data:datas
			})
			.then(function(res){
				console.log(res);
				let compData=res.data.data;
				console.log("-------", compData)
				if (compData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.lists=[];
				compData.forEach(function(item,index){
					self.lists.push(item);
				})
				console.log(self.lists)
			})
			.catch(function(res){
				console.log('error');
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/DataConfig');
		},
		finish(data){
			let self = this;
			console.log(data)
			self.$router.go('/MonEnConfigAdd')
		},
		onButtonDelete(list,index){//删除
			let self = this;
			console.log(list,index);
			self.listIndex = index;
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确认删除吗?',
				onCancel(){
					self.$vux.toast.text('已取消删除!','middle')
				},
				onConfirm(){
					self.delId = list.id;
					self.deleteSure();
				}
			})
		},
		deleteSure(){//删除确认
			let self = this;
			let datas={
				'id' : self.delId
			}
			console.log(datas)
			self.$axios({
	          	url: '/basic-platform/enterprise/del',
	          	method: 'DELETE',
	          	responseType: 'json',
	          	data: datas
	        })
	        .then(function(res){
	        	console.log(res)
	        	self.lists.splice(self.listIndex,1)
	        	self.$vux.toast.show({
	        		type:'text',
	        		position:'middle',
	        		text:'删除企业成功!'
	        	})
	        	self.queryCompany()
	        })
	        .catch(function(res){
	        	console.log('error',res)
	        })
		},
		details(list,index){//详情
			let self = this;
			console.log(list)
			localStorage.setItem('compList',JSON.stringify(list));
			self.$router.go('/MonEnConfigEdit')
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
        getResult(val){//搜索框
            let self = this;
            self.searchInput = val;
            self.loadText="正在加载";
            self.lists=[];
            self.showLoad=true;
            if (self.timer == null) {
            	self.timer=setTimeout(()=>{
            		clearTimeout(self.timer);
            		self.timer=null;
            		self.queryCompany();
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
            self.tabMon = true;
        },
        onCancel () {//搜索框取消
        	let self = this;
            console.log('on cancel')
            self.tabMon = false;
        },
	},
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.tabMon{
		margin-top: 92px;
	}
	.sysgover .demo-content{
		padding: 0 10px;
	}
</style>