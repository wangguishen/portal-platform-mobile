<template>
	<div id="page_box" style="overflow:-Scroll;overflow-y:hidden">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="searchInput"
	            placeholder="请输入项目名称"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 48px;">
	        </search>
		    <div :class="{'tab':tab}">
		    	<swipeout class="swipBox">
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(item,index) in items" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonAssociate(item,index)" background-color="#38ce58" class="iconfont" :width="60">&#xe61e;</swipeout-button>
				          	<swipeout-button @click.native="onButtonDelete(item,index)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
			        		<cell :title="item.systemName" is-link @click.native="onButtonEdit(item,index)"></cell>
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
import {Search,XTable, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore,Confirm, Toast, Cell,XButton} from 'vux'
export default{
	components: {
        VHeader,
        Search,
        XTable,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        LoadMore,
        Confirm,
        Toast,
        Cell,
        XButton
    },
	data(){
		return{
			headObj: {
                title: '监控项目配置',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	icon:'&#xe6b9;'
            },
            tab:false,
            results:[],
            items:[],
            searchInput:'',//搜索框内容
            loadText:'',//加载提示字体
            showLoad:true,//指示字体是否显示
            timer:null,//定时器
            deleteId:'',//删除数据id
		}
	},
	mounted(){
		let self = this;
		self.querySysData();
	},
	methods:{
		querySysData(){//请求系统列表数据
			let self = this;
			let url="/basic-platform/system/sel?systemName="+self.searchInput
			let datas={
				'systemName' : self.searchInput
			}
			let method = "get"
			console.log(datas);
			self.$axios({
				url:url,
				method:method,
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res)
				let sysData = res.data.data;
				if (sysData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad = false;
				self.items=[];
				sysData.forEach(function(list,index){
					self.items.push(list);
				})
			})
			.catch(function(res){
				console.log('error',res)
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
			self.$router.go('/MonSysConfigAdd')
		},
		resultClick(){},
		getResult(val){//搜索框
			let self = this;
			self.searchInput = val;
			self.items=[];
			self.loadText="正在加载";
			self.showLoad=true;
			if (self.timer == null) {
				self.timer = setTimeout(()=>{
					clearTimeout(self.timer);
					self.timer=null;
					self.querySysData();
				},1000)
			}
		},
		onButtonEdit(item,index){//编辑按钮
			let self = this;
			console.log(item,index)
			localStorage.setItem('editList',JSON.stringify(item));
			self.$router.go('/MonSysConfigEdit')
		},
		onButtonDelete(item,index){//删除按钮
			let self = this;
			console.log(item,index)
			self.$vux.confirm.show({
				title:'操作提示',
				content:'确认删除吗?',
				onConfirm(){
					self.deleteId=item.id;
					self.deleteSure();
				},
				onCancel(){
					self.$vux.toast.text('已取消删除!','middle')
				}
			})
		},
		deleteSure(){//确认删除
			let self = this;
			let datas={
				'id' : self.deleteId
			}
			console.log(datas)
			self.$axios({
				url:'/basic-platform/system/del',
				method:'delete',
				responseType:'json',
				data:datas
			})
			.then(function(res){
				console.log(res);
				if (res.status == 200) {
					self.$vux.toast.text('删除系统成功!','middle')
					self.querySysData();
				}else{
					self.$vux.toast.text('删除系统失败!','middle')
				}
			})
			.catch(function(res){
				console.log('error',res);
			})
		},
		onButtonAssociate(item,index){//关联用户
			let self = this;
			console.log(item)
			localStorage.setItem('sysName',JSON.stringify(item));
			self.$router.go('/AssociatedUsers');
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
	.vux-swipeout .vux-swipeout-item .weui-cell {
		padding: 0px 10px;
	}
</style>
<style>
	.tab{
		margin-top: 92px;
	}
	/* .swipBox .vux-swipeout-item{
		height: 58px;
	} */
</style>