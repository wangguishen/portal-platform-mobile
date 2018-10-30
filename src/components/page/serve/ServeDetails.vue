<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div :class="{'tab':tab}">
	        <div style="margin-top: 47px;">
        		<cell title="接口名称" :value="port.interName"></cell>
        		<cell title="请求方式" :value="port.interMethod"></cell>
        		<cell title="请求链接" :value="port.url"></cell>
        		<cell title="简介" :value="port.introduce"></cell>
        		<cell title="关联主题" :value="port.topic"></cell>
        		<cell title="入参示例">
        			<div slot="value" value-align="right">
        				<x-textarea :rows="1" :readonly="true" :autosize="true" v-model="port.reqData"></x-textarea>
        			</div>
        		</cell>
        		<cell title="出参示例" value-align="right" style="border-bottom: 1px solid #d9d9d9;">
        			<div slot="value">
        				<x-textarea :rows="1" :readonly="true" :autosize="true" v-model="port.repData"></x-textarea>
        			</div>
        		</cell>
	        </div>
	    </div>
	    <div v-show="qrCodeShow">
        	<x-button plain type="primary" @click.native="createQRcode">生成二维码</x-button>
        </div>
        <!-- <load-more :show-loading="showLoad" :tip="loadText"></load-more> -->
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Search, Group, Cell, CellBox, Swipeout, SwipeoutItem, XTextarea, XButton, XTable, LoadMore} from 'vux'
	export default{
		components:{
			VHeader,
			Search,
			Group,
			Cell,
			Swipeout,
			SwipeoutItem,
			XTextarea,
			XButton,
			XTable,
			CellBox,
			LoadMore
		},
		data(){
			return{
				port:{},
				headObj:{
	                title:"",
	                isBack:true
            	},
	            rightObj:{
	                // title:'完成',
	                isMore:true,
	                // icon: '&#xe6af;',
	            },
	            loadText: "",//加载指示字体
            	showLoad: true,//加载指示符是否显示
	            tab:false,
	            qrCodeShow:false,//二维码按钮显示与隐藏
	            parasValue:'',
	            lists:[],
	            serveList:{},
	            pathWay:{}
			}
		},
		mounted(){
			let self = this;
			let serveList = JSON.parse(localStorage.getItem('serveList'));
			self.pathWay = JSON.parse(localStorage.getItem('jumpRoutePath'));
			console.log(serveList);
			self.port = serveList;
			self.headObj.title = self.port.interName;
			if (self.port.url == '/vr-qrcode/qr/generate') {//二维码按钮的显示与隐藏
				self.qrCodeShow=true;
			}else{
				self.qrCodeShow=false;
			}
			self.askParameters();
		},
		methods:{
			askParameters(){//请求参数
				let self = this;
				let datas={
	      			'pName' : self.parasValue,
		    		'interId' : self.port.id
	      		}
	      		console.log(datas);
	      		self.$axios({
	      			url:'/basic-platform/parm/sel?pName='+self.parasValue+'&interId='+self.port.id,
	      			method: 'get',
		    		responseType: 'json',
		    		data: datas
	      		})
	      		.then(function(response){
	      			console.log('=',response);
	      			let parasList = response.data.data;
	      			// if (parasList.length == 0) {
	      			// 	self.loadText = "暂无数据"
	      			// }else{
	      			// 	self.loadText = "数据加载完毕"
	      			// }
	      			self.showLoad = false;
	      			self.lists=[];
	      			parasList.forEach(function(item,index){
	      				self.lists.push(item);
	      			})
	      		})
	      		.catch(function(response){
	      			console.log("error");
	      		})
			},
			details(list,index){//参数详情
				let self = this;
				console.log(list,index);
				localStorage.setItem('parasList',JSON.stringify(list));
				self.$router.go('/ServeParaDetails');
			},
			finish(data){//参数管理页面
	        	let self = this;
	            console.log(data)
	        },
	        backWay(data){
	        	let self = this;
	        	console.log(self.pathWay)
	        	self.$router.back(self.pathWay.path);
	        	// self.$router.back('/OpenService');
	            console.log(data)
	        },
	        createQRcode(){//生成二维码页面
	        	let self = this;
	        	self.$router.go('/GenerateQRcode')
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
	#page_box .weui-cell {
		padding: 1px 15px;
	}
</style>
<style>
	.tab{
		margin-top: 92px;
	}
</style>