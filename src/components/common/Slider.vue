<template>
	<div class="slider_box">
		<div class="slider_head">
			<img src="../../assets/LOGO.png" alt="">
			<span>象翌公共服务平台</span>
		</div>
		<div class="content" v-for="item in items">
	      	<cell
	      		class="content_tit"
	      		:title="item.title"
	      		:is-link="isLink"
	      		@click.native="unfold(item)">
      		</cell>
	    </div>
	    <div class="quit">
	    	<div class="quit_box quit_left" v-show="setShow" @click="jumpSet()">
	    		<span class="iconfont quit_icon">&#xe63a;</span>
	    		<span>设置</span>
	    	</div>
	    	<div class="quit_box quit_right" @click="quitRegister()">
	    		<span class="iconfont quit_icon" style="color:#f8181e;">&#xe603;</span>
	    		<span>退出</span>
	    	</div>
	    	<!-- <x-button type="primary" @click.native="quitRegister()">{{ jsonData.account }}</x-button> -->
	    </div>
	</div>
</template>
<script>
import { Cell, Group, CellBox, XButton } from 'vux'
export default {
	components: {
    	Cell, Group, CellBox, XButton
  	},
    data(){
        return {
        	jsonData: {},
        	uams:'',//判断是什么用户
        	// userTourist: 'visitors',//游客
        	// userPlat: 'plat_admin',//平台管理员
        	// userEnterprise: 'enterprise_admin',//企业管理员
        	isLink: true,//是否显示箭头图标
        	items:[
        		{
        			title: '首页',
        			route: '/home'
        		},{
        			title:'开放服务',
        			route:'/openservice'
        		},{
        			title: '权限管理',
        			route: '/jurisdiction'
        		},{
        			title:'配置管理',
        			route:'/dataconfig'
        		},{
        			title:'运维服务',
        			route:'/operationgover'
        		}
        	],
        	setShow:false,
        }
    },
    mounted(){
    	let self = this;
    	self.begin()
    },
    watch: {
      	'$route': {
        	handler: function(val, oldval) {
        		let self = this;
        		self.begin()
        	},
        	deep:true
        }
    },
    methods: {
    	begin(){
    		let self = this;
    		self.jsonData = JSON.parse(localStorage.getItem('jsonData'));
	    	self.uams = JSON.parse(localStorage.getItem('uams'));
	    	if(self.uams === self.VISITORS){
	    		self.setShow = false;
	    		self.items = [
	        		{
	        			title: '首页',
	        			route: '/home'
	        		},{
	        			title:'开放服务',
	        			route:'/openservice'
	        		}
	        	]
	    	}else if(self.uams === self.PLAT_ADMIN){
	    		self.setShow = true;
	    		self.items = [
	        		{
	        			title: '首页',
	        			route: '/home'
	        		},{
	        			title:'开放服务',
	        			route:'/openservice'
	        		},{
	        			title: '权限管理',
	        			route: '/jurisdiction'
	        		},{
	        			title:'配置管理',
	        			route:'/dataconfig'
	        		},{
	        			title:'运维服务',
	        			route:'/operationgover'
	        		}
	        	]
	    	}else if(self.uams === self.ENTERPRISE_ADMIN){
	    		self.setShow = true;
	    		self.items = [
	        		{
	        			title: '首页',
	        			route: '/home'
	        		},{
	        			title:'开放服务',
	        			route:'/openservice'
	        		},{
	        			title: '权限管理',
	        			route: '/jurisdiction'
	        		}
	        	]
	    	}
    	},
    	unfold (item){//点击跳转
    		let self = this;
    		self.$router.go(item.route);
    		self.$store.commit('SET_PLACEMENT_VALUE',false);
    	},
    	quitRegister(){
    		console.log('退出')
    		let self = this;
    		localStorage.clear()
    		self.$router.back('/login');
    		self.$store.commit('SET_PLACEMENT_VALUE',false);
    	},
    	jumpSet(){
    		console.log('跳转')
    		let self = this;
    		self.$router.go('/userhome');
    		self.$store.commit('SET_PLACEMENT_VALUE',false);
    	},
    },
}
</script>
<style lang="less" scoped>
.slider_box{
	color: #fff;
	.slider_head{
		width: 100%;
		margin-bottom: 20px;
		img{
			display: block;
			margin: 0 auto;
		}
		span{
			width:100%;
			display: inline-block;
			text-align: center;
		}
	}
	.content{
		color: #fff;
		// background: #fff;
		.content_tit{
			padding:0 8px;
		}
		.content_er_tit{
			height:1.1rem;
			padding-right:8px;
		}
		.content_san_tit{
			padding-left: 25px;
			&:after{
				right:10px;
			}
		}
		.sub-item:after{
			right:10px;
		}
	}
	.quit{
		position: absolute;
		bottom: .5rem;
		left: 0;
		width:90%;
		margin:0 5%;
		.quit_box{
			float: left;
			width:50%;
			.quit_icon{
				font-size: 1.3rem;
			}
		}
		.quit_right{
			float: right;
			text-align: right;
			color:#f8181e;
		}
	}
}
.vux-tap-active:active{
	background-color: #35495e;
}
</style>