<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div :class="{'tab':tab}">
		    <div style="margin-top: 47px;">
		    	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="参数名称" :value="paras.pName"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="参数类型" :value="paras.pType"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="介绍" :value="paras.pIntroduce"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="必填" :value="paras.required"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="示例" :value="paras.sample"></cell>
		        	</div>
		      	</swipeout-item>
		    </div>
		</div>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Group, Cell, Swipeout, SwipeoutItem, XButton} from 'vux'
	export default{
		components:{
			VHeader,
			Group,
			Cell,
			Swipeout,
			SwipeoutItem,
			XButton
		},
		data(){
			return{
				headObj:{
	                title:"参数管理详情",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                icon: '&#xe6ed;',
	            },
	            tab:false,
	            paras:{}
			}
		},
		mounted(){
			let self = this;
			let manageList = JSON.parse(localStorage.getItem('manageList'));
			console.log(manageList);
			self.paras = manageList;
			console.log('=',self.paras)

		},
		methods:{
			finish(data){//右侧
	        	let self = this;
	            console.log(data)
	            self.$router.go('/EditParasManage')
	        },
	        backWay(data){
	        	let self = this;
	        	self.$router.back('/Parameters');
	            console.log(data)
	        }
		}
	}
</script>

<style lang="less" scoped>
	.tab{
		margin-top: 92px;
	}
</style>