<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入链接地址"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 48px;">
	        </search>
		    <div :class="{'tab':tab}">
		    	<swipeout>
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(list,index) in lists" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonDelete(list, index)" type="warn">删除</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell-box :border-intent="false" is-link @click.native="details(list, index)">{{list.linkName}}</cell-box>
			        	</div>
		    		</swipeout-item>
		    	</swipeout>
		    </div>
	    </div>
	    <load-more :show-loading="showLoad" :tip="loadText"></load-more>
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
                title: '监控链接配置',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            tab:false,
            searchInput:'',//搜索框内容
            loadText: "",//加载指示字体
           	showLoad: true,//加载指示符是否显示
           	timer:null,//定时器
            results:[],
            lists:[],
			sysList:[],//所有的系统
			delId:'',//当前删除数据id
		}
	},
	mounted(){
		let self = this;
		self.askUrlData();
	},
	methods:{
		askUrlData(){//获取链接数据
			let self = this;
			let url="/basic-platform/link/sel?linkName="+self.searchInput;
			let data = {
				'linkName' : self.searchInput
			}
			console.log(data)
			self.$axios({
				url:url,
				method:'get',
				responseType:'json',
				data:data
			})
			.then(function(res){
				console.log(res)
				let linkData = res.data.data;
				if (linkData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.lists=[];
				linkData.forEach(function(item,index){
					self.lists.push(item)
				})
			})
			.catch(function(res){
				console.log('error',res)

			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/DataConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			self.$router.go('/MonUrlConfigAdd');
		},
		onButtonDelete(list,index){//删除按钮
			let self = this;
			console.log(list,index)
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确定删除吗?',
				onCancel(){
					self.$vux.toast.text('已取消删除!','middle');
				},
				onConfirm(){
					self.delId = list.id;
					self.deleteSure();
				}
			})
		},
		deleteSure(){//确认删除
			let self = this;
			let datas={
				'id' : self.delId
			}
			console.log(datas)
			self.$axios({
				url:'/basic-platform/link/del',
				method:'delete',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'删除链接成功!'
				})
				self.askUrlData();
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		details(list,index){//详情页
			let self = this;
			console.log(list,index);
			localStorage.setItem('linkList',JSON.stringify(list));
			self.$router.go('/MonUrlConfigEdit');
		},
		getResult(val){//搜索框
			let self = this;
			self.searchInput = val;
			self.lists=[];
			self.loadText="正在加载";
			self.showLoad=true;
			if (self.timer == null) {
				self.timer = setTimeout(()=>{
					clearTimeout(self.timer);
					self.timer=null;
					self.askUrlData();
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
        resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
        onFocus () {//搜索框获取焦点
        	let self = this;
            console.log('on focus')	
            self.tab = true;
        },
        onCancel () {//搜索框取消
        	let self = this;
            console.log('on cancel')
            self.tab = false;
        }
	}
}
</script>
<style lang="less" scoped>
	
</style>
<style>
	.tab{
		margin-top: 92px;
	}
</style>