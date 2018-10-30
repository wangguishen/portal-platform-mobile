<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入用户名称"
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
				          	<swipeout-button @click.native="onButtonDelete(list,index)" type="warn">删除</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell-box :border-intent="false" is-link @click.native="details(list,index)">{{list.userName}}</cell-box>
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
                title: '用户级别配置',
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
            delId:'',//删除数据id
		}
	},
	mounted(){
		let self = this;
		self.askUser();
	},
	methods:{
		askUser(){//获取用户列表
			let self = this;
			let datas={
				'userName' : self.searchInput
			}
			console.log(datas)
			self.$axios({
				url:'/basic-platform/muser/sel?userName='+self.searchInput,
				method:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let userData=res.data.data;
				if (userData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.lists=[];
				userData.forEach(function(item,index){
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
		onButtonDelete(list,index){//删除按钮
			let self = this;
			console.log(list,index)
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确定删除吗?',
				onCancel(){
					self.$vux.toast.show({
						type:'text',
						position:'middle',
						text:'已取消删除'
					})
				},
				onConfirm(){
					self.delId = list.id;
					self.deleteSure();
				}
			})
		},
		deleteSure(){
			let self = this;
			let datas={
				'id' : self.delId
			}
			self.$axios({
				url:'/basic-platform/muser/del',
				method:'delete',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				self.$vux.toast.show({
					type:'text',
					position:'middle',
					text:'删除用户成功!'
				})
				self.askUser();
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		finish(data){
			let self = this;
			console.log(data)
			self.$router.go('/UserLevelConfigAdd');
		},
		details(list,index){//详情页
			let self = this;
			console.log(list,index);
			localStorage.setItem('userList',JSON.stringify(list));
			self.$router.go('/UserLevelConfigEdit')
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
					self.askUser();
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