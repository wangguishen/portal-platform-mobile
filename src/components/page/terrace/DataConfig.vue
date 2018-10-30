<template>
	<div id="page_box">
	    <v-header :headObj="headObj" :rightObj="rightObj"></v-header>
	    <div class="container_top"></div>
        <div v-for="item in routes" class="sysgover">
        	<group :class="{'openservice':openservice}">
        	    <template v-if="item.subs">
        	    	<cell :title="item.name" 
        	    	    :border-intent="false"
        	    	    :arrow-direction="item.showContent ? 'down' : 'right'"
        	    	    @click.native="item.showContent = !item.showContent"
        	    	    is-link>
        	    	</cell>
    	    		<template v-for="s in item.subs" v-if="item.showContent">
    	    			<cell-box :border-intent="false" class="sub-item" is-link @click.native="jumpMangen(s)">{{s.name}}
    	    			</cell-box>
    	    		</template>
        	    </template>
        	    <template v-else>
        	        <cell :title="item.name" @click.native="jumpMangen(item)" is-link></cell>
        	    </template>
            </group>
        </div>
    </div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Group, Cell, CellBox} from 'vux'
	export default {
		components: {
			VHeader,
			Group,
			Cell,
			CellBox
		},
		data () {
			return {
				routes: [
				    {
				    	route: '/flatcompany',
				    	name: '平台企业管理'
				    }, {
				    	route: '/ServiceControl',
				    	name: '配置服务器监控'
				    }, {
				    	route: '',
				    	name: '开放服务配置',
				    	showContent: false,
				    	subs: [
				    	    {
				    	  		route: '/Serviceconfig',
				    	  		name: '开放服务配置',
				    	  	}, {
				    	  		route: '/Portconfig',
				    	  		name: '接口配置',
				    	  	}, {
				    	  		route: '/TopicPushConfig',
				    	  		name: '消息推送配置',
				    	  	}
				    	]
				    }, {
				    	route: '',
				    	name: 'url链接配置',
				    	showContent: false,
				    	subs: [
				    	    {
				    	    	route: '/MonEnConfig',
				    	    	name: '监控企业配置'
				    	    }, {
				    	    	route:'MonLabConfig',
				    	    	name:'监控实验室配置'
				    	    }, {
				    	    	route: '/MonSysConfig',
				    	    	name: '监控项目配置'
				    	    }, {
				    	    	route: '/MonUrlConfig',
				    	    	name: '监控链接配置'
				    	    }, {
				    	    	route: '/UserLevelConfig',
				    	    	name: '用户级别配置'
				    	    }
				    	]
				    }
				],
				headObj:{
	                title:"配置管理",
	                isBack:false,
	            },
	            rightObj:{
	                isMore: false,
	            },
	            openservice:false,
			}
		},
		mounted () {

		},
		methods: {
	         goes(){
	            let self = this;
	        },
	        finish(data){
	            console.log(data)
	        },
	        backWay(data){
	            let self = this;
	            self.$router.back('/home');
	            console.log(data)
	        },
	        jumpMangen(rou){
			    let self = this;
			    console.log(rou)
                localStorage.setItem("GoverAllot", JSON.stringify(rou));
                self.$router.go(rou.route)
		    }
		}
	}
</script>

<style lang="less" scoped>
	.sub-item {
        color: #888;
    }
</style>

<style>
	.openservice{
        margin-top: 92px;
    }
</style>