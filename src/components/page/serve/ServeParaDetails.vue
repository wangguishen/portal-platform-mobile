<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div :class="{'tab':tab}">
		    <div style="margin-top: 47px;">
		    	<group>
	        		<cell title="参数名称" :value="paras.pName"></cell>
	        		<cell title="参数类型" :value="paras.pType"></cell>
	        		<cell title="介绍" :value="paras.pIntroduce"></cell>
	        		<cell title="必填" :value="paras.required"></cell>
	        		<cell title="示例" :value="paras.sample"></cell>
		    	</group>
		    </div>
		</div>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Group, Cell, Swipeout, SwipeoutItem} from 'vux'
	export default{
		components:{
			VHeader,
			Group,
			Cell,
			Swipeout,
			SwipeoutItem
		},
		data(){
			return{
				headObj:{
	                title:"参数管理详情",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                // isMore:true,
	                icon: '&#xe6b9;',
	            },
	            tab:false,
	            paras:{}
			}
		},
		mounted(){
			let self = this;
			let parasList = localStorage.getItem('parasList');
			console.log(parasList);
			self.paras = JSON.parse(parasList);
			console.log('=',self.paras)
		},
		methods:{
			finish(data){//右侧
	        	let self = this;
	            console.log(data)
	        },
	        backWay(data){
	        	let self = this;
	        	self.$router.back('/ServeDetails');
	            console.log(data)
	        }
		}
	}
</script>

<style lang="less" scoped>
	#page_box .weui-cell {
		padding: 0 15px;
	}
</style>