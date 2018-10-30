<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入参数名称"
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
			        		<cell-box :border-intent="false" is-link @click.native="editDetails(list,index)">{{list.paramName}}</cell-box>
			        	</div>
		    		</swipeout-item>
		    	</swipeout>
		    </div>
		    <load-more :show-loading="showLoad" :tip="loadText"></load-more>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import {Search,Swipeout, SwipeoutItem, SwipeoutButton, LoadMore, CellBox,Confirm, Toast} from 'vux'
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
                title: '参数',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            results:[],
            lists:[],
            searchInput:'',//搜索框内容
            tab:false,
            loadText:'',//加载提示字体
            showLoad:true,//加载提示符是否显示
            paraList:{},
            delId:'',
		}
	},
	mounted(){
		let self = this;
		let linkList = JSON.parse(localStorage.getItem('linkList'))
		self.paraList = linkList;
		console.log(linkList)
		self.queryParaData();
	},
	methods:{
		queryParaData(){//请求参数
			let self = this;
			let datas={
				'linkId' : self.paraList.id,
				'paramName' : self.searchInput
			}
			console.log(datas);
			self.$axios({
				url:'/basic-platform/param/sel?linkId='+self.paraList.id+'&paramName='+self.searchInput,
				method:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let paraData = res.data.data;
				if (paraData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.lists=[];
				paraData.forEach(function(item,index){
					self.lists.push(item);
				})
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('/MonUrlConfigEdit')
		},
		finish(data){
			let self = this;
			console.log('注册参数')
			self.$router.go('/ParameterDetailsAdd')
		},
		onButtonDelete(list,index){//删除
			let self = this;
			console.log(list);
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
		deleteSure(){
			let self = this;
			let datas = {
				'id' : self.delId
			}
			console.log(datas);
			self.$axios({
				url:'/basic-platform/param/del',
				method:'delete',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res);
				if (res.status == 200) {
					self.$vux.toast.text('删除参数成功!','middle');
					self.queryParaData();
				}else{
					self.$vux.toast.text('删除参数失败!','middle');
				}
			})
			.catch(function(res){
				console.log(res)
			})
		},
		editDetails(list,index){//详情
			let self = this;
			console.log(list);
			self.$router.go('/ParameterDetailsEdit');
			localStorage.setItem('parasList',JSON.stringify(list));
		},
		getResult(val){//搜索框
			let self = this;
			self.searchInput = val;
			self.queryParaData();
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
	.tab{
		margin-top: 92px;
	}
</style>