<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<search
            @result-click="resultClick"
            :results="results"
            v-model="searchInput"
            placeholder="请输入实验室名称"
            @on-change="getResult"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="search"
            style="margin-top: 46px;">
        </search>
        <div :class="{'tab':tab}">
        	<div class="sysgover">
		    	<swipeout class="swipBox">
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(list,index) in lists" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonDelete(list,index)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
				        	<group>
			        			<cell :title="list.deptName" is-link @click.native="editMsg(list,index)"></cell>
			        		</group>
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
import {Search, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore,Confirm, Toast, Cell,XButton, Group} from 'vux'
export default{
	components: {
        VHeader, Search, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore,Confirm, Toast, Cell,XButton, Group
    },
	data(){
		return{
			headObj: {
                title: '监控实验室配置',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            results:[],
            lists:[],
            tab:false,
            searchInput:'',//搜索框内容
            loadText:'',//加载提示字体
            showLoad:true,//指示字体是否显示
            timer:null,//定时器
            deleteId:'',//删除数据id
		}
	},
	mounted(){
		let self = this;
		self.queryLab();
	},
	methods:{
		queryLab(){//查询请求
			let self = this;
			let datas = {
				'deptName' : self.searchInput
			}
			self.$axios({
				url:'basic-platform/dept/sel?deptName='+self.searchInput,
				mthod:'get',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let labData = res.data.data;
				if (labData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.lists=[];
				labData.forEach(function(item,index){
					self.lists.push(item);
				})
			})
			.catch(function(res){
				console.log(res)
			})
		},
		backWay(data){
			let self = this;
			console.log(data)
			self.$router.back('DataConfig')
		},
		finish(data){
			let self = this;
			console.log(data)
			self.$router.go('/MonLabConfigAdd')
		},
		getResult(val){
			let self = this;
			console.log(val)
			self.searchInput=val;
			self.loadText="正在加载";
			self.lists=[];
			self.showLoad=true;
			if (self.timer == null) {
				self.timer=setTimeout(()=>{
					clearTimeout(self.timer);
					self.timer=null;
					self.queryLab();
				},1000)
			}
		},
		editMsg(list,index){//进入编辑页面
			let self = this;
			console.log(list)
			localStorage.setItem('labList',JSON.stringify(list));
			self.$router.go('/MonLabConfigEdit');
		},
		onButtonDelete(list,index){//删除操作
			let self = this;
			console.log(list)
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确定删除吗?',
				onCancel(){
					self.$vux.toast.text('已取消删除!','middle');
				},
				onConfirm(){
					self.deleteId = list.id
					self.deleteSure();
				}
			})
		},
		deleteSure(){//确认删除
			let self = this;
			let datas = {
				'id' : self.deleteId
			}
			console.log(datas);
			self.$axios({
				url:'/basic-platform/dept/del',
				method:'delete',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res);
				if (res.status == 200) {
					self.$vux.toast.text('删除成功!','middle');
					self.queryLab();
				}else{
					self.$vux.toast.text('删除失败!','middle');
				}
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		resultClick(){},
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
<style>
</style>