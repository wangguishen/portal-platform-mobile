<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div :class="{'tabSpace':tabSpace}">
	    	<div style="margin-top: 48px;">
	    		<popup-picker title="空间名称" :data="options" v-model="spaceValue" @on-change="spaceChange" placeholder="请选择空间名称"></popup-picker>
	    	</div>
	    	<div class="sysgover">
		    	<swipeout class="swipBox">
		    		<swipeout-item transition-mode="follow" :threshold=".5" underlay-color="#ccc" v-for="(list,index) in spaceLists" :key="index">
		    			<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonDelete(list,index)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
				        </div>
				        <div slot="content" class="demo-content vux-1px-tb">
				        	<group>
			        			<cell :title="list.url_name" is-link @click.native="editSpace(list,index)"></cell>
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
import {LoadMore, Toast,PopupPicker,Swipeout, SwipeoutItem,SwipeoutButton,Group,Cell,Confirm}from 'vux'
export default {
	components: {
		VHeader,LoadMore, Toast,PopupPicker,Swipeout, SwipeoutItem,SwipeoutButton,Group,Cell,Confirm
	},
	data() {
		return {
			headObj: {
                title: '空间资源配置',
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
           	options:[
           		[
           			{
				        name:'海',
				        value:'海'
				    },
				    {
				        name:'宝',
				        value:'宝'
				    },
				    {
				        name:'娃',
				        value:'娃'
				    }
           		]
           	],
           	spaceValue:['海'],//选中
           	spaceVal:'1',
           	spaceLists:[],
           	deleteId:'',
		}
	},
	mounted() {
		let self = this;
		let cunentVal = JSON.parse(localStorage.getItem('cunentVal'))
		if(cunentVal){
			self.spaceVal = cunentVal;
			self.spaceValue = []
			if(self.spaceVal == 1){
				self.spaceValue.push('海')
			}else if(self.spaceVal == 2){
				self.spaceValue.push('宝')
			}else if(self.spaceVal == 3){
				self.spaceValue.push('娃')
			}
		}
		self.queryData();
	},
	methods: {
		queryData(){
			let self = this;
			self.$axios({
				url:'/UAMS/url/query_all_url',
				method:'post',
				responseType:'json',
				data:{
					type: self.spaceVal
				}
			})
			.then(function(res){
				console.log(res)
				let resData = res.data.data;
				if (resData.length == 0) {
					self.loadText="暂无数据"
				}else{
					self.loadText="数据加载完毕"
				}
				self.showLoad=false;
				self.spaceLists = [];
				resData.forEach(function(item,index){
					item.key = item.id;
					item.value = item.url_name;
					self.spaceLists.push(item);
				})
			})
			.catch(function(res){
				console.log('error',res)
			})
		},
		backWay(){//返回上个页面
			let self = this;
			localStorage.setItem("cunentVal", JSON.stringify(''))
			self.$router.back('/Jurisdiction');
		},
		spaceChange(val){
			let self = this;
			self.spaceVal = val[0] == '海'? "1" : val[0] == '宝'? "2" : val[0] == '娃' ? "3" : "1"
			self.loadText="正在加载";
			self.spaceLists = [];
			self.showLoad = true;
			setTimeout(()=>{
				self.queryData();
			},1000)
		},
		onButtonDelete(list,index){//删除
			let self = this;
			console.log(list)
			self.$vux.confirm.show({
				title : '操作提示',
				content:'确定要删除吗?',
				onCancel(){
					self.$vux.toast.text('已取消删除!','middle')
				},
				onConfirm(){
					self.deleteId = list.id;
					self.deleteSure();
				}
			})
		},
		deleteSure(){//确认删除
			let self = this;
			self.$axios({
				url:'/UAMS/url/deleteUrl',
				method:'post',
				responseType:'json',
				data:{
					id: self.deleteId
				}
			})
			.then(function(res){
				console.log('deleteSure success',res);
				if (res.status == 200) {
					self.$vux.toast.text('删除成功!','middle')
					self.queryData();
				}else {
					self.$vux.toast.text('删除失败!','middle')
				}
				
			})
			.catch(function(res){
				console.log('deleteSure error',res)
			})
		},
		editSpace(list,index){//编辑
			let self = this;
			console.log(list);
			localStorage.setItem("cunentVal", JSON.stringify(list.auditFlag))
			localStorage.setItem('jsonSpace',JSON.stringify(list));
			self.$router.go('/SpaceSettingEdit')
		},
		finish(data){
			let self = this;
			console.log(data);
			self.$router.go('/SpaceSettingAdd')
		},
		resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
		getResult(val){//搜索框
            let self = this;
            self.searchInput = val;
            self.loadText="正在加载";
            self.showLoad=true;
            if (self.timer == null) {
            	self.timer=setTimeout(()=>{
            		clearTimeout(self.timer);
            		self.timer=null;
            		// self.queryCompany();
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
	}
}
</script>

<style lang="less" scoped>
	.tabSpace {
		margin-top: 92px;
	}
</style>