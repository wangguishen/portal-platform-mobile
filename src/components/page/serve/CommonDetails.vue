<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div :class="{'tab':tab}">
	        <div style="margin-top: 47px;">
	        	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="服务名称" :value="servePort.serviceName"></cell>
		        	</div>
		      	</swipeout-item>
	        	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="接口名称" :value="port.interName"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="请求方式" :value="port.interMethod"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="请求链接" :value="port.url"></cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="入参示例">
		        			<div slot="value" value-align="right">
		        				<x-textarea :rows="1" :readonly="true" :autosize="true" v-model="port.reqData"></x-textarea>
		        			</div>
		        		</cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="出参示例" value-align="right">
		        			<div slot="value">
		        				<x-textarea :rows="1" :readonly="true" :autosize="true" v-model="port.repData"></x-textarea>
		        			</div>
		        		</cell>
		        	</div>
		      	</swipeout-item>
		      	<swipeout-item :threshold=".5" underlay-color="#ccc">
		        	<div slot="content" class="demo-content vux-1px-tb">
		        		<cell title="简介" :value="port.introduce"></cell>
		        	</div>
		      	</swipeout-item>
	        </div>
	        <div>
	        	<x-button plain type="primary" @click.native="editParameters">编辑参数</x-button>
	        </div>
	    </div>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Search, Group, Cell, XDialog, Confirm, XHeader, Swipeout, SwipeoutItem, SwipeoutButton, TransferDomDirective as TransferDom, Tab, TabItem, XButton,XTextarea} from 'vux'
	export default {
		directives: {
    		TransferDom
  		},
		components:{
			Group,
	        Cell,
	        XDialog,
	        VHeader,
	        Tab,
	        TabItem,
	        XButton,
	        Search,
	        Swipeout,
	        SwipeoutItem,
	        SwipeoutButton,
	        Confirm,
	        XTextarea
		},
		data () {
			return{
				port:{},
				servePort:{},
				showMenus: false,
	            results: [],
	            params: '',//搜索框内容
	            headObj:{
	                title:"",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                icon: '&#xe635;',
	            },
	            tab:false,
			}
		},
		mounted(){
			let self = this;
			let storage = JSON.parse(localStorage.getItem('serviceData'));//所有服务名及id
			let servePort = JSON.parse(localStorage.getItem('serveName'));
			console.log('servePort',servePort)
			let portList = JSON.parse(localStorage.getItem('portList'));
			// console.log('storage',storage)
			console.log('=',portList);
			self.servePort = servePort;
			self.port = portList;
			self.headObj.title = self.port.interName;
		},
		methods: {
	        resultClick (item) {
	            window.alert('you click the result item: ' + JSON.stringify(item))
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
	        finish(data){//参数管理页面
	        	let self = this;
	            console.log(data)
	            self.$router.go('/Parameters');
	        },
	        parameters(){//参数管理页面
	        	let self = this;
	        	// self.$router.go('/Parameters');
	        },
	        editParameters(){//编辑参数页面
	        	let self = this;
	        	self.$router.go('/EditParameters');
	        },
	        backWay(data){
	        	let self = this;
	        	self.$router.back('/PortConfig');
	            console.log(data)
	        },
	        onShow(){
	          	console.log('promt show')
	        },
	        onHide(){
	          	console.log('prompt hide')
	        },
	        onCancel(){
	          	console.log('prompt cancel')
	        }
	    }
	}
	
</script>

<style lang="less" scoped>
	.dialog-demo {
		.weui-dialog{
		    border-radius: 8px;
		    padding-bottom: 8px;
		}
		.dialog-title {
		    line-height: 30px;
		    color: #666;
		}
		.img-box {
		    height: 350px;
		    overflow: hidden;
		}
		.vux-close {
		    margin-top: 8px;
		    margin-bottom: 8px;
		}
		.paras .weui-btn + .weui-btn{
			margin-top: 4px;
		}
	}
</style>
<style>
	.tab{
		margin-top: 92px;
	}
</style>